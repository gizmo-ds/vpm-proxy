// https://github.com/denoland/deno/blob/main/cli/tsc/dts/lib.deno.unstable.d.ts#L1855

export type DenoGlobal = {
  openKv(path?: string): Promise<DenoKv>;
};
export interface DenoKv {
  get<T = unknown>(
    key: KvKey,
    options?: { consistency?: KvConsistencyLevel }
  ): Promise<KvEntryMaybe<T>>;
  getMany<T extends readonly unknown[]>(
    keys: readonly [...{ [K in keyof T]: KvKey }],
    options?: { consistency?: KvConsistencyLevel }
  ): Promise<{ [K in keyof T]: KvEntryMaybe<T[K]> }>;
  set(
    key: KvKey,
    value: unknown,
    options?: { expireIn?: number }
  ): Promise<KvCommitResult>;
  delete(key: KvKey): Promise<void>;
  list<T = unknown>(
    selector: KvListSelector,
    options?: KvListOptions
  ): KvListIterator<T>;
  enqueue(
    value: unknown,
    options?: {
      delay?: number;
      keysIfUndelivered?: KvKey[];
      backoffSchedule?: number[];
    }
  ): Promise<KvCommitResult>;
  listenQueue(handler: (value: unknown) => Promise<void> | void): Promise<void>;
  close(): void;
  commitVersionstamp(): symbol;
}

export type KvEntryMaybe<T> =
  | KvEntry<T>
  | {
      key: KvKey;
      value: null;
      versionstamp: null;
    };

export type KvEntry<T> = { key: KvKey; value: T; versionstamp: string };
export type KvKey = readonly KvKeyPart[];
export type KvKeyPart =
  | Uint8Array
  | string
  | number
  | bigint
  | boolean
  | symbol;
export interface KvCommitResult {
  ok: true;
  versionstamp: string;
}
export interface KvListIterator<T> extends AsyncIterableIterator<KvEntry<T>> {
  get cursor(): string;
  next(): Promise<IteratorResult<KvEntry<T>, undefined>>;
  [Symbol.asyncIterator](): AsyncIterableIterator<KvEntry<T>>;
}
export interface KvListOptions {
  limit?: number;
  cursor?: string;
  reverse?: boolean;
  consistency?: KvConsistencyLevel;
  batchSize?: number;
}
export type KvConsistencyLevel = 'strong' | 'eventual';
export type KvListSelector =
  | { prefix: KvKey }
  | { prefix: KvKey; start: KvKey }
  | { prefix: KvKey; end: KvKey }
  | { start: KvKey; end: KvKey };
