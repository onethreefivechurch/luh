import type { CommentModeEventMap, CommentModeOptions, CommentModeState, OpenOptions } from "./types";
/** Marks the library's own elements: never picked, never in a screenshot. */
export declare const OWN = "[data-luh]";
export declare class CommentModeElement extends HTMLElement {
    static observedAttributes: string[];
    private settings;
    private strings;
    private picker;
    private window;
    private windowHost;
    private announcer;
    private toast;
    private ready;
    private capturing;
    private captureSequence;
    private returnFocus;
    private lineage;
    private shot;
    private stale;
    private step;
    private context;
    private via;
    private watcher;
    private toastTimer;
    addEventListener<K extends keyof CommentModeEventMap>(type: K, listener: (this: CommentModeElement, event: CommentModeEventMap[K]) => void, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    /** Current host permission. Callback failures fail closed. */
    get allowed(): boolean;
    /** Sets options; may be called again to change them (words, kinds, hooks). */
    configure(options: CommentModeOptions): this;
    get options(): Readonly<CommentModeOptions>;
    /** Elements never picked and never in a screenshot: the site's and the library's own. */
    get ignore(): string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    private shadow;
    private build;
    /** Comment mode is on: the next click picks. */
    get active(): boolean;
    set active(value: boolean);
    toggle(force?: boolean): void;
    get isOpen(): boolean;
    get state(): CommentModeState;
    /**
     * Opens the note window: on its own (Send feedback), or as a comment on an
     * element. A dialog the opener sits in hosts the window, so the dialog's
     * focus trap and outside-click rules leave it working.
     */
    open(options?: OpenOptions): void;
    /** Closes the window, dropping the note. */
    close(): void;
    private closed;
    private widen;
    /** Where a lineage entry sits now, or where it last sat if it has left the page. */
    private where;
    /** Takes the page as it is now, with the pick outlined, and the pick on its own. */
    private capture;
    /** The last screenshot marked for the pick as it is now (after Wider or Narrower). */
    private remark;
    private marked;
    private send;
    private onKey;
    private changed;
    private announce;
    private say;
}
