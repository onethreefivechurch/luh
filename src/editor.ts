// Drawing on a picture, as CleanShot, Markup and Jam do it: arrows, boxes,
// words, blur over anything private, and a crop. A new mark stays selected
// until Escape or a click elsewhere; clicking any mark selects it to move it,
// its handles resize it, Delete removes it, and every step can be undone.
// Marks live in the picture's own pixels and are drawn into a new PNG on Done.
import { MARK_COLOR } from "./capture";
import {
  arrowHead,
  bounds,
  handleAt,
  handles,
  History,
  hitTest,
  moved,
  rectFrom,
  resized,
  tooSmall,
  type Handle,
  type Mark,
  type Point,
  type Rect,
  type Scene,
  type Tool,
} from "./drawing";
import { apple, h, icon as renderIcon, s, type IconName, type IconOverrides } from "./dom";
import { format, type Strings } from "./strings";

export type EditorResult =
  | { action: "done"; file: File }
  | { action: "cancel" }
  | { action: "remove" };

const TOOLS: { tool: Tool; icon: IconName; key: string; label: keyof Strings }[] = [
  { tool: "arrow", icon: "arrow", key: "a", label: "arrow" },
  { tool: "box", icon: "box", key: "r", label: "box" },
  { tool: "text", icon: "text", key: "t", label: "text" },
  { tool: "blur", icon: "blur", key: "b", label: "blur" },
  { tool: "crop", icon: "crop", key: "c", label: "crop" },
];

type Gesture =
  | { kind: "draw"; start: Point; draft: Mark | ({ kind: "crop" } & Rect) }
  | { kind: "move"; start: Point; original: Mark; box: Rect; moved: boolean }
  | { kind: "handle"; handle: Handle; original: Mark };

