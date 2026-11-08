# Settings

Every option `createCommentMode()` and `configure()` accept, and how to translate the window.

## Settings

| Option | Default | Meaning |
|---|---|---|
| `theme` | `'auto'` | `'light'`, `'dark'` or `'auto'` (browser preference). Host CSS tokens override palette defaults. |
| `icons` | Built-in SVGs | `Partial<Record<IconName, () => SVGSVGElement>>`; trusted passive SVG factories. |
| `trigger` | `false` | Optional in-flow button, labeled by `strings.trigger`, opening the ordinary note window. |
| `allowed` | `true` | Boolean or synchronous `() => boolean`; checked when opening, picking and submitting. A throwing callback denies access. |
| `name` | `'off'` | `'off'`, `'optional'` or `'required'`. Trimmed name reaches the hook as `note.name`; absent names are `null`. |
| `screenshot` | `true` | Offers page capture. Disabling it still allows uploading images. |
| `voice` | `true` | Offers a microphone when the browser has `SpeechRecognition` or `webkitSpeechRecognition`. Uses the browser’s own speech service only after a tap; `false` hides it. |
| `drawing` | `true` | Offers a freehand pen, arrows, boxes, text, blur and crop on images. |
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

Voice typing uses `language` for recognition and falls back to the browser language when it is empty. The `voiceStart`, `voiceStop`, `voiceListening`, `voiceFinishing`, `voiceFailed` and `pen` strings translate the new controls and messages.

Hosts translate kind labels, kind prompts, fine print and their own delivery errors. `note.context.language` describes the page language independently of the widget's chosen language.
