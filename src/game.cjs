/*
 * Pure Snake game logic: no DOM, no canvas, no module-level mutable state.
 *
 * This file is written in a dual-mode style on purpose:
 *   - In the browser it is loaded as a plain classic <script> tag (NOT
 *     type="module"). Top-level `function` declarations therefore become
 *     properties of `window`, exactly like the original single-file game,
 *     so `src/main.js` can use `Snake`, `Food`, `detectCollision`, etc. as
 *     globals without an `import` statement.
 *   - In tests it is loaded through Node/Vitest, where the trailing
 *     `module.exports` block (guarded by `typeof module`) makes every
 *     symbol importable.
 *
 * This avoids relying on `<script type="module">`, which some browsers
 * refuse to load when a page is opened directly from disk via a `file://`
 * URL (blocked by CORS-like restrictions on module script fetches).
 */

var KEYS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

/**
 * A snake. `body` is an array of [x, y] grid coordinates, head first.
 */
function Snake() {
    this.body = [[10, 10], [10, 11], [10, 12]];
    this.color = "#82047A";
    this.direction = [0, -1];

    /**
     * Advances the snake by one tile.
     *
     * @param {{playing: boolean, cols: number, rows: number}} state
     *   `cols`/`rows` are the size of the play field in grid cells (not
     *   pixels). When `playing` is false the snake is in "attract mode":
     *   instead of dying at the boundary it turns to stay on screen.
     */
    this.update = function (state) {
        var cols = state.cols;
        var rows = state.rows;
        var nextPos = [
            this.body[0][0] + this.direction[0],
            this.body[0][1] + this.direction[1]
        ];

        if (!state.playing) {
            if (this.direction[1] === -1 && nextPos[1] <= rows * 0.2) {
                this.direction = [1, 0];
            } else if (this.direction[0] === 1 && nextPos[0] >= cols * 0.8) {
                this.direction = [0, 1];
            } else if (this.direction[1] === 1 && nextPos[1] >= rows * 0.9) {
                this.direction = [-1, 0];
            } else if (this.direction[0] === -1 && nextPos[0] <= cols * 0.2) {
                this.direction = [0, -1];
            }
            nextPos = [
                this.body[0][0] + this.direction[0],
                this.body[0][1] + this.direction[1]
            ];
        }

        this.body.pop();
        this.body.splice(0, 0, nextPos);
    };

    /**
     * Grows the snake by one segment, duplicating the current tail.
     *
     * The new segment is a *copy* of the last position, not a reference to
     * it: mutating one must never affect the other (see bug B1 in the
     * project history for the aliasing bug this guards against).
     */
    this.addCell = function () {
        var tail = this.body[this.body.length - 1];
        this.body.push(tail.slice());
    };
}

/**
 * The food pellet. `pos` is an [x, y] grid coordinate once `newPos` has
 * been called.
 */
function Food() {
    this.color = "#E31C29";
    this.pos = null;

    /**
     * Picks a new random position inside the `cols` x `rows` grid, never
     * landing on a tile occupied by `snakeBody` (see bug B4 in the project
     * history: unreachable food was a real, observed bug).
     *
     * @param {number} cols
     * @param {number} rows
     * @param {Array<[number, number]>} [snakeBody]
     */
    this.newPos = function (cols, rows, snakeBody) {
        var body = snakeBody || [];
        var candidate;
        do {
            candidate = [
                Math.floor(Math.random() * cols),
                Math.floor(Math.random() * rows)
            ];
        } while (occupiedBy(candidate, body));
        this.pos = candidate;
    };
}

function occupiedBy(pos, body) {
    for (var i = 0; i < body.length; i++) {
        if (body[i][0] === pos[0] && body[i][1] === pos[1]) {
            return true;
        }
    }
    return false;
}

/**
 * Detects whether a snake's head has collided with its own body or with
 * the edges of the `cols` x `rows` grid. Valid head coordinates are
 * `0 .. cols - 1` and `0 .. rows - 1` inclusive.
 *
 * @param {{body: Array<[number, number]>}} snake
 * @param {number} cols
 * @param {number} rows
 * @returns {boolean}
 */
function detectCollision(snake, cols, rows) {
    var head = snake.body[0];

    if (head[0] < 0 || head[0] > cols - 1 || head[1] < 0 || head[1] > rows - 1) {
        return true;
    }

    for (var part = 1; part < snake.body.length; part++) {
        if (head[0] === snake.body[part][0] && head[1] === snake.body[part][1]) {
            return true;
        }
    }

    return false;
}

/**
 * Works out the next direction and "playing" state for an arrow key press.
 * Pure function: takes the key code and current state, returns the new
 * state. 180-degree reversals are ignored, as are unrelated keys.
 *
 * @param {number} keyCode
 * @param {[number, number]} currentDirection
 * @param {boolean} playing
 * @returns {{direction: [number, number], playing: boolean}}
 */
function directionFromKey(keyCode, currentDirection, playing) {
    var direction = currentDirection;
    var nextPlaying = playing;

    switch (keyCode) {
        case KEYS.left:
            if (currentDirection[0] !== 1) {
                direction = [-1, 0];
            }
            break;
        case KEYS.up:
            if (currentDirection[1] !== 1) {
                direction = [0, -1];
            }
            break;
        case KEYS.right:
            if (currentDirection[0] !== -1) {
                direction = [1, 0];
            }
            break;
        case KEYS.down:
            if (currentDirection[1] !== -1) {
                direction = [0, 1];
            }
            break;
        default:
            return { direction: direction, playing: nextPlaying };
    }

    if (!playing) {
        nextPlaying = true;
    }

    return { direction: direction, playing: nextPlaying };
}

/**
 * Works out the next direction and "playing" state for a touch/tap,
 * mirroring the on-screen zones: top/bottom 35% bands are up/down, the
 * middle band is split left/right at the horizontal midpoint.
 *
 * @param {[number, number]} touchPoint [pageX, pageY]
 * @param {number} width viewport width
 * @param {number} height viewport height
 * @param {[number, number]} currentDirection
 * @param {boolean} playing
 * @returns {{direction: [number, number], playing: boolean}}
 */
function directionFromTouch(touchPoint, width, height, currentDirection, playing) {
    var x = touchPoint[0];
    var y = touchPoint[1];
    var direction = currentDirection;

    if (y < height * 0.35 && currentDirection[1] !== 1) {
        direction = [0, -1];
    } else if (y > height * 0.65 && currentDirection[1] !== -1) {
        direction = [0, 1];
    } else if (y < height * 0.65 && y > height * 0.35) {
        if (x > width / 2 && currentDirection[0] !== -1) {
            direction = [1, 0];
        } else if (x < width / 2 && currentDirection[0] !== 1) {
            direction = [-1, 0];
        }
    }

    return { direction: direction, playing: true };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        KEYS: KEYS,
        Snake: Snake,
        Food: Food,
        detectCollision: detectCollision,
        directionFromKey: directionFromKey,
        directionFromTouch: directionFromTouch
    };
}
