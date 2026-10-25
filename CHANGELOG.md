# Changelog

## 0.5.0

- Private by default: typed fields are hidden in screenshots unless `maskInputs: false`.
- `data-luh="blur"` and `data-luh="hide"` mark private areas, inherited by children; the attribute name is the `privacyAttribute` setting.
- `redact: { blur, hide }` selector lists cover markup a host cannot change.
- `pages` rules turn Luh off on matching pages, or blur every screenshot there whole. `pageMode()` is exported.
- Redaction is painted into the picture's pixels in the browser, after the page copy's private words are scrambled; a failed redaction produces no screenshot. The preview is the picture that is sent.
- `blurStrength` (default 12, minimum 6) and `hideColor` settings.
- Picked and selected words leave out private areas.
- The window says how many private areas were covered, and each picture has a **Blur** action that opens the editor with Blur chosen.
- The library's own `[data-luh]` marker no longer matches `data-luh="blur"` or `"hide"`.
- Browser tests check the sent PNG by pixels and OCR.

## 0.4.2

- Picking another target keeps every image in the draft, including screenshots taken before the pick. Images leave only when the person removes them.

## 0.4.1

- Optional `pickLabel` adds a window action to point at another part of the page. The draft's text, kind and images stay in the window, and cancelling or denied permission returns to it.

## 0.4.0

- Comment mode turns off after an accepted send by default. `deactivateOnSubmit: false` retains continuous picking.
- Pending or refused sends keep the mode and draft. A late acknowledgement does not deactivate a newer draft.

## 0.3.0

- Light, dark and automatic palettes update across picker, note window and image editor while preserving host CSS tokens.
- Stable shadow parts and the public detached `luh-surface` host support host-owned control and layout styles.
- Typed SVG factories replace icons across the optional trigger, note window and drawing tools.
- An optional styleable trigger opens ordinary feedback; existing host buttons remain independent.
- Styling examples cover plain websites, Tailwind and Nuxt UI, with verified browser part styling.
- Attribution names 135 Main Community Church in Springdale, Newfoundland.

## 0.2.0

- Standalone package builds ESM JavaScript, declaration types and a browser registration entry.
- Hosts configure access, name collection, screenshots, drawing and element picking.
- Language dictionaries merge base and exact locales with final label overrides.
- Typed open, close, sent and change events expose lifecycle details.
- Public API tests cover delivery failures, permissions, names, feature switches and lifecycle isolation.
- A standalone demo and GitHub installation instructions support independent adoption.

## 0.1.0

- Initial framework-free note window, element picker, optional screenshot capture and image editor.
- One host delivery hook, configurable kinds, context, translated words and CSS theme tokens.
