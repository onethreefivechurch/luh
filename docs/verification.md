# Verification

The standalone package is verified independently of the host app's checkout and dependency tree.

- `npm install --ignore-scripts --no-audit --no-fund` installs 47 packages into the library directory without an app node_modules symlink.
- `pnpm install --store-dir /tmp/otf-486-pnpm-store` installs the library's dependencies into a separate temporary store and runs the package prepare build.
- `pnpm run typecheck` checks the source and standalone demo with TypeScript 6.0.3.
- `pnpm test` passes 17 tests across the public API and drawing geometry suites.
- `pnpm run build` produces ESM entries, the lazy screenshot chunk and `dist/index.d.ts` declarations.
- `pnpm run demo:build` builds the standalone demo.
- `npm pack --cache /tmp/otf-486-npm-cache` creates the version 0.2.0 tarball containing compiled files, README, changelog and MIT license.
- A separate adopter directory installs that tarball through pnpm using the offline temporary store. TypeScript compiles a consumer using name settings and typed lifecycle event details without source path aliases. Happy DOM runs the compiled ESM, verifies browser-entry registration and opens/closes the widget without access to the library's source directory.

## Checked API scope

- Registration is idempotent; a disabled key leaves picking off.
- A successful host hook receives the trimmed note and emits open, sent, then close.
- Names support off, optional and required modes.
- Dynamic host permission is checked at activation, opening and delivery; callback failures deny access.
- Screenshot, picking and drawing switches retain ordinary notes and image upload.
- Locale maps merge base and exact locales with final string overrides; explicit roles use translated spoken names.
- Refused and thrown submissions retain the draft and emit no sent event.
- The generic multipart helper includes name, via and page context, and uses same-origin credentials.
- Older asynchronous submissions cannot close a later note.
- Closing or disconnecting cancels the image editor and releases its object URLs.
- Disconnect/reconnect removes and restores global listeners once.

DOM-based API checks do not verify screenshot pixels, browser focus behavior, phone layouts or assistive technology. A receiving service, authenticated delivery, remote GitHub installation and real browser screenshot capture are outside this standalone verification record.
