// Real-browser proof that private areas are unreadable in the picture Luh
// sends: Chromium draws the page, and the sent PNG is checked twice, by its
// pixels and by OCR (tesseract, when installed). A public line on the same
// page must stay readable, so an empty OCR result can never pass by accident.
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import { createServer, type ViteDevServer } from "vite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let server: ViteDevServer;
let browser: Browser;
let base: string;
const folder = mkdtempSync(join(tmpdir(), "luh-privacy-"));
const hasTesseract = (() => {
  try {
    execFileSync("tesseract", ["--version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

beforeAll(async () => {
  server = await createServer({
    root: join(import.meta.dirname, "fixture"),
    configFile: false,
    logLevel: "error",
    server: { port: 0, host: "127.0.0.1" },
  });
  await server.listen();
  const address = server.httpServer!.address();
  base = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
  browser = await chromium.launch();
}, 60_000);

afterAll(async () => {
  await browser?.close();
  await server?.close();
});

async function openPage(path: string) {
  const page = await browser.newPage({ viewport: { width: 900, height: 600 }, colorScheme: "light" });
  await page.goto(`${base}/${path}`);
  await page.waitForFunction(() => Boolean(window.luh));
  return page;
}

/** Opens the window, takes the screenshot, sends, and returns what was sent. */
async function send(page: Page) {
  await page.evaluate(() => window.luh.open());
  await page.locator("luh-surface textarea").fill("Looks off");
  await page.locator('luh-surface [part~="screenshot"]').click();
  await page.locator("luh-surface .cm-image").first().waitFor();
  const covered = await page.locator('luh-surface [part~="covered"]').textContent();
  await page.locator('luh-surface [part~="send"]').click();
  await page.waitForFunction(() => window.luhSent !== null);
  const sent = await page.evaluate(() => window.luhSent!);
  return { ...sent, covered };
}

/** Dark pixels inside each element's box: ink left from its words. */
function ink(page: Page, png: string, ids: string[]) {
  return page.evaluate(
    async ({ png, ids }) => {
      const image = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
      const scale = image.width / window.innerWidth;
      const canvas = new OffscreenCanvas(image.width, image.height);
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const count = (box: DOMRect) => {
        const data = context.getImageData(box.left * scale, box.top * scale, box.width * scale, box.height * scale).data;
        let dark = 0;
        for (let i = 0; i < data.length; i += 4)
          if (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]! < 60) dark++;
        return dark;
      };
      return Object.fromEntries(ids.map((id) => [id, count(document.getElementById(id)!.getBoundingClientRect())]));
    },
    { png, ids },
  );
}

function ocr(png: string, name: string) {
  const file = join(folder, `${name}.png`);
  writeFileSync(file, Buffer.from(png, "base64"));
  const words = execFileSync("tesseract", [file, "stdout"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  return { file, words, squashed: words.toUpperCase().replace(/[^A-Z0-9]/g, "") };
}

const SECRETS = ["SALARY", "85000", "SECRET", "4417", "JANE", "EXAMPLE", "PHONE", "7095550199", "CUTOFF", "4242"];

describe("private areas in the sent screenshot", () => {
  it("leaves a marked element, a hidden area, a selector and a typed field unreadable", async () => {
    const page = await openPage("index.html");
    const sent = await send(page);
    expect(sent.screenshot).toBeTruthy();
    // The window showed exactly the picture that was sent.
    expect(sent.preview).toBe(sent.screenshot);
    expect(sent.covered).toContain("5 private areas covered");
    const dark = await ink(page, sent.screenshot!, ["public", "marked", "hidden", "email", "phone", "clip", "beside"]);
    expect(dark.public).toBeGreaterThan(200);
    for (const id of ["marked", "hidden", "email", "phone", "clip"]) expect(dark[id], id).toBe(0);
    // Cut-off words are covered only where they are drawn: the words beside stay sharp.
    expect(dark.beside).toBeGreaterThan(100);
    if (hasTesseract) {
      const read = ocr(sent.screenshot!, "marked");
      console.info(`OCR of ${read.file}:\n${read.words}`);
      expect(read.squashed).toContain("PUBLICCONTROLWORDS");
      expect(read.squashed).toContain("BESIDE");
      for (const secret of SECRETS) expect(read.squashed, secret).not.toContain(secret);
    }
    await page.close();
  }, 60_000);

  it("blurs the whole screenshot on a blurred page and sends no picked words", async () => {
    const page = await openPage("blurred.html");
    const sent = await send(page);
    expect(sent.covered).toContain("whole screenshot is blurred");
    const dark = await ink(page, sent.screenshot!, ["public", "marked"]);
    expect(dark.public).toBe(0);
    if (hasTesseract) {
      const read = ocr(sent.screenshot!, "blurred");
      console.info(`OCR of ${read.file}:\n${read.words}`);
      for (const secret of ["PUBLIC", "CONTROL", ...SECRETS]) expect(read.squashed, secret).not.toContain(secret);
    }
    await page.close();
  }, 60_000);

  it("does not open on an off page", async () => {
    const page = await openPage("off.html");
    await page.evaluate(() => window.luh.open());
    expect(await page.evaluate(() => window.luh.isOpen)).toBe(false);
    expect(await page.evaluate(() => window.luh.allowed)).toBe(false);
    await page.close();
  });

  it("reads the same page clearly with privacy off, so the checks above can fail", async () => {
    const page = await openPage("index.html");
    await page.evaluate(() => {
      document.querySelectorAll("[data-luh]").forEach((each) => each.removeAttribute("data-luh"));
      window.luh.configure({ redact: {}, maskInputs: false });
    });
    const sent = await send(page);
    const dark = await ink(page, sent.screenshot!, ["marked", "hidden", "email"]);
    for (const id of ["marked", "hidden", "email"]) expect(dark[id], id).toBeGreaterThan(200);
    if (hasTesseract) {
      const read = ocr(sent.screenshot!, "control");
      expect(read.squashed).toContain("SALARY85000");
    }
    await page.close();
  }, 60_000);
});