export function openEditor(
  file: File,
  strings: Strings,
  mount: Node,
  signal?: AbortSignal,
  icons?: IconOverrides,
  start: Tool = "arrow",
): Promise<EditorResult> {
  if (signal?.aborted) return Promise.resolve({ action: "cancel" });
  const icon = (name: IconName) => renderIcon(name, icons);
  return new Promise((resolve) => {
    let finished = false;
    const url = URL.createObjectURL(file);
    const image = new Image();
    let size = { width: 0, height: 0 };
    let tool: Tool = start;
    const history = new History({ marks: [], crop: null });
    let selected: number | null = null;
    let gesture: Gesture | null = null;
    let typing: { x: number; y: number; text: string; id?: number } | null = null;
    let nextId = 1;
    const previews = new Map<number, { key: string; url: string }>();

    const titleId = `cm-editor-${Math.random().toString(36).slice(2)}`;
    const svg = s("svg", {
      class: "cm-canvas",
      tabindex: 0,
      role: "group",
      "aria-label": strings.drawing,
    });
    const status = h("p", { class: "cm-sr", role: "status" });
    const toolButtons = TOOLS.map((entry) =>
      h(
        "button",
        {
          type: "button",
          class: "cm-tool",
          part: `tool-${entry.tool}`,
          title: `${strings[entry.label]} · ${entry.key.toUpperCase()}`,
          "aria-keyshortcuts": entry.key.toUpperCase(),
          onclick: () => choose(entry.tool),
        },
        icon(entry.icon),
        h("span", { class: "cm-tool-label" }, strings[entry.label]),
      ),
    );
    const mod = apple() ? "⌘" : `${strings.controlKey}+`;
    const undoButton = iconButton("undo", strings.undo, `${mod}Z`, () => step("undo"));
    const redoButton = iconButton("redo", strings.redo, `${mod}⇧Z`, () => step("redo"));
    const deleteButton = iconButton("trash", strings.deleteMark, strings.deleteKey, () =>
      removeSelected(),
    );
    const doneButton = h(
      "button",
      { type: "button", class: "cm-button cm-primary", part: "done", onclick: () => void done() },
      strings.done,
    );
    const dialog = h(
      "dialog",
      { class: "cm-editor", "aria-labelledby": titleId },
      h(
        "div",
        { class: "cm-editor-bar" },
        h("h2", { id: titleId, class: "cm-sr" }, strings.drawTitle),
        h(
          "div",
          { class: "cm-tools", role: "toolbar", "aria-label": strings.drawTitle },
          ...toolButtons,
        ),
        h("div", { class: "cm-tools" }, undoButton, redoButton, deleteButton),
      ),
      h("div", { class: "cm-stage" }, svg),
      h("p", { class: "cm-editor-help" }, strings.drawHelp),
      status,
      h(
        "div",
        { class: "cm-editor-footer" },
        h(
          "button",
          {
            type: "button",
            class: "cm-button cm-quiet",
            part: "editor-remove",
            onclick: () => finish({ action: "remove" }),
          },
          icon("trash"),
          strings.removeImage,
        ),
        h("span", { class: "cm-spacer" }),
        h(
          "button",
          {
            type: "button",
            class: "cm-button",
            part: "editor-cancel",
            onclick: () => finish({ action: "cancel" }),
          },
          strings.cancel,
        ),
        doneButton,
      ),
    );

    function iconButton(name: IconName, label: string, keys: string, onclick: () => void) {
      return h(
        "button",
        {
          type: "button",
          class: "cm-tool",
          part: name === "trash" ? "delete-mark" : name,
          title: `${label} · ${keys}`,
          "aria-label": label,
          onclick,
        },
        icon(name),
      );
    }

    // Marks keep a readable size wherever the picture shows: at least 3 px
    // lines and 16 px words on screen here, and never less than a share of
    // the picture's shorter side.
    function pixels() {
      const shown = svg.getBoundingClientRect().width;
      return shown ? Math.max(1, size.width / shown) : 1;
    }
    const shorter = () => Math.min(size.width, size.height);
    const stroke = () => Math.round(Math.max(3, 3 * pixels(), shorter() / 250));
    const fontSize = () => Math.round(Math.max(16, 16 * pixels(), shorter() * 0.035));
    const slop = () => Math.max(stroke() * 2, 10 * pixels());
    const measure = document.createElement("canvas").getContext("2d");
    function textWidth(text: string) {
      if (!measure) return text.length * fontSize() * 0.6;
      measure.font = `600 ${fontSize()}px system-ui, sans-serif`;
      return measure.measureText(text).width;
    }

    function point(event: PointerEvent | MouseEvent): Point {
      const matrix = svg.getScreenCTM?.()?.inverse();
      let p: Point;
      if (matrix) p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
      else {
        const box = svg.getBoundingClientRect();
        const scale = box.width ? size.width / box.width : 1;
        p = { x: (event.clientX - box.left) * scale, y: (event.clientY - box.top) * scale };
      }
      return {
        x: Math.max(0, Math.min(size.width, p.x)),
        y: Math.max(0, Math.min(size.height, p.y)),
      };
    }

    const scene = () => history.scene;
    const selectedMark = () => scene().marks.find((mark) => mark.id === selected) ?? null;
    function commit(next: Scene) {
      history.commit(next);
      render();
    }
    function replace(mark: Mark): Scene {
      return {
        ...scene(),
        marks: scene().marks.map((each) => (each.id === mark.id ? mark : each)),
      };
    }

    // Blur is a coarse pixelation: it cannot be reversed, unlike a soft blur.
    function pixelate(area: Rect): HTMLCanvasElement | null {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(area.w));
      canvas.height = Math.max(1, Math.round(area.h));
      const block = Math.max(8, Math.round(size.width / 80));
      const small = document.createElement("canvas");
      small.width = Math.max(1, Math.ceil(area.w / block));
      small.height = Math.max(1, Math.ceil(area.h / block));
      const smallContext = small.getContext("2d");
      const context = canvas.getContext("2d");
      if (!smallContext || !context) return null;
      smallContext.drawImage(
        image,
        area.x,
        area.y,
        area.w,
        area.h,
        0,
        0,
        small.width,
        small.height,
      );
      context.imageSmoothingEnabled = false;
      context.drawImage(small, 0, 0, canvas.width, canvas.height);
      return canvas;
    }
    function preview(mark: Mark & Rect) {
      const key = `${mark.x},${mark.y},${mark.w},${mark.h}`;
      const known = previews.get(mark.id);
      if (known?.key === key) return known.url;
      const canvas = pixelate(mark);
      const url = canvas?.toDataURL() ?? "";
      previews.set(mark.id, { key, url });
      return url;
    }

    function markLabel(mark: Mark, index: number) {
      const kind = {
        arrow: strings.arrow,
        box: strings.box,
        blur: strings.blur,
        text: strings.text,
      }[mark.kind];
      const name = format(strings.markLabel, { kind, number: index + 1 });
      return mark.kind === "text" ? `${name}: ${mark.text}` : name;
    }

    function drawMark(mark: Mark, live = false): SVGElement {
      const width = stroke();
      if (mark.kind === "blur") {
        const url = live ? "" : preview(mark);
        return url
          ? s("image", {
              href: url,
              x: mark.x,
              y: mark.y,
              width: mark.w,
              height: mark.h,
              preserveAspectRatio: "none",
            })
          : s("rect", {
              x: mark.x,
              y: mark.y,
              width: mark.w,
              height: mark.h,
              fill: "rgba(0,0,0,0.25)",
              stroke: MARK_COLOR,
              "stroke-width": width / 2,
              "stroke-dasharray": "6 4",
            });
      }
      if (mark.kind === "box")
        return s("rect", {
          x: mark.x,
          y: mark.y,
          width: mark.w,
          height: mark.h,
          fill: "none",
          stroke: MARK_COLOR,
          "stroke-width": width,
          "stroke-linejoin": "round",
        });
      if (mark.kind === "arrow") {
        const head = arrowHead(mark, width);
        return s(
          "g",
          {},
          s("line", {
            x1: mark.x1,
            y1: mark.y1,
            x2: (head[1][0] + head[2][0]) / 2,
            y2: (head[1][1] + head[2][1]) / 2,
            stroke: MARK_COLOR,
            "stroke-width": width,
            "stroke-linecap": "round",
          }),
          s("polygon", { points: head.map((p) => p.join(",")).join(" "), fill: MARK_COLOR }),
        );
      }
      const font = fontSize();
      return s(
        "text",
        {
          x: mark.x,
          y: mark.y,
          "dominant-baseline": "hanging",
          "font-size": font,
          "font-weight": 600,
          fill: MARK_COLOR,
          stroke: "white",
          "stroke-width": font / 4,
          "paint-order": "stroke",
          "font-family": "system-ui, sans-serif",
        },
        mark.text,
      );
    }

    function render() {
      const focusedMark = (svg.getRootNode() as Document | ShadowRoot).activeElement?.closest?.(
        "[data-mark]",
      );
      svg.replaceChildren();
      if (!size.width) return;
      svg.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
      svg.style.aspectRatio = `${size.width} / ${size.height}`;
      svg.dataset.tool = tool;
      svg.append(s("image", { href: url, width: size.width, height: size.height }));
      scene().marks.forEach((mark, index) => {
        if (typing?.id === mark.id) return;
        const group = s(
          "g",
          {
            "data-mark": mark.id,
            tabindex: 0,
            role: "button",
            "aria-label": markLabel(mark, index),
            "aria-pressed": mark.id === selected ? "true" : "false",
            class: "cm-mark",
          },
          drawMark(mark),
        );
        group.addEventListener("focus", () => {
          if (selected !== mark.id) {
            selected = mark.id;
            render();
          }
        });
        svg.append(group);
      });
      const current = gesture?.kind === "draw" ? gesture.draft : null;
      if (current && current.kind !== "crop") svg.append(drawMark(current, true));
      const crop = scene().crop;
      if (crop) {
        const { width, height } = size;
        svg.append(
          s("path", {
            d: `M0 0H${width}V${height}H0Z M${crop.x} ${crop.y}V${crop.y + crop.h}H${crop.x + crop.w}V${crop.y}Z`,
            fill: "rgba(0,0,0,0.55)",
            "fill-rule": "evenodd",
            "pointer-events": "none",
          }),
        );
      }
      if (current?.kind === "crop")
        svg.append(
          s("rect", {
            x: current.x,
            y: current.y,
            width: current.w,
            height: current.h,
            fill: "none",
            stroke: "white",
            "stroke-width": stroke() / 2,
            "stroke-dasharray": "8 6",
          }),
        );
      const mark = selectedMark();
      if (mark) {
        const box = bounds(mark, textWidth, fontSize());
        const pad = stroke() * 2;
        const ring = pixels() * 1.5;
        if (mark.kind !== "arrow")
          svg.append(
            s("rect", {
              class: "cm-selection",
              x: box.x - pad,
              y: box.y - pad,
              width: box.w + pad * 2,
              height: box.h + pad * 2,
              fill: "none",
              "stroke-width": ring,
              "stroke-dasharray": `${ring * 4} ${ring * 3}`,
              "pointer-events": "none",
            }),
          );
        for (const spot of handles(mark))
          svg.append(
            s("circle", {
              class: "cm-handle",
              cx: spot.x,
              cy: spot.y,
              r: pixels() * 6,
              "stroke-width": ring,
              "pointer-events": "none",
            }),
          );
      }
      if (typing) {
        const field = h("input", {
          class: "cm-words",
          "aria-label": strings.wordsOnImage,
          value: typing.text,
          style: `font-size:${fontSize()}px;color:${MARK_COLOR};caret-color:${MARK_COLOR}`,
        });
        field.addEventListener("input", () => typing && (typing.text = field.value));
        field.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitText();
          } else if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            commitText();
          }
          event.stopPropagation();
        });
        field.addEventListener("pointerdown", (event) => event.stopPropagation());
        const holder = s("foreignObject", {
          x: typing.x,
          y: typing.y - fontSize() * 0.15,
          width: Math.max(1, size.width - typing.x),
          height: fontSize() * 1.6,
        });
        holder.append(field);
        svg.append(holder);
        queueMicrotask(() => field.focus({ preventScroll: true }));
      } else if (focusedMark) {
        svg.querySelector<SVGGElement>(`[data-mark="${selected}"]`)?.focus({ preventScroll: true });
      }
      toolButtons.forEach((button, index) =>
        button.setAttribute("aria-pressed", String(TOOLS[index]!.tool === tool)),
      );
      undoButton.disabled = !history.canUndo;
      redoButton.disabled = !history.canRedo;
      deleteButton.disabled = !mark;
    }

    function choose(next: Tool) {
      commitText();
      tool = next;
      selected = null;
      render();
    }
    function step(direction: "undo" | "redo") {
      commitText();
      history[direction]();
      if (!selectedMark()) selected = null;
      render();
    }
    function removeSelected() {
      const mark = selectedMark();
      if (!mark) return;
      selected = null;
      commit({ ...scene(), marks: scene().marks.filter((each) => each.id !== mark.id) });
      status.textContent = `${strings.deleteMark}: ${markLabel(mark, 0).replace(/ 1(:|$)/, "$1")}`;
    }
    function commitText() {
      const value = typing;
      if (!value) return;
      typing = null;
      const text = value.text.trim();
      if (value.id !== undefined) {
        const mark = scene().marks.find((each) => each.id === value.id);
        if (mark?.kind === "text" && text && text !== mark.text) commit(replace({ ...mark, text }));
        else if (mark && !text) {
          selected = null;
          commit({ ...scene(), marks: scene().marks.filter((each) => each.id !== value.id) });
        } else render();
        return;
      }
      if (!text) return render();
      const mark: Mark = { id: nextId++, kind: "text", x: value.x, y: value.y, text };
      selected = mark.id;
      commit({ ...scene(), marks: [...scene().marks, mark] });
    }

    function down(event: PointerEvent) {
      if (!size.width || event.button > 0) return;
      // The press must not move focus: a new text field takes it.
      event.preventDefault();
      if (typing) {
        commitText();
        return;
      }
      const at = point(event);
      const current = selectedMark();
      const handle = current && handleAt(current, at, slop() * 1.2);
      if (current && handle) {
        gesture = { kind: "handle", handle, original: current };
      } else {
        const hit =
          tool === "crop" ? null : hitTest(scene().marks, at, slop(), textWidth, fontSize());
        if (hit) {
          selected = hit.id;
          gesture = {
            kind: "move",
            start: at,
            original: hit,
            box: bounds(hit, textWidth, fontSize()),
            moved: false,
          };
        } else if (selected !== null) {
          // A click away finishes the current mark; the next press draws.
          selected = null;
          render();
          return;
        } else if (tool === "text") {
          typing = { x: at.x, y: at.y, text: "" };
          render();
          return;
        } else {
          const draft: Mark | ({ kind: "crop" } & Rect) =
            tool === "arrow"
              ? { id: 0, kind: "arrow", x1: at.x, y1: at.y, x2: at.x, y2: at.y }
              : tool === "crop"
                ? { kind: "crop", ...rectFrom(at, at) }
                : { id: 0, kind: tool, ...rectFrom(at, at) };
          gesture = { kind: "draw", start: at, draft };
        }
      }
      svg.setPointerCapture?.(event.pointerId);
      render();
    }
    function move(event: PointerEvent) {
      if (!gesture) {
        // The pointer shows what a press would do.
        const at = point(event);
        const current = selectedMark();
        const over =
          (current && handleAt(current, at, slop() * 1.2) && "handle") ||
          (tool !== "crop" &&
            hitTest(scene().marks, at, slop(), textWidth, fontSize()) &&
            "mark") ||
          "";
        svg.dataset.over = over;
        return;
      }
      const at = point(event);
      if (gesture.kind === "draw") {
        const draft = gesture.draft;
        gesture.draft =
          draft.kind === "arrow"
            ? { ...draft, x2: at.x, y2: at.y }
            : { ...draft, ...rectFrom(gesture.start, at) };
      } else if (gesture.kind === "move") {
        const next = moved(
          gesture.original,
          at.x - gesture.start.x,
          at.y - gesture.start.y,
          size,
          gesture.box,
        );
        gesture.moved = true;
        history.scene = replace(next);
      } else {
        history.scene = replace(resized(gesture.original, gesture.handle, at));
      }
      render();
    }
    function up() {
      const current = gesture;
      gesture = null;
      if (!current) return;
      if (current.kind === "draw") {
        const draft = current.draft;
        if (tooSmall(draft, stroke() * 3)) return render();
        if (draft.kind === "crop") {
          commit({ ...scene(), crop: { x: draft.x, y: draft.y, w: draft.w, h: draft.h } });
          return;
        }
        const mark = { ...draft, id: nextId++ } as Mark;
        selected = mark.id;
        commit({ ...scene(), marks: [...scene().marks, mark] });
        return;
      }
      // A move or resize is one step: put the original back, then commit.
      const after = scene();
      const before = {
        ...after,
        marks: after.marks.map((each) =>
          each.id === current.original.id ? current.original : each,
        ),
      };
      history.scene = before;
      const changed = after.marks.find((each) => each.id === current.original.id);
      if (changed && JSON.stringify(changed) !== JSON.stringify(current.original)) {
        if (!tooSmall(changed, stroke())) commit(after);
        else render();
      } else render();
    }
    function edit(event: MouseEvent) {
      const at = point(event);
      const hit = hitTest(scene().marks, at, slop(), textWidth, fontSize());
      if (hit?.kind !== "text") return;
      selected = hit.id;
      typing = { x: hit.x, y: hit.y, text: hit.text, id: hit.id };
      render();
    }

    function keys(event: KeyboardEvent) {
      if (typing) return;
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (mod && key === "z") {
        event.preventDefault();
        step(event.shiftKey ? "redo" : "undo");
        return;
      }
      if (mod && key === "y") {
        event.preventDefault();
        step("redo");
        return;
      }
      if (mod && key === "enter") {
        event.preventDefault();
        void done();
        return;
      }
      const mark = selectedMark();
      if (mark && (event.key === "Delete" || event.key === "Backspace")) {
        event.preventDefault();
        removeSelected();
        return;
      }
      if (mark && event.key === "Enter" && mark.kind === "text") {
        event.preventDefault();
        typing = { x: mark.x, y: mark.y, text: mark.text, id: mark.id };
        render();
        return;
      }
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      if (mark && nudge[event.key]) {
        event.preventDefault();
        const distance = (event.shiftKey ? 10 : 1) * pixels();
        const [dx, dy] = nudge[event.key]!;
        commit(
          replace(
            moved(mark, dx * distance, dy * distance, size, bounds(mark, textWidth, fontSize())),
          ),
        );
        return;
      }
      if (mod || event.altKey) return;
      const shortcut = TOOLS.find((entry) => entry.key === key);
      if (shortcut && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        choose(shortcut.tool);
      }
    }

    // Escape finishes the mark in hand, then lets go of the selection, and
    // closes the editor only when nothing has been drawn.
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (typing) commitText();
      else if (selected !== null) {
        selected = null;
        render();
      } else if (!history.canUndo) finish({ action: "cancel" });
    });
    dialog.addEventListener("keydown", keys);
    svg.addEventListener("pointerdown", down);
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
    svg.addEventListener("pointercancel", () => {
      gesture = null;
      render();
    });
    svg.addEventListener("dblclick", edit);

    async function done() {
      commitText();
      if (!size.width) return;
      doneButton.disabled = true;
      const area = scene().crop ?? { x: 0, y: 0, w: size.width, h: size.height };
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(area.w);
      canvas.height = Math.round(area.h);
      const context = canvas.getContext("2d");
      if (!context) return finish({ action: "cancel" });
      context.translate(-area.x, -area.y);
      context.drawImage(image, 0, 0);
      for (const mark of scene().marks) paint(context, mark);
      const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/png"));
      doneButton.disabled = false;
      if (blob)
        finish({
          action: "done",
          file: new File([blob], file.name.replace(/\.\w+$/, ".png"), { type: "image/png" }),
        });
    }
    function paint(context: CanvasRenderingContext2D, mark: Mark) {
      context.strokeStyle = MARK_COLOR;
      context.fillStyle = MARK_COLOR;
      context.lineWidth = stroke();
      context.lineCap = "round";
      context.lineJoin = "round";
      if (mark.kind === "blur") {
        const pixelated = pixelate(mark);
        if (pixelated) context.drawImage(pixelated, mark.x, mark.y);
      } else if (mark.kind === "box") context.strokeRect(mark.x, mark.y, mark.w, mark.h);
      else if (mark.kind === "arrow") {
        const head = arrowHead(mark, stroke());
        context.beginPath();
        context.moveTo(mark.x1, mark.y1);
        context.lineTo((head[1][0] + head[2][0]) / 2, (head[1][1] + head[2][1]) / 2);
        context.stroke();
        context.beginPath();
        head.forEach(([x, y], index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
        context.closePath();
        context.fill();
      } else {
        context.font = `600 ${fontSize()}px system-ui, sans-serif`;
        context.textBaseline = "top";
        context.lineWidth = fontSize() / 4;
        context.strokeStyle = "white";
        context.strokeText(mark.text, mark.x, mark.y);
        context.fillText(mark.text, mark.x, mark.y);
      }
    }

    function finish(result: EditorResult) {
      if (finished) return;
      finished = true;
      signal?.removeEventListener("abort", abort);
      image.onload = null;
      image.onerror = null;
      if (dialog.open) dialog.close();
      dialog.remove();
      URL.revokeObjectURL(url);
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
      previews.clear();
      resolve(result);
    }

    const abort = () => finish({ action: "cancel" });
    signal?.addEventListener("abort", abort, { once: true });
    mount.appendChild(dialog);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    image.onload = () => {
      size = { width: image.naturalWidth, height: image.naturalHeight };
      render();
    };
    image.onerror = () => finish({ action: "cancel" });
    image.src = url;
    render();
    svg.focus({ preventScroll: true });
  });
}
