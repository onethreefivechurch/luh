import { CommentModeElement } from "./element";
import { type Strings } from "./strings";
import type { CommentModeOptions } from "./types";
export { CommentModeElement, OWN } from "./element";
export { MARK_COLOR } from "./capture";
export { STRINGS, LANGUAGES, resolveStrings, format, type Strings } from "./strings";
export type { CommentModeOptions, CommentModeEventMap, NameField, CommentModeState, Kind, Note, NoteContext, OpenOptions, PickedElement, SubmitRefusal, Via, } from "./types";
export { NAME } from "./name";
/** The element's tag: `<luh-notes>`. */
export declare const TAG = "luh-notes";
/** Registers the element once. */
export declare function defineCommentMode(tag?: string): typeof CommentModeElement;
/** Adds comment mode to the page with these options and returns it. */
export declare function createCommentMode(options?: CommentModeOptions): CommentModeElement;
/** A short name for an element, as the picker shows it: Button “Save”. */
export declare function elementName(element: Element, strings?: Partial<Strings>): string;
