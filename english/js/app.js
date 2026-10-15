/**
 * KiddoLingo - Core Application Logic
 * State Management, Bilingual (UZ/RU) UI, Navigation, Vocab Rendering, Grammar Playground, Badges, and Theme Controls
 */

class AppState {
  constructor() {
    this.stars = parseInt(localStorage.getItem('kiddo_stars') || '15', 10);
    this.gems = parseInt(localStorage.getItem('kiddo_gems') || '3', 10);
    this.streak = parseInt(localStorage.getItem('kiddo_streak') || '1', 10);
    this.soundEnabled = localStorage.getItem('kiddo_sound') !== 'false';
    this.isTurtleMode = localStorage.getItem('kiddo_turtle') === 'true';
    this.theme = localStorage.getItem('kiddo_theme') || 'light';
    this.lang = localStorage.getItem('kiddo_language') || 'uz';
    this.activeTab = 'vocab';
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.unlockedBadges = JSON.parse(localStorage.getItem('kiddo_badges') || '["first-word", "streak-star"]');
    this.wordsListened = new Set(JSON.parse(localStorage.getItem('kiddo_words_listened') || '[]'));
  }

  save() {
    localStorage.setItem('kiddo_stars', this.stars);
    localStorage.setItem('kiddo_gems', this.gems);
    localStorage.setItem('kiddo_streak', this.streak);
    localStorage.setItem('kiddo_sound', this.soundEnabled);
    localStorage.setItem('kiddo_turtle', this.isTurtleMode);
    localStorage.setItem('kiddo_theme', this.theme);
    localStorage.setItem('kiddo_language', this.lang);
    localStorage.setItem('kiddo_badges', JSON.stringify(this.unlockedBadges));
    localStorage.setItem('kiddo_words_listened', JSON.stringify([...this.wordsListened]));
    this.updateStatsUI();
  }

  setLanguage(lang) {
    this.lang = lang;
    localStorage.setItem('kiddo_language', lang);
    applyLanguageToUI(lang);
    if (window.astroCat) {
      window.astroCat.onLanguageChanged(lang);
    }
    if (window.gamificationHub) {
      window.gamificationHub.updateAllUI();
    }
  }

  addStars(n = 1) {
    this.stars += n;
    this.save();
    this.animateStat('stat-stars');
  }

  addGems(n = 1) {
    this.gems += n;
    this.save();
    this.animateStat('stat-gems');
  }

  animateStat(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.add('stat-pop');
    setTimeout(() => el.classList.remove('stat-pop'), 400);
  }

  unlockBadge(badgeId) {
    if (!this.unlockedBadges.includes(badgeId)) {
      this.unlockedBadges.push(badgeId);
      this.save();
      window.soundEngine.playSparkle();
      if (window.confettiEngine) window.confettiEngine.launch(60, 0.5, 0.4);
      
      const badge = BADGES_DATA.find(b => b.id === badgeId);
      if (badge) {
        const title = this.lang === 'ru' ? (badge.titleRu || badge.title) : badge.title;
        this.showToast(this.lang === 'ru' ? `🏆 Новое достижение: ${title}!` : `🏆 Yangi nishon ochildi: ${title}!`);
      }
      this.renderBadges();
    }
  }

