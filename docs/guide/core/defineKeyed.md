# `defineKeyed`

`defineKeyed` 是库的核心函数，用于创建带 key 属性的请求函数。

## 函数签名

```typescript
// 显式指定 key
function defineKeyed<T extends (...p: any[]) => any>(
  key: string,
  fetcher: T
): KeyedEndpoint<T>;

// 自动生成 key
function defineKeyed<T extends (...p: any[]) => any>(
  fetcher: T
): KeyedEndpoint<T>;
```

## 参数说明

| 参数名    | 类型       | 必填 | 描述               |
| --------- | ---------- | ---- | ------------------ |
| `key`     | `string`   | 否   | 自定义的唯一标识符 |
| `fetcher` | `Function` | 是   | 实际的请求函数     |

## 返回值

返回一个扩展的函数对象，包含：

- 原始函数的所有功能
- `$key`: 绑定的唯一标识符
- `$getKey(...)`: 生成完整 key 数组的方法

## 使用示例

### 1. 显式指定 key

```typescript
const getUser = defineKeyed("users.get", (id: string) => {
  return fetch(`/api/users/${id}`).then((res) => res.json());
});

console.log(getUser.$key); // "users.get"
console.log(getUser.$getKey("123")); // ["users.get", "123"]
getUser("123"); // 正常执行函数
```

### 2. 自动生成 key

```typescript
const getUserList = defineKeyed(() => {
  return fetch("/api/users").then((res) => res.json());
});

console.log(getUserList.$key); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" (UUID)
console.log(getUserList.$getKey()); // ["xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"]
```

### 3. 复杂参数函数

```typescript
const searchUsers = defineKeyed("users.search", (name: string, age: number) => {
  return fetch(`/api/users?name=${name}&age=${age}`).then((res) => res.json());
});

console.log(searchUsers.$getKey("john", 25)); // ["users.search", "john", 25]
```
