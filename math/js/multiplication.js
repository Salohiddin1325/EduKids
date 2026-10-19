/**
 * MathKids - Interactive Multiplication Table (Karra Jadvali) Module
 * 
 * Features:
 * 1. Visual Multiplication Grid (1x1 up to 10x10 and 12x12) with rainbow aesthetics
 * 2. Learning Mode:
 *    - Click any block (e.g. 7 x 8) to reveal 56
 *    - Visual object counters (7 groups of 8 apples, stars, candies, or rockets)
 *    - Repeated addition formula: 7 x 8 = 8 + 8 + 8 + 8 + 8 + 8 + 8 = 56
 *    - Web Speech API multilingual voiceover (Uzbek, Russian, English) with turtle mode
 * 3. Speed Drill / Quiz Mode:
 *    - 60-second timer challenge, instant feedback, combo streak, stars & XP rewards
 * 4. Free vs Pro Plan enforcement:
 *    - Free: 1x1 to 5x5 unlocked
 *    - Pro: 1x1 to 12x12 + unlimited Speed Drills unlocked
 */

class InteractiveMultiplicationTable {
  constructor() {
    this.maxSize = 10; // 10 or 12
    this.selectedRow = 7;
    this.selectedCol = 8;
    this.selectedTheme = 'apple'; // 'apple', 'star', 'candy', 'rocket'
    this.isTurtleAudio = false;

    // Drill / Quiz State
    this.drillActive = false;
    this.drillTimer = 60;
    this.drillTimerId = null;
    this.drillScore = 0;
    this.drillCombo = 1;
    this.currentDrillProblem = null;
  }

