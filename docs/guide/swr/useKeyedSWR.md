# `useKeyedSWR`

`useKeyedSWR` is a React Hook built on top of `useSWR`, specifically designed to work with functions defined by `keyed-query` that have bound keys. It automatically extracts the `$key` from the function and uses the passed parameters as part of the key, simplifying the usage of SWR.

## Import

```typescript
import { useKeyedSWR } from "keyed-query/hooks/swr";
```

## Parameters

| Parameter          | Type               | Required | Description                                                                  |
| ------------------ | ------------------ | -------- | ---------------------------------------------------------------------------- |
| `endpoint`         | `KeyedEndpoint`    | Yes      | A function created via `defineKeyed`, which has the `$key` property          |
| `params` / `param` | `Parameters<T>`    | No\*     | The arguments to pass to the `endpoint` function (as a list or single value) |
| `options`          | `SWRConfiguration` | No       | Configuration options passed directly to `useSWR`                            |

> \* When the `endpoint` function takes no parameters, the second argument is treated as `options`.

## Return Value

Returns the standard SWR response object, including:

- `data`: The data returned upon successful request
- `error`: Error information if the request fails
- `isLoading`: Whether data is currently being loaded
- `isValidating`: Whether revalidation is in progress
- `mutate`: Method to manually trigger data updates

- [SWR Official Documentation](https://swr.vercel.app/) - Learn more about SWR configuration options

## Usage Examples

### 1. Function Without Parameters

```typescript
const api = {
  getUserList: defineKeyed("users.list", () => request.get("/api/users")),
};

// No arguments needed when calling
const { data, isLoading } = useKeyedSWR(api.getUserList);
```

### 2. Function With a Single Parameter

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) =>
    request.get(`/api/users/${id}`)
  ),
};

// Pass a single argument
const { data, isLoading } = useKeyedSWR(api.getUser, "123");
```

### 3. Function With Multiple Parameters

```typescript
const api = {
  searchUsers: defineKeyed("users.search", (name: string, age: number) =>
    request.get(`/api/users?name=${name}&age=${age}`)
  ),
};

// Pass multiple arguments as an array
const { data, isLoading } = useKeyedSWR(api.searchUsers, ["john", 25]);
```

### 4. With Configuration Options

```typescript
const { data, isLoading } = useKeyedSWR(api.getUser, "123", {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
});
```

---

## Notes

1. **Parameter Handling**: `useKeyedSWR` automatically determines how to interpret the parameter(s) based on the number of arguments expected by the `endpoint` function.
2. **Key Generation**: The final key passed to `useSWR` is `[endpoint.$key, ...params]`.
3. **Type Safety**: Full TypeScript support with accurate type inference for return values and parameters.

## Function Signatures

```typescript
function useKeyedSWR<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endpoint: T,
  params: Parameters<T>,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

function useKeyedSWR<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  param: Parameters<T>[0],
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

function useKeyedSWR<T extends KeyedEndpoint<() => any>>(
  endpoint: T,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;
```
