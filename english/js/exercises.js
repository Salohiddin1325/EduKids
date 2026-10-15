/**
 * KiddoLingo - Interactive Exercises Module
 * 1. Multiple-Choice Quiz
 * 2. Word Matching (Connect Pairs)
 * 3. Fill-in-the-Blank Sentences
 * Fully bilingual: Uzbek & Russian.
 */

class ExerciseManager {
  constructor() {
    this.currentQuizIdx = 0;
    this.quizScore = 0;
    this.quizQuestions = [...QUIZ_QUESTIONS];
    
    // Match game state
    this.matchPairs = [...MATCH_PAIRS_DATA];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.matchedCount = 0;

    // Fill in blank state
    this.currentBlankIdx = 0;
    this.blankQuestions = [...FILL_BLANK_DATA];
  }

  getLang() {
    return window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.renderQuiz();
    this.renderMatchGame();
    this.renderFillBlank();
  }

  // ==========================================
  // 1. MULTIPLE CHOICE QUIZ
  // ==========================================
  renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container) return;

    if (this.currentQuizIdx >= this.quizQuestions.length) {
      this.renderQuizResults(container);
      return;
    }

    const q = this.quizQuestions[this.currentQuizIdx];
    const progressPercent = ((this.currentQuizIdx) / this.quizQuestions.length) * 100;
    const isRu = this.getLang() === 'ru';

    const stepText = isRu 
      ? `Вопрос / Question ${this.currentQuizIdx + 1} / ${this.quizQuestions.length}`
      : `Savol / Question ${this.currentQuizIdx + 1} / ${this.quizQuestions.length}`;
    const scoreText = isRu ? `⭐ Очки: <strong>${this.quizScore}</strong>` : `⭐ Ball: <strong>${this.quizScore}</strong>`;

    container.innerHTML = `
      <div class="exercise-card quiz-card">
        <div class="quiz-header">
          <div class="quiz-step-badge">${stepText}</div>
          <div class="quiz-score-badge">${scoreText}</div>
        </div>

        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="quiz-content">
          <div class="quiz-illustration">
            <span class="quiz-emoji-main">${q.imageEmoji}</span>
            <button class="speaker-btn mini-speaker" onclick="window.soundEngine.speak('${q.questionEn.replace(/'/g, "\\'")}')" title="Listen / Eshitish">
              🔊
            </button>
          </div>

          <h3 class="quiz-question-en">${q.questionEn}</h3>
          <p class="quiz-question-sub" style="color: var(--text-muted); font-size: 1.05rem; margin-top: 4px;">
            ${isRu ? '🇷🇺 ' + q.questionRu : '🇺🇿 ' + q.questionUz}
          </p>

          <div class="quiz-options-grid" id="quiz-options">
            ${q.options.map((opt, idx) => `
              <button class="quiz-option-btn" data-index="${idx}" onclick="window.exerciseManager.handleQuizAnswer(${idx})">
                <span class="opt-bullet">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <div class="quiz-feedback-box" id="quiz-feedback" style="display: none;"></div>
        </div>
      </div>
    `;
  }

  handleQuizAnswer(selectedIdx) {
    const q = this.quizQuestions[this.currentQuizIdx];
    const optionsGrid = document.getElementById('quiz-options');
    const feedbackBox = document.getElementById('quiz-feedback');
    if (!optionsGrid || !feedbackBox) return;

    const buttons = optionsGrid.querySelectorAll('.quiz-option-btn');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = q.options[selectedIdx].correct;
    const isRu = this.getLang() === 'ru';

    if (isCorrect) {
      buttons[selectedIdx].classList.add('correct');
      window.soundEngine.playSuccess();
      if (window.confettiEngine) window.confettiEngine.launch(40, 0.5, 0.7);
      
      this.quizScore += 10;
      window.appState.addStars(1);
      window.appState.unlockBadge('quiz-hero');

      if (window.gamificationHub) {
        window.gamificationHub.addXP(15, 'english-quiz');
        window.gamificationHub.addStars(1);
        window.gamificationHub.recordActivity('word', true);
      }
      if (window.astroCat) {
        window.astroCat.cheer('correct');
      }

      feedbackBox.className = 'quiz-feedback-box success-feedback bounce-in';
      const msg = isRu ? "🎉 Правильно! / Correct! (+10 очков)" : "🎉 Barakalla! / Correct! (+10 ball)";
      feedbackBox.innerHTML = `<strong>${msg}</strong>`;
      feedbackBox.style.display = 'block';

      setTimeout(() => {
        this.currentQuizIdx++;
        this.renderQuiz();
      }, 1400);
    } else {
      buttons[selectedIdx].classList.add('incorrect');
      // Highlight correct answer
      q.options.forEach((opt, idx) => {
        if (opt.correct) buttons[idx].classList.add('correct');
      });

      window.soundEngine.playError();
      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('word', false);
      }
      if (window.astroCat) {
        window.astroCat.cheer('tryAgain');
      }
      feedbackBox.className = 'quiz-feedback-box error-feedback shake-anim';
      const hintLead = isRu ? "💡 Подсказка:" : "💡 Maslahat:";
      feedbackBox.innerHTML = `<strong>${hintLead}</strong> ${q.hint}`;
      feedbackBox.style.display = 'block';

      setTimeout(() => {
        this.currentQuizIdx++;
        this.renderQuiz();
      }, 2000);
    }
  }

  renderQuizResults(container) {
    window.soundEngine.playFanfare();
    if (window.confettiEngine) window.confettiEngine.launch(100, 0.5, 0.5);

    const maxScore = this.quizQuestions.length * 10;
    const isSuper = this.quizScore >= maxScore * 0.8;
    const isRu = this.getLang() === 'ru';

    const title = isSuper 
      ? (isRu ? 'Молодец, Чемпион!' : 'Barakalla, Chempion!')
      : (isRu ? 'Хороший результат!' : 'Yaxshi Natija!');
    const scoreLabel = isRu ? 'Очки / Score:' : 'Ball / Score:';
    const msg = isSuper 
      ? (isRu ? 'Отличный результат! Ты великолепно знаешь эти слова!' : 'Ajoyib natija! Siz barcha so‘zlarni mukammal bilasiz!') 
      : (isRu ? 'Потренируйся еще раз, чтобы набрать 100% результат!' : 'Yana bir bor mashq qilib, 100% natijaga erishing!');
    const retryBtn = isRu ? '🔄 Начать заново / Try Again' : '🔄 Qaytadan boshlash / Try Again';

    container.innerHTML = `
      <div class="exercise-card quiz-card quiz-results-card bounce-in">
        <div class="results-trophy">${isSuper ? '🏆' : '🌟'}</div>
        <h2>${title}</h2>
        <p class="results-subtext">You completed the English Quiz challenge!</p>
        <div class="results-score-pill">
          <span>${scoreLabel} <strong>${this.quizScore}</strong> / ${maxScore}</span>
        </div>
        <p class="results-msg">${msg}</p>
        <div class="results-actions">
          <button class="btn btn-primary" onclick="window.exerciseManager.restartQuiz()">
            ${retryBtn}
          </button>
        </div>
      </div>
    `;
  }

  restartQuiz() {
    this.currentQuizIdx = 0;
    this.quizScore = 0;
    this.renderQuiz();
  }

  // ==========================================
  // 2. WORD MATCHING GAME
  // ==========================================
  renderMatchGame() {
    const container = document.getElementById('match-game-container');
    if (!container) return;

    this.matchedCount = 0;
    this.selectedLeft = null;
    this.selectedRight = null;

    const isRu = this.getLang() === 'ru';

    // Shuffle both columns independently
    const leftItems = [...this.matchPairs].sort(() => Math.random() - 0.5);
    const rightItems = [...this.matchPairs].sort(() => Math.random() - 0.5);

    const matchTag = isRu ? 'Найди пару / Match the Pairs' : 'Juftlikni top / Match the Pairs';
    const matchDesc = isRu 
      ? 'Перетащите английское слово слева на его перевод справа или нажмите для выбора! 🔗' 
      : 'Chap tarafdagi inglizcha so‘zni o‘ngdagi ma’nosiga torting yoki bosib juftlang! 🔗';

    container.innerHTML = `
      <div class="exercise-card match-card">
        <div class="match-instructions">
          <span class="game-tag">${matchTag}</span>
          <p>${matchDesc}</p>
        </div>

        <div class="match-arena">
          <div class="match-column" id="match-col-left">
            ${leftItems.map(item => `
              <div class="match-bubble drag-chip" draggable="true" data-id="${item.id}" data-side="left" 
                   ondragstart="window.exerciseManager.onDragStart(event, this)"
                   ondragend="window.exerciseManager.onDragEnd(event, this)"
                   onclick="window.exerciseManager.handleMatchSelect(this)">
                <span class="match-text">🖐️ ${item.en}</span>
                <button class="speaker-btn mini-speaker" onclick="event.stopPropagation(); window.soundEngine.speak('${item.en.replace(/[^\w\s]/gi, '').trim()}')">
                  🔊
                </button>
              </div>
            `).join('')}
          </div>

          <div class="match-divider-icon">✨</div>

          <div class="match-column" id="match-col-right">
            ${rightItems.map(item => `
              <div class="match-bubble drop-target-zone" data-id="${item.id}" data-side="right"
                   ondragover="window.exerciseManager.onDragOver(event, this)"
                   ondragleave="window.exerciseManager.onDragLeave(event, this)"
                   ondrop="window.exerciseManager.onDrop(event, this)"
                   onclick="window.exerciseManager.handleMatchSelect(this)">
                <span class="match-text">${isRu ? item.ru : item.uz}</span>
                <span class="match-sub">${isRu ? item.uz : item.ru}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="match-success-banner" class="match-success-banner" style="display: none;">
          <div class="success-banner-card bounce-in">
            <span class="big-star">🌟</span>
            <h3>${isRu ? 'Все пары найдены! / Match Complete!' : 'Barcha juftliklarni topdingiz! / Match Complete!'}</h3>
            <p>${isRu ? 'Ты правильно соединил слова и выиграл звезды!' : 'So‘zlarni to‘g‘ri bog‘lab, yangi yulduzlar qozondingiz!'}</p>
            <button class="btn btn-primary" onclick="window.exerciseManager.renderMatchGame()">
              ${isRu ? '🔄 Сыграть снова / Play Again' : '🔄 Qaytadan o‘ynash / Play Again'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  handleMatchSelect(element) {
    if (element.classList.contains('matched')) return;

    window.soundEngine.playPop();

    const side = element.dataset.side;

    if (side === 'left') {
      if (this.selectedLeft) this.selectedLeft.classList.remove('selected');
      this.selectedLeft = element;
      element.classList.add('selected');
    } else {
      if (this.selectedRight) this.selectedRight.classList.remove('selected');
      this.selectedRight = element;
      element.classList.add('selected');
    }

    if (this.selectedLeft && this.selectedRight) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const idLeft = this.selectedLeft.dataset.id;
    const idRight = this.selectedRight.dataset.id;

    if (idLeft === idRight) {
      // Correct Match
      window.soundEngine.playSuccess();
      this.selectedLeft.classList.remove('selected', 'is-dragging');
      this.selectedRight.classList.remove('selected', 'drag-hover');

      this.selectedLeft.classList.add('matched');
      this.selectedRight.classList.add('matched');

      this.matchedCount++;
      window.appState.addStars(1);

      if (window.gamificationHub) {
        window.gamificationHub.addXP(15, 'english-word');
        window.gamificationHub.addStars(1);
        window.gamificationHub.recordActivity('word', true);
      }
      if (window.astroCat) {
        window.astroCat.cheer('correct');
      }

      this.selectedLeft = null;
      this.selectedRight = null;

      if (this.matchedCount === this.matchPairs.length) {
        window.soundEngine.playFanfare();
        if (window.confettiEngine) window.confettiEngine.launch(80, 0.5, 0.5);
        if (window.astroCat) window.astroCat.cheer('levelUp');
        if (window.gamificationHub) {
          window.gamificationHub.addXP(50, 'english-match-done');
          window.gamificationHub.addStars(5);
        }
        window.appState.unlockBadge('match-maker');

        const banner = document.getElementById('match-success-banner');
        if (banner) banner.style.display = 'block';
      }
    } else {
      // Incorrect match
      window.soundEngine.playError();
      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('word', false);
      }
      if (window.astroCat) {
        window.astroCat.cheer('tryAgain');
      }
      this.selectedLeft.classList.add('mismatch-shake');
      this.selectedRight.classList.add('mismatch-shake');

      const elL = this.selectedLeft;
      const elR = this.selectedRight;
      setTimeout(() => {
        elL.classList.remove('selected', 'mismatch-shake', 'is-dragging');
        elR.classList.remove('selected', 'mismatch-shake', 'drag-hover');
      }, 600);

      this.selectedLeft = null;
      this.selectedRight = null;
    }
  }

  // --- HTML5 & Pointer Drag and Drop Handlers ---
  onDragStart(e, el) {
    if (el.classList.contains('matched')) return;
    e.dataTransfer.setData('text/plain', el.dataset.id);
    el.classList.add('is-dragging');
    window.soundEngine.playPop();
  }

  onDragEnd(e, el) {
    el.classList.remove('is-dragging');
  }

  onDragOver(e, el) {
    if (el.classList.contains('matched')) return;
    e.preventDefault();
    el.classList.add('drag-hover');
  }

  onDragLeave(e, el) {
    el.classList.remove('drag-hover');
  }

  onDrop(e, el) {
    if (el.classList.contains('matched')) return;
    e.preventDefault();
    el.classList.remove('drag-hover');
    const draggedId = e.dataTransfer.getData('text/plain');

    const leftEl = document.querySelector(`.match-bubble[data-id="${draggedId}"][data-side="left"]`);
    if (leftEl) {
      this.selectedLeft = leftEl;
      this.selectedRight = el;
      this.checkMatch();
    }
  }

  // ==========================================
  // 3. FILL IN THE BLANK
  // ==========================================
  renderFillBlank() {
    const container = document.getElementById('fill-blank-container');
    if (!container) return;

    const isRu = this.getLang() === 'ru';

    if (this.currentBlankIdx >= this.blankQuestions.length) {
      container.innerHTML = `
        <div class="exercise-card blank-card results-card bounce-in">
          <div class="results-trophy">🌟</div>
          <h2>${isRu ? 'Все предложения заполнены!' : 'Barcha jumlalarni to‘ldirdingiz!'}</h2>
          <p>${isRu ? 'Молодец! Ты отлично научился строить предложения.' : 'Barakalla! Siz to‘g‘ri gap tuzishni juda yaxshi o‘rgandingiz.'}</p>
          <button class="btn btn-primary" onclick="window.exerciseManager.restartBlank()">
            ${isRu ? '🔄 Заполнить заново / Try Again' : '🔄 Qaytadan to‘ldirish / Try Again'}
          </button>
        </div>
      `;
      return;
    }

    const item = this.blankQuestions[this.currentBlankIdx];
    const stepLabel = isRu 
      ? `Заполните пропуск: ${this.currentBlankIdx + 1} / ${this.blankQuestions.length}`
      : `Gapni to‘ldiring: ${this.currentBlankIdx + 1} / ${this.blankQuestions.length}`;

    container.innerHTML = `
      <div class="exercise-card blank-card">
        <div class="quiz-header">
          <div class="quiz-step-badge">${stepLabel}</div>
        </div>

        <div class="blank-sentence-display">
          <span class="sentence-part">${item.sentenceBefore}</span>
          <span class="blank-target-slot" id="blank-slot">___</span>
          <span class="sentence-part">${item.sentenceAfter}</span>
          <button class="speaker-btn mini-speaker" onclick="window.soundEngine.speak('${item.sentenceBefore} ${item.correct} ${item.sentenceAfter}')">
            🔊
          </button>
        </div>

        <div class="blank-translation-box">
          <p class="uz-hint">🇺🇿 ${item.translationUz}</p>
          <p class="ru-hint">🇷🇺 ${item.translationRu}</p>
        </div>

        <div class="blank-options-tray">
          ${item.options.map(opt => `
            <button class="blank-choice-pill" onclick="window.exerciseManager.handleBlankChoice('${opt}')">
              ${opt}
            </button>
          `).join('')}
        </div>

        <div id="blank-feedback" class="blank-feedback" style="display: none;"></div>
      </div>
    `;
  }

  handleBlankChoice(choice) {
    const item = this.blankQuestions[this.currentBlankIdx];
    const slot = document.getElementById('blank-slot');
    const feedback = document.getElementById('blank-feedback');
    if (!slot || !feedback) return;

    slot.textContent = choice;
    const isRu = this.getLang() === 'ru';

    if (choice === item.correct) {
      slot.classList.add('slot-correct');
      window.soundEngine.playSuccess();
      if (window.confettiEngine) window.confettiEngine.launch(35, 0.5, 0.6);
      window.appState.addStars(1);

      feedback.className = 'blank-feedback success-feedback bounce-in';
      const msg = isRu ? "🎉 Правильно! / Correct!" : "🎉 To‘g‘ri! / Correct!";
      feedback.innerHTML = `${msg} <strong>${item.correct}</strong>`;
      feedback.style.display = 'block';

      setTimeout(() => {
        this.currentBlankIdx++;
        this.renderFillBlank();
      }, 1500);
    } else {
      slot.classList.add('slot-incorrect');
      window.soundEngine.playError();

      feedback.className = 'blank-feedback error-feedback shake-anim';
      const msg = isRu ? "💡 Попробуй еще раз! / Try again!" : "💡 Qaytadan urinib ko‘ring! / Try again!";
      feedback.innerHTML = msg;
      feedback.style.display = 'block';

      setTimeout(() => {
        slot.textContent = '___';
        slot.classList.remove('slot-incorrect');
        feedback.style.display = 'none';
      }, 1200);
    }
  }

  restartBlank() {
    this.currentBlankIdx = 0;
    this.renderFillBlank();
  }
}

window.exerciseManager = new ExerciseManager();
