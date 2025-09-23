# `useKeyedSWRMutation`

`useKeyedSWRMutation` 是一个基于 `useSWRMutation` 封装的 React Hook，专为配合 `keyed-query` 定义的带 key 函数而设计。它自动从函数中提取绑定的 `$key`，并提供类型安全的参数传递，简化了 SWR Mutation 的调用方式。

## 导入

```typescript
import { useKeyedSWRMutation } from "keyed-query/hooks/swr-mutation";
```

## 参数说明

| 参数名     | 类型                               | 必填 | 描述                                                |
| ---------- | ---------------------------------- | ---- | --------------------------------------------------- |
| `endpoint` | `KeyedEndpoint<(arg: any) => any>` | 是   | 通过 `defineKeyed` 创建的带 `$key` 属性的单参数函数 |
| `options`  | `SWRMutationConfiguration`         | 否   | 传递给 `useSWRMutation` 的配置选项                  |

## 返回值

返回 `useSWRMutation` 的标准响应对象，包含：

- `data`: 请求成功后的数据
- `error`: 请求失败时的错误信息
- `isMutating`: 是否正在进行请求
- `trigger`: 触发 mutation 的函数，接收参数并返回 Promise
- `reset`: 重置状态的方法
- [SWR Mutation 官方文档](https://swr.vercel.app/docs/mutation) - 了解更多 Mutation 返回值

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
  const { trigger, isMutating, data, error } = useKeyedSWRMutation(
    api.updateUser
  );

  const handleUpdate = async (userData: UserUpdateData) => {
    try {
      const result = await trigger(userData);
      console.log("更新成功:", result);
    } catch (err) {
      console.error("更新失败:", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleUpdate({ name: "John" })}
        disabled={isMutating}
      >
        {isMutating ? "更新中..." : "更新用户"}
      </button>
    </div>
  );
}
```

### 2. 带配置选项

```typescript
const { trigger, isMutating } = useKeyedSWRMutation(api.updateUser, {
  onSuccess: (data) => {
    console.log("更新成功:", data);
    // 可以在这里更新相关缓存
  },
  onError: (error) => {
    console.error("更新失败:", error);
  },
  revalidate: true, // 更新后重新验证相关数据
});
```

### 3. 与其他 SWR 数据联动

```typescript
const { data: user } = useKeyedSWR(api.getUser, userId);
const { trigger: updateUser } = useKeyedSWRMutation(api.updateUser);

// updateUser 成功后，可以手动重新验证 getUser 的数据
const handleUpdate = async (userData: UserUpdateData) => {
  await updateUser(userData);
  // 手动重新获取用户数据
  mutate(api.getUser.$getKey(userId));
};
```

## 注意事项

1. **参数限制**：当前实现仅支持单参数函数，即 `endpoint` 必须是接受一个参数的函数
2. **Key 生成**：使用 `endpoint.$key` 作为 mutation 的 key
3. **参数传递**：通过 `trigger` 函数传入的参数会作为 `arg` 传递给原始函数
4. **类型安全**：完全支持 TypeScript 类型推导，包括返回值类型和参数类型

## 配置选项

`options` 参数支持所有 `useSWRMutation` 的配置选项：

| 选项              | 类型                            | 描述                                         |
| ----------------- | ------------------------------- | -------------------------------------------- |
| `onSuccess`       | `(data, key, config) => void`   | 请求成功时的回调                             |
| `onError`         | `(err, key, config) => void`    | 请求失败时的回调                             |
| `revalidate`      | `boolean`                       | 是否在成功后重新验证相关数据（默认: `true`） |
| `throwOnError`    | `boolean`                       | 是否在错误时抛出异常（默认: `true`）         |
| `optimisticData`  | `Data \| (currentData) => Data` | 乐观更新的数据                               |
| `rollbackOnError` | `boolean`                       | 错误时是否回滚乐观更新（默认: `true`）       |

- [SWR Mutation 官方文档](https://swr.vercel.app/docs/mutation) - 了解更多 Mutation 配置选项

## 函数签名

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
