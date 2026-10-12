import { type IconOverrides } from "./dom";
import { type Strings } from "./strings";
export type EditorResult = {
    action: "done";
    file: File;
} | {
    action: "cancel";
} | {
    action: "remove";
};
export declare function openEditor(file: File, strings: Strings, mount: Node, signal?: AbortSignal, icons?: IconOverrides): Promise<EditorResult>;
