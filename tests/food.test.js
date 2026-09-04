import { afterEach, describe, expect, it, vi } from "vitest";
import { Food } from "../src/game.cjs";

const COLS = 40;
const ROWS = 30;

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Food.newPos", () => {
    it("always yields integer coordinates inside the grid", () => {
        const food = new Food();

        for (let i = 0; i < 500; i++) {
            food.newPos(COLS, ROWS);

            expect(Number.isInteger(food.pos[0])).toBe(true);
            expect(Number.isInteger(food.pos[1])).toBe(true);
            expect(food.pos[0]).toBeGreaterThanOrEqual(0);
            expect(food.pos[0]).toBeLessThan(COLS);
            expect(food.pos[1]).toBeGreaterThanOrEqual(0);
            expect(food.pos[1]).toBeLessThan(ROWS);
        }
    });

    it("stays inside the grid when Math.random returns exactly 0", () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const food = new Food();

        food.newPos(COLS, ROWS);

        expect(food.pos).toEqual([0, 0]);
    });

    it("stays inside the grid when Math.random returns just under 1", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.999999999);
        const food = new Food();

        food.newPos(COLS, ROWS);

        expect(food.pos).toEqual([COLS - 1, ROWS - 1]);
    });

    it("never spawns on a snake segment (regression)", () => {
        const snakeBody = [[5, 5], [5, 6], [5, 7]];
        const randomValues = [
            5 / COLS, // x = 5, would collide with [5, 5]
            5 / ROWS, // y = 5 -> [5, 5], occupied: re-roll
            9 / COLS, // x = 9, free tile
            9 / ROWS // y = 9 -> [9, 9], free
        ];
        let call = 0;
        vi.spyOn(Math, "random").mockImplementation(() => randomValues[call++]);

        const food = new Food();
        food.newPos(COLS, ROWS, snakeBody);

        expect(food.pos).toEqual([9, 9]);
        expect(snakeBody).not.toContainEqual(food.pos);
    });
});
