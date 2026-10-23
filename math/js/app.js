/**
 * MathKids - Main Application Controller
 * Handles Navigation, State, Mascots, Badges, Whiteboard, and Bilingual (Uzbek & Russian) system.
 */

const MATH_BADGES = [
  { 
    id: 'first-math', 
    icon: '🐣', 
    titleUz: 'Birinchi Qadam', 
    titleRu: 'Первый шаг',
    descUz: 'Birinchi matematik misolni yechdingiz!',
    descRu: 'Ты решил свой первый математический пример!' 
  },
  { 
    id: 'streak-math', 
    icon: '🔥', 
    titleUz: 'Olovli Matematik', 
    titleRu: 'Огненный математик',
    descUz: 'Ketma-ket 5 ta misolga to‘g‘ri javob berdingiz!',
    descRu: 'Правильно решил 5 примеров подряд!' 
  },
  { 
    id: 'plus-prodigy', 
    icon: '➕', 
    titleUz: 'Qo‘shish Ustasi', 
    titleRu: 'Мастер сложения',
    descUz: 'Qo‘shish amalini mukammal o‘rgandingiz!',
    descRu: 'Превосходно освоил операцию сложения!' 
  },
  { 
    id: 'minus-ninja', 
    icon: '➖', 
    titleUz: 'Ayrish Ninjasi', 
    titleRu: 'Ниндзя вычитания',
    descUz: 'Ayrish amallarini chaqqonlik bilan yechdingiz!',
    descRu: 'Ловко решил примеры на вычитание!' 
  },
  { 
    id: 'mult-master', 
    icon: '✖️', 
    titleUz: 'Karrasiga Ko‘paytiruvchi', 
    titleRu: 'Повелитель умножения',
    descUz: 'Ko‘paytirish jadvalini kashf qildingiz!',
    descRu: 'Открыл для себя таблицу умножения!' 
  },
  { 
    id: 'rocket-master', 
    icon: '🚀', 
    titleUz: 'Kosmik Mergan', 
    titleRu: 'Космический стрелок',
    descUz: 'Raketa o‘yinida 100 ball to‘pladingiz!',
    descRu: 'Набрал 100 очков в игре с космической ракетой!' 
  },
  { 
    id: 'speed-demon', 
    icon: '⚡', 
    titleUz: 'Yashin Tezligi', 
    titleRu: 'Скорость молнии',
    descUz: '60 soniyali poygada 10+ misol yechdingiz!',
    descRu: 'Решил более 10 примеров за 60 секунд!' 
  },
  { 
    id: 'chalk-artist', 
    icon: '🎨', 
    titleUz: 'Qoralama Doska', 
    titleRu: 'Мастер черновика',
    descUz: 'Qoralama doskadan foydalanib hisob-kitob qildingiz!',
    descRu: 'Использовал доску для вычислений!' 
  }
];

const COSMO_QUOTES = {
  uz: [
    "Bip-bop! 🤖 Men Cosmo — matematika robotiman! 1 + 1 = 2 ekanligini bilarmiding?",
    "Har qanday katta hisob-kitobni Qoralama Doskada 📝 yechish mumkin!",
    "Ko‘paytirish — bu oddiygina tezkor qo‘shish demakdir! ⚡",
    "Raketa o‘yinida asteroidlarni lazer bilan portlatib ko‘rdingizmi? 🚀",
    "Matematika — bu koinotning eng sehrli tili! 🌌"
  ],
  ru: [
    "Бип-боп! 🤖 Я Космо — робот математики! А ты знаешь, что 1 + 1 = 2?",
    "Любой сложный пример можно легко решить на доске-черновике! 📝",
    "Умножение — это быстрое и удобное сложение! ⚡",
    "Ты уже взрывал астероиды космическим лазером в игре с ракетой? 🚀",
    "Математика — самый удивительный и волшебный язык во Вселенной! 🌌"
  ]
};

