export default {
  // 站点级选项
  title: "Keyed-Query",
  description: "Just playing around.",
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    zh: {
      label: "简体中文",
      lang: "zh",
      link: "/zh",
    },
  },

  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/overview" },
      { text: "Github", link: "https://github.com/ifhover/keyed-query" },
      { text: "npm", link: "https://www.npmjs.com/package/keyed-query" },
    ],
  },
};
