// Every word the library shows or speaks. A site passes its own through the
// `strings` option; `{name}`-style placeholders are filled in by `format`.
export const STRINGS = {
  nameLabel: "Your name",
  nameOptional: "Your name (optional)",
  namePlaceholder: "Name",
  nameRequired: "Enter your name before sending.",
  notAllowed: "Feedback is not available for this account.",
  sendShortcut: "Ctrl+Enter",
  controlKey: "Ctrl",
  deleteKey: "Delete",
  title: "Send feedback",
  close: "Close",
  cancel: "Cancel",
  send: "Send",
  sending: "Sending…",
  sent: "Sent. Thank you.",
  failed: "That didn't send. Check your connection and try again.",
  placeholder: "Write your note",
  kindLabel: "Kind",
  moveWindow: "Move with arrow keys",
  wider: "Wider",
  widerHint: "Wider · pick what holds it",
  narrower: "Narrower",
  selection: "Selected words",
  screenshot: "Screenshot this page",
  screenshotTaking: "Taking a screenshot…",
  screenshotFailed: "The screenshot didn't work. Add an image or send your words.",
  addImages: "Add images",
  dropHint: "or drag and drop images here, as many as you like.",
  dropHere: "Drop images to add them",
  images: "Images",
  screenshotName: "Screenshot",
  elementImageName: "The part you picked",
  draw: "Draw on it",
  drawOn: "Draw on {name}",
  removeNamed: "Remove {name}",
  tooMany: "Up to {max} images.",
  wrongImage: "{name} can't be added: images only (PNG, JPEG or WebP), up to {size} MB.",
  discardTitle: "Discard this note?",
  keepEditing: "Keep editing",
  discard: "Discard",
  trigger: "Luh!",
  modeOn: "Comment mode on. Click anything, or select words, to comment on it. Escape to finish.",
  modeOff: "Comment mode off.",
  pickHint: "↑ wider",
  // The drawing editor
  drawTitle: "Draw on image",
  arrow: "Arrow",
  box: "Box",
  text: "Text",
  blur: "Blur",
  crop: "Crop",
  undo: "Undo",
  redo: "Redo",
  deleteMark: "Delete",
  done: "Done",
  removeImage: "Remove image",
  drawing: "Image being drawn on",
  wordsOnImage: "Words on the image",
  drawHelp:
    "Drag to draw. Click a mark to select it, drag to move it, Delete to remove it. Escape finishes.",
  markLabel: "{kind} {number}",
  // Names for what the picker points at
  link: "Link",
  button: "Button",
  field: "Field",
  choice: "Choice",
  label: "Label",
  image: "Image",
  icon: "Icon",
  heading: "Heading",
  textKind: "Text",
  row: "Row",
  cell: "Cell",
  table: "Table",
  list: "List",
  menu: "Menu",
  form: "Form",
  area: "Area",
  named: "{kind} “{label}”",
};

export type Strings = typeof STRINGS;

export function format(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Built-in dictionaries. Hosts can supply any other language through options.languages. */
export const LANGUAGES: Record<string, Partial<Strings>> = { en: STRINGS };

export function resolveStrings(
  language = "en",
  languages: Record<string, Partial<Strings>> = {},
  overrides: Partial<Strings> = {},
): Strings {
  const locale = language.toLowerCase().replace(/_/g, "-");
  const normalized = Object.fromEntries(
    Object.entries({ ...LANGUAGES, ...languages }).map(([key, value]) => [
      key.toLowerCase().replace(/_/g, "-"),
      value,
    ]),
  );
  return { ...STRINGS, ...normalized[locale.split("-")[0]!], ...normalized[locale], ...overrides };
}
