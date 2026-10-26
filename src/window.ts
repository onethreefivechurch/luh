// The one note window, whichever way in: Send feedback opens it on its own,
// a pick opens it beside the thing picked. Same words box, kinds, pictures,
// drawing and screenshot choice either way. Pictures come from Screenshot
// this page, a paste, a drop anywhere on the screen, or the file chooser.
import Uppy from "@uppy/core";
import { openEditor } from "./editor";
import { apple, finePointer, h, icon as renderIcon, showOnTop, hideFromTop } from "./dom";
import { format, type Strings } from "./strings";
import type { IconName, IconOverrides } from "./dom";
import type { Kind, NameField, Via, SubmitProgress } from "./types";
import type { Tool } from "./drawing";

export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export interface WindowCallbacks {
  /** Label of the in-window pick action; with `pick`, shows the action. */
  pickLabel?: string;
  /** Hands the draft over to picking another part of the page. */
  pick?(): void;
  strings: Strings;
  icons?: IconOverrides;
  name: NameField;
  screenshot: boolean;
  drawing: boolean;
  kinds: Kind[];
  finePrint?: string;
  maxImages: number;
  maxImageBytes: number;
  /** Takes the page (and, for a pick, the picked part) when the person asks. */
  capture(): Promise<{ page: File | null; element: File | null }>;
  /** The last screenshot marked again for the pick as it now is, or null without one. */
  remark(): Promise<{ page: File | null; element: File | null } | null>;
  screenshotNote(): string | null;
  /** What the screenshot had painted over: how many private areas, or the whole page. */
  covered(): { count: number; wholePage: boolean } | null;
  /** Widen (+1) or narrow (-1) the pick; returns the new pick's name. */
  widen(delta: number): string | null;
  widenState(): { wider: boolean; narrower: boolean };
  pickedText(): string;
  /** Sends; resolves to an error message to show, or null when sent. */
  send(parts: {
    body: string;
    name: string | null;
    kind: string | null;
    screenshot: File | null;
    images: File[];
  }, progress: SubmitProgress): Promise<string | null>;
  closed(): void;
  /** Where the pick is now, to sit beside it; null for no pick. */
  anchor(): DOMRect | null;
  /** The button the window opened from, to sit just under it; null for none. */
  opener(): DOMRect | null;
}

// `drawn`: the person drew on it, so it is never swapped for a fresh one.
type PictureMeta = { [key: string]: unknown; url: string; taken?: "page" | "element"; drawn?: boolean };
type Picture = PictureMeta & { id: string; file: File };

export class NoteWindow {
  readonly panel: HTMLElement;
  private body = "";
  private nameField: HTMLInputElement;
  private kind: string | null;
  private readonly queue: Uppy<PictureMeta, Record<string, never>>;
  private nextId = 1;
  private uploadPercent: number | null = null;
  private uploadProgress = h("progress", { max: 100, hidden: true, part: "upload-progress" });
  private sending = false;
  private capturing = false;
  private percent = 0;
  private progressLine = h("p", { class: "cm-sr", role: "status" });
  private selectedText = "";
  private confirming = false;
  private problem: string | null = null;
  private error: string | null = null;
  private drawing = false;
  private editorController: AbortController | null = null;
  // Counts openings, so a slow screenshot lands only in the note that asked.
  private opening = 0;
  private via: Via = "write";
  private position = { x: 16, y: 16 };
  private dragging = 0;
  private openingDialogs = new Set<Element>();
  private cleanups: (() => void)[] = [];
  private readonly titleId = `cm-title-${Math.random().toString(36).slice(2)}`;
  // Parts updated in place.
  private title = h("h2", { class: "cm-title" });
  private quote = h("blockquote", { class: "cm-quote" });
  private widerButton: HTMLButtonElement;
  private narrowerButton: HTMLButtonElement;
  private kindRow: HTMLElement;
  private field: HTMLTextAreaElement;
  private list = h("ul", { class: "cm-images" });
  private screenshotButton: HTMLButtonElement;
  pickButton: HTMLButtonElement | null = null;
  private suspended = false;
  private addButton: HTMLButtonElement;
  private note = h("p", { class: "cm-small cm-warning" });
  private coveredLine = h("p", { class: "cm-small cm-covered", part: "covered" });
  private problemLine = h("p", { class: "cm-small cm-error", role: "alert" });
  private errorLine = h("p", { class: "cm-error-box", role: "alert" });
  private sendButton: HTMLButtonElement;
  private footer: HTMLElement;
  private confirm: HTMLElement;
  private chooser: HTMLInputElement;
  private dropZone: HTMLElement;

