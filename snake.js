        /*
        < ------------------------------------------------------- >
        THIS PROGRAM IS A FANGAME OF THE CLASSIC SNAKE.

        - Coded in Javascript using the CANVAS TAG from html5.
        - By: P. F. Leão

        < --------------------- HAVE FUN :D --------------------- >
        */

        var canvas, score, ctx, HEIGHT, WIDTH, FPS, tileSize, playing;
        var snake, ateFood;
        var globalTouch = [];

        var keys = {
            left: 37,
            up: 38,
            right: 39,
            down: 40
        }
        window.addEventListener("resize", resizeWindow);
        // Resizes the canvas based in the window resolution.

        window.addEventListener('keydown', keyDown);

        window.addEventListener('touchstart', touchStart);

	function sleep(milliseconds) {
  		var start = new Date().getTime();
  		for (var i = 0; i < 1e7; i++) {
    			if ((new Date().getTime() - start) > milliseconds){
      				break;
  				}
			}
	}
        function touchStart(e) {
            e.preventDefault();

            var touch = e.touches[0];
            globalTouch = [touch.pageX, touch.pageY];


            if (!playing) {
                playing = true;
            }
            if (globalTouch[1] < HEIGHT * 0.35 && snake.direction[1] != 1) snake.direction =  [0, -1]; // up
            else if (globalTouch[1] > HEIGHT * 0.65 && snake.direction[1] != -1) snake.direction = [0, 1]; // down
            else if (globalTouch[1] < 0.65 * HEIGHT && globalTouch[1] > 0.35 * HEIGHT && globalTouch[0] > WIDTH / 2 && snake.direction[0] != -1) snake.direction = [1, 0]; // right
            else if (globalTouch[1] < 0.65 * HEIGHT && globalTouch[1] > 0.35 * HEIGHT && globalTouch[0] < WIDTH / 2 && snake.direction[0] != 1) snake.direction = [-1, 0]; // left
        }

        function keyDown(e) {
            if (!playing && (e.keyCode == keys.left || e.keyCode == keys.up || e.keyCode == keys.right || e.keyCode == keys.down)) {
                playing = true; // Press any key to play.
            }
            switch (e.keyCode) {
                case keys.left:
                    if (snake.direction[0] != 1){
                    snake.direction = [-1, 0];
                    }
                    break;

                case keys.up:
                    if (snake.direction[1] != 1){
                    snake.direction = [0, -1];
                    }
                    break;

                case keys.right:
                    if (snake.direction[0] != -1){
                    snake.direction = [1, 0];
                    }
                    break;

                case keys.down:
                    if (snake.direction[1] != -1){
                    snake.direction = [0, 1];
                    }
                    break;
            }
        }

        function resizeWindow() {
            WIDTH = window.innerWidth;
            HEIGHT = window.innerHeight;

            canvas.width = WIDTH;
            canvas.height = HEIGHT;

            tileSize = Math.max(Math.floor(WIDTH / 60), Math.floor(HEIGHT / 60));
        }

        function init() {
            canvas = document.createElement('canvas');
            resizeWindow();
            document.body.appendChild(canvas);
            ctx = canvas.getContext("2d");
            FPS = 15;
            ateFood = 0;
            score = document.getElementById('score');
            score.innerText = `Score: ${ateFood}`;

            newGame();
            run();
        }

        function newGame() {
            snake = new Snake();
            food = new Food();
            playing = false;
            food.newPos();
            ateFood = 0;
	    score.innerText = `Score: ${ateFood}`;

        }

        function Snake() {
            this.body = [[10, 10], [10, 11], [10, 12]]; // Coordinates of each part of the snake's body.
            this.color = "#82047A";
            this.direction = [0, -1];
            this.update = function() {
                var nextPos = [this.body[0][0] + this.direction[0], this.body[0][1] + this.direction[1]];
                 if (!playing) {
                     if (this.direction[1] == -1 && nextPos[1]  <= (HEIGHT * 0.2 / tileSize)) {
                         this.direction = [1, 0];
                     }
                    else if (this.direction[0] == 1 && nextPos[0] >= (WIDTH * 0.8 / tileSize)) {
                         this.direction = [0, 1];
                     }
                    else if (this.direction[1] == 1 && nextPos[1] >= (HEIGHT * 0.9 / tileSize)) {
                         this.direction = [-1, 0];
                     }
                    else if (this.direction[0] == -1 && nextPos[0] <= (WIDTH * 0.2 / tileSize)) {
                         this.direction = [0, -1];
                     }
                }
                this.body.pop();
                this.body.splice(0, 0, nextPos);
            }
            this.addCell = function() {
                this.lastPos = this.body[this.body.length - 1];
                this.body.push(this.lastPos);
            }
            this.draw = function() {
                ctx.fillStyle = this.color;

                for (var i = 0; i < this.body.length; i++) {
                    ctx.fillRect(this.body[i][0] * tileSize, this.body[i][1] * tileSize, tileSize, tileSize);
                }
            }
            this.die = function() {
		    sleep(1000);
		    newGame();
            }
            this.detectCollision = function() {
                for (var part = 1; part < this.body.length; part++) {
                    if (this.body[0][0] == this.body[part][0] && this.body[0][1] == this.body[part][1]) {
                        return true;
                    }

                    if (this.body[0][0] > Math.floor(WIDTH / tileSize) || this.body[0][1] > Math.floor(HEIGHT / tileSize) || this.body[0][0] < 0 || this.body[0][1] < 0){
                        return true;
                    }
                }
            }
        }
        function Food() {
            this.color = "#E31C29";

            this.newPos = function() {
                this.pos = [Math.floor((Math.floor(Math.random() * (WIDTH) )) / tileSize), Math.floor((Math.floor(Math.random() * (HEIGHT) )) / tileSize)];
            }

            this.draw = function() {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.pos[0] * tileSize,this.pos[1] * tileSize,tileSize,tileSize);
            }
        }

        function update() {
            snake.update();
            if (food.pos[0] == snake.body[0][0] && food.pos[1] == snake.body[0][1]) {
                snake.addCell();
                food.newPos();
                ateFood += 1;
                score.innerText = `Score: ${ateFood}`;
            }

            // Verifies colision with the snake's head and its body.
            if (snake.detectCollision()) {
                snake.die();
            }
        }
        function run () {
            update();
            draw();
            setTimeout(run, 1000 / FPS);
        }
        function draw() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            if (playing) {
                food.draw();
            }
            snake.draw();
        }

        init();
