/** Stable CSS shadow parts. Internal classes are mapped explicitly to public names. */
export const PARTS = {
  "cm-window": "window",
  "cm-header": "header",
  "cm-title": "title",
  "cm-scroll": "scroll",
  "cm-form": "form",
  "cm-footer": "footer",
  "cm-handle-bar": "move-handle",
  "cm-field": "field",
  "cm-kinds": "kinds",
  "cm-chip": "kind",
  "cm-quote": "quote",
  "cm-images": "images",
  "cm-image": "image-row",
  "cm-image-name": "image-name",
  "cm-thumb": "thumbnail",
  "cm-picture-actions": "image-actions",
  "cm-button": "button",
  "cm-icon-button": "icon-button",
  "cm-primary": "primary",
  "cm-quiet": "quiet",
  "cm-danger": "danger",
  "cm-kbd": "shortcut",
  "cm-small": "small-text",
  "cm-warning": "warning",
  "cm-fine": "fine-print",
  "cm-error": "error",
  "cm-error-box": "error-message",
  "cm-confirm": "discard-dialog",
  "cm-confirm-text": "discard-text",
  "cm-drop": "drop-zone",
  "cm-toast": "toast",
  "cm-editor": "editor",
  "cm-editor-bar": "editor-header",
  "cm-editor-footer": "editor-footer",
  "cm-editor-help": "editor-help",
  "cm-tools": "tools",
  "cm-tool": "tool",
  "cm-tool-label": "tool-label",
  "cm-stage": "drawing-stage",
  "cm-canvas": "canvas",
  "cm-mark": "mark",
  "cm-selection": "selection",
  "cm-handle": "resize-handle",
  "cm-words": "drawing-text",
  "cm-outline": "outline",
  "cm-outline-name": "outline-label",
  "cm-sr": "announcement",
  "cm-trigger": "trigger",
} as const;

const TAG_PARTS: Record<string, string> = {
  button: "button",
  input: "field",
  textarea: "field",
  label: "label",
  p: "text",
  span: "text",
  img: "image",
  image: "image",
  polygon: "polygon",
  ellipse: "ellipse",
  polyline: "polyline",
  use: "symbol",
  svg: "graphic",
  path: "path",
  rect: "rectangle",
  line: "line",
  text: "drawing-label",
  g: "drawing-group",
  circle: "circle",
  foreignobject: "drawing-object",
  div: "group",
  header: "header",
};

export function exposeParts(element: Element) {
  const names = new Set((element.getAttribute("part") ?? "").split(/\s+/).filter(Boolean));
  const tagPart = TAG_PARTS[element.localName.toLowerCase()];
  if (tagPart) names.add(tagPart);
  for (const className of element.classList) {
    const part = PARTS[className as keyof typeof PARTS];
    if (part) names.add(part);
  }
  if (names.size) element.setAttribute("part", [...names].join(" "));
}
