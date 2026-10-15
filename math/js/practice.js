/**
 * MathKids - Interactive Practice & Problem Generator
 * Generates dynamic math equations with configurable operations, difficulties, and modes!
 * Fully bilingual: Uzbek & Russian.
 */

class PracticeManager {
  constructor() {
    this.currentOperation = 'addition'; // 'addition', 'subtraction', 'multiplication', 'division', 'mixed'
    this.difficulty = 'easy'; // 'easy', 'medium', 'hard'
    this.mode = 'zen'; // 'zen', 'speed'
    
    // Game/Practice state
    this.currentProblem = null;
    this.score = 0;
    this.streak = 0;
    this.totalQuestionsAnswered = 0;
    this.correctAnswersCount = 0;
    
    // Timer state for speed mode
    this.timerSeconds = 60;
    this.timerInterval = null;
    this.isTimerRunning = false;

    // Keypad input
    this.userTypedAnswer = '';
    this.inputMode = 'choice'; // 'choice' or 'keypad'
  }

  getLang() {
    return window.mathApp ? window.mathApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.bindControls();
    this.generateNewProblem();
    this.renderProblemUI();
  }

  bindControls() {
    // Operation chips
    const opBtns = document.querySelectorAll('.practice-op-btn');
    opBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.mathAudio.playPop();
        opBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentOperation = btn.dataset.op;
        this.generateNewProblem();
        this.renderProblemUI();
      });
    });

    // Difficulty buttons
    const diffBtns = document.querySelectorAll('.practice-diff-btn');
    diffBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.mathAudio.playPop();
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.diff;
        this.generateNewProblem();
        this.renderProblemUI();
      });
    });

    // Mode toggle (Zen / Speed Rush)
    const modeBtns = document.querySelectorAll('.practice-mode-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.mathAudio.playPop();
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.mode = btn.dataset.mode;
        
        if (this.mode === 'speed') {
          this.startSpeedMode();
        } else {
          this.stopSpeedMode();
        }
        this.generateNewProblem();
        this.renderProblemUI();
      });
    });
  }

  generateNewProblem() {
    let op = this.currentOperation;
    if (op === 'mixed') {
      const ops = ['addition', 'subtraction', 'multiplication', 'division'];
      op = ops[Math.floor(Math.random() * ops.length)];
    }

    let a = 1;
    let b = 1;
    let symbol = '+';
    let answer = 2;

    const diff = this.difficulty;

    if (op === 'addition') {
      symbol = '+';
      if (diff === 'easy') {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
      } else if (diff === 'medium') {
        a = Math.floor(Math.random() * 25) + 5;
        b = Math.floor(Math.random() * 25) + 5;
      } else {
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
      }
      answer = a + b;
    } else if (op === 'subtraction') {
      symbol = '-';
      if (diff === 'easy') {
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
      } else if (diff === 'medium') {
        a = Math.floor(Math.random() * 40) + 10;
        b = Math.floor(Math.random() * (a - 5)) + 2;
      } else {
        a = Math.floor(Math.random() * 80) + 20;
        b = Math.floor(Math.random() * (a - 10)) + 5;
      }
      answer = a - b;
    } else if (op === 'multiplication') {
      symbol = '×';
      if (diff === 'easy') {
        a = Math.floor(Math.random() * 5) + 1;
        b = Math.floor(Math.random() * 5) + 1;
      } else if (diff === 'medium') {
        a = Math.floor(Math.random() * 8) + 2;
        b = Math.floor(Math.random() * 8) + 2;
      } else {
        a = Math.floor(Math.random() * 11) + 2;
        b = Math.floor(Math.random() * 10) + 2;
      }
      answer = a * b;
    } else if (op === 'division') {
      symbol = '÷';
      if (diff === 'easy') {
        b = Math.floor(Math.random() * 4) + 2;
        answer = Math.floor(Math.random() * 5) + 1;
      } else if (diff === 'medium') {
        b = Math.floor(Math.random() * 6) + 2;
        answer = Math.floor(Math.random() * 8) + 2;
      } else {
        b = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 11) + 2;
      }
      a = b * answer;
    }

    // Generate 3 alternate choices
    const choices = new Set([answer]);
    while (choices.size < 4) {
      let offset = Math.floor(Math.random() * 7) - 3;
      if (offset === 0) offset = Math.random() > 0.5 ? 1 : -1;
      const fake = Math.max(0, answer + offset);
      choices.add(fake);
    }

    this.currentProblem = {
      a,
      b,
      symbol,
      answer,
      op,
      choices: [...choices].sort(() => Math.random() - 0.5)
    };
  }

  renderProblemUI() {
    const container = document.getElementById('practice-problem-arena');
    if (!container || !this.currentProblem) return;

    const p = this.currentProblem;
    const isRu = this.getLang() === 'ru';

    const streakLabel = isRu ? '🔥 Серия:' : '🔥 Seriya:';
    const scoreLabel = isRu ? '⭐ Очки:' : '⭐ Ball:';
    const hintBtnText = isRu ? '💡 Наглядная подсказка / Visual Hint' : '💡 Ko‘rgazmali yordam / Visual Hint';

    container.innerHTML = `
      <div class="practice-card bounce-in">
        <div class="practice-hud-row">
          <div class="score-pill">${scoreLabel} <strong>${this.score}</strong></div>
          <div class="streak-pill">${streakLabel} <strong>${this.streak}</strong></div>
          ${this.mode === 'speed' ? `
            <div class="timer-pill ${this.timerSeconds <= 10 ? 'timer-hurry' : ''}">
              ⏱️ <strong>${this.timerSeconds}s</strong>
            </div>
          ` : ''}
        </div>

        <div class="math-equation-display">
          <span class="num-bubble num-a">${p.a}</span>
          <span class="symbol-bubble">${p.symbol}</span>
          <span class="num-bubble num-b">${p.b}</span>
          <span class="symbol-bubble">=</span>
          <span class="num-bubble num-question" id="target-answer-slot">?</span>
        </div>

        <!-- Visual Hint Accordion Button -->
        <div class="visual-hint-toggle">
          <button class="hint-btn" onclick="window.practiceManager.toggleVisualHint()">
            ${hintBtnText}
          </button>
          <div class="hint-content" id="practice-hint-box" style="display: none;">
            ${this.renderProblemHint(p)}
          </div>
        </div>

        <!-- Choice Buttons (Large Tap Friendly) -->
        <div class="choices-grid">
          ${p.choices.map(choice => `
            <button class="choice-bubble-btn" onclick="window.practiceManager.submitAnswer(${choice}, this)">
              ${choice}
            </button>
          `).join('')}
        </div>

        <div class="practice-feedback" id="practice-feedback" style="display: none;"></div>
      </div>
    `;
  }

  renderProblemHint(p) {
    const isRu = this.getLang() === 'ru';
    if (p.symbol === '+') {
      let dotsA = '🍎'.repeat(Math.min(15, p.a));
      let dotsB = '🍏'.repeat(Math.min(15, p.b));
      const text = isRu
        ? `Посчитай вместе 🍎 (${p.a} шт) и 🍏 (${p.b} шт) яблок!`
        : `🍎 (${p.a} ta) va 🍏 (${p.b} ta) olmalarni birga qo‘shib sanang!`;
      return `<p>${text}</p><div class="hint-icons">${dotsA} + ${dotsB}</div>`;
    }
    if (p.symbol === '-') {
      let dots = '🍕'.repeat(Math.min(15, p.a));
      const text = isRu
        ? `Из общего числа ${p.a} пицц съели ${p.b}. Посчитай оставшиеся!`
        : `Jami ${p.a} ta pitsadan ${p.b} tasini yeb qo‘ysak, qolganini sanang!`;
      return `<p>${text}</p><div class="hint-icons">${dots}</div>`;
    }
    if (p.symbol === '×') {
      const text = isRu
        ? `Представь ${p.a} ряда, и в каждом по ${p.b} звездочек!`
        : `${p.a} ta qatorda ${p.b} tadan yulduzcha bor deb tasavvur qiling!`;
      return `<p>${text}</p>`;
    }
    if (p.symbol === '÷') {
      const text = isRu
        ? `Раздели ${p.a} конфет поровну между ${p.b} друзьями!`
        : `${p.a} ta konfetni ${p.b} ta do‘stingizga bittadan tarqatib chiqing!`;
      return `<p>${text}</p>`;
    }
    return '';
  }

  toggleVisualHint() {
    window.mathAudio.playPop();
    const box = document.getElementById('practice-hint-box');
    if (box) {
      box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }
  }

  submitAnswer(selectedAnswer, buttonEl) {
    if (!this.currentProblem) return;

    const p = this.currentProblem;
    const isCorrect = selectedAnswer === p.answer;
    const feedbackBox = document.getElementById('practice-feedback');
    const answerSlot = document.getElementById('target-answer-slot');
    const isRu = this.getLang() === 'ru';

    if (answerSlot) answerSlot.textContent = selectedAnswer;

    const buttons = document.querySelectorAll('.choice-bubble-btn');
    buttons.forEach(b => b.disabled = true);

    if (isCorrect) {
      if (buttonEl) buttonEl.classList.add('correct');
      window.mathAudio.playCorrect();
      if (window.mathConfetti) window.mathConfetti.launch(40, 0.5, 0.6);

      this.streak++;
      const points = 10 + (this.streak > 2 ? 5 : 0);
      this.score += points;
      this.correctAnswersCount++;
      window.mathApp.addStars(1);

      if (window.gamificationHub) {
        window.gamificationHub.addXP(points, 'math');
        window.gamificationHub.addStars(1);
        window.gamificationHub.recordActivity('math', true);
      }
      if (window.astroCat) {
        window.astroCat.cheer('correct');
      }

      if (this.streak >= 5) {
        window.mathApp.unlockBadge('streak-math');
      }

      if (feedbackBox) {
        feedbackBox.className = 'practice-feedback success-feedback bounce-in';
        const msg = isRu
          ? `🎉 Молодец! Правильный ответ: <strong>${p.answer}</strong> (+${points} очков)`
          : `🎉 Barakalla! To‘g‘ri javob: <strong>${p.answer}</strong> (+${points} ball)`;
        feedbackBox.innerHTML = msg;
        feedbackBox.style.display = 'block';
      }

      setTimeout(() => {
        this.generateNewProblem();
        this.renderProblemUI();
      }, 1200);
    } else {
      if (buttonEl) buttonEl.classList.add('incorrect');
      // Highlight the correct one
      buttons.forEach(b => {
        if (parseInt(b.textContent.trim(), 10) === p.answer) {
          b.classList.add('correct');
        }
      });

      window.mathAudio.playWrong();
      this.streak = 0;

      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('math', false);
      }
      if (window.astroCat) {
        window.astroCat.cheer('tryAgain');
      }

      if (feedbackBox) {
        feedbackBox.className = 'practice-feedback error-feedback shake-anim';
        const msg = isRu
          ? `💡 Попробуй еще раз! Правильный ответ был: <strong>${p.answer}</strong>.`
          : `💡 Qayta urinib ko‘ring! To‘g‘ri javob: <strong>${p.answer}</strong> edi.`;
        feedbackBox.innerHTML = msg;
        feedbackBox.style.display = 'block';
      }

      setTimeout(() => {
        this.generateNewProblem();
        this.renderProblemUI();
      }, 1800);
    }
  }

  startSpeedMode() {
    this.stopSpeedMode();
    this.timerSeconds = 60;
    this.isTimerRunning = true;

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      const timerEl = document.querySelector('.timer-pill');
      if (timerEl) {
        timerEl.innerHTML = `⏱️ <strong>${this.timerSeconds}s</strong>`;
        if (this.timerSeconds <= 10) timerEl.classList.add('timer-hurry');
      }

      if (this.timerSeconds <= 0) {
        this.stopSpeedMode();
        this.handleSpeedTimeUp();
      }
    }, 1000);
  }

  stopSpeedMode() {
    this.isTimerRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  handleSpeedTimeUp() {
    window.mathAudio.playFanfare();
    if (window.mathConfetti) window.mathConfetti.launch(80, 0.5, 0.5);

    const container = document.getElementById('practice-problem-arena');
    if (!container) return;

    const isRu = this.getLang() === 'ru';
    const title = isRu ? "Время вышло! / Time's Up!" : "Vaqt tugadi! / Time's Up!";
    const scoreText = isRu ? "Набрано очков за 60 секунд:" : "60 soniya ichida to‘plangan ball:";
    const pts = isRu ? "Очков" : "Ball";
    const solved = isRu ? `Решено примеров: <strong>${this.correctAnswersCount} шт</strong>` : `To‘g‘ri topilgan misollar: <strong>${this.correctAnswersCount} ta</strong>`;
    const retryBtn = isRu ? "🔄 Сыграть снова / Try Again" : "🔄 Qaytadan poyga / Try Again";

    container.innerHTML = `
      <div class="practice-card speed-results-card bounce-in">
        <div class="results-trophy">⚡</div>
        <h2>${title}</h2>
        <p>${scoreText}</p>
        <div class="big-score-badge">⭐ ${this.score} ${pts}</div>
        <p>${solved}</p>
        <button class="btn btn-primary" onclick="window.practiceManager.startSpeedMode(); window.practiceManager.generateNewProblem(); window.practiceManager.renderProblemUI();">
          ${retryBtn}
        </button>
      </div>
    `;

    if (this.correctAnswersCount >= 10) {
      window.mathApp.unlockBadge('speed-demon');
    }
  }
}

window.practiceManager = new PracticeManager();
