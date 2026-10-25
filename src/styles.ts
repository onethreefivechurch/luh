import { NAME } from "./name";

// The library's look, inside its own shadow roots so no site's styles reach
// it. A site themes it through these custom properties (named for NAME, so
// --luh-accent and so on), set on :root to reach both the element and
// the separate window host (which moves into the body or an open dialog):
//
//   --${NAME}-accent      buttons, the outline, focus rings
//   --${NAME}-on-accent   words on the accent
//   --${NAME}-bg          the window
//   --${NAME}-raised      the drawing editor's surround, hovers
//   --${NAME}-fg          words
//   --${NAME}-muted       quieter words
//   --${NAME}-border      lines
//   --${NAME}-danger      errors and Discard
//   --${NAME}-warning     the screenshot note
//   --${NAME}-radius      the window's corners
//   --${NAME}-font        the typeface
//   --${NAME}-shadow      the window's shadow
export const CSS = String.raw`
:host, .cm-root {
  color-scheme: light;
  --cm-default-accent: #2563eb;
  --cm-default-on-accent: #ffffff;
  --cm-default-bg: #ffffff;
  --cm-default-raised: #f4f4f5;
  --cm-default-fg: #18181b;
  --cm-default-muted: #52525b;
  --cm-default-border: #e4e4e7;
  --cm-default-danger: #dc2626;
  --cm-default-warning: #a16207;
  --cm-accent: var(--${NAME}-accent, var(--cm-default-accent));
  --cm-on-accent: var(--${NAME}-on-accent, var(--cm-default-on-accent));
  --cm-bg: var(--${NAME}-bg, var(--cm-default-bg));
  --cm-raised: var(--${NAME}-raised, var(--cm-default-raised));
  --cm-fg: var(--${NAME}-fg, var(--cm-default-fg));
  --cm-muted: var(--${NAME}-muted, var(--cm-default-muted));
  --cm-border: var(--${NAME}-border, var(--cm-default-border));
  --cm-danger: var(--${NAME}-danger, var(--cm-default-danger));
  --cm-warning: var(--${NAME}-warning, var(--cm-default-warning));
  --cm-radius: var(--${NAME}-radius, 12px);
  --cm-font: var(--${NAME}-font, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  --cm-shadow: var(--${NAME}-shadow, 0 12px 32px -8px rgb(0 0 0 / 0.22), 0 2px 6px -1px rgb(0 0 0 / 0.08));
  --cm-control: 36px;
  cursor: auto;
  font-family: var(--cm-font);
  color: var(--cm-fg);
}
/* Public theme defaults never assign --luh tokens: host overrides keep precedence. */
:host([data-luh-theme="dark"]) {
  color-scheme: dark;
  --cm-default-accent: #60a5fa;
  --cm-default-on-accent: #09090b;
  --cm-default-bg: #18181b;
  --cm-default-raised: #27272a;
  --cm-default-fg: #fafafa;
  --cm-default-muted: #a1a1aa;
  --cm-default-border: #52525b;
  --cm-default-danger: #f87171;
  --cm-default-warning: #fbbf24;
}
@media (pointer: coarse) {
  :host, .cm-root { --cm-control: 44px; }
}
* { box-sizing: border-box; }
[hidden] { display: none !important; }
.cm-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}
.cm-icon { width: 16px; height: 16px; flex: none; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--cm-accent); outline-offset: 2px; }
::selection { background: color-mix(in oklab, var(--cm-accent) 25%, transparent); }

/* Popovers in the top layer start with the browser's own box; reset it. */
[popover] { margin: 0; padding: 0; border: 0; background: none; color: inherit; overflow: visible; inset: auto; }

/* ---------- The outline over what the pointer is on ---------- */
.cm-outline {
  position: fixed;
  pointer-events: none;
  outline: 2px solid var(--cm-accent);
  outline-offset: 2px;
  border-radius: 4px;
  background: color-mix(in oklab, var(--cm-accent) 8%, transparent);
  transition: left 80ms ease-out, top 80ms ease-out, width 80ms ease-out, height 80ms ease-out;
}
.cm-outline.cm-pinned { outline-width: 3px; background: none; }
.cm-outline-name {
  position: absolute;
  left: -2px;
  bottom: calc(100% + 6px);
  max-width: min(22rem, 90vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--cm-accent);
  color: var(--cm-on-accent);
  font: 500 12px/16px var(--cm-font);
}
.cm-outline-name.cm-below { bottom: auto; top: calc(100% + 6px); }
@media (prefers-reduced-motion: reduce) { .cm-outline { transition: none; } }

/* ---------- The note window ---------- */
.cm-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--cm-bg);
  color: var(--cm-fg);
  border: 1px solid var(--cm-border);
  border-radius: var(--cm-radius);
  box-shadow: var(--cm-shadow);
  font: 14px/20px var(--cm-font);
  overflow: hidden;
  animation: cm-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes cm-in { from { opacity: 0; transform: translateY(4px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) { .cm-window { animation: none; } }
.cm-header {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 6px 6px 4px;
  cursor: move;
  touch-action: none;
  user-select: none;
}
.cm-handle-bar {
  display: grid;
  place-items: center;
  width: 24px;
  height: var(--cm-control);
  color: var(--cm-muted);
  border-radius: 6px;
  flex: none;
}
.cm-title {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}
.cm-icon-button {
  display: grid;
  place-items: center;
  width: var(--cm-control);
  height: var(--cm-control);
  flex: none;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--cm-muted);
  cursor: pointer;
}
.cm-icon-button:hover:not(:disabled) { background: var(--cm-raised); color: var(--cm-fg); }
.cm-icon-button:disabled { opacity: 0.4; cursor: default; }
.cm-scroll { min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.cm-form { display: flex; flex-direction: column; gap: 12px; padding: 4px 16px 16px; }
.cm-quote {
  margin: 0;
  padding: 2px 0 2px 10px;
  border-left: 2px solid var(--cm-accent);
  color: var(--cm-muted);
  font-style: italic;
  max-height: 5lh;
  overflow: auto;
  overflow-wrap: anywhere;
}
.cm-kinds { display: flex; flex-wrap: wrap; gap: 6px; }
.cm-chip {
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid var(--cm-border);
  border-radius: 999px;
  background: var(--cm-bg);
  font-weight: 500;
  cursor: pointer;
}
@media (pointer: coarse) { .cm-chip { min-height: 44px; } }
.cm-chip:hover:not(:disabled) { background: var(--cm-raised); }
.cm-chip[aria-checked="true"] { background: var(--cm-accent); border-color: var(--cm-accent); color: var(--cm-on-accent); }
.cm-field {
  display: block;
  width: 100%;
  min-height: 84px;
  resize: none;
  padding: 10px 12px;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  background: var(--cm-bg);
  color: var(--cm-fg);
  font: 16px/24px var(--cm-font);
}
input.cm-field { min-height: var(--cm-control); height: var(--cm-control); padding: 6px 10px; }
.cm-field::placeholder { color: var(--cm-muted); opacity: 1; }
.cm-field:focus { outline: none; border-color: var(--cm-accent); box-shadow: 0 0 0 3px color-mix(in oklab, var(--cm-accent) 22%, transparent); }
.cm-images { list-style: none; margin: 0; padding: 0; border: 1px solid var(--cm-border); border-radius: 8px; }
.cm-image { display: flex; align-items: center; gap: 8px; padding: 6px 4px 6px 6px; }
.cm-image + .cm-image { border-top: 1px solid var(--cm-border); }
.cm-image .cm-button { padding-inline: 8px; }
.cm-thumb { padding: 0; border: 1px solid var(--cm-border); border-radius: 6px; background: var(--cm-raised); cursor: pointer; flex: none; overflow: hidden; }
.cm-thumb img { display: block; width: 40px; height: 40px; object-fit: cover; object-position: top; }
.cm-image-name { flex: 1; min-width: 5.5em; overflow-wrap: anywhere; font-weight: 500; }
.cm-picture-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.cm-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: var(--cm-control);
  padding: 0 12px;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  background: var(--cm-bg);
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
}
.cm-button:hover:not(:disabled) { background: var(--cm-raised); }
.cm-button:disabled { opacity: 0.5; cursor: default; }
.cm-button.cm-quiet { border-color: transparent; background: none; }
.cm-button.cm-quiet:hover:not(:disabled) { background: var(--cm-raised); }
.cm-button.cm-primary { background: var(--cm-accent); border-color: var(--cm-accent); color: var(--cm-on-accent); }
.cm-button.cm-primary:hover:not(:disabled) { background: color-mix(in oklab, var(--cm-accent) 88%, black); }
.cm-button.cm-danger { background: var(--cm-danger); border-color: var(--cm-danger); color: #fff; }
.cm-button[aria-busy="true"] { cursor: progress; }
.cm-kbd { font: 500 12px/16px var(--cm-font); opacity: 0.75; margin-inline-start: 2px; }
.cm-window progress { width: 100%; accent-color: var(--cm-accent); }
.cm-small { margin: -6px 0 0; color: var(--cm-muted); font-size: 13px; line-height: 18px; }
.cm-warning { margin: 0; color: var(--cm-warning); }
.cm-covered { margin: 0; }
.cm-error { margin: 0; color: var(--cm-danger); }
.cm-error-box {
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: color-mix(in oklab, var(--cm-danger) 10%, var(--cm-bg));
  color: var(--cm-danger);
}
.cm-footer, .cm-confirm {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--cm-border);
}
.cm-fine { flex: 1; min-width: 0; margin: 0; }
.cm-spacer { flex: 1; }
.cm-confirm { background: var(--cm-raised); }
.cm-confirm-text { flex: 1; margin: 0; font-weight: 600; }

.cm-drop {
  position: fixed;
  inset: 8px;
  display: grid;
  place-items: center;
  border: 2px dashed var(--cm-accent);
  border-radius: 16px;
  background: color-mix(in oklab, var(--cm-accent) 10%, transparent);
  color: var(--cm-accent);
  font: 600 18px/24px var(--cm-font);
  pointer-events: none;
}
.cm-toast {
  position: fixed;
  inset: auto auto 24px 50%;
  translate: -50% 0;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--cm-fg);
  color: var(--cm-bg);
  font: 500 14px/20px var(--cm-font);
  box-shadow: var(--cm-shadow);
}

/* ---------- The drawing editor ---------- */
.cm-editor[open] {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: var(--cm-raised);
  color: var(--cm-fg);
  font: 14px/20px var(--cm-font);
}
.cm-editor::backdrop { background: rgb(0 0 0 / 0.4); }
.cm-editor-bar, .cm-editor-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--cm-bg);
}
.cm-editor-bar { border-bottom: 1px solid var(--cm-border); }
.cm-editor-footer { border-top: 1px solid var(--cm-border); }
.cm-tools { display: flex; gap: 2px; padding: 2px; border-radius: 10px; background: var(--cm-raised); }
.cm-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: var(--cm-control);
  min-width: var(--cm-control);
  justify-content: center;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  font-weight: 500;
  cursor: pointer;
}
.cm-tool:hover:not(:disabled) { background: var(--cm-bg); }
.cm-tool[aria-pressed="true"] { background: var(--cm-bg); color: var(--cm-accent); box-shadow: 0 1px 2px rgb(0 0 0 / 0.12); }
.cm-tool:disabled { opacity: 0.4; cursor: default; }
@media (max-width: 640px) { .cm-tool-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); } }
.cm-stage { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 16px; }
.cm-canvas {
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgb(0 0 0 / 0.16);
  touch-action: none;
  user-select: none;
  cursor: crosshair;
  background: var(--cm-bg);
}
.cm-canvas[data-tool="text"] { cursor: text; }
.cm-canvas[data-over="mark"] { cursor: move; }
.cm-canvas[data-over="handle"] { cursor: grab; }
.cm-mark { outline: none; }
.cm-mark:focus-visible > * { filter: drop-shadow(0 0 3px var(--cm-accent)); }
.cm-selection { stroke: var(--cm-accent); }
.cm-handle { fill: #fff; stroke: var(--cm-accent); }
.cm-words { width: 100%; padding: 0; border: 0; background: transparent; font-family: system-ui, sans-serif; font-weight: 600; outline: none; }
.cm-editor-help { margin: 0; padding: 0 16px 8px; text-align: center; color: var(--cm-muted); font-size: 13px; }
@media (pointer: coarse) { .cm-editor-help { display: none; } }
`;

// Outside any shadow root: the page's cursor while picking.
export const PAGE_CSS = String.raw`
html.${NAME}-picking, html.${NAME}-picking *:not([data-${NAME}]) {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z' fill='%23fff' stroke='%2318181b' stroke-width='1.5' stroke-linejoin='round'/%3E%3C/svg%3E") 3 21, crosshair !important;
}
`;
