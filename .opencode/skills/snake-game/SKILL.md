---
name: snake-game
description: Use when working on snakefangame, index.html, or snake.js to understand the vanilla canvas game, its controls and lifecycle, and conventions to preserve.
---

# Snake Game

## Run the app

- Open `index.html` in a browser. It loads `snake.js` directly; there is no package manager, dependency installation, or build step.
- Arrow keys or a touch start play. The snake follows its existing idle movement before play begins.

## Game structure

- `snake.js` owns canvas creation and rendering, the 15 FPS `setTimeout` loop, and window resizing. Tile size is `Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60))` using the window dimensions.
- Arrow-key handling and touch zones change direction: the top zone moves up, the bottom zone moves down, and the middle zone is split into left and right halves. Preserve the direction guards so the snake cannot reverse into itself.
- `Snake` manages the body, movement, growth, drawing, and wall and self collision. `Food` manages random placement and drawing. Eating food grows the snake and updates the `score` element from `index.html`.
- Death calls the existing busy-wait `sleep(1000)` pause, then `newGame()` resets the snake, food, score, and playing state. Preserve this lifecycle unless a change is explicitly requested.

## Conventions and boundaries

- Keep the single `snake.js` script and the inline page styles in `index.html`.
- Preserve the existing caption verbatim and the Portuguese `pt-BR` page language declaration; the current caption itself is English.
- Keep the current colors: purple snake (`#82047A`), red food (`#E31C29`), dark purple canvas (`#17033B`), and white text (`#ffffff`).
- Do not add a framework, a bundler, or `package.json`. Do not introduce dependencies or change the controls, scoring, collision, or restart behavior unless explicitly asked.
