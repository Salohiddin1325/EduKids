/**
 * PhysicsKids - Main Application Controller
 * Navigation, Badges, Mascot interactions, Theme, Sound, and Bilingual (Uzbek & Russian) system.
 */

const PHYSICS_BADGES = [
  { 
    id: 'first-physics', 
    icon: '🐣', 
    titleUz: 'Birinchi Qadam', 
    titleRu: 'Первый шаг',
    descUz: 'Fizika olamiga xush kelibsiz!', 
    descRu: 'Добро пожаловать в удивительный мир физики!' 
  },
  { 
    id: 'gravity-drop', 
    icon: '🍏', 
    titleUz: 'Gravitatsiya Bilimdoni', 
    titleRu: 'Знаток гравитации',
    descUz: 'Gravitatsiya minorasida buyumlarni tashlab ko‘rdingiz!', 
    descRu: 'Ты сбросил предметы в башне гравитации!' 
  },
  { 
    id: 'magnet-master', 
    icon: '🧲', 
    titleUz: 'Magnit Sehrgari', 
    titleRu: 'Мастер магнитов',
    descUz: 'Magnit qutblarini va temir buyumlarni sinadingiz!', 
    descRu: 'Исследовал полюса магнитов и металлические предметы!' 
  },
  { 
    id: 'state-changer', 
    icon: '🧊', 
    titleUz: 'Modda O‘zgartiruvchi', 
    titleRu: 'Превращатель веществ',
    descUz: 'Haroratni o‘zgartirib muz va bug‘ hosil qildingiz!', 
    descRu: 'Менял температуру и превращал воду в лед и пар!' 
  },
  { 
    id: 'maze-champ', 
    icon: '🌀', 
    titleUz: 'Labirint Qahramoni', 
    titleRu: 'Герой лабиринта',
    descUz: 'Magnit labirintida yulduzlarni to‘plab portalga yetdingiz!', 
    descRu: 'Собрал все звезды магнитом и добрался до портала!' 
  },
  { 
    id: 'physics-genius', 
    icon: '🏆', 
    titleUz: 'Fizika Dahosi', 
    titleRu: 'Гений физики',
    descUz: 'Fizika viktorinasida yuqori natijaga erishdingiz!', 
    descRu: 'Показал блестящий результат в викторине по физике!' 
  },
  { 
    id: 'streak-star', 
    icon: '🔥', 
    titleUz: 'Olovli Izlanuvchi', 
    titleRu: 'Огненный исследователь',
    descUz: 'Kunlik o‘rganish seriyasini faol saqladingiz!', 
    descRu: 'Поддерживал непрерывную ежедневную серию занятий!' 
  }
];

const SPARKY_QUOTES = {
  uz: [
    "Bzz-bzz! 💡 Men Sparkyman — fizik do‘stingizman! Har bir hodisaning o‘z qonuni bor!",
    "Bilarmidingiz? Oyda gravitatsiya kuchsiz, u yerda qushdek yengil bo‘lib qolasiz! 🌕",
    "Magnitning N va S qutblari bir-birini hech qachon aldamaydi, darhol yopishadi! 🧲",
    "Laboratoriya bo‘limiga kiring va haroratni o‘zgartirib ko‘ring! 🧊💧💨",
    "Yorug‘lik koinotdagi eng tez narsa: 1 soniyada 300 000 km! ⚡"
  ],
  ru: [
    "Бзз-бзз! 💡 Я Спарки — твой друг по физике! У каждого явления в природе есть свои законы!",
    "А ты знаешь? На Луне гравитация слабая, там ты сможешь порхать легко, как птичка! 🌕",
    "Полюса магнита N и S никогда не обманывают — они моментально притягиваются! 🧲",
    "Загляни в лабораторию и попробуй изменить температуру воды! 🧊💧💨",
    "Свет — самый быстрый во Вселенной: пролетает 300 000 км всего за одну секунду! ⚡"
  ]
};

