import { afterEach, describe, expect, it, vi } from "vitest";
import { VoiceInput } from "./voice";

class Recognition {
  static last: Recognition;
  lang = "";
  continuous = false;
  interimResults = true;
  onresult: ((event: any) => void) | null = null;
  onerror: (() => void) | null = null;
  onend: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn();
  abort = vi.fn();
  constructor() { Recognition.last = this; }
}
const browser = window as unknown as Record<string, unknown>;
afterEach(() => { delete browser.SpeechRecognition; delete browser.webkitSpeechRecognition; });
function voice() {
  const text = vi.fn(), changed = vi.fn(), failed = vi.fn();
  return { input: new VoiceInput("fr-CA", text, changed, failed), text, changed, failed };
}

describe("voice typing", () => {
  it("stays unavailable without browser support and never starts until asked", () => {
    expect(voice().input.available).toBe(false);
    browser.SpeechRecognition = Recognition;
    const { input } = voice();
    expect(input.available).toBe(true);
    expect(input.active).toBe(false);
    input.toggle();
    expect(Recognition.last.start).toHaveBeenCalledOnce();
    expect(Recognition.last.lang).toBe("fr-CA");
  });

  it("accepts final words once per changed result, including results received after Stop", () => {
    browser.webkitSpeechRecognition = Recognition;
    const { input, text } = voice();
    input.toggle();
    const recognition = Recognition.last;
    recognition.onresult!({ resultIndex: 0, results: [{ isFinal: false, 0: { transcript: "interim" } }] });
    expect(text).not.toHaveBeenCalled();
    recognition.onresult!({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: " First " } }] });
    input.toggle();
    input.toggle();
    expect(recognition.stop).toHaveBeenCalledOnce();
    expect(input.finishing).toBe(true);
    recognition.onresult!({ resultIndex: 1, results: [{ isFinal: true, 0: { transcript: "First" } }, { isFinal: true, 0: { transcript: "second" } }] });
    expect(text.mock.calls).toEqual([["First"], ["second"]]);
    recognition.onend!();
    expect(input.active).toBe(false);
    expect(input.finishing).toBe(false);
  });

  it("aborts on cancel and ignores even queued callbacks from an older draft", () => {
    browser.SpeechRecognition = Recognition;
    const { input, text } = voice();
    input.toggle();
    const recognition = Recognition.last;
    const late = recognition.onresult!;
    input.cancel();
    input.toggle();
    late({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: "old words" } }] });
    expect(text).not.toHaveBeenCalled();
    expect(recognition.abort).toHaveBeenCalledOnce();
  });

  it("releases failed recognition and allows retry without losing existing words", () => {
    browser.SpeechRecognition = Recognition;
    const { input, failed } = voice();
    input.toggle();
    Recognition.last.onerror!();
    expect(failed).toHaveBeenCalledOnce();
    expect(input.active).toBe(false);
    input.toggle();
    Recognition.last.stop.mockImplementationOnce(() => { throw new Error("stopped"); });
    input.toggle();
    expect(input.active).toBe(false);
    expect(failed).toHaveBeenCalledTimes(2);
  });
});
