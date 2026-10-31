# Styling

Make the window look like the host site: themes, CSS tokens, shadow parts, triggers and icons.

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

This preview hook prints received notes. Replace it with the checked delivery hook in [Using Luh](usage.md#write-a-note) to store notes in the host's own service.

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
