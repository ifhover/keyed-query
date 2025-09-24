# Keyed-Query

## Languages

- English
- [简体中文](README.zh.md)

## Overview

🔑 More efficiently and with less cognitive overhead, manage `queryKey` and type safety for SWR / TanStack Query

<p align="center">
  <strong>Unify data fetching logic and caching strategies through the "Function as Key" philosophy</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/keyed-query"><img src="https://img.shields.io/npm/v/keyed-query?color=blue" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/stars/ifhover/keyed-query" alt="License" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" /></a>
</p>

<p align="center">
  📘 Full Documentation: <a href="https://ifhover.github.io/keyed-query/">https://ifhover.github.io/keyed-query/</a>
</p>

---

## 📌 Introduction

**Keyed-Query** is a lightweight yet powerful utility library designed to simplify the usage experience of [SWR](https://swr.vercel.app) and [TanStack Query](https://tanstack.com/query).

It introduces the **"Function as Key"** concept — binding data fetching functions with their cache keys (`queryKey`) to automatically manage keys, avoid duplicate definitions or typos, and achieve full type safety.

> ✅ Zero Configuration | 🧪 Excellent Type Inference | 🔁 Multi-library Support | 🌱 Easy to Extend

---

## 🌟 Core Features

| Feature                            | Description                                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| 🔑 **Auto Key Management**         | Each function has a unique `$key`; parameters are automatically combined into a complete `queryKey` |
| 🎯 **Type Safety**                 | Automatic inference of parameter and return types, no manual generics required                      |
| 🔄 **Multi-library Compatibility** | Supports both SWR and TanStack Query with consistent APIs                                           |
| 🚀 **Ready-to-Use**                | Install and go — no extra configuration needed                                                      |
| 💡 **Function as Key**             | Data fetching function = logic + cache identifier, unified abstraction                              |

> Quoted from official site: **Bind request functions with unique identifiers to perfectly unify logic and caching strategies**

---

## 📦 Installation

Install using your preferred package manager:

```bash
# pnpm
pnpm add keyed-query

# npm
npm install keyed-query

# yarn
yarn add keyed-query
```

---

## 🚀 Quick Start

### 1. Define a Keyed Function

```ts
import { defineKeyed } from "keyed-query";

const fetchUser = defineKeyed("user", async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

### 2. Use in Component (using TanStack Query as example)

```tsx
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useKeyedQuery(fetchUser, userId);

  if (isLoading) return <div>Loading...</div>;
  return <div>Welcome back, {data.name}!</div>;
}
```

Equivalent to native implementation:

```ts
useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});
```

> ⚠️ This is just a minimal example. For advanced usage, please visit the official documentation.

---

## 📚 Official Documentation

📘 **We've prepared a complete standalone documentation site for you:**

👉 [https://ifhover.github.io/keyed-query/](https://ifhover.github.io/keyed-query/)

Includes:

- Detailed guide and best practices for `defineKeyed`
- Integration guides for SWR / TanStack Query
- Usage with multiple parameters, optional parameters, and mutations
- API Reference

---

## 🧩 Supported Libraries

| Library                                            | Supported Hooks                      |
| -------------------------------------------------- | ------------------------------------ |
| [SWR](https://swr.vercel.app)                      | `useKeyedSWR`, `useKeyedSWRMutation` |
| [TanStack Query React](https://tanstack.com/query) | `useKeyedQuery`, `useKeyedMutation`  |

> Want support for other data-fetching libraries or hooks? Feel free to open an Issue or submit a PR!

---

## 💻 Development

```bash
git clone https://github.com/ifhover/keyed-query.git
cd keyed-query

pnpm install
pnpm dev     # start development
```

---

## 🤝 Contribution

Feel free to open Issues to discuss problems or submit Pull Requests to contribute code!

---

## 📜 Changelog

### v1.0.1 - 2025-04-05

- Initial release
- Support for SWR and TanStack Query
- Complete TypeScript type system provided

> See [CHANGELOG.md](./CHANGELOG.md) for full update history

---

## 📄 License

MIT © [ifhover](https://github.com/ifhover)

---

<p align="center">
  Made with ❤️ by the community
</p>