  recordWordListened(wordId) {
    this.wordsListened.add(wordId);
    if (this.wordsListened.size >= 1) {
      this.unlockBadge('first-word');
    }
    if (this.wordsListened.size >= 5) {
      this.unlockBadge('vocab-explorer');
    }
    this.save();
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'kiddo-toast bounce-in';
    toast.innerHTML = `<span class="toast-icon">✨</span> <span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  updateStatsUI() {
    const starEl = document.getElementById('stat-stars-count');
    const gemEl = document.getElementById('stat-gems-count');
    const streakEl = document.getElementById('stat-streak-count');
    if (starEl) starEl.textContent = this.stars;
    if (gemEl) gemEl.textContent = this.gems;
    if (streakEl) streakEl.textContent = this.lang === 'ru' ? `${this.streak} дн.` : `${this.streak} kun`;
  }
}

window.appState = new AppState();

// Mascot Quotes & Interactions
const ZIPPY_QUOTES = {
  uz: [
    "Salom, yosh do‘stim! Bugun yangi so‘zlar o‘rganamiz! 🦊",
    "Ingliz tili - sehrli til! Har bir so‘z senga yangi dunyo ochadi! 🌟",
    "Banan 🍌 - Banana! Olma 🍎 - Apple! Juda oson, to‘g‘rimi?",
    "Toshbaqa rejimi 🐢 juda qulay, so‘zlarni sekinroq va aniqroq eshitish mumkin!",
    "Savollarga to‘g‘ri javob berib, ko‘proq yulduzchalar ⭐ to‘pla!"
  ],
  ru: [
    "Привет, юный друг! Сегодня учим новые английские слова! 🦊",
    "Английский язык — волшебный! Каждое слово открывает новый мир! 🌟",
    "Банан 🍌 — Banana! Яблоко 🍎 — Apple! Всё очень просто, правда?",
    "Режим черепахи 🐢 очень удобен — слова звучат медленнее и четче!",
    "Отвечай правильно на вопросы и собирай яркие звёздочки ⭐!"
  ]
};

const ENGLISH_UI_TRANSLATIONS = {
  uz: {
    'brand-tagline': 'Ingliz tili - Oson va Quvnoq! 🌟',
    'txt-turtle': 'Toshbaqa',
    'sound-text': 'Ovoz',
    'link-txt-math': 'Matematika',
    'link-txt-physics': 'Fizika',
    'mascot-click-hint': 'Menga bosing! 👆',
    'mascot-greeting': 'Salom, yosh do‘stim! Men Zippyman! 🎉',
    'mascot-speech-text': 'Keling, ingliz tilini birgalikda o‘rganamiz! Kartochkalarni bosing, talaffuzni tinglang va qiziqarli o‘yinlar o‘ynang!',
    'tab-txt-vocab': 'Lug‘at / Words',
    'tab-txt-grammar': 'Grammatika / Rules',
    'tab-txt-exercises': 'Mashqlar / Quizzes',
    'tab-txt-games': 'O‘yinlar / Games',
    'tab-txt-badges': 'Yutuqlar / Badges',
    'sec-vocab-title': 'Sehrli So‘zlar Olami 🌈',
    'sec-vocab-desc': 'Har bir kartochkani bosing, inglizcha talaffuzini eshiting va tarjimasini bilib oling!',
    'vocab-search-placeholder': 'So‘z qidiring (masalan: Lion, Apple, Olma, Книга)...',
    'cat-btn-all': '✨ Barchasi',
    'cat-btn-animals': '🦁 Hayvonlar',
    'cat-btn-fruits': '🍎 Mevalar & Ovqat',
    'cat-btn-colors': '🎨 Rang & Shakllar',
    'cat-btn-family': '👨‍👩‍👧 Oila & Odamlar',
    'cat-btn-nature': '🌲 Tabiat & Ob-havo',
    'cat-btn-body': '🖐️ Tana a‘zolari',
    'cat-btn-school': '📚 Maktab & Uy',
    'cat-btn-actions': '🏃‍♂️ Harakatlar',
    'cat-btn-clothes': '🧸 Kiyim & O‘yinchoq',
    'cat-btn-space': '🚀 Koinot & Vaqt',
    'sec-grammar-title': 'Qiziqarli Grammatika ✏️',
    'sec-grammar-desc': 'Qoidalarni oson rasmlar orqali tushuning va darhol sinovdan o‘tkazing!',
    'sec-exercises-title': 'Mashqlar va Sinovlar 🎯',
    'sec-exercises-desc': 'Bilimlaringizni sinab ko‘ring, to‘g‘ri javoblar uchun yulduzlar va ballar to‘plang!',
    'subtab-quiz': '❓ Viktorina (Quiz)',
    'subtab-match': '🧩 Juftlikni Top (Match)',
    'subtab-blank': '📝 Gapni To‘ldir (Fill Blank)',
    'sec-games-title': 'O‘yinlar Xiyoboni 🎮',
    'sec-games-desc': 'O‘ynab ingliz tilini yanada tezroq va qiziqroq o‘rganing!',
    'subtab-memory': '🧠 Sehrli Kartalar (Memory Match)',
    'subtab-balloon': '🎈 Havo Sharlarini Portlat (Balloon Pop)',
    'lbl-memory-moves': 'Urinishlar: ',
    'lbl-memory-time': 'Vaqt: ',
    'btn-memory-refresh': '🔄 Yangilash',
    'lbl-balloon-target': 'Topilishi kerak bo‘lgan so‘z / Target Word:',
    'lbl-balloon-score': '⭐ Ball:',
    'txt-balloon-start': '▶️ O‘yinni boshlash',
    'sec-badges-title': 'Yutuqlar va Nishonlar Zali 🏆',
    'sec-badges-desc': 'Siz erishgan barcha muvaffaqiyatlar va ochilishi kerak bo‘lgan sovg‘alar!',
    'english-footer-p1': '<strong>KiddoLingo</strong> - Bolalar uchun eng quvnoq va xavfsiz ingliz tili platformasi.',
    'english-footer-p2': 'Web Speech API va Web Audio API asosida tayyorlangan. Internet talab qilmasdan ham ravon ishlaydi!'
  },
  ru: {
    'brand-tagline': 'Английский язык — легко и весело! 🌟',
    'txt-turtle': 'Черепаха',
    'sound-text': 'Звук',
    'link-txt-math': 'Математика',
    'link-txt-physics': 'Физика',
    'mascot-click-hint': 'Нажми на меня! 👆',
    'mascot-greeting': 'Привет, юный друг! Я Зиппи! 🎉',
    'mascot-speech-text': 'Давай учить английский язык вместе! Нажимай на карточки, слушай произношение и играй в крутые игры!',
    'tab-txt-vocab': 'Словарь / Words',
    'tab-txt-grammar': 'Грамматика / Rules',
    'tab-txt-exercises': 'Упражнения / Quizzes',
    'tab-txt-games': 'Игры / Games',
    'tab-txt-badges': 'Достижения / Badges',
    'sec-vocab-title': 'Мир Волшебных Слов 🌈',
    'sec-vocab-desc': 'Нажимайте на карточки, слушайте произношение и учите перевод!',
    'vocab-search-placeholder': 'Искать слово (например: Lion, Apple, Книга, Яблоко)...',
    'cat-btn-all': '✨ Все',
    'cat-btn-animals': '🦁 Животные',
    'cat-btn-fruits': '🍎 Фрукты и еда',
    'cat-btn-colors': '🎨 Цвета и формы',
    'cat-btn-family': '👨‍👩‍👧 Семья и люди',
    'cat-btn-nature': '🌲 Природа и погода',
    'cat-btn-body': '🖐️ Части тела',
    'cat-btn-school': '📚 Школа и дом',
    'cat-btn-actions': '🏃‍♂️ Действия',
    'cat-btn-clothes': '🧸 Одежда и игрушки',
    'cat-btn-space': '🚀 Космос и время',
    'sec-grammar-title': 'Увлекательная Грамматика ✏️',
    'sec-grammar-desc': 'Понимайте правила по картинкам и закрепляйте их сразу на практике!',
    'sec-exercises-title': 'Упражнения и Тесты 🎯',
    'sec-exercises-desc': 'Проверяйте свои знания, собирайте звёзды и кристаллы за правильные ответы!',
    'subtab-quiz': '❓ Викторина (Quiz)',
    'subtab-match': '🧩 Найди пару (Match)',
    'subtab-blank': '📝 Вставь слово (Fill Blank)',
    'sec-games-title': 'Аллея Игр 🎮',
    'sec-games-desc': 'Учите английский быстрее и веселее через увлекательные игры!',
    'subtab-memory': '🧠 Волшебные карты (Memory Match)',
    'subtab-balloon': '🎈 Лопни шарики (Balloon Pop)',
    'lbl-memory-moves': 'Попытки: ',
    'lbl-memory-time': 'Время: ',
    'btn-memory-refresh': '🔄 Начать заново',
    'lbl-balloon-target': 'Слово для поиска / Target Word:',
    'lbl-balloon-score': '⭐ Очки:',
    'txt-balloon-start': '▶️ Начать игру',
    'sec-badges-title': 'Зал Достижений и Наград 🏆',
    'sec-badges-desc': 'Все ваши успехи, медали и подарки, которые можно открыть!',
    'english-footer-p1': '<strong>KiddoLingo</strong> — самая веселая и безопасная платформа английского языка для детей.',
    'english-footer-p2': 'Работает на базе Web Speech API и Web Audio API. Прекрасно функционирует даже без интернета!'
  }
};

function applyLanguageToUI(lang) {
  document.documentElement.lang = lang;
  document.title = lang === 'ru'
    ? 'KiddoLingo — Английский язык для детей | Yosh Bolalar Uchun Ingliz Tili'
    : 'KiddoLingo - Yosh Bolalar Uchun Ingliz Tili | Английский язык для детей';

  document.body.classList.add('lang-transitioning');
  setTimeout(() => {
    document.body.classList.remove('lang-transitioning');
  }, 200);

  const btnUz = document.getElementById('btn-lang-uz');
  const btnRu = document.getElementById('btn-lang-ru');
  if (btnUz) btnUz.classList.toggle('active', lang === 'uz');
  if (btnRu) btnRu.classList.toggle('active', lang === 'ru');

  const dict = ENGLISH_UI_TRANSLATIONS[lang] || ENGLISH_UI_TRANSLATIONS.uz;
  for (const [id, val] of Object.entries(dict)) {
    if (id === 'vocab-search-placeholder') {
      const input = document.getElementById('vocab-search-input');
      if (input) input.placeholder = val;
    } else {
      const el = document.getElementById(id);
      if (el) {
        if (val.includes('<')) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    }
  }

  if (window.appState) {
    window.appState.updateStatsUI();
  }
  updateSoundUI(window.appState ? window.appState.soundEnabled : true);

  renderVocabGrid();
  initGrammarSection();
  renderBadgesSection();

  if (window.exerciseManager) {
    if (typeof window.exerciseManager.renderQuiz === 'function') window.exerciseManager.renderQuiz();
    if (typeof window.exerciseManager.renderMatchGame === 'function') window.exerciseManager.renderMatchGame();
    if (typeof window.exerciseManager.renderFillBlank === 'function') window.exerciseManager.renderFillBlank();
  }

  if (window.miniGamesManager && typeof window.miniGamesManager.updateBalloonHintForLang === 'function') {
    window.miniGamesManager.updateBalloonHintForLang();
  }
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSoundControls();
  initNavigation();
  initVocabSection();
  initGrammarSection();
  initMascot();
  
  window.appState.updateStatsUI();
  window.appState.renderBadges = renderBadgesSection;
  renderBadgesSection();

  applyLanguageToUI(window.appState.lang);

  // Initialize Exercises and Games
  if (window.exerciseManager) window.exerciseManager.init();
  if (window.miniGamesManager) window.miniGamesManager.initMemoryGame();
});

// --- THEME HANDLING ---
function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle-btn');
  
  applyTheme(window.appState.theme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      window.soundEngine.playPop();
      const newTheme = window.appState.theme === 'light' ? 'dark' : 'light';
      window.appState.theme = newTheme;
      window.appState.save();
      applyTheme(newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  }
}

// --- AUDIO & SPEED CONTROLS ---
function initSoundControls() {
  const soundToggle = document.getElementById('sound-toggle-btn');
  const turtleToggle = document.getElementById('turtle-toggle-btn');

  if (soundToggle) {
    updateSoundUI(window.appState.soundEnabled);
    soundToggle.addEventListener('click', () => {
      window.appState.soundEnabled = !window.appState.soundEnabled;
      window.soundEngine.toggleSound(window.appState.soundEnabled);
      window.appState.save();
      updateSoundUI(window.appState.soundEnabled);
      if (window.appState.soundEnabled) window.soundEngine.playPop();
    });
  }

  if (turtleToggle) {
    updateTurtleUI(window.appState.isTurtleMode);
    turtleToggle.addEventListener('click', () => {
      window.appState.isTurtleMode = !window.appState.isTurtleMode;
      window.soundEngine.toggleTurtleMode(window.appState.isTurtleMode);
      window.appState.save();
      updateTurtleUI(window.appState.isTurtleMode);
      window.soundEngine.playPop();
      if (window.appState.isTurtleMode) {
        window.appState.unlockBadge('audio-master');
        window.appState.showToast(window.appState.lang === 'ru'
          ? '🐢 Режим черепахи включен! Слова звучат медленнее.'
          : '🐢 Toshbaqa rejimi yoqildi! So‘zlar sekinroq aytiladi.');
      }
    });
  }
}

function updateSoundUI(enabled) {
  const icon = document.getElementById('sound-icon');
  const text = document.getElementById('sound-text');
  const lang = window.appState ? window.appState.lang : 'uz';
  if (icon) icon.textContent = enabled ? '🔊' : '🔇';
  if (text) {
    if (lang === 'ru') {
      text.textContent = enabled ? 'Звук вкл' : 'Звук выкл';
    } else {
      text.textContent = enabled ? 'Ovoz yoqiq' : 'Ovoz o‘chiq';
    }
  }
}

function updateTurtleUI(isTurtle) {
  const turtleBtn = document.getElementById('turtle-toggle-btn');
  if (turtleBtn) {
    turtleBtn.classList.toggle('active-mode', isTurtle);
  }
}

// --- TAB NAVIGATION ---
function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const sections = document.querySelectorAll('.app-section');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      window.soundEngine.playPop();
      const targetSectionId = tab.dataset.target;

      navTabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      tab.classList.add('active');
      const targetSec = document.getElementById(targetSectionId);
      if (targetSec) targetSec.classList.add('active');

      // Mini game actions when switching tabs
      if (targetSectionId === 'section-games') {
        window.miniGamesManager.initMemoryGame();
      } else {
        window.miniGamesManager.stopBalloonGame();
      }
    });
  });

  // Sub-tabs in exercises & games
  initSubTabs('exercise-tab-btn', 'exercise-panel');
  initSubTabs('game-tab-btn', 'game-panel');
}

function initSubTabs(btnClass, panelClass) {
  const buttons = document.querySelectorAll(`.${btnClass}`);
  const panels = document.querySelectorAll(`.${panelClass}`);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundEngine.playPop();
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(btn.dataset.target);
      if (targetPanel) targetPanel.classList.add('active');

      if (btn.dataset.target === 'panel-balloon') {
        window.miniGamesManager.initBalloonGame();
      } else {
        window.miniGamesManager.stopBalloonGame();
      }
    });
  });
}

// --- VOCABULARY SECTION ---
function initVocabSection() {
  const searchInput = document.getElementById('vocab-search-input');
  const filterPills = document.querySelectorAll('.category-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      window.appState.searchQuery = e.target.value.toLowerCase().trim();
      renderVocabGrid();
    });
  }

  const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
  const freeCategories = ['all', 'animals', 'fruits', 'colors'];

  filterPills.forEach(pill => {
    const cat = pill.dataset.category;
    if (!isPro && !freeCategories.includes(cat) && !pill.querySelector('.pill-pro-lock')) {
      const lockBadge = document.createElement('span');
      lockBadge.className = 'pill-pro-lock';
      lockBadge.style.cssText = 'background: #F59E0B; color: #FFF; font-size: 0.65rem; font-weight: 800; padding: 1px 6px; border-radius: 999px; margin-left: 5px; vertical-align: middle;';
      lockBadge.textContent = '👑 PRO';
      pill.appendChild(lockBadge);
    }

    pill.addEventListener('click', () => {
      const selectedCat = pill.dataset.category;
      if (window.subscriptionManager && !window.subscriptionManager.canAccessCategory(selectedCat)) {
        return; // Soft paywall modal triggered!
      }

      window.soundEngine.playPop();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.appState.activeCategory = selectedCat;
      renderVocabGrid();
    });
  });

  renderVocabGrid();
}

function renderVocabGrid() {
  const grid = document.getElementById('vocab-cards-grid');
  if (!grid) return;

  const query = window.appState.searchQuery;
  const cat = window.appState.activeCategory;
  const lang = window.appState ? window.appState.lang : 'uz';

  const filteredWords = VOCABULARY_DATA.filter(item => {
    const matchesCat = cat === 'all' || item.category === cat;
    const matchesQuery = !query || 
      item.word.toLowerCase().includes(query) ||
      item.uzbek.toLowerCase().includes(query) ||
      item.russian.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  if (filteredWords.length === 0) {
    grid.innerHTML = lang === 'ru' ? `
      <div class="empty-vocab-notice">
        <span class="empty-emoji">🔍</span>
        <h3>Ничего не найдено / No words found</h3>
        <p>Попробуйте поискать другое слово или категорию!</p>
      </div>
    ` : `
      <div class="empty-vocab-notice">
        <span class="empty-emoji">🔍</span>
        <h3>Hech narsa topilmadi / No words found</h3>
        <p>Boshqa so‘z yoki boshqa toifani qidirib ko‘ring!</p>
      </div>
    `;
    return;
  }

  const tapHint = lang === 'ru' ? 'Подробнее ➜' : 'Batafsil ➜';

  grid.innerHTML = filteredWords.map(word => `
    <div class="word-card" id="card-${word.id}" style="--accent-color: ${word.color};" onclick="openWordModal('${word.id}')">
      <div class="card-visual-header" style="background: linear-gradient(135deg, ${word.color}22, ${word.color}55);">
        <span class="card-emoji-visual">${word.emoji}</span>
        <button class="speaker-circle-btn" onclick="event.stopPropagation(); playWordSpeech('${word.id}', '${word.word}')" title="Listen / Eshitish">
          🔊
        </button>
      </div>

      <div class="card-body">
        <div class="card-main-title">
          <h3 class="card-english-word">${word.word}</h3>
          <span class="card-phonetic">${word.phonetic}</span>
        </div>

        <p class="card-definition-en">${word.definitionEn}</p>

        <div class="card-translations-box">
          <div class="trans-item">
            <span class="trans-flag">🇺🇿</span>
            <span class="trans-text uz-trans">${word.uzbek}</span>
          </div>
          <div class="trans-item">
            <span class="trans-flag">🇷🇺</span>
            <span class="trans-text ru-trans">${word.russian}</span>
          </div>
        </div>

        <div class="card-footer-action">
          <span class="card-pill-tag">${getCategoryName(word.category)}</span>
          <span class="tap-detail-hint">${tapHint}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryName(categoryKey) {
  const lang = window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
  const uzMap = {
    all: '✨ Barchasi',
    animals: '🦁 Hayvonlar',
    fruits: '🍎 Mevalar & Ovqat',
    colors: '🎨 Rang & Shakllar',
    family: '👨‍👩‍👧 Oila & Odamlar',
    nature: '🌲 Tabiat & Ob-havo',
    body: '🖐️ Tana a‘zolari',
    school: '📚 Maktab & Uy',
    actions: '🏃‍♂️ Harakatlar',
    clothes: '🧸 Kiyim & O‘yinchoq',
    space: '🚀 Koinot & Vaqt'
  };
  const ruMap = {
    all: '✨ Все',
    animals: '🦁 Животные',
    fruits: '🍎 Фрукты и еда',
    colors: '🎨 Цвета и формы',
    family: '👨‍👩‍👧 Семья и люди',
    nature: '🌲 Природа и погода',
    body: '🖐️ Части тела',
    school: '📚 Школа и дом',
    actions: '🏃‍♂️ Действия',
    clothes: '🧸 Одежда и игрушки',
    space: '🚀 Космос и время'
  };
  const map = lang === 'ru' ? ruMap : uzMap;
  return map[categoryKey] || categoryKey;
}

function playWordSpeech(wordId, wordText) {
  const card = document.getElementById(`card-${wordId}`);
  if (card) card.classList.add('speaking-pulse');

  window.soundEngine.speak(wordText, null, () => {
    if (card) card.classList.remove('speaking-pulse');
  });

  window.appState.recordWordListened(wordId);
}

// Word Detailed View Modal
function openWordModal(wordId) {
  const word = VOCABULARY_DATA.find(w => w.id === wordId);
  if (!word) return;

  window.soundEngine.playFlip();

  const modal = document.getElementById('word-modal');
  const modalContent = document.getElementById('word-modal-content');
  if (!modal || !modalContent) return;

  const lang = window.appState ? window.appState.lang : 'uz';
  const audioBtnText = lang === 'ru' ? '🔊 Слушать / Listen' : '🔊 Eshitish / Listen';
  const exLabel = lang === 'ru' ? '✨ Пример предложения / Example Sentence:' : '✨ Namuna Jumla / Example Sentence:';

  modalContent.innerHTML = `
    <button class="modal-close-btn" onclick="closeWordModal()">✕</button>
    
    <div class="modal-hero-visual" style="background: radial-gradient(circle, ${word.color}44, ${word.color}11);">
      <span class="modal-big-emoji">${word.emoji}</span>
      <button class="big-audio-btn" onclick="playWordSpeech('${word.id}', '${word.word}')">
        ${audioBtnText}
      </button>
    </div>

    <div class="modal-info-panel">
      <div class="modal-title-row">
        <h2 class="modal-en-word">${word.word}</h2>
        <span class="modal-phonetic">${word.phonetic}</span>
      </div>

      <div class="modal-definitions">
        <div class="def-block en-def">
          <span class="badge-mini en">English</span>
          <p>${word.definitionEn}</p>
        </div>
        <div class="def-block uz-def">
          <span class="badge-mini uz">O‘zbekcha</span>
          <p><strong>${word.uzbek}:</strong> ${word.definitionUz}</p>
        </div>
        <div class="def-block ru-def">
          <span class="badge-mini ru">Русский</span>
          <p><strong>${word.russian}:</strong> ${word.definitionRu}</p>
        </div>
      </div>

      <div class="modal-example-card">
        <h4>${exLabel}</h4>
        <div class="example-en-sentence">
          <p>"${word.exampleEn}"</p>
          <button class="speaker-btn mini-speaker" onclick="window.soundEngine.speak('${word.exampleEn.replace(/'/g, "\\'")}')">🔊</button>
        </div>
        <p class="example-sub-sentence">🇺🇿 ${word.exampleUz}</p>
        <p class="example-sub-sentence">🇷🇺 ${word.exampleRu}</p>
      </div>
    </div>
  `;

  modalContent.scrollTop = 0;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playWordSpeech(word.id, word.word);
}

function closeWordModal() {
  const modal = document.getElementById('word-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal when pressing Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWordModal();
  }
});

// --- GRAMMAR SECTION ---
function initGrammarSection() {
  const container = document.getElementById('grammar-lessons-list');
  if (!container) return;

  const lang = window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');

  container.innerHTML = GRAMMAR_LESSONS.map((lesson, idx) => {
    const titleSecondary = lang === 'ru' ? (lesson.titleRu || lesson.titleUz) : lesson.titleUz;
    const explanationMain = lang === 'ru' ? (lesson.explanationRu || lesson.explanationUz) : lesson.explanationUz;
    const testerTitle = lang === 'ru' ? '🎯 Проверьте правило / Try the rule:' : '🎯 Qoidani sinab ko‘ring / Try the rule:';

    return `
    <div class="grammar-lesson-card" style="--lesson-color: ${lesson.color};">
      <div class="lesson-header">
        <div class="lesson-icon-circle" style="background-color: ${lesson.color};">
          ${lesson.icon}
        </div>
        <div class="lesson-titles">
          <span class="lesson-badge-tag">${lesson.badge}</span>
          <h3 class="lesson-en-title">${lesson.titleEn}</h3>
          <p class="lesson-uz-title">${titleSecondary}</p>
        </div>
      </div>

      <div class="lesson-body">
        <div class="lesson-explanations">
          ${explanationMain}
          ${lesson.explanationEn}
        </div>

        <div class="lesson-examples-strip">
          ${lesson.examples.map(ex => `
            <div class="example-pill-item" onclick="window.soundEngine.speak('${ex.text.replace(/[^a-zA-Z\s]/g, '').trim()}')">
              <span class="ex-icon">${ex.icon}</span>
              <strong class="ex-text">${ex.text}</strong>
              <span class="ex-sub">${ex.rule}</span>
              <span class="ex-audio-icon">🔊</span>
            </div>
          `).join('')}
        </div>

        <!-- Interactive Rule Mini-Tester -->
        <div class="interactive-rule-tester" id="grammar-test-${lesson.id}">
          <div class="test-header">
            <span>${testerTitle}</span>
          </div>
          <p class="test-question">${lesson.interactiveTest.question}</p>
          <div class="test-choices">
            ${lesson.interactiveTest.options.map((opt, optIdx) => `
              <button class="rule-choice-btn" onclick="checkGrammarRuleTest('${lesson.id}', ${optIdx}, ${lesson.interactiveTest.correct}, '${lesson.interactiveTest.explanation.replace(/'/g, "\\'")}')">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div class="rule-feedback" id="feedback-${lesson.id}" style="display: none;"></div>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

function checkGrammarRuleTest(lessonId, chosenIdx, correctIdx, explanation) {
  const container = document.getElementById(`grammar-test-${lessonId}`);
  const feedback = document.getElementById(`feedback-${lessonId}`);
  if (!container || !feedback) return;

  const lang = window.appState ? window.appState.lang : 'uz';
  const buttons = container.querySelectorAll('.rule-choice-btn');
  buttons.forEach(b => b.disabled = true);

  if (chosenIdx === correctIdx) {
    buttons[chosenIdx].classList.add('correct');
    window.soundEngine.playSuccess();
    if (window.confettiEngine) window.confettiEngine.launch(35, 0.5, 0.6);
    window.appState.addStars(2);

    feedback.className = 'rule-feedback success-feedback bounce-in';
    const msg = lang === 'ru' ? '🎉 Отлично! Правильный ответ!' : '🎉 Barakalla! To‘g‘ri javob!';
    feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
    feedback.style.display = 'block';
  } else {
    buttons[chosenIdx].classList.add('incorrect');
    buttons[correctIdx].classList.add('correct');
    window.soundEngine.playError();

    feedback.className = 'rule-feedback error-feedback shake-anim';
    const msg = lang === 'ru' ? '💡 Вспомните правило еще раз!' : '💡 Qoidani yana bir bor eslang!';
    feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
    feedback.style.display = 'block';
  }

  setTimeout(() => {
    buttons.forEach(b => {
      b.disabled = false;
      b.classList.remove('correct', 'incorrect');
    });
    feedback.style.display = 'none';
  }, 3500);
}

// --- BADGES & ACHIEVEMENTS ---
function renderBadgesSection() {
  const container = document.getElementById('badges-grid-container');
  if (!container) return;

  const unlocked = window.appState.unlockedBadges;
  const lang = window.appState ? window.appState.lang : 'uz';

  container.innerHTML = BADGES_DATA.map(badge => {
    const isUnlocked = unlocked.includes(badge.id);
    const title = lang === 'ru' ? (badge.titleRu || badge.title) : badge.title;
    const desc = lang === 'ru' ? (badge.descRu || badge.descUz) : badge.descUz;
    const status = isUnlocked 
      ? (lang === 'ru' ? '🌟 Получено!' : '🌟 Qo‘lga kiritildi!') 
      : (lang === 'ru' ? 'Еще не открыто' : 'Hali ochilmagan');

    return `
      <div class="badge-card ${isUnlocked ? 'badge-unlocked shimmer' : 'badge-locked'}">
        <div class="badge-icon-box">
          <span class="badge-emoji">${isUnlocked ? badge.icon : '🔒'}</span>
        </div>
        <div class="badge-info">
          <h4 class="badge-name">${title}</h4>
          <p class="badge-desc">${desc}</p>
          <span class="badge-status-tag">${status}</span>
        </div>
      </div>
    `;
  }).join('');
}

// --- MASCOT QUOTE INTERACTION ---
function initMascot() {
  const mascot = document.getElementById('interactive-mascot');
  const bubble = document.getElementById('mascot-speech-text');

  if (mascot && bubble) {
    mascot.addEventListener('click', () => {
      window.soundEngine.playPop();
      mascot.classList.add('mascot-bounce');
      const lang = window.appState ? window.appState.lang : 'uz';
      const quotes = ZIPPY_QUOTES[lang] || ZIPPY_QUOTES.uz;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      bubble.textContent = randomQuote;
      setTimeout(() => mascot.classList.remove('mascot-bounce'), 600);
    });
  }
}

// Expose handlers explicitly on window for HTML onclick attributes
window.openWordModal = openWordModal;
window.closeWordModal = closeWordModal;
window.playWordSpeech = playWordSpeech;
window.checkGrammarRuleTest = checkGrammarRuleTest;
window.applyLanguageToUI = applyLanguageToUI;
