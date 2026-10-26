import { type Privacy } from "./privacy";
/** The mark drawn on pictures: an annotation red, haloed so it shows on any page. */
export declare const MARK_COLOR = "#e5484d";
type Box = {
    left: number;
    top: number;
    width: number;
    height: number;
};
type Size = {
    width: number;
    height: number;
};
/** A screenshot with its private areas already painted over, and how many there were. */
export interface Capture {
    blob: Blob;
    redacted: number;
    wholePage: boolean;
}
export declare function captureScreen(ignore: string, privacy: Privacy, progress?: (percent: number) => void): Promise<Capture | null>;
/** Bounds clipped to the screen, in CSS pixels, or null when off screen. */
export declare function visible(bounds: DOMRect | Box, size: Size): Box | null;
/** Just the picked part, cut from the screenshot. */
export declare function cropTo(blob: Blob, bounds: DOMRect, viewport: Size): Promise<Blob | null>;
/** The whole screen with the picked part outlined, as Marker.io and Jam send it. */
export declare function outline(blob: Blob, bounds: DOMRect, viewport: Size): Promise<Blob | null>;
export {};
