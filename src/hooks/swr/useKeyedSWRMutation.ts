import type { KeyedEndpoint } from "../../core";
import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from "swr/mutation";

export function useKeyedSWRMutation<T extends KeyedEndpoint<(arg: any) => any>>(
  endo: T,
  options?: SWRMutationConfiguration<
    Awaited<ReturnType<T>>,
    any,
    any,
    Parameters<T>[0]
  >
): SWRMutationResponse<Awaited<ReturnType<T>>, any, any, Parameters<T>[0]> {
  return useSWRMutation(
    endo.$key,
    (_: any, { arg }: { arg: Parameters<T>[0] }) =>
      endo(arg as Parameters<T>[0]),
    options
  );
}
