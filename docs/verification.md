# Verification

The standalone package is verified independently of the host app's checkout and dependency tree.

- `npm install --ignore-scripts --no-audit --no-fund` installs 47 packages into the library directory without an app node_modules symlink.
- `pnpm install --store-dir /tmp/otf-486-pnpm-store` installs the library's dependencies into a separate temporary store without using the app dependency tree. Release tags include compiled files and require no install-time build script.
- `pnpm run typecheck` checks the source and standalone demo with TypeScript 6.0.3.
- `pnpm test` passes 24 tests across the public API and drawing geometry suites.
- `pnpm run build` produces ESM entries, the lazy screenshot chunk and `dist/index.d.ts` declarations.
- `pnpm run demo:build` builds the standalone demo.
- `npm pack --cache /tmp/otf-486-npm-cache` creates the version 0.3.0 tarball containing compiled files, README, changelog and MIT license.
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

## Host styling browser checks

Chromium checks run at 1440 and 390 pixels against the standalone demo, with its document tokens removed so library defaults are measured directly. Actual computed CSS verifies the public shadow boundary, rather than only the existence of part attributes.

- A host stylesheet changes the built-in trigger radius to 3 pixels, window radius to 7 pixels, field radius to 2 pixels, Send background to `rgb(34, 84, 61)` and icon width to 18 pixels through documented parts.
- Automatic browser preference changes update both hosts from light to dark while retaining the textarea draft. The default window background changes from white to `rgb(24, 24, 27)`.
- A root `--luh-bg` token overrides dark defaults with `rgb(255, 250, 240)`.
- The drawing editor uses the same theme. Its tool radius changes to 5 pixels and its backdrop changes to 60% black through parts. Host SVG icons replace Send and the Arrow drawing tool.
- The visible SVG image receives opacity 0.9 through its image part. A real pointer drag creates an arrow whose polygon arrowhead receives `rgb(34, 84, 61)` through its polygon part.
- Closing the note removes the editor. A built-in trigger inside an open native dialog places the note surface inside that same dialog across the trigger's shadow boundary; its window styling remains applied.
- The README Vue component parses and compiles with Vue's SFC compiler. Its global Tailwind shadow-part `@apply` examples compile with Tailwind's default radius and font-weight tokens.
- The Impeccable detector checks the changed styles, part mapping and demo. Its demo heading-hierarchy finding is corrected by separating the 24-pixel page title from 20-pixel section headings and 16-pixel body copy.

Review screenshots remain outside Git. DOM checks and these browser styling checks do not establish screenshot pixel fidelity or assistive-technology compatibility. A receiving service, authenticated delivery, remote GitHub installation and real browser screenshot capture remain outside this standalone verification record.
