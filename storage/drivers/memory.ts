import { defineDriver } from 'unstorage';

const DRIVER_NAME = 'memory';

export const customMemoryDriver = defineDriver<void>(() => {
  const data = new Map<string, any>();
  return {
    name: DRIVER_NAME,
    options: {},
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value, opt) {
      data.set(key, value);
      if (opt?.ttl) setTimeout(() => data.delete(key), opt.ttl * 1000);
    },
    setItemRaw(key, value, opt) {
      data.set(key, value);
      if (opt?.ttl) setTimeout(() => data.delete(key), opt.ttl * 1000);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return Array.from(data.keys());
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
