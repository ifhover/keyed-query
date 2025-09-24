# Additional Notes

## Flexible Usage and Customization

The hooks provided by `keyed-query` (such as `useKeyedSWR`, `useKeyedSWRMutation`, etc.) are designed to help you get started quickly, but they are not your only option. We encourage you to create custom wrappers tailored to your project's needs.

### Creating Custom Hooks

Based on the [`KeyedEndpoint`](./core/KeyedEndpoint) type and core APIs, you can easily build custom hooks that fit your requirements:

```typescript
import { useSWRConfig } from "swr";
import type { KeyedEndpoint } from "keyed-query";

// Example of a custom hook
export function useCustomKeyedQuery<
  T extends KeyedEndpoint<(...args: any[]) => any>
>(endpoint: T, ...params: Parameters<T>) {
  const { mutate } = useSWRConfig();

  return {
    query: () => useSWR(endpoint.$getKey(...params), () => endpoint(...params)),
    mutate: (data: Awaited<ReturnType<T>>) =>
      mutate(endpoint.$getKey(...params), data),
  };
}
```

### Re-export with Renaming

If you're not satisfied with the default hook names, you can easily re-export them under new names:

```typescript
// hooks/custom.ts
export { useKeyedSWR as useSWRWithKey } from "keyed-query/hooks/swr";
export { useKeyedSWRMutation as useMutationWithKey } from "keyed-query/hooks/swr";
export { useKeyedQuery as useTanstackQueryWithKey } from "keyed-query/hooks/tanstack-query";
```

Then use your preferred names throughout your project:

```typescript
import { useSWRWithKey } from "./hooks/custom";

const { data, isLoading } = useSWRWithKey(userApi.get, userId);
```

## Design Principles

### Openness

We believe the best tools should be open and extensible. The core of `keyed-query` provides only the essential key-binding functionality, leaving integration details up to users based on their specific needs.

### Minimal Intrusiveness

The core API is designed to be simple and unobtrusive. It does not force you to adopt any particular data-fetching library or pattern. You remain free to choose the tech stack that best fits your project.

### Progressive Adoption

You can start by using the provided hooks, and as your project grows in complexity, gradually migrate to custom implementations—without needing to refactor your core key management logic.

## Frequently Asked Questions

### Q: Can I use `keyed-query` with other data-fetching libraries?

A: Absolutely! The core of `keyed-query` simply binds keys to functions. You can leverage the [`KeyedEndpoint`](./core/KeyedEndpoint) type to integrate with any data-fetching library of your choice.

### Q: What if the provided hooks don't meet my needs?

A: Refer to the core API documentation and use `endpoint.$key` and `endpoint.$getKey()` to build your own tailored hooks.

### Q: How can I add global error handling?

A: Use the built-in error handling mechanisms of `SWR` or `Tanstack Query`, or create a custom wrapper around the provided hooks to include unified error handling logic.

## Next Steps

- Check out the [Core API Documentation](./core/KeyedEndpoint) to explore more customization options
- Review the [SWR Integration Guide](./swr/useKeyedSWR) to learn how to build custom integrations
- Explore the [TanStack Query Integration Guide](./tanstack-query/useKeyedQuery) for further inspiration

Remember, `keyed-query` is a toolbox, not a rigid framework. Feel free to mix, extend, and adapt it according to your project’s unique requirements!