  getLang() {
    return window.mathApp ? window.mathApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  isPro() {
    return window.subscriptionManager && window.subscriptionManager.isPro();
  }

  init() {
    const container = document.getElementById('multiplication-container');
    if (!container) return;

    this.renderMainUI(container);
  }

  renderMainUI(container) {
    const isRu = this.getLang() === 'ru';
    const isPro = this.isPro();

    container.innerHTML = `
      <div class="mult-hub-wrapper">
        <!-- Top Controls Strip -->
        <div class="mult-controls-bar">
          <div class="mult-size-toggle">
            <span class="control-label">${isRu ? 'Размер сетки:' : 'Jadval o‘lchami:'}</span>
            <div class="size-pill-group">
              <button class="size-btn ${this.maxSize === 10 ? 'active' : ''}" id="btn-grid-10" onclick="window.mathMultiplication.setSize(10)">
                10 × 10
              </button>
              <button class="size-btn ${this.maxSize === 12 ? 'active' : ''}" id="btn-grid-12" onclick="window.mathMultiplication.setSize(12)">
                12 × 12
                ${!isPro ? '<span class="pro-tag-mini">👑 Pro</span>' : ''}
              </button>
            </div>
          </div>

          <div class="mult-mode-toggle">
            <button class="mult-mode-btn ${!this.drillActive ? 'active' : ''}" id="btn-mode-learn" onclick="window.mathMultiplication.switchMode('learn')">
              <span>🍎</span>
              <span>${isRu ? 'Режим Обучения' : 'O‘rganish Rejimi'}</span>
            </button>
            <button class="mult-mode-btn ${this.drillActive ? 'active' : ''}" id="btn-mode-drill" onclick="window.mathMultiplication.switchMode('drill')">
              <span>⚡</span>
              <span>${isRu ? 'Скоростная Гонка (Drill)' : 'Tezkor Poyga (Drill)'}</span>
              ${!isPro ? '<span class="pro-tag-mini">👑 Pro</span>' : ''}
            </button>
          </div>
        </div>

        <!-- Mode 1: Learning View -->
        <div id="mult-learn-view" class="mult-view-panel ${!this.drillActive ? 'active' : ''}">
          <div class="mult-workspace-grid">
            <!-- Left: Interactive Table Grid -->
            <div class="mult-grid-card">
              <div class="mult-grid-header-info">
                <h4>${isRu ? 'Нажмите на любую ячейку:' : 'Istalgan katakchani bosing:'}</h4>
                <div class="mult-grid-legend">
                  <span class="legend-chip free-chip">🟢 ${isRu ? '1×1..5×5 Бесплатно' : '1×1..5×5 Bepul'}</span>
                  <span class="legend-chip pro-chip">👑 ${isRu ? '6×6..12×12 Pro' : '6×6..12×12 Pro'}</span>
                </div>
              </div>

              <div class="mult-table-scroll">
                <table class="mult-matrix-table" id="mult-matrix-table">
                  ${this.renderTableMatrixHTML()}
                </table>
              </div>
            </div>

            <!-- Right: Visual Counter & Explanation Inspector -->
            <div class="mult-inspector-card" id="mult-inspector-card">
              ${this.renderInspectorHTML()}
            </div>
          </div>
        </div>

        <!-- Mode 2: Speed Drill / Quiz View -->
        <div id="mult-drill-view" class="mult-view-panel ${this.drillActive ? 'active' : ''}">
          <div class="mult-drill-arena" id="mult-drill-arena">
            ${this.renderDrillArenaHTML()}
          </div>
        </div>
      </div>
    `;

    this.bindGridEvents();
  }

  setSize(size) {
    if (size === 12 && !this.isPro()) {
      window.subscriptionManager.openMultiplicationPaywallModal(12, 12);
      return;
    }
    this.maxSize = size;
    const container = document.getElementById('multiplication-container');
    if (container) this.renderMainUI(container);
  }

  switchMode(mode) {
    if (mode === 'drill') {
      if (!this.isPro() && !window.subscriptionManager.canAccessMultiplicationQuiz()) {
        return;
      }
      this.drillActive = true;
      this.startDrill();
    } else {
      this.drillActive = false;
      this.stopDrillTimer();
    }
    const container = document.getElementById('multiplication-container');
    if (container) this.renderMainUI(container);
  }

  setTheme(theme) {
    this.selectedTheme = theme;
    const inspector = document.getElementById('mult-inspector-card');
    if (inspector) inspector.innerHTML = this.renderInspectorHTML();
  }

  toggleTurtleAudio() {
    this.isTurtleAudio = !this.isTurtleAudio;
    const btn = document.getElementById('btn-turtle-mult');
    if (btn) btn.classList.toggle('active', this.isTurtleAudio);
  }

  // -------------------------------------------------------------
  // MATRIX RENDERING & SELECTION
  // -------------------------------------------------------------
  renderTableMatrixHTML() {
    const isPro = this.isPro();
    const N = this.maxSize;
    let html = '<thead><tr><th class="cell-corner">✖️</th>';

    // Top Column Headers (1 to N)
    for (let c = 1; c <= N; c++) {
      const isColSel = c === this.selectedCol;
      html += `<th class="header-col ${isColSel ? 'col-highlight' : ''}" data-col="${c}">${c}</th>`;
    }
    html += '</tr></thead><tbody>';

    // Rows (1 to N)
    for (let r = 1; r <= N; r++) {
      const isRowSel = r === this.selectedRow;
      html += `<tr><th class="header-row ${isRowSel ? 'row-highlight' : ''}" data-row="${r}">${r}</th>`;

      for (let c = 1; c <= N; c++) {
        const val = r * c;
        const isFree = (r <= 5 && c <= 5);
        const isLocked = !isPro && !isFree;
        const isSelected = (r === this.selectedRow && c === this.selectedCol);
        const inRowCol = (r === this.selectedRow || c === this.selectedCol);

        let cellClass = 'matrix-cell';
        if (isSelected) cellClass += ' cell-selected';
        else if (inRowCol) cellClass += ' cell-path';
        if (isLocked) cellClass += ' cell-locked';
        if (r === c) cellClass += ' cell-square'; // 1x1, 2x2, 3x3 square numbers!

        html += `
          <td class="${cellClass}" data-row="${r}" data-col="${c}" title="${r} × ${c} = ${val}">
            <span class="cell-val">${val}</span>
            ${isLocked ? '<span class="cell-lock-icon">🔒</span>' : ''}
          </td>
        `;
      }
      html += '</tr>';
    }
    html += '</tbody>';
    return html;
  }

  bindGridEvents() {
    const table = document.getElementById('mult-matrix-table');
    if (!table) return;

    const cells = table.querySelectorAll('.matrix-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const r = parseInt(cell.getAttribute('data-row'), 10);
        const c = parseInt(cell.getAttribute('data-col'), 10);
        this.selectCell(r, c);
      });
    });
  }

  selectCell(r, c) {
    const isFree = (r <= 5 && c <= 5);
    if (!this.isPro() && !isFree) {
      window.subscriptionManager.openMultiplicationPaywallModal(r, c);
      return;
    }

    this.selectedRow = r;
    this.selectedCol = c;

    // Refresh table selection
    const table = document.getElementById('mult-matrix-table');
    if (table) {
      table.innerHTML = this.renderTableMatrixHTML();
      this.bindGridEvents();
    }

    // Refresh inspector
    const inspector = document.getElementById('mult-inspector-card');
    if (inspector) {
      inspector.innerHTML = this.renderInspectorHTML();
    }

    // Play subtle click sound and speak
    if (window.mathAudio && typeof window.mathAudio.playPop === 'function') {
      window.mathAudio.playPop();
    }
    this.speakEquation(r, c, r * c);
  }

  // -------------------------------------------------------------
  // VISUAL COUNTER & INSPECTOR
  // -------------------------------------------------------------
  renderInspectorHTML() {
    const r = this.selectedRow;
    const c = this.selectedCol;
    const ans = r * c;
    const isRu = this.getLang() === 'ru';

    // Theme icons
    const themeIcons = {
      apple: '🍎',
      star: '⭐',
      candy: '🍬',
      rocket: '🚀'
    };
    const activeIcon = themeIcons[this.selectedTheme] || '🍎';

    // Repeated addition string: "8 + 8 + 8 + 8 + 8 + 8 + 8 = 56"
    const repeatedAddition = Array(r).fill(c).join(' + ') + ` = ${ans}`;

    // Groups rendering
    let groupsHTML = '';
    for (let i = 1; i <= r; i++) {
      let itemsHTML = '';
      for (let j = 1; j <= c; j++) {
        itemsHTML += `<span class="obj-item-icon" style="animation-delay: ${(i * c + j) * 15}ms;">${activeIcon}</span>`;
      }
      groupsHTML += `
        <div class="obj-group-basket">
          <span class="basket-badge">${i}-guruh</span>
          <div class="basket-items-wrap">${itemsHTML}</div>
          <span class="basket-count">${c}</span>
        </div>
      `;
    }

    return `
      <div class="inspector-content">
        <!-- Big Equation Card -->
        <div class="equation-hero-badge">
          <div class="equation-main-formula">
            <span class="eq-num">${r}</span>
            <span class="eq-op">×</span>
            <span class="eq-num">${c}</span>
            <span class="eq-equal">=</span>
            <span class="eq-result">${ans}</span>
          </div>

          <div class="equation-voice-controls">
            <button class="btn-voice-speak" onclick="window.mathMultiplication.speakEquation(${r}, ${c}, ${ans})" title="Ovozli eshitish">
              <span>🔊</span> <span>${isRu ? 'Слушать' : 'Eshitish'}</span>
            </button>
            <button class="btn-turtle-speed ${this.isTurtleAudio ? 'active' : ''}" id="btn-turtle-mult" onclick="window.mathMultiplication.toggleTurtleAudio()" title="Sekinroq talaffuz">
              <span>🐢</span> <span>${isRu ? 'Медленно' : 'Toshbaqa'}</span>
            </button>
          </div>
        </div>

        <!-- Repeated Addition Explanation -->
        <div class="repeated-addition-box">
          <div class="add-box-title">
            <span>💡</span>
            <strong>${isRu ? 'Смысл умножения (повторное сложение):' : 'Ko‘paytirish ma’nosi (ketma-ket qo‘shish):'}</strong>
          </div>
          <div class="add-formula-text">${r} × ${c} = ${repeatedAddition}</div>
          <p class="add-formula-sub">
            ${isRu 
              ? `Мы берем число <strong>${c}</strong> ровно <strong>${r}</strong> раз(а) и складываем!` 
              : `Biz <strong>${c}</strong> sonini roppa-rosa <strong>${r}</strong> marta olib bir-biriga qo‘shdik!`}
          </p>
        </div>

        <!-- Visual Counter Header & Theme Selector -->
        <div class="counter-header-row">
          <div class="counter-label">
            <span>🧺</span>
            <strong>${isRu ? 'Наглядный счёт предметов:' : 'Vizual hisoblagich savatchalari:'}</strong>
          </div>

          <div class="theme-selector-strip">
            <button class="theme-chip-btn ${this.selectedTheme === 'apple' ? 'active' : ''}" onclick="window.mathMultiplication.setTheme('apple')">🍎</button>
            <button class="theme-chip-btn ${this.selectedTheme === 'star' ? 'active' : ''}" onclick="window.mathMultiplication.setTheme('star')">⭐</button>
            <button class="theme-chip-btn ${this.selectedTheme === 'candy' ? 'active' : ''}" onclick="window.mathMultiplication.setTheme('candy')">🍬</button>
            <button class="theme-chip-btn ${this.selectedTheme === 'rocket' ? 'active' : ''}" onclick="window.mathMultiplication.setTheme('rocket')">🚀</button>
          </div>
        </div>

        <!-- Baskets Grid of Objects -->
        <div class="obj-baskets-scroll">
          <div class="obj-baskets-grid">
            ${groupsHTML}
          </div>
        </div>

        <div class="counter-summary-pill">
          <span>🌟</span>
          <span>${r} × ${c} = <strong>${ans}</strong> ${isRu ? 'предметов всего!' : 'ta jami narsalar!'}</span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // AUDIO PRONUNCIATION (Uzbek, Russian, English)
  // -------------------------------------------------------------
  speakEquation(r, c, ans) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const lang = this.getLang();
    const rate = this.isTurtleAudio ? 0.65 : 0.95;

    if (lang === 'uz' || !lang) {
      if (window.uzbekSpeech) {
        window.uzbekSpeech.speakEquation(r, c, ans, this.isTurtleAudio);
        return;
      }
    }

    let text = '';
    let voiceLang = 'en-US';

    if (lang === 'ru') {
      text = `${r} умножить на ${c} — будет ${ans}!`;
      voiceLang = 'ru-RU';
    } else if (lang === 'en') {
      text = `${r} times ${c} is ${ans}!`;
      voiceLang = 'en-US';
    } else {
      text = `${r} karra ${c} — ${ans}!`;
      voiceLang = 'tr-TR';
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.1;

    // Pick best available voice matching requested language
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(voiceLang.slice(0, 2)));
      if (match) utterance.voice = match;
    }

    window.speechSynthesis.speak(utterance);
  }

  // -------------------------------------------------------------
  // SPEED DRILL / QUIZ MODE
  // -------------------------------------------------------------
  startDrill() {
    this.drillTimer = 60;
    this.drillScore = 0;
    this.drillCombo = 1;
    this.nextDrillProblem();
    this.stopDrillTimer();

    this.drillTimerId = setInterval(() => {
      this.drillTimer -= 1;
      const timerEl = document.getElementById('drill-timer-display');
      if (timerEl) {
        timerEl.textContent = `${this.drillTimer}s`;
        if (this.drillTimer <= 10) {
          timerEl.style.color = '#EF4444';
          timerEl.classList.add('pulse-hurry');
        }
      }

      if (this.drillTimer <= 0) {
        this.endDrill();
      }
    }, 1000);
  }

  stopDrillTimer() {
    if (this.drillTimerId) {
      clearInterval(this.drillTimerId);
      this.drillTimerId = null;
    }
  }

  nextDrillProblem() {
    const isPro = this.isPro();
    const max = isPro ? 12 : 5;
    const r = Math.floor(Math.random() * max) + 1;
    const c = Math.floor(Math.random() * max) + 1;
    const ans = r * c;

    // Generate 3 clever distractors
    const choices = new Set([ans]);
    while (choices.size < 4) {
      const delta = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? r : c);
      const wrong = ans + delta;
      if (wrong > 0 && wrong !== ans) {
        choices.add(wrong);
      } else {
        choices.add(Math.floor(Math.random() * (max * max)) + 1);
      }
    }

    const options = Array.from(choices).sort(() => Math.random() - 0.5);
    this.currentDrillProblem = { r, c, ans, options };

    const arena = document.getElementById('mult-drill-arena');
    if (arena) arena.innerHTML = this.renderDrillArenaHTML();
  }

  handleDrillAnswer(selectedAnswer, btnElement) {
    if (!this.currentDrillProblem) return;

    const correct = selectedAnswer === this.currentDrillProblem.ans;
    const isRu = this.getLang() === 'ru';

    if (correct) {
      this.drillScore += 10 * this.drillCombo;
      this.drillCombo = Math.min(this.drillCombo + 1, 5);

      if (btnElement) {
        btnElement.classList.add('drill-correct');
      }

      if (window.mathAudio && typeof window.mathAudio.playDing === 'function') {
        window.mathAudio.playDing();
      }

      // Add stars
      if (window.gamificationHub) {
        window.gamificationHub.addStars(1);
        window.gamificationHub.addXP(5);
      }

      setTimeout(() => this.nextDrillProblem(), 450);
    } else {
      this.drillCombo = 1;
      if (btnElement) {
        btnElement.classList.add('drill-wrong');
      }
      if (window.mathAudio && typeof window.mathAudio.playBuzzer === 'function') {
        window.mathAudio.playBuzzer();
      }
      setTimeout(() => this.nextDrillProblem(), 650);
    }
  }

  endDrill() {
    this.stopDrillTimer();
    const arena = document.getElementById('mult-drill-arena');
    if (!arena) return;

    const isRu = this.getLang() === 'ru';
    const finalScore = this.drillScore;
    const starsWon = Math.max(5, Math.floor(finalScore / 10));

    if (window.gamificationHub) {
      window.gamificationHub.addStars(starsWon);
      window.gamificationHub.addXP(starsWon * 4, 'Karra Jadvali Poygasi');
    }

    if (window.confetti) {
      window.confetti();
    }

    arena.innerHTML = `
      <div class="drill-results-card">
        <span class="results-trophy-icon">🏆</span>
        <h3>${isRu ? 'Время Вышло! Отличный результат!' : 'Vaqt Tugadi! Ajoyib Natija!'}</h3>
        <p>${isRu ? 'Ты настоящий мастер таблицы умножения!' : 'Siz haqiqiy karra jadvali bilimdonisiz!'}</p>

        <div class="results-stats-row">
          <div class="res-stat-pill">
            <span>⭐ ${isRu ? 'Очки:' : 'Ball:'}</span>
            <strong>${finalScore}</strong>
          </div>
          <div class="res-stat-pill">
            <span>🎁 ${isRu ? 'Награда:' : 'Yutuq:'}</span>
            <strong>+${starsWon} ${isRu ? 'звёзд' : 'yulduz'}</strong>
          </div>
        </div>

        <div class="results-actions">
          <button class="btn btn-primary" onclick="window.mathMultiplication.startDrill()">
            <span>🔄</span> <span>${isRu ? 'Играть снова' : 'Yana o‘ynash'}</span>
          </button>
          <button class="btn btn-ctrl" onclick="window.mathMultiplication.switchMode('learn')">
            <span>🍎</span> <span>${isRu ? 'К таблице' : 'Jadvalga qaytish'}</span>
          </button>
        </div>
      </div>
    `;
  }

  renderDrillArenaHTML() {
    const isRu = this.getLang() === 'ru';
    const prob = this.currentDrillProblem;
    if (!prob) return '';

    return `
      <div class="drill-play-card">
        <div class="drill-hud-strip">
          <div class="drill-hud-pill hud-timer">
            <span>⏱️</span>
            <strong id="drill-timer-display">${this.drillTimer}s</strong>
          </div>

          <div class="drill-hud-pill hud-score">
            <span>⭐ ${isRu ? 'Очки:' : 'Ball:'}</span>
            <strong>${this.drillScore}</strong>
          </div>

          <div class="drill-hud-pill hud-combo">
            <span>🔥 Combo:</span>
            <strong style="color: #FF5E13;">x${this.drillCombo}</strong>
          </div>
        </div>

        <div class="drill-problem-hero">
          <span class="drill-math-badge">${isRu ? 'Сколько будет?' : 'Natija nechchi?'}</span>
          <div class="drill-equation-text">
            ${prob.r} × ${prob.c} = ?
          </div>
        </div>

        <div class="drill-options-grid">
          ${prob.options.map(opt => `
            <button class="drill-opt-btn" onclick="window.mathMultiplication.handleDrillAnswer(${opt}, this)">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Instantiate globally
window.mathMultiplication = new InteractiveMultiplicationTable();
