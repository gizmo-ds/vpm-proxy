export function get_asset_url(ghproxy: string, asset: string): string {
  if (ghproxy === '') return asset;

  const url = new URL(ghproxy);
  const asset_url = new URL(asset);
  if (
    !(
      (asset_url.hostname === 'github.com' &&
        (asset_url.pathname.includes('releases/download') ||
          asset_url.pathname.includes('/archive/'))) ||
      asset_url.hostname === 'raw.githubusercontent.com'
    )
  )
    return asset;

  let pathname = url.pathname;
  if (pathname.endsWith('/')) pathname.slice(0, -1);
  pathname += new URL(asset).pathname;
  return url.origin + pathname;
}

export function is_set(...s: string[]): boolean {
  if (!s) return false;
  return s.reduce((a, b) => (!a ? false : b && b.length > 0), true);
}

export function is_deno() {
  //@ts-ignore
  return typeof Deno !== 'undefined';
}
