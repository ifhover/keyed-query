# `useKeyedQuery`

`useKeyedQuery` 是一个基于 `TanstackQuery React`的`useQuery` 封装的 React Hook，专为配合 `keyed-query` 定义的带 key 函数而设计。它自动从函数中提取绑定的 `$key` 和 `$getKey` 方法，生成完整的查询 key，简化了 TanStack Query 的调用方式。

## 导入

```typescript
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";
```

## 参数说明

| 参数名         | 类型            | 必填 | 描述                                          |
| -------------- | --------------- | ---- | --------------------------------------------- |
| `endpoint`     | `KeyedEndpoint` | 是   | 通过 `defineKeyed` 创建的带 `$key` 属性的函数 |
| `args` / `arg` | `Parameters<T>` | 否\* | 传递给 `endpoint` 函数的参数列表或单个参数    |
| `options`      | `QueryOptions`  | 否   | 传递给 `useQuery` 的配置选项                  |

> \* 当 `endpoint` 函数无参数时，第二个参数被视为 `options`

## 返回值

返回 `useQuery` 的标准响应对象，包含：

- `data`: 请求成功后的数据
- `error`: 请求失败时的错误信息
- `isLoading`: 是否正在加载数据
- `isFetching`: 是否正在获取数据
- `isSuccess`: 请求是否成功
- `isError`: 请求是否失败
- `refetch`: 手动重新获取数据的方法
- [TanStack Query 官方文档](https://tanstack.com/query) - 了解更多 Query 返回值

## 使用示例

### 1. 无参数函数

```typescript
const api = {
  getUserList: defineKeyed("users.list", () => request.get("/api/users")),
};

// 使用时无需传参
const { data, isLoading } = useKeyedQuery(api.getUserList);
```

### 2. 单个参数函数

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) =>
    request.get(`/api/users/${id}`)
  ),
};

// 传入单个参数
const { data, isLoading } = useKeyedQuery(api.getUser, "123");
```

### 3. 多参数函数

```typescript
const api = {
  searchUsers: defineKeyed("users.search", (name: string, age: number) =>
    request.get(`/api/users?name=${name}&age=${age}`)
  ),
};

// 传入多个参数
const { data, isLoading } = useKeyedQuery(api.searchUsers, ["john", 25]);
```

### 4. 带配置选项

```typescript
const { data, isLoading } = useKeyedQuery(api.getUser, "123", {
  staleTime: 5 * 60 * 1000, // 5分钟
  cacheTime: 10 * 60 * 1000, // 10分钟
  refetchOnWindowFocus: false,
});
```

## 注意事项

1. **参数处理**：`useKeyedQuery` 会自动根据 `endpoint` 函数的参数个数来判断参数的传入方式
2. **Key 生成**：使用 `endpoint.$getKey(...params)` 生成完整的查询 key
3. **类型安全**：完全支持 TypeScript 类型推导，包括返回值类型和参数类型

## 函数签名

```typescript
function useKeyedQuery<T extends KeyedEndpoint<(...args: any[]) => any>>(
  endpoint: T,
  args: Parameters<T>,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

function useKeyedQuery<T extends KeyedEndpoint<(arg: any) => any>>(
  endpoint: T,
  arg: Parameters<T>[0],
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;

function useKeyedQuery<T extends KeyedEndpoint<() => any>>(
  endpoint: T,
  options?: QueryOptions<Awaited<ReturnType<T>>, Error>
): UseQueryResult<Awaited<ReturnType<T>>, Error>;
```
