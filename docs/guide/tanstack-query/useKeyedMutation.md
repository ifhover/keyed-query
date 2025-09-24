# `useKeyedMutation`

`useKeyedMutation` is a React Hook built on top of TanStack Query's `useMutation`, specifically designed to work with functions defined by `keyed-query` that have bound keys. It automatically uses the function's `$key` as the mutation key and provides type-safe parameter passing, simplifying the usage of TanStack Query mutations.

## Import

```typescript
import { useKeyedMutation } from "keyed-query/hooks/tanstack-query";
```

## Parameters

| Parameter  | Type                               | Required | Description                                                                          |
| ---------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `endpoint` | `KeyedEndpoint<(arg: any) => any>` | Yes      | A single-parameter function created via `defineKeyed`, which has the `$key` property |
| `options`  | `MutationOptions`                  | No       | Configuration options passed directly to `useMutation`                               |

## Return Value

Returns the standard response object from `useMutation`, including:

- `data`: Data returned upon successful request
- `error`: Error information if the request fails
- `isPending`: Whether a mutation is currently in progress
- `isSuccess`: Whether the request succeeded
- `isError`: Whether the request failed
- `mutate`: Function to trigger the mutation; accepts arguments (does not return a Promise)
- `mutateAsync`: Asynchronous function to trigger the mutation; returns a Promise
- `reset`: Method to reset the mutation state
- [TanStack Query Official Documentation](https://tanstack.com/query) - Learn more about mutation return values

## Usage Examples

### 1. Basic Usage

```typescript
const api = {
  updateUser: defineKeyed("users.update", (userData: UserUpdateData) =>
    request.put("/api/users", userData)
  ),
};

// Using in a component
function UserProfile() {
  const { mutate, isPending, data, error } = useKeyedMutation(api.updateUser);

  const handleUpdate = async (userData: UserUpdateData) => {
    try {
      await mutate(userData);
      console.log("Update succeeded:", data);
    } catch (err) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleUpdate({ name: "John" })}
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Update User"}
      </button>
    </div>
  );
}
```

### 2. With Configuration Options

```typescript
const { mutate, isPending } = useKeyedMutation(api.updateUser, {
  onSuccess: (data, variables, context) => {
    console.log("Update successful:", data);
    // You can update related cache here
  },
  onError: (error, variables, context) => {
    console.error("Update failed:", error);
  },
  onSettled: (data, error, variables, context) => {
    console.log("Request completed");
  },
});
```

### 3. Coordinating with Other TanStack Query Data

```typescript
const { data: user } = useKeyedQuery(api.getUser, userId);
const { mutate: updateUser } = useKeyedMutation(api.updateUser);

// After `updateUser` succeeds, manually revalidate the `getUser` data
const handleUpdate = async (userData: UserUpdateData) => {
  await mutate(userData, {
    onSuccess: () => {
      // Manually refetch user data
      queryClient.invalidateQueries({ queryKey: api.getUser.$getKey(userId) });
    },
  });
};
```

## Notes

1. **Parameter Limitation**: The current implementation only supports single-parameter functions—i.e., `endpoint` must be a function that takes exactly one argument.
2. **Key Generation**: Uses `endpoint.$key` as the mutation key.
3. **Parameter Passing**: Arguments passed via `mutate` or `mutateAsync` are forwarded to the original fetcher function.
4. **Type Safety**: Full TypeScript support with accurate type inference for return values and parameters.

## Configuration Options

The `options` parameter supports all configuration options available in `useMutation`:

| Option       | Type                                         | Description                                                     |
| ------------ | -------------------------------------------- | --------------------------------------------------------------- |
| `mutationFn` | `(variables) => Promise<T>`                  | The actual async function (automatically set by the hook)       |
| `onMutate`   | `(variables) => Promise<Context> \| Context` | Callback before mutation starts (useful for optimistic updates) |
| `onSuccess`  | `(data, variables, context) => void`         | Callback when the request succeeds                              |
| `onError`    | `(error, variables, context) => void`        | Callback when the request fails                                 |
| `onSettled`  | `(data, error, variables, context) => void`  | Callback when the request settles (success or failure)          |
| `retry`      | `number \| boolean`                          | Number of retries on failure                                    |
| `retryDelay` | `number \| (attempt: number) => number`      | Delay between retries                                           |
| ...          |                                              |                                                                 |

- [TanStack Query Official Documentation](https://tanstack.com/query) - Learn more about mutation configuration options

## Function Signature

```typescript
function useKeyedMutation<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  options?: MutationOptions<Awaited<ReturnType<T>>, Error, Parameters<T>[0]>
): UseMutationResult<Awaited<ReturnType<T>>, Error, Parameters<T>[0]>;
```
