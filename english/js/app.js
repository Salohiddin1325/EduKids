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
    this.activeLetter = null;
    this.searchQuery = '';
    this.vocabPage = 1;
    this.vocabPageSize = 24;
    this.unlockedBadges = JSON.parse(localStorage.getItem('kiddo_badges') || '["first-word", "streak-star"]');
    this.wordsListened = new Set(JSON.parse(localStorage.getItem('kiddo_words_listened') || '[]'));
  }

  setLetterFilter(letter) {
    if (this.activeLetter === letter) {
      this.activeLetter = null;
    } else {
      this.activeLetter = letter;
    }
    this.vocabPage = 1;
    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }
    updatePhonicsUI();
    renderVocabGrid();
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
    if (window.EduKidsPWA) {
      window.EduKidsPWA.setLanguage(lang);
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

// 26 Letters Alphabet & Phonics Dataset
const ALPHABET_PHONICS_DATA = [
  { letter: 'A', phonics: '/æ/', word: 'Apple', emoji: '🍎', uzbek: 'Olma', russian: 'Яблоко', speech: 'A is for Apple! /æ/ Apple!', color: '#EF4444' },
  { letter: 'B', phonics: '/b/', word: 'Bear', emoji: '🐻', uzbek: 'Ayiq', russian: 'Медведь', speech: 'B is for Bear! /b/ Bear!', color: '#F97316' },
  { letter: 'C', phonics: '/k/', word: 'Cat', emoji: '🐱', uzbek: 'Mushuk', russian: 'Кошка', speech: 'C is for Cat! /k/ Cat!', color: '#F59E0B' },
  { letter: 'D', phonics: '/d/', word: 'Dog', emoji: '🐶', uzbek: 'Kuchuk', russian: 'Собака', speech: 'D is for Dog! /d/ Dog!', color: '#10B981' },
  { letter: 'E', phonics: '/e/', word: 'Elephant', emoji: '🐘', uzbek: 'Fil', russian: 'Слон', speech: 'E is for Elephant! /e/ Elephant!', color: '#06B6D4' },
  { letter: 'F', phonics: '/f/', word: 'Fish', emoji: '🐟', uzbek: 'Baliq', russian: 'Рыба', speech: 'F is for Fish! /f/ Fish!', color: '#3B82F6' },
  { letter: 'G', phonics: '/ɡ/', word: 'Giraffe', emoji: '🦒', uzbek: 'Jirafa', russian: 'Жираф', speech: 'G is for Giraffe! /g/ Giraffe!', color: '#8B5CF6' },
  { letter: 'H', phonics: '/h/', word: 'Hat', emoji: '🎩', uzbek: 'Shlyapa', russian: 'Шляпа', speech: 'H is for Hat! /h/ Hat!', color: '#EC4899' },
  { letter: 'I', phonics: '/ɪ/', word: 'Igloo', emoji: '🧊', uzbek: 'Muz uy', russian: 'Иглу', speech: 'I is for Igloo! /ɪ/ Igloo!', color: '#06D6A0' },
  { letter: 'J', phonics: '/dʒ/', word: 'Juice', emoji: '🧃', uzbek: 'Sharbat', russian: 'Сок', speech: 'J is for Juice! /dʒ/ Juice!', color: '#F59E0B' },
  { letter: 'K', phonics: '/k/', word: 'Kite', emoji: '🪁', uzbek: 'Varrak', russian: 'Воздушный змей', speech: 'K is for Kite! /k/ Kite!', color: '#6366F1' },
  { letter: 'L', phonics: '/l/', word: 'Lion', emoji: '🦁', uzbek: 'Sher', russian: 'Лев', speech: 'L is for Lion! /l/ Lion!', color: '#E11D48' },
  { letter: 'M', phonics: '/m/', word: 'Monkey', emoji: '🐵', uzbek: 'Maymun', russian: 'Обезьяна', speech: 'M is for Monkey! /m/ Monkey!', color: '#845EC2' },
  { letter: 'N', phonics: '/n/', word: 'Nest', emoji: '🪹', uzbek: 'Uya', russian: 'Гнездо', speech: 'N is for Nest! /n/ Nest!', color: '#10B981' },
  { letter: 'O', phonics: '/ɒ/', word: 'Orange', emoji: '🍊', uzbek: 'Apelsin', russian: 'Апельсин', speech: 'O is for Orange! /ɒ/ Orange!', color: '#FF7B00' },
  { letter: 'P', phonics: '/p/', word: 'Panda', emoji: '🐼', uzbek: 'Panda', russian: 'Панда', speech: 'P is for Panda! /p/ Panda!', color: '#334155' },
  { letter: 'Q', phonics: '/kw/', word: 'Queen', emoji: '👑', uzbek: 'Malika', russian: 'Королева', speech: 'Q is for Queen! /kw/ Queen!', color: '#D97706' },
  { letter: 'R', phonics: '/r/', word: 'Rabbit', emoji: '🐰', uzbek: 'Quyon', russian: 'Кролик', speech: 'R is for Rabbit! /r/ Rabbit!', color: '#FB7185' },
  { letter: 'S', phonics: '/s/', word: 'Sun', emoji: '☀️', uzbek: 'Quyosh', russian: 'Солнце', speech: 'S is for Sun! /s/ Sun!', color: '#FBBF24' },
  { letter: 'T', phonics: '/t/', word: 'Tiger', emoji: '🐯', uzbek: 'Yo‘lbars', russian: 'Тигр', speech: 'T is for Tiger! /t/ Tiger!', color: '#F97316' },
  { letter: 'U', phonics: '/ʌ/', word: 'Umbrella', emoji: '☂️', uzbek: 'Soyabon', russian: 'Зонт', speech: 'U is for Umbrella! /ʌ/ Umbrella!', color: '#8B5CF6' },
  { letter: 'V', phonics: '/v/', word: 'Violin', emoji: '🎻', uzbek: 'Skripka', russian: 'Скрипка', speech: 'V is for Violin! /v/ Violin!', color: '#9333EA' },
  { letter: 'W', phonics: '/w/', word: 'Whale', emoji: '🐳', uzbek: 'Kit', russian: 'Кит', speech: 'W is for Whale! /w/ Whale!', color: '#0EA5E9' },
  { letter: 'X', phonics: '/ks/', word: 'Xylophone', emoji: '🎹', uzbek: 'Ksilofon', russian: 'Ксилофон', speech: 'X is for Xylophone! /ks/ Xylophone!', color: '#14B8A6' },
  { letter: 'Y', phonics: '/j/', word: 'Yo-yo', emoji: '🪀', uzbek: 'Yo-yo', russian: 'Йо-йо', speech: 'Y is for Yo-yo! /j/ Yo-yo!', color: '#EC4899' },
  { letter: 'Z', phonics: '/z/', word: 'Zebra', emoji: '🦓', uzbek: 'Zebra', russian: 'Зебра', speech: 'Z is for Zebra! /z/ Zebra!', color: '#475569' }
];

const ENGLISH_UI_TRANSLATIONS = {
  uz: {
    'brand-tagline': 'Ingliz tili - Oson va Quvnoq! 🌟',
    'txt-turtle': 'Toshbaqa',
    'sound-text': 'Ovoz',
    'link-txt-english': 'Ingliz Tili',
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
    'phonics-header-title': 'Sehrli Harflar va Fonika (26 Harf)',
    'phonics-header-desc': 'Har bir harfni bosing, fonetik talaffuzini eshiting va ushbu harf bilan boshlanadigan so‘zlarni ko‘ring!',
    'phonics-txt-all': 'Barchasi (All)',
    'vocab-search-placeholder': 'So‘z qidiring (masalan: Lion, Apple, Olma, Книга)...',
    'cat-btn-all': '✨ Barchasi (500)',
    'cat-btn-animals': '🦁 Hayvonlar (25)',
    'cat-btn-fruits': '🍎 Mevalar (25)',
    'cat-btn-space': '🚀 Koinot (25)',
    'cat-btn-vehicles': '🚗 Transport (25)',
    'cat-btn-emotions': '😊 Hissiyotlar (25)',
    'cat-btn-school': '📚 Maktab (25)',
    'cat-btn-jobs': '👩‍⚕️ Kasblar (25)',
    'cat-btn-nature': '🌲 Tabiat (25)',
    'cat-btn-body': '🖐️ Tana a‘zolari (25)',
    'cat-btn-colors': '🎨 Ranglar (25)',
    'cat-btn-shapes': '🔺 Shakllar (25)',
    'cat-btn-house': '🏠 Uy & Jihozlar (25)',
    'cat-btn-verbs': '🏃 Harakatlar (25)',
    'cat-btn-adjectives': '🌟 Sifatlar (25)',
    'cat-btn-weather': '☀️ Ob-havo (25)',
    'cat-btn-food': '🍕 Taomlar (25)',
    'cat-btn-sports': '⚽ Sport (25)',
    'cat-btn-clothing': '👕 Kiyimlar (25)',
    'cat-btn-family': '👨‍👩‍👧 Oila (25)',
    'cat-btn-time': '⏰ Vaqt & Fasllar (25)',
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
    'subtab-builder': '🔤 So‘z Yig‘uvchi (Word Builder)',
    'lbl-memory-moves': 'Urinishlar: ',
    'lbl-memory-time': 'Vaqt: ',
    'btn-memory-refresh': '🔄 Yangilash',
    'lbl-balloon-target': 'Topilishi kerak bo‘lgan so‘z / Target Word:',
    'lbl-balloon-score': '⭐ Ball:',
    'txt-balloon-start': '▶️ O‘yinni boshlash',
    'builder-clue-label': 'Topilishi kerak bo‘lgan so‘z:',
    'builder-bank-hint': '👇 Harflarni to‘g‘ri tartibda bosing:',
    'sec-badges-title': 'Yutuqlar va Nishonlar Zali 🏆',
    'sec-badges-desc': 'Siz erishgan barcha muvaffaqiyatlar va ochilishi kerak bo‘lgan sovg‘alar!',
    'english-footer-p1': '<strong>KiddoLingo</strong> - Bolalar uchun eng quvnoq va xavfsiz ingliz tili platformasi.',
    'english-footer-p2': 'Web Speech API va Web Audio API asosida tayyorlangan. Internet talab qilmasdan ham ravon ishlaydi!'
  },
  ru: {
    'brand-tagline': 'Английский язык — легко и весело! 🌟',
    'txt-turtle': 'Черепаха',
    'sound-text': 'Звук',
    'link-txt-english': 'Английский',
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
    'phonics-header-title': 'Волшебные Буквы и Фоника (26 Букв)',
    'phonics-header-desc': 'Нажимайте на буквы, слушайте фонетическое звучание и открывайте слова на эту букву!',
    'phonics-txt-all': 'Все (All)',
    'vocab-search-placeholder': 'Искать слово (например: Lion, Apple, Книга, Яблоко)...',
    'cat-btn-all': '✨ Все (500)',
    'cat-btn-animals': '🦁 Животные (25)',
    'cat-btn-fruits': '🍎 Фрукты (25)',
    'cat-btn-space': '🚀 Космос (25)',
    'cat-btn-vehicles': '🚗 Транспорт (25)',
    'cat-btn-emotions': '😊 Эмоции (25)',
    'cat-btn-school': '📚 Школа (25)',
    'cat-btn-jobs': '👩‍⚕️ Профессии (25)',
    'cat-btn-nature': '🌲 Природа (25)',
    'cat-btn-body': '🖐️ Части тела (25)',
    'cat-btn-colors': '🎨 Цвета (25)',
    'cat-btn-shapes': '🔺 Формы (25)',
    'cat-btn-house': '🏠 Дом и уют (25)',
    'cat-btn-verbs': '🏃 Действия / Глаголы (25)',
    'cat-btn-adjectives': '🌟 Прилагательные (25)',
    'cat-btn-weather': '☀️ Погода (25)',
    'cat-btn-food': '🍕 Еда (25)',
    'cat-btn-sports': '⚽ Спорт (25)',
    'cat-btn-clothing': '👕 Одежда (25)',
    'cat-btn-family': '👨‍👩‍👧 Семья (25)',
    'cat-btn-time': '⏰ Время и сезоны (25)',
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
    'subtab-builder': '🔤 Собери слово (Word Builder)',
    'lbl-memory-moves': 'Попытки: ',
    'lbl-memory-time': 'Время: ',
    'btn-memory-refresh': '🔄 Начать заново',
    'lbl-balloon-target': 'Слово для поиска / Target Word:',
    'lbl-balloon-score': '⭐ Очки:',
    'txt-balloon-start': '▶️ Начать игру',
    'builder-clue-label': 'Слово для сборки:',
    'builder-bank-hint': '👇 Нажимайте на буквы по порядку:',
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
  renderPhonicsLetters();
  initGrammarSection();
  renderBadgesSection();

  if (window.exerciseManager) {
    if (typeof window.exerciseManager.renderQuiz === 'function') window.exerciseManager.renderQuiz();
    if (typeof window.exerciseManager.renderMatchGame === 'function') window.exerciseManager.renderMatchGame();
    if (typeof window.exerciseManager.renderFillBlank === 'function') window.exerciseManager.renderFillBlank();
  }

  if (window.miniGamesManager) {
    if (typeof window.miniGamesManager.updateBalloonHintForLang === 'function') {
      window.miniGamesManager.updateBalloonHintForLang();
    }
    if (typeof window.miniGamesManager.renderBuilderUI === 'function') {
      window.miniGamesManager.renderBuilderUI();
    }
  }
}

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSoundControls();
  initNavigation();
  initPhonicsSection();
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
        const activeSubBtn = document.querySelector('.game-tab-btn.active');
        const target = activeSubBtn ? activeSubBtn.dataset.target : 'panel-memory';
        if (target === 'panel-wordbuilder') {
          window.miniGamesManager.stopBalloonGame();
          window.miniGamesManager.initWordBuilderGame();
        } else if (target === 'panel-balloon') {
          window.miniGamesManager.initBalloonGame();
        } else {
          window.miniGamesManager.stopBalloonGame();
          window.miniGamesManager.initMemoryGame();
        }
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

      if (btn.dataset.target === 'panel-wordbuilder') {
        window.miniGamesManager.stopBalloonGame();
        window.miniGamesManager.initWordBuilderGame();
      } else if (btn.dataset.target === 'panel-balloon') {
        window.miniGamesManager.initBalloonGame();
      } else if (btn.dataset.target === 'panel-memory') {
        window.miniGamesManager.stopBalloonGame();
        window.miniGamesManager.initMemoryGame();
      } else {
        window.miniGamesManager.stopBalloonGame();
      }
    });
  });
}

