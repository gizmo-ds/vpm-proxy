import { defineDriver, TransactionOptions } from 'unstorage';
import { DenoGlobal, DenoKv } from '@/types/deno-kv';

declare global {
  const Deno: DenoGlobal;
}

const DRIVER_NAME = 'deno-kv';

export const denoKVDriver = defineDriver<void>(() => {
  let _kv: DenoKv | undefined;

  const kv = async () => {
    if (!_kv) _kv = await Deno.openKv();
    return _kv;
  };

  async function getKeys() {
    return kv()
      .then(kv => kv.list({ prefix: [] }))
      .then(async entries => {
        let keys: string[] = [];
        for await (const entry of entries) keys.push(entry.key[0].toString());
        return keys;
      });
  }
  async function get<T>(key: string) {
    return kv().then(kv => kv.get<T>([key]));
  }
  async function getItem<T>(key: string) {
    return (await get(key)).value;
  }
  async function setItem(key: string, value: any, opt: TransactionOptions) {
    return kv()
      .then(kv => kv.set([key], value, { expireIn: opt?.ttl * 1000 }))
      .then(() => void 0);
  }

  return {
    name: DRIVER_NAME,
    options: {},
    hasItem: (key: string) => get(key).then(res => res.versionstamp !== null),
    getItem,
    getItemRaw: getItem,
    setItem,
    setItemRaw: setItem,
    removeItem: (key: string) => kv().then(kv => kv.delete([key])),
    getKeys,
    clear: () => getKeys().then(keys => kv().then(kv => kv.delete(keys))),
    dispose: () => kv().then(kv => kv.close())
  };
});
