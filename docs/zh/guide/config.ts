export default {
  themeConfig: {
    sidebar: [
      {
        text: "指南",
        items: [
          { text: "概述", link: "/zh/guide/overview" },
          { text: "快速开始", link: "/zh/guide/quick-start" },
          { text: "其他说明", link: "/zh/guide/other" },
        ],
      },
      {
        text: "Core",
        items: [
          { text: "KeyedEndpoint", link: "/zh/guide/core/KeyedEndpoint" },
          { text: "defineKeyed", link: "/zh/guide/core/defineKeyed" },
        ],
      },
      {
        text: "SWR",
        items: [
          { text: "useKeyedSWR", link: "/zh/guide/swr/useKeyedSWR" },
          {
            text: "useKeyedSWRMutation",
            link: "/zh/guide/swr/useKeyedSWRMutation",
          },
        ],
      },
      {
        text: "TanStack Query",
        items: [
          {
            text: "useKeyedQuery",
            link: "/zh/guide/tanstack-query/useKeyedQuery",
          },
          {
            text: "useKeyedMutation",
            link: "/zh/guide/tanstack-query/useKeyedMutation",
          },
        ],
      },
    ],
  },
};
