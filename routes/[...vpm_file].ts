import { VPMPackageManifest } from '@/types/vpm';
import { storage } from '@/storage';

const cache_ttl = process.env.CACHE_TTL
  ? parseInt(process.env.CACHE_TTL)
  : 60 * 30; // default 30 mins

export default defineEventHandler(async event => {
  const request = event.node.req;
  const response = event.node.res;
  const url = new URL(request.url, `http://${request.headers.host}`);

  let ghproxy =
    url.searchParams.get('ghproxy') ??
    (request.headers['x-ghproxy'] as string | undefined) ??
    process.env.DEFAULT_GHPROXY;
  if (!ghproxy.startsWith('https://')) ghproxy = 'https://' + ghproxy;

  let vpm_file = event.context.params.vpm_file;
  if (!vpm_file.startsWith('https://')) vpm_file = 'https://' + vpm_file;

  let vpm = await storage
    .getItem<VPMPackageManifest>(vpm_file)
    .catch(() => undefined);
  response.setHeader('vpm-cache-status', vpm ? 'HIT' : 'MISS');
  response.setHeader('vpm-cache-ttl', cache_ttl);
  if (!vpm) {
    vpm = await fetch(vpm_file).then(resp => resp.json());
    await storage.setItem(vpm_file, vpm, { ttl: cache_ttl });
  }

  for (const pkg_name in vpm.packages) {
    const pkg = vpm.packages[pkg_name];
    const versions = pkg.versions;

    for (const version in versions)
      versions[version].url = get_asset_url(ghproxy, versions[version].url);
  }
  return vpm;
});