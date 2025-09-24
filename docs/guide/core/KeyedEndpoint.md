# `KeyedEndpoint<T>`

`KeyedEndpoint` is a type alias that represents a function type enhanced with key-related properties.

## Type Definition

```typescript
type KeyedEndpoint<T extends (...args: any) => any> = T & {
  $key: string;
  $getKey(...p: Parameters<T>): [string, ...Parameters<T>];
};
```

## Properties

| Property  | Type       | Description                                                           |
| --------- | ---------- | --------------------------------------------------------------------- |
| `$key`    | `string`   | The bound unique identifier                                           |
| `$getKey` | `Function` | A method that takes function arguments and returns the full key array |

## Usage Example

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) => {
    return request.get<User>(`/api/users/${id}`);
  }),
  createUser: defineKeyed("users.create", (data: UserData) => {
    return request.post<User>("/api/users", data);
  }),
};

// Type-safe access
api.getUser.$key; // "users.get"
api.createUser.$getKey({ name: "John" }); // ["users.create", { name: "John" }]
```

## Design Principles

### 1. Zero Intrusiveness

The function returned by `defineKeyed` remains the original function—it can be called directly like any regular function, preserving existing usage patterns.

### 2. Flexible Key Management

Supports both explicitly defined meaningful keys and auto-generated UUIDs, accommodating various use cases.

### 3. Full Type Safety

Leverages TypeScript's generic system to automatically infer parameter and return types, ensuring complete type safety.

### 4. Easy Integration

Provides a consistent integration interface for various data-fetching libraries through the `$key` and `$getKey` properties.

## Best Practices

### 1. Centralized API Management

```typescript
// api/user.ts
export const userApi = {
  get: defineKeyed("user.get", (id: string) => {
    return request.get<User>(`/api/users/${id}`);
  }),
  list: defineKeyed("user.list", () => {
    return request.get<User[]>("/api/users");
  }),
  update: defineKeyed("user.update", (id: string, data: Partial<User>) => {
    return request.put<User>(`/api/users/${id}`, data);
  }),
};
```

### 2. Semantic Key Naming

It is recommended to use a `module.action` naming convention (e.g., `'user.get'`, `'post.create'`) to improve readability.

### 3. Integration with Hooks

```typescript
// With SWR
const { data } = useKeyedSWR(userApi.get, "123");

// With TanStack Query
const { data } = useKeyedQuery(userApi.list);
```

## Notes

1. **Parameter Passing**: The `$getKey` method includes all arguments unmodified in the returned array.
2. **Key Uniqueness**: Explicitly specified keys should remain unique across the application.
3. **Type Constraints**: Only function types are supported as parameters; other types are not allowed.
4. **Performance Consideration**: `defineKeyed` should be called during module initialization—avoid recreating keyed functions during rendering cycles.
