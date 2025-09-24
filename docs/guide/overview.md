# Overview

`keyed-query` is a lightweight library that binds a `$key` property to functions, designed to simplify the management of request keys when using data-fetching libraries such as `SWR` or `TanStack Query` (React Query).

With `keyed-query`, you can bind a key directly to its corresponding request function, eliminating the need to manually maintain key strings or create additional custom hooks. This results in cleaner, more maintainable code.

## Existing Problems

In real-world projects, it's common practice to encapsulate each API request into a separate method for better organization and improved type support:

```typescript
export const userApi = {
  get(id: string) {
    return request.get<User>(`api/user/${id}`);
  },
};
```

When integrating state management libraries like `SWR` or `TanStack Query` for handling asynchronous data, these libraries require a unique key (e.g., the first argument of `useSWR`) for each request to enable features such as cache sharing:

```typescript
const { data, isLoading } = useSWR(["user.get", id], () => userApi.get(id));
```

However, managing these keys consistently becomes a common pain point. Two typical approaches both come with significant drawbacks:

### Approach 1: Create Dedicated Hooks for Each API

```typescript
export function useUserGet(
  id: string,
  options?: SWRConfiguration<Awaited<ReturnType<typeof userApi.get>>>
) {
  return useSWR(["user.get", id], () => userApi.get(id), options);
}
```

> **Drawback**: Requires writing numerous repetitive hooks, leading to high maintenance costs.

### Approach 2: Manage Keys via a Separate Mapping Object

```typescript
export const userApiKeys = {
  get: (id: string) => ["user.get", id],
};
```

> **Drawback**: Keys are decoupled from the actual request logic, increasing the risk of inconsistency. Additionally, keys still need to be manually composed during usage.

## Solution

To address this, we developed `keyed-query`, which allows you to bind a key to a request function at the time of definition:

```typescript
export const userApi = {
  get: defineKeyed("user.get", (id: string) => {
    return request.get<User>(`api/user/${id}`);
  }),
};
```

Later, when using `useKeyedSWR`, you can automatically leverage the pre-bound key:

```typescript
import { useKeyedSWR } from "keyed-query/hooks/swr";

function Profile({ id }: { id: string }) {
  const { data, isLoading } = useKeyedSWR(userApi.get, id);
}
```

## What Does `defineKeyed` Do?

The return value of `defineKeyed(key, fn)` is of type [KeyedEndpoint](./core/KeyedEndpoint). It behaves like a regular function but comes with two additional properties:

- `$key`: The bound key string.
- `$getKey(...args)`: Accepts the function’s arguments and returns the full key array.

Example:

```typescript
userApi.get(1);

// --------

// Equivalent to calling the original function directly
((id: string) => {
  return request.get<User>(`api/user/${id}`);
})(1);

// --------

userApi.get.$key; // "user.get"
userApi.get.$getKey(1); // ["user.get", 1]
```

> If no explicit key is provided (i.e., only the function is passed), `$key` will automatically be set to a randomly generated UUID string.

## 🔧 Summary

With `keyed-query`, you can:

- Bind keys at the function definition stage;
- Avoid redundant hook wrappers;
- Improve key maintainability and reusability;
- Work more seamlessly with modern data-fetching libraries like SWR and TanStack Query.
