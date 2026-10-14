import { type Strings } from "./strings";
import type { IconOverrides } from "./dom";
import type { Kind, NameField, Via, SubmitProgress } from "./types";
export declare const IMAGE_TYPES: string[];
export interface WindowCallbacks {
    pickLabel?: string;
    pick?(): void;
    strings: Strings;
    icons?: IconOverrides;
    name: NameField;
    screenshot: boolean;
    drawing: boolean;
    kinds: Kind[];
    finePrint?: string;
    maxImages: number;
    maxImageBytes: number;
    /** Takes the page (and, for a pick, the picked part) when the person asks. */
    capture(): Promise<{
        page: File | null;
        element: File | null;
    }>;
    /** The last screenshot marked again for the pick as it now is, or null without one. */
    remark(): Promise<{
        page: File | null;
        element: File | null;
    } | null>;
    screenshotNote(): string | null;
    /** Widen (+1) or narrow (-1) the pick; returns the new pick's name. */
    widen(delta: number): string | null;
    widenState(): {
        wider: boolean;
        narrower: boolean;
    };
    pickedText(): string;
    /** Sends; resolves to an error message to show, or null when sent. */
    send(parts: {
        body: string;
        name: string | null;
        kind: string | null;
        screenshot: File | null;
        images: File[];
    }, progress: SubmitProgress): Promise<string | null>;
    closed(): void;
    /** Where the pick is now, to sit beside it; null for no pick. */
    anchor(): DOMRect | null;
    /** The button the window opened from, to sit just under it; null for none. */
    opener(): DOMRect | null;
}
type PictureMeta = {
    [key: string]: unknown;
    url: string;
    taken?: "page" | "element";
    drawn?: boolean;
};
type Picture = PictureMeta & {
    id: string;
    file: File;
};
export declare class NoteWindow {
    private readonly root;
    private readonly host;
    readonly panel: HTMLElement;
    private body;
    private nameField;
    private kind;
    private readonly queue;
    private nextId;
    private uploadPercent;
    private uploadProgress;
    private sending;
    private capturing;
    private percent;
    private progressLine;
    private selectedText;
    private confirming;
    private problem;
    private error;
    private drawing;
    private editorController;
    private opening;
    private via;
    private position;
    private dragging;
    private openingDialogs;
    private cleanups;
    private readonly titleId;
    private title;
    private quote;
    private widerButton;
    private narrowerButton;
    private kindRow;
    private field;
    private list;
    private screenshotButton;
    private pickButton;
    private suspended;
    private addButton;
    private note;
    private problemLine;
    private errorLine;
    private sendButton;
    private footer;
    private confirm;
    private chooser;
    private dropZone;
    constructor(root: ShadowRoot, host: WindowCallbacks);
    get isOpen(): boolean;
    private get pictures();
    private icon;
    private toolButton;
    setPointAvailable(available: boolean): void;
    /** Hides the window while keeping the draft and Uppy queue for picking. */
    suspend(): boolean;
    open(options: {
        via: Via;
        name?: string;
        selectedText?: string;
        pickedText?: string;
    }): void;
    /** Closes and forgets the note. */
    close(): void;
    /** Closes, asking first when there is something to lose. */
    requestClose(): void;
    private keepEditing;
    private widen;
    private fit;
    private refresh;
    private label;
    private row;
    private full;
    /** Every image source enters the same Uppy queue. No bytes leave before Send. */
    add(file: File, taken?: Picture["taken"]): void;
    private rejected;
    /** Validate against the other files before changing anything, preserving the original on refusal. */
    private replace;
    private remove;
    captureProgress(percent: number): void;
    private screenshot;
    private draw;
    get editing(): boolean;
    private submit;
    /** Called after close when the controller replaces or disconnects this window. */
    dispose(): void;
    private visibleDialogs;
    private ownsInput;
    private acceptsFiles;
    private listen;
    private viewport;
    /** Width on this screen: 400, or the screen less its margins. */
    private width;
    place(): void;
    private apply;
    private moveTo;
    private draggable;
    /** Escape: the discard question first, then the window itself. */
    escape(): void;
}
export {};
