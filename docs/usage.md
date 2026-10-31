# Using Luh

How a host opens the window, receives notes and listens for events.

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
