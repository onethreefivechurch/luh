import { createCommentMode } from "../../src/index";
const probe = window as unknown as Record<string, any>;
probe.received = null;
probe.notes = createCommentMode({ theme: "light", language: "en-CA", thanks: false, async onSubmit(note) {
  const image = note.images[0];
  probe.received = { body: note.body, image: image ? Array.from(new Uint8Array(await image.arrayBuffer())) : null };
} });
document.querySelector("#open")!.addEventListener("click", () => probe.notes.open());
