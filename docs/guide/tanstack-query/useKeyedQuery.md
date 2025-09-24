# `useKeyedQuery`

`useKeyedQuery` is a React Hook built on top of TanStack Query's `useQuery`, specifically designed to work with functions defined by `keyed-query` that have bound keys. It automatically extracts the `$key` and `$getKey` methods from the function to generate a complete query key, simplifying the usage of TanStack Query.

## Import

```typescript
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";
```

## Parameters

| Parameter      | Type            | Required | Description                                                                  |
| -------------- | --------------- | -------- | ---------------------------------------------------------------------------- |
| `endpoint`     | `KeyedEndpoint` | Yes      | A function created via `defineKeyed`, which has the `$key` property          |
| `args` / `arg` | `Parameters<T>` | No\*     | The arguments to pass to the `endpoint` function (as a list or single value) |
| `options`      | `QueryOptions`  | No       | Configuration options passed directly to `useQuery`                          |

> \* When the `endpoint` function takes no parameters, the second argument is treated as `options`.

## Return Value

Returns the standard response object from `useQuery`, including:

- `data`: Data returned upon successful request
- `error`: Error information if the request fails
- `isLoading`: Whether data is currently being loaded
- `isFetching`: Whether data is being fetched (including background revalidation)
- `isSuccess`: Whether the request succeeded
- `isError`: Whether the request failed
- `refetch`: Method to manually refetch data
- [TanStack Query Official Documentation](https://tanstack.com/query) - Learn more about query return values

## Usage Examples

### 1. Function Without Parameters

```typescript
const api = {
  getUserList: defineKeyed("users.list", () => request.get("/api/users")),
};

// No arguments needed when calling
const { data, isLoading } = useKeyedQuery(api.getUserList);
```

### 2. Function With a Single Parameter

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) =>
    request.get(`/api/users/${id}`)
  ),
};

// Pass a single argument
const { data, isLoading } = useKeyedQuery(api.getUser, "123");
```

### 3. Function With Multiple Parameters

```typescript
const api = {
  searchUsers: defineKeyed("users.search", (name: string, age: number) =>
    request.get(`/api/users?name=${name}&age=${age}`)
  ),
};

// Pass multiple arguments as an array
const { data, isLoading } = useKeyedQuery(api.searchUsers, ["john", 25]);
```

### 4. With Configuration Options

```typescript
const { data, isLoading } = useKeyedQuery(api.getUser, "123", {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
});
```

## Notes

1. **Parameter Handling**: `useKeyedQuery` automatically determines how to interpret the parameter(s) based on the number of arguments expected by the `endpoint` function.
2. **Key Generation**: Uses `endpoint.$getKey(...params)` to generate the full query key.
3. **Type Safety**: Full TypeScript support with accurate type inference for return values and parameters.

## Function Signatures

```typescript
function useKeyedQuery<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endpoint: T,
  args: Parameters<T>,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

function useKeyedQuery<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  arg: Parameters<T>[0],
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

function useKeyedQuery<T extends KeyedEndpoint<() => any>>(
  endpoint: T,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;
```