  constructor(
    private readonly root: ShadowRoot,
    private readonly host: WindowCallbacks,
  ) {
    const { strings } = host;
    this.queue = new Uppy({
      autoProceed: false,
      onBeforeFileAdded: (file) => ({ ...file, id: `${file.id}-${this.nextId++}` }),
      restrictions: {
        maxNumberOfFiles: host.maxImages,
        maxFileSize: host.maxImageBytes,
        allowedFileTypes: IMAGE_TYPES,
      },
    });
    this.kind = host.kinds[0]?.value ?? null;
    this.nameField = h("input", {
      type: "text",
      part: "name-field",
      class: "cm-field",
      autocomplete: "name",
      maxlength: 200,
      placeholder: strings.namePlaceholder,
      "aria-label": host.name === "optional" ? strings.nameOptional : strings.nameLabel,
      required: host.name === "required",
      hidden: host.name === "off",
    });
    this.nameField.addEventListener("input", () => this.refresh());
    this.widerButton = this.toolButton("up", strings.wider, strings.widerHint, () => this.widen(1));
    this.narrowerButton = this.toolButton("down", strings.narrower, strings.narrower, () =>
      this.widen(-1),
    );
    const handle = h(
      "div",
      {
        class: "cm-handle-bar",
        tabindex: 0,
        role: "group",
        "aria-label": strings.moveWindow,
      },
      this.icon("grip"),
    );
    this.kindRow = h("div", {
      class: "cm-kinds",
      role: "radiogroup",
      "aria-label": strings.kindLabel,
    });
    this.field = h("textarea", {
      class: "cm-field",
      part: "body-field",
      rows: 3,
      maxlength: 5000,
      "aria-labelledby": this.titleId,
    });
    this.field.addEventListener("input", () => {
      this.body = this.field.value;
      this.fit();
      this.refresh();
    });
    this.field.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        void this.submit();
      }
    });
    this.screenshotButton = h(
      "button",
      {
        type: "button",
        class: "cm-button",
        part: "screenshot",
        onclick: () => void this.screenshot(),
      },
      this.icon("camera"),
      h("span", {}, strings.screenshot),
    );
    this.addButton = h(
      "button",
      {
        type: "button",
        class: "cm-button",
        part: "add-images",
        onclick: () => this.chooser.click(),
      },
      this.icon("image"),
      h("span", {}, strings.addImages),
    );
    this.chooser = h("input", {
      type: "file",
      multiple: true,
      accept: IMAGE_TYPES.join(","),
      hidden: true,
      tabindex: -1,
    });
    this.chooser.addEventListener("change", () => {
      [...(this.chooser.files ?? [])].forEach((file) => this.add(file));
      this.chooser.value = "";
    });
    const keys = apple() ? "⌘↵" : strings.sendShortcut;
    this.sendButton = h(
      "button",
      {
        type: "button",
        class: "cm-button cm-primary",
        part: "send",
        "aria-keyshortcuts": apple() ? "Meta+Enter" : "Control+Enter",
      },
      this.icon("send"),
      h("span", {}, strings.send),
      finePointer() ? h("kbd", { class: "cm-kbd" }, keys) : null,
    );
    this.footer = h(
      "div",
      { class: "cm-footer" },
      host.finePrint
        ? h("p", { class: "cm-small cm-fine" }, host.finePrint)
        : h("span", { class: "cm-spacer" }),
      h(
        "button",
        {
          type: "button",
          class: "cm-button cm-quiet",
          part: "cancel",
          onclick: () => this.requestClose(),
        },
        strings.cancel,
      ),
      this.sendButton,
    );
    this.confirm = h(
      "div",
      {
        class: "cm-confirm",
        role: "alertdialog",
        "aria-label": strings.discardTitle,
        hidden: true,
      },
      h("p", { class: "cm-confirm-text" }, strings.discardTitle),
      h(
        "button",
        {
          type: "button",
          class: "cm-button",
          part: "keep-editing",
          onclick: () => this.keepEditing(),
        },
        strings.keepEditing,
      ),
      h(
        "button",
        {
          type: "button",
          class: "cm-button cm-danger",
          part: "discard",
          onclick: () => this.close(),
        },
        strings.discard,
      ),
    );
    this.pickButton = host.pick
      ? h(
          "button",
          {
            type: "button",
            class: "cm-button",
            part: "point",
            onclick: () => host.pick?.(),
          },
          this.icon("pen"),
          host.pickLabel,
        )
      : null;
    const form = h(
      "div",
      { class: "cm-form" },
      this.pickButton,
      this.quote,
      this.kindRow,
      this.field,
      host.name === "off"
        ? null
        : h(
            "label",
            { class: "cm-small" },
            host.name === "optional" ? strings.nameOptional : strings.nameLabel,
            this.nameField,
          ),
      this.errorLine,
      this.list,
      this.coveredLine,
      h("div", { class: "cm-picture-actions" }, this.screenshotButton, this.addButton),
      // A phone has nothing to drag.
      finePointer() ? h("p", { class: "cm-small" }, strings.dropHint) : null,
      this.note,
      this.problemLine,
      this.progressLine,
      this.uploadProgress,
      this.chooser,
    );
    this.sendButton.addEventListener("click", () => void this.submit());
    this.title.id = this.titleId;
    this.panel = h(
      "section",
      {
        class: "cm-window",
        role: "dialog",
        "aria-modal": "false",
        "aria-labelledby": this.titleId,
        popover: "manual",
        hidden: true,
      },
      h(
        "header",
        { class: "cm-header" },
        handle,
        this.title,
        this.widerButton,
        this.narrowerButton,
        this.toolButton("close", strings.close, strings.close, () => this.requestClose()),
      ),
      h("div", { class: "cm-scroll" }, form),
      this.footer,
      this.confirm,
    );
    this.dropZone = h(
      "div",
      { class: "cm-drop", popover: "manual", hidden: true, "aria-hidden": "true" },
      strings.dropHere,
    );
    root.append(this.panel, this.dropZone);
    this.draggable(handle);
  }

  get isOpen() {
    return !this.panel.hidden || this.suspended;
  }

  private get pictures(): Picture[] {
    const order = (picture: Picture) => picture.taken === "page" ? 0 : picture.taken === "element" ? 1 : 2;
    return this.queue.getFiles().map((file) => ({ ...file.meta, id: file.id, file: file.data as File }))
      .sort((a, b) => order(a) - order(b));
  }

  private icon(name: IconName) {
    return renderIcon(name, this.host.icons);
  }

  private toolButton(
    name: "up" | "down" | "close",
    label: string,
    hint: string,
    onclick: () => void,
  ) {
    const button = h(
      "button",
      {
        type: "button",
        class: "cm-icon-button",
        part: name === "up" ? "wider" : name === "down" ? "narrower" : "close",
        "aria-label": label,
        title: hint,
        onclick,
      },
      this.icon(name),
    );
    button.addEventListener("pointerdown", (event) => event.stopPropagation());
    return button;
  }

  /** Hides the window while keeping the draft and Uppy queue for picking. */
  suspend() {
    if (!this.isOpen || !this.acceptsFiles()) return false;
    this.suspended = true;
    this.opening++;
    this.dragging = 0;
    hideFromTop(this.panel);
    hideFromTop(this.dropZone);
    this.panel.hidden = true;
    this.dropZone.hidden = true;
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    return true;
  }

  open(options: { via: Via; name?: string; selectedText?: string; pickedText?: string }) {
    this.suspended = false;
    const { strings } = this.host;
    this.opening++;
    this.openingDialogs = new Set(this.visibleDialogs());
    this.via = options.via;
    this.title.textContent = options.via === "pick" && options.name ? options.name : strings.title;
    this.selectedText = options.selectedText ?? "";
    this.quote.textContent = this.selectedText || options.pickedText || "";
    this.quote.hidden = !this.quote.textContent;
    this.quote.setAttribute(
      "aria-label",
      this.selectedText ? strings.selection : strings.elementImageName,
    );
    this.error = null;
    this.problem = null;
    this.confirming = false;
    this.panel.hidden = false;
    showOnTop(this.panel);
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    this.listen();
    this.refresh();
    this.place();
    this.fit();
    const opening = this.opening;
    requestAnimationFrame(() => {
      if (opening === this.opening && !this.panel.hidden) this.field.focus({ preventScroll: true });
    });
  }

  /** Closes and forgets the note. */
  close() {
    if (!this.isOpen) return;
    this.suspended = false;
    this.opening++;
    this.editorController?.abort();
    this.editorController = null;
    this.drawing = false;
    this.sending = false;
    this.uploadPercent = null;
    this.body = "";
    this.field.value = "";
    this.nameField.value = "";
    this.kind = this.host.kinds[0]?.value ?? null;
    this.pictures.forEach((picture) => URL.revokeObjectURL(picture.url));
    this.queue.clear();
    this.confirming = false;
    this.capturing = false;
    hideFromTop(this.panel);
    hideFromTop(this.dropZone);
    this.dropZone.hidden = true;
    this.panel.hidden = true;
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
    this.host.closed();
  }

  /** Closes, asking first when there is something to lose. */
  requestClose() {
    if (this.sending) return;
    if (!this.body.trim() && !this.nameField.value.trim() && !this.pictures.length)
      return this.close();
    this.confirming = true;
    this.refresh();
    this.confirm.querySelector<HTMLButtonElement>("button")?.focus();
  }

  private keepEditing() {
    this.confirming = false;
    this.refresh();
    this.field.focus();
  }

  // A wider or narrower pick marks the same screenshot again and swaps it in
  // for the taken pictures, keeping any the person drew on.
  private async widen(delta: number) {
    const name = this.host.widen(delta);
    if (name) {
      this.title.textContent = name;
      if (!this.selectedText) {
        this.quote.textContent = this.host.pickedText();
        this.quote.hidden = !this.quote.textContent;
      }
    }
    this.refresh();
    this.place();
    if (!this.pictures.some((picture) => picture.taken && !picture.drawn)) return;
    const opening = this.opening;
    const fresh = await this.host.remark();
    if (!fresh || opening !== this.opening) return;
    for (const taken of ["page", "element"] as const) {
      const old = this.pictures.find((picture) => picture.taken === taken);
      if (old?.drawn) continue;
      const file = fresh[taken];
      if (old && file) this.replace(old, file, false);
      else if (old) this.remove(old.id);
      else if (file) this.add(file, taken);
    }
    this.refresh();
  }

  private fit() {
    this.field.style.height = "auto";
    this.field.style.height = `${Math.min(this.field.scrollHeight + 2, 240)}px`;
  }

  // Everything that depends on state, updated in place.
  private refresh() {
    const { strings, kinds } = this.host;
    if (this.pickButton) this.pickButton.disabled = !this.acceptsFiles();
    const placeholder =
      kinds.find((kind) => kind.value === this.kind)?.prompt ?? strings.placeholder;
    this.field.placeholder = placeholder;
    this.field.disabled = this.sending;
    this.kindRow.hidden = kinds.length === 0;
    this.kindRow.replaceChildren(
      ...kinds.map((kind, index) => {
        const checked = kind.value === this.kind;
        const chip = h(
          "button",
          {
            type: "button",
            role: "radio",
            class: "cm-chip",
            "aria-checked": String(checked),
            tabindex: checked ? 0 : -1,
            disabled: this.sending,
          },
          kind.label,
        );
        chip.addEventListener("click", () => {
          this.kind = kind.value;
          this.refresh();
        });
        chip.addEventListener("keydown", (event) => {
          const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
          if (!step) return;
          event.preventDefault();
          const next = kinds[(index + step + kinds.length) % kinds.length]!;
          this.kind = next.value;
          this.refresh();
          this.kindRow.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
        });
        return chip;
      }),
    );
    const widen = this.host.widenState();
    this.widerButton.hidden = this.via !== "pick";
    this.widerButton.disabled = !widen.wider || this.capturing;
    this.narrowerButton.hidden = this.via !== "pick" || !widen.narrower;
    this.narrowerButton.disabled = this.capturing;

    this.list.hidden = this.pictures.length === 0;
    this.list.setAttribute("aria-label", strings.images);
    this.list.replaceChildren(...this.pictures.map((picture) => this.row(picture)));
    const hasScreenshot = this.pictures.some((picture) => picture.taken === "page");
    this.screenshotButton.hidden = !this.host.screenshot || hasScreenshot;
    this.screenshotButton.disabled = this.capturing || this.sending || this.full();
    this.screenshotButton.querySelector("span")!.textContent = this.capturing
      ? `${strings.screenshotTaking} ${this.percent}%`
      : strings.screenshot;
    this.screenshotButton.setAttribute("aria-busy", String(this.capturing));
    this.addButton.disabled = !this.acceptsFiles() || this.full();
    const note = !this.host.screenshot || hasScreenshot ? null : this.host.screenshotNote();
    this.note.textContent = note ?? "";
    this.note.hidden = !note;
    const covered = hasScreenshot ? this.host.covered() : null;
    const coveredWords = !covered
      ? ""
      : covered.wholePage
        ? strings.coveredPage
        : covered.count === 1
          ? strings.coveredOne
          : covered.count > 1
            ? format(strings.coveredMany, { number: covered.count })
            : "";
    this.coveredLine.textContent = coveredWords;
    this.coveredLine.hidden = !coveredWords;
    this.problemLine.textContent = this.problem ?? "";
    this.problemLine.hidden = !this.problem;
    this.errorLine.textContent = this.error ?? "";
    this.errorLine.hidden = !this.error;
    this.nameField.disabled = this.sending;
    this.sendButton.disabled =
      !this.body.trim() ||
      (this.host.name === "required" && !this.nameField.value.trim()) ||
      this.sending ||
      this.capturing;
    this.sendButton.querySelector("span")!.textContent = this.sending
      ? strings.sending
      : strings.send;
    this.sendButton.setAttribute("aria-busy", String(this.sending));
    this.uploadProgress.hidden = !this.sending;
    this.uploadProgress.setAttribute("aria-label", strings.sending);
    if (this.uploadPercent === null) this.uploadProgress.removeAttribute("value");
    else this.uploadProgress.value = this.uploadPercent;
    if (this.sending) {
      const status = this.uploadPercent === null ? strings.sending : `${strings.sending} ${this.uploadPercent}%`;
      this.sendButton.querySelector("span")!.textContent = status;
      this.progressLine.textContent = status;
    }
    this.footer.hidden = this.confirming;
    this.confirm.hidden = !this.confirming;
    this.panel.setAttribute("aria-busy", String(this.sending || this.capturing));
  }

  private label(picture: Picture) {
    const { strings } = this.host;
    if (picture.taken === "page") return strings.screenshotName;
    if (picture.taken === "element") return strings.elementImageName;
    return picture.file.name;
  }

  private row(picture: Picture) {
    const { strings } = this.host;
    const name = this.label(picture);
    const draw = () => void this.draw(picture);
    const blur = () => void this.draw(picture, "blur");
    return h(
      "li",
      { class: "cm-image" },
      h(
        "button",
        { type: "button", class: "cm-thumb", tabindex: -1, "aria-hidden": "true", onclick: draw },
        h("img", { src: picture.url, alt: "" }),
      ),
      h("span", { class: "cm-image-name" }, name),
      this.host.drawing
        ? h(
            "button",
            {
              type: "button",
              class: "cm-button cm-quiet",
              part: "draw",
              "aria-label": format(strings.drawOn, { name }),
              disabled: this.sending,
              onclick: draw,
            },
            this.icon("pen"),
            h("span", {}, strings.draw),
          )
        : null,
      this.host.drawing
        ? h(
            "button",
            {
              type: "button",
              class: "cm-button cm-quiet",
              part: "blur-more",
              "aria-label": format(strings.blurMoreOn, { name }),
              disabled: this.sending,
              onclick: blur,
            },
            this.icon("blur"),
            h("span", {}, strings.blurMore),
          )
        : null,
      h(
        "button",
        {
          type: "button",
          class: "cm-icon-button",
          part: "remove-image",
          "aria-label": format(strings.removeNamed, { name }),
          title: format(strings.removeNamed, { name }),
          disabled: this.sending,
          onclick: () => {
            this.remove(picture.id);
            this.refresh();
            this.addButton.focus();
          },
        },
        this.icon("close"),
      ),
    );
  }

  private full() {
    return this.pictures.length >= this.host.maxImages;
  }

  /** Every image source enters the same Uppy queue. No bytes leave before Send. */
  add(file: File, taken?: Picture["taken"]) {
    if (this.panel.hidden || !this.acceptsFiles()) return;
    this.problem = null;
    try {
      const id = this.queue.addFile({
        name: file.name, type: file.type, data: file, source: "luh", meta: { url: "", taken },
      });
      this.queue.setFileMeta(id, { url: URL.createObjectURL(file) });
    } catch {
      this.rejected(file);
    }
    this.refresh();
  }

  private rejected(file: File, count = this.full()) {
    const { strings, maxImages, maxImageBytes } = this.host;
    this.problem = count
      ? format(strings.tooMany, { max: maxImages })
      : format(strings.wrongImage, { name: file.name, size: Math.round(maxImageBytes / 1024 / 1024) });
  }

  /** Validate against the other files before changing anything, preserving the original on refusal. */
  private replace(picture: Picture, file: File, drawn: boolean) {
    const remaining = this.queue.getFiles().filter((each) => each.id !== picture.id);
    const error = this.queue.validateRestrictions({ name: file.name, type: file.type, size: file.size, extension: file.name.split(".").pop() ?? "" }, remaining);
    if (error) {
      this.rejected(file, false);
      return;
    }
    const url = URL.createObjectURL(file);
    this.queue.setFileState(picture.id, {
      data: file, name: file.name, type: file.type, size: file.size,
      extension: file.name.split(".").pop() ?? "",
      meta: { ...this.queue.getFile(picture.id).meta, name: file.name, type: file.type, url, drawn },
    });
    URL.revokeObjectURL(picture.url);
    this.problem = null;
  }

  private remove(id: string) {
    const picture = this.pictures.find((each) => each.id === id);
    if (picture) URL.revokeObjectURL(picture.url);
    this.queue.removeFile(id);
  }

  captureProgress(percent: number) {
    if (!this.capturing || this.panel.hidden) return;
    this.percent = percent;
    this.progressLine.textContent = `${this.host.strings.screenshotTaking} ${percent}%`;
    this.screenshotButton.querySelector("span")!.textContent =
      `${this.host.strings.screenshotTaking} ${percent}%`;
  }

  private async screenshot() {
    if (!this.host.screenshot || this.panel.hidden || !this.acceptsFiles()) return;
    if (this.capturing) return;
    this.capturing = true;
    this.percent = 0;
    this.problem = null;
    this.refresh();
    // A note closed (and perhaps another opened) while the picture was taken
    // never receives it.
    const opening = this.opening;
    await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
    if (!this.isOpen || opening !== this.opening) return;
    const { page, element } = await this.host.capture();
    if (opening !== this.opening) return;
    this.capturing = false;
    if (!this.isOpen) return;
    if (!page) this.problem = this.host.strings.screenshotFailed;
    else {
      this.add(page, "page");
      if (element && !this.full()) this.add(element, "element");
    }
    this.refresh();
    this.list.querySelector<HTMLButtonElement>(".cm-image .cm-button")?.focus();
  }

  private async draw(picture: Picture, start: Tool = "arrow") {
    if (!this.host.drawing || this.panel.hidden || !this.acceptsFiles()) return;
    const opening = this.opening;
    this.drawing = true;
    const controller = new AbortController();
    this.editorController = controller;
    const result = await openEditor(
      picture.file,
      this.host.strings,
      this.root,
      controller.signal,
      this.host.icons,
      start,
    );
    if (opening !== this.opening || !this.isOpen) return;
    this.editorController = null;
    this.drawing = false;
    if (result.action === "done") {
      this.replace(picture, result.file, true);
    } else if (result.action === "remove") this.remove(picture.id);
    this.refresh();
    const index = this.pictures.findIndex((each) => each.id === picture.id);
    (index >= 0
      ? this.list.children[index]?.querySelector<HTMLButtonElement>(".cm-button")
      : this.addButton
    )?.focus();
  }

  get editing() {
    return this.drawing;
  }

  private async submit() {
    if (!this.body.trim() || this.panel.hidden || this.sending || this.capturing) return;
    if (this.host.name === "required" && !this.nameField.value.trim()) {
      this.error = this.host.strings.nameRequired;
      this.refresh();
      this.nameField.focus();
      return;
    }
    const opening = this.opening;
    this.sending = true;
    this.uploadPercent = null;
    this.queue.setState({ totalProgress: 0 });
    this.error = null;
    this.refresh();
    const page = this.pictures.find((picture) => picture.taken === "page");
    const files = this.pictures
      .filter((picture) => picture.id !== page?.id)
      .map((picture) =>
        picture.taken === "element" ? rename(picture.file, "element.png") : picture.file,
      );
    const progress: SubmitProgress = {
      onProgress: (percent) => {
        if (opening !== this.opening || this.panel.hidden || !this.sending || !Number.isFinite(percent)) return;
        this.uploadPercent = Math.round(Math.max(0, Math.min(100, percent)));
        this.queue.setState({ totalProgress: this.uploadPercent });
        this.refresh();
      },
    };
    let error: string | null;
    try {
      error = await this.host.send({
        body: this.body.trim(),
        name: this.host.name === "off" ? null : this.nameField.value.trim() || null,
        kind: this.kind,
        screenshot: page ? rename(page.file, "page.png") : null,
        images: files,
      }, progress);
    } catch {
      error = this.host.strings.failed;
    }
    if (opening !== this.opening || !this.isOpen) return;
    this.sending = false;
    if (error === null) {
      this.close();
      return;
    }
    this.error = error;
    this.refresh();
    this.field.focus();
  }

  /** Called after close when the controller replaces or disconnects this window. */
  dispose() {
    this.queue.destroy();
  }

  private visibleDialogs() {
    return [...document.querySelectorAll('dialog:modal, [role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]')]
      .filter((dialog) => dialog.getClientRects().length > 0);
  }

  private ownsInput() {
    if (!this.isOpen) return false;
    // Feedback opens above its existing host dialog. A later modal owns the next file action.
    return this.visibleDialogs().every((dialog) =>
      this.openingDialogs.has(dialog) || dialog.contains(this.root.host));
  }

  private acceptsFiles() {
    return !this.suspended && !this.drawing && !this.sending && !this.capturing && !this.confirming;
  }

  // Foreground ownership blocks file navigation even while this draft is busy.
  private listen() {
    const on = <K extends keyof DocumentEventMap>(
      type: K,
      listener: (event: DocumentEventMap[K]) => void,
    ) => {
      const guarded = (event: DocumentEventMap[K]) => {
        if (this.ownsInput()) listener(event);
        else {
          this.dragging = 0;
          this.dropZone.hidden = true;
          hideFromTop(this.dropZone);
        }
      };
      document.addEventListener(type, guarded, true);
      this.cleanups.push(() => document.removeEventListener(type, guarded, true));
    };
    const carries = (event: DragEvent) => [...(event.dataTransfer?.types ?? [])].includes("Files");
    const showDrop = (shown: boolean) => {
      this.dropZone.hidden = !shown;
      if (shown) showOnTop(this.dropZone);
      else hideFromTop(this.dropZone);
    };
    on("paste", (event) => {
      const files = [...(event.clipboardData?.files ?? [])].filter((file) =>
        file.type.startsWith("image/"),
      );
      if (!files.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (this.acceptsFiles()) files.forEach((file) => this.add(file));
    });
    on("dragenter", (event) => {
      if (!carries(event)) return;
      event.stopImmediatePropagation();
      if (this.acceptsFiles()) {
        this.dragging++;
        showDrop(true);
      } else {
        this.dragging = 0;
        showDrop(false);
      }
    });
    on("dragleave", (event) => {
      if (!carries(event)) return;
      this.dragging = Math.max(0, this.dragging - 1);
      if (!this.dragging) showDrop(false);
    });
    on("dragover", (event) => {
      if (carries(event)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (!this.acceptsFiles()) showDrop(false);
      }
    });
    on("drop", (event) => {
      this.dragging = 0;
      showDrop(false);
      const files = [...(event.dataTransfer?.files ?? [])];
      if (!files.length && !carries(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (this.acceptsFiles()) files.forEach((file) => this.add(file));
    });
    const onResize = () => this.place();
    window.addEventListener("resize", onResize);
    this.cleanups.push(() => window.removeEventListener("resize", onResize));
  }

  private viewport() {
    return {
      width: document.documentElement.clientWidth || window.innerWidth,
      height: document.documentElement.clientHeight || window.innerHeight,
    };
  }

  /** Width on this screen: 400, or the screen less its margins. */
  private width() {
    return Math.min(400, this.viewport().width - 32);
  }

  // Beside the pick, level with its top, as a comment sits at its pin;
  // otherwise below or above it, whichever has more room. Without a pick,
  // just under the button that opened it, as a menu drops from its button,
  // or in the top right corner.
  place() {
    const width = this.width();
    const viewport = this.viewport();
    const rect = this.host.anchor();
    let x = viewport.width - width - 16;
    let y = 16;
    let room = viewport.height - 32;
    const opener = rect ? null : this.host.opener();
    if (opener && opener.width && viewport.height - opener.bottom - 24 >= 320) {
      x = Math.max(16, Math.min(opener.right - width, viewport.width - width - 16));
      y = opener.bottom + 8;
      room = viewport.height - y - 16;
    }
    if (rect) {
      const level = Math.max(16, Math.min(rect.top, viewport.height - 280));
      if (viewport.width - rect.right - 32 >= width) {
        x = rect.right + 16;
        y = level;
      } else if (rect.left - 32 >= width) {
        x = rect.left - width - 16;
        y = level;
      } else {
        x = Math.max(16, Math.min(rect.left, viewport.width - width - 16));
        const below = viewport.height - Math.max(0, rect.bottom) - 32;
        const above = Math.min(viewport.height, rect.top) - 32;
        y = below >= above ? Math.max(16, rect.bottom + 16) : 16;
        room = Math.max(below, above);
      }
      // Room enough to write in, even when that means covering part of the pick.
      room = Math.max(320, Math.min(room, viewport.height - y - 16));
      y = Math.max(16, Math.min(y, viewport.height - 16 - room));
    }
    this.position = { x, y };
    this.apply(width, room);
  }

  private apply(width = this.width(), room = this.viewport().height - this.position.y - 16) {
    Object.assign(this.panel.style, {
      left: `${this.position.x}px`,
      top: `${this.position.y}px`,
      width: `${width}px`,
      maxHeight: `${Math.max(220, room)}px`,
    });
  }

  private moveTo(x: number, y: number) {
    const width = this.width();
    this.position = {
      x: Math.max(8, Math.min(x, this.viewport().width - width - 8)),
      y: Math.max(8, Math.min(y, this.viewport().height - 120)),
    };
    this.apply(width);
  }

  // The window moves by its grip, with the pointer or the arrow keys.
  private draggable(handle: HTMLElement) {
    const header = handle.parentElement!;
    header.addEventListener("pointerdown", (event) => {
      if (event.button > 0 || (event.target as Element).closest("button")) return;
      event.preventDefault();
      const start = { x: event.clientX - this.position.x, y: event.clientY - this.position.y };
      header.setPointerCapture?.(event.pointerId);
      const move = (next: PointerEvent) =>
        this.moveTo(next.clientX - start.x, next.clientY - start.y);
      const up = () => {
        header.removeEventListener("pointermove", move);
        header.removeEventListener("pointerup", up);
        header.removeEventListener("pointercancel", up);
      };
      header.addEventListener("pointermove", move);
      header.addEventListener("pointerup", up);
      header.addEventListener("pointercancel", up);
    });
    handle.addEventListener("keydown", (event) => {
      const step = {
        ArrowLeft: [-16, 0],
        ArrowRight: [16, 0],
        ArrowUp: [0, -16],
        ArrowDown: [0, 16],
      }[event.key];
      if (!step) return;
      event.preventDefault();
      this.moveTo(this.position.x + step[0]!, this.position.y + step[1]!);
    });
  }

  /** Escape: the discard question first, then the window itself. */
  escape() {
    if (this.drawing) return;
    if (this.confirming) this.keepEditing();
    else this.requestClose();
  }
}

function rename(file: File, name: string) {
  return file.name === name ? file : new File([file], name, { type: file.type });
}
