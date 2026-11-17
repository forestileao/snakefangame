# Agent guide

## Project overview

Snake Fangame is a standalone browser game using plain JavaScript and the HTML5
canvas. The checkout has no package manifest, external dependencies, build
pipeline, lint configuration, or automated test suite.

## Code map

- `index.html` is the entry page. It contains inline canvas/heading styles, the
  `#score` element, play instructions, and the script tag loading `snake.js`.
- `snake.js` contains the entire game:
  - `init()` creates and attaches the canvas, obtains its 2D context, initializes
    the score, and starts the game loop.
  - `keyDown()` handles arrow keys; `touchStart()` uses upper/lower screen regions
    for vertical movement and the middle left/right regions for horizontal
    movement. Both start play and guard against immediate direction reversal.
  - `resizeWindow()` updates canvas dimensions and tile size on window resize.
  - `newGame()`, `Snake()`, and `Food()` manage game state, movement, growth, food
    placement, and collision detection/reset. Before play, the snake moves in an
    idle pattern and food is hidden.
  - `update()` handles movement, food consumption, score changes, and collisions;
    `draw()` renders the canvas. `run()` schedules update/draw with `setTimeout`
    at the configured 15 FPS. The script calls `init()` directly at the end.

## Development workflow

Open `index.html` directly in a browser and reload after editing `index.html` or
`snake.js`. No dependency installation, package command, or build step is needed.
Use browser developer tools to inspect script errors and game state.

## Conventions and recommended practices

- Preserve the plain JavaScript, browser-script, and canvas architecture. Keep
  page markup/styling in `index.html` and game logic in `snake.js`.
- Follow the formatting near the edited code: the existing files use uneven
  indentation, mixed quotes, and function constructors with methods attached to
  `this`. Avoid whole-file formatting changes for a focused edit.
- Keep canvas coordinates, tile-based snake/food positions, direction guards,
  and the `#score` connection consistent when modifying behavior.
- Preserve surrounding interface wording and comments unless the task calls for
  changing them. Add dependencies or tooling only when explicitly requested.

## Verification guidance

For future behavior changes, manually check in a browser:

- Initial canvas rendering and idle movement; arrow keys start play, turn in all
  four directions, and prevent immediate reversal.
- Touch input starts play and turns correctly in each screen region, using a
  touch-capable device or browser touch emulation.
- Window resizing updates the canvas and tile sizing; inspect movement and
  rendering after resizing.
- Eating food grows the snake, places new food, and updates the displayed score.
- Wall and self-collisions reset the snake, food, and score to the idle state;
  arrow-key or touch input can start play again.

These are manual checks, not automated tests. For documentation-only changes,
review referenced files and run `git diff --check`; a browser session is
unnecessary. Report only checks actually performed and any observed limitations.