const PHYSICS_UI_TRANSLATIONS = {
  uz: {
    brandTagline: "Fizika — Tabiat Mo‘jizalari! 💡",
    streakSuffix: "kun",
    linkEnglish: "Ingliz Tili",
    linkMath: "Matematika",
    sparkyTitle: "Bzz-bzz! Men Sparkyman — Sizning Fizik Do‘stingiz! ⚡",
    sparkySpeech: "Nega narsalar yerga tushadi? Magnitlar nimalarni tortadi? Muz qachon bug‘ga aylanadi? Keling, tabiatning eng ajoyib sirlarini birgalikda tajribalar orqali o‘rganamiz!",
    sparkyClickHint: "Menga bosing! 👆",
    tabConcepts: "Fizika Qoidalari",
    tabExperiments: "Laboratoriya & Tajribalar",
    tabSandbox: "Gravitatsiya Sandbo‘ksi",
    tabQuiz: "Sinov & Viktorina",
    tabGame: "Magnit O‘yini (Mini-Game)",
    tabBadges: "Yutuqlar & Nishonlar",
    secConceptsTitle: "Tabiat Qoidalari va Yashirin Kuchlar 🌍",
    secConceptsDesc: "Gravitatsiya, magnitizm, yorug‘lik va moddalarning ajoyib xususiyatlarini bilib oling!",
    secLabTitle: "Interaktiv Fizika Laboratoriyasi 🔬",
    secLabDesc: "Haqiqiy olimlar kabi tajribalar o‘tkazing va fizik qonunlarni o‘z ko‘zingiz bilan ko‘ring!",
    subtabGravity: "🍏 1. Gravitatsiya Minorasi",
    subtabMagnet: "🧲 2. Magnit Maydoni",
    subtabState: "🧊 3. Harorat va Modda Holati",
    lblGravityTimer: "Tushish vaqti:",
    gravityDropTxt: "⬇️ Tashlash (Drop)",
    gravityResetTxt: "🔄 Qaytarish",
    lblGravityObj: "Obyektni tanlang:",
    btnObjApple: "🍎 Olma",
    btnObjFeather: "🪶 Pat",
    btnObjBall: "🏀 Koptok",
    btnObjRock: "🪨 Og‘ir Tosh",
    lblGravityEnv: "Muhit / Gravitatsiya:",
    btnEnvEarth: "🌍 Yer (Kuchli)",
    btnEnvMoon: "🌕 Oy (6 barobar kuchsiz)",
    lblMagnetItem: "Sinab ko‘rish uchun buyum tanlang:",
    btnMagClip: "📎 Qisqich",
    btnMagNail: "🔩 Mix",
    btnMagDuck: "🦆 O‘rdakcha",
    btnMagWood: "🪵 Yog‘och",
    btnMagMag: "🧲 Ikkinchi Magnit",
    txtFlipPoles: "🔄 Qutblarni almashtirish (N ⟷ S)",
    lblTemp: "Harorat:",
    tempLbl1: "-20°C (Muz ❄️)",
    tempLbl2: "0°C (Eriydi)",
    tempLbl3: "100°C (Qaynaydi 🔥)",
    tempLbl4: "120°C (Bug‘ 💨)",
    presetFreeze: "❄️ Sovutish (-10°C)",
    presetRoom: "💧 Xona harorati (25°C)",
    presetBoil: "🔥 Qaynatish (105°C)",
    secQuizTitle: "Fizika Sinovlari va Viktorina 🎯",
    secQuizDesc: "Bilimlaringizni sinang, to‘g‘ri javoblarni topib yulduzlar va ballar to‘plang!",
    secGameTitle: "Magnit Labirinti va Yulduzlar Qutqaruvi 🧲",
    secGameDesc: "Sichqoncha yoki barmog‘ingiz bilan temir sharchani magnit yordamida labirintdan olib chiqing!",
    mazeScoreLabel: "⭐ Ball:",
    mazeStarsLabel: "Yulduzlar:",
    mazeStartBtn: "▶️ O‘yinni Boshlash / Start Game",
    secBadgesTitle: "Fizika Yutuqlari va Nishonlar Zali 🏆",
    secBadgesDesc: "Tajribalar o‘tkazib to‘plagan ilmiy darajalaringiz va nishonlaringiz!",
    footerP1: "<strong>PhysicsKids</strong> — Yosh bolalar uchun eng qiziqarli fizika akademiyasi.",
    footerP2: "Hech qanday internet yoki server talab qilmasdan, kompyuter va planshetlarda to‘liq ishlaydi!"
  },
  ru: {
    brandTagline: "Физика — Чудеса Природы! 💡",
    streakSuffix: "дн.",
    linkEnglish: "Английский Язык",
    linkMath: "Математика",
    sparkyTitle: "Бзз-бзз! Я Спарки — твой друг по физике! ⚡",
    sparkySpeech: "Почему предметы падают на землю? Что притягивают магниты? Когда лед превращается в пар? Давай вместе откроем тайны природы через опыты!",
    sparkyClickHint: "Нажми на меня! 👆",
    tabConcepts: "Законы Физики",
    tabExperiments: "Лаборатория и Опыты",
    tabSandbox: "Песочница Гравитации",
    tabQuiz: "Тесты и Викторина",
    tabGame: "Игра Магнит (Мини-игра)",
    tabBadges: "Достижения и Значки",
    secConceptsTitle: "Законы Природы и Невидимые Силы 🌍",
    secConceptsDesc: "Узнайте удивительные свойства гравитации, магнетизма, света и состояний вещества!",
    secLabTitle: "Интерактивная Лаборатория Физики 🔬",
    secLabDesc: "Проводите опыты как настоящие ученые и наблюдайте физические законы своими глазами!",
    subtabGravity: "🍏 1. Башня Гравитации",
    subtabMagnet: "🧲 2. Магнитное Поле",
    subtabState: "🧊 3. Температура и Вещество",
    lblGravityTimer: "Время падения:",
    gravityDropTxt: "⬇️ Сбросить (Drop)",
    gravityResetTxt: "🔄 Сброс",
    lblGravityObj: "Выберите предмет:",
    btnObjApple: "🍎 Яблоко",
    btnObjFeather: "🪶 Перо",
    btnObjBall: "🏀 Мяч",
    btnObjRock: "🪨 Камень",
    lblGravityEnv: "Среда / Гравитация:",
    btnEnvEarth: "🌍 Земля (Сильная)",
    btnEnvMoon: "🌕 Луна (В 6 раз слабее)",
    lblMagnetItem: "Выберите предмет для опыта:",
    btnMagClip: "📎 Скрепка",
    btnMagNail: "🔩 Гвоздь",
    btnMagDuck: "🦆 Уточка",
    btnMagWood: "🪵 Дерево",
    btnMagMag: "🧲 Второй Магнит",
    txtFlipPoles: "🔄 Сменить полюса (N ⟷ S)",
    lblTemp: "Температура:",
    tempLbl1: "-20°C (Лед ❄️)",
    tempLbl2: "0°C (Тает)",
    tempLbl3: "100°C (Кипит 🔥)",
    tempLbl4: "120°C (Пар 💨)",
    presetFreeze: "❄️ Заморозить (-10°C)",
    presetRoom: "💧 Комнатная (25°C)",
    presetBoil: "🔥 Вскипятить (105°C)",
    secQuizTitle: "Тесты по Физике и Викторина 🎯",
    secQuizDesc: "Проверьте свои знания, находите правильные ответы и собирайте звезды!",
    secGameTitle: "Магнитный Лабиринт и Звезды 🧲",
    secGameDesc: "С помощью мышки или пальца проведите металлический шарик через лабиринт магнитом!",
    mazeScoreLabel: "⭐ Очки:",
    mazeStarsLabel: "Звезды:",
    mazeStartBtn: "▶️ Начать Игру / Start Game",
    secBadgesTitle: "Достижения по Физике и Зал Значков 🏆",
    secBadgesDesc: "Ваши научные звания и значки, заработанные в ходе экспериментов!",
    footerP1: "<strong>PhysicsKids</strong> — Самая увлекательная академия физики для детей.",
    footerP2: "Работает 100% без интернета и серверов на компьютерах и планшетах!"
  }
};

