# `useKeyedSWRMutation`

`useKeyedSWRMutation` is a React Hook built on top of `useSWRMutation`, specifically designed to work with functions defined by `keyed-query` that have bound keys. It automatically extracts the `$key` from the function and provides type-safe parameter passing, simplifying the usage of SWR mutations.

## Import

```typescript
import { useKeyedSWRMutation } from "keyed-query/hooks/swr-mutation";
```

## Parameters

| Parameter  | Type                               | Required | Description                                                                    |
| ---------- | ---------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `endpoint` | `KeyedEndpoint<(arg: any) => any>` | Yes      | A single-parameter function created via `defineKeyed` with the `$key` property |
| `options`  | `SWRMutationConfiguration`         | No       | Configuration options passed directly to `useSWRMutation`                      |

## Return Value

Returns the standard response object from `useSWRMutation`, including:

- `data`: Data returned upon successful request
- `error`: Error information if the request fails
- `isMutating`: Whether a mutation is currently in progress
- `trigger`: Function to trigger the mutation; accepts arguments and returns a Promise
- `reset`: Method to reset the mutation state

- [SWR Mutation Official Documentation](https://swr.vercel.app/docs/mutation) - Learn more about mutation return values

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
  const { trigger, isMutating, data, error } = useKeyedSWRMutation(
    api.updateUser
  );

  const handleUpdate = async (userData: UserUpdateData) => {
    try {
      const result = await trigger(userData);
      console.log("Update succeeded:", result);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleUpdate({ name: "John" })}
        disabled={isMutating}
      >
        {isMutating ? "Updating..." : "Update User"}
      </button>
    </div>
  );
}
```

### 2. With Configuration Options

```typescript
const { trigger, isMutating } = useKeyedSWRMutation(api.updateUser, {
  onSuccess: (data) => {
    console.log("Update successful:", data);
    // You can update related cache here
  },
  onError: (error) => {
    console.error("Update failed:", error);
  },
  revalidate: true, // Revalidate related data after update
});
```

### 3. Coordinating with Other SWR Data

```typescript
const { data: user } = useKeyedSWR(api.getUser, userId);
const { trigger: updateUser } = useKeyedSWRMutation(api.updateUser);

// After `updateUser` succeeds, manually revalidate the `getUser` data
const handleUpdate = async (userData: UserUpdateData) => {
  await updateUser(userData);
  // Manually re-fetch user data
  mutate(api.getUser.$getKey(userId));
};
```

## Notes

1. **Parameter Limitation**: The current implementation only supports single-parameter functions—i.e., `endpoint` must be a function that takes exactly one argument.
2. **Key Generation**: Uses `endpoint.$key` as the mutation key.
3. **Parameter Passing**: Arguments passed via the `trigger` function are forwarded as `arg` to the original fetcher function.
4. **Type Safety**: Full TypeScript support with accurate type inference for return values and parameters.

## Configuration Options

The `options` parameter supports all configuration options available in `useSWRMutation`:

| Option            | Type                            | Description                                                        |
| ----------------- | ------------------------------- | ------------------------------------------------------------------ |
| `onSuccess`       | `(data, key, config) => void`   | Callback when the request succeeds                                 |
| `onError`         | `(err, key, config) => void`    | Callback when the request fails                                    |
| `revalidate`      | `boolean`                       | Whether to revalidate related data after success (default: `true`) |
| `throwOnError`    | `boolean`                       | Whether to throw an error when mutation fails (default: `true`)    |
| `optimisticData`  | `Data \| (currentData) => Data` | Data for optimistic UI updates                                     |
| `rollbackOnError` | `boolean`                       | Whether to rollback optimistic updates on error (default: `true`)  |

- [SWR Mutation Official Documentation](https://swr.vercel.app/docs/mutation) - Learn more about mutation configuration options

## Function Signature

```typescript
function useKeyedSWRMutation<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  options?: SWRMutationConfiguration<
    Awaited<ReturnType<T>>,
    any,
    any,
    Parameters<T>[0]
  >
): SWRMutationResponse<Awaited<ReturnType<T>>, any, any, Parameters<T>[0]>;
```
