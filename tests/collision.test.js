import { describe, expect, it } from "vitest";
import { detectCollision } from "../src/game.cjs";

const COLS = 60;
const ROWS = 60;

describe("detectCollision", () => {
    it("returns true when the head overlaps a body segment", () => {
        const snake = { body: [[5, 5], [5, 6], [5, 5]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("returns false for a normal snake in open space", () => {
        const snake = { body: [[10, 10], [10, 11], [10, 12]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(false);
    });

    it("returns true when the head is out of bounds to the left", () => {
        const snake = { body: [[-1, 10], [0, 10], [1, 10]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("returns true when the head is out of bounds to the right", () => {
        const snake = { body: [[COLS, 10], [COLS - 1, 10], [COLS - 2, 10]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("returns true when the head is out of bounds above the top", () => {
        const snake = { body: [[10, -1], [10, 0], [10, 1]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("returns true when the head is out of bounds below the bottom", () => {
        const snake = { body: [[10, ROWS], [10, ROWS - 1], [10, ROWS - 2]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("detects a wall collision even for a single-segment snake (regression)", () => {
        const snake = { body: [[COLS, 10]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });

    it("treats the head on the last valid column/row as alive", () => {
        const snake = { body: [[COLS - 1, ROWS - 1], [COLS - 2, ROWS - 1]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(false);
    });

    it("treats the head one tile past the last valid column/row as dead", () => {
        const snake = { body: [[COLS, ROWS], [COLS - 1, ROWS]] };

        expect(detectCollision(snake, COLS, ROWS)).toBe(true);
    });
});
