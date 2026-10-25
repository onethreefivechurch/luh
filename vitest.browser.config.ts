import { defineConfig } from "vitest/config";
// Real Chromium through Playwright; the browsers come from `npx playwright-core install chromium`.
export default defineConfig({ test: { environment: "node", include: ["test/**/*.browser.test.ts"], fileParallelism: false } });
