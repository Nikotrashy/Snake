    const playBoard = document.querySelector(".play-board");
    const scoreElement = document.querySelector(".score");
    const hScoreElement = document.querySelector(".high-score");

    let gameOver = false;
    let foodx, foody;
    let snakeX = 2, snakeY = 2;
    let snakeBody = [];
    let velX = 0, velY = 1;
    let setIntervalId;
    let score = 0;
    let milli = 500;
    let highScore = localStorage.getItem("high-score") || 0;
    hScoreElement.innerHTML = `High score: ${highScore}`;

    const ranFoodPosition = () => {
        foodx = Math.floor(Math.random() * 20) + 1;
        foody = Math.floor(Math.random() * 20) + 1;
    }

    const handleGameOver = () => {
        clearInterval(setIntervalId);
        Swal.fire({
            icon: 'error',
            title: 'Game over',
            text: 'Oh no, your snake crashed! 😣',
            allowOutsideClick: false,
            confirmButtonText: 'Ok'
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            }
        });
    }

    const changeDirection = (event) => {
        console.log(event)
        if (event.key === "ArrowUp" && velY != 1) {
            velX = 0;
            velY = -1;
        } else if (event.key === "ArrowRight" && velX != -1) {
            velX = 1;
            velY = 0;
        } else if (event.key === "ArrowDown" && velY != -1) {
            velX = 0;
            velY = 1;
        } else if (event.key === "ArrowLeft" && velX != 1) {
            velX = -1;
            velY = 0;
        } else if (event.key === "Escape") {
            velX = 0;
            velY = 0;
        }
        initGame();
    }

    const initGame = () => {
        if (gameOver) return handleGameOver();
        let htmlMarkup = `<div class="food" style="grid-area: ${foody} / ${foodx};"></div>`;

        if (snakeX === foodx && snakeY === foody) {
            ranFoodPosition();
            snakeBody.push([foodx, foody]);
            score++;
            milli -= 25;
            highScore = score >= highScore ? score : highScore;
            localStorage.setItem("high-score", highScore)
            scoreElement.innerHTML = `Score: ${score}`;
        }

        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1];
        }

        snakeBody[0] = [snakeX, snakeY];
        snakeX += velX;
        snakeY += velY;

        if (snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20) {
            gameOver = true;
        }

        for (let i = 0; i < snakeBody.length; i++) {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]};" ></div>`;
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        playBoard.innerHTML = htmlMarkup;
    }

    ranFoodPosition();
    setIntervalId = setInterval(initGame, milli);
    document.addEventListener("keydown", changeDirection);