import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  resolve: {
    alias: {
      "@onethreefivechurch/luh": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
    },
  },
});
