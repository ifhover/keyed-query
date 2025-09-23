import {
  useMutation,
  type MutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { KeyedEndpoint } from "../../core";

export function useKeyedMutation<T extends KeyedEndpoint<(arg: any) => any>>(
  endo: T,
  options?: MutationOptions<Awaited<ReturnType<T>>, Error, Parameters<T>[0]>
): UseMutationResult<Awaited<ReturnType<T>>, Error, Parameters<T>[0]> {
  return useMutation({
    mutationFn: (arg: Parameters<T>[0]) => endo(arg as Parameters<T>[0]),
    ...options,
  });
}
