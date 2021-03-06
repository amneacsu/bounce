const gameWidth = 600;
const gameHeight = 600;

let gameState = {
  player: {
    position: [gameWidth / 2, 7 * gameHeight / 8],
    radius: 0
  },
  ball: {
    position: [0, 0],
    velocity: [0, 0], // px/s
    radius: 20
  },
  start: {
    ball: {
      position: [gameWidth / 2, gameHeight / 6],
      velocity: [100, -200] // px/s
    },
    player: {
      position: [gameWidth / 2, 7 * gameHeight / 8],
      radius: 50
    },
    gravity: 15
  },
  gravity: 0, // velocity modifier
  score: 0,
  highScore: 0,
  difficultyModifier: 400
};

const applyMods = (gameState, deltaTime) => {
  let { player, ball } = gameState;

  // vertical position
  let pos = ball.position;

  let newPosition = ball.velocity.map(function(velocity, idx) {
    return ((velocity * deltaTime) / 1000) + pos[idx];
  });

  ball.position = newPosition;

  // ball-side collision
  if (
    (ball.velocity[0] > 0 && ball.position[0] > (gameWidth - ball.radius)) ||
    (ball.velocity[0] < 0 && ball.position[0] < ball.radius)
  ) {
    ball.velocity[0] *= -1;
  }

  // ball-player collision
  if (playerCollision(gameState) && ball.velocity[1] > 0) {
    ball.velocity[1] *= -1;

    let an = sinOfCollision(ball, player);
    let colSide = ball.position[0] < player.position[0] ? -1 : 1;

    ball.velocity[0] = colSide * an * (gameState.difficultyModifier);

    gameState.score += 1;
  } else {
    ball.velocity[1] = ball.velocity[1] + gameState.gravity;
  }

  // game over
  if (ball.position[1] > gameHeight + 100) {
    reset(gameState);
  }

  return gameState;
};

var dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

function playerCollision(gameState) {
  let { ball, player } = gameState;

  if ((ball.position[1] + ball.radius) < (player.position[1] - player.radius)) {
    return false;
  }

  return dist(...ball.position, ...player.position) <= player.radius + ball.radius;
}

function sinOfCollision(ball, player) {
  return Math.abs(player.position[0] - ball.position[0]) / dist(...ball.position, ...player.position);
}

function gameStateToCanvasState(gameState) {
  let effect = parseInt(50 - (Math.abs(gameState.ball.velocity[0]) / gameState.difficultyModifier) * 50 + 25);
  let ballFill = `hsl(360, ${effect}%, 50%)`;

  let canvasState = {
    player: {
      position: gameState.player.position,
      radius: gameState.player.radius,
      fill: '#93f'
    },
    ball: {
      position: gameState.ball.position,
      radius: gameState.ball.radius,
      fill: ballFill
    },
    score: gameState.score,
    highScore: gameState.highScore
  };

  return canvasState;
}

function canvasStateToCtx(canvasState, ctx) {
  drawGround(canvasState.player, ctx);
  drawCircle(canvasState.player, ctx);
  drawCircle(canvasState.ball, ctx);
  drawScore(canvasState.score, canvasState.highScore, ctx);
}

function drawCircle(entity, ctx) {
  ctx.fillStyle = entity.fill;
  ctx.beginPath();
  ctx.arc(...entity.position, entity.radius, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function drawScore(currentScore, highScore, ctx) {
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#aaa';

  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${currentScore}`, 20, 35);

  ctx.textAlign = 'right';
  ctx.fillText(`High score: ${highScore}`, gameWidth - 20, 35);
}

function drawGround(player, ctx) {
  ctx.beginPath();
  ctx.moveTo(0, player.position[1]);
  ctx.lineTo(gameWidth, player.position[1]);

  ctx.lineWidth = 4;
  ctx.strokeStyle = player.fill;
  ctx.stroke();
}

function movePlayer(delta) {
  let { player } = gameState;

  player.position[0] += delta;
  player.position[0] = Math.min(gameWidth, player.position[0]);
  player.position[0] = Math.max(0, player.position[0]);
}

function mouseControl(e) {
  movePlayer(e.movementX);
}

function reset(gameState) {
  let { player, ball } = gameState;

  ball.position[0] = gameState.start.ball.position[0];
  ball.position[1] = gameState.start.ball.position[1];
  ball.velocity[0] = gameState.start.ball.velocity[0];
  ball.velocity[1] = gameState.start.ball.velocity[1];

  gameState.highScore = Math.max(gameState.score, gameState.highScore);
  gameState.score = 0;

  gameState.player.radius = gameState.start.player.radius;
  gameState.gravity = gameState.start.gravity;
}


function setup() {
  let canvas = document.querySelector('#canvas');
  let ctx = canvas.getContext('2d');

  return {canvas, ctx};
}

(function main() {
  let {canvas, ctx} = setup();
  let frameTime;

  ctx.font = '60px sans-serif';
  ctx.fillStyle = '#aaa';
  ctx.textAlign = 'center';
  ctx.fillText('CLICK TO START', gameWidth / 2, gameHeight / 2);

  let tick = function() {
    let newFrameTime = performance.now();
    let deltaTime =  newFrameTime - frameTime;
    frameTime = newFrameTime;

    // fill
    ctx.fillStyle = 'rgba(255, 255, 255, .8)';
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    applyMods(gameState, deltaTime);
    let canvasState = gameStateToCanvasState(gameState);
    canvasStateToCtx(canvasState, ctx);

    // apply difficulty
    if (gameState.player.radius > 10) {
      gameState.player.radius -= 0.008;
    }

    gameState.gravity += 0.02;

    window.requestAnimationFrame(tick);
  };

  let start = () => {
    if (canvas.requestPointerLock) canvas.requestPointerLock();
    frameTime = performance.now();
    reset(gameState);
    tick();
  };

  canvas.addEventListener('mousemove', mouseControl);
  canvas.addEventListener('click', start);
})();
