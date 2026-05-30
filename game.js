const DIFFICULTIES = {
  easy:   { min: 1, max: 50,  tries: 15, label: '001 — 050' },
  normal: { min: 1, max: 100, tries: 10, label: '001 — 100' },
  hard:   { min: 1, max: 200, tries: 7,  label: '001 — 200' }
};

let secret, attempts, maxAttempts, gameOver, currentDiff;

function setDifficulty(diff) {
  currentDiff = diff;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('diff-' + diff).classList.add('active');
  const cfg = DIFFICULTIES[diff];
  document.getElementById('rangeVal').textContent = cfg.label;
  document.getElementById('maxTriesVal').textContent = cfg.tries;
  updateBestDisplay();
  initGame();
}

function getBestKey() {
  return 'best_' + currentDiff;
}

function getBest() {
  const v = localStorage.getItem(getBestKey());
  return v ? parseInt(v) : null;
}

function setBest(val) {
  const cur = getBest();
  if (cur === null || val < cur) {
    localStorage.setItem(getBestKey(), val);
    return true;
  }
  return false;
}

function updateBestDisplay() {
  const best = getBest();
  document.getElementById('bestScore').textContent = best ? best + ' tries' : '—';
}

function initGame() {
  const cfg = DIFFICULTIES[currentDiff];
  secret = Math.floor(Math.random() * (cfg.max - cfg.min + 1)) + cfg.min;
  attempts = 0;
  maxAttempts = cfg.tries;
  gameOver = false;

  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessInput').max = cfg.max;
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('historyList').innerHTML = '';
  document.getElementById('feedbackMain').className = 'feedback-main idle';
  document.getElementById('feedbackMain').textContent = 'AWAITING INPUT';
  document.getElementById('feedbackSub').textContent = 'ENTER A NUMBER TO BEGIN';
  document.getElementById('usedCount').textContent = '0';
  document.getElementById('leftCount').textContent = maxAttempts;
  updateBestDisplay();
  renderDots();
}

function renderDots() {
  const bar = document.getElementById('attemptsBar');
  bar.innerHTML = '';
  for (let i = 0; i < maxAttempts; i++) {
    const dot = document.createElement('div');
    dot.className = 'attempt-dot ' + (i < attempts ? 'used' : 'left');
    bar.appendChild(dot);
  }
}

function makeGuess() {
  if (gameOver) return;
  const input = document.getElementById('guessInput');
  const val = parseInt(input.value);
  const cfg = DIFFICULTIES[currentDiff];

  if (isNaN(val) || val < cfg.min || val > cfg.max) {
    triggerGlitch('INVALID INPUT', cfg.min + ' — ' + cfg.max + ' RANGE ONLY');
    return;
  }

  attempts++;
  renderDots();
  document.getElementById('usedCount').textContent = attempts;
  document.getElementById('leftCount').textContent = maxAttempts - attempts;

  const tag = document.createElement('div');
  const main = document.getElementById('feedbackMain');
  const sub = document.getElementById('feedbackSub');

  if (val === secret) {
    main.className = 'feedback-main win';
    main.textContent = '[ ACCESS GRANTED ]';
    sub.textContent = 'CRACKED IN ' + attempts + ' ATTEMPT' + (attempts > 1 ? 'S' : '');
    tag.className = 'history-tag tag-high';
    tag.textContent = val;
    document.getElementById('historyList').appendChild(tag);
    gameOver = true;
    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    const isNew = setBest(attempts);
    setTimeout(() => showOverlay(true, attempts, isNew), 600);
  } else if (attempts >= maxAttempts) {
    main.className = 'feedback-main lose';
    main.textContent = '[ ACCESS DENIED ]';
    sub.textContent = 'THE CODE WAS: ' + secret;
    tag.className = 'history-tag tag-high';
    tag.textContent = val;
    document.getElementById('historyList').appendChild(tag);
    gameOver = true;
    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
    setTimeout(() => showOverlay(false, attempts, false), 600);
  } else if (val < secret) {
    main.className = 'feedback-main higher';
    main.textContent = '[ HIGHER ]';
    sub.textContent = val + ' IS TOO LOW · GO HIGHER';
    tag.className = 'history-tag tag-low';
    tag.textContent = val + ' ↑';
    document.getElementById('historyList').appendChild(tag);
  } else {
    main.className = 'feedback-main lower';
    main.textContent = '[ LOWER ]';
    sub.textContent = val + ' IS TOO HIGH · GO LOWER';
    tag.className = 'history-tag tag-high';
    tag.textContent = val + ' ↓';
    document.getElementById('historyList').appendChild(tag);
  }

  input.value = '';
  input.focus();
}

function showOverlay(isWin, tries, isNewBest) {
  const overlay = document.getElementById('resultOverlay');
  const icon = document.getElementById('overlayIcon');
  const title = document.getElementById('overlayTitle');
  const msg = document.getElementById('overlayMsg');
  const best = document.getElementById('overlayBest');

  if (isWin) {
    icon.className = 'overlay-icon';
    icon.textContent = '✓';
    title.className = 'overlay-title';
    title.textContent = 'ACCESS GRANTED';
    msg.textContent = 'CRACKED IN ' + tries + ' ATTEMPT' + (tries > 1 ? 'S' : '');
    best.textContent = isNewBest ? '🏆 NEW BEST SCORE!' : 'BEST: ' + getBest() + ' TRIES';
  } else {
    icon.className = 'overlay-icon fail';
    icon.textContent = '✗';
    title.className = 'overlay-title fail';
    title.textContent = 'ACCESS DENIED';
    msg.textContent = 'THE CODE WAS: ' + secret;
    const b = getBest();
    best.textContent = b ? 'BEST: ' + b + ' TRIES' : '';
  }

  overlay.classList.add('show');
}

function closeOverlay() {
  document.getElementById('resultOverlay').classList.remove('show');
  initGame();
}

function triggerGlitch(mainText, subText) {
  const box = document.getElementById('feedbackBox');
  box.classList.add('glitch');
  document.getElementById('feedbackMain').textContent = mainText;
  document.getElementById('feedbackSub').textContent = subText;
  setTimeout(() => box.classList.remove('glitch'), 300);
}

document.getElementById('guessInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') makeGuess();
});

currentDiff = 'easy';
initGame();