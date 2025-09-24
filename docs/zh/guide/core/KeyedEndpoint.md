# `KeyedEndpoint<T>`

`KeyedEndpoint` 是一个类型别名，表示带 key 属性的函数类型。

## 类型定义

```typescript
type KeyedEndpoint<T extends (...args: any) => any> = T & {
  $key: string;
  $getKey(...p: Parameters<T>): [string, ...Parameters<T>];
};
```

## 属性说明

| 属性      | 类型       | 描述                                  |
| --------- | ---------- | ------------------------------------- |
| `$key`    | `string`   | 绑定的唯一标识符                      |
| `$getKey` | `Function` | 接收函数参数，返回完整 key 数组的方法 |

## 使用示例

```typescript
const api = {
  getUser: defineKeyed("users.get", (id: string) => {
    return request.get<User>(`/api/users/${id}`);
  }),
  createUser: defineKeyed("users.create", (data: UserData) => {
    return request.post<User>("/api/users", data);
  }),
};

// 类型安全的访问
api.getUser.$key; // "users.get"
api.createUser.$getKey({ name: "John" }); // ["users.create", { name: "John" }]
```

## 设计理念

### 1. 零侵入性

`defineKeyed` 返回的仍然是原始函数，可以像普通函数一样直接调用，不会改变原有使用方式。

### 2. 灵活的 key 管理

支持显式指定有意义的 key，也支持自动生成 UUID，满足不同场景需求。

### 3. 完整的类型支持

基于 TypeScript 的泛型系统，自动推导函数参数和返回值类型，确保类型安全。

### 4. 易于集成

通过 `$key` 和 `$getKey` 属性，为各种数据获取库提供统一的集成接口。

## 最佳实践

### 1. 统一管理 API

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

### 2. 语义化的 key 命名

建议使用 `模块.操作` 的命名规范，如 `'user.get'`、`'post.create'` 等，提高可读性。

### 3. 与 Hook 配合使用

```typescript
// 使用 SWR
const { data } = useKeyedSWR(userApi.get, "123");

// 使用 TanStack Query
const { data } = useKeyedQuery(userApi.list);
```

## 注意事项

1. **参数传递**：`$getKey` 方法会将所有参数原样传递到返回的数组中
2. **Key 唯一性**：显式指定的 key 应该在应用中保持唯一
3. **类型约束**：只支持函数类型的参数，不支持其他类型
4. **性能考虑**：`defineKeyed` 应该在模块初始化时调用，避免在渲染过程中重复创建