// --- 26 LETTERS ALPHABET & PHONICS ---
function initPhonicsSection() {
  renderPhonicsLetters();
}

function renderPhonicsLetters() {
  const grid = document.getElementById('phonics-letters-grid');
  if (!grid) return;

  const activeLetter = window.appState ? window.appState.activeLetter : null;

  grid.innerHTML = ALPHABET_PHONICS_DATA.map(item => {
    const isActive = activeLetter === item.letter;
    return `
      <button type="button" 
        class="phonics-letter-btn ${isActive ? 'active' : ''}" 
        id="phonics-btn-${item.letter}"
        style="--letter-color: ${item.color};"
        onclick="playPhonicsLetter('${item.letter}')"
        title="${item.letter} - ${item.word}">
        <span class="phonics-letter-char">${item.letter}</span>
        <span class="phonics-letter-emoji">${item.emoji}</span>
      </button>
    `;
  }).join('');

  updatePhonicsUI();
}

function updatePhonicsUI() {
  const activeLetter = window.appState ? window.appState.activeLetter : null;
  const allBtn = document.getElementById('btn-phonics-all');
  if (allBtn) {
    allBtn.classList.toggle('active', !activeLetter);
  }

  document.querySelectorAll('.phonics-letter-btn').forEach(btn => {
    const l = btn.id.replace('phonics-btn-', '');
    btn.classList.toggle('active', l === activeLetter);
  });

  const spotlight = document.getElementById('phonics-spotlight-card');
  if (!spotlight) return;

  if (!activeLetter) {
    spotlight.style.display = 'none';
    return;
  }

  const item = ALPHABET_PHONICS_DATA.find(p => p.letter === activeLetter);
  if (!item) {
    spotlight.style.display = 'none';
    return;
  }

  const lang = window.appState ? window.appState.lang : 'uz';
  const isRu = lang === 'ru';
  const meaning = isRu ? item.russian : item.uzbek;

  spotlight.innerHTML = `
    <div class="phonics-spotlight-inner" style="border-left: 6px solid ${item.color};">
      <div class="phonics-spotlight-left">
        <div class="phonics-big-letter" style="background: ${item.color};">${item.letter}</div>
        <div class="phonics-badge-sound">${item.phonics}</div>
      </div>
      <div class="phonics-spotlight-content">
        <div class="phonics-exemplar-row">
          <span class="phonics-exemplar-emoji">${item.emoji}</span>
          <div>
            <h4 class="phonics-exemplar-word">${item.word}</h4>
            <span class="phonics-exemplar-trans">${meaning}</span>
          </div>
        </div>
        <p class="phonics-speech-cue">"${item.letter} is for ${item.word}! ${item.phonics} ${item.word}!"</p>
      </div>
      <div class="phonics-spotlight-actions">
        <button type="button" class="btn btn-primary phonics-speak-btn" onclick="playPhonicsLetter('${item.letter}')">
          🔊 ${isRu ? 'Слушать фонику' : 'Fonikani Tinglash'}
        </button>
        <button type="button" class="btn btn-ctrl phonics-close-btn" onclick="window.appState.setLetterFilter(null)">
          ✕
        </button>
      </div>
    </div>
  `;
  spotlight.style.display = 'block';
}

