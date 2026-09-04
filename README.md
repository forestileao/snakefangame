# snakefangame

A small browser Snake fangame with no build step - just canvas and
vanilla JavaScript.

## Playing the game

Open `index.html` directly in a browser (double-click it, or
`file:///path/to/index.html`). No server or build step is required.
Use the arrow keys, or tap the screen on touch devices: top/bottom
35% of the screen for up/down, the middle band split left/right at
the horizontal midpoint.

## Source layout

- `index.html` - the page shell, loaded scripts, and styling.
- `src/game.cjs` - pure game logic (movement, collisions, food
  placement, input-to-direction mapping). No DOM or canvas access, so
  it is unit tested directly. Written to run unmodified both as a
  plain browser `<script>` and as a CommonJS module in tests, so the
  game doesn't depend on `<script type="module">` (which some
  browsers refuse to load for pages opened via a `file://` URL).
- `src/main.js` - the browser entry point: canvas setup, the draw/game
  loop, and wiring up keyboard/touch events. Loaded after `game.cjs`.

## Running the tests

```
npm install
npm test
```

Or, for a watch mode while developing:

```
npm run test:watch
```

Tests live in `tests/` and use [Vitest](https://vitest.dev/). No
production dependencies are added by the test setup - the game itself
stays dependency-free and buildless.

## Known issues

Filed while adding the test suite; the ones with regression tests
listed under "fixed" below have already been corrected. The rest are
tracked here for a follow-up.

Fixed, with a regression test in `tests/`:

- **Aliased tail segment on growth.** `Snake.addCell()` used to push a
  *reference* to the last body segment instead of a copy, so the last
  two segments moved as one. Now `addCell()` pushes a copy
  (`tests/snake.test.js`).
- **Wall check skipped for a one-segment snake.** The out-of-bounds
  check in the collision detector used to live inside the loop that
  compares the head against the rest of the body (starting at index
  1), so it never ran for a snake with a single segment, and was
  redundantly re-evaluated for longer ones. It also allowed the head
  one tile past the right/bottom edge (`>` instead of `>=` against the
  edge index). Both are fixed in `detectCollision()`
  (`tests/collision.test.js`).
- **Food could spawn under the snake.** `Food.newPos()` used to pick a
  random tile with no regard for the snake's body, making the food
  occasionally unreachable. It now re-rolls until it finds a free tile
  (`tests/food.test.js`).
- **Tab freeze on death.** Dying used to call a synchronous
  busy-wait (`sleep()`, a `for` loop spinning for ~1 second) before
  starting a new game, freezing the whole page. This was addressed as
  part of splitting the game into `src/game.cjs` (pure logic) and
  `src/main.js` (browser loop): death now pauses the game and
  schedules a restart with `setTimeout`, without blocking the thread.
- **Implicit global for the food object.** `newGame()` used to assign
  `food = new Food()` without a `var`/`let`, creating an implicit
  global. `src/main.js` declares `food` alongside the other game state
  at the top of the file.

Not fixed yet (no behaviour change made, tracked for follow-up):

- **Grid does not divide the canvas evenly.** `resizeWindow()`
  computes `tileSize` as
  `Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60))`, which
  does not evenly divide the canvas on most aspect ratios, so the
  playfield's edge tiles are inconsistently sized/clipped compared to
  the rest of the grid.
