# Privacy and screenshots

What Luh keeps out of screenshots and notes, and what it cannot cover.

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
- The page title is left out when it repeats words from a private area (a page titled with the person it is about), and on blurred pages.
- If redaction cannot be completed, no screenshot is produced at all.
- The window says how many private areas were covered, or that the whole page was blurred.

### Limits

Redaction covers the light DOM of the page. Content inside closed shadow roots, cross-origin frames and canvases cannot be inspected by selector; mark the element that holds them. Blur and hide cover the area on screen when the screenshot is taken; content scrolled into view later is in a later screenshot, redacted then. The page address and uploaded images are sent as they are: a page whose address names a person can use `mode: 'off'`. Luh's checks protect what leaves the browser; who may see a note afterwards is the receiving service's decision.

The browser test suite (`npm run test:browser`) draws a page in Chromium, sends a screenshot, and checks the sent PNG by its pixels and by OCR (tesseract) for a marked element, a hidden area, a selector, a typed field and a blurred page, with a readable public line as the control.

## Screenshots and limits

Screenshots are requested by the person, rendered from the DOM with `modern-screenshot`, and previewed before sending. They include the visible viewport and an outlined pick, plus a cropped picked element when possible. This is not the browser's native screen-sharing API: cross-origin images, embedded frames, video, canvas, fonts or unusual CSS may render differently or be unavailable. A failed capture leaves the words intact and permits sending without a screenshot.

Private areas are covered as described in [Keeping private data out](#keeping-private-data-out). Hosts decide whether screenshots are appropriate and explain their policy through `screenshotNote`; `ignore` leaves elements out of pictures and picking entirely. Uploaded images and the page URL may also contain private data. The library does not collect console logs, replay sessions, automatically capture screenshots, store notes, or send analytics.

Image editing uses arrows, boxes, text, blur and crop, with undo/redo and selectable marks. Blur is visual redaction, not a guarantee against reconstruction; hosts requiring irreversible redaction should remove sensitive regions before upload. Picking describes light-DOM elements; shadow-root interiors and cross-origin frames are not supported targets.

The window supports keyboard navigation, Escape, Ctrl/⌘+Enter, labeled controls and focus restoration. Validate the exact host journey on its supported browsers and assistive technology; DOM tests do not establish accessibility certification.
