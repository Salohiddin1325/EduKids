/**
 * MathKids - Visual Math Rules & Formulas (Darslar va Qoidalar / Уроки и Правила)
 * Interactive counters: apples, stars, pizzas, and cookies with dynamic steppers!
 */

const MATH_LESSONS_DATA = [
  // --- 1. ADDITION (QO'SHISH / СЛОЖЕНИЕ) ---
  {
    id: 'addition',
    titleUz: "Qo‘shish Amali (+)",
    titleRu: "Сложение (+)",
    titleEn: "Addition: Combining Groups",
    symbol: "+",
    color: "#2563EB",
    badgeUz: "Birlashish Sehri!",
    badgeRu: "Магия сложения!",
    emoji: "🍎",
    conceptUz: "Qo‘shish — bu ikki yoki undan ortiq to‘plamdagi narsalarni bitta savatga jamlash demakdir!",
    conceptRu: "Сложение — это объединение предметов из двух или более групп в одну общую корзину!",
    conceptEn: "Addition means putting groups together to find the total count!",
    defaultA: 3,
    defaultB: 4,
    counterEmoji: "🍎",
    ruleFormula: "a + b = c",
    realLifeExampleUz: "Sizda 3 ta qizil olma bor edi. Do‘stingiz yana 2 ta olma berdi. Hammasi bo‘lib 5 ta olma bo‘ldi!",
    realLifeExampleRu: "У тебя было 3 красных яблока. Друг дал еще 2 яблока. Всего получилось 5 яблок!",
    quiz: {
      questionUz: "5 ta yulduzga ⭐ yana 3 ta yulduz qo‘shilsa, jami nechta bo‘ladi?",
      questionRu: "Если к 5 звездам ⭐ добавить еще 3 звезды, сколько всего получится?",
      options: [7, 8, 9],
      correct: 1,
      explanationUz: "5 + 3 = 8! Barakalla, to‘g‘ri hisobladingiz!",
      explanationRu: "5 + 3 = 8! Молодец, правильный ответ!"
    }
  },

  // --- 2. SUBTRACTION (AYRISH / ВЫЧИТАНИЕ) ---
  {
    id: 'subtraction',
    titleUz: "Ayrish Amali (-)",
    titleRu: "Вычитание (-)",
    titleEn: "Subtraction: Taking Away",
    symbol: "-",
    color: "#FF5E13",
    badgeUz: "Kamaytirish!",
    badgeRu: "Уменьшение!",
    emoji: "🍕",
    conceptUz: "Ayrish — bu umumiy narsalardan ma’lum bir qismini olib tashlash yoki yeb qo‘yish demakdir!",
    conceptRu: "Вычитание — это когда мы убираем или съедаем часть предметов из общего количества!",
    conceptEn: "Subtraction means taking away some items from the whole group to see what is left!",
    defaultA: 7,
    defaultB: 3,
    counterEmoji: "🍕",
    ruleFormula: "a - b = c",
    realLifeExampleUz: "Laganda 7 bo‘lak pitsa bor edi. Biz 3 bo‘lagini yeb qo‘ydik. Laganda 4 bo‘lak pitsa qoldi!",
    realLifeExampleRu: "На тарелке было 7 кусочков пиццы. Мы съели 3 кусочка. Осталось 4 кусочка пиццы!",
    quiz: {
      questionUz: "9 ta shardan 🎈 4 tasi uchib ketdi. Nechta shar qoldi?",
      questionRu: "Из 9 воздушных шаров 🎈 4 улетели. Сколько шаров осталось?",
      options: [5, 4, 6],
      correct: 0,
      explanationUz: "9 - 4 = 5! To‘g‘ri, 5 ta shar qoldi!",
      explanationRu: "9 - 4 = 5! Верно, осталось 5 шариков!"
    }
  },

  // --- 3. MULTIPLICATION (KO'PAYTIRISH / УМНОЖЕНИЕ) ---
  {
    id: 'multiplication',
    titleUz: "Ko‘paytirish Amali (×)",
    titleRu: "Умножение (×)",
    titleEn: "Multiplication: Repeated Addition",
    symbol: "×",
    color: "#10B981",
    badgeUz: "Tezkor Qo‘shish!",
    badgeRu: "Быстрое сложение!",
    emoji: "⭐",
    conceptUz: "Ko‘paytirish — bir xil sonni qayta-qayta qo‘shishning eng chaqqon va sehrli usuli!",
    conceptRu: "Умножение — самый быстрый и волшебный способ сложить одно и то же число несколько раз!",
    conceptEn: "Multiplication is super-fast repeated addition! 3 groups of 4 = 12!",
    defaultA: 3,
    defaultB: 4,
    counterEmoji: "⭐",
    ruleFormula: "a × b = c",
    realLifeExampleUz: "Har birida 4 tadan yulduzcha bo‘lgan 3 ta qator bor. Hammasini bittadan sanamasdan: 3 × 4 = 12!",
    realLifeExampleRu: "В 3 рядах лежит по 4 звездочки. Чтобы не считать каждую: 3 × 4 = 12!",
    quiz: {
      questionUz: "Har bir velosipedda 2 ta g‘ildirak bor. 4 ta velosipedda nechta g‘ildirak bo‘ladi?",
      questionRu: "У каждого велосипеда 2 колеса. Сколько колес у 4 велосипедов?",
      options: [6, 8, 10],
      correct: 1,
      explanationUz: "4 × 2 = 8! Velosipedlar jami 8 ta g‘ildirakka ega!",
      explanationRu: "4 × 2 = 8! У велосипедов всего 8 колес!"
    }
  },

  // --- 4. DIVISION (BO'LISH / ДЕЛЕНИЕ) ---
  {
    id: 'division',
    titleUz: "Bo‘lish Amali (÷)",
    titleRu: "Деление (÷)",
    titleEn: "Division: Equal Sharing",
    symbol: "÷",
    color: "#7C3AED",
    badgeUz: "Adolatli Ulashish!",
    badgeRu: "Честный раздел!",
    emoji: "🍪",
    conceptUz: "Bo‘lish — narsalarni do‘stlar o‘rtasida hech kim xafa bo‘lmaydigan qilib teng bo‘lib berishdir!",
    conceptRu: "Деление — это когда мы поровну раздаем предметы друзьям, чтобы никто не обиделся!",
    conceptEn: "Division means sharing items equally into groups so everyone gets the same amount!",
    defaultA: 12,
    defaultB: 3,
    counterEmoji: "🍪",
    ruleFormula: "a ÷ b = c",
    realLifeExampleUz: "12 ta shirin pechenye bor. Ularni 3 ta do‘stimizga teng bo‘lsak, har biriga 4 tadan tegadi!",
    realLifeExampleRu: "Есть 12 вкусных печений. Если поровну поделить их между 3 друзьями, каждый получит по 4 штуки!",
    quiz: {
      questionUz: "10 ta konfetni 2 ta bolaga teng bo‘lib bersak, har biriga nechtadan tegadi?",
      questionRu: "Если 10 конфет честно поделить между 2 детьми, сколько получит каждый?",
      options: [4, 5, 6],
      correct: 1,
      explanationUz: "10 ÷ 2 = 5! Har bir bola 5 tadan konfet oladi!",
      explanationRu: "10 ÷ 2 = 5! Каждый ребенок получит по 5 конфет!"
    }
  }
];

