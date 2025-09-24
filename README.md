# Keyed-Query

## Languages

- English
- [简体中文](README.zh-CN.md)

## Overview

A small utility that makes it easier to use SWR or TanStack Query.

It does one simple thing: 👉 **bind a unique key to your data-fetching function when you define it**, so you can directly use it in components without wrapping another custom Hook.

<p align="center">
  <a href="https://www.npmjs.com/package/keyed-query"><img src="https://img.shields.io/npm/v/keyed-query?color=blue" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/github/stars/ifhover/keyed-query" alt="License" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" /></a>
</p>

<p align="center">
  📘 Full Documentation: <a href="https://ifhover.github.io/keyed-query/">https://ifhover.github.io/keyed-query/</a>
</p>

---

## 📌 Motivation

### ❌ Previously: Two Functions Needed

For example, if you want to fetch user information, you'd typically write:

```ts
// api/user.ts
// 1. Write a fetch function
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// 2. Then create a useHook to wrap SWR
function useUser(id: string) {
  return useSWR(["user", id], () => fetchUser(id));
}
```

```tsx
// UserProfile.tsx
import { useUser } from "./api/user";

function UserProfile({ userId }) {
  const { data, isLoading } = useUser(userId);
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello, {data.name}</div>;
}
```

As you can see, for one API endpoint, you need to write two functions:

- `fetchUser`: performs the request
- `useUser`: used in components, requiring manual specification of `['user', id]`

If your project has 50 endpoints, do you really want to write 100 functions? That's exhausting.

## ✅ Now: One Function Is Enough

With `keyed-query`, you only need to define once:

```ts
// api/user.ts
import { defineKeyed } from "keyed-query";

// Bind the key during definition
const fetchUser = defineKeyed("user", async (id: string) => {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
});
```

Then use it directly in your component:

```tsx
// UserProfile.tsx
import { useKeyedSWR } from "keyed-query/hooks/swr";
import { fetchUser } from "./api/user";

function UserProfile({ userId }) {
  const { data, isLoading } = useKeyedSWR(fetchUser, userId);
  if (isLoading) return <div>Loading...</div>;
  return <div>Hello, {data.name}</div>;
}
```

That's it.

No more `useUser` wrapper, and no need to manually write `['user', id]`.  
You define just one function, and it knows its own key automatically.

---

## 🌟 Core Features

| Feature                            | Description                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| 🔑 **Automatic Key Management**    | Each function has a unique `$key`; parameters are automatically combined into a full `queryKey` |
| 🎯 **Type Safety**                 | Automatic inference of parameter and return types; no manual generics needed                    |
| 🔄 **Multi-Library Compatibility** | Supports both SWR and TanStack Query with consistent APIs                                       |
| 🚀 **Zero Configuration**          | Ready to use after installation, no extra setup required                                        |
| 💡 **Function as Key**             | Data-fetching function = logic + cache identifier, unified abstraction                          |

> From the official site: **Bind request functions with unique identifiers to perfectly unify logic and caching strategies**

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

### 2. Use in Component (TanStack Query Example)

```tsx
import { useKeyedQuery } from "keyed-query/hooks/tanstack-query";

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading } = useKeyedQuery(fetchUser, userId);

  if (isLoading) return <div>Loading...</div>;
  return <div>Welcome back, {data.name}!</div>;
}
```

Equivalent to native syntax:

```ts
useQuery({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
});
```

> ⚠️ This is a minimal example. For advanced usage, please visit the official documentation.

---

## 🧩 Supported Libraries

| Library                                            | Supported Hooks                      |
| -------------------------------------------------- | ------------------------------------ |
| [SWR](https://swr.vercel.app)                      | `useKeyedSWR`, `useKeyedSWRMutation` |
| [TanStack Query React](https://tanstack.com/query) | `useKeyedQuery`, `useKeyedMutation`  |

> Want support for other data-fetching libraries or hooks? Feel free to open an Issue or PR!

---

## 💻 Development

```bash
git clone https://github.com/ifhover/keyed-query.git
cd keyed-query

pnpm install
pnpm dev     # start development server
```

---

## 🤝 Contribution

Feel free to open Issues to discuss problems or submit Pull Requests to contribute code!

---

## 📜 Changelog

### v1.0.2 - 2025-09-24

- Update dependencies, remove unused ones
- Update usage documentation

### v1.0.1 - 2025-09-23

- Initial release
- Support for SWR and TanStack Query
- Complete TypeScript type system provided

---

## 📄 License

MIT © [ifhover](https://github.com/ifhover)

---

<p align="center">
  Made with ❤️ by the community
</p>
