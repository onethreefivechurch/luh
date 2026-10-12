import { createCommentMode, STRINGS, type Note } from "@onethreefivechurch/luh";

const sent = document.getElementById("sent")!;
const toggle = document.getElementById("comment")!;
toggle.textContent = `${STRINGS.trigger} · C`;
const mode = createCommentMode({
  theme: "light",
  name: "optional",
  kinds: [
    { value: "bug", label: "Bug", prompt: "What's wrong?" },
    { value: "idea", label: "Idea", prompt: "What's your idea?" },
    { value: "help", label: "Help", prompt: "What do you need help with?" },
  ],
  ignore: ".demo-ui",
  appVersion: "demo",
  finePrint: "Notes stay on this page.",
  async onSubmit(note: Note) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const files = [note.screenshot, ...note.images].filter(Boolean).map((file) => file!.name);
    sent.textContent = JSON.stringify({ ...note, screenshot: undefined, images: files }, null, 2);
  },
});
mode.addEventListener("change", () => toggle.setAttribute("aria-pressed", String(mode.active)));
toggle.addEventListener("click", () => mode.toggle());
document
  .getElementById("feedback")!
  .addEventListener("click", (event) => mode.open({ from: event }));
document
  .getElementById("dialog-feedback")!
  .addEventListener("click", (event) => mode.open({ from: event }));
const dialog = document.getElementById("dialog") as HTMLDialogElement;
document.getElementById("open-dialog")!.addEventListener("click", () => dialog.showModal());
const theme = document.getElementById("theme")!;
theme.addEventListener("click", () => {
  const dark = document.documentElement.dataset.theme !== "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  mode.configure({ theme: dark ? "dark" : "light" });
  theme.textContent = dark ? "Light" : "Dark";
});

const skin = document.getElementById("skin")!;
skin.addEventListener("click", () => {
  const styled = mode.classList.toggle("host-style");
  mode.surface.classList.toggle("host-style", styled);
  skin.textContent = styled ? "Default styling" : "Host styling";
});