class LessonsManager {
  constructor() {
    this.lessonStates = {
      addition: { a: 3, b: 4 },
      subtraction: { a: 7, b: 3 },
      multiplication: { a: 3, b: 4 },
      division: { a: 12, b: 3 }
    };
  }

  getLang() {
    return window.mathApp ? window.mathApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  renderLessons() {
    const container = document.getElementById('math-lessons-container');
    if (!container) return;

    const isRu = this.getLang() === 'ru';

    container.innerHTML = MATH_LESSONS_DATA.map(lesson => {
      const state = this.lessonStates[lesson.id];
      const title = isRu ? lesson.titleRu : lesson.titleUz;
      const badge = isRu ? lesson.badgeRu : lesson.badgeUz;
      const concept = isRu ? lesson.conceptRu : lesson.conceptUz;
      const realLife = isRu ? lesson.realLifeExampleRu : lesson.realLifeExampleUz;
      const quizQ = isRu ? lesson.quiz.questionRu : lesson.quiz.questionUz;
      const quizExplanation = isRu ? lesson.quiz.explanationRu : lesson.quiz.explanationUz;
      const stepperLabel = isRu ? "Измените значения:" : "Qiymatlarni o‘zgartiring:";
      const storyLabel = isRu ? "📖 Жизненный пример:" : "📖 Hayotiy misol:";
      const challengeTitle = isRu ? "🎯 Проверьте правило / Try it:" : "🎯 Sinab ko‘ring / Try it:";

      return `
        <div class="math-rule-card" style="--op-color: ${lesson.color};" id="rule-card-${lesson.id}">
          <div class="rule-card-header">
            <div class="op-symbol-box" style="background-color: ${lesson.color};">
              ${lesson.symbol}
            </div>
            <div class="rule-title-group">
              <span class="rule-badge-pill">${badge}</span>
              <h3 class="rule-main-title">${title}</h3>
              <span class="rule-sub-title">${lesson.titleEn}</span>
            </div>
          </div>

          <div class="rule-card-body">
            <div class="concept-explanation-box">
              <p class="concept-uz">💡 ${concept}</p>
              <p class="concept-en">🌐 ${lesson.conceptEn}</p>
            </div>

            <!-- Interactive Visual Counter Playground -->
            <div class="interactive-counter-stage">
              <div class="stepper-controls-row">
                <span class="stepper-label">${stepperLabel}</span>
                
                <div class="stepper-group">
                  <button class="step-btn" onclick="window.lessonsManager.step('${lesson.id}', 'a', -1)">-</button>
                  <span class="stepper-val" id="val-${lesson.id}-a">${state.a}</span>
                  <button class="step-btn" onclick="window.lessonsManager.step('${lesson.id}', 'a', 1)">+</button>
                </div>

                <span class="op-sign-center">${lesson.symbol}</span>

                <div class="stepper-group">
                  <button class="step-btn" onclick="window.lessonsManager.step('${lesson.id}', 'b', -1)">-</button>
                  <span class="stepper-val" id="val-${lesson.id}-b">${state.b}</span>
                  <button class="step-btn" onclick="window.lessonsManager.step('${lesson.id}', 'b', 1)">+</button>
                </div>

                <span class="equals-sign">=</span>
                <span class="stepper-result-pill" id="result-${lesson.id}">
                  ${this.computeResult(lesson.id, state.a, state.b)}
                </span>
              </div>

              <!-- Visual Items Display (Apples, Stars, Pizzas, Cookies) -->
              <div class="visual-counters-canvas" id="canvas-visual-${lesson.id}">
                ${this.renderVisualCounters(lesson.id, state.a, state.b)}
              </div>
            </div>

            <!-- Real Life Story Example -->
            <div class="real-life-story">
              <strong>${storyLabel}</strong>
              <p>${realLife}</p>
            </div>

            <!-- Mini Rule Challenge -->
            <div class="lesson-mini-challenge">
              <span class="challenge-title">${challengeTitle}</span>
              <p class="challenge-q">${quizQ}</p>
              <div class="challenge-options">
                ${lesson.quiz.options.map((opt, oIdx) => `
                  <button class="challenge-opt-btn" onclick="window.lessonsManager.checkMiniQuiz('${lesson.id}', ${oIdx}, ${lesson.quiz.correct}, '${quizExplanation.replace(/'/g, "\\'")}')">
                    ${opt}
                  </button>
                `).join('')}
              </div>
              <div class="challenge-feedback" id="feedback-${lesson.id}" style="display: none;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  computeResult(opId, a, b) {
    if (opId === 'addition') return a + b;
    if (opId === 'subtraction') return a - b;
    if (opId === 'multiplication') return a * b;
    if (opId === 'division') return Math.floor(a / b);
    return 0;
  }

  step(lessonId, param, delta) {
    window.mathAudio.playPop();
    const state = this.lessonStates[lessonId];

    if (lessonId === 'subtraction') {
      if (param === 'a') {
        state.a = Math.max(state.b, Math.min(15, state.a + delta));
      } else {
        state.b = Math.max(1, Math.min(state.a, state.b + delta));
      }
    } else if (lessonId === 'division') {
      if (param === 'b') {
        state.b = Math.max(1, Math.min(6, state.b + delta));
        state.a = state.b * Math.max(1, Math.floor(state.a / state.b));
      } else {
        const factor = Math.max(1, Math.min(6, Math.floor(state.a / state.b) + delta));
        state.a = state.b * factor;
      }
    } else {
      state[param] = Math.max(1, Math.min(12, state[param] + delta));
    }

    const valEl = document.getElementById(`val-${lessonId}-${param}`);
    if (valEl) valEl.textContent = state[param];

    if (lessonId === 'division' && param === 'b') {
      const valA = document.getElementById(`val-${lessonId}-a`);
      if (valA) valA.textContent = state.a;
    }

    const resEl = document.getElementById(`result-${lessonId}`);
    if (resEl) {
      resEl.textContent = this.computeResult(lessonId, state.a, state.b);
      resEl.classList.add('pop-anim');
      setTimeout(() => resEl.classList.remove('pop-anim'), 300);
    }

    const visualContainer = document.getElementById(`canvas-visual-${lessonId}`);
    if (visualContainer) {
      visualContainer.innerHTML = this.renderVisualCounters(lessonId, state.a, state.b);
    }
  }

  renderVisualCounters(lessonId, a, b) {
    const isRu = this.getLang() === 'ru';
    if (lessonId === 'addition') {
      const groupA = Array(a).fill('🍎').map((e, i) => `<span class="item-bounce" style="animation-delay: ${i*0.05}s;">${e}</span>`).join('');
      const groupB = Array(b).fill('🍏').map((e, i) => `<span class="item-bounce" style="animation-delay: ${i*0.05}s;">${e}</span>`).join('');
      return `
        <div class="visual-op-row">
          <div class="visual-group group-a" title="${isRu ? a + ' красных яблок' : a + ' ta qizil olma'}">${groupA}</div>
          <span class="visual-sign">+</span>
          <div class="visual-group group-b" title="${isRu ? b + ' зеленых яблок' : b + ' ta yashil olma'}">${groupB}</div>
        </div>
      `;
    }

    if (lessonId === 'subtraction') {
      const remainingCount = a - b;
      const remaining = Array(remainingCount).fill('🍕').map((e, i) => `<span class="item-bounce" style="animation-delay: ${i*0.05}s;">${e}</span>`).join('');
      const eaten = Array(b).fill('🍕').map(e => `<span class="item-eaten" title="${isRu ? 'Съедено' : 'Yeb qo‘yilgan'}">${e}</span>`).join('');
      return `
        <div class="visual-op-row">
          <div class="visual-group group-sub" title="${isRu ? a + ' кусочков пиццы' : a + ' bo‘lak pitsa'}">
            ${remaining}
            ${eaten}
          </div>
        </div>
      `;
    }

    if (lessonId === 'multiplication') {
      let rowsHtml = '';
      for (let r = 0; r < a; r++) {
        const rowStars = Array(b).fill('⭐').join('');
        rowsHtml += `<div class="mult-row">${rowStars} <span class="row-tag">(${b})</span></div>`;
      }
      return `
        <div class="visual-op-mult">
          <div class="mult-grid">${rowsHtml}</div>
        </div>
      `;
    }

    if (lessonId === 'division') {
      const itemsPerPlate = Math.floor(a / b);
      let platesHtml = '';
      for (let p = 0; p < b; p++) {
        const cookies = Array(itemsPerPlate).fill('🍪').join('');
        platesHtml += `
          <div class="division-plate">
            <span class="plate-title">${isRu ? 'Тарелка ' : 'Tarelka '}${p + 1}</span>
            <div class="plate-items">${cookies}</div>
          </div>
        `;
      }
      return `
        <div class="visual-op-division">
          <div class="plates-tray">${platesHtml}</div>
        </div>
      `;
    }

    return '';
  }

  checkMiniQuiz(lessonId, chosenIdx, correctIdx, explanation) {
    const card = document.getElementById(`rule-card-${lessonId}`);
    const feedback = document.getElementById(`feedback-${lessonId}`);
    if (!card || !feedback) return;

    const isRu = this.getLang() === 'ru';
    const buttons = card.querySelectorAll('.challenge-opt-btn');
    buttons.forEach(b => b.disabled = true);

    if (chosenIdx === correctIdx) {
      buttons[chosenIdx].classList.add('correct');
      window.mathAudio.playCorrect();
      if (window.mathConfetti) window.mathConfetti.launch(35, 0.5, 0.6);
      window.mathApp.addStars(2);

      feedback.className = 'challenge-feedback success-box bounce-in';
      const msg = isRu ? "🎉 Правильный ответ!" : "🎉 To‘g‘ri javob!";
      feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
      feedback.style.display = 'block';
    } else {
      buttons[chosenIdx].classList.add('incorrect');
      buttons[correctIdx].classList.add('correct');
      window.mathAudio.playWrong();

      feedback.className = 'challenge-feedback error-box shake-anim';
      const msg = isRu ? "💡 Попробуйте еще раз!" : "💡 Yana bir bor qarab ko‘ring!";
      feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
      feedback.style.display = 'block';
    }

    setTimeout(() => {
      buttons.forEach(b => {
        b.disabled = false;
        b.classList.remove('correct', 'incorrect');
      });
      feedback.style.display = 'none';
    }, 3200);
  }
}

window.lessonsManager = new LessonsManager();
