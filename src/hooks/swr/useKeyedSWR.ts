import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import { type KeyedEndpoint } from "../../core";

export function useKeyedSWR<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endo: T,
  params: Parameters<T>,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

export function useKeyedSWR<T extends KeyedEndpoint<(arg: any) => any>>(
  endo: T,
  param: Parameters<T>[0],
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

export function useKeyedSWR<T extends KeyedEndpoint<() => any>>(
  endo: T,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

export function useKeyedSWR<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endo: T,
  params:
    | Parameters<T>
    | Parameters<T>[0]
    | SWRConfiguration<Awaited<ReturnType<T>>>,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
) {
  let _options: SWRConfiguration<Awaited<ReturnType<T>>> | undefined;
  let _params: Parameters<T>;

  if (endo.length === 0) {
    _params = [] as unknown as Parameters<T>;
  } else if (endo.length === 1) {
    _params = params as Parameters<T>[0] as Parameters<T>;
  } else {
    _params = params as Parameters<T>;
  }

  if (endo.length === 0) {
    _options = params as SWRConfiguration<Awaited<ReturnType<T>>>;
  } else {
    _options = options;
  }
  let result = useSWR(
    [endo.$key, ..._params],
    (...keys) => endo(...(keys.slice(1) as Parameters<T>)),
    _options
  );
  return result;
}