const MATH_UI_TRANSLATIONS = {
  uz: {
    brandTagline: "Matematika — Oson va Qiziqarli! 🔢",
    streakSuffix: "kun",
    scratchpadBtn: "Qoralama",
    linkEnglish: "Ingliz Tili",
    linkMath: "Matematika",
    linkPhysics: "Fizika",
    cosmoTitle: "Bip-bop! Men Cosmo — Matematika Do‘stingizman! 🌟",
    cosmoSpeech: "Keling, raqamlar sehrini birga kashf qilamiz! Narsalarni sanang, misollarni yeching va raketangiz bilan asteroidlarni portlating!",
    cosmoClickHint: "Menga bosing! 👆",
    tabLessons: "Qoidalar & Ko‘rgazmalar",
    tabMultiplication: "Karra Jadvali",
    tabPractice: "Mashqlar & Misollar",
    tabFractions: "Pitsa Kasrlar",
    tabGame: "Raketa O‘yini (Mini-Game)",
    tabBadges: "Yutuqlar & Nishonlar",
    secMultTitle: "Interaktiv Karra Jadvali ✖️",
    secMultDesc: "Istalgan katakchani bosing, vizual mevali savatchalar orqali hisoblang va talaffuzini tinglang!",
    secLessonsTitle: "Matematika Qoidalari va Jonli Hisoblagichlar 🍎",
    secLessonsDesc: "Qo‘shish, ayrish, ko‘paytirish va bo‘lishni vizual mevalar va yulduzlar orqali o‘rganing!",
    secPracticeTitle: "Misollar Generatori va Mashqlar 🎯",
    secPracticeDesc: "Amallarni va qiyinlik darajasini tanlang, to‘g‘ri javoblarni topib yulduzlar yutib oling!",
    lblOp: "Amal:",
    btnOpAdd: "➕ Qo‘shish",
    btnOpSub: "➖ Ayrish",
    btnOpMul: "✖️ Ko‘paytirish",
    btnOpDiv: "➗ Bo‘lish",
    btnOpMix: "🔀 Aralash",
    lblDiff: "Daraja:",
    btnDiffEasy: "🌱 Oson (1-10)",
    btnDiffMed: "⭐ O‘rtacha (1-50)",
    btnDiffHard: "🔥 Qiyin (1-100)",
    lblMode: "Rejim:",
    btnModeZen: "🧘 Xotirjam (Zen)",
    btnModeSpeed: "⚡ Tezkor (60s Poyga)",
    secGameTitle: "Kosmik Raketa va Asteroidlar O‘yini 🚀",
    secGameDesc: "Tepadagi matematik topshiriqni hisoblang va to‘g‘ri javobli asteroidni lazer bilan portlating!",
    hudScore: "⭐ Ball:",
    hudLives: "Qalqon:",
    hudCombo: "Kombinatsiya:",
    rocketStartBtn: "🚀 O‘yinni boshlash / Launch Game",
    secBadgesTitle: "Matematik Yutuqlar va Nishonlar 🏆",
    secBadgesDesc: "Hisoblash orqali to‘plangan yulduzlaringiz va zabt etilgan cho‘qqilaringiz!",
    scratchpadHeader: "Qoralama Doska (Scratchpad)",
    wbEraser: "O‘chirg‘ich",
    wbClear: "Tozalash",
    wbGrid: "Katak",
    footerP1: "<strong>MathKids</strong> — Yosh bolalar uchun eng qiziqarli matematika akademiyasi.",
    footerP2: "Hech qanday internet yoki server talab qilmasdan, kompyuter va planshetlarda to‘liq ishlaydi!"
  },
  ru: {
    brandTagline: "Математика — просто и весело! 🔢",
    streakSuffix: "дн.",
    scratchpadBtn: "Черновик",
    linkEnglish: "Английский",
    linkMath: "Математика",
    linkPhysics: "Физика",
    cosmoTitle: "Бип-боп! Я Космо — твой друг по математике! 🌟",
    cosmoSpeech: "Давай вместе откроем магию чисел! Считай предметы, решай примеры и взрывай астероиды своей ракетой!",
    cosmoClickHint: "Нажми на меня! 👆",
    tabLessons: "Правила и Наглядности",
    tabMultiplication: "Таблица Умножения",
    tabPractice: "Упражнения и Примеры",
    tabFractions: "Дроби с Пиццей",
    tabGame: "Игра Ракета (Мини-игра)",
    tabBadges: "Достижения и Значки",
    secMultTitle: "Интерактивная Таблица Умножения ✖️",
    secMultDesc: "Нажимайте на ячейки, считайте с наглядными фруктами и слушайте произношение!",
    secLessonsTitle: "Правила Математики и Живые Счетчики 🍎",
    secLessonsDesc: "Изучайте сложение, вычитание, умножение и деление с наглядными фруктами и звездами!",
    secPracticeTitle: "Генератор Примеров и Упражнения 🎯",
    secPracticeDesc: "Выбирайте действие и уровень сложности, находите правильные ответы и выигрывайте звезды!",
    lblOp: "Действие:",
    btnOpAdd: "➕ Сложение",
    btnOpSub: "➖ Вычитание",
    btnOpMul: "✖️ Умножение",
    btnOpDiv: "➗ Деление",
    btnOpMix: "🔀 Смешанный",
    lblDiff: "Уровень:",
    btnDiffEasy: "🌱 Легко (1-10)",
    btnDiffMed: "⭐ Средне (1-50)",
    btnDiffHard: "🔥 Сложно (1-100)",
    lblMode: "Режим:",
    btnModeZen: "🧘 Спокойный (Zen)",
    btnModeSpeed: "⚡ Быстрый (60с Гонка)",
    secGameTitle: "Космическая Ракета и Астероиды 🚀",
    secGameDesc: "Решите математическую задачу наверху и взорвите лазером астероид с правильным ответом!",
    hudScore: "⭐ Очки:",
    hudLives: "Щит:",
    hudCombo: "Комбо:",
    rocketStartBtn: "🚀 Начать игру / Launch Game",
    secBadgesTitle: "Математические Достижения и Значки 🏆",
    secBadgesDesc: "Ваши звезды и покоренные вершины в мире математики!",
    scratchpadHeader: "Доска для черновика (Scratchpad)",
    wbEraser: "Ластик",
    wbClear: "Очистить",
    wbGrid: "Клетка",
    footerP1: "<strong>MathKids</strong> — Самая увлекательная академия математики для детей.",
    footerP2: "Работает 100% без интернета и серверов на компьютерах и планшетах!"
  }
};

