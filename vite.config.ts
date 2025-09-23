import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({})],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        "hooks/swr/index": "src/hooks/swr/index.ts",
        "hooks/tanstack-query/index": "src/hooks/tanstack-query/index.ts",
      },
      formats: ["cjs", "es"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "@tanstack/react-query",
        "@types/node",
        "react",
        "swr",
        "typescript",
        "vite",
        "vite-plugin-dts",
      ],
    },
  },
});
