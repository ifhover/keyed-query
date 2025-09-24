# Keyed-Query

## Languages

- [English](README.md)
- 简体中文

## Overview

🔑 更高效、更低心智负担地管理 SWR / TanStack Query 的 `queryKey` 与类型安全

<p align="center">
  <strong>通过「函数即 Key」理念，统一数据请求逻辑与缓存策略</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/keyed-query"><img src="https://img.shields.io/npm/v/keyed-query?color=blue" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/stars/ifhover/keyed-query" alt="License" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" /></a>
</p>

<p align="center">
  📘 完整文档: <a href="https://ifhover.github.io/keyed-query/">https://ifhover.github.io/keyed-query/</a>
</p>

---

## 📌 简介

**Keyed-Query** 是一个轻量而强大的工具库，专为简化 [SWR](https://swr.vercel.app) 和 [TanStack Query](https://tanstack.com/query) 的使用体验而设计。

它提出 **“Function as Key”** 的理念 —— 将数据获取函数与其缓存键（`queryKey`）绑定，自动管理 key，避免重复定义、拼写错误，并获得完整的类型安全支持。

> ✅ 零配置 | 🧪 类型推导完善 | 🔁 支持多库 | 🌱 易拓展

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

## 📚 官方文档

📘 **我们已为你准备了完整的独立文档站点：**

👉 [https://ifhover.github.io/keyed-query/](https://ifhover.github.io/keyed-query/)

包含：

- `defineKeyed` 详解与最佳实践
- SWR / TanStack Query 集成指南
- 多参数、可选参数、mutation 使用方式
- API Reference

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

### v1.0.1 - 2025-04-05

- 初始版本发布
- 支持 SWR 与 TanStack Query
- 提供完整 TypeScript 类型系统

> 完整更新历史见 [CHANGELOG.md](./CHANGELOG.md)

---

## 📄 许可证

MIT © [ifhover](https://github.com/ifhover)

---

<p align="center">
  Made with ❤️ by the community
</p>