function playPhonicsLetter(letterChar) {
  const item = ALPHABET_PHONICS_DATA.find(p => p.letter === letterChar);
  if (!item) return;

  if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
    window.soundEngine.playPop();
  }

  const btn = document.getElementById(`phonics-btn-${letterChar}`);
  if (btn) {
    btn.classList.add('phonics-bounce');
    setTimeout(() => btn.classList.remove('phonics-bounce'), 450);
  }

  // Set letter filter & show spotlight
  window.appState.activeLetter = letterChar;
  window.appState.vocabPage = 1;
  updatePhonicsUI();
  renderVocabGrid();

  // Speak phonics with clear pronunciation
  if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
    window.soundEngine.speak(item.speech);
  }

  if (window.gamificationHub) {
    window.gamificationHub.addXP(2, 'English Phonics');
  }
}

// --- VOCABULARY SECTION ---
function initVocabSection() {
  const searchInput = document.getElementById('vocab-search-input');
  const filterPills = document.querySelectorAll('.category-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      window.appState.searchQuery = e.target.value.toLowerCase().trim();
      window.appState.vocabPage = 1;
      renderVocabGrid();
    });
  }

  const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
  const freeCategories = ['all', 'animals', 'fruits'];

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
      window.soundEngine.playPop();
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.appState.activeCategory = selectedCat;
      window.appState.vocabPage = 1;
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
  const letter = window.appState.activeLetter;
  const lang = window.appState ? window.appState.lang : 'uz';
  const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

  const filteredWords = VOCABULARY_DATA.filter(item => {
    const matchesCat = cat === 'all' || item.category === cat;
    const matchesLetter = !letter || item.word.toUpperCase().startsWith(letter);
    const matchesQuery = !query || 
      item.word.toLowerCase().includes(query) ||
      item.uzbek.toLowerCase().includes(query) ||
      item.russian.toLowerCase().includes(query);
    return matchesCat && matchesLetter && matchesQuery;
  });

  const paginationContainer = document.getElementById('vocab-pagination-controls');

  if (filteredWords.length === 0) {
    grid.innerHTML = lang === 'ru' ? `
      <div class="empty-vocab-notice" style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
        <span class="empty-emoji" style="font-size: 3.5rem; display: block; margin-bottom: 12px;">🔍</span>
        <h3>Ничего не найдено / No words found</h3>
        <p>Попробуйте поискать другое слово или категорию!</p>
      </div>
    ` : `
      <div class="empty-vocab-notice" style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
        <span class="empty-emoji" style="font-size: 3.5rem; display: block; margin-bottom: 12px;">🔍</span>
        <h3>Hech narsa topilmadi / No words found</h3>
        <p>Boshqa so‘z yoki boshqa toifani qidirib ko‘ring!</p>
      </div>
    `;
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // Pagination calculation
  const totalItems = filteredWords.length;
  const pageSize = window.appState.vocabPageSize || 24;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (window.appState.vocabPage > totalPages) window.appState.vocabPage = totalPages;
  if (window.appState.vocabPage < 1) window.appState.vocabPage = 1;
  const currentPage = window.appState.vocabPage;
  const startIndex = (currentPage - 1) * pageSize;
  const pageWords = filteredWords.slice(startIndex, startIndex + pageSize);

  const tapHint = lang === 'ru' ? 'Подробнее ➜' : 'Batafsil ➜';

  grid.innerHTML = pageWords.map(word => {
    const globalIndex = VOCABULARY_DATA.indexOf(word);
    const isLocked = !isPro && globalIndex >= 50;

    const clickAction = isLocked 
      ? `openVocabPaywall('${word.id}')`
      : `openWordModal('${word.id}')`;

    const speechAction = isLocked
      ? `event.stopPropagation(); openVocabPaywall('${word.id}')`
      : `event.stopPropagation(); playWordSpeech('${word.id}', '${word.word.replace(/'/g, "\\'")}', event)`;

    const lockBadge = isLocked
      ? `<span class="card-lock-badge">🔒 Pro ($2/oy)</span>`
      : '';

    return `
      <div class="word-card ${isLocked ? 'card-pro-locked' : ''}" id="card-${word.id}" style="--accent-color: ${word.color};" onclick="${clickAction}">
        <div class="card-visual-header" style="background: linear-gradient(135deg, ${word.color}22, ${word.color}55);">
          ${lockBadge}
          <span class="card-emoji-visual">${word.emoji}</span>
          <button class="speaker-circle-btn" onclick="${speechAction}" title="${isLocked ? 'Pro A‘zolik ($2/oy)' : 'Listen / Eshitish'}">
            ${isLocked ? '🔒' : '🔊'}
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
            <span class="tap-detail-hint">${isLocked ? '🔒 Pro ($2/oy)' : tapHint}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  renderVocabPagination(totalPages, totalItems, currentPage, lang);
}

function renderVocabPagination(totalPages, totalItems, currentPage, lang) {
  const container = document.getElementById('vocab-pagination-controls');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = `
      <div class="vocab-pagination-info">
        ${lang === 'ru' ? `Показаны все ${totalItems} слов` : `Barcha ${totalItems} ta so‘z ko‘rsatilmoqda`}
      </div>
    `;
    return;
  }

  const prevText = lang === 'ru' ? '◀ Назад' : '◀ Oldingi';
  const nextText = lang === 'ru' ? 'Вперёд ▶' : 'Keyingi ▶';
  const infoText = lang === 'ru'
    ? `Страница ${currentPage} из ${totalPages} (Всего ${totalItems} слов)`
    : `Sahifa ${currentPage} / ${totalPages} (Jami ${totalItems} ta so‘z)`;

  // Smart page numbers
  let pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const buttonsHtml = pages.map(p => {
    if (p === '...') {
      return `<span style="padding: 0 6px; font-weight: 800; color: #94A3B8;">...</span>`;
    }
    const isActive = p === currentPage;
    return `
      <button class="vocab-page-btn ${isActive ? 'active' : ''}" onclick="goToVocabPage(${p})">
        ${p}
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="vocab-pagination-info">${infoText}</div>
    <div class="vocab-pagination-nav">
      <button class="vocab-page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToVocabPage(${currentPage - 1})">
        ${prevText}
      </button>
      ${buttonsHtml}
      <button class="vocab-page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToVocabPage(${currentPage + 1})">
        ${nextText}
      </button>
    </div>
  `;
}

window.goToVocabPage = function(page) {
  if (page < 1) return;
  window.appState.vocabPage = page;
  if (window.soundEngine && window.soundEngine.playPop) window.soundEngine.playPop();
  renderVocabGrid();
  const sec = document.getElementById('section-vocab');
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

window.openVocabPaywall = function(wordId) {
  const word = VOCABULARY_DATA.find(w => w.id === wordId);
  if (window.soundEngine && window.soundEngine.playBoing) window.soundEngine.playBoing();
  if (window.subscriptionManager) {
    window.subscriptionManager.openVocabPaywallModal(word);
  }
};

function getCategoryName(categoryKey) {
  const lang = window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
  const uzMap = {
    all: '✨ Barchasi',
    animals: '🦁 Hayvonlar',
    fruits: '🍎 Mevalar',
    space: '🚀 Koinot',
    vehicles: '🚗 Transport',
    emotions: '😊 Hissiyotlar',
    school: '📚 Maktab',
    jobs: '👨‍⚕️ Kasblar',
    nature: '🌲 Tabiat',
    body: '🖐️ Tana',
    colors: '🎨 Ranglar',
    shapes: '📐 Shakllar',
    house: '🏠 Uy jihozlari',
    verbs: '🏃 Harakatlar (Fe‘llar)',
    actions: '🏃 Harakatlar (Fe‘llar)',
    adjectives: '✨ Sifatlar',
    weather: '⛅ Ob-havo',
    food: '🍕 Ovqatlar',
    sports: '⚽ Sport',
    clothing: '👕 Kiyimlar',
    clothes: '👕 Kiyimlar',
    family: '👨‍👩‍👧 Oila',
    time: '⏰ Vaqt'
  };
  const ruMap = {
    all: '✨ Все',
    animals: '🦁 Животные',
    fruits: '🍎 Фрукты',
    space: '🚀 Космос',
    vehicles: '🚗 Транспорт',
    emotions: '😊 Эмоции',
    school: '📚 Школа',
    jobs: '👨‍⚕️ Профессии',
    nature: '🌲 Природа',
    body: '🖐️ Части тела',
    colors: '🎨 Цвета',
    shapes: '📐 Формы',
    house: '🏠 Дом и уют',
    verbs: '🏃 Действия (Глаголы)',
    actions: '🏃 Действия (Глаголы)',
    adjectives: '✨ Прилагательные',
    weather: '⛅ Погода',
    food: '🍕 Еда',
    sports: '⚽ Спорт',
    clothing: '👕 Одежда',
    clothes: '👕 Одежда',
    family: '👨‍👩‍👧 Семья',
    time: '⏰ Время'
  };
  const map = lang === 'ru' ? ruMap : uzMap;
  return map[categoryKey] || categoryKey;
}

function playWordSpeech(wordId, wordText, e) {
  if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const card = document.getElementById(`card-${wordId}`);
  if (card) card.classList.add('speaking-pulse');

  if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
    window.soundEngine.speak(wordText, 'en-US', () => {
      if (card) card.classList.remove('speaking-pulse');
    });
  } else {
    if (card) card.classList.remove('speaking-pulse');
  }

  if (window.appState && typeof window.appState.recordWordListened === 'function') {
    window.appState.recordWordListened(wordId);
  }
}

// Helpers for reading modal details aloud
window.speakActiveModalDef = function(lang) {
  const word = window._activeModalWord;
  if (!word) return;
  if (lang === 'uz') {
    if (window.uzbekSpeech && typeof window.uzbekSpeech.speak === 'function') {
      window.uzbekSpeech.speak(`${word.uzbek}. ${word.definitionUz}`);
    }
  } else if (lang === 'ru') {
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(`${word.russian}. ${word.definitionRu}`, 'ru-RU');
    }
  } else {
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(word.definitionEn, 'en-US');
    }
  }
};

window.speakActiveModalExample = function(lang) {
  const word = window._activeModalWord;
  if (!word) return;
  if (lang === 'uz') {
    if (window.uzbekSpeech && typeof window.uzbekSpeech.speak === 'function') {
      window.uzbekSpeech.speak(word.exampleUz);
    }
  } else if (lang === 'ru') {
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(word.exampleRu, 'ru-RU');
    }
  } else {
    if (window.soundEngine && typeof window.soundEngine.speak === 'function') {
      window.soundEngine.speak(word.exampleEn, 'en-US');
    }
  }
};

// Word Detailed View Modal
function openWordModal(wordId) {
  try {
    const word = VOCABULARY_DATA.find(w => w.id === wordId);
    if (!word) return;

    if (window.soundEngine && typeof window.soundEngine.playFlip === 'function') {
      window.soundEngine.playFlip();
    }

    const modal = document.getElementById('word-modal');
    const modalContent = document.getElementById('word-modal-content');
    if (!modal || !modalContent) return;

    const lang = window.appState ? window.appState.lang : (localStorage.getItem('kiddo_language') || 'uz');
    const audioBtnText = lang === 'ru' ? '🔊 Слушать / Listen' : '🔊 Eshitish / Listen';
    const exLabel = lang === 'ru' ? '✨ Пример предложения / Example Sentence:' : '✨ Namuna Jumla / Example Sentence:';

    // Store active word reference to avoid fragile inline string escaping
    window._activeModalWord = word;

    modalContent.innerHTML = `
      <button class="modal-close-btn" onclick="closeWordModal()" aria-label="Yopish">✕</button>
      
      <div class="modal-hero-visual" style="background: radial-gradient(circle, ${word.color}44, ${word.color}11);">
        <span class="modal-big-emoji">${word.emoji}</span>
        <button class="big-audio-btn" onclick="playWordSpeech('${word.id}', '${word.word.replace(/'/g, "\\'")}', event)" title="Pronounce word">
          ${audioBtnText}
        </button>
      </div>

      <div class="modal-info-panel">
        <div class="modal-title-row">
          <h2 class="modal-en-word">${word.word}</h2>
          <span class="modal-phonetic">${word.phonetic}</span>
        </div>

        <div class="modal-definitions">
          <div class="def-block en-def" style="cursor: pointer;" onclick="speakActiveModalDef('en')" title="Listen / Eshitish">
            <span class="badge-mini en">English 🔊</span>
            <p>${word.definitionEn}</p>
          </div>
          <div class="def-block uz-def" style="cursor: pointer;" onclick="speakActiveModalDef('uz')" title="O‘zbekcha talaffuzni eshitish">
            <span class="badge-mini uz">O‘zbekcha 🔊</span>
            <p><strong>${word.uzbek}:</strong> ${word.definitionUz}</p>
          </div>
          <div class="def-block ru-def" style="cursor: pointer;" onclick="speakActiveModalDef('ru')" title="Слушать перевод">
            <span class="badge-mini ru">Русский 🔊</span>
            <p><strong>${word.russian}:</strong> ${word.definitionRu}</p>
          </div>
        </div>

        <div class="modal-example-card">
          <h4>${exLabel}</h4>
          <div class="example-en-sentence" style="cursor: pointer;" onclick="speakActiveModalExample('en')">
            <p>"${word.exampleEn}"</p>
            <button class="speaker-btn mini-speaker" onclick="event.stopPropagation(); speakActiveModalExample('en')" title="Listen / Eshitish">🔊</button>
          </div>
          <p class="example-sub-sentence" style="cursor: pointer;" onclick="speakActiveModalExample('uz')" title="O‘zbekcha jumla talaffuzi">🇺🇿 ${word.exampleUz} 🔊</p>
          <p class="example-sub-sentence" style="cursor: pointer;" onclick="speakActiveModalExample('ru')" title="Русский пример">🇷🇺 ${word.exampleRu} 🔊</p>
        </div>
      </div>
    `;

    modalContent.scrollTop = 0;
    modal.classList.add('open');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Pronounce the word out loud when modal opens
    playWordSpeech(word.id, word.word);
  } catch (err) {
    console.error('Error opening word modal:', err);
  }
}

function closeWordModal() {
  const modal = document.getElementById('word-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
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
