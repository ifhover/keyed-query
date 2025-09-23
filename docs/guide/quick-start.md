# 快速开始

## 安装

::: code-group

```shell [npm]
npm install keyed-query
```

```shell [pnpm]
pnpm add keyed-query
```

```shell [yarn]
yarn add keyed-query
```

:::

## 定义 Endpoint

```typescript
import { defineKeyed } from "keyed-query";

type User = {
  id: string;
  name: string;
};

const getUser = defineKeyed((id: string) => {
  return fetch(`api/user/${id}`).then((res) => res.json());
});

const addUser = defineKeyed((user: User) => {
  return fetch("api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then((res) => res.json());
});
```

## 使用

### 在组件内使用

`keyed-key` 提供了适配 `SWR` 和 `Tanstack Query React` 的 Hook：

::: code-group

```typescript [SWR]
import { useKeyedSWR, useKeyedSWRMutation } from "keyed-query/hooks/swr";

function Profile(props: { id: string }) {
  const { data, isLoading } = useKeyedSWR(getUser, props.id);

  return <div>...</div>;
}

function Edit() {
  const { data, isMutating, mutate } = useKeyedSWRMutation(addUser);

  function handleSubmit(formData: User) {
    mutate(formData);
  }

  return <div>...</div>;
}
```

```typescript [Tanstack Query React]
import {
  useKeyedQuery,
  useKeyedMutation,
} from "keyed-query/hooks/tanstack-query";

function Profile(props: { id: string }) {
  const { data, isLoading } = useKeyedQuery(getUser, props.id);

  return <div>...</div>;
}

function Edit() {
  const { data, isPending, mutate } = useKeyedMutation(addUser);

  function handleSubmit(formData: User) {
    mutate(formData);
  }

  return <div>...</div>;
}
```

#### API 的对应关系

keyed-query 提供的 hook 是对以下 swr、tanstack query hook 的封装，keyed-query 只简化了调用时的参数(不需要写 key 了)，返回类型和原方法是一致的。

| keyed-query         | swr              | tanstack query |
| ------------------- | ---------------- | -------------- |
| useKeyedSWR         | `useSWR`         | -              |
| useKeyedSWRMutation | `useSWRMutation` | -              |
| useKeyedQuery       | -                | `useQuery`     |
| useKeyedMutation    | -                | `useMutation`  |

:::

### 当作普通函数使用

```typescript
getUser("1");

addUser({
  id: "1",
  name: "Jack",
});
```
