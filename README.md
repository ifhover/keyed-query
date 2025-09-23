# Keyed-Query

更高效和更低心智负担的使用 SWR、Tanstck Query 或其他库，方便的定义和管理 Key，提供类型安全的工具库。

## 特性

- 🔑 **自动键值管理** - 自动为数据获取函数生成唯一键值
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🔄 **多库支持** - 支持 SWR 和 TanStack Query
- 🚀 **零配置** - 开箱即用，无需额外配置
- 🙌 **可拓展** - 根据需求自由编写更多 Hook

## 安装

```bash
# 使用 pnpm
pnpm add keyed-query

# 使用 npm
npm install keyed-query

# 使用 yarn
yarn add keyed-query
```

## 核心概念

### KeyedEndpoint

`KeyedEndpoint` 是一个增强的函数类型，它为普通函数添加了键(key)值管理功能：

```typescript
type KeyedEndpoint<T extends (...args: any) => any> = T & {
  $key: string; // 唯一键值
  $getKey(...p: Parameters<T>): [string, ...Parameters<T>]; // 获取完整键值
};
```

### defineKeyed

`defineKeyed` 函数用于创建 `KeyedEndpoint`：

```typescript
// 方式1：提供自定义键值
const fetchUser = defineKeyed("user", async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
console.log(fetchUser.$key); // "user"

// 方式2：自动生成键值
const fetchPosts = defineKeyed(async () => {
  const response = await fetch("/api/posts");
  return response.json();
});
console.log(fetchUser.$key); // 自动生成uuid字符串

// 获取指定参数的键值
const getDict = defineKeyed("getDict", async (dict: string) => {
  const response = await fetch(`/api/dict/${dict}`);
  return response.json();
});

console.log(getDict.$getKey(dict)); // ["getDict", "dict"]

const getDict = defineKeyed(async (dict: string) => {
  const response = await fetch(`/api/dict/${dict}`);
  return response.json();
});

console.log(getDict.$getKey(dict)); // [randomUUID, "dict"]
```

当然 defineKeyed 的返回值也可以当做一个普通函数调用（这在特殊场景和服务器渲染时非常有用）

```typescript
const fetchUser = defineKeyed("user", async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});

console.log(fetchUser("1")); // Promise<>
```

## 使用方法

### SWR 集成

#### useKeyedSWR

##### 快速示例：

```typescript
// src/data.ts
import { defineKeyed } from "keyed-query";

// 定义数据获取函数
const fetchUser = defineKeyed("user", async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
```

在组件中使用

```typescript
// src/app.tsx
import { useKeyedSWR } from "keyed-query/hooks/swr";
import { fetchUser } from "./data";

function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useKeyedSWR(fetchUser, userId);
  // 等效于：
  // const { data, error, isLoading } = useSWR(["user", userId], () => fetchUser(userId));

  return <div>...</div>;
}
```

##### 全部用法：

单个参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedSWR(fetchUser, userId, {
  onSuccess() {},
});
```

多个参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string, name: string) => {
  const response = await fetch(`/api/users/${id}/${name}`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedSWR(fetchUser, [userId, userName], {
  onSuccess() {},
});
```

没有参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async () => {
  const response = await fetch(`/api/users`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedSWR(fetchUser, {
  onSuccess() {},
});
```

#### useKeyedSWRMutation

```typescript
import { defineKeyed } from "keyed-query";
import { useKeyedSWRMutation } from "keyed-query/hooks/swr";

// 定义变更函数
const updateUser = defineKeyed(
  "updateUser",
  async (userData: { id: string; name: string }) => {
    const response = await fetch(`/api/users/${userData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
);

// 在组件中使用
function EditUser() {
  const { trigger, isMutating } = useKeyedSWRMutation(updateUser);
  // 等效于：
  // const { trigger, isMutating } = useSWRMutation(
  //   "updateUser",
  //   (_: any, { arg }: { arg: { id: string; name: string } }) =>
  //     updateUser(arg)
  // );
  return <div>...</div>;
}
```

### TanStack Query 集成

#### useKeyedQuery

```typescript
// src/data.ts
import { defineKeyed } from "keyed-query";

// 定义数据获取函数
const fetchUser = defineKeyed("user", async (category?: string) => {
  const response = await fetch(`/api/users`);
  return response.json();
});
```

```typescript
// src/app.tsx
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";
import { fetchUser } from "./fetchUser";

function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useKeyedQuery(fetchUser, userId);
  // 等效于：
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["user", userId],
  //   queryFn: () => fetchUser(userId)
  // });
  return <div>...</div>;
}
```

##### 全部用法：

单个参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedQuery(fetchUser, userId, {
  onSuccess() {},
});
```

多个参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string, name: string) => {
  const response = await fetch(`/api/users/${id}/${name}`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedQuery(
  fetchUser,
  [userId, userName],
  {
    onSuccess() {},
  }
);
```

没有参数

```typescript
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async () => {
  const response = await fetch(`/api/users`);
  return response.json();
});
```

```typescript
// in react component
const { data, error, isLoading } = useKeyedQuery(fetchUser, {
  onSuccess() {},
});
```

#### useKeyedMutation

```typescript
import { defineKeyed } from "keyed-query";
import { useKeyedMutation } from "keyed-query/hooks/tanstack-query";

// 定义变更函数
const createPost = defineKeyed(
  "createPost",
  async (postData: { title: string; content: string }) => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    return response.json();
  }
);

// 在组件中使用
function CreatePost() {
  const { mutate, isPending, error } = useKeyedMutation(createPost, {
    onSuccess: (data) => {
      console.log("文章创建成功:", data);
    },
    onError: (error) => {
      console.error("创建失败:", error);
    },
  });
  // 等效于：
  // const { mutate, isPending, error } = useMutation({
  //   mutationFn: (arg: { title: string; content: string }) => {
  //     return createPost(arg)
  //   },
  //   onSuccess: (data) => {
  //    console.log("文章创建成功:", data);
  //   },
  //   onError: (error) => {
  //     console.error("创建失败:", error);
  //   }
  // })
  return <div>...</div>;
}
```

## 类型支持

本库提供完整的 TypeScript 类型定义，支持：

- 自动推断函数参数类型
- 自动推断返回值类型
- 完整的泛型支持
- 与 SWR 和 TanStack Query 的类型兼容

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 贡献

欢迎提交 Issue 和 Pull Request

## 更新日志

### v1.0.1

- 初始版本发布
- 支持 SWR 和 TanStack Query
