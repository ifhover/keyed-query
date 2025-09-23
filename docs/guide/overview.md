# 概述

`keyed-query` 是一个用于为函数绑定 `$key` 属性的轻量级库，旨在简化在使用 `SWR` 或 `TanStack Query`（React Query）等数据获取库时对请求 key 的管理。

通过 `keyed-query`，你可以将 key 与对应的请求函数绑定在一起，从而避免手动维护 key 字符串或额外封装 hook，使代码更加简洁、易维护。

## 现有问题

在实际项目中，通常会将每个 API 请求封装成独立的方法以便统一管理和获得良好的类型支持：

```typescript
export const userApi = {
  get(id: string) {
    return request.get<User>(`api/user/${id}`);
  },
};
```

当我们引入 `SWR` 或 `TanStack Query` 来管理异步状态时，这些库要求我们为每个请求提供一个唯一的 key（例如 `useSWR` 的第一个参数）以实现缓存共享等功能：

```typescript
const { data, isLoading } = useSWR(["user.get", id], () => userApi.get(id));
```

然而，如何组织和管理这些 key 成为了一个常见痛点。常见的两种做法都存在一定问题：

### 方法一：为每个 API 封装专用 Hook

```typescript
export function useUserGet(
  id: string,
  options?: SWRConfiguration<Awaited<ReturnType<typeof userApi.get>>>
) {
  return useSWR(["user.get", id], () => userApi.get(id), options);
}
```

> 缺点：需要额外编写大量重复的 Hook，维护成本高。

### 方法二：单独管理 key 映射对象

```typescript
export const userApiKeys = {
  get: (id: string) => ["user.get", id],
};
```

> 缺点：key 和请求逻辑分离，容易造成不一致，且使用时仍需手动拼接 key。

## 解决方案

为此，我们开发了 `keyed-query`，它允许你在定义请求函数的同时就为其绑定一个 key：

```typescript
export const userApi = {
  get: defineKeyed("user.get", (id: string) => {
    return request.get<User>(`api/user/${id}`);
  }),
};
```

之后，通过 `useKeyedSWR` 使用该函数时可以直接使用其定义时绑定的 key：

```typescript
import { useKeyedSWR } from "keyed-query/hooks/swr";

function Profile({ id }: { id: string }) {
  const { data, isLoading } = useKeyedSWR(userApi.get, id);
}
```

## `defineKeyed` 做了什么？

`defineKeyed(key, fn)` 的返回值[KeyedEndpoint ](/KeyedEndpoint)类型是一个普通的函数，但它额外附加了两个属性：

- `$key`: 表示绑定的 key 字符串。
- `$getKey(...args)`: 接收函数参数并返回完整的 key 数组。

示例：

```typescript
userApi.get(1);

// --------

// 等价于直接调用原始函数
((id: string) => {
  return request.get<User>(`api/user/${id}`);
})(1);

// --------

userApi.get.$key; // "user.get"
userApi.get.$getKey(1); // ["user.get", 1]
```

> 如果未显式传入 key（即只传入函数），则 `$key` 会被自动设置为一个随机生成的 UUID 字符串。

## 🔧 总结

借助 `keyed-query`，你可以：

- 在函数定义阶段就完成 key 的绑定；
- 避免冗余的 Hook 包装；
- 提高 key 的可维护性和复用性；
- 更好地配合现代数据获取库如 SWR 和 TanStack Query。
