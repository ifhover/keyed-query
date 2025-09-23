import { v4 } from "uuid";

export type KeyedEndpoint<T extends (...args: any) => any> = T & {
  $key: string;
  $getKey(...p: Parameters<T>): [string, ...Parameters<T>];
};

export function defineKeyed<T extends (...p: any[]) => any>(
  key: string,
  fetcher: T
): KeyedEndpoint<T>;

export function defineKeyed<T extends (...p: any[]) => any>(
  fetcher: T
): KeyedEndpoint<T>;

export function defineKeyed<T extends (...p: any[]) => any>(
  key: string | T,
  fetcher?: T
) {
  let _fetcher: T | undefined;
  let _key: string | undefined;
  if (typeof key === "string" && typeof fetcher === "function") {
    _fetcher = fetcher;
    _key = key;
  }
  if (typeof key === "function" && !fetcher) {
    _fetcher = key as T;
    _key = v4();
  }
  if (!_fetcher || !_key) {
    throw new Error("KeyedEndpoint: Invalid arguments");
  }
  return Object.assign(_fetcher, {
    $key: _key,
    $getKey: (...p: Parameters<T>) => [_key, ...p],
  }) as KeyedEndpoint<T>;
}
