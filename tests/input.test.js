// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { KEYS, directionFromKey, directionFromTouch } from "../src/game.cjs";

describe("directionFromKey", () => {
    it("maps each arrow key to the correct direction vector", () => {
        expect(directionFromKey(KEYS.left, [0, -1], true).direction).toEqual([-1, 0]);
        expect(directionFromKey(KEYS.up, [1, 0], true).direction).toEqual([0, -1]);
        expect(directionFromKey(KEYS.right, [0, -1], true).direction).toEqual([1, 0]);
        expect(directionFromKey(KEYS.down, [1, 0], true).direction).toEqual([0, 1]);
    });

    it("ignores a 180-degree reversal from right to left", () => {
        const result = directionFromKey(KEYS.left, [1, 0], true);

        expect(result.direction).toEqual([1, 0]);
    });

    it("ignores a 180-degree reversal from left to right", () => {
        const result = directionFromKey(KEYS.right, [-1, 0], true);

        expect(result.direction).toEqual([-1, 0]);
    });

    it("ignores a 180-degree reversal from up to down", () => {
        const result = directionFromKey(KEYS.down, [0, -1], true);

        expect(result.direction).toEqual([0, -1]);
    });

    it("ignores a 180-degree reversal from down to up", () => {
        const result = directionFromKey(KEYS.up, [0, 1], true);

        expect(result.direction).toEqual([0, 1]);
    });

    it("leaves the direction untouched for unrelated keys", () => {
        const SPACE_BAR = 32;
        const result = directionFromKey(SPACE_BAR, [0, -1], true);

        expect(result.direction).toEqual([0, -1]);
        expect(result.playing).toBe(true);
    });

    it("starts the game when a directional key is pressed while not playing", () => {
        const result = directionFromKey(KEYS.up, [0, -1], false);

        expect(result.playing).toBe(true);
    });

    it("does not start the game for an unrelated key while not playing", () => {
        const SPACE_BAR = 32;
        const result = directionFromKey(SPACE_BAR, [0, -1], false);

        expect(result.playing).toBe(false);
    });
});

describe("directionFromTouch", () => {
    const WIDTH = 1000;
    const HEIGHT = 800;

    it("maps the top 35% band to up", () => {
        const result = directionFromTouch([500, HEIGHT * 0.1], WIDTH, HEIGHT, [1, 0], true);

        expect(result.direction).toEqual([0, -1]);
    });

    it("maps the bottom 35% band to down", () => {
        const result = directionFromTouch([500, HEIGHT * 0.9], WIDTH, HEIGHT, [1, 0], true);

        expect(result.direction).toEqual([0, 1]);
    });

    it("maps the right half of the middle band to right", () => {
        const result = directionFromTouch([WIDTH * 0.75, HEIGHT / 2], WIDTH, HEIGHT, [0, -1], true);

        expect(result.direction).toEqual([1, 0]);
    });

    it("maps the left half of the middle band to left", () => {
        const result = directionFromTouch([WIDTH * 0.25, HEIGHT / 2], WIDTH, HEIGHT, [0, -1], true);

        expect(result.direction).toEqual([-1, 0]);
    });

    it("starts the game on any touch when not already playing", () => {
        const result = directionFromTouch([WIDTH * 0.25, HEIGHT / 2], WIDTH, HEIGHT, [0, -1], false);

        expect(result.playing).toBe(true);
    });

    it("can read coordinates off a jsdom TouchEvent-like object", () => {
        window.document.body.innerHTML = "";
        const touch = { pageX: WIDTH * 0.1, pageY: HEIGHT * 0.1 };
        const result = directionFromTouch([touch.pageX, touch.pageY], WIDTH, HEIGHT, [1, 0], true);

        expect(result.direction).toEqual([0, -1]);
    });
});
