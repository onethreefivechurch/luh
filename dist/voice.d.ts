/** Browser speech recognition is invoked only by an explicit microphone action. */
export declare class VoiceInput {
    private readonly language;
    private readonly text;
    private readonly changed;
    private readonly failed;
    private recognition;
    private stopping;
    private readonly Constructor;
    constructor(language: string, text: (words: string) => void, changed: () => void, failed: () => void);
    get available(): boolean;
    get active(): boolean;
    get finishing(): boolean;
    /** Starts listening or requests the final result; repeated stops are ignored. */
    toggle(): void;
    /** Aborts listening and ignores delayed results when the draft loses ownership. */
    cancel(): void;
}
