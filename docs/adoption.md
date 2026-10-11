# Adoption patterns

The library follows established embeddable feedback patterns while keeping storage and delivery in the host's code. These references document product capabilities; they do not imply those services were installed or tested here.

- [Sentry user feedback configuration](https://docs.sentry.io/platforms/javascript/guides/svelte/user-feedback/configuration__v7.x) documents configurable text, theme, identity fields, custom triggers and lifecycle callbacks. That page describes a deprecated v7 integration. Luh adopts the useful interface patterns through host-owned options and typed events without depending on Sentry or collecting an email address.
- [Marker.io's official browser SDK](https://github.com/marker-io/browser-sdk) exposes widget controls and custom issue metadata. Luh keeps host-provided context attached to the note captured at opening, while leaving routing and issue creation outside the library.
- [Userback's JavaScript SDK](https://docs.userback.io/docs/javascript-sdk) documents language, theme and optional/mandatory name fields. Luh exposes off/optional/required names and language dictionaries, with every built-in word overridable. Host lists define note kinds.
- [BugHerd's JavaScript installation](https://support.bugherd.com/en/articles/33871-installing-bugherd-using-javascript) describes an embedded script and same-browser account sign-in. Luh has a compiled browser entry and a plain custom element; the host decides whether a visitor needs an account.
- [Vercel's Toolbar academy](https://vercel.com/academy/vercel-foundations/toolbar) describes pinning comments on the page. Luh offers this direct spatial entry alongside ordinary written feedback in the same window.

## Package contract

- Compiled ESM and declaration files ship together. The browser registration entry is explicitly marked as a side effect so bundlers retain registration.
- A GitHub tag identifies each release before npm publication. Release tags include compiled files and require no dependency build scripts. An independently built tarball also supports local adoption.
- The demo uses only the public package and a local delivery hook. It exposes the received note without a hosted account or backend.
- Permission checks run before activating, opening or submitting; the service remains responsible for authorization.
- Failed submission preserves a draft. Successful submission emits a typed sent event; open and close events support host UI.
- Locale maps and CSS tokens work independently of the host framework. English remains a partial-translation fallback.

## Deliberate limits

- Luh supplies the feedback UI and note payload, not hosted queues, integrations, authentication, session replay or console collection.
- DOM-rendered screenshots are user-requested and may differ from the browser's pixels. Cross-origin assets and frames have browser limits.
- Automated API tests verify the package's configuration and delivery contract. Real browser and assistive-technology verification remains part of each host's integration review.
