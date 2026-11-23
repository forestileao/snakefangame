# Snake Fangame: agent guide

## Architecture and file responsibilities

This is a dependency-free HTML/JavaScript canvas game running directly in a
browser. There is no package manifest, package-manager workflow, build process,
linter configuration, or automated test suite in this checkout.

- `index.html`: owns inline canvas/heading styles, the `score` element, the play
  instruction text, and the plain `<script src="./snake.js">` integration.
- `snake.js`: owns globals, event listeners, initialization, input, game updates,
  canvas rendering, food placement, and reset logic. It calls `init()` at the end.

Keep the plain-script structure, existing naming/indentation conventions, and DOM
integration unless a task explicitly requests a redesign. In particular, retain
the `score` element before the script so initialization can find it. The script
uses global state (including `food`, assigned without a declaration in `newGame`);
converting it to a module or enabling strict mode changes its runtime assumptions.

## Navigation seams and current behavior

- `init()`: creates and appends a canvas, obtains its 2D context, sets `FPS = 15`,
  finds `score`, initializes the score text, then calls `newGame()` and `run()`.
- `resizeWindow()`: sets canvas dimensions to `window.innerWidth` /
  `window.innerHeight` and computes
  `tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60))`.
  Coordinates are tile units, not pixels. Resizing changes scale/bounds without
  resetting the snake or relocating food; very small viewports can yield zero
  tile size. Do not silently change those edge cases during unrelated work.
- `newGame()`: creates `Snake` and `Food`, sets `playing = false`, places food,
  resets `ateFood` to zero, and writes `Score: 0` to the score element.
- `run()`: calls `update()` then `draw()` and schedules itself with
  `setTimeout(run, 1000 / FPS)`. This is a recursive timeout with a nominal 15 FPS,
  not a requestAnimationFrame loop or elapsed-time simulation.
- `Snake()`: starts with body `[[10, 10], [10, 11], [10, 12]]` facing up. Its
  methods own movement, growth, rendering, collision detection, and death/reset.
  Each update removes the tail and inserts the next head position; `addCell()`
  grows by appending the current tail position.
- `Food()`: randomly selects a tile from the viewport and draws a red square.
  Placement currently does not exclude the snake's body.
- `update()`: moves the snake, checks head/food overlap, grows and relocates food,
  increments `ateFood`, writes `Score: ${ateFood}`, then checks collisions.
- `draw()`: clears the canvas, draws food only while `playing`, and always draws
  the snake. Updates and food detection still run while not playing.

### Input, idle movement, and reset invariants

- Window `keydown` events use arrow key codes 37–40 through `keyDown()`. An arrow
  starts play. Each direction change checks the current direction to prevent an
  immediate opposite turn; there is no per-tick input queue and keyboard default
  behavior is not prevented.
- Window `touchstart` events call `touchStart()`, which calls `preventDefault()`,
  stores the first touch's `pageX` / `pageY`, and starts play. This is touch-region
  control, not swipe input: top 35% selects up, bottom 35% selects down, and the
  middle band selects left/right by viewport half. Comparisons use viewport
  dimensions with page coordinates and strict inequalities; boundary touches can
  leave direction unchanged. Touch direction changes also reject opposite turns.
- `playing = false` is an animated idle mode, not a pause. `Snake.update()` turns
  at roughly 20%/80% of viewport width and 20%/90% of height. It calculates
  `nextPos` before changing idle direction, so that turn affects the next tick.
- `detectCollision()` checks head/body overlap and wall bounds. Upper wall checks
  use `>` against `Math.floor(WIDTH / tileSize)` / `Math.floor(HEIGHT / tileSize)`,
  not `>=`; preserve the actual comparison unless collision behavior is the task.
- Collision calls `snake.die()`, which invokes the bounded busy-wait `sleep(1000)`
  helper before `newGame()`. Reset returns to idle mode with the initial body and
  score zero. Do not replace this with asynchronous timing as an incidental edit.

## Local use and proportional verification

Open `index.html` directly in a browser to play; no installation is needed.
Optionally, if Python 3 is available, run `python3 -m http.server 8000` from the
repository root and open `http://localhost:8000/`. Stop the server after use.
This is a local convenience, not a project build or backend requirement.

For future gameplay or rendering changes, recommended manual browser checks are:

1. Observe idle movement, then start and steer with all four arrow keys; check
   opposite-direction rejection and rapid inputs.
2. Exercise touch regions on a touch-capable browser/device or with touch
   emulation; check direction changes and region boundaries.
3. Eat food; verify growth, replacement food, and the visible score increment.
4. Trigger wall and self-collisions; verify reset body, idle movement, and score.
5. Resize the viewport in idle and active play; inspect canvas size, tile scaling,
   and the existing snake/food positions under the new bounds.

These are manual recommendations, not an existing automated suite. For
documentation-only edits, read the full guide, cross-check claims against the two
application files, and run `git diff --check`; browser sessions are unnecessary.
Report only verification actually performed.
