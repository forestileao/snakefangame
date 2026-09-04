import { describe, expect, it } from "vitest";
import { Snake } from "../src/game.cjs";

describe("Snake.update", () => {
    it("moves the head by one tile in the current direction and drops the tail", () => {
        const snake = new Snake();
        snake.body = [
            [10, 10],
            [10, 11],
            [10, 12]
        ];
        snake.direction = [0, -1];

        snake.update({ playing: true, cols: 60, rows: 60 });

        expect(snake.body).toEqual([
            [10, 9],
            [10, 10],
            [10, 11]
        ]);
        expect(snake.body).toHaveLength(3);
    });

    it("applies a direction change on the following tick, not retroactively", () => {
        const snake = new Snake();
        snake.body = [
            [10, 10],
            [10, 11],
            [10, 12]
        ];
        snake.direction = [0, -1];

        snake.direction = [1, 0]; // player turns right before the next tick
        snake.update({ playing: true, cols: 60, rows: 60 });

        // Only the head moves according to the new direction; the rest of
        // the body simply shifts along the old path.
        expect(snake.body).toEqual([
            [11, 10],
            [10, 10],
            [10, 11]
        ]);
    });
});

describe("Snake.addCell", () => {
    it("increases the body length by exactly one", () => {
        const snake = new Snake();
        const initialLength = snake.body.length;

        snake.addCell();

        expect(snake.body).toHaveLength(initialLength + 1);
    });

    it("does not alias the previous tail segment (regression for aliasing bug)", () => {
        const snake = new Snake();
        const previousTail = snake.body[snake.body.length - 1];

        snake.addCell();
        const newTail = snake.body[snake.body.length - 1];
        newTail[0] = 999;
        newTail[1] = 999;

        expect(previousTail).not.toBe(newTail);
        expect(snake.body[snake.body.length - 2]).toEqual(previousTail);
        expect(previousTail).not.toEqual([999, 999]);
    });

    it("keeps the grown length stable across subsequent ticks", () => {
        const snake = new Snake();
        const initialLength = snake.body.length;

        snake.addCell();
        const grownLength = snake.body.length;

        for (let i = 0; i < 5; i++) {
            snake.update({ playing: true, cols: 60, rows: 60 });
        }

        expect(grownLength).toBe(initialLength + 1);
        expect(snake.body).toHaveLength(grownLength);
    });
});

describe("Snake attract mode (playing: false)", () => {
    it("turns right instead of dying when approaching the top boundary", () => {
        const snake = new Snake();
        const rows = 60;
        const cols = 60;
        // Head one tile above the 20%-from-top turn threshold, heading up.
        snake.body = [
            [30, Math.ceil(rows * 0.2) + 1],
            [30, Math.ceil(rows * 0.2) + 2],
            [30, Math.ceil(rows * 0.2) + 3]
        ];
        snake.direction = [0, -1];

        snake.update({ playing: false, cols, rows });

        expect(snake.direction).toEqual([1, 0]);
        expect(snake.body[0][1]).toBeGreaterThanOrEqual(0);
    });
});
