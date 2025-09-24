export default {
  themeConfig: {
    sidebar: [
      {
        text: "指南",
        items: [
          { text: "概述", link: "/guide/overview" },
          { text: "快速开始", link: "/guide/quick-start" },
          { text: "其他说明", link: "/guide/other" },
        ],
      },
      {
        text: "Core",
        items: [
          { text: "KeyedEndpoint", link: "/guide/core/KeyedEndpoint" },
          { text: "defineKeyed", link: "/guide/core/defineKeyed" },
        ],
      },
      {
        text: "SWR",
        items: [
          { text: "useKeyedSWR", link: "/guide/swr/useKeyedSWR" },
          {
            text: "useKeyedSWRMutation",
            link: "/guide/swr/useKeyedSWRMutation",
          },
        ],
      },
      {
        text: "TanStack Query",
        items: [
          {
            text: "useKeyedQuery",
            link: "/guide/tanstack-query/useKeyedQuery",
          },
          {
            text: "useKeyedMutation",
            link: "/guide/tanstack-query/useKeyedMutation",
          },
        ],
      },
    ],
  },
};
