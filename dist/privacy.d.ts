import type { CommentModeOptions, PageRule } from "./types";
export type Treatment = "blur" | "hide";
/** The settled privacy settings, every default filled in. */
export interface Privacy {
    attribute: string;
    blur: string[];
    hide: string[];
    maskInputs: boolean;
    blurStrength: number;
    hideColor: string;
    pages: PageRule[];
}
/** A screen area to paint over, in CSS pixels from the viewport's corner. */
export interface Region {
    treatment: Treatment;
    left: number;
    top: number;
    width: number;
    height: number;
}
export declare const DEFAULT_ATTRIBUTE = "data-luh";
export declare const DEFAULT_BLUR_STRENGTH = 12;
/** Below this, pixelated words can still be guessed at. */
export declare const MIN_BLUR_STRENGTH = 6;
export declare const DEFAULT_HIDE_COLOR = "#d4d4d8";
export declare function privacyFrom(options: CommentModeOptions): Privacy;
/** The first rule matching this address decides: Luh off, or every screenshot blurred. */
export declare function pageMode(pages: PageRule[], href?: string): PageRule["mode"] | null;
/** How an element is treated: by itself or by anything that holds it. Hide wins over blur. */
export declare function treatment(element: Element, privacy: Privacy): Treatment | null;
/** True when the element or its words should never travel as text. */
export declare function isPrivate(element: Element, privacy: Privacy): boolean;
/** True when selected words touch a private area. */
export declare function selectionIsPrivate(privacy: Privacy, selection?: Selection | null): boolean;
/** Every marked element on screen, each with the area it covers, words that spill out included. */
export declare function regions(privacy: Privacy, skip: (element: Element) => boolean): Region[];
/** Every letter and digit becomes "x": the shape of the words, none of the words. */
export declare function scramble(text: string): string;
/**
 * Scrubs a cloned subtree so the words are gone before any pixel is drawn:
 * text scrambled, typed values emptied, pictures dropped for hidden areas.
 * The pixel pass still paints over the area; this is the second lock.
 */
export declare function scrub(clone: Element, kind: Treatment): void;
/** Coarse squares: unlike a soft blur, they cannot be sharpened back. */
export declare function pixelate(context: CanvasRenderingContext2D, area: {
    x: number;
    y: number;
    width: number;
    height: number;
}, block: number): void;
/**
 * Paints the regions into the screenshot: hidden areas filled, blurred ones
 * pixelated, the whole picture pixelated on a blurred page. Any failure
 * returns null, so an unredacted picture is never handed on.
 */
export declare function redactImage(blob: Blob, areas: Region[], privacy: Privacy, viewport: {
    width: number;
    height: number;
}, wholePage: boolean): Promise<Blob | null>;
/** An element's words with every private part left out, as a note may carry them. */
export declare function publicText(element: Element, privacy: Privacy): string;
/**
 * The page title, or "" when it repeats words from a private area (a page
 * titled with the person it is about) or the page is blurred whole.
 */
export declare function publicTitle(title: string, privacy: Privacy, skip: (element: Element) => boolean): string;