class PhysicsApp {
  constructor() {
    this.lang = localStorage.getItem('kiddo_language') || 'uz';
    this.stars = parseInt(localStorage.getItem('physics_stars') || '25', 10);
    this.gems = parseInt(localStorage.getItem('physics_gems') || '6', 10);
    this.streak = parseInt(localStorage.getItem('physics_streak') || '1', 10);
    this.soundEnabled = localStorage.getItem('physics_sound') !== 'false';
    this.theme = localStorage.getItem('physics_theme') || 'light';
    this.unlockedBadges = JSON.parse(localStorage.getItem('physics_badges') || '["first-physics"]');
  }

  save() {
    localStorage.setItem('physics_stars', this.stars);
    localStorage.setItem('physics_gems', this.gems);
    localStorage.setItem('physics_streak', this.streak);
    localStorage.setItem('physics_sound', this.soundEnabled);
    localStorage.setItem('physics_theme', this.theme);
    localStorage.setItem('physics_badges', JSON.stringify(this.unlockedBadges));
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

    const t = PHYSICS_UI_TRANSLATIONS[lang] || PHYSICS_UI_TRANSLATIONS.uz;

    // Header
    const brand = document.getElementById('physics-brand-tagline');
    if (brand) brand.textContent = t.brandTagline;
    const linkEn = document.getElementById('link-txt-english');
    if (linkEn) linkEn.textContent = t.linkEnglish;
    const linkMath = document.getElementById('link-txt-math');
    if (linkMath) linkMath.textContent = t.linkMath;

    // Hero
    const sparkyTitle = document.getElementById('sparky-title');
    if (sparkyTitle) sparkyTitle.textContent = t.sparkyTitle;
    const sparkySpeech = document.getElementById('sparky-speech-text');
    if (sparkySpeech) sparkySpeech.textContent = t.sparkySpeech;
    const sparkyHint = document.getElementById('sparky-click-hint');
    if (sparkyHint) sparkyHint.textContent = t.sparkyClickHint;

    // Tabs
    const tabC = document.getElementById('tab-txt-concepts');
    if (tabC) tabC.textContent = t.tabConcepts;
    const tabE = document.getElementById('tab-txt-experiments');
    if (tabE) tabE.textContent = t.tabExperiments;
    const tabS = document.getElementById('tab-txt-sandbox');
    if (tabS) tabS.textContent = t.tabSandbox;
    const tabQ = document.getElementById('tab-txt-quiz');
    if (tabQ) tabQ.textContent = t.tabQuiz;
    const tabG = document.getElementById('tab-txt-game');
    if (tabG) tabG.textContent = t.tabGame;
    const tabB = document.getElementById('tab-txt-badges');
    if (tabB) tabB.textContent = t.tabBadges;

    // Section 1
    const secCTitle = document.getElementById('sec-concepts-title');
    if (secCTitle) secCTitle.textContent = t.secConceptsTitle;
    const secCDesc = document.getElementById('sec-concepts-desc');
    if (secCDesc) secCDesc.textContent = t.secConceptsDesc;

    // Section 2 (Lab)
    const secLTitle = document.getElementById('sec-lab-title');
    if (secLTitle) secLTitle.textContent = t.secLabTitle;
    const secLDesc = document.getElementById('sec-lab-desc');
    if (secLDesc) secLDesc.textContent = t.secLabDesc;

    const subG = document.getElementById('subtab-gravity');
    if (subG) subG.textContent = t.subtabGravity;
    const subM = document.getElementById('subtab-magnet');
    if (subM) subM.textContent = t.subtabMagnet;
    const subS = document.getElementById('subtab-state');
    if (subS) subS.textContent = t.subtabState;

    const lblGTimer = document.getElementById('lbl-gravity-timer');
    if (lblGTimer) lblGTimer.textContent = t.lblGravityTimer;
    const gDropTxt = document.getElementById('gravity-drop-txt');
    if (gDropTxt) gDropTxt.textContent = t.gravityDropTxt;
    const gResetTxt = document.getElementById('gravity-reset-txt');
    if (gResetTxt) gResetTxt.textContent = t.gravityResetTxt;

    const lblGObj = document.getElementById('lbl-gravity-obj');
    if (lblGObj) lblGObj.textContent = t.lblGravityObj;
    const btnObjApple = document.getElementById('btn-obj-apple');
    if (btnObjApple) btnObjApple.textContent = t.btnObjApple;
    const btnObjFeather = document.getElementById('btn-obj-feather');
    if (btnObjFeather) btnObjFeather.textContent = t.btnObjFeather;
    const btnObjBall = document.getElementById('btn-obj-ball');
    if (btnObjBall) btnObjBall.textContent = t.btnObjBall;
    const btnObjRock = document.getElementById('btn-obj-rock');
    if (btnObjRock) btnObjRock.textContent = t.btnObjRock;

    const lblGEnv = document.getElementById('lbl-gravity-env');
    if (lblGEnv) lblGEnv.textContent = t.lblGravityEnv;
    const btnEnvEarth = document.getElementById('btn-env-earth');
    if (btnEnvEarth) btnEnvEarth.textContent = t.btnEnvEarth;
    const btnEnvMoon = document.getElementById('btn-env-moon');
    if (btnEnvMoon) btnEnvMoon.textContent = t.btnEnvMoon;

    const lblMItem = document.getElementById('lbl-magnet-item');
    if (lblMItem) lblMItem.textContent = t.lblMagnetItem;
    const btnMagClip = document.getElementById('btn-mag-clip');
    if (btnMagClip) btnMagClip.textContent = t.btnMagClip;
    const btnMagNail = document.getElementById('btn-mag-nail');
    if (btnMagNail) btnMagNail.textContent = t.btnMagNail;
    const btnMagDuck = document.getElementById('btn-mag-duck');
    if (btnMagDuck) btnMagDuck.textContent = t.btnMagDuck;
    const btnMagWood = document.getElementById('btn-mag-wood');
    if (btnMagWood) btnMagWood.textContent = t.btnMagWood;
    const btnMagMag = document.getElementById('btn-mag-mag');
    if (btnMagMag) btnMagMag.textContent = t.btnMagMag;
    const txtFlip = document.getElementById('txt-flip-poles');
    if (txtFlip) txtFlip.textContent = t.txtFlipPoles;

    const lblTemp = document.getElementById('lbl-temp');
    if (lblTemp) lblTemp.textContent = t.lblTemp;
    const tL1 = document.getElementById('temp-lbl-1');
    if (tL1) tL1.textContent = t.tempLbl1;
    const tL2 = document.getElementById('temp-lbl-2');
    if (tL2) tL2.textContent = t.tempLbl2;
    const tL3 = document.getElementById('temp-lbl-3');
    if (tL3) tL3.textContent = t.tempLbl3;
    const tL4 = document.getElementById('temp-lbl-4');
    if (tL4) tL4.textContent = t.tempLbl4;

    const pFreeze = document.getElementById('preset-freeze-btn');
    if (pFreeze) pFreeze.textContent = t.presetFreeze;
    const pRoom = document.getElementById('preset-room-btn');
    if (pRoom) pRoom.textContent = t.presetRoom;
    const pBoil = document.getElementById('preset-boil-btn');
    if (pBoil) pBoil.textContent = t.presetBoil;

    // Section 3 (Quiz)
    const secQTitle = document.getElementById('sec-quiz-title');
    if (secQTitle) secQTitle.textContent = t.secQuizTitle;
    const secQDesc = document.getElementById('sec-quiz-desc');
    if (secQDesc) secQDesc.textContent = t.secQuizDesc;

    // Section 4 (Game)
    const secGameTitle = document.getElementById('sec-game-title');
    if (secGameTitle) secGameTitle.textContent = t.secGameTitle;
    const secGameDesc = document.getElementById('sec-game-desc');
    if (secGameDesc) secGameDesc.textContent = t.secGameDesc;
    const mScoreLabel = document.getElementById('maze-score-label');
    if (mScoreLabel) mScoreLabel.textContent = t.mazeScoreLabel;
    const mStarsLabel = document.getElementById('maze-stars-label');
    if (mStarsLabel) mStarsLabel.textContent = t.mazeStarsLabel;

    // Section 5 (Badges)
    const secBTitle = document.getElementById('sec-badges-title');
    if (secBTitle) secBTitle.textContent = t.secBadgesTitle;
    const secBDesc = document.getElementById('sec-badges-desc');
    if (secBDesc) secBDesc.textContent = t.secBadgesDesc;

    // Footer
    const ft1 = document.getElementById('physics-footer-p1');
    if (ft1) ft1.innerHTML = t.footerP1;
    const ft2 = document.getElementById('physics-footer-p2');
    if (ft2) ft2.textContent = t.footerP2;

    this.updateStatsUI();
    this.renderBadges();

    if (window.physicsConcepts) window.physicsConcepts.renderConcepts();
    if (window.physicsQuiz) window.physicsQuiz.renderQuiz();
    if (window.physicsLab) {
      window.physicsLab.resetGravityDrop();
      window.physicsLab.testMagnetInteraction();
      if (window.physicsLab.updateState) window.physicsLab.updateState(window.physicsLab.temperature);
    }
    if (window.magnetMazeGame) {
      window.magnetMazeGame.updatePoleButtonText();
    }
    if (window.physicsSandbox) window.physicsSandbox.updateLanguage();
    if (window.astroCat) window.astroCat.onLanguageChanged(lang);
    if (window.gamificationHub) window.gamificationHub.updateAllUI();
  }

