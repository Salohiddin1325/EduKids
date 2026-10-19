/**
 * KiddoLingo - Mini-Games Engine with 50+ Progressive Levels & World Map
 * Game 1: Balloon Pop Word Catcher (50 Levels)
 * Game 2: Magic Memory Card Matching (50 Levels)
 */

class MiniGamesManager {
  constructor() {
    // Progression & Level State
    this.currentBalloonLevel = 1;
    this.currentMemoryLevel = 1;

    // Balloon Game State
    this.balloonGameActive = false;
    this.balloonScore = 0;
    this.balloonPopsCount = 0;
    this.balloonErrors = 0;
    this.targetPopsToWin = 5;
    this.balloonTarget = null;
    this.balloonSpawnTimer = null;
    this.balloonAnimFrame = null;
    this.activeBalloons = [];
    this.balloonSpeedMultiplier = 1.0;

    // Memory Game State
    this.memoryCards = [];
    this.flippedCards = [];
    this.matchedPairsCount = 0;
    this.pairsToMatch = 6;
    this.memoryMoves = 0;
    this.memoryTimer = 0;
    this.memoryTimerInterval = null;
  }

  getLang() {
    return window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  // ==========================================
  // GAME 1: BALLOON POP WORD CATCHER (50 Levels)
  // ==========================================
  initBalloonGame(forcedLevel = null) {
    const arena = document.getElementById('balloon-arena');
    if (!arena) return;

    if (forcedLevel) {
      this.currentBalloonLevel = forcedLevel;
    } else if (window.levelProgressionSystem) {
      this.currentBalloonLevel = window.levelProgressionSystem.getCurrentLevel('english_balloon');
    }

    // Configure difficulty scaling
    const cfg = window.levelProgressionSystem 
      ? window.levelProgressionSystem.getLevelConfig('english_balloon', this.currentBalloonLevel)
      : { speedMultiplier: 1.0, tier: { nameUz: 'Oson', nameRu: 'Легкий' } };

    this.balloonSpeedMultiplier = cfg.speedMultiplier;
    this.targetPopsToWin = Math.min(15, 3 + Math.floor(this.currentBalloonLevel / 4));
    this.balloonErrors = 0;
    this.balloonPopsCount = 0;

    // Update level display
    const lvlEl = document.getElementById('balloon-level-display');
    if (lvlEl) {
      const isRu = this.getLang() === 'ru';
      lvlEl.textContent = `${this.currentBalloonLevel} (${isRu ? cfg.tier.nameRu : cfg.tier.nameUz})`;
    }

    // Hide win banner if open
    const winBanner = document.getElementById('balloon-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    this.stopBalloonGame();
    arena.innerHTML = '';
    this.balloonScore = 0;
    this.updateBalloonScoreUI();
    this.pickNewBalloonTarget();

    const startBtn = document.getElementById('balloon-start-btn');
    if (startBtn) startBtn.textContent = this.getLang() === 'ru' ? '⏸️ Приостановить' : '⏸️ O‘yinni to‘xtatish / Pause';

    this.balloonGameActive = true;
    this.activeBalloons = [];

    // Spawn interval decreases slightly with level for higher density
    const spawnInterval = Math.max(700, 1100 - (this.currentBalloonLevel * 7));

    this.balloonSpawnTimer = setInterval(() => {
      if (this.balloonGameActive && this.activeBalloons.length < (5 + Math.floor(this.currentBalloonLevel / 10))) {
        this.spawnBalloon(arena);
      }
    }, spawnInterval);

    // Initial batch of balloons
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (this.balloonGameActive) this.spawnBalloon(arena);
      }, i * 350);
    }
  }

  pickNewBalloonTarget() {
    // Select vocabulary pool based on level tier
    let vocabPool = VOCABULARY_DATA;
    if (this.currentBalloonLevel <= 10) {
      vocabPool = VOCABULARY_DATA.slice(0, 50); // Starter words
    } else if (this.currentBalloonLevel <= 25) {
      vocabPool = VOCABULARY_DATA.slice(0, 200); // Explorer words
    }

    const randomWord = vocabPool[Math.floor(Math.random() * vocabPool.length)];
    this.balloonTarget = randomWord;

    const targetWordEl = document.getElementById('balloon-target-word');
    const targetHintEl = document.getElementById('balloon-target-hint');
    const isRu = this.getLang() === 'ru';
    
    if (targetWordEl) {
      targetWordEl.innerHTML = `${randomWord.emoji} <span class="highlight-word">${randomWord.word.toUpperCase()}</span>`;
    }
    if (targetHintEl) {
      targetHintEl.textContent = isRu 
        ? `Значение: ${randomWord.russian} (${randomWord.uzbek}) • Цель: ${this.balloonPopsCount}/${this.targetPopsToWin}` 
        : `Ma’nosi: ${randomWord.uzbek} (${randomWord.russian}) • Maqsad: ${this.balloonPopsCount}/${this.targetPopsToWin}`;
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
      let pool = VOCABULARY_DATA.filter(w => w.word !== this.balloonTarget.word);
      if (this.currentBalloonLevel <= 10) pool = pool.slice(0, 50);
      wordObj = pool[Math.floor(Math.random() * pool.length)];
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
      speed: (Math.random() * 1.4 + 1.2) * (this.balloonSpeedMultiplier || 1.0),
      wobbleSpeed: Math.random() * 0.05 + 0.02,
      wobbleAngle: Math.random() * Math.PI,
      currentY: -130,
      baseX: posX
    };

    balloonEl.addEventListener('click', () => {
      this.popBalloon(balloonData, arena);
    });

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
    const arenaHeight = arena.clientHeight || 450;

    const loop = () => {
      if (!this.balloonGameActive) return;

      for (let i = this.activeBalloons.length - 1; i >= 0; i--) {
        const b = this.activeBalloons[i];
        b.currentY += b.speed;
        b.wobbleAngle += b.wobbleSpeed;
        const wobbleX = Math.sin(b.wobbleAngle) * 14;

        b.el.style.bottom = `${b.currentY}px`;
        b.el.style.left = `${b.baseX + wobbleX}px`;

        // If balloon escaped out of screen top
        if (b.currentY > arenaHeight + 60) {
          if (b.el.parentNode) b.el.parentNode.removeChild(b.el);
          this.activeBalloons.splice(i, 1);
        }
      }

      this.balloonAnimFrame = requestAnimationFrame(loop);
    };

    this.balloonAnimFrame = requestAnimationFrame(loop);
  }

  popBalloon(balloonData, arena) {
    if (!this.balloonGameActive) return;

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

      this.updateBalloonScoreUI();

      if (this.balloonPopsCount >= this.targetPopsToWin) {
        this.handleBalloonWin();
        return;
      }

      this.pickNewBalloonTarget();
    } else {
      // Wrong balloon popped
      this.balloonErrors++;
      window.soundEngine.playError();
      this.balloonScore = Math.max(0, this.balloonScore - 2);
      this.updateBalloonScoreUI();
    }
  }

  handleBalloonWin() {
    this.stopBalloonGame();
    window.soundEngine.playFanfare();
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);

    // Calculate stars
    const stars = this.balloonErrors === 0 ? 3 : (this.balloonErrors <= 2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('english_balloon', this.currentBalloonLevel, stars);
    }

    window.appState.unlockBadge('balloon-popper');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu 
      ? `🎉 Уровень ${this.currentBalloonLevel} пройден!` 
      : `🎉 ${this.currentBalloonLevel}-Bosqich Yakunlandi!`;
    const stats = isRu 
      ? `Очки: <strong>${this.balloonScore}</strong> | Ошибок: <strong>${this.balloonErrors}</strong>` 
      : `To‘plangan ball: <strong>${this.balloonScore}</strong> | Xatolar: <strong>${this.balloonErrors} ta</strong>`;

    const nextLevel = this.currentBalloonLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const nextBtnText = isRu 
      ? `🚀 Уровень ${nextLevel} ${(!isPro && nextLevel > 1) ? '• 👑 PRO' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${(!isPro && nextLevel > 1) ? '• 👑 PRO' : ''}`;

    const winBanner = document.getElementById('balloon-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars" style="font-size: 2.2rem; margin-bottom: 6px;">${starsStr}</div>
        <h3>${title}</h3>
        <p>${stats}</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:16px;">
          <button class="btn btn-secondary" onclick="window.miniGamesManager.initBalloonGame(${this.currentBalloonLevel})">
            🔄 ${isRu ? 'Сыграть снова' : 'Qaytadan o‘ynash'}
          </button>
          <button class="btn btn-primary" onclick="window.miniGamesManager.tryNextBalloonLevel()">
            ${nextBtnText}
          </button>
          <button class="game-level-map-btn" onclick="window.miniGamesManager.openBalloonMap()">
            🗺️ ${isRu ? 'Карта 50+ уровней' : '50+ Bosqichlar Xaritasi'}
          </button>
        </div>
      `;
      winBanner.style.display = 'block';
    }
  }

  tryNextBalloonLevel() {
    const nextLevel = this.currentBalloonLevel + 1;
    if (window.levelProgressionSystem && !window.levelProgressionSystem.canAccessLevel('english_balloon', nextLevel)) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openGamePaywallModal('english_balloon', nextLevel);
      }
      return;
    }

    const winBanner = document.getElementById('balloon-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    this.currentBalloonLevel = nextLevel;
    this.initBalloonGame(nextLevel);
  }

  openBalloonMap() {
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.openMapModal(
        'english_balloon', 
        this.getLang() === 'ru' ? 'Шарики (Balloon Pop)' : 'Havo Sharlarini Portlat (Balloon Pop)',
        (lvl) => {
          this.initBalloonGame(lvl);
        }
      );
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

  toggleBalloonGame() {
    if (this.balloonGameActive) {
      this.stopBalloonGame();
    } else {
      this.initBalloonGame();
    }
  }

  // ==========================================
  // GAME 2: MAGIC MEMORY CARD MATCHING (50 Levels)
  // ==========================================
  initMemoryGame(forcedLevel = null) {
    const grid = document.getElementById('memory-grid');
    if (!grid) return;

    if (forcedLevel) {
      this.currentMemoryLevel = forcedLevel;
    } else if (window.levelProgressionSystem) {
      this.currentMemoryLevel = window.levelProgressionSystem.getCurrentLevel('english_memory');
    }

    // Number of pairs scaling with level:
    // Levels 1–10: 4 pairs (8 cards - Starter)
    // Levels 11–25: 6 pairs (12 cards - Explorer)
    // Levels 26–50: 8 pairs (16 cards - Master)
    if (this.currentMemoryLevel <= 10) {
      this.pairsToMatch = 4;
    } else if (this.currentMemoryLevel <= 25) {
      this.pairsToMatch = 6;
    } else {
      this.pairsToMatch = 8;
    }

    const lvlEl = document.getElementById('memory-level-display');
    if (lvlEl) {
      lvlEl.textContent = `${this.currentMemoryLevel}`;
    }

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

    // Pick words based on level tier
    let vocabPool = VOCABULARY_DATA;
    if (this.currentMemoryLevel <= 10) {
      vocabPool = VOCABULARY_DATA.slice(0, 50);
    } else if (this.currentMemoryLevel <= 25) {
      vocabPool = VOCABULARY_DATA.slice(0, 200);
    }

    const shuffledVocab = [...vocabPool].sort(() => Math.random() - 0.5).slice(0, this.pairsToMatch);
    const isRu = this.getLang() === 'ru';
    
    // Create pair items
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

    // Shuffle deck
    this.memoryCards = deck.sort(() => Math.random() - 0.5);

    grid.innerHTML = this.memoryCards.map((card, index) => `
      <div class="memory-card" data-index="${index}" onclick="window.miniGamesManager.flipMemoryCard(${index})">
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
    if (this.flippedCards.length >= 2) return;
    const cardEl = document.querySelector(`.memory-card[data-index="${index}"]`);
    if (!cardEl || cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;

    window.soundEngine.playFlip();
    cardEl.classList.add('is-flipped');
    this.flippedCards.push({ index, data: this.memoryCards[index], el: cardEl });

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
      setTimeout(() => {
        window.soundEngine.playSuccess();
        c1.el.classList.add('is-matched');
        c2.el.classList.add('is-matched');
        this.matchedPairsCount++;
        window.appState.addStars(1);

        if (this.matchedPairsCount === this.pairsToMatch) {
          this.handleMemoryWin();
        }

        this.flippedCards = [];
      }, 500);
    } else {
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

    // Calculate stars
    const stars = this.memoryMoves <= this.pairsToMatch * 2.2 ? 3 : (this.memoryMoves <= this.pairsToMatch * 3.2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('english_memory', this.currentMemoryLevel, stars);
    }

    window.appState.unlockBadge('memory-master');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu ? `🎉 Уровень ${this.currentMemoryLevel} пройден!` : `🎉 ${this.currentMemoryLevel}-Bosqich Yakunlandi!`;
    const stats = isRu 
      ? `Время: <strong>${this.memoryTimer} сек</strong> | Попыток: <strong>${this.memoryMoves}</strong>` 
      : `Vaqt: <strong>${this.memoryTimer} soniya</strong> | Urinishlar: <strong>${this.memoryMoves} ta</strong>`;

    const nextLevel = this.currentMemoryLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const btnNext = isRu 
      ? `🚀 Уровень ${nextLevel} ${(!isPro && nextLevel > 1) ? '• 👑 Pro' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${(!isPro && nextLevel > 1) ? '• 👑 Pro' : ''}`;

    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars" style="font-size: 2.2rem; margin-bottom: 6px;">${starsStr}</div>
        <h3>${title}</h3>
        <p>${stats}</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
          <button class="btn btn-secondary" onclick="window.miniGamesManager.initMemoryGame(${this.currentMemoryLevel})">
            🔄 ${isRu ? 'Сыграть снова' : 'Qaytadan o‘ynash'}
          </button>
          <button class="btn btn-primary" onclick="window.miniGamesManager.tryNextMemoryLevel()">
            ${btnNext}
          </button>
          <button class="game-level-map-btn" onclick="window.miniGamesManager.openMemoryMap()">
            🗺️ ${isRu ? 'Карта 50+ уровней' : '50+ Bosqichlar Xaritasi'}
          </button>
        </div>
      `;
      winBanner.style.display = 'block';
    }
  }

  tryNextMemoryLevel() {
    const nextLevel = this.currentMemoryLevel + 1;
    if (window.levelProgressionSystem && !window.levelProgressionSystem.canAccessLevel('english_memory', nextLevel)) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openGamePaywallModal('english_memory', nextLevel);
      }
      return;
    }

    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    this.currentMemoryLevel = nextLevel;
    this.initMemoryGame(nextLevel);
  }

  openMemoryMap() {
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.openMapModal(
        'english_memory',
        this.getLang() === 'ru' ? 'Карточки памяти (Memory Match)' : 'Sehrli Kartalar (Memory Match)',
        (lvl) => {
          this.initMemoryGame(lvl);
        }
      );
    }
  }

  updateMemoryStatsUI() {
    const movesEl = document.getElementById('memory-moves-display');
    const timerEl = document.getElementById('memory-timer-display');
    if (movesEl) movesEl.textContent = this.memoryMoves;
    if (timerEl) timerEl.textContent = `${this.memoryTimer}s`;
  }
}

window.miniGamesManager = new MiniGamesManager();
