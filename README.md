# Snake Fangame

A browser-based fangame of classic Snake, drawn on an HTML5 canvas using plain
JavaScript. Steer the snake toward food and avoid hitting its body or the edges
of the play area.

## Requirements and setup

Use a modern browser with JavaScript enabled and HTML5 canvas support. Download
or clone this repository, keep its files together, and open [index.html](index.html)
directly in the browser. There is no package installation or build step.

## How to play

- **Keyboard:** press an arrow key to start, then use the arrow keys to steer up,
  down, left, or right. The snake cannot immediately reverse direction.
- **Touch:** touch the screen to start and steer using these screen regions:
  - Top 35%: up.
  - Bottom 35%: down.
  - Middle band (35–65% of screen height): left half for left, right half for right.
- Eating food adds one point to the displayed score and one segment to the snake.
- Hitting the snake's body or a boundary resets the snake and score to zero.
  Press an arrow key or touch again to start the next game.

## Files

- [index.html](index.html): page layout, styles, score display, and script loading.
- [snake.js](snake.js): canvas rendering, keyboard and touch-region controls,
  movement, food, scoring, and collision reset.
