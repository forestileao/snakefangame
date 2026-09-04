/*
 * Browser entry point for the Snake fangame.
 *
 * Loaded as a plain classic <script> (not type="module") so the game keeps
 * working when `index.html` is opened directly from disk via a `file://`
 * URL. It relies on `Snake`, `Food`, `detectCollision`, `directionFromKey`,
 * `directionFromTouch` and `KEYS` being available as globals, which
 * `src/game.cjs` provides when loaded first (see index.html).
 *
 * Everything here is DOM/canvas plumbing: creating the canvas, drawing,
 * the game loop, and wiring up input events. The actual game rules live in
 * src/game.cjs and are unit tested independently of this file.
 */

var canvas, scoreEl, ctx, HEIGHT, WIDTH, FPS, tileSize, playing;
var snake, food, ateFood;
var restartTimer = null;
var dying = false;

window.addEventListener("resize", resizeWindow);
window.addEventListener("keydown", keyDown);
window.addEventListener("touchstart", touchStart);

function cols() {
    return Math.floor(WIDTH / tileSize);
}

function rows() {
    return Math.floor(HEIGHT / tileSize);
}

function touchStart(e) {
    e.preventDefault();

    var touch = e.touches[0];
    var result = directionFromTouch(
        [touch.pageX, touch.pageY],
        WIDTH,
        HEIGHT,
        snake.direction,
        playing
    );
    snake.direction = result.direction;
    playing = result.playing;
}

function keyDown(e) {
    var result = directionFromKey(e.keyCode, snake.direction, playing);
    snake.direction = result.direction;
    playing = result.playing;
}

function resizeWindow() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));
}

function updateScore() {
    scoreEl.innerText = "Score: " + ateFood;
}

function newGame() {
    snake = new Snake();
    food = new Food();
    playing = false;
    dying = false;
    food.newPos(cols(), rows(), snake.body);
    ateFood = 0;
    updateScore();
}

function update() {
    if (dying) {
        return;
    }

    snake.update({ playing: playing, cols: cols(), rows: rows() });

    if (food.pos[0] === snake.body[0][0] && food.pos[1] === snake.body[0][1]) {
        snake.addCell();
        food.newPos(cols(), rows(), snake.body);
        ateFood += 1;
        updateScore();
    }

    if (detectCollision(snake, cols(), rows())) {
        die();
    }
}

function die() {
    dying = true;
    restartTimer = setTimeout(function () {
        restartTimer = null;
        newGame();
    }, 1000);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (playing) {
        ctx.fillStyle = food.color;
        ctx.fillRect(food.pos[0] * tileSize, food.pos[1] * tileSize, tileSize, tileSize);
    }

    ctx.fillStyle = snake.color;
    for (var i = 0; i < snake.body.length; i++) {
        ctx.fillRect(snake.body[i][0] * tileSize, snake.body[i][1] * tileSize, tileSize, tileSize);
    }
}

function run() {
    update();
    draw();
    setTimeout(run, 1000 / FPS);
}

function init() {
    canvas = document.createElement("canvas");
    resizeWindow();
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    FPS = 15;
    scoreEl = document.getElementById("score");

    newGame();
    run();
}

init();
