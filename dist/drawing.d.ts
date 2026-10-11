export type Point = {
    x: number;
    y: number;
};
export type Rect = {
    x: number;
    y: number;
    w: number;
    h: number;
};
export type Tool = "arrow" | "box" | "text" | "blur" | "crop";
export type Mark = ({
    id: number;
    kind: "box";
} & Rect) | ({
    id: number;
    kind: "blur";
} & Rect) | {
    id: number;
    kind: "arrow";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | {
    id: number;
    kind: "text";
    x: number;
    y: number;
    text: string;
};
export type Handle = "start" | "end" | "nw" | "ne" | "sw" | "se";
export interface Scene {
    marks: Mark[];
    crop: Rect | null;
}
export declare function rectFrom(a: Point, b: Point): Rect;
/** The box a mark covers; text needs its measured width. */
export declare function bounds(mark: Mark, textWidth: (text: string) => number, fontSize: number): Rect;
/**
 * The topmost mark under a point. A box is hit on its outline (so marks
 * inside it stay reachable), blur and text anywhere inside, an arrow along
 * its line; `slop` widens every target to a comfortable size.
 */
export declare function hitTest(marks: Mark[], p: Point, slop: number, textWidth: (text: string) => number, fontSize: number): Mark | null;
/** Where a selected mark's handles sit: an arrow's two ends, a box's corners. */
export declare function handles(mark: Mark): {
    handle: Handle;
    x: number;
    y: number;
}[];
export declare function handleAt(mark: Mark, p: Point, slop: number): Handle | null;
/** The mark moved by (dx, dy), kept on the picture. */
export declare function moved(mark: Mark, dx: number, dy: number, size: {
    width: number;
    height: number;
}, box: Rect): Mark;
/** The mark with one handle dragged to a point. */
export declare function resized(mark: Mark, handle: Handle, p: Point): Mark;
/** True when a just-drawn mark is too small to be meant. */
export declare function tooSmall(mark: Mark | ({
    kind: "crop";
} & Rect), least: number): boolean;
/** The arrow's head: tip, then the two barbs. */
export declare function arrowHead(mark: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}, stroke: number): [number, number][];
/** Undo and redo over whole scenes, as every drawing app keeps them. */
export declare class History {
    scene: Scene;
    private past;
    private future;
    constructor(scene: Scene);
    get canUndo(): boolean;
    get canRedo(): boolean;
    commit(scene: Scene): void;
    undo(): void;
    redo(): void;
}
