import { chromium, type Browser, type Page } from "playwright-core";
import { createServer, type ViteDevServer } from "vite";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let server: ViteDevServer, browser: Browser, base: string;
beforeAll(async () => {
  server = await createServer({ root: join(import.meta.dirname, "fixture"), configFile: false, logLevel: "error", server: { port: 0, host: "127.0.0.1" } });
  await server.listen();
  const address = server.httpServer!.address();
  base = `http://127.0.0.1:${typeof address === "object" && address ? address.port : 0}`;
  browser = await chromium.launch();
}, 60_000);
afterAll(async () => { await browser?.close(); await server?.close(); });
const part = (page: Page, name: string) => page.locator(`luh-surface [part~="${name}"]`);

async function open(mobile: boolean, supported = true) {
  const page = await browser.newPage({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, hasTouch: mobile, isMobile: mobile, colorScheme: "light" });
  await page.addInitScript(({ supported }) => {
    const probe = window as unknown as Record<string, any>;
    delete probe.SpeechRecognition; delete probe.webkitSpeechRecognition;
    probe.starts = 0; probe.aborts = 0;
    if (supported) probe.webkitSpeechRecognition = class {
      lang = "";
      onresult: any; onerror: any; onend: any;
      start() { probe.starts++; probe.recognition = this; }
      stop() { this.onresult?.({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: "Move the heading" } }] }); this.onend?.(); }
      abort() { probe.aborts++; }
    };
  }, { supported });
  await page.goto(`${base}/input.html`);
  await page.locator("#open").click();
  return page;
}

async function upload(page: Page) {
  const image = await page.evaluate(() => {
    const canvas = document.createElement("canvas"); canvas.width = 640; canvas.height = 480;
    canvas.getContext("2d")!.fillStyle = "white"; canvas.getContext("2d")!.fillRect(0, 0, 640, 480);
    return canvas.toDataURL().split(",")[1]!;
  });
  await page.locator('luh-surface input[type="file"]').setInputFiles({ name: "example.png", mimeType: "image/png", buffer: Buffer.from(image, "base64") });
  await part(page, "draw").click();
  await part(page, "tool-pen").click();
  await page.waitForFunction(() => document.querySelector("luh-surface")!.shadowRoot!.querySelector(".cm-canvas")!.getAttribute("viewBox") === "0 0 640 480");
}

async function circle(page: Page, touch: boolean) {
  const box = (await part(page, "canvas").boundingBox())!;
  const points = Array.from({ length: 41 }, (_, i) => ({ x: box.x + box.width * (0.5 + 0.28 * Math.cos(i * Math.PI / 20)), y: box.y + box.height * (0.5 + 0.28 * Math.sin(i * Math.PI / 20)) }));
  if (touch) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [points[0]!] });
    for (const point of points.slice(1)) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [point] });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await session.detach();
  } else {
    await page.mouse.move(points[0]!.x, points[0]!.y); await page.mouse.down();
    for (const point of points.slice(1)) await page.mouse.move(point.x, point.y);
    await page.mouse.up();
  }
}

