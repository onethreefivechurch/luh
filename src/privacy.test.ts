import { afterEach, describe, expect, it, vi } from "vitest";
import { createCommentMode, OWN } from "./index";
import {
  isPrivate,
  publicTitle,
  pageMode,
  privacyFrom,
  publicText,
  scramble,
  scrub,
  selectionIsPrivate,
  treatment,
} from "./privacy";
import type { Note } from "./types";

const at = (path: string) => `https://example.test${path}`;

afterEach(() => {
  document.body.replaceChildren();
  history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

function html(markup: string) {
  const holder = document.createElement("div");
  holder.innerHTML = markup;
  document.body.append(holder);
  return holder;
}

describe("page rules", () => {
  const pages = [
    { match: "/pay/*", mode: "off" as const },
    { match: /\/people\/\d+/, mode: "blur" as const },
    { match: (url: URL) => url.searchParams.has("private"), mode: "blur" as const },
    { match: "https://other.test/*", mode: "off" as const },
  ];

  it("matches paths with *, whole addresses with ://, regular expressions and functions", () => {
    expect(pageMode(pages, at("/pay/2026"))).toBe("off");
    expect(pageMode(pages, at("/pay"))).toBeNull();
    expect(pageMode(pages, at("/people/12/notes"))).toBe("blur");
    expect(pageMode(pages, at("/board?private=1"))).toBe("blur");
    expect(pageMode(pages, "https://other.test/anything")).toBe("off");
    expect(pageMode(pages, at("/board"))).toBeNull();
  });

  it("uses the first match and treats a broken rule as off", () => {
    expect(pageMode([{ match: "/a*", mode: "blur" }, { match: "/a/b", mode: "off" }], at("/a/b"))).toBe("blur");
    const broken = () => {
      throw new Error("bad");
    };
    expect(pageMode([{ match: broken, mode: "blur" }], at("/x"))).toBe("off");
  });

  it("keeps a stateful regular expression from skipping matches", () => {
    const rule = { match: /pay/g, mode: "off" as const };
    expect(pageMode([rule], at("/pay"))).toBe("off");
    expect(pageMode([rule], at("/pay"))).toBe("off");
  });

  it("turns Luh off on an off page", () => {
    history.replaceState(null, "", "/pay/run");
    const mode = createCommentMode({ pages: [{ match: "/pay/*", mode: "off" }] });
    expect(mode.allowed).toBe(false);
    mode.open();
    expect(mode.isOpen).toBe(false);
    history.replaceState(null, "", "/board");
    expect(mode.allowed).toBe(true);
  });
});

describe("marked areas", () => {
  it("inherits blur and hide from any holder, and hide wins", () => {
    const root = html(`
      <section data-luh="blur"><p id="inside">Salary <b id="deep">85,000</b></p>
        <div data-luh="hide"><span id="hidden">SIN</span></div></section>
      <p id="open">Public</p>`);
    const privacy = privacyFrom({});
    expect(treatment(root.querySelector("#deep")!, privacy)).toBe("blur");
    expect(treatment(root.querySelector("#hidden")!, privacy)).toBe("hide");
    expect(treatment(root.querySelector("#open")!, privacy)).toBeNull();
  });

  it("honours a host's own attribute name and selector lists", () => {
    const root = html(`<p data-private="hide" id="a">x</p><p class="email" id="b">x</p>
      <p class="pay" id="c">x</p><p data-luh="blur" id="d">x</p>`);
    const privacy = privacyFrom({
      privacyAttribute: "data-private",
      redact: { blur: [".email", "::not-a-selector"], hide: ".pay" },
    });
    expect(treatment(root.querySelector("#a")!, privacy)).toBe("hide");
    expect(treatment(root.querySelector("#b")!, privacy)).toBe("blur");
    expect(treatment(root.querySelector("#c")!, privacy)).toBe("hide");
    expect(treatment(root.querySelector("#d")!, privacy)).toBeNull();
  });

  it("hides typed fields unless maskInputs is false, never buttons or ticks", () => {
    const root = html(`<input id="t" value="secret"><textarea id="x"></textarea><select id="s"></select>
      <div contenteditable id="e"></div><input type="checkbox" id="c"><input type="submit" id="b">`);
    const on = privacyFrom({});
    for (const id of ["t", "x", "s", "e"]) expect(treatment(root.querySelector(`#${id}`)!, on)).toBe("hide");
    for (const id of ["c", "b"]) expect(treatment(root.querySelector(`#${id}`)!, on)).toBeNull();
    expect(treatment(root.querySelector("#t")!, privacyFrom({ maskInputs: false }))).toBeNull();
  });

  it("keeps blur strong enough to read nothing", () => {
    expect(privacyFrom({ blurStrength: 1 }).blurStrength).toBe(6);
    expect(privacyFrom({ blurStrength: 20 }).blurStrength).toBe(20);
    expect(privacyFrom({ blurStrength: Number.NaN }).blurStrength).toBe(12);
  });

  it("leaves privacy marks out of the library's own selector", () => {
    const root = html(`<p data-luh="blur" id="a">x</p><p data-luh id="b">x</p>`);
    expect(root.querySelector("#a")!.matches(OWN)).toBe(false);
    expect(root.querySelector("#b")!.matches(OWN)).toBe(true);
  });
});

describe("words that travel", () => {
  it("drops private words from an element's text", () => {
    const root = html(`<div id="card"><h2>Jane's file</h2><p data-luh="blur">jane@example.com</p>
      <label>Salary <input value="85000"></label><textarea>private draft</textarea></div>`);
    const privacy = privacyFrom({});
    expect(publicText(root.querySelector("#card")!, privacy)).toBe("Jane's file Salary");
    expect(isPrivate(root.querySelector("#card")!, privacy)).toBe(true);
  });

  it("scrubs a clone: words scrambled, values emptied, pictures dropped when hidden", () => {
    const root = html(`<div id="c" title="Jane">Jane Doe <input value="85000"><img src="a.png"></div>`);
    const clone = root.querySelector("#c")!.cloneNode(true) as HTMLElement;
    scrub(clone, "hide");
    expect(clone.textContent).toBe("xxxx xxx ");
    expect(clone.querySelector("input")!.value).toBe("xxxxx");
    expect(clone.querySelector("img")).toBeNull();
    expect(clone.getAttribute("title")).toBeNull();
    expect(scramble("a b\nc")).toBe("x x\nx");
  });

  it("sends no private words when the person picks a marked area", async () => {
    let sent: Note | null = null;
    const root = html(`<p data-luh="blur" id="email">jane@example.com</p>`);
    const mode = createCommentMode({ onSubmit: (note) => void (sent = note) });
    mode.open({ element: root.querySelector("#email")!, selectedText: "jane@example.com" });
    const surface = mode.surface.shadowRoot!;
    expect(surface.textContent).not.toContain("jane@example.com");
    const field = surface.querySelector("textarea")!;
    field.value = "Wrong colour";
    field.dispatchEvent(new Event("input"));
    surface.querySelector<HTMLButtonElement>('[part~="send"]')!.click();
    await vi.waitFor(() => expect(sent).not.toBeNull());
    expect(JSON.stringify(sent!.context)).not.toContain("jane@example.com");
    expect(sent!.context.element?.text).toBe("");
    expect(sent!.context.selectedText).toBeUndefined();
  });

  it("drops words selected across a private area", () => {
    const root = html(`<p id="a">Hello <span data-luh="hide">secret</span> there</p>`);
    const range = document.createRange();
    range.selectNodeContents(root.querySelector("#a")!);
    const selection = document.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
    expect(selectionIsPrivate(privacyFrom({}))).toBe(true);
    const open = document.createRange();
    open.selectNodeContents(root.querySelector("#a")!.firstChild!);
    selection.removeAllRanges();
    selection.addRange(open);
    expect(selectionIsPrivate(privacyFrom({}))).toBe(false);
  });
});

describe("the page title", () => {
  const none = () => false;

  it("is kept when it names nothing private", () => {
    html(`<p data-luh="blur">SALARY 85000</p>`);
    expect(publicTitle("Time Tracking — Outport", privacyFrom({}), none)).toBe("Time Tracking — Outport");
  });

  it("is left out when it repeats a private area's words, either way round", () => {
    html(`<h1 data-luh="blur">hr.person@example.com</h1>`);
    expect(publicTitle("Admin - hr.person@example.com — Outport", privacyFrom({}), none)).toBe("");
    document.body.replaceChildren();
    html(`<p class="who">Juniper Privatecase, juniper@example.com</p>`);
    expect(publicTitle("Juniper Privatecase", privacyFrom({ redact: { blur: ".who" } }), none)).toBe("");
  });

  it("is left out on a blurred page", () => {
    history.replaceState(null, "", "/people/4");
    expect(publicTitle("People", privacyFrom({ pages: [{ match: "/people/*", mode: "blur" }] }), none)).toBe("");
  });
});