class MathApp {
  constructor() {
    this.lang = localStorage.getItem('kiddo_language') || 'uz';
    this.stars = parseInt(localStorage.getItem('math_stars') || '20', 10);
    this.gems = parseInt(localStorage.getItem('math_gems') || '5', 10);
    this.streak = parseInt(localStorage.getItem('math_streak') || '1', 10);
    this.soundEnabled = localStorage.getItem('math_sound') !== 'false';
    this.theme = localStorage.getItem('math_theme') || 'light';
    this.unlockedBadges = JSON.parse(localStorage.getItem('math_badges') || '["first-math"]');
  }

  save() {
    localStorage.setItem('math_stars', this.stars);
    localStorage.setItem('math_gems', this.gems);
    localStorage.setItem('math_streak', this.streak);
    localStorage.setItem('math_sound', this.soundEnabled);
    localStorage.setItem('math_theme', this.theme);
    localStorage.setItem('math_badges', JSON.stringify(this.unlockedBadges));
    this.updateStatsUI();
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('kiddo_language', lang);
    document.documentElement.lang = lang;

    document.body.classList.add('lang-transitioning');
    setTimeout(() => {
      document.body.classList.remove('lang-transitioning');
    }, 200);

    const btnUz = document.getElementById('btn-lang-uz');
    const btnRu = document.getElementById('btn-lang-ru');
    if (btnUz && btnRu) {
      btnUz.classList.toggle('active', lang === 'uz');
      btnRu.classList.toggle('active', lang === 'ru');
    }

    const t = MATH_UI_TRANSLATIONS[lang] || MATH_UI_TRANSLATIONS.uz;

    // Update Header
    const brandTagline = document.getElementById('math-brand-tagline');
    if (brandTagline) brandTagline.textContent = t.brandTagline;
    const txtScratch = document.getElementById('txt-scratchpad');
    if (txtScratch) txtScratch.textContent = t.scratchpadBtn;
    const linkEn = document.getElementById('link-txt-english');
    if (linkEn) linkEn.textContent = t.linkEnglish;
    const linkMath = document.getElementById('link-txt-math');
    if (linkMath) linkMath.textContent = t.linkMath;
    const linkPh = document.getElementById('link-txt-physics');
    if (linkPh) linkPh.textContent = t.linkPhysics;

    // Update Hero
    const cosmoTitle = document.getElementById('cosmo-title');
    if (cosmoTitle) cosmoTitle.textContent = t.cosmoTitle;
    const cosmoSpeech = document.getElementById('cosmo-speech-text');
    if (cosmoSpeech) cosmoSpeech.textContent = t.cosmoSpeech;
    const cosmoClick = document.getElementById('cosmo-click-hint');
    if (cosmoClick) cosmoClick.textContent = t.cosmoClickHint;

    // Update Nav Tabs
    const tabL = document.getElementById('tab-txt-lessons');
    if (tabL) tabL.textContent = t.tabLessons;
    const tabM = document.getElementById('tab-txt-multiplication');
    if (tabM) tabM.textContent = t.tabMultiplication;
    const tabP = document.getElementById('tab-txt-practice');
    if (tabP) tabP.textContent = t.tabPractice;
    const tabF = document.getElementById('tab-txt-fractions');
    if (tabF) tabF.textContent = t.tabFractions;
    const tabG = document.getElementById('tab-txt-game');
    if (tabG) tabG.textContent = t.tabGame;
    const tabB = document.getElementById('tab-txt-badges');
    if (tabB) tabB.textContent = t.tabBadges;

    // Update Section 0.5 (Karra Jadvali)
    const secMTitle = document.getElementById('sec-mult-title');
    if (secMTitle) secMTitle.textContent = t.secMultTitle;
    const secMDesc = document.getElementById('sec-mult-desc');
    if (secMDesc) secMDesc.textContent = t.secMultDesc;

    // Update Section 1
    const secLTitle = document.getElementById('sec-lessons-title');
    if (secLTitle) secLTitle.textContent = t.secLessonsTitle;
    const secLDesc = document.getElementById('sec-lessons-desc');
    if (secLDesc) secLDesc.textContent = t.secLessonsDesc;

    // Update Section 2
    const secPTitle = document.getElementById('sec-practice-title');
    if (secPTitle) secPTitle.textContent = t.secPracticeTitle;
    const secPDesc = document.getElementById('sec-practice-desc');
    if (secPDesc) secPDesc.textContent = t.secPracticeDesc;
    const lblOp = document.getElementById('lbl-op');
    if (lblOp) lblOp.textContent = t.lblOp;
    const btnOpAdd = document.getElementById('btn-op-add');
    if (btnOpAdd) btnOpAdd.textContent = t.btnOpAdd;
    const btnOpSub = document.getElementById('btn-op-sub');
    if (btnOpSub) btnOpSub.textContent = t.btnOpSub;
    const btnOpMul = document.getElementById('btn-op-mul');
    if (btnOpMul) btnOpMul.textContent = t.btnOpMul;
    const btnOpDiv = document.getElementById('btn-op-div');
    if (btnOpDiv) btnOpDiv.textContent = t.btnOpDiv;
    const btnOpMix = document.getElementById('btn-op-mix');
    if (btnOpMix) btnOpMix.textContent = t.btnOpMix;

    const lblDiff = document.getElementById('lbl-diff');
    if (lblDiff) lblDiff.textContent = t.lblDiff;
    const btnDiffEasy = document.getElementById('btn-diff-easy');
    if (btnDiffEasy) btnDiffEasy.textContent = t.btnDiffEasy;
    const btnDiffMed = document.getElementById('btn-diff-med');
    if (btnDiffMed) btnDiffMed.textContent = t.btnDiffMed;
    const btnDiffHard = document.getElementById('btn-diff-hard');
    if (btnDiffHard) btnDiffHard.textContent = t.btnDiffHard;

    const lblMode = document.getElementById('lbl-mode');
    if (lblMode) lblMode.textContent = t.lblMode;
    const btnModeZen = document.getElementById('btn-mode-zen');
    if (btnModeZen) btnModeZen.textContent = t.btnModeZen;
    const btnModeSpeed = document.getElementById('btn-mode-speed');
    if (btnModeSpeed) btnModeSpeed.textContent = t.btnModeSpeed;

    // Update Section 3
    const secGTitle = document.getElementById('sec-game-title');
    if (secGTitle) secGTitle.textContent = t.secGameTitle;
    const secGDesc = document.getElementById('sec-game-desc');
    if (secGDesc) secGDesc.textContent = t.secGameDesc;
    const hudScore = document.getElementById('hud-score-label');
    if (hudScore) hudScore.textContent = t.hudScore;
    const hudLives = document.getElementById('hud-lives-label');
    if (hudLives) hudLives.textContent = t.hudLives;
    const hudCombo = document.getElementById('hud-combo-label');
    if (hudCombo) hudCombo.textContent = t.hudCombo;

    // Update Section 4
    const secBTitle = document.getElementById('sec-badges-title');
    if (secBTitle) secBTitle.textContent = t.secBadgesTitle;
    const secBDesc = document.getElementById('sec-badges-desc');
    if (secBDesc) secBDesc.textContent = t.secBadgesDesc;

    // Update Scratchpad
    const spHeader = document.getElementById('scratchpad-header-txt');
    if (spHeader) spHeader.textContent = t.scratchpadHeader;
    const wbEraser = document.getElementById('wb-eraser-txt');
    if (wbEraser) wbEraser.textContent = t.wbEraser;
    const wbClear = document.getElementById('wb-clear-txt');
    if (wbClear) wbClear.textContent = t.wbClear;
    const wbGrid = document.getElementById('wb-grid-txt');
    if (wbGrid) wbGrid.textContent = t.wbGrid;

    // Update Footer
    const ft1 = document.getElementById('math-footer-p1');
    if (ft1) ft1.innerHTML = t.footerP1;
    const ft2 = document.getElementById('math-footer-p2');
    if (ft2) ft2.textContent = t.footerP2;

    this.updateStatsUI();
    this.renderBadges();

    if (window.lessonsManager) window.lessonsManager.renderLessons();
    if (window.practiceManager) window.practiceManager.renderProblemUI();
    if (window.fractionSandbox) window.fractionSandbox.init();
    if (window.astroCat) window.astroCat.onLanguageChanged(lang);
    if (window.gamificationHub) window.gamificationHub.updateAllUI();
    if (window.EduKidsPWA) window.EduKidsPWA.setLanguage(lang);
  }

