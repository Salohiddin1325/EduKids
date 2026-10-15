/**
 * PhysicsKids - Interactive Physics Exercises & Quizzes
 * Fully bilingual: Uzbek & Russian.
 */

const PHYSICS_QUIZ_DATA = [
  {
    id: 1,
    questionEn: "Why do we always fall back down when we jump?",
    questionUz: "Sakraganimizda nega doim qaytib yerga tushamiz?",
    questionRu: "Почему, когда мы подпрыгиваем, мы всегда возвращаемся обратно на землю?",
    emoji: "🍏",
    optionsUz: [
      { text: "Oy shamoli itargani uchun", correct: false },
      { text: "Yerning gravitatsiya kuchi tortgani uchun", correct: true },
      { text: "Oyoqlarimiz og‘ir bo‘lgani uchun", correct: false }
    ],
    optionsRu: [
      { text: "Лунный ветер толкает нас", correct: false },
      { text: "Сила гравитации Земли притягивает нас", correct: true },
      { text: "Ноги слишком тяжелые", correct: false }
    ],
    hintUz: "Nyuton boshiga tushgan olma siri!",
    hintRu: "Секрет яблока, упавшего на голову Ньютона!"
  },
  {
    id: 2,
    questionEn: "Which of these objects will stick to a magnet?",
    questionUz: "Quyidagi buyumlardan qaysi biri magnitga yopishadi?",
    questionRu: "Какой из этих предметов притянется к магниту?",
    emoji: "🧲",
    optionsUz: [
      { text: "Yog‘och qoshiq 🥄", correct: false },
      { text: "Temir mix 🔩", correct: true },
      { text: "Rezina to‘p 🏐", correct: false }
    ],
    optionsRu: [
      { text: "Деревянная ложка 🥄", correct: false },
      { text: "Железный гвоздь 🔩", correct: true },
      { text: "Резиновый мяч 🏐", correct: false }
    ],
    hintUz: "Magnit faqat temir va metallarni sevadi!",
    hintRu: "Магнит притягивает только железо и металлы!"
  },
  {
    id: 3,
    questionEn: "What happens when you heat ice cubes?",
    questionUz: "Muz bo‘laklarini isitsak u qanday holatga o‘tadi?",
    questionRu: "Что произойдет, если нагреть кубики льда?",
    emoji: "🧊",
    optionsUz: [
      { text: "Erib suyuq suvga aylanadi 💧", correct: true },
      { text: "Toshdek qattiq bo‘lib qoladi", correct: false },
      { text: "Rangini qizilga o‘zgartiradi", correct: false }
    ],
    optionsRu: [
      { text: "Растают и станут жидкой водой 💧", correct: true },
      { text: "Станут твердыми как камень", correct: false },
      { text: "Изменят цвет на красный", correct: false }
    ],
    hintUz: "Harorat 0°C dan oshganda muz eriydi!",
    hintRu: "Когда температура поднимается выше 0°C, лед тает!"
  },
  {
    id: 4,
    questionEn: "What happens when two identical magnet poles (N and N) meet?",
    questionUz: "Ikkita bir xil magnit qutblari (N va N) uchrashsa nima bo‘ladi?",
    questionRu: "Что произойдет, если сблизить два одинаковых полюса магнита (N и N)?",
    emoji: "🚫",
    optionsUz: [
      { text: "Ular bir-birini qattiq itaradi (Repel)", correct: true },
      { text: "Ular darhol yopishib qoladi", correct: false },
      { text: "Ular erib ketadi", correct: false }
    ],
    optionsRu: [
      { text: "Они будут сильно отталкиваться (Repel)", correct: true },
      { text: "Они моментально склеятся", correct: false },
      { text: "Они растают", correct: false }
    ],
    hintUz: "Bir xil qutblar bir-birini xush ko‘rmaydi va itaradi!",
    hintRu: "Одинаковые полюса отталкивают друг друга!"
  },
  {
    id: 5,
    questionEn: "Why do shadows form behind objects in the sun?",
    questionUz: "Quyoshda narsalarning orqasida nega qora soya paydo bo‘ladi?",
    questionRu: "Почему на солнце позади предметов появляется тень?",
    emoji: "💡",
    optionsUz: [
      { text: "Narsa yorug‘lik nurlarini to‘sib qo‘ygani uchun", correct: true },
      { text: "Chunki yer qora bo‘lgani uchun", correct: false },
      { text: "Chunki havo sovuq bo‘lgani uchun", correct: false }
    ],
    optionsRu: [
      { text: "Предмет загораживает прямые лучи света", correct: true },
      { text: "Потому что земля темная", correct: false },
      { text: "Потому что воздух холодный", correct: false }
    ],
    hintUz: "Yorug‘lik to‘g‘ri chiziq bo‘ylab harakatlanadi!",
    hintRu: "Лучи света распространяются по прямым линиям!"
  },
  {
    id: 6,
    questionEn: "Which surface is easiest to slide or ski on?",
    questionUz: "Qaysi yuza ustida sirpanish yoki chana uchish eng oson?",
    questionRu: "По какой поверхности легче всего скользить на санках или лыжах?",
    emoji: "⛸️",
    optionsUz: [
      { text: "Qalin gilam ustida", correct: false },
      { text: "Muz va silliq qor ustida", correct: true },
      { text: "Qumli yo‘lda", correct: false }
    ],
    optionsRu: [
      { text: "По пушистому ковру", correct: false },
      { text: "По гладкому льду и снегу", correct: true },
      { text: "По песчаной дороге", correct: false }
    ],
    hintUz: "Ishqalanish kuchi qanchalik kam bo‘lsa, sirpanish shunchalik oson!",
    hintRu: "Чем меньше сила трения, тем легче скользить!"
  }
];

