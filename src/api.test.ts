import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createCommentMode,
  defineCommentMode,
  elementName,
  resolveStrings,
  STRINGS,
  TAG,
} from "./index";
import type { CommentModeElement } from "./index";

function panel(mode: CommentModeElement): ShadowRoot {
  return document.querySelector<HTMLElement>('[data-luh="window"]')!.shadowRoot!;
}
function write(mode: CommentModeElement, body = "Please make the button easier to find") {
  const field = panel(mode).querySelector<HTMLTextAreaElement>("textarea")!;
  field.value = body;
  field.dispatchEvent(new Event("input"));
}
async function send(mode: CommentModeElement) {
  panel(mode).querySelector<HTMLButtonElement>(".cm-primary")!.click();
  await new Promise((resolve) => setTimeout(resolve, 0));
}
afterEach(async () => {
  document.querySelectorAll(TAG).forEach((mode) => mode.remove());
  await Promise.resolve();
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("public API", () => {
  it("registers once and returns the configured custom element", () => {
    expect(defineCommentMode()).toBe(defineCommentMode());
    const mode = createCommentMode({ key: false });
    expect(mode.localName).toBe(TAG);
    expect(mode.options.key).toBe(false);
    expect(mode.state).toEqual({ active: false, open: false, capturing: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
    expect(mode.active).toBe(false);
  });

  it("delivers a trimmed note with typed open, sent, close events in order", async () => {
    const onSubmit = vi.fn();
    const mode = createCommentMode({
      onSubmit,
      kinds: [{ value: "idea", label: "Idea" }],
      thanks: false,
      context: () => ({ project: "catalog" }),
    });
    const events: string[] = [];
    mode.addEventListener("open", (event) => {
      events.push("open");
      expect(event.detail.extra.project).toBe("catalog");
    });
    mode.addEventListener("sent", (event) => {
      events.push("sent");
      expect(event.detail.body).toBe("Clearer labels");
    });
    mode.addEventListener("close", (event) => {
      events.push("close");
      expect(event.detail.open).toBe(false);
    });
    mode.open();
    write(mode, "  Clearer labels  ");
    await send(mode);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        body: "Clearer labels",
        kind: "idea",
        name: null,
        via: "write",
        screenshot: null,
        images: [],
      }),
    );
    expect(events).toEqual(["open", "sent", "close"]);
    expect(mode.isOpen).toBe(false);
  });

  it("supports disabled, optional and required names", async () => {
    const onSubmit = vi.fn();
    const mode = createCommentMode({ onSubmit, name: "required" });
    mode.open();
    write(mode);
    const name = panel(mode).querySelector<HTMLInputElement>('input[type="text"]')!;
    expect(name.required).toBe(true);
    expect(panel(mode).querySelector<HTMLButtonElement>(".cm-primary")!.disabled).toBe(true);
    name.value = "   Alex   ";
    name.dispatchEvent(new Event("input"));
    await send(mode);
    expect(onSubmit.mock.calls[0]![0].name).toBe("Alex");
    mode.configure({ name: "optional" });
    mode.open();
    write(mode);
    await send(mode);
    expect(onSubmit.mock.calls[1]![0].name).toBeNull();
    mode.configure({ name: "off" });
    mode.open();
    expect(panel(mode).querySelector('input[type="text"]')).toBeNull();
  });

  it("checks dynamic permission at activation, opening and delivery", async () => {
    let allowed = false;
    const onSubmit = vi.fn();
    const mode = createCommentMode({ allowed: () => allowed, onSubmit });
    mode.toggle();
    mode.open();
    expect(mode.active).toBe(false);
    expect(mode.isOpen).toBe(false);
    allowed = true;
    mode.open();
    write(mode);
    allowed = false;
    await send(mode);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(mode.isOpen).toBe(true);
    expect(panel(mode).textContent).toContain(STRINGS.notAllowed);
    mode.close();
    mode.configure({
      allowed: () => {
        throw new Error("host permission failed");
      },
    });
    mode.open();
    expect(mode.isOpen).toBe(false);
  });

  it("disables screenshots, picking and drawing while retaining plain notes and uploads", async () => {
    const mode = createCommentMode({ screenshot: false, drawing: false, elementPicking: false });
    const button = document.createElement("button");
    button.textContent = "Save";
    document.body.append(button);
    mode.toggle();
    mode.open({ element: button });
    expect(mode.active).toBe(false);
    expect(mode.isOpen).toBe(false);
    mode.open();
    const screenButton = [...panel(mode).querySelectorAll<HTMLButtonElement>("button")].find(
      (button) => button.textContent?.includes(STRINGS.screenshot),
    )!;
    expect(screenButton.hidden).toBe(true);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const image = new File(["png"], "example.png", { type: "image/png" });
    const chooser = panel(mode).querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(chooser, "files", { value: [image] });
    chooser.dispatchEvent(new Event("change"));
    expect(panel(mode).textContent).toContain("example.png");
    expect(panel(mode).querySelector('[aria-label="Draw on example.png"]')).toBeNull();
  });

  it("resolves base and exact language maps with per-host word overrides", () => {
    const languages = {
      fr: { title: "Donner un avis", send: "Envoyer" },
      "fr-CA": { send: "Transmettre" },
    };
    expect(resolveStrings("fr-CA", languages, { title: "Votre avis" })).toMatchObject({
      title: "Votre avis",
      send: "Transmettre",
      close: STRINGS.close,
    });
    expect(resolveStrings("zz").send).toBe(STRINGS.send);
    const mode = createCommentMode({
      language: "fr-CA",
      languages,
      strings: { title: "Votre avis" },
    });
    mode.open();
    expect(panel(mode).textContent).toContain("Votre avis");
    expect(panel(mode).host.getAttribute("lang")).toBe("fr-CA");
    expect(elementName(document.createElement("button"), { button: "Bouton" })).toContain("Bouton");
    const custom = document.createElement("div");
    custom.setAttribute("role", "button");
    custom.textContent = "Sauver";
    expect(elementName(custom, { button: "Bouton" })).toBe("Bouton “Sauver”");
    custom.setAttribute("role", "unknown");
    expect(elementName(custom, { area: "Zone" })).toBe("Zone “Sauver”");
  });

  it("retains failed notes and only emits sent after the host accepts", async () => {
    const onSubmit = vi
      .fn()
      .mockResolvedValueOnce({ error: "Try later" })
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(undefined);
    const mode = createCommentMode({ onSubmit });
    const sent = vi.fn();
    mode.addEventListener("sent", sent);
    mode.open();
    write(mode);
    await send(mode);
    expect(panel(mode).textContent).toContain("Try later");
    expect(sent).not.toHaveBeenCalled();
    await send(mode);
    expect(panel(mode).textContent).toContain(STRINGS.failed);
    expect(mode.isOpen).toBe(true);
    await send(mode);
    expect(sent).toHaveBeenCalledOnce();
    expect(mode.isOpen).toBe(false);
  });

  it("posts files and names through the generic multipart convenience", async () => {
    const fetch = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("", { status: 201 }));
    const mode = createCommentMode({ submitUrl: "/feedback", name: "optional" });
    mode.open();
    write(mode);
    const name = panel(mode).querySelector<HTMLInputElement>('input[type="text"]')!;
    name.value = "Alex";
    await send(mode);
    const data = fetch.mock.calls[0]![1]!.body as FormData;
    expect(data.get("name")).toBe("Alex");
    expect(data.get("via")).toBe("write");
    expect(JSON.parse(String(data.get("context"))).url).toBe(location.href);
    expect(fetch.mock.calls[0]![1]!.credentials).toBe("same-origin");
  });

  it("does not let a slow submission close a later note", async () => {
    let accept!: () => void;
    const mode = createCommentMode({
      onSubmit: () =>
        new Promise<void>((resolve) => {
          accept = resolve;
        }),
    });
    mode.open();
    write(mode);
    panel(mode).querySelector<HTMLButtonElement>(".cm-primary")!.click();
    mode.close();
    mode.open();
    write(mode, "A different note");
    accept();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mode.isOpen).toBe(true);
    expect(panel(mode).querySelector<HTMLTextAreaElement>("textarea")!.value).toBe(
      "A different note",
    );
  });

  it("cancels an image editor when its note closes or disconnects", async () => {
    const createURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:example");
    const revokeURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const mode = createCommentMode();
    for (const disconnect of [false, true]) {
      mode.open();
      const chooser = panel(mode).querySelector<HTMLInputElement>('input[type="file"]')!;
      Object.defineProperty(chooser, "files", {
        value: [new File(["png"], "image.png", { type: "image/png" })],
        configurable: true,
      });
      chooser.dispatchEvent(new Event("change"));
      panel(mode).querySelector<HTMLButtonElement>('[aria-label="Draw on image.png"]')!.click();
      expect(panel(mode).querySelector("dialog")).not.toBeNull();
      if (disconnect) {
        mode.remove();
        await Promise.resolve();
      } else mode.close();
      await Promise.resolve();
      expect(
        document.querySelector('[data-luh="window"]')?.shadowRoot?.querySelector("dialog") ?? null,
      ).toBeNull();
      expect(mode.isOpen).toBe(false);
    }
    expect(createURL).toHaveBeenCalledTimes(4);
    expect(revokeURL).toHaveBeenCalledTimes(4);
  });

  it("removes global listeners on disconnect and restores them once on reconnect", async () => {
    const mode = createCommentMode();
    mode.remove();
    await Promise.resolve();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
    expect(mode.active).toBe(false);
    document.body.append(mode);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "c" }));
    expect(mode.active).toBe(true);
  });
});
