import { describe, expect, it } from "vitest";
import { History, handleAt, hitTest, moved, resized, tooSmall, type Mark } from "./drawing";

const width = (text: string) => text.length * 10;
const size = { width: 1000, height: 800 };

describe("drawing", () => {
  const arrow: Mark = { id: 1, kind: "arrow", x1: 100, y1: 100, x2: 300, y2: 100 };
  const box: Mark = { id: 2, kind: "box", x: 400, y: 400, w: 200, h: 100 };
  const text: Mark = { id: 3, kind: "text", x: 50, y: 600, text: "Too small" };
  const marks = [arrow, box, text];

  it("hits an arrow along its line, a box on its edge and words anywhere on them", () => {
    expect(hitTest(marks, { x: 200, y: 104 }, 6, width, 16)?.id).toBe(1);
    expect(hitTest(marks, { x: 200, y: 120 }, 6, width, 16)).toBeNull();
    expect(hitTest(marks, { x: 402, y: 450 }, 6, width, 16)?.id).toBe(2);
    // The middle of a box stays free, so what it surrounds can be reached.
    expect(hitTest(marks, { x: 500, y: 450 }, 6, width, 16)).toBeNull();
    expect(hitTest(marks, { x: 90, y: 610 }, 6, width, 16)?.id).toBe(3);
  });

  it("picks the topmost of overlapping marks", () => {
    const blur: Mark = { id: 4, kind: "blur", x: 390, y: 390, w: 50, h: 50 };
    expect(hitTest([box, blur], { x: 402, y: 410 }, 6, width, 16)?.id).toBe(4);
  });

  it("moves a mark, keeping all of it on the picture", () => {
    expect(moved(box, 50, -20, size, { x: 400, y: 400, w: 200, h: 100 })).toMatchObject({
      x: 450,
      y: 380,
    });
    expect(moved(box, 900, 0, size, { x: 400, y: 400, w: 200, h: 100 })).toMatchObject({ x: 800 });
    expect(moved(arrow, -500, 0, size, { x: 100, y: 100, w: 200, h: 0 })).toMatchObject({
      x1: 0,
      x2: 200,
    });
  });

  it("resizes by a corner and moves an arrow's end", () => {
    expect(handleAt(box, { x: 601, y: 501 }, 8)).toBe("se");
    expect(resized(box, "se", { x: 700, y: 650 })).toMatchObject({
      x: 400,
      y: 400,
      w: 300,
      h: 250,
    });
    // Dragging past the opposite corner flips the box instead of inverting it.
    expect(resized(box, "nw", { x: 650, y: 550 })).toMatchObject({ x: 600, y: 500, w: 50, h: 50 });
    expect(resized(arrow, "end", { x: 300, y: 300 })).toMatchObject({ x1: 100, x2: 300, y2: 300 });
  });

  it("ignores marks too small to be meant", () => {
    expect(tooSmall({ id: 0, kind: "box", x: 0, y: 0, w: 4, h: 40 }, 9)).toBe(true);
    expect(tooSmall(arrow, 9)).toBe(false);
  });

  it("undoes and redoes whole steps", () => {
    const history = new History({ marks: [], crop: null });
    history.commit({ marks: [arrow], crop: null });
    history.commit({ marks: [arrow, box], crop: null });
    history.undo();
    expect(history.scene.marks).toEqual([arrow]);
    history.redo();
    expect(history.scene.marks).toEqual([arrow, box]);
    history.undo();
    history.commit({ marks: [arrow, text], crop: null });
    expect(history.canRedo).toBe(false);
  });
});
