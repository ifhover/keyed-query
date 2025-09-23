import {
  useQuery,
  type QueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { type KeyedEndpoint } from "../../core";

export function useKeyedQuery<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endo: T,
  args: Parameters<T>,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

export function useKeyedQuery<T extends KeyedEndpoint<(arg: any) => any>>(
  endo: T,
  arg: Parameters<T>[0],
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

export function useKeyedQuery<T extends KeyedEndpoint<() => any>>(
  endo: T,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

export function useKeyedQuery<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endo: T,
  params:
    | Parameters<T>
    | Parameters<T>[0]
    | QueryOptions<Awaited<ReturnType<T>>, Error>,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error> {
  let _options: QueryOptions<Awaited<ReturnType<T>>, Error> | undefined;
  let _params: Parameters<T>;

  if (endo.length === 0) {
    _params = [] as unknown as Parameters<T>;
  } else if (endo.length === 1) {
    _params = params as Parameters<T>[0];
  } else {
    _params = params as Parameters<T>;
  }

  if (endo.length === 0) {
    _options = params as QueryOptions<Awaited<ReturnType<T>>, Error>;
  } else {
    _options = options;
  }
  return useQuery({
    queryKey: endo.$getKey(..._params),
    queryFn: ({ queryKey }) => endo(...(queryKey.slice(1) as Parameters<T>)),
    ..._options,
  });
}