class PhysicsQuizManager {
  constructor() {
    this.currentIdx = 0;
    this.score = 0;
    this.streak = 0;
  }

  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.renderQuiz();
  }

  renderQuiz() {
    const container = document.getElementById('physics-quiz-container');
    if (!container) return;

    if (this.currentIdx >= PHYSICS_QUIZ_DATA.length) {
      this.renderResults(container);
      return;
    }

    const q = PHYSICS_QUIZ_DATA[this.currentIdx];
    const progress = ((this.currentIdx) / PHYSICS_QUIZ_DATA.length) * 100;
    const isRu = this.getLang() === 'ru';

    const stepLabel = isRu ? `Вопрос ${this.currentIdx + 1} / ${PHYSICS_QUIZ_DATA.length}` : `Savol ${this.currentIdx + 1} / ${PHYSICS_QUIZ_DATA.length}`;
    const scoreLabel = isRu ? `⭐ Очки: <strong>${this.score}</strong>` : `⭐ Ball: <strong>${this.score}</strong>`;
    const questionText = isRu ? q.questionRu : q.questionUz;
    const options = isRu ? q.optionsRu : q.optionsUz;

    container.innerHTML = `
      <div class="physics-quiz-card bounce-in">
        <div class="p-quiz-header">
          <span class="quiz-step-tag">${stepLabel}</span>
          <span class="quiz-score-tag">${scoreLabel}</span>
        </div>

        <div class="p-progress-bar">
          <div class="p-progress-fill" style="width: ${progress}%;"></div>
        </div>

        <div class="p-quiz-body">
          <div class="p-quiz-visual">${q.emoji}</div>
          <h3 class="p-quiz-q-uz">${questionText}</h3>
          <p class="p-quiz-q-en">${q.questionEn}</p>

          <div class="p-quiz-options-list" id="p-quiz-options">
            ${options.map((opt, idx) => `
              <button class="p-quiz-opt-btn" onclick="window.physicsQuiz.handleAnswer(${idx}, this)">
                <span class="opt-bullet">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-label">${opt.text}</span>
              </button>
            `).join('')}
          </div>

          <div class="p-quiz-feedback" id="p-quiz-feedback" style="display: none;"></div>
        </div>
      </div>
    `;
  }

  handleAnswer(idx, btnEl) {
    const q = PHYSICS_QUIZ_DATA[this.currentIdx];
    const feedback = document.getElementById('p-quiz-feedback');
    const optionsGrid = document.getElementById('p-quiz-options');
    if (!feedback || !optionsGrid) return;

    const isRu = this.getLang() === 'ru';
    const options = isRu ? q.optionsRu : q.optionsUz;
    const buttons = optionsGrid.querySelectorAll('.p-quiz-opt-btn');
    buttons.forEach(b => b.disabled = true);

    const isCorrect = options[idx].correct;

    if (isCorrect) {
      btnEl.classList.add('correct');
      window.physicsAudio.playCorrect();
      if (window.physicsConfetti) window.physicsConfetti.launch(40, 0.5, 0.6);

      this.streak++;
      const points = 10 + (this.streak > 2 ? 5 : 0);
      this.score += points;
      window.physicsApp.addStars(2);

      if (window.gamificationHub) {
        window.gamificationHub.addXP(points, 'physics');
        window.gamificationHub.addStars(2);
        window.gamificationHub.recordActivity('physics', true);
      }
      if (window.astroCat) {
        window.astroCat.cheer('correct');
      }

      feedback.className = 'p-quiz-feedback success-feedback bounce-in';
      const msg = isRu ? `🎉 Молодец! Правильный ответ! (+${points} очков)` : `🎉 Barakalla! To‘g‘ri javob! (+${points} ball)`;
      feedback.innerHTML = msg;
      feedback.style.display = 'block';

      setTimeout(() => {
        this.currentIdx++;
        this.renderQuiz();
      }, 1500);
    } else {
      btnEl.classList.add('incorrect');
      buttons.forEach((b, i) => {
        if (options[i].correct) b.classList.add('correct');
      });

      window.physicsAudio.playWrong();
      this.streak = 0;

      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('physics', false);
      }
      if (window.astroCat) {
        window.astroCat.cheer('tryAgain');
      }

      feedback.className = 'p-quiz-feedback error-feedback shake-anim';
      const hint = isRu ? q.hintRu : q.hintUz;
      const hintLabel = isRu ? "💡 Подсказка:" : "💡 Maslahat:";
      feedback.innerHTML = `${hintLabel} ${hint}`;
      feedback.style.display = 'block';

      setTimeout(() => {
        this.currentIdx++;
        this.renderQuiz();
      }, 2000);
    }
  }

  renderResults(container) {
    window.physicsAudio.playFanfare();
    if (window.physicsConfetti) window.physicsConfetti.launch(80, 0.5, 0.5);

    const maxScore = PHYSICS_QUIZ_DATA.length * 10;
    const isSuper = this.score >= maxScore * 0.8;
    const isRu = this.getLang() === 'ru';

    const title = isSuper 
      ? (isRu ? 'Молодец, юный физик!' : 'Barakalla, Yosh Fizik!')
      : (isRu ? 'Хороший результат!' : 'Ajoyib Natija!');
    const sub = isRu 
      ? 'Ты успешно завершил викторину по физике!' 
      : 'Fizika viktorinasini muvaffaqiyatli yakunladingiz!';
    const pts = isRu ? 'Очков' : 'Ball';
    const msg = isSuper 
      ? (isRu ? 'Поздравляем! Ты отлично понимаешь законы природы!' : 'Tabriklaymiz! Siz tabiat qonunlarini juda yaxshi tushunasiz!')
      : (isRu ? 'Потренируйся еще раз, чтобы набрать 100% результат!' : 'Yana bir bor mashq qilib, 100% natijaga erishishingiz mumkin!');
    const restartBtn = isRu ? '🔄 Пройти снова / Try Again' : '🔄 Qaytadan boshlash / Try Again';

    container.innerHTML = `
      <div class="physics-quiz-card results-card bounce-in">
        <div class="results-trophy">${isSuper ? '🏆' : '🌟'}</div>
        <h2>${title}</h2>
        <p class="results-sub">${sub}</p>
        <div class="results-score-badge">⭐ ${this.score} / ${maxScore} ${pts}</div>
        <p class="results-msg">${msg}</p>
        <button class="btn btn-primary" onclick="window.physicsQuiz.restart()">
          ${restartBtn}
        </button>
      </div>
    `;

    if (isSuper) {
      window.physicsApp.unlockBadge('physics-genius');
    }
  }

  restart() {
    this.currentIdx = 0;
    this.score = 0;
    this.streak = 0;
    this.renderQuiz();
  }
}

window.physicsQuiz = new PhysicsQuizManager();
