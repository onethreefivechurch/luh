import type { Strings } from "./strings";
/** How the note began: writing straight away, or picking a spot first. */
export type Via = "write" | "pick";
/** A kind of note the person can choose, such as Bug, Idea or Help. */
export interface Kind {
    value: string;
    label: string;
    /** The question the text box asks for this kind ("What's wrong?"). */
    prompt?: string;
}
/** The thing a note is about, when the person picked one. */
export interface PickedElement {
    /** A CSS selector that finds the element again, stable names first. */
    selector: string;
    id: string;
    /** Its words (an input's label, never what was typed in it), up to 300 characters. */
    text: string;
    /** Its ARIA role, or its tag name. */
    role: string;
    /** A short spoken name, as the picker shows it ("Button “Save”"). */
    name: string;
}
/** Everything the library knows about where the note was written. */
export interface NoteContext {
    url: string;
    path: string;
    /** The document's title. */
    title: string;
    /** The page's language (`<html lang>`), or the browser's. */
    language: string;
    screen: {
        width: number;
        height: number;
        pixelRatio: number;
    };
    colorScheme: "light" | "dark";
    appVersion?: string;
    /** When the window opened, ISO 8601. */
    capturedAt: string;
    /** The title of the dialog the note began in, if any. */
    dialog?: string;
    element?: PickedElement;
    /** Words the person selected to comment on. */
    selectedText?: string;
    /** Whatever the site's `context()` option returned when the window opened. */
    extra: Record<string, string>;
}
/** What the person sends: the one thing `onSubmit` receives. */
export interface Note {
    /** Trimmed author name, or null when omitted or disabled. */
    name: string | null;
    via: Via;
    body: string;
    /** The chosen kind's value, or null when the site offers no kinds. */
    kind: string | null;
    /** The page screenshot, when the person chose to take one ("page.png"). */
    screenshot: File | null;
    /** Every other picture: the picked part ("element.png"), pasted, dropped or chosen. */
    images: File[];
    context: NoteContext;
}
/** `onSubmit` may return this to keep the window open with a message. */
export interface SubmitRefusal {
    error: string;
}
export type NameField = "off" | "optional" | "required";
export interface CommentModeOptions {
    /** Host permission, checked on activation, opening and sending. Default true. */
    allowed?: boolean | (() => boolean);
    /** Author name field. Default "off". */
    name?: NameField;
    /** Offer page screenshots. Default true. Uploaded images remain available. */
    screenshot?: boolean;
    /** Offer image annotation. Default true. */
    drawing?: boolean;
    /** Allow picking elements, including open({ element }). Default true. */
    elementPicking?: boolean;
    /** Widget language; defaults to the page language. Unknown locales fall back to English. */
    language?: string;
    /** Host language dictionaries, merged over English. Exact locale, then base locale. */
    languages?: Record<string, Partial<Strings>>;
    /** Receives each note. Resolve to send; return `{ error }` or throw to keep the window open. */
    onSubmit?: (note: Note) => Promise<void | SubmitRefusal> | void | SubmitRefusal;
    /** Or: where to POST each note as multipart form data (see README). */
    submitUrl?: string;
    /** Kinds to choose from. None hides the choice. */
    kinds?: Kind[];
    /** The key that turns comment mode on and off; false for none. Default "c". */
    key?: string | false;
    /** Elements that are never picked and never appear in a screenshot. */
    ignore?: string;
    appVersion?: string;
    /** Extra details recorded with every note, read as the window opens. */
    context?: () => Record<string, string>;
    /** A line shown beside Screenshot this page, such as a privacy warning; null for none. */
    screenshotNote?: () => string | null;
    /** The window's small print. */
    finePrint?: string;
    /** Words, for another language or another voice. */
    strings?: Partial<Strings>;
    /** At most this many pictures per note. Default 8. */
    maxImages?: number;
    /** At most this many bytes per picture. Default 10 MB. */
    maxImageBytes?: number;
    /** Say "Sent" after a note goes. Default true; off when the site confirms on its own. */
    thanks?: boolean;
}
export interface OpenOptions {
    /** The element or event the window opened from; focus returns there and a dialog it sits in hosts the window. */
    from?: Element | Event | null;
    /** Open as a comment on this element, as a pick does. */
    element?: Element;
    /** Words selected on the element. */
    selectedText?: string;
}
/** What the page can watch through the `change` event. */
export interface CommentModeState {
    /** Comment mode is on: the next click picks. */
    active: boolean;
    /** The note window is open. */
    open: boolean;
    /** A screenshot is being taken. */
    capturing: boolean;
}
/** Typed events emitted by the custom element (non-bubbling). */
export interface CommentModeEventMap {
    open: CustomEvent<NoteContext>;
    close: CustomEvent<CommentModeState>;
    sent: CustomEvent<Note>;
    change: CustomEvent<CommentModeState>;
}
