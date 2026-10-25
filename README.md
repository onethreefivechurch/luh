# Luh

Luh adds feedback to any website. Visitors can write a note straight away or point at an element first. Both paths use the same window, with optional screenshots and image annotations. The host receives one typed note and decides where it goes.

_Luh_ is Newfoundland for “look!”, said while pointing. Made by [135 Main Community Church](https://135main.org) (Springdale, Newfoundland), available under MIT.

## Install from GitHub

Luh is not published to npm. The repository is [onethreefivechurch/luh](https://github.com/onethreefivechurch/luh). Node 22.12 or newer is required to build; the browser has no Node dependency.

```sh
npm install github:onethreefivechurch/luh#v0.5.0
```

Release tags include compiled JavaScript and declarations, so GitHub installation needs no dependency build scripts. To build from source or make an installable tarball:

```sh
git clone --branch v0.5.0 https://github.com/onethreefivechurch/luh.git
cd luh
npm ci
npm test
npm run build
npm pack
# In the host project's folder:
npm install /path/to/luh/onethreefivechurch-luh-0.5.0.tgz
# Or:
pnpm add /path/to/luh/onethreefivechurch-luh-0.5.0.tgz
```

The tarball contains compiled ESM JavaScript and TypeScript declarations. No framework, runtime TypeScript compiler, Vue or hosted feedback account is required. Use a bundler such as Vite to resolve the package import in browser code.

## Write a note

```html
<button id="feedback" type="button">Send feedback</button>
<button id="pick" type="button">Luh!</button>
```

```ts
import { createCommentMode, type Note } from '@onethreefivechurch/luh';

const notes = createCommentMode({
  name: 'optional',
  kinds: [
    { value: 'bug', label: 'Bug', prompt: "What's wrong?" },
    { value: 'idea', label: 'Idea', prompt: "What's your idea?" },
  ],
  async onSubmit(note: Note) {
    const data = new FormData();
    data.append('body', note.body);
    if (note.name) data.append('name', note.name);
    if (note.kind) data.append('kind', note.kind);
    data.append('via', note.via);
    data.append('context', JSON.stringify(note.context));
    if (note.screenshot) data.append('screenshot', note.screenshot);
    for (const image of note.images) data.append('images[]', image);

    const response = await fetch('/feedback', {
      method: 'POST', body: data, credentials: 'same-origin',
    });
    if (!response.ok) return { error: 'Your note did not send. Please try again.' };
  },
});

document.querySelector('#feedback')!.addEventListener('click', event => notes.open({ from: event }));
document.querySelector('#pick')!.addEventListener('click', () => notes.toggle());
```

`onSubmit` resolves after the host accepts the note. Returning `{ error: string }` or throwing keeps the note open for retry. A successful `fetch()` alone is insufficient: check `response.ok`. Files must use `FormData` or another binary upload strategy; JSON serialization does not upload a `File`. The library sends nothing before submission.

Hosts offering in-window picking set `pickLabel`, for example `pickLabel: "Point"`. Point hides the window while the person selects an element, keeping the words, name, kind and image queue. Escape or the configured picking shortcut returns to the original draft. The initial page context stays captured at the original opening; the chosen element and selected words update. `state.open` remains true while Point is active. Revoking permission or disabling element picking restores the retained draft and hides Point; delivery still checks the current permission.

Image selection uses Uppy Core behind the existing feedback window. The multiple-image chooser, page-wide file drop, image paste and screenshot capture enter one queue. Images remain local until Send; editing and removal update that same queue. A refused send retains the words and images for retry. The `Note` fields remain unchanged.

A delivery hook can report actual transport progress through its second argument:

```ts
async onSubmit(note, { onProgress }) {
  return sendFeedback(note, {
    onUploadProgress: percent => onProgress(percent),
  });
}
```

`sendFeedback` represents the host's checked binary transport. `onProgress` accepts percentages from 0 to 100, clamps finite values and ignores callbacks after the draft closes. Existing one-argument hooks continue to work. Without reported progress, the window shows an indeterminate progress bar. Reaching 100% means the bytes have transferred; the window continues showing Sending until the hook resolves. The `submitUrl` fetch shortcut remains indeterminate because fetch supplies no upload-progress events. The progress bar has the public `upload-progress` shadow part.

An `onSubmit` hook takes precedence over `submitUrl`. The optional `submitUrl` shortcut uses the same multipart fields above, sends same-origin credentials, checks the HTTP status and displays a JSON `{ error: string }` response when available. The host owns the endpoint, validation, authentication, authorization, CSRF protection and spam control. Use `onSubmit` to add headers or another transport.

## Plain HTML, without a bundler

Build the library, then serve the **whole `dist/` directory** on your website; it includes the lazy screenshot chunk. Do not load a GitHub source `.ts` file or assume a package name resolves in a raw `<script>`.

```html
<script type="module" src="/assets/luh/browser.js"></script>
<luh-notes submit-url="/feedback" key="c"></luh-notes>
<button id="feedback" type="button">Send feedback</button>
<script type="module">
  await customElements.whenDefined('luh-notes');
  const notes = document.querySelector('luh-notes');
  notes.configure({ name: 'optional', screenshot: false });
  document.querySelector('#feedback').addEventListener('click', event => notes.open({ from: event }));
</script>
```

The `browser` entry registers `<luh-notes>`; it does not append a widget. The main entry registers only when `createCommentMode()` or `defineCommentMode()` is called. Configure an element directly or create it with the helper. Attributes support `submit-url`, `key`, `app-version` and `ignore`. Other settings use `configure()`. In SSR applications import this browser library only on the client, after mounting.

## Settings

| Option | Default | Meaning |
|---|---|---|
| `theme` | `'auto'` | `'light'`, `'dark'` or `'auto'` (browser preference). Host CSS tokens override palette defaults. |
| `icons` | Built-in SVGs | `Partial<Record<IconName, () => SVGSVGElement>>`; trusted passive SVG factories. |
| `trigger` | `false` | Optional in-flow button, labeled by `strings.trigger`, opening the ordinary note window. |
| `allowed` | `true` | Boolean or synchronous `() => boolean`; checked when opening, picking and submitting. A throwing callback denies access. |
| `name` | `'off'` | `'off'`, `'optional'` or `'required'`. Trimmed name reaches the hook as `note.name`; absent names are `null`. |
| `screenshot` | `true` | Offers page capture. Disabling it still allows uploading images. |
| `drawing` | `true` | Offers arrows, boxes, text, blur and crop on images. |
| `deactivateOnSubmit` | `true` | Turns comment mode off after the host accepts a note. `false` keeps picking on. Refusals and pending sends retain the mode and draft. |
| `elementPicking` | `true` | Enables picking by key, `toggle()` or `open({ element })`. Disabling it retains the ordinary note window. |
| `pickLabel` | None | Words for a window action that hides the draft so another part of the page can be picked; C or Escape returns to the draft. Absent, or with `elementPicking: false`, no action is shown. The `point` part styles it. |
| `language` | Page language | Language of the widget's labels and its `lang` attribute. |
| `languages` | English | Host locale dictionaries; every key accepts `Partial<Strings>`. |
| `strings` | English | Final label overrides, applied after the language map. |
| `kinds` | `[]` | Host-defined `{ value, label, prompt? }[]`. No kinds hides the choice; first kind is selected initially. |
| `key` | `'c'` | Keyboard shortcut for picking; `false` disables it. Ignored in text fields and with modifier keys. |
| `ignore` | None | CSS selector for elements excluded from picking and hidden in screenshots. Library UI is always excluded. |
| `context` | Empty object | Callback returning `Record<string, string>`, captured once at opening. |
| `appVersion` | Unset | Host version included in note context. |
| `screenshotNote` | None | `() => string \| null`, displayed beside the screenshot choice. |
| `finePrint` | None | Host text in the window footer. |
| `maxImages` | `8` | Maximum total screenshots and uploaded images. |
| `maxImageBytes` | `10485760` | Maximum bytes per image. PNG, JPEG and WebP accepted. |
| `thanks` | `true` | Displays “Sent. Thank you.” after successful delivery. |
| `onSubmit` | Unset | Delivery hook; resolves, throws or returns `{ error }`. |
| `submitUrl` | Unset | Optional generic multipart POST convenience. |

`configure(partialOptions)` merges settings. Structural changes (words, icons, trigger and feature controls) wait until an open note closes so its contents are retained; theme colors update immediately, and permission is checked immediately on the next action. Client-side `allowed` controls the UI, while the receiving service enforces real access.

## Languages and all words

English is built in. Hosts supply other languages; Luh falls back from the exact locale to its base locale, then English. Locale matching is case-insensitive. `strings` wins over both maps. The exported `STRINGS` object lists every label, hint, image-editor word, error and spoken element name. `{name}`, `{max}`, `{size}`, `{kind}`, `{number}` and `{label}` placeholders are preserved where used.

```ts
import { STRINGS, type Strings } from '@onethreefivechurch/luh';
const french: Partial<Strings> = {
  title: 'Votre avis', send: 'Envoyer', cancel: 'Annuler',
  nameOptional: 'Votre nom (facultatif)',
};
notes.configure({
  language: 'fr-CA',
  languages: { fr: french, 'fr-CA': { send: 'Transmettre' } },
  strings: { title: 'Parlez-nous de cette page' },
});
```

Hosts translate kind labels, kind prompts, fine print and their own delivery errors. `note.context.language` describes the page language independently of the widget's chosen language.

## Styling

Luh is styled for the host's website. Themes provide a starting palette; CSS tokens control shared values; stable shadow parts let the host style individual controls and layout. The library does not require its own trigger button or icons.

### Theme and tokens

```ts
const notes = createCommentMode({ theme: 'auto' });
notes.configure({ theme: 'dark' }); // applies immediately, including an open editor
```

`theme` accepts `'light'`, `'dark'` or `'auto'`. Auto follows the browser's `prefers-color-scheme` and updates when it changes. Existing `--luh-*` tokens always override the theme's color defaults, so a site with its own theme can keep those tokens or pass its current theme explicitly. A theme change retains the open draft.

```css
:root {
  --luh-accent: #2563eb;
  --luh-on-accent: #fff;
  --luh-bg: #fff;
  --luh-fg: #18181b;
  --luh-font: system-ui, sans-serif;
  --luh-radius: 12px;
}
```

Other tokens: `--luh-raised`, `--luh-muted`, `--luh-border`, `--luh-danger`, `--luh-warning`, `--luh-shadow`. Set document-wide values on `:root`. For per-widget values, set them on **both** `notes` and `notes.surface`, or give both hosts the same class. The two hosts are separate so the window works inside a site's modal dialog.

### Stable shadow parts

The widget exposes picker, toast and optional trigger parts through `luh-notes::part(...)`. Its detached window host is a public `<luh-surface>` element, available as `notes.surface`; window and drawing-editor parts are styled through `luh-surface::part(...)`. It moves between the document body and an open dialog while retaining its identity, classes and styles. There is no promise that `luh-notes::part(window)` reaches the separate host.

```css
luh-notes::part(trigger) { border-radius: 999px; }
luh-notes::part(outline) { outline-width: 3px; }
luh-surface::part(window) { border-radius: 6px; }
luh-surface::part(button) { border-radius: 4px; font-weight: 600; }
luh-surface::part(field) { border-radius: 4px; }
luh-surface::part(send) { background: #22543d; border-color: #22543d; color: white; }
luh-surface::part(send):hover { background: #17432d; }
luh-surface::part(icon) { width: 18px; height: 18px; }
luh-surface::part(editor) { border-radius: 0; }
luh-surface::part(tool) { border-radius: 4px; }
```

Public parts remain stable independently of internal CSS class names. Generic parts can match multiple elements; action parts target specific controls. Standard pseudo-classes such as `:hover`, `:disabled` and `:focus-visible` work after `::part(...)`.

| Host | Parts |
|---|---|
| `luh-notes` | `trigger`, `outline`, `outline-label`, `toast`, `announcement`, `icon`, `icon-pen` |
| `luh-surface`: window | `window`, `header`, `title`, `scroll`, `form`, `footer`, `move-handle`, `quote`, `kinds`, `kind` |
| `luh-surface`: fields and text | `field`, `body-field`, `name-field`, `label`, `text`, `small-text`, `fine-print`, `warning`, `error`, `error-message`, `shortcut`, `announcement` |
| `luh-surface`: buttons | `button`, `icon-button`, `primary`, `quiet`, `danger`, `send`, `cancel`, `close`, `wider`, `narrower`, `screenshot`, `point`, `add-images`, `draw`, `remove-image` |
| `luh-surface`: pictures | `images`, `image-row`, `image`, `image-name`, `thumbnail`, `image-actions`, `drop-zone` |
| `luh-surface`: discard | `discard-dialog`, `discard-text`, `keep-editing`, `discard` |
| `luh-surface`: editor | `editor`, `editor-header`, `editor-footer`, `editor-help`, `tools`, `tool`, `tool-label`, `tool-arrow`, `tool-box`, `tool-text`, `tool-blur`, `tool-crop`, `undo`, `redo`, `delete-mark`, `done`, `editor-cancel`, `editor-remove` |
| `luh-surface`: drawing | `drawing-stage`, `canvas`, `mark`, `selection`, `resize-handle`, `drawing-text`, `drawing-label`, `drawing-group`, `drawing-object`, `graphic`, `path`, `rectangle`, `line`, `circle`, `polygon`, `ellipse`, `polyline`, `symbol` |
| Both hosts | `group`, `icon`, and `icon-<name>` for icons actually rendered |

An editor's backdrop is addressable with `luh-surface::part(editor)::backdrop`. The library retains hidden states and accessibility labels; style overrides should preserve visible focus, text contrast and touch target sizes.

### Host-owned trigger, or optional library trigger

A host's own button is the natural fit when it already has a component library. No special attributes or wrapper are needed:

```ts
const notes = createCommentMode({ onSubmit: note => console.log(note) }); // standalone preview hook
const button = document.querySelector('#feedback');
button.addEventListener('click', event => notes.open({ from: event }));
// A separate host button can enable element picking:
document.querySelector('#pick').addEventListener('click', () => notes.toggle());
```

The optional `trigger: true` adds an in-flow button **inside** `<luh-notes>`, styled with `luh-notes::part(trigger)`. Its label is `strings.trigger` (default “Luh!”) and it opens the ordinary window. Place `<luh-notes>` where the button belongs, or use a part rule to position it. It is off by default. `allowed` applies to both trigger paths.

### Plain website with its own style

After serving the built `dist/` directory:

```html
<style>
  .site-feedback { --luh-font: Georgia, serif; --luh-accent: #22543d; --luh-on-accent: white; }
  luh-notes.site-feedback::part(trigger) { border-radius: 4px; }
  luh-surface.site-feedback::part(window) { border-radius: 4px; }
  luh-surface.site-feedback::part(button) { border-radius: 4px; }
  luh-surface.site-feedback::part(field) { border-radius: 2px; }
</style>
<luh-notes class="site-feedback"></luh-notes>
<script type="module">
  import { defineCommentMode } from '/assets/luh/index.js';
  defineCommentMode();
  const notes = document.querySelector('luh-notes');
  notes.surface.classList.add('site-feedback');
  notes.configure({ theme: 'light', trigger: true, onSubmit: note => console.log(note) });
</script>
```

This preview hook prints received notes. Replace it with the checked-fetch delivery hook above to store notes in the host's own service.

### Tailwind and Nuxt UI

Utility classes on an ordinary `<luh-notes>` do not cross its shadow boundary. Use the host's own button component for the trigger, and put `@apply` rules on the public parts in a **global** Tailwind stylesheet. Nuxt UI supplies the button; Luh remains client-side and framework-free.

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import type { CommentModeElement } from '@onethreefivechurch/luh';
let notes: CommentModeElement | undefined;
let disposed = false;
onMounted(async () => {
  const { createCommentMode } = await import('@onethreefivechurch/luh');
  if (disposed) return;
  notes = createCommentMode({ theme: 'auto', onSubmit: note => console.log(note) });
  notes.classList.add('product-feedback');
  notes.surface.classList.add('product-feedback');
});
onBeforeUnmount(() => { disposed = true; notes?.remove(); });
</script>
<template>
  <UButton icon="i-lucide-message-square" @click="notes?.open({ from: $event })">Send feedback</UButton>
</template>
```

In the host's global `app.css`, after its Tailwind and Nuxt UI imports:

```css
.product-feedback {
  --luh-accent: var(--ui-primary);
  --luh-on-accent: var(--ui-bg);
  --luh-bg: var(--ui-bg);
  --luh-raised: var(--ui-bg-elevated);
  --luh-fg: var(--ui-text);
  --luh-muted: var(--ui-text-muted);
  --luh-border: var(--ui-border);
}
luh-surface.product-feedback::part(button) { @apply rounded-md font-medium; }
luh-surface.product-feedback::part(field) { @apply rounded-md; }
luh-surface.product-feedback::part(window) { @apply rounded-xl; }
luh-surface.product-feedback::part(tool) { @apply rounded-md; }
```

These examples use host-owned delivery hooks; neither includes a backend. For dark/light control from the host, call `notes.configure({ theme: 'dark' })` or `'light'` when its theme changes; CSS tokens can update without rebuilding the widget. Nuxt UI primary colors vary with the host's theme, so choose `--luh-on-accent` to maintain contrast in that theme.

### Host icons

Each icon can be replaced by a typed factory that returns an SVG root. Factories are **trusted host code**, not user-provided strings. Luh never parses HTML strings; it clones returned SVGs per use and makes them decorative so the button's text supplies its accessible name. Return passive shapes, with no scripts, event attributes, embedded HTML or external-resource references.

```ts
import type { IconOverrides } from '@onethreefivechurch/luh';
const icons: IconOverrides = {
  send: () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', 'M3 12h17m-6-6 6 6-6 6');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    svg.append(path);
    return svg;
  },
};
notes.configure({ icons });
```

Icon names: `close`, `camera`, `image`, `pen`, `send`, `up`, `down`, `arrow`, `box`, `text`, `blur`, `crop`, `undo`, `redo`, `trash`, `grip`. Unspecified icons keep their defaults. Replacements reach the optional trigger, note window and drawing editor. Style all icons through `::part(icon)` or one icon through `::part(icon-send)` (and equivalent names).

A completely headless renderer is a possible future mode; this release supplies the accessible window and editor, with host-owned triggers, tokens, parts and icons.

## Note and events

`Note` contains:

- `body`: trimmed note text; `kind`: selected value or `null`; `name`: trimmed name or `null`.
- `via`: `'write'` or `'pick'`.
- `screenshot`: `File | null` named `page.png`; `images`: uploaded images and the optional `element.png` crop.
- `context`: URL, pathname, document title, page language, viewport width/height/pixel ratio, light/dark scheme, ISO opening time, optional app version and dialog title, host `extra` fields.
- `context.element`: optional selector, id, text, role and spoken name. Input text describes the label, not its current value.
- `context.selectedText`: optional selected words, visible in the window before submission.

Events are non-bubbling `CustomEvent`s on the widget. Typed `addEventListener()` overloads infer `event.detail`:

```ts
notes.addEventListener('open', event => console.log(event.detail.url)); // NoteContext
notes.addEventListener('close', event => console.log(event.detail.open)); // CommentModeState
notes.addEventListener('sent', event => console.log(event.detail.body)); // Note
notes.addEventListener('change', event => console.log(event.detail.active)); // CommentModeState
```

A normal successful cycle emits `open`, `sent`, then `close`. Failures emit no `sent`. `close` fires for cancellation and successful submission. `change` tracks `{ active, open, capturing }`. Lifecycle events can power host UI; they are not a second delivery mechanism.

`open({ from?, element?, selectedText? })` accepts an opener element or click event for focus restoration. `element` opens a picked note directly. `close()` discards immediately; the window's Cancel button asks before discarding a draft. `toggle(force?)` switches picking. `active`, `isOpen`, `state`, `allowed` and `options` expose current state. `elementName(element, strings?)` provides a spoken element description. `defineCommentMode(tag?)` registers a custom tag idempotently. Remove the element to release its listeners.

## Keeping private data out

Luh is private by default, in the way Sentry Session Replay and FullStory are: what a person types is never in a screenshot, and a host marks the rest once. Redaction is painted into the picture's own pixels in the browser, before the picture reaches the note window, so the preview the person sees is exactly what is sent. The person can cover more with **Blur** before sending.

### Mark areas in the markup

```html
<section data-luh="blur">Salary: $85,000</section>   <!-- words unreadable, layout kept -->
<aside data-luh="hide">…</aside>                       <!-- the whole area blanked -->
```

Children inherit the mark, and `hide` wins over `blur`. The attribute name is a setting: `privacyAttribute: 'data-private'` reads `data-private="blur"` and `data-private="hide"` instead.

### Or list selectors

For screens whose markup the host cannot change:

```ts
createCommentMode({
  redact: {
    blur: ['.contact-email', '.contact-phone', '[data-field="salary"]'],
    hide: ['.payroll-table'],
  },
});
```

Each is a list or one string. A selector the browser cannot parse is skipped on its own; the rest still apply.

### Typed fields

Inputs, text areas, choices and editable text are hidden by default; buttons, check boxes, radio buttons, sliders and colour pickers are not. `maskInputs: false` shows typed fields (passwords stay blank either way).

### Pages

```ts
createCommentMode({
  pages: [
    { match: '/payroll/*', mode: 'off' },          // Luh does not open here
    { match: /\/people\/\d+/, mode: 'blur' },     // every screenshot blurred whole
    { match: url => url.searchParams.has('token'), mode: 'off' },
  ],
});
```

A string matches the path, with `*` for any run of characters; a string containing `://` matches the whole address. A regular expression is tested against the whole address; a function receives a `URL`. The first matching rule wins, and a rule that throws counts as `off`. Rules are read at every action, so single-page apps need no extra wiring; `allowed` turns false on `off` pages, so a host can hide its own button with it. `pageMode(pages, href)` is exported for hosts that want the answer themselves.

### Strength and colour

| Option | Default | Meaning |
|---|---|---|
| `privacyAttribute` | `'data-luh'` | Attribute whose `blur` or `hide` value marks a private area. |
| `redact` | None | `{ blur?, hide? }`: CSS selectors, a string or a list each. |
| `maskInputs` | `true` | Hide what is typed or chosen in fields. |
| `blurStrength` | `12` | Size of the blur's squares in CSS pixels; never less than 6. |
| `hideColor` | `'#d4d4d8'` | Colour painted over hidden areas. |
| `pages` | None | Page rules: `{ match, mode: 'off' \| 'blur' }`. |

### What else stays out

- Private words are scrambled in the copy of the page that is drawn, before any pixel exists, and the area is then painted over in the finished picture: two locks, so a rendering quirk cannot reveal what a missed paint would.
- A picked element's words leave out its private parts; picking a private area sends no words. Selected words that touch a private area are not sent.
- If redaction cannot be completed, no screenshot is produced at all.
- The window says how many private areas were covered, or that the whole page was blurred.

### Limits

Redaction covers the light DOM of the page. Content inside closed shadow roots, cross-origin frames and canvases cannot be inspected by selector; mark the element that holds them. Blur and hide cover the area on screen when the screenshot is taken; content scrolled into view later is in a later screenshot, redacted then. The page address, the document title and uploaded images are sent as they are: a page whose title or address names a person can use `mode: 'off'`. Luh's checks protect what leaves the browser; who may see a note afterwards is the receiving service's decision.

The browser test suite (`npm run test:browser`) draws a page in Chromium, sends a screenshot, and checks the sent PNG by its pixels and by OCR (tesseract) for a marked element, a hidden area, a selector, a typed field and a blurred page, with a readable public line as the control.

## Screenshots and limits

Screenshots are requested by the person, rendered from the DOM with `modern-screenshot`, and previewed before sending. They include the visible viewport and an outlined pick, plus a cropped picked element when possible. This is not the browser's native screen-sharing API: cross-origin images, embedded frames, video, canvas, fonts or unusual CSS may render differently or be unavailable. A failed capture leaves the words intact and permits sending without a screenshot.

Private areas are covered as described in [Keeping private data out](#keeping-private-data-out). Hosts decide whether screenshots are appropriate and explain their policy through `screenshotNote`; `ignore` leaves elements out of pictures and picking entirely. Uploaded images and the page URL may also contain private data. The library does not collect console logs, replay sessions, automatically capture screenshots, store notes, or send analytics.

Image editing uses arrows, boxes, text, blur and crop, with undo/redo and selectable marks. Blur is visual redaction, not a guarantee against reconstruction; hosts requiring irreversible redaction should remove sensitive regions before upload. Picking describes light-DOM elements; shadow-root interiors and cross-origin frames are not supported targets.

The window supports keyboard navigation, Escape, Ctrl/⌘+Enter, labeled controls and focus restoration. Validate the exact host journey on its supported browsers and assistive technology; DOM tests do not establish accessibility certification.

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

See [adoption research](docs/adoption.md) for reference patterns and [CHANGELOG.md](CHANGELOG.md) for version changes. Versioning follows SemVer; the `0.x` series remains pre-1.0, and breaking public API changes increment the minor version.
