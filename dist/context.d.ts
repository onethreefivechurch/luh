import { type Strings } from "./strings";
import type { NoteContext, PickedElement } from "./types";
/** A short name for an element, as the picker and the window show it: Button “Save”. */
export declare function elementName(element: Element, strings: Strings): string;
/** The element as a note records it: a selector that finds it again, and its words. */
export declare function describe(element: Element, strings: Strings): PickedElement;
/** The dialog's title, from aria-labelledby or aria-label, or undefined. */
export declare function dialogTitle(dialog: Element | null | undefined): string | undefined;
/** The open modal dialog an element sits in, or the topmost open one. */
export declare function hostDialog(from: Element | null | undefined, ignore: string): HTMLElement | null;
export declare function pageContext(options: {
    appVersion?: string;
    extra: Record<string, string>;
    dialog?: Element | null;
}): NoteContext;
/** The words selected on the page, up to 1000 characters. */
export declare function selectedWords(): string;
