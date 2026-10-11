# Luh

Luh adds feedback to any website. Visitors can write a note straight away or point at an element first. Both paths use the same window, with optional screenshots and image annotations. The host receives one typed note and decides where it goes.

_Luh_ is Newfoundland for “look!”, said while pointing. Made by [Community Church, Springdale](https://135main.org), available under MIT.

## Install from GitHub

Luh is not published to npm. The repository is [onethreefivechurch/luh](https://github.com/onethreefivechurch/luh). Node 22.12 or newer is required to build; the browser has no Node dependency.

```sh
npm install github:onethreefivechurch/luh#v0.2.0
```

Release tags include compiled JavaScript and declarations, so GitHub installation needs no dependency build scripts. To build from source or make an installable tarball:

```sh
git clone --branch v0.2.0 https://github.com/onethreefivechurch/luh.git
cd luh
npm ci
npm test
npm run build
npm pack
# In the host project's folder:
npm install /path/to/luh/onethreefivechurch-luh-0.2.0.tgz
# Or:
pnpm add /path/to/luh/onethreefivechurch-luh-0.2.0.tgz
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
| `allowed` | `true` | Boolean or synchronous `() => boolean`; checked when opening, picking and submitting. A throwing callback denies access. |
| `name` | `'off'` | `'off'`, `'optional'` or `'required'`. Trimmed name reaches the hook as `note.name`; absent names are `null`. |
| `screenshot` | `true` | Offers page capture. Disabling it still allows uploading images. |
| `drawing` | `true` | Offers arrows, boxes, text, blur and crop on images. |
| `elementPicking` | `true` | Enables picking by key, `toggle()` or `open({ element })`. Disabling it retains the ordinary note window. |
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

`configure(partialOptions)` merges settings. Visual changes wait until an open note closes so its contents are retained; permission is checked immediately on the next action. Client-side `allowed` controls the UI, while the receiving service enforces real access.

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

## Theme

CSS variables inherit from the document or the widget's ancestors into its Shadow DOM. The window is hosted in the document body, or inside an open dialog. Set tokens on `:root` for consistent styling across both locations.

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

Other tokens: `--luh-raised`, `--luh-muted`, `--luh-border`, `--luh-danger`, `--luh-warning`, `--luh-shadow`. Light is the default. Hosts set dark tokens explicitly; the demo shows both.

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

## Screenshots and limits

Screenshots are requested by the person, rendered from the DOM with `modern-screenshot`, and previewed before sending. They include the visible viewport and an outlined pick, plus a cropped picked element when possible. This is not the browser's native screen-sharing API: cross-origin images, embedded frames, video, canvas, fonts or unusual CSS may render differently or be unavailable. A failed capture leaves the words intact and permits sending without a screenshot.

Passwords are blanked. Other visible content, including non-password field values, can appear. Hosts mark sensitive regions with `ignore`, decide whether screenshots are appropriate and explain their policy through `screenshotNote`. Uploaded images and the page URL may also contain private data. The library does not collect console logs, replay sessions, automatically capture screenshots, store notes, or send analytics.

Image editing uses arrows, boxes, text, blur and crop, with undo/redo and selectable marks. Blur is visual redaction, not a guarantee against reconstruction; hosts requiring irreversible redaction should remove sensitive regions before upload. Picking describes light-DOM elements; shadow-root interiors and cross-origin frames are not supported targets.

The window supports keyboard navigation, Escape, Ctrl/⌘+Enter, labeled controls and focus restoration. Validate the exact host journey on its supported browsers and assistive technology; DOM tests do not establish accessibility certification.

## Demo and development

```sh
npm ci
npm run demo
# Open the local URL Vite prints. Notes stay on the page.
npm run typecheck
npm test
npm run build
npm run demo:build
```

The demo has its own page, buttons and delivery hook. `pnpm install`, `pnpm test`, `pnpm run build` and `pnpm demo` also work from this repository. No app checkout, credentials or backend are required. The automated public API suite checks permissions, feature switches, names, language overrides, lifecycle events, failed delivery, multipart uploads, disconnection and concurrent-note isolation. Drawing geometry has its own tests.

See [adoption research](docs/adoption.md) for reference patterns and [CHANGELOG.md](CHANGELOG.md) for version changes. Versioning follows SemVer; the `0.x` series remains pre-1.0, and breaking public API changes increment the minor version.