  addStars(n = 1) {
    this.stars += n;
    this.save();
    this.animateStat('math-stat-stars');
  }

  addGems(n = 1) {
    this.gems += n;
    this.save();
    this.animateStat('math-stat-gems');
  }

  animateStat(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('stat-pop');
    setTimeout(() => el.classList.remove('stat-pop'), 400);
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      this.save();
      window.mathAudio.playFanfare();
      if (window.mathConfetti) window.mathConfetti.launch(60, 0.5, 0.4);

      const badge = MATH_BADGES.find(b => b.id === badgeId);
      if (badge) {
        const title = this.lang === 'ru' ? badge.titleRu : badge.titleUz;
        const prefix = this.lang === 'ru' ? "🏆 Открыт новый значок: " : "🏆 Yangi nishon ochildi: ";
        this.showToast(`${prefix}${title}!`);
      }
      this.renderBadges();
    }
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'math-toast bounce-in';
    toast.innerHTML = `<span class="toast-icon">✨</span> <span>${msg}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  updateStatsUI() {
    const sEl = document.getElementById('stat-stars-count');
    const gEl = document.getElementById('stat-gems-count');
    const stEl = document.getElementById('stat-streak-count');
    const suffix = this.lang === 'ru' ? 'дн.' : 'kun';
    if (sEl) sEl.textContent = this.stars;
    if (gEl) gEl.textContent = this.gems;
    if (stEl) stEl.textContent = `${this.streak} ${suffix}`;
  }

  renderBadges() {
    const container = document.getElementById('math-badges-grid');
    if (!container) return;

    const isRu = this.lang === 'ru';
    const unlockedTag = isRu ? '🌟 Получено!' : '🌟 Qo‘lga kiritildi!';
    const lockedTag = isRu ? 'Еще заблокировано' : 'Hali ochilmagan';

    container.innerHTML = MATH_BADGES.map(badge => {
      const isUnlocked = this.unlockedBadges.includes(badge.id);
      const title = isRu ? badge.titleRu : badge.titleUz;
      const desc = isRu ? badge.descRu : badge.descUz;

      return `
        <div class="badge-card ${isUnlocked ? 'badge-unlocked shimmer' : 'badge-locked'}">
          <div class="badge-icon-box">
            <span class="badge-emoji">${isUnlocked ? badge.icon : '🔒'}</span>
          </div>
          <div class="badge-info">
            <h4 class="badge-name">${title}</h4>
            <p class="badge-desc">${desc}</p>
            <span class="badge-status-tag">${isUnlocked ? unlockedTag : lockedTag}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.mathApp = new MathApp();

document.addEventListener('DOMContentLoaded', () => {
  initNavTabs();
  initSoundControls();
  initThemeControls();
  initCosmoMascot();

  const savedLang = localStorage.getItem('kiddo_language') || 'uz';
  window.mathApp.setLanguage(savedLang);

  if (window.practiceManager) window.practiceManager.init();
  if (window.whiteboard) window.whiteboard.init();
  if (window.mathRocketGame) window.mathRocketGame.init();
  if (window.fractionSandbox) window.fractionSandbox.init();
  if (window.mathMultiplication) window.mathMultiplication.init();
});

function initNavTabs() {
  const tabs = document.querySelectorAll('.math-nav-btn');
  const sections = document.querySelectorAll('.math-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      window.mathAudio.playPop();
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetSec = document.getElementById(target);
      if (targetSec) targetSec.classList.add('active');

      if (target === 'sec-rocket-game') {
        window.mathRocketGame.resize();
      } else {
        window.mathRocketGame.stop();
      }

      if (target === 'sec-multiplication' && window.mathMultiplication) {
        window.mathMultiplication.init();
      }
    });
  });
}

