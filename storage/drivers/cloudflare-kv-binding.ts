import { defineDriver, TransactionOptions } from 'unstorage';
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding';
import type { KVOptions } from 'unstorage/drivers/cloudflare-kv-binding';
//@ts-ignore
import { createError, joinKeys } from 'unstorage/drivers/utils/index';

const DRIVER_NAME = 'cloudflare-kv-binding';

export const customCloudflareKVBindingDriver = defineDriver<KVOptions>(opts => {
  const r = (key: string = '') => (opts.base ? joinKeys(opts.base, key) : key);

  const driver = cloudflareKVBindingDriver(opts);
  driver.setItem = async (key: string, value: any, opt: TransactionOptions) => {
    if (opt?.ttl) setTimeout(() => driver.removeItem(key), opt.ttl * 1000);
    key = r(key);
    const binding = getBinding(opts.binding);
    return binding.put(key, value, {
      expiration: Math.floor(Date.now() / 1000) + opt.ttl
    });
  };
  return driver;
});

// https://github.com/unjs/unstorage/blob/8dd7886a5d69c303da488f6aaf9fb708c9d76ddc/src/drivers/cloudflare-kv-binding.ts#L60
function getBinding(binding: KVNamespace | string = 'STORAGE') {
  let bindingName = '[binding]';

  if (typeof binding === 'string') {
    bindingName = binding;
    binding = ((globalThis as any)[bindingName] ||
      (globalThis as any).__env__?.[bindingName]) as KVNamespace;
  }

  if (!binding) {
    throw createError(
      DRIVER_NAME,
      `Invalid binding \`${bindingName}\`: \`${binding}\``
    );
  }

  for (const key of ['get', 'put', 'delete']) {
    if (!(key in binding)) {
      throw createError(
        DRIVER_NAME,
        `Invalid binding \`${bindingName}\`: \`${key}\` key is missing`
      );
    }
  }

  return binding;
}
