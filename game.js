let secret, attempts, maxAttempts, gameOver;

function initGame() {
  secret = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  maxAttempts = 10;
  gameOver = false;
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').disabled = false;
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('historyList').innerHTML = '';
  document.getElementById('feedbackMain').className = 'feedback-main idle';
  document.getElementById('feedbackMain').textContent = 'AWAITING INPUT';
  document.getElementById('feedbackSub').textContent = 'ENTER A NUMBER TO BEGIN';
  document.getElementById('usedCount').textContent = '0';
  document.getElementById('leftCount').textContent = '10';
  renderDots();
}

function renderDots() {
  const bar = document.getElementById('attemptsBar');
  bar.innerHTML = '';
  for (let i = 0; i < maxAttempts; i++) {
    const dot = document.createElement('div');
    dot.className = 'attempt-dot';
    if (i < attempts) dot.classList.add('used');
    else dot.classList.add('left');
    bar.appendChild(dot);
  }
}

function makeGuess() {
  if (gameOver) return;
  const input = document.getElementById('guessInput');
  const val = parseInt(input.value);
  if (isNaN(val) || val < 1 || val > 100) {
    triggerGlitch('INVALID INPUT', '1 — 100 RANGE ONLY');
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
    sub.textContent = 'CODE: ' + secret + ' · CRACKED IN ' + attempts + ' ATTEMPT' + (attempts > 1 ? 'S' : '');
    tag.className = 'history-tag tag-high';
    tag.textContent = val;
    document.getElementById('historyList').appendChild(tag);
    gameOver = true;
    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
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

initGame();
