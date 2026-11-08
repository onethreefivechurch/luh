/** Minimal Web Speech contract, including prefixed implementations. */
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; [index: number]: { transcript: string } }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type RecognitionConstructor = new () => Recognition;

/** Browser speech recognition is invoked only by an explicit microphone action. */
export class VoiceInput {
  private recognition: Recognition | null = null;
  private stopping = false;
  private readonly Constructor: RecognitionConstructor | undefined;

  constructor(
    private readonly language: string,
    private readonly text: (words: string) => void,
    private readonly changed: () => void,
    private readonly failed: () => void,
  ) {
    const browser = window as unknown as {
      SpeechRecognition?: RecognitionConstructor;
      webkitSpeechRecognition?: RecognitionConstructor;
    };
    this.Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
  }

  get available() {
    return Boolean(this.Constructor);
  }
  get active() {
    return this.recognition !== null;
  }
  get finishing() {
    return this.stopping;
  }

  /** Starts listening or requests the final result; repeated stops are ignored. */
  toggle() {
    if (this.recognition) {
      if (this.stopping) return;
      this.stopping = true;
      this.changed();
      try {
        this.recognition.stop();
      } catch {
        this.cancel();
        this.failed();
      }
      return;
    }
    if (!this.Constructor) return;
    try {
      const recognition = new this.Constructor();
      this.recognition = recognition;
      recognition.lang = this.language;
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        if (this.recognition !== recognition) return;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]!;
          if (result.isFinal && result[0]?.transcript.trim()) this.text(result[0].transcript.trim());
        }
      };
      recognition.onend = () => {
        if (this.recognition !== recognition) return;
        this.recognition = null;
        this.stopping = false;
        this.changed();
      };
      recognition.onerror = () => {
        if (this.recognition !== recognition) return;
        this.cancel();
        this.failed();
      };
      this.changed();
      recognition.start();
    } catch {
      this.cancel();
      this.failed();
    }
  }

  /** Aborts listening and ignores delayed results when the draft loses ownership. */
  cancel() {
    const recognition = this.recognition;
    this.recognition = null;
    this.stopping = false;
    if (recognition) {
      recognition.onresult = recognition.onerror = recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // Already stopped by the browser.
      }
      this.changed();
    }
  }
}