  addStars(n = 1) {
    this.stars += n;
    this.save();
    this.animateStat('physics-stat-stars');
  }

  addGems(n = 1) {
    this.gems += n;
    this.save();
    this.animateStat('physics-stat-gems');
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
      window.physicsAudio.playFanfare();
      if (window.physicsConfetti) window.physicsConfetti.launch(60, 0.5, 0.4);

      const b = PHYSICS_BADGES.find(item => item.id === badgeId);
      if (b) {
        const title = this.lang === 'ru' ? b.titleRu : b.titleUz;
        const prefix = this.lang === 'ru' ? "🏆 Открыт новый значок: " : "🏆 Yangi nishon ochildi: ";
        this.showToast(`${prefix}${title}!`);
      }
      this.renderBadges();
    }
  }

  showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'physics-toast bounce-in';
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
    const container = document.getElementById('physics-badges-grid');
    if (!container) return;

    const isRu = this.lang === 'ru';
    const unlockedTag = isRu ? '🌟 Получено!' : '🌟 Qo‘lga kiritildi!';
    const lockedTag = isRu ? 'Еще заблокировано' : 'Hali ochilmagan';

    container.innerHTML = PHYSICS_BADGES.map(badge => {
      const isUnlocked = this.unlockedBadges.includes(badge.id);
      const title = isRu ? badge.titleRu : badge.titleUz;
      const desc = isRu ? badge.descRu : badge.descUz;

      return `
        <div class="p-badge-card ${isUnlocked ? 'badge-unlocked shimmer' : 'badge-locked'}">
          <div class="p-badge-icon-box">
            <span class="badge-emoji">${isUnlocked ? badge.icon : '🔒'}</span>
          </div>
          <div class="p-badge-info">
            <h4 class="p-badge-name">${title}</h4>
            <p class="p-badge-desc">${desc}</p>
            <span class="p-badge-status-tag">${isUnlocked ? unlockedTag : lockedTag}</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.physicsApp = new PhysicsApp();

document.addEventListener('DOMContentLoaded', () => {
  initNavTabs();
  initLabSubTabs();
  initSoundControls();
  initThemeControls();
  initSparkyMascot();

  const savedLang = localStorage.getItem('kiddo_language') || 'uz';
  window.physicsApp.setLanguage(savedLang);

  if (window.physicsLab) window.physicsLab.init();
  if (window.physicsQuiz) window.physicsQuiz.init();
  if (window.magnetMazeGame) window.magnetMazeGame.init();
  if (window.physicsSandbox) window.physicsSandbox.init();
});

function initNavTabs() {
  const tabs = document.querySelectorAll('.physics-nav-btn');
  const sections = document.querySelectorAll('.physics-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      window.physicsAudio.playPop();
      const target = tab.dataset.target;

      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetSec = document.getElementById(target);
      if (targetSec) targetSec.classList.add('active');

      if (target === 'sec-physics-game') {
        window.magnetMazeGame.resize();
      } else {
        window.magnetMazeGame.stop();
      }

      if (target === 'sec-physics-sandbox' && window.physicsSandbox) {
        setTimeout(() => {
          window.physicsSandbox.resizeCanvas();
          window.physicsSandbox.start();
        }, 40);
      } else if (window.physicsSandbox) {
        window.physicsSandbox.stop();
      }
    });
  });
}

function initLabSubTabs() {
  const subBtns = document.querySelectorAll('.lab-sub-btn');
  const subPanels = document.querySelectorAll('.lab-panel');

  subBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.physicsAudio.playPop();
      subBtns.forEach(b => b.classList.remove('active'));
      subPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.target);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

function initSoundControls() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.physicsApp.soundEnabled = !window.physicsApp.soundEnabled;
      window.physicsAudio.toggleSound(window.physicsApp.soundEnabled);
      window.physicsApp.save();
      const icon = document.getElementById('sound-icon');
      if (icon) icon.textContent = window.physicsApp.soundEnabled ? '🔊' : '🔇';
      if (window.physicsApp.soundEnabled) window.physicsAudio.playPop();
    });
  }
}

function initThemeControls() {
  const btn = document.getElementById('theme-toggle-btn');
  if (btn) {
    applyTheme(window.physicsApp.theme);
    btn.addEventListener('click', () => {
      window.physicsAudio.playPop();
      const newTheme = window.physicsApp.theme === 'light' ? 'dark' : 'light';
      window.physicsApp.theme = newTheme;
      window.physicsApp.save();
      applyTheme(newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
}

function initSparkyMascot() {
  const mascot = document.getElementById('sparky-mascot');
  const bubble = document.getElementById('sparky-speech-text');

  if (mascot && bubble) {
    mascot.addEventListener('click', () => {
      window.physicsAudio.playPop();
      mascot.classList.add('mascot-bounce');
      const lang = window.physicsApp ? window.physicsApp.lang : 'uz';
      const quotes = SPARKY_QUOTES[lang] || SPARKY_QUOTES.uz;
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      bubble.textContent = q;
      setTimeout(() => mascot.classList.remove('mascot-bounce'), 600);
    });
  }
}
