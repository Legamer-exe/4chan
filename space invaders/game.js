const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: canvas.width / 2, y: canvas.height - 30, width: 50, height: 50, speed: 5, dx: 0 };
let invaders = [];
let bullets = [];
let score = 0;
let gameInterval;
let isGameOver = false;

function createRandomInvaders() {
    let invaderWidth = 40;
    let invaderHeight = 30;
    let maxX = canvas.width - invaderWidth;

    for (let i = 0; i < 3; i++) {
        let randomX = Math.random() * maxX;
        let randomY = Math.random() * (canvas.height / 2);

        invaders.push({ x: randomX, y: randomY, width: invaderWidth, height: invaderHeight });
    }
}

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawInvaders() {
    ctx.fillStyle = 'red';
    invaders.forEach(invader => {
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
    });
}

function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= 5;
        if (bullets[i].y < 0) bullets.splice(i, 1);
    }
}

function moveInvaders() {
    invaders.forEach(invader => {
        invader.y += 1;
        if (invader.y + invader.height > canvas.height) {
            isGameOver = true;
        }
    });
}

function checkCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < invaders.length; j++) {
            let bullet = bullets[i];
            let invader = invaders[j];

            if (
                bullet.x < invader.x + invader.width &&
                bullet.x + bullet.width > invader.x &&
                bullet.y < invader.y + invader.height &&
                bullet.y + bullet.height > invader.y
            ) {
                invaders.splice(j, 1);
                bullets.splice(i, 1);
                score += 10;
                break;
            }
        }
    }
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function draw() {
    if (isGameOver) {
        clearInterval(gameInterval);
        alert('Game Over! Your score is: ' + score);
        document.getElementById('restartButton').style.display = 'inline-block';
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawInvaders();
    drawBullets();

    movePlayer();
    moveBullets();
    moveInvaders();

    checkCollisions();
    updateScore();
}

function startGame() {
    createRandomInvaders();
    gameInterval = setInterval(draw, 1000 / 100);

    setInterval(() => {
        if (!isGameOver) {
            createRandomInvaders();
        }
    }, 5000);
}

function restartGame() {
    invaders = [];
    bullets = [];
    score = 0;
    player.x = canvas.width / 2;
    isGameOver = false;
    document.getElementById('restartButton').style.display = 'none';
    startGame();
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === ' ') {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 5, height: 10 });
    }
});

document.addEventListener('keyup', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
});

startGame();