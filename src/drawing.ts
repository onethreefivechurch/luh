// The drawing editor's model, kept apart from the screen so it can be tested
// on its own: marks in the picture's own pixels, hit testing, moving,
// resizing by handles, and undo/redo, as Markup, CleanShot and Figma do it.

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Tool = "arrow" | "box" | "text" | "blur" | "crop";

export type Mark =
  | ({ id: number; kind: "box" } & Rect)
  | ({ id: number; kind: "blur" } & Rect)
  | { id: number; kind: "arrow"; x1: number; y1: number; x2: number; y2: number }
  | { id: number; kind: "text"; x: number; y: number; text: string };

export type Handle = "start" | "end" | "nw" | "ne" | "sw" | "se";

export interface Scene {
  marks: Mark[];
  crop: Rect | null;
}

export function rectFrom(a: Point, b: Point): Rect {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  };
}

/** The box a mark covers; text needs its measured width. */
export function bounds(mark: Mark, textWidth: (text: string) => number, fontSize: number): Rect {
  if (mark.kind === "arrow")
    return rectFrom({ x: mark.x1, y: mark.y1 }, { x: mark.x2, y: mark.y2 });
  if (mark.kind === "text")
    return { x: mark.x, y: mark.y, w: textWidth(mark.text), h: fontSize * 1.25 };
  return { x: mark.x, y: mark.y, w: mark.w, h: mark.h };
}

function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = dx * dx + dy * dy;
  const t = length ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length)) : 0;
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/**
 * The topmost mark under a point. A box is hit on its outline (so marks
 * inside it stay reachable), blur and text anywhere inside, an arrow along
 * its line; `slop` widens every target to a comfortable size.
 */
export function hitTest(
  marks: Mark[],
  p: Point,
  slop: number,
  textWidth: (text: string) => number,
  fontSize: number,
): Mark | null {
  for (let index = marks.length - 1; index >= 0; index--) {
    const mark = marks[index]!;
    if (mark.kind === "arrow") {
      if (distanceToSegment(p, { x: mark.x1, y: mark.y1 }, { x: mark.x2, y: mark.y2 }) <= slop)
        return mark;
      continue;
    }
    const r = bounds(mark, textWidth, fontSize);
    const inside =
      p.x >= r.x - slop && p.x <= r.x + r.w + slop && p.y >= r.y - slop && p.y <= r.y + r.h + slop;
    if (!inside) continue;
    if (mark.kind !== "box") return mark;
    const nearEdge =
      p.x <= r.x + slop || p.x >= r.x + r.w - slop || p.y <= r.y + slop || p.y >= r.y + r.h - slop;
    if (nearEdge) return mark;
  }
  return null;
}

/** Where a selected mark's handles sit: an arrow's two ends, a box's corners. */
export function handles(mark: Mark): { handle: Handle; x: number; y: number }[] {
  if (mark.kind === "arrow")
    return [
      { handle: "start", x: mark.x1, y: mark.y1 },
      { handle: "end", x: mark.x2, y: mark.y2 },
    ];
  if (mark.kind === "text") return [];
  return [
    { handle: "nw", x: mark.x, y: mark.y },
    { handle: "ne", x: mark.x + mark.w, y: mark.y },
    { handle: "sw", x: mark.x, y: mark.y + mark.h },
    { handle: "se", x: mark.x + mark.w, y: mark.y + mark.h },
  ];
}

export function handleAt(mark: Mark, p: Point, slop: number): Handle | null {
  return (
    handles(mark).find((spot) => Math.hypot(spot.x - p.x, spot.y - p.y) <= slop)?.handle ?? null
  );
}

const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

/** The mark moved by (dx, dy), kept on the picture. */
export function moved(
  mark: Mark,
  dx: number,
  dy: number,
  size: { width: number; height: number },
  box: Rect,
): Mark {
  // The whole mark stays on the picture: the move is limited by its box.
  const x = clamp(dx, -box.x, size.width - box.x - box.w);
  const y = clamp(dy, -box.y, size.height - box.y - box.h);
  if (mark.kind === "arrow")
    return { ...mark, x1: mark.x1 + x, y1: mark.y1 + y, x2: mark.x2 + x, y2: mark.y2 + y };
  return { ...mark, x: mark.x + x, y: mark.y + y };
}

/** The mark with one handle dragged to a point. */
export function resized(mark: Mark, handle: Handle, p: Point): Mark {
  if (mark.kind === "arrow")
    return handle === "start" ? { ...mark, x1: p.x, y1: p.y } : { ...mark, x2: p.x, y2: p.y };
  if (mark.kind === "text") return mark;
  const opposite = {
    nw: { x: mark.x + mark.w, y: mark.y + mark.h },
    ne: { x: mark.x, y: mark.y + mark.h },
    sw: { x: mark.x + mark.w, y: mark.y },
    se: { x: mark.x, y: mark.y },
  }[handle as "nw" | "ne" | "sw" | "se"];
  return { ...mark, ...rectFrom(opposite, p) };
}

/** True when a just-drawn mark is too small to be meant. */
export function tooSmall(mark: Mark | ({ kind: "crop" } & Rect), least: number): boolean {
  if (mark.kind === "arrow") return Math.hypot(mark.x2 - mark.x1, mark.y2 - mark.y1) < least;
  if (mark.kind === "text") return !mark.text.trim();
  return mark.w < least || mark.h < least;
}

/** The arrow's head: tip, then the two barbs. */
export function arrowHead(
  mark: { x1: number; y1: number; x2: number; y2: number },
  stroke: number,
) {
  const angle = Math.atan2(mark.y2 - mark.y1, mark.x2 - mark.x1);
  const length = stroke * 5;
  const spread = Math.PI / 7;
  return [
    [mark.x2, mark.y2],
    [mark.x2 - length * Math.cos(angle - spread), mark.y2 - length * Math.sin(angle - spread)],
    [mark.x2 - length * Math.cos(angle + spread), mark.y2 - length * Math.sin(angle + spread)],
  ] as [number, number][];
}

/** Undo and redo over whole scenes, as every drawing app keeps them. */
export class History {
  private past: Scene[] = [];
  private future: Scene[] = [];
  constructor(public scene: Scene) {}
  get canUndo() {
    return this.past.length > 0;
  }
  get canRedo() {
    return this.future.length > 0;
  }
  commit(scene: Scene) {
    this.past.push(this.scene);
    this.future = [];
    this.scene = scene;
  }
  undo() {
    const last = this.past.pop();
    if (!last) return;
    this.future.push(this.scene);
    this.scene = last;
  }
  redo() {
    const next = this.future.pop();
    if (!next) return;
    this.past.push(this.scene);
    this.scene = next;
  }
}
