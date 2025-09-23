# `useKeyedMutation`

`useKeyedMutation` 是一个基于 `TanstackQuery React`的`useMutation` 封装的 React Hook，专为配合 `keyed-query` 定义的带 key 函数而设计。它自动使用函数绑定的 `$key` 作为 mutation key，并提供类型安全的参数传递，简化了 TanStack Query Mutation 的调用方式。

## 导入

```typescript
import { useKeyedMutation } from "keyed-query/hooks/tanstack-query";
```

## 参数说明

| 参数名     | 类型                               | 必填 | 描述                                                |
| ---------- | ---------------------------------- | ---- | --------------------------------------------------- |
| `endpoint` | `KeyedEndpoint<(arg: any) => any>` | 是   | 通过 `defineKeyed` 创建的带 `$key` 属性的单参数函数 |
| `options`  | `MutationOptions`                  | 否   | 传递给 `useMutation` 的配置选项                     |

## 返回值

返回 `useMutation` 的标准响应对象，包含：

- `data`: 请求成功后的数据
- `error`: 请求失败时的错误信息
- `isPending`: 是否正在进行请求
- `isSuccess`: 请求是否成功
- `isError`: 请求是否失败
- `mutate`: 触发 mutation 的函数，接收参数并返回 Promise
- `mutateAsync`: 触发 mutation 的异步函数，返回 Promise
- `reset`: 重置状态的方法
- [TanStack Query 官方文档](https://tanstack.com/query) - 了解更多 Mutation 返回值

## 使用示例

### 1. 基本使用

```typescript
const api = {
  updateUser: defineKeyed("users.update", (userData: UserUpdateData) =>
    request.put("/api/users", userData)
  ),
};

// 在组件中使用
function UserProfile() {
  const { mutate, isPending, data, error } = useKeyedMutation(api.updateUser);

  const handleUpdate = async (userData: UserUpdateData) => {
    try {
      await mutate(userData);
      console.log("更新成功:", data);
    } catch (err) {
      console.error("更新失败:", error);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleUpdate({ name: "John" })}
        disabled={isPending}
      >
        {isPending ? "更新中..." : "更新用户"}
      </button>
    </div>
  );
}
```

### 2. 带配置选项

```typescript
const { mutate, isPending } = useKeyedMutation(api.updateUser, {
  onSuccess: (data, variables, context) => {
    console.log("更新成功:", data);
    // 可以在这里更新相关缓存
  },
  onError: (error, variables, context) => {
    console.error("更新失败:", error);
  },
  onSettled: (data, error, variables, context) => {
    console.log("请求完成");
  },
});
```

### 3. 与其他 TanStack Query 数据联动

```typescript
const { data: user } = useKeyedQuery(api.getUser, userId);
const { mutate: updateUser } = useKeyedMutation(api.updateUser);

// updateUser 成功后，可以手动重新验证 getUser 的数据
const handleUpdate = async (userData: UserUpdateData) => {
  await mutate(userData, {
    onSuccess: () => {
      // 手动重新获取用户数据
      queryClient.invalidateQueries({ queryKey: api.getUser.$getKey(userId) });
    },
  });
};
```

## 注意事项

1. **参数限制**：当前实现仅支持单参数函数，即 `endpoint` 必须是接受一个参数的函数
2. **Key 生成**：使用 `endpoint.$key` 作为 mutation 的 key
3. **参数传递**：通过 `mutate` 或 `mutateAsync` 函数传入的参数会传递给原始函数
4. **类型安全**：完全支持 TypeScript 类型推导，包括返回值类型和参数类型

## 配置选项

`options` 参数支持所有 `useMutation` 的配置选项：

| 选项         | 类型                                         | 描述                                     |
| ------------ | -------------------------------------------- | ---------------------------------------- |
| `mutationFn` | `(variables) => Promise<T>`                  | 实际执行的异步函数（已由 hook 自动设置） |
| `onMutate`   | `(variables) => Promise<Context> \| Context` | 请求开始前的回调，可用于乐观更新         |
| `onSuccess`  | `(data, variables, context) => void`         | 请求成功时的回调                         |
| `onError`    | `(error, variables, context) => void`        | 请求失败时的回调                         |
| `onSettled`  | `(data, error, variables, context) => void`  | 请求完成时的回调（无论成功或失败）       |
| `retry`      | `number \| boolean`                          | 失败时的重试次数                         |
| `retryDelay` | `number \| (attempt: number) => number`      | 重试延迟时间                             |
| ...          |                                              |                                          |

- [TanStack Query 官方文档](https://tanstack.com/query) - 了解更多 Mutation 配置项

## 函数签名

```typescript
function useKeyedMutation<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  options?: MutationOptions<Awaited<ReturnType<T>>, Error, Parameters<T>[0]>
): UseMutationResult<Awaited<ReturnType<T>>, Error, Parameters<T>[0]>;
```
