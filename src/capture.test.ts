import { afterEach, describe, expect, it, vi } from "vitest";
import { captureScreen } from "./capture";
import { privacyFrom } from "./privacy";

// A stand-in for modern-screenshot that clones the way it does (filter
// before each child, children reported before their parent) and can be
// told to slip: report a clone nobody filtered, or skip one.
const slip = vi.hoisted(() => ({ extra: false, skip: false }));

vi.mock("modern-screenshot", () => {
  type Options = { filter: (node: Node) => boolean; onCloneEachNode: (node: Node) => void };
  const clone = (node: Node, options: Options): Node => {
    const copy = node.cloneNode(false);
    for (const child of node.childNodes) if (options.filter(child)) copy.appendChild(clone(child, options));
    if (slip.extra && node instanceof HTMLParagraphElement) options.onCloneEachNode(document.createElement("span"));
    if (!(slip.skip && node instanceof HTMLParagraphElement)) options.onCloneEachNode(copy);
    return copy;
  };
  return {
    createContext: async (root: Node, options: Options) => ({ ...options, root, fontCssTexts: new Map() }),
    domToBlob: async (context: Options & { root: Node }) => {
      clone(context.root, context);
      return new Blob(["png"], { type: "image/png" });
    },
    destroyContext: () => {},
  };
});

afterEach(() => {
  document.body.replaceChildren();
  slip.extra = false;
  slip.skip = false;
});

const capture = () => captureScreen("[data-ignore]", privacyFrom({}));

describe("captureScreen pairing clones with the page", () => {
  it("sends the picture when every clone pairs with its element", async () => {
    document.body.innerHTML = "<div><p>PRICE 2.00</p><p>AFTER</p></div>";
    expect(await capture()).not.toBeNull();
  });

  it("sends no picture when a clone arrives that no element was recorded for", async () => {
    document.body.innerHTML = "<div><p>PRICE 2.00</p><p>AFTER</p></div>";
    slip.extra = true;
    expect(await capture()).toBeNull();
  });

  it("sends no picture when an element's clone is never reported", async () => {
    document.body.innerHTML = "<div><p>PRICE 2.00</p></div>";
    slip.skip = true;
    expect(await capture()).toBeNull();
  });
});
