# 其他说明

## 灵活使用和自定义

`keyed-query` 提供的 Hooks（如 `useKeyedSWR`、`useKeyedSWRMutation` 等）是为了帮助你快速上手而设计的，但它们并不是唯一的选择。我们鼓励你根据项目需求进行自定义封装。

### 自行封装 Hook

基于 [`KeyedEndpoint`](./core/KeyedEndpoint) 类型和核心 API，你可以轻松创建符合项目需求的自定义 Hooks：

```typescript
import { useSWRConfig } from "swr";
import type { KeyedEndpoint } from "keyed-query";

// 自定义 Hook 示例
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

### 重命名导出

如果你对提供的 Hook 命名不满意，可以轻松地重新导出并重命名：

```typescript
// hooks/custom.ts
export { useKeyedSWR as useSWRWithKey } from "keyed-query/hooks/swr";
export { useKeyedSWRMutation as useMutationWithKey } from "keyed-query/hooks/swr";
export { useKeyedQuery as useTanstackQueryWithKey } from "keyed-query/hooks/tanstack-query";
```

然后在项目中使用你偏好的命名：

```typescript
import { useSWRWithKey } from "./hooks/custom";

const { data, isLoading } = useSWRWithKey(userApi.get, userId);
```

## 设计理念

### 开放性

我们相信最好的工具应该是开放和可扩展的。`keyed-query` 核心只提供最基础的 key 绑定功能，具体的集成实现留给用户根据实际需求决定。

### 最小侵入

核心 API 设计简单明了，不会强制你使用特定的数据获取库或模式。你可以选择最适合项目的技术栈。

### 渐进式采用

你可以从使用提供的 Hooks 开始，随着项目复杂度增加，逐步迁移到自定义实现，而无需重构核心的 key 管理逻辑。

## 常见问题

### Q: 我的项目使用了其他数据获取库，还能使用 keyed-query 吗？

A: 当然可以！`keyed-query` 的核心只是为函数绑定 key，你可以基于 [`KeyedEndpoint`](./core/KeyedEndpoint) 类型创建适配任何数据获取库的集成。

### Q: 提供的 Hooks 功能不够用怎么办？

A: 直接查看核心 API 文档，基于 `endpoint.$key` 和 `endpoint.$getKey()` 自行封装更适合的 Hooks。

### Q: 我想添加全局错误处理，应该如何做？

A: 使用 `SWR`、`TanstackQuery` 自带的错误处理功能 或 创建自定义 Hook 包装提供的 Hooks，在其中添加统一的错误处理逻辑。

## 下一步

- 查看 [核心 API 文档](./core/KeyedEndpoint) 了解更多自定义可能性
- 参考 [SWR 集成](./swr/useKeyedSWR) 了解如何创建自定义集成
- 探索 [TanStack Query 集成](./tanstack-query/useKeyedQuery) 获取更多灵感

记住，`keyed-query` 是一个工具箱，而不是一套固定的规则。根据你的项目需求自由组合和扩展！
