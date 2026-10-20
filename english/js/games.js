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

    // Word Builder (So'z Yig'uvchi) State
    this.currentBuilderLevel = 1;
    this.builderScore = 0;
    this.builderWordsCompleted = 0;
    this.targetBuilderWords = 3;
    this.builderErrors = 0;
    this.currentWordObj = null;
    this.scrambledLetters = [];
    this.userPlacedLetters = [];
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

  updateBalloonHintForLang() {
    if (!this.balloonTarget) return;
    const targetHintEl = document.getElementById('balloon-target-hint');
    const isRu = this.getLang() === 'ru';
    if (targetHintEl) {
      targetHintEl.textContent = isRu 
        ? `Значение: ${this.balloonTarget.russian} (${this.balloonTarget.uzbek}) • Цель: ${this.balloonPopsCount}/${this.targetPopsToWin}` 
        : `Ma’nosi: ${this.balloonTarget.uzbek} (${this.balloonTarget.russian}) • Maqsad: ${this.balloonPopsCount}/${this.targetPopsToWin}`;
    }
    const startBtn = document.getElementById('balloon-start-btn');
    if (startBtn) {
      if (this.balloonGameActive) {
        startBtn.textContent = isRu ? '⏸️ Приостановить' : '⏸️ O‘yinni to‘xtatish / Pause';
      } else {
        startBtn.textContent = isRu ? '▶️ Начать игру / Start Game' : '▶️ O‘yinni boshlash / Start Game';
      }
    }
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

    // Always play tactile pop sound
    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }

    if (balloonData.isTarget) {
      // Correct balloon popped!
      this.balloonScore += 10;
      this.balloonPopsCount++;

      if (window.soundEngine && typeof window.soundEngine.playDing === 'function') {
        window.soundEngine.playDing();
      } else if (window.soundEngine && typeof window.soundEngine.playSuccess === 'function') {
        window.soundEngine.playSuccess();
      }

      window.appState.addStars(1);

      if (window.gamificationHub) {
        window.gamificationHub.addXP(10, 'English Balloon Pop');
      }
      if (window.ScreenVFX && typeof window.ScreenVFX.floatingXP === 'function') {
        window.ScreenVFX.floatingXP(rect.left + rect.width / 2, Math.max(70, rect.top), '+10 XP');
      }

      this.updateBalloonScoreUI();

      if (this.balloonPopsCount >= this.targetPopsToWin) {
        this.handleBalloonWin();
        return;
      }

      this.pickNewBalloonTarget();
    } else {
      // Wrong balloon popped
      this.balloonErrors++;
      if (window.soundEngine && typeof window.soundEngine.playWrong === 'function') {
        window.soundEngine.playWrong();
      } else if (window.soundEngine && typeof window.soundEngine.playError === 'function') {
        window.soundEngine.playError();
      }
      this.balloonScore = Math.max(0, this.balloonScore - 2);
      this.updateBalloonScoreUI();
    }
  }

  handleBalloonWin() {
    this.stopBalloonGame();
    if (window.soundEngine && typeof window.soundEngine.playFanfare === 'function') {
      window.soundEngine.playFanfare();
    }
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);

    // Calculate stars
    const stars = this.balloonErrors === 0 ? 3 : (this.balloonErrors <= 2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('english_balloon', this.currentBalloonLevel, stars);
    }

    const earnedXP = stars * 15 + 20;
    if (window.gamificationHub) {
      window.gamificationHub.addXP(earnedXP, 'Balloon Pop Level Complete');
    }
    if (window.ScreenVFX && typeof window.ScreenVFX.floatingXP === 'function') {
      window.ScreenVFX.floatingXP(window.innerWidth / 2, window.innerHeight / 2 - 40, `+${earnedXP} XP`);
    }

    window.appState.unlockBadge('balloon-popper');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu 
      ? `🎉 Уровень ${this.currentBalloonLevel} пройден!` 
      : `🎉 ${this.currentBalloonLevel}-Bosqich Yakunlandi!`;
    const stats = isRu 
      ? `Очки: <strong>${this.balloonScore}</strong> | Ошибок: <strong>${this.balloonErrors}</strong> | Награда: <strong>+${earnedXP} XP</strong>` 
      : `To‘plangan ball: <strong>${this.balloonScore}</strong> | Xatolar: <strong>${this.balloonErrors} ta</strong> | Mukofot: <strong>+${earnedXP} XP</strong>`;

    const nextLevel = this.currentBalloonLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const isLevelLocked = !isPro && nextLevel > 10;
    const nextBtnText = isRu 
      ? `🚀 Уровень ${nextLevel} ${isLevelLocked ? '• 👑 PRO' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${isLevelLocked ? '• 👑 PRO' : ''}`;

    const winBanner = document.getElementById('balloon-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars" style="font-size: 2.3rem; margin-bottom: 6px;">${starsStr}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--primary);">${title}</h3>
        <p style="font-size: 1.05rem; margin-bottom: 14px;">${stats}</p>
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
    if (window.soundEngine && typeof window.soundEngine.playFanfare === 'function') {
      window.soundEngine.playFanfare();
    }
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);

    // Calculate stars
    const stars = this.memoryMoves <= this.pairsToMatch * 2.2 ? 3 : (this.memoryMoves <= this.pairsToMatch * 3.2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('english_memory', this.currentMemoryLevel, stars);
    }

    const earnedXP = stars * 15 + 20;
    if (window.gamificationHub) {
      window.gamificationHub.addXP(earnedXP, 'Memory Match Level Complete');
    }
    if (window.ScreenVFX && typeof window.ScreenVFX.floatingXP === 'function') {
      window.ScreenVFX.floatingXP(window.innerWidth / 2, window.innerHeight / 2 - 40, `+${earnedXP} XP`);
    }

    window.appState.unlockBadge('memory-master');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu ? `🎉 Уровень ${this.currentMemoryLevel} пройден!` : `🎉 ${this.currentMemoryLevel}-Bosqich Yakunlandi!`;
    const stats = isRu 
      ? `Время: <strong>${this.memoryTimer} сек</strong> | Попыток: <strong>${this.memoryMoves}</strong> | Награда: <strong>+${earnedXP} XP</strong>` 
      : `Vaqt: <strong>${this.memoryTimer} soniya</strong> | Urinishlar: <strong>${this.memoryMoves} ta</strong> | Mukofot: <strong>+${earnedXP} XP</strong>`;

    const nextLevel = this.currentMemoryLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const isLevelLocked = !isPro && nextLevel > 10;
    const btnNext = isRu 
      ? `🚀 Уровень ${nextLevel} ${isLevelLocked ? '• 👑 Pro' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${isLevelLocked ? '• 👑 Pro' : ''}`;

    const winBanner = document.getElementById('memory-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars" style="font-size: 2.3rem; margin-bottom: 6px;">${starsStr}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--primary);">${title}</h3>
        <p style="font-size: 1.05rem; margin-bottom: 14px;">${stats}</p>
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

  // ==========================================
  // GAME 3: WORD BUILDER & SCRAMBLE (50 Levels)
  // ==========================================
  initWordBuilderGame(forcedLevel = null) {
    const container = document.getElementById('panel-wordbuilder');
    if (!container) return;

    if (forcedLevel) {
      this.currentBuilderLevel = forcedLevel;
    } else if (window.levelProgressionSystem) {
      this.currentBuilderLevel = window.levelProgressionSystem.getCurrentLevel('english_builder');
    }

    this.builderScore = 0;
    this.builderWordsCompleted = 0;
    this.targetBuilderWords = 3;
    this.builderErrors = 0;

    const winBanner = document.getElementById('builder-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    this.pickNewBuilderWord();
    this.updateBuilderStatsUI();
  }

  pickNewBuilderWord() {
    // Select vocabulary pool based on level tier
    // Levels 1-10: 3-4 letters
    // Levels 11-25: 4-6 letters
    // Levels 26-50: 5-8 letters
    let minLen = 3, maxLen = 4;
    if (this.currentBuilderLevel > 25) {
      minLen = 5; maxLen = 8;
    } else if (this.currentBuilderLevel > 10) {
      minLen = 4; maxLen = 6;
    }

    const eligible = VOCABULARY_DATA.filter(w => {
      const len = w.word.trim().length;
      return len >= minLen && len <= maxLen && !w.word.includes(' ');
    });

    const pool = eligible.length > 0 ? eligible : VOCABULARY_DATA.slice(0, 50);
    this.currentWordObj = pool[Math.floor(Math.random() * pool.length)];

    const rawLetters = this.currentWordObj.word.toUpperCase().split('');
    // Scramble letters
    let scrambled = [...rawLetters].sort(() => Math.random() - 0.5);
    if (scrambled.join('') === rawLetters.join('') && rawLetters.length > 2) {
      scrambled.reverse();
    }

    this.scrambledLetters = scrambled.map((char, index) => ({
      id: index,
      char,
      used: false
    }));

    this.userPlacedLetters = [];
    this.renderBuilderUI();

    // Pronounce the word for the child!
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(this.currentWordObj.word);
    }
  }

  renderBuilderUI() {
    if (!this.currentWordObj) return;
    const isRu = this.getLang() === 'ru';

    const wordLength = this.currentWordObj.word.length;
    const clueEmoji = document.getElementById('builder-clue-emoji');
    const clueMeaning = document.getElementById('builder-clue-meaning');
    const slotsRow = document.getElementById('builder-slots-row');
    const letterBank = document.getElementById('builder-letter-bank');
    const lvlEl = document.getElementById('builder-level-display');

    if (lvlEl) lvlEl.textContent = `${this.currentBuilderLevel}`;
    if (clueEmoji) clueEmoji.textContent = this.currentWordObj.emoji;
    if (clueMeaning) {
      clueMeaning.textContent = isRu 
        ? `${this.currentWordObj.russian} (${this.currentWordObj.uzbek}) • ${this.currentWordObj.phonetic}`
        : `${this.currentWordObj.uzbek} (${this.currentWordObj.russian}) • ${this.currentWordObj.phonetic}`;
    }

    if (slotsRow) {
      slotsRow.innerHTML = '';
      for (let i = 0; i < wordLength; i++) {
        const placed = this.userPlacedLetters[i];
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = `builder-slot ${placed ? 'filled' : 'empty'}`;
        slot.setAttribute('aria-label', placed ? `Harf: ${placed.char}` : 'Bo‘sh katak');
        slot.innerHTML = placed ? `<span class="slot-letter">${placed.char}</span>` : '<span class="slot-dash">_</span>';
        if (placed) {
          slot.onclick = () => this.undoBuilderSlot(i);
        }
        slotsRow.appendChild(slot);
      }
    }

    if (letterBank) {
      letterBank.innerHTML = this.scrambledLetters.map((item, idx) => `
        <button type="button" class="builder-tile-btn ${item.used ? 'tile-used' : ''}" 
          data-id="${item.id}"
          onclick="window.miniGamesManager.handleBuilderLetterClick(${idx})"
          ${item.used ? 'disabled' : ''}>
          ${item.char}
        </button>
      `).join('');
    }
  }

  handleBuilderLetterClick(scrambledIdx) {
    const tile = this.scrambledLetters[scrambledIdx];
    if (!tile || tile.used) return;

    if (this.userPlacedLetters.length >= this.currentWordObj.word.length) return;

    tile.used = true;
    this.userPlacedLetters.push({
      scrambledIdx,
      char: tile.char
    });

    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }
    // Speak letter
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(tile.char);
    }

    this.renderBuilderUI();

    // Check if word is complete
    if (this.userPlacedLetters.length === this.currentWordObj.word.length) {
      this.checkBuilderWord();
    }
  }

  undoBuilderSlot(slotIdx) {
    if (slotIdx >= this.userPlacedLetters.length) return;
    const removed = this.userPlacedLetters.splice(slotIdx, 1)[0];
    if (removed && this.scrambledLetters[removed.scrambledIdx]) {
      this.scrambledLetters[removed.scrambledIdx].used = false;
    }

    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }

    this.renderBuilderUI();
  }

  resetCurrentBuilderWord() {
    this.scrambledLetters.forEach(t => t.used = false);
    this.userPlacedLetters = [];
    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }
    this.renderBuilderUI();
  }

  checkBuilderWord() {
    const userWord = this.userPlacedLetters.map(p => p.char).join('');
    const targetWord = this.currentWordObj.word.toUpperCase();

    const slotsRow = document.getElementById('builder-slots-row');

    if (userWord === targetWord) {
      // CORRECT!
      this.builderScore += 15;
      this.builderWordsCompleted++;

      if (slotsRow) slotsRow.classList.add('builder-slots-success');

      if (window.soundEngine && typeof window.soundEngine.playDing === 'function') {
        window.soundEngine.playDing();
      } else if (window.soundEngine && typeof window.soundEngine.playSuccess === 'function') {
        window.soundEngine.playSuccess();
      }

      if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
        window.soundEngine.speak(this.currentWordObj.word);
      }
      window.appState.addStars(1);

      if (window.gamificationHub) {
        window.gamificationHub.addXP(15, 'Word Builder Correct');
      }
      if (window.ScreenVFX && typeof window.ScreenVFX.floatingXP === 'function') {
        const rect = slotsRow ? slotsRow.getBoundingClientRect() : { left: window.innerWidth / 2, top: 200, width: 0 };
        window.ScreenVFX.floatingXP(rect.left + rect.width / 2, Math.max(80, rect.top - 20), '+15 XP');
      }

      this.updateBuilderStatsUI();

      if (this.builderWordsCompleted >= this.targetBuilderWords) {
        setTimeout(() => this.handleBuilderWin(), 800);
      } else {
        setTimeout(() => {
          if (slotsRow) slotsRow.classList.remove('builder-slots-success');
          this.pickNewBuilderWord();
        }, 900);
      }
    } else {
      // WRONG!
      this.builderErrors++;
      if (slotsRow) slotsRow.classList.add('card-shake');
      if (window.soundEngine && typeof window.soundEngine.playWrong === 'function') {
        window.soundEngine.playWrong();
      } else if (window.soundEngine && typeof window.soundEngine.playError === 'function') {
        window.soundEngine.playError();
      }

      setTimeout(() => {
        if (slotsRow) slotsRow.classList.remove('card-shake');
        this.resetCurrentBuilderWord();
      }, 700);
    }
  }

  handleBuilderWin() {
    if (window.soundEngine && typeof window.soundEngine.playFanfare === 'function') {
      window.soundEngine.playFanfare();
    }
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);

    const stars = this.builderErrors === 0 ? 3 : (this.builderErrors <= 2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('english_builder', this.currentBuilderLevel, stars);
    }

    const earnedXP = stars * 15 + 20;
    if (window.gamificationHub) {
      window.gamificationHub.addXP(earnedXP, 'Word Builder Level Complete');
    }
    if (window.ScreenVFX && typeof window.ScreenVFX.floatingXP === 'function') {
      window.ScreenVFX.floatingXP(window.innerWidth / 2, window.innerHeight / 2 - 40, `+${earnedXP} XP`);
    }

    window.appState.unlockBadge('word-builder-star');
    window.appState.addGems(3);

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu 
      ? `🎉 Уровень ${this.currentBuilderLevel} пройден!` 
      : `🎉 ${this.currentBuilderLevel}-Bosqich Yakunlandi!`;
    const stats = isRu 
      ? `Очки: <strong>${this.builderScore}</strong> | Ошибок: <strong>${this.builderErrors}</strong> | Награда: <strong>+${earnedXP} XP</strong>` 
      : `To‘plangan ball: <strong>${this.builderScore}</strong> | Xatolar: <strong>${this.builderErrors} ta</strong> | Mukofot: <strong>+${earnedXP} XP</strong>`;

    const nextLevel = this.currentBuilderLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const isLevelLocked = !isPro && nextLevel > 10;
    const nextBtnText = isRu 
      ? `🚀 Уровень ${nextLevel} ${isLevelLocked ? '• 👑 PRO' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${isLevelLocked ? '• 👑 PRO' : ''}`;

    const winBanner = document.getElementById('builder-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="win-stars" style="font-size: 2.3rem; margin-bottom: 6px;">${starsStr}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--primary);">${title}</h3>
        <p style="font-size: 1.05rem; margin-bottom: 14px;">${stats}</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:16px;">
          <button class="btn btn-secondary" onclick="window.miniGamesManager.initWordBuilderGame(${this.currentBuilderLevel})">
            🔄 ${isRu ? 'Сыграть снова' : 'Qaytadan o‘ynash'}
          </button>
          <button class="btn btn-primary" onclick="window.miniGamesManager.tryNextBuilderLevel()">
            ${nextBtnText}
          </button>
          <button class="game-level-map-btn" onclick="window.miniGamesManager.openBuilderMap()">
            🗺️ ${isRu ? 'Карта 50+ уровней' : '50+ Bosqichlar Xaritasi'}
          </button>
        </div>
      `;
      winBanner.style.display = 'block';
    }
  }

  tryNextBuilderLevel() {
    const nextLevel = this.currentBuilderLevel + 1;
    if (window.levelProgressionSystem && !window.levelProgressionSystem.canAccessLevel('english_builder', nextLevel)) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openGamePaywallModal('english_builder', nextLevel);
      }
      return;
    }

    const winBanner = document.getElementById('builder-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    this.currentBuilderLevel = nextLevel;
    this.initWordBuilderGame(nextLevel);
  }

  openBuilderMap() {
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.openMapModal(
        'english_builder',
        this.getLang() === 'ru' ? 'Собери слово (Word Builder)' : 'So‘z Yig‘uvchi (Word Builder)',
        (lvl) => {
          this.initWordBuilderGame(lvl);
        }
      );
    }
  }

  updateBuilderStatsUI() {
    const scoreEl = document.getElementById('builder-score-display');
    const countEl = document.getElementById('builder-words-count-display');
    if (scoreEl) scoreEl.textContent = this.builderScore;
    if (countEl) countEl.textContent = `${this.builderWordsCompleted}/${this.targetBuilderWords}`;
  }
}

window.miniGamesManager = new MiniGamesManager();

