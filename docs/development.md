# Development

Run the demo and the tests, and build the package.

## Demo and development

```sh
npm ci
npm run demo
# Open the local URL Vite prints. Notes stay on the page.
npm run typecheck
npm test
npm run test:browser   # Chromium via playwright-core; OCR when tesseract is installed
npm run build
npm run demo:build
```

The demo has its own page, buttons and delivery hook. `pnpm install`, `pnpm test`, `pnpm run build` and `pnpm demo` also work from this repository. No app checkout, credentials or backend are required. The automated public API suite checks permissions, feature switches, names, language overrides, lifecycle events, failed delivery, multipart uploads, disconnection and concurrent-note isolation. Drawing geometry has its own tests.

See [adoption research](adoption.md) for reference patterns and [CHANGELOG.md](../CHANGELOG.md) for version changes. Versioning follows SemVer; the `0.x` series remains pre-1.0, and breaking public API changes increment the minor version.
