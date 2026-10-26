import { createCommentMode, type Note } from "../../src/index";

declare global {
  interface Window {
    luhSent: { screenshot: string | null; preview: string | null; context: Note["context"] } | null;
    luh: ReturnType<typeof createCommentMode>;
  }
}

const toBase64 = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
};

window.luhSent = null;
window.luh = createCommentMode({
  theme: "light",
  redact: { blur: [".crm-email"] },
  pages: [
    { match: "/blurred.html", mode: "blur" },
    { match: "/off.html", mode: "off" },
  ],
  async onSubmit(note) {
    // The picture the window showed, read from its thumbnail, to prove it is what was sent.
    const thumb = window.luh.surface.shadowRoot!.querySelector<HTMLImageElement>(".cm-thumb img");
    const preview = thumb ? await (await fetch(thumb.src)).blob() : null;
    window.luhSent = {
      screenshot: note.screenshot ? await toBase64(note.screenshot) : null,
      preview: preview ? await toBase64(preview) : null,
      context: note.context,
    };
  },
});