for (const mobile of [false, true]) describe(mobile ? "390 px touch" : "desktop mouse", () => {
  it("types editable speech and sends only after Send", async () => {
    const page = await open(mobile);
    expect(await page.evaluate(() => (window as any).starts)).toBe(0);
    await page.locator("luh-surface textarea").fill("Please");
    await part(page, "microphone")[mobile ? "tap" : "click"]();
    expect(await page.evaluate(() => (window as any).recognition.lang)).toBe("en-CA");
    expect(await part(page, "send").isDisabled()).toBe(true);
    expect(await part(page, "voice-status").textContent()).toContain("Listening");
    await part(page, "microphone")[mobile ? "tap" : "click"]();
    expect(await page.locator("luh-surface textarea").inputValue()).toBe("Please Move the heading");
    expect(await page.evaluate(() => (window as any).received)).toBeNull();
    await page.locator("luh-surface textarea").fill("Please move the heading up");
    await part(page, "send").click();
    await page.waitForFunction(() => Boolean((window as any).received));
    expect(await page.evaluate(() => (window as any).received.body)).toBe("Please move the heading up");
    await page.close();
  });

  it("draws a smooth circle, undoes and redoes it, and exports its pixels", async () => {
    const page = await open(mobile);
    await page.locator("luh-surface textarea").fill("Circle this");
    await upload(page);
    const before = await page.evaluate(() => window.scrollY);
    await circle(page, mobile);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    const paths = page.locator("luh-surface .cm-mark path");
    expect(await paths.count()).toBe(1);
    expect(await paths.getAttribute("d")).toContain(" Q");
    await part(page, "undo").click();
    expect(await paths.count()).toBe(0);
    await part(page, "redo").click();
    expect(await paths.count()).toBe(1);
    const overflow = await page.evaluate(() => {
      const dialog = document.querySelector("luh-surface")!.shadowRoot!.querySelector("dialog")!;
      return dialog.scrollWidth > innerWidth;
    });
    expect(overflow).toBe(false);
    await part(page, "done").click();
    await part(page, "send").click();
    await page.waitForFunction(() => Boolean((window as any).received));
    const red = await page.evaluate(async () => {
      const blob = new Blob([new Uint8Array((window as any).received.image)], { type: "image/png" });
      const image = await createImageBitmap(blob); const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d")!; ctx.drawImage(image, 0, 0);
      const data = ctx.getImageData(0, 0, image.width, image.height).data;
      let ink = 0; for (let i = 0; i < data.length; i += 4) if (data[i]! > 180 && data[i + 1]! < 120 && data[i + 2]! < 120) ink++;
      return ink;
    });
    expect(red).toBeGreaterThan(500);
    if (mobile) {
      const session = await page.context().newCDPSession(page);
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: 700 }] });
      for (let y = 680; y >= 300; y -= 20) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForFunction(() => window.scrollY > 0);
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await session.detach();
    }
    await page.close();
  });
});

it("hides unsupported speech and aborts a discarded recording", async () => {
  const unsupported = await open(false, false);
  expect(await part(unsupported, "microphone").isVisible()).toBe(false);
  await unsupported.close();
  const page = await open(false);
  await part(page, "microphone").click();
  await part(page, "cancel").click();
  expect(await page.evaluate(() => (window as any).aborts)).toBe(1);
  await page.close();
});

it("keeps stylus scribbles separate and cancels interrupted input without changing history", async () => {
  const page = await open(false);
  await upload(page);
  await page.evaluate(() => {
    const canvas = document.querySelector("luh-surface")!.shadowRoot!.querySelector(".cm-canvas")!;
    // Synthetic pen pointers cover identity/cancellation; the mouse and touch tests use browser input.
    const point = (type: string, pointerId: number, x: number, y: number) => canvas.dispatchEvent(new PointerEvent(type, { pointerId, pointerType: "pen", clientX: x, clientY: y, bubbles: true }));
    const box = canvas.getBoundingClientRect();
    // Synthetic pointer IDs are not active browser pointers, so capture is a no-op here.
    (canvas as SVGSVGElement).setPointerCapture = () => {};
    point("pointerdown", 1, box.x + 40, box.y + 40);
    point("pointermove", 2, box.x + 400, box.y + 300);
    point("pointerup", 2, box.x + 400, box.y + 300);
    point("pointermove", 1, box.x + 100, box.y + 80);
    point("pointercancel", 1, box.x + 100, box.y + 80);
  });
  expect(await page.locator("luh-surface .cm-mark").count()).toBe(0);
  expect(await part(page, "undo").isDisabled()).toBe(true);
  await circle(page, false);
  await circle(page, false);
  expect(await page.locator("luh-surface .cm-mark").count()).toBe(2);
  await part(page, "undo").click();
  expect(await page.locator("luh-surface .cm-mark").count()).toBe(1);
  await page.close();
});

it("retains editable text after speech errors and ignores queued results after disconnect", async () => {
  const page = await open(false);
  await page.locator("luh-surface textarea").fill("Keep these words");
  await part(page, "microphone").click();
  await page.evaluate(() => (window as any).recognition.onerror());
  expect(await page.locator("luh-surface textarea").inputValue()).toBe("Keep these words");
  expect(await page.locator("luh-surface .cm-error").textContent()).toContain("Check microphone access");
  await part(page, "microphone").click();
  await page.evaluate(async () => {
    const probe = window as any;
    const late = probe.recognition.onresult;
    probe.notes.remove();
    // A move within one turn deliberately preserves Luh. A disconnect lasts past its cleanup microtask.
    await Promise.resolve();
    document.body.append(probe.notes);
    probe.notes.open();
    late({ resultIndex: 0, results: [{ isFinal: true, 0: { transcript: "Old words" } }] });
  });
  expect(await page.locator("luh-surface textarea").inputValue()).toBe("");
  expect(await page.evaluate(() => (window as any).aborts)).toBe(2);
  await page.close();
});
