// Luh: notes on any web page, by writing straight away or by
// picking the spot first. See README.md for the one hook and the options.
import { CommentModeElement } from "./element";
import { elementName as nameOf } from "./context";
import { NAME } from "./name";
import { STRINGS, type Strings } from "./strings";
import type { CommentModeOptions } from "./types";

export { CommentModeElement, OWN } from "./element";
export { MARK_COLOR } from "./capture";
export { pageMode } from "./privacy";
export { STRINGS, LANGUAGES, resolveStrings, format, type Strings } from "./strings";
export type {
  CommentModeOptions,
  CommentModeEventMap,
  NameField,
  Theme,
  CommentModeState,
  Kind,
  Note,
  NoteContext,
  OpenOptions,
  PageRule,
  PickedElement,
  Redactions,
  SubmitRefusal,
  SubmitProgress,
  Via,
} from "./types";

export { NAME } from "./name";
/** The element's tag: `<luh-notes>`. */
export const TAG = `${NAME}-notes`;

/** Registers the element once. */
export function defineCommentMode(tag = TAG) {
  if (!customElements.get(tag)) customElements.define(tag, class extends CommentModeElement {});
  return customElements.get(tag) as typeof CommentModeElement;
}

/** Adds comment mode to the page with these options and returns it. */
export function createCommentMode(options: CommentModeOptions = {}): CommentModeElement {
  defineCommentMode();
  const element = document.createElement(TAG) as CommentModeElement;
  element.configure(options);
  document.body.append(element);
  return element;
}

/** A short name for an element, as the picker shows it: Button “Save”. */
export function elementName(element: Element, strings: Partial<Strings> = {}): string {
  return nameOf(element, { ...STRINGS, ...strings });
}

export { PARTS } from "./parts";
export type { IconName, IconOverrides } from "./dom";
export { SURFACE_TAG } from "./element";
