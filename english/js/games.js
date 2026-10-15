/**
 * KiddoLingo - Mini-Games Engine
 * Game 1: Balloon Pop Word Catcher
 * Game 2: Magic Memory Card Matching
 */

class MiniGamesManager {
  constructor() {
    // Balloon Game State
    this.balloonGameActive = false;
    this.balloonScore = 0;
    this.balloonPopsCount = 0;
    this.balloonTarget = null;
    this.balloonSpawnTimer = null;
    this.balloonAnimFrame = null;
    this.activeBalloons = [];

    // Memory Game State
    this.memoryCards = [];
    this.flippedCards = [];
    this.matchedPairsCount = 0;
    this.memoryMoves = 0;
    this.memoryTimer = 0;
    this.memoryTimerInterval = null;
  }

  // ==========================================
  // GAME 1: BALLOON POP WORD CATCHER
  // ==========================================
  initBalloonGame() {
    const arena = document.getElementById('balloon-arena');
    if (!arena) return;

    this.stopBalloonGame();
    arena.innerHTML = '';
    this.balloonScore = 0;
    this.updateBalloonScoreUI();
    this.pickNewBalloonTarget();

    const startBtn = document.getElementById('balloon-start-btn');
    if (startBtn) startBtn.textContent = this.getLang() === 'ru' ? '⏸️ Приостановить' : '⏸️ O‘yinni to‘xtatish / Pause';

    this.balloonGameActive = true;
    this.activeBalloons = [];
    
    // Spawn balloons periodically
    this.balloonSpawnTimer = setInterval(() => {
      if (this.balloonGameActive && this.activeBalloons.length < 7) {
        this.spawnBalloon(arena);
      }
    }, 1100);

    // Initial batch of balloons
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (this.balloonGameActive) this.spawnBalloon(arena);
      }, i * 400);
    }
  }

  getLang() {
    return window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  pickNewBalloonTarget() {
    const randomWord = VOCABULARY_DATA[Math.floor(Math.random() * VOCABULARY_DATA.length)];
    this.balloonTarget = randomWord;

    const targetWordEl = document.getElementById('balloon-target-word');
    const targetHintEl = document.getElementById('balloon-target-hint');
    const isRu = this.getLang() === 'ru';
    
    if (targetWordEl) {
      targetWordEl.innerHTML = `${randomWord.emoji} <span class="highlight-word">${randomWord.word.toUpperCase()}</span>`;
    }
    if (targetHintEl) {
      targetHintEl.textContent = isRu 
        ? `Значение: ${randomWord.russian} (${randomWord.uzbek})` 
        : `Ma’nosi: ${randomWord.uzbek} (${randomWord.russian})`;
    }

    // Pronounce target word for the child!
    window.soundEngine.speak(randomWord.word);
  }

  spawnBalloon(arena) {
    if (!this.balloonGameActive || !this.balloonTarget) return;

    // Decide if this balloon carries the target word or a distractor
    const isTarget = Math.random() < 0.4 || this.activeBalloons.every(b => !b.isTarget);
    let wordObj = this.balloonTarget;

    if (!isTarget) {
      const distractors = VOCABULARY_DATA.filter(w => w.word !== this.balloonTarget.word);
      wordObj = distractors[Math.floor(Math.random() * distractors.length)];
    }

    const balloonColors = ['#FF477E', '#FFB703', '#06D6A0', '#48CAE4', '#845EC2', '#FF9671'];
    const chosenColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];

    const balloonEl = document.createElement('div');
    balloonEl.className = 'balloon-item';
    balloonEl.style.backgroundColor = chosenColor;
    
    const arenaWidth = arena.clientWidth || 600;
    const posX = Math.floor(Math.random() * (arenaWidth - 110)) + 15;
    balloonEl.style.left = `${posX}px`;
    balloonEl.style.bottom = `-130px`;

    balloonEl.innerHTML = `
      <div class="balloon-string"></div>
      <div class="balloon-knot" style="background-color: ${chosenColor};"></div>
      <span class="balloon-emoji">${wordObj.emoji}</span>
      <span class="balloon-text">${wordObj.word}</span>
    `;

    const balloonData = {
      el: balloonEl,
      isTarget: wordObj.word === this.balloonTarget.word,
      word: wordObj.word,
      speed: Math.random() * 1.5 + 1.2,
      wobbleSpeed: Math.random() * 0.05 + 0.02,
      wobbleAngle: Math.random() * Math.PI,
      currentY: -130,
      baseX: posX
    };

    balloonEl.addEventListener('click', () => {
      this.popBalloon(balloonData, arena);
    });

    // Touch support for tablets/phones
    balloonEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.popBalloon(balloonData, arena);
    }, { passive: false });

    arena.appendChild(balloonEl);
    this.activeBalloons.push(balloonData);

    if (!this.balloonAnimFrame) {
      this.animateBalloons(arena);
    }
  }

  animateBalloons(arena) {
    if (!this.balloonGameActive) return;

    const arenaHeight = arena.clientHeight || 480;

    for (let i = this.activeBalloons.length - 1; i >= 0; i--) {
      const b = this.activeBalloons[i];
      b.currentY += b.speed;
      b.wobbleAngle += b.wobbleSpeed;
      const wobbleX = b.baseX + Math.sin(b.wobbleAngle) * 20;

      b.el.style.bottom = `${b.currentY}px`;
      b.el.style.left = `${wobbleX}px`;

      // Escaped off top of arena
      if (b.currentY > arenaHeight + 40) {
        if (b.el.parentNode) b.el.parentNode.removeChild(b.el);
        this.activeBalloons.splice(i, 1);
      }
    }

    this.balloonAnimFrame = requestAnimationFrame(() => this.animateBalloons(arena));
  }

  popBalloon(balloonData, arena) {
    if (!this.balloonGameActive) return;

    window.soundEngine.playPop();

    // Create particle pop effect at balloon center
    const rect = balloonData.el.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();
    const relativeX = rect.left - arenaRect.left + rect.width / 2;
    const relativeY = rect.top - arenaRect.top + rect.height / 2;

    this.createPopParticles(arena, relativeX, relativeY, balloonData.el.style.backgroundColor);

    // Remove DOM element
    if (balloonData.el.parentNode) {
      balloonData.el.parentNode.removeChild(balloonData.el);
    }
    const idx = this.activeBalloons.indexOf(balloonData);
    if (idx !== -1) {
      this.activeBalloons.splice(idx, 1);
    }

    if (balloonData.isTarget) {
      // Correct balloon popped!
      this.balloonScore += 10;
      this.balloonPopsCount++;
      window.soundEngine.playSuccess();
      window.appState.addStars(1);

      if (this.balloonPopsCount >= 5) {
        window.appState.unlockBadge('balloon-popper');
        if (!this.level1Reached) {
          this.level1Reached = true;
          if (window.subscriptionManager && !window.subscriptionManager.canPlayGameLevel('balloon', 2)) {
            this.stopBalloonGame();
            return;
          }
        }
      }

      this.updateBalloonScoreUI();
      this.pickNewBalloonTarget();
    } else {
      // Wrong balloon popped
      window.soundEngine.playError();
      this.balloonScore = Math.max(0, this.balloonScore - 2);
      this.updateBalloonScoreUI();
    }
  }

  createPopParticles(arena, x, y, color) {
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'pop-particle';
      p.style.backgroundColor = color;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      const angle = (Math.PI * 2 / 10) * i;
      const dist = Math.random() * 40 + 20;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);

      arena.appendChild(p);
      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 500);
    }
  }

  updateBalloonScoreUI() {
    const scoreEl = document.getElementById('balloon-score-display');
    if (scoreEl) scoreEl.textContent = this.balloonScore;
  }

  stopBalloonGame() {
    this.balloonGameActive = false;
    clearInterval(this.balloonSpawnTimer);
    if (this.balloonAnimFrame) {
      cancelAnimationFrame(this.balloonAnimFrame);
      this.balloonAnimFrame = null;
    }
    const startBtn = document.getElementById('balloon-start-btn');
    if (startBtn) startBtn.textContent = this.getLang() === 'ru' ? '▶️ Начать игру / Start Game' : '▶️ O‘yinni boshlash / Start Game';
  }

  updateBalloonHintForLang() {
    if (this.balloonTarget) {
      const targetHintEl = document.getElementById('balloon-target-hint');
      const isRu = this.getLang() === 'ru';
      if (targetHintEl) {
        targetHintEl.textContent = isRu 
          ? `Значение: ${this.balloonTarget.russian} (${this.balloonTarget.uzbek})` 
          : `Ma’nosi: ${this.balloonTarget.uzbek} (${this.balloonTarget.russian})`;
      }
    }
  }

  toggleBalloonGame() {
    if (this.balloonGameActive) {
      this.stopBalloonGame();
    } else {
      this.initBalloonGame();
    }
  }

  // ==========================================
  // GAME 2: MAGIC MEMORY CARD MATCHING
  // ==========================================
  initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    clearInterval(this.memoryTimerInterval);
    this.matchedPairsCount = 0;
    this.memoryMoves = 0;
    this.memoryTimer = 0;
    this.flippedCards = [];

    this.updateMemoryStatsUI();
    this.memoryTimerInterval = setInterval(() => {
      this.memoryTimer++;
      this.updateMemoryStatsUI();
    }, 1000);

    // Pick 6 random words from dataset
    const shuffledVocab = [...VOCABULARY_DATA].sort(() => Math.random() - 0.5).slice(0, 6);
    const isRu = this.getLang() === 'ru';
    
    // Create pair items: Card A (English Word) & Card B (Visual Emoji + Target Language name)
    const deck = [];
    shuffledVocab.forEach((item, index) => {
      deck.push({
        pairId: index,
        type: 'word',
        content: item.word,
        subtext: isRu ? 'Английский' : 'Inglizcha',
        emoji: '🔤',
        color: item.color
      });
      deck.push({
        pairId: index,
        type: 'picture',
        content: isRu ? item.russian : item.uzbek,
        subtext: item.word,
        emoji: item.emoji,
        color: item.color
      });
    });

    // Shuffle the deck
    this.memoryCards = deck.sort(() => Math.random() - 0.5);

    grid.innerHTML = this.memoryCards.map((card, idx) => `
      <div class="memory-card" data-index="${idx}" onclick="window.miniGamesManager.flipMemoryCard(${idx})">
        <div class="memory-card-inner">
          <div class="memory-card-front">
            <span class="card-back-pattern">⭐</span>
          </div>
          <div class="memory-card-back" style="border-color: ${card.color};">
            <span class="card-back-emoji">${card.emoji}</span>
            <strong class="card-back-word">${card.content}</strong>
            <span class="card-back-sub">${card.subtext}</span>
          </div>
        </div>
      </div>
    `).join('');

    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) winBanner.style.display = 'none';
  }

  flipMemoryCard(index) {
    if (this.flippedCards.length >= 2) return; // Prevent clicking more than 2
    const cardEl = document.querySelector(`.memory-card[data-index="${index}"]`);
    if (!cardEl || cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;

    window.soundEngine.playFlip();
    cardEl.classList.add('is-flipped');
    this.flippedCards.push({ index, data: this.memoryCards[index], el: cardEl });

    // Speak the English word if it's a word or subtext
    const wordToSpeak = this.memoryCards[index].type === 'word' 
      ? this.memoryCards[index].content 
      : this.memoryCards[index].subtext;
    window.soundEngine.speak(wordToSpeak);

    if (this.flippedCards.length === 2) {
      this.memoryMoves++;
      this.updateMemoryStatsUI();
      this.checkMemoryMatch();
    }
  }

  checkMemoryMatch() {
    const [c1, c2] = this.flippedCards;

    if (c1.data.pairId === c2.data.pairId) {
      // Success match!
      setTimeout(() => {
        window.soundEngine.playSuccess();
        c1.el.classList.add('is-matched');
        c2.el.classList.add('is-matched');
        this.matchedPairsCount++;
        window.appState.addStars(1);

        if (this.matchedPairsCount === 6) {
          // Win game!
          this.handleMemoryWin();
        }

        this.flippedCards = [];
      }, 500);
    } else {
      // Mismatch
      setTimeout(() => {
        window.soundEngine.playError();
        c1.el.classList.add('card-shake');
        c2.el.classList.add('card-shake');

        setTimeout(() => {
          c1.el.classList.remove('is-flipped', 'card-shake');
          c2.el.classList.remove('is-flipped', 'card-shake');
          this.flippedCards = [];
        }, 600);
      }, 900);
    }
  }

  handleMemoryWin() {
    clearInterval(this.memoryTimerInterval);
    window.soundEngine.playFanfare();
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);
    window.appState.unlockBadge('memory-master');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const title = isRu ? '🎉 Поздравляем! Ты победил!' : '🎉 Tabriklaymiz! Siz yutdingiz!';
    const stats = isRu 
      ? `Время: <strong>${this.memoryTimer} сек</strong> | Попыток: <strong>${this.memoryMoves}</strong>` 
      : `Vaqt: <strong>${this.memoryTimer} soniya</strong> | Urinishlar: <strong>${this.memoryMoves} ta</strong>`;
    const btnReplay = isRu ? '🔄 Сыграть снова (Уровень 1)' : '🔄 Qaytadan o‘ynash (1-daraja)';
    const btnNext = isRu ? '🚀 Уровень 2 • 👑 Pro' : '🚀 Keyingi Daraja (2-daraja • 👑 Pro)';

    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars">⭐⭐⭐</div>
        <h3>${title}</h3>
        <p>${stats}</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
          <button class="btn btn-secondary" onclick="window.miniGamesManager.initMemoryGame()">
            ${btnReplay}
          </button>
          <button class="btn btn-primary" onclick="window.miniGamesManager.tryNextMemoryLevel()">
            ${btnNext}
          </button>
        </div>
      `;
      winBanner.style.display = 'block';
    }
  }

  tryNextMemoryLevel() {
    if (window.subscriptionManager && !window.subscriptionManager.canPlayGameLevel('memory', 2)) {
      return;
    }
    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) winBanner.style.display = 'none';
    this.initMemoryGame();
  }

  updateMemoryStatsUI() {
    const movesEl = document.getElementById('memory-moves-display');
    const timerEl = document.getElementById('memory-timer-display');
    if (movesEl) movesEl.textContent = this.memoryMoves;
    if (timerEl) timerEl.textContent = `${this.memoryTimer}s`;
  }
}

window.miniGamesManager = new MiniGamesManager();
