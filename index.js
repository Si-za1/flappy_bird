document.addEventListener("DOMContentLoaded", () => {
	const bird = document.querySelector(".bird");
	const gameScreen = document.querySelector(".game-container");
	const loadingScreen = document.getElementById("loadingScreen");
	const playButton = document.getElementById("playButton");
	const scoreElement = document.getElementById("score");
	const bestScoreElement = document.getElementById("bestScore");


  const gameOverScreen = document.getElementById("gameOverScreen");
  const finalScoreElement = document.getElementById("finalScore");

  const gameAudio = document.getElementById("gameAudio");


	let birdLeft = 220;
	let birdBottom = 150;

	let gravity = 2;
	let isGameOver = false;
	let gap = 430;
	let totalScore = 0;
	let bestScore = localStorage.getItem("bestScore") || 0; // for comparing the bestscore
	let velocityY = 0;

	// for the movement of the bird in the play
	function playGame() {
		if (isGameOver) return;
		// pipeAsObstacle();
		velocityY += gravity;
		birdBottom -= velocityY;
		// this shows at what rate the bird descends
		bird.style.bottom = birdBottom + "px"; // move vertically
		//move horizontally
		bird.style.left = birdLeft + "px"; // adding 220 px to the left everytime at the start
		score = 0; // Initialize the score
		updateScore(); // Update the score display
    gameAudio.play()// audio 
	}

	// loading screen
	playButton.addEventListener("click", () => {
		loadingScreen.style.display = "none"; // Hide the loading screen
		gameScreen.style.display = "block"; // Show the game screen
		playGame();
    pipeAsObstacle();
		setInterval(playGame, 100);
	});

  function restartGame() {
    location.reload();
  }

	function keyControl(e) {
		// only for spacebar
		if (e.keyCode === 32) {
			moveUp();
		}
	}
	// now making the bird go up
	function moveUp() {
		// now to make it up, need to add certain px to move it up
		if (birdBottom < 500) {
			birdBottom += 30;
			console.log(birdBottom);
			console.log("up");
			velocityY = -8;
			bird.style.bottom = birdBottom + "px";
			//if only birdbottom is less than only the 30px is added
		}
	}

	document.addEventListener("keydown", keyControl);

	// only when moves up when pressed keybar

	//scoring system
	function updateScore() {
		scoreElement.textContent = "Score: " + totalScore;
		console.log(scoreElement);
	}

	// best score system
	function updateBestScoreDisplay() {
		bestScoreElement.textContent = "Best Score: " + bestScore;
	}

	// now for the pipes to be used as obstacles
	function pipeAsObstacle() {
		let obstacleLeft = 500;
		// to generate random height pipe
		let randomHeight = Math.random() * 30;
		let obstacleBottom = randomHeight;

		const obstacle = document.createElement("div");
		const topObstacle = document.createElement("div");
		// generate only if game is not over
		if (!isGameOver) {
			obstacle.classList.add("obstacle");
			topObstacle.classList.add("topObstacle");
		}

		gameScreen.appendChild(obstacle);
		gameScreen.appendChild(topObstacle);

		obstacle.style.left = obstacleLeft + "px";
		topObstacle.style.left = obstacleLeft + "px";
		obstacle.style.bottom = obstacleBottom + "px";
		topObstacle.style.bottom = obstacleBottom + gap + "px";

		function moveObstacle() {
			obstacleLeft -= 2;
			obstacle.style.left = obstacleLeft + "px";
			topObstacle.style.left = obstacleLeft + "px";

			if (obstacleLeft === birdLeft) {
				// Bird has passed the obstacle
				totalScore++; // Incrementing the score
				// score display
				updateScore();
				//best score display
				updateBestScoreDisplay();
			}

			if (obstacleLeft === -50) {
				// since width is 60
				clearInterval(timer);
				gameScreen.removeChild(obstacle);
				gameScreen.removeChild(topObstacle);
			}

			if (totalScore > bestScore) {
				bestScore = totalScore; // Update the best score
				localStorage.setItem("bestScore", bestScore); // Saving the best score in local storage
			}

			if (
				(obstacleLeft > 200 &&
					obstacleLeft < 280 &&
					birdLeft === 220 &&
					(birdBottom < obstacleBottom + 154 ||
						birdBottom > obstacleBottom + gap - 200)) ||
				birdBottom === 0
			) {
				console.log("collided");
				gameOver();
				clearInterval(timer);
			}
		}
		let timer = setInterval(moveObstacle, 10);
		if (!isGameOver) setTimeout(pipeAsObstacle, 2500); // generating obstacle every 3 milisecs
    restartButton.addEventListener("click", restartGame);
	}


	function gameOver() {
		//clearInterval(gameTimer);
		isGameOver = true;
		console.log("gameOver");
		document.removeEventListener("keyup", keyControl);
    gameAudio.pause(); // Pause the audio when the game is over
    gameAudio.currentTime = 0;
    gameOverScreen.style.display = "block";
    finalScoreElement.textContent = "Final Score: " + totalScore;
	}
});
