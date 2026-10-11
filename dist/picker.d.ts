import type { Strings } from "./strings";
export interface PickerHost {
    strings: Strings;
    ignore: string;
    /** Picking pauses while this is true (the window is open, a screenshot is being taken). */
    paused(): boolean;
    pick(element: Element, selectedText: string): void;
}
export declare class Picker {
    private readonly host;
    private hovered;
    private narrower;
    private pinned;
    private on;
    private readonly outline;
    private readonly name;
    private cleanups;
    constructor(root: ShadowRoot, host: PickerHost);
    get active(): boolean;
    set active(value: boolean);
    private get picking();
    /** Keeps a picked element outlined while its note is written. */
    pin(element: Element | null): void;
    /** The element to pick for a target under the pointer, or null for none. */
    target(from: EventTarget | null): Element | null;
    private hover;
    private choose;
    /** Redraws the outline over the pinned or hovered element. */
    draw(): void;
    private listen;
    /** The picker's keys, while comment mode is on: ↑ ↓ to widen, Enter to pick. */
    key(event: KeyboardEvent): boolean;
}
export declare function typing(element: EventTarget | null): boolean;