function initSoundControls() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    const icon = document.getElementById('sound-icon');
    if (icon) icon.textContent = window.mathApp.soundEnabled ? '🔊' : '🔇';
    btn.addEventListener('click', () => {
      window.mathApp.soundEnabled = !window.mathApp.soundEnabled;
      window.mathAudio.toggleSound(window.mathApp.soundEnabled);
      window.mathApp.save();
      if (icon) icon.textContent = window.mathApp.soundEnabled ? '🔊' : '🔇';
      if (window.mathApp.soundEnabled) window.mathAudio.playPop();
    });
  }
}

function initThemeControls() {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    applyTheme(window.mathApp.theme);
    btn.addEventListener('click', () => {
      window.mathAudio.playPop();
      const newTheme = window.mathApp.theme === 'light' ? 'dark' : 'light';
      window.mathApp.theme = newTheme;
      window.mathApp.save();
      applyTheme(newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
}

function initCosmoMascot() {
  const mascot = document.getElementById('cosmo-mascot');
  const bubble = document.getElementById('cosmo-speech-text');

  if (mascot && bubble) {
    mascot.addEventListener('click', () => {
      if (window.mathAudio && window.mathAudio.playPop) window.mathAudio.playPop();
      mascot.classList.add('mascot-bounce');
      const lang = window.mathApp ? window.mathApp.lang : 'uz';
      const quotes = COSMO_QUOTES[lang] || COSMO_QUOTES.uz;
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      bubble.textContent = q;

      // Speak aloud for kid interaction
      if (lang === 'uz' && window.uzbekSpeech) {
        window.uzbekSpeech.speak(q);
      } else if (window.kiddoAudio) {
        window.kiddoAudio.speak(q, lang === 'ru' ? 'ru-RU' : 'en-US');
      }

      setTimeout(() => mascot.classList.remove('mascot-bounce'), 600);
    });
  }
}
