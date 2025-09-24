# `useKeyedSWR`

`useKeyedSWR` 是一个基于 `useSWR` 封装的 React Hook，专为配合 `keyed-query` 定义的带 key 函数而设计。它自动从函数中提取绑定的 `$key`，并将参数作为 key 的一部分，简化了 SWR 的调用方式。

## 导入

```typescript
import { useKeyedSWR } from "keyed-query/hooks/swr";
```

## 参数说明

| 参数名             | 类型               | 必填 | 描述                                          |
| ------------------ | ------------------ | ---- | --------------------------------------------- |
| `endpoint`         | `KeyedEndpoint`    | 是   | 通过 `defineKeyed` 创建的带 `$key` 属性的函数 |
| `params` / `param` | `Parameters<T>`    | 否\* | 传递给 `endpoint` 函数的参数列表或单个参数    |
| `options`          | `SWRConfiguration` | 否   | 传递给 `useSWR` 的配置选项                    |

> \* 当 `endpoint` 函数无参数时，第二个参数被视为 `options`

## 返回值

返回 `useSWR` 的标准响应对象，包含：

- `data`: 请求成功后的数据
- `error`: 请求失败时的错误信息
- `isLoading`: 是否正在加载数据
- `isValidating`: 是否正在重新验证数据
- `mutate`: 手动触发数据更新的方法

- [SWR 官方文档](https://swr.vercel.app/) - 了解更多 SWR 配置选项

## 使用示例

### 1. 无参数函数

```typescript
const api = {
  getUserList: defineKeyed("users.list", () => request.get("/api/users")),
};

// 使用时无需传参
const { data, isLoading } = useKeyedSWR(api.getUserList);
```

### 2. 单个参数函数

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) =>
    request.get(`/api/users/${id}`)
  ),
};

// 传入单个参数
const { data, isLoading } = useKeyedSWR(api.getUser, "123");
```

### 3. 多参数函数

```typescript
const api = {
  searchUsers: defineKeyed("users.search", (name: string, age: number) =>
    request.get(`/api/users?name=${name}&age=${age}`)
  ),
};

// 传入多个参数
const { data, isLoading } = useKeyedSWR(api.searchUsers, ["john", 25]);
```

### 4. 带配置选项

```typescript
const { data, isLoading } = useKeyedSWR(api.getUser, "123", {
  revalidateOnFocus: false,
  dedupingInterval: 5000,
});
```

---

## 注意事项

1. **参数处理**：`useKeyedSWR` 会自动根据 `endpoint` 函数的参数个数来判断参数的传入方式
2. **Key 生成**：最终传递给 `useSWR` 的 key 为 `[endpoint.$key, ...params]`
3. **类型安全**：完全支持 TypeScript 类型推导，包括返回值类型和参数类型

## 函数签名

```typescript
function useKeyedSWR<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endpoint: T,
  params: Parameters<T>,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

function useKeyedSWR<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  param: Parameters<T>[0],
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;

function useKeyedSWR<T extends KeyedEndpoint<() => any>>(
  endpoint: T,
  options?: SWRConfiguration<Awaited<ReturnType<T>>>
): SWRResponse<Awaited<ReturnType<T>>, Error>;
```
