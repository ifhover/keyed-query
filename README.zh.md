# Keyed-Query

## Languages

- [English](README.md)
- 简体中文

## Overview

一个让你更轻松使用 SWR 或 TanStack Query 的小工具。

它做的事情很简单： 👉 **在你定义数据请求函数的时候，顺手给它绑一个 key**，然后就可以直接在组件里用了，不用再额外封装一层 Hook。

<p align="center">
  <a href="https://www.npmjs.com/package/keyed-query"><img src="https://img.shields.io/npm/v/keyed-query?color=blue" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/stars/ifhover/keyed-query" alt="License" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" /></a>
</p>

<p align="center">
  📘 完整文档: <a href="https://ifhover.github.io/keyed-query/">https://ifhover.github.io/keyed-query/</a>
</p>

---

## 📌 动机

### ❌ 以前要写两个函数

比如你想获取用户信息，通常要这么写：

```ts
// api/user.ts
// 1. 写一个 fetch 函数
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// 2. 再写一个 useHook 封装 SWR
function useUser(id: string) {
  return useSWR(["user", id], () => fetchUser(id));
}
```

```tsx
// UserProfile.tsx
import { useUser } from "./api/user";

function UserProfile({ userId }) {
  const { data, isLoading } = useUser(userId);
  if (isLoading) return <div>加载中...</div>;
  return <div>你好，{data.name}</div>;
}
```

你看，为了一个接口，你要写两个函数：

- `fetchUser`：发请求
- `useUser`：配合组件用，还要手动传 `['user', id]`

如果项目有 50 个接口，你就得写 100 个函数？太累了。

## ✅ 现在：只写一个函数就够了

用 `keyed-query`，你只需要定义一次：

```ts
// api/user.ts
import { defineKeyed } from "keyed-query";

// 定义时顺便把 key 绑上
const fetchUser = defineKeyed("user", async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

然后在组件里直接用：

```tsx
// UserProfile.tsx
import { useKeyedSWR } from "keyed-query/hooks/swr";
import { fetchUser } from "./api/user";

function UserProfile({ userId }) {
  const { data, isLoading } = useKeyedSWR(fetchUser, userId);
  if (isLoading) return <div>加载中...</div>;
  return <div>你好，{data.name}</div>;
}
```

就这么简单。

不需要 `useUser` 了，也不用手动写 `['user', id]`。  
你只定义了一个函数，但它自己知道自己的 key 是什么。

---

## 🌟 核心特性

| 功能                | 说明                                                   |
| ------------------- | ------------------------------------------------------ |
| 🔑 **自动键值管理** | 每个函数拥有唯一 `$key`，参数自动组合成完整 `queryKey` |
| 🎯 **类型安全**     | 参数与返回值类型自动推导，无需手动声明泛型             |
| 🔄 **多库兼容**     | 同时支持 SWR 与 TanStack Query，API 一致               |
| 🚀 **开箱即用**     | 安装即可使用，无额外配置                               |
| 💡 **函数即 Key**   | 数据请求函数 = 逻辑 + 缓存标识，统一抽象               |

> 引用自官网：**Bind request functions with unique identifiers to perfectly unify logic and caching strategies**

---

## 📦 安装

使用你喜欢的包管理器安装：

```bash
# pnpm
pnpm add keyed-query

# npm
npm install keyed-query

# yarn
yarn add keyed-query
```

---

## 🚀 快速开始

### 1. 定义一个 Keyed 函数

```ts
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

### 2. 在组件中使用（以 TanStack Query 为例）

```tsx
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useKeyedQuery(fetchUser, userId);

  if (isLoading) return <div>加载中...</div>;
  return <div>欢迎回来，{data.name}！</div>;
}
```

等效于原生写法：

```ts
useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});
```

> ⚠️ 这只是一个最简示例。了解更多高级用法，请访问官方文档。

---

## 🧩 支持的库

| 库名                                               | 支持 Hook                            |
| -------------------------------------------------- | ------------------------------------ |
| [SWR](https://swr.vercel.app)                      | `useKeyedSWR`, `useKeyedSWRMutation` |
| [TanStack Query React](https://tanstack.com/query) | `useKeyedQuery`, `useKeyedMutation`  |

> 想要支持其他数据请求库、Hook？欢迎提交 Issue 或 PR

---

## 💻 开发

```bash
git clone https://github.com/ifhover/keyed-query.git
cd keyed-query

pnpm install
pnpm dev     # 启动开发
```

---

## 🤝 贡献

欢迎提交 Issue 讨论问题，或发起 Pull Request 贡献代码！

---

## 📜 更新日志

### v1.0.2 - 2025-09-24

- 更新依赖项 删除无用依赖
- 更新使用文档

### v1.0.1 - 2025-09-23

- 初始版本发布
- 支持 SWR 与 TanStack Query
- 提供完整 TypeScript 类型系统

---

## 📄 许可证

MIT © [ifhover](https://github.com/ifhover)

---

<p align="center">
  Made with ❤️ by the community
</p>
