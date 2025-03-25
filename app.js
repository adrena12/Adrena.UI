let bestScores = JSON.parse(localStorage.getItem('adrenaBest')) || {
  reflex: 9999,
  cps: 0,
  aim: 0,
};

// Show Game Mode
function showGame(mode) {
  let gameHTML = '';
  switch (mode) {
    case 'reflexTest':
      gameHTML = `
        <h2>⚡️ Reflex Test</h2>
        <button id="startBtn" onclick="startReflexTest()">Start Test</button>
        <div id="result"></div>
      `;
      break;

    case 'cpsTest':
      gameHTML = `
        <h2>🖱️ CPS Test</h2>
        <button id="cpsBtn" onclick="startCPS()">Start Clicking!</button>
        <div id="cpsResult"></div>
      `;
      break;

    case 'aimingTest':
      gameHTML = `
        <h2>🎯 Aiming Test</h2>
        <div id="aimResult">Hit 3 Targets to Win!</div>
        <div id="targetArea"></div>
      `;
      startAimingMode();
      break;

    case 'cpsGame':
      gameHTML = `
        <h2>🎮 CPS Mini-Game</h2>
        <button onclick="startCPSGame()">Start!</button>
        <div id="cpsGameResult"></div>
      `;
      break;

    default:
      gameHTML = `<h2>🏆 Select a Game Mode!</h2>`;
  }
  document.getElementById('gameContainer').innerHTML = gameHTML;
}

// Reflex Test Logic
let reflexStartTime;
function startReflexTest() {
  document.getElementById('result').innerText = 'Wait for green...';
  setTimeout(() => {
    reflexStartTime = Date.now();
    document.getElementById('result').innerHTML = `
      <button onclick="checkReflex()">Click Now!</button>
    `;
  }, Math.random() * 3000 + 1000);
}

function checkReflex() {
  const reactionTime = Date.now() - reflexStartTime;
  document.getElementById('result').innerText = `⚡️ Reaction Time: ${reactionTime} ms`;
  if (reactionTime < bestScores.reflex) {
    bestScores.reflex = reactionTime;
    saveBestScores();
  }
}

// CPS Test Logic
let clicks = 0;
let cpsTimer;
function startCPS() {
  clicks = 0;
  document.getElementById('cpsResult').innerText = 'Click as fast as you can!';
  cpsTimer = setTimeout(() => {
    let cps = clicks / 5;
    document.getElementById('cpsResult').innerText = `🔥 CPS: ${cps.toFixed(2)}`;
    if (cps > bestScores.cps) {
      bestScores.cps = cps;
      saveBestScores();
    }
  }, 5000);
  document.getElementById('cpsBtn').onclick = () => clicks++;
}

// Aiming Mode Logic
let targetsHit = 0;
function startAimingMode() {
  targetsHit = 0;
  spawnTarget();
}

function spawnTarget() {
  const target = document.createElement('div');
  target.className = 'target';
  target.style.top = `${Math.random() * 70 + 10}%`;
  target.style.left = `${Math.random() * 70 + 10}%`;
  target.onclick = () => {
    targetsHit++;
    target.remove();
    document.getElementById('aimResult').innerText = `🎯 Targets Hit: ${targetsHit}/3`;
    if (targetsHit === 3) {
      document.getElementById('aimResult').innerText = '🏆 You Won!';
      if (targetsHit > bestScores.aim) {
        bestScores.aim = targetsHit;
        saveBestScores();
      }
    } else {
      spawnTarget();
    }
  };
  document.body.appendChild(target);

  setTimeout(() => {
    if (document.body.contains(target)) {
      target.remove();
    }
  }, 1000);
}

// CPS Mini-Games (Example)
function startCPSGame() {
  document.getElementById('cpsGameResult').innerText = 'Coming Soon... 🚀';
}

// Show Personal Bests
function showStats() {
  document.getElementById('gameContainer').innerHTML = `
    <h2>🏆 Personal Bests</h2>
    <p>⚡️ Reflex Test: ${bestScores.reflex} ms</p>
    <p>🖱️ CPS Test: ${bestScores.cps} CPS</p>
    <p>🎯 Aiming Test: ${bestScores.aim} Targets</p>
    <button onclick="resetScores()">🔄 Reset Scores</button>
  `;
}

// Save High Scores
function saveBestScores() {
  localStorage.setItem('adrenaBest', JSON.stringify(bestScores));
}

// Reset Scores
function resetScores() {
  localStorage.removeItem('adrenaBest');
  bestScores = { reflex: 9999, cps: 0, aim: 0 };
  showStats();
}