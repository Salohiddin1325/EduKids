/**
 * KiddoLingo, MathKids & PhysicsKids
 * Astro Cat - Mascot Companion, Web Audio Synthesizer & Celebrations
 * 100% Offline, Pure Web Audio + Web Speech API
 */

class KiddoAudioSynth {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('kiddo_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('kiddo_muted', this.isMuted);
    return this.isMuted;
  }

  // Soft Bubbly Pop (Card tap, click, pickup)
  playPop() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio fallback
    }
  }

  // Sparkling Success Chime (Correct answer)
  playChime() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch (e) {}
  }

  // Star & Coin Collect Ding
  playCoin() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      osc2.frequency.setValueAtTime(1318.51, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch (e) {}
  }

  // Triumphant Fanfare (Quiz completion, Level up)
  playCheer() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const melody = [
        { f: 392.00, d: 0.12 }, // G4
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.14 }, // E5
        { f: 783.99, d: 0.32 }  // G5
      ];
      let offset = this.ctx.currentTime;

      melody.forEach(item => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.f, offset);

        gain.gain.setValueAtTime(0.2, offset);
        gain.gain.exponentialRampToValueAtTime(0.001, offset + item.d + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(offset);
        osc.stop(offset + item.d + 0.18);
        offset += item.d;
      });
    } catch (e) {}
  }

  // Friendly soft boing (incorrect attempt, non-scary)
  playBoing() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // Quick whoosh
  playWhoosh() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.16);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch (e) {}
  }
}

class AstroCatMascot {
  constructor() {
    this.audio = new KiddoAudioSynth();
    this.speechSynth = window.speechSynthesis || null;
    this.voices = [];
    this.loadVoices();
    if (this.speechSynth && this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = () => this.loadVoices();
    }
    this.isMinimized = localStorage.getItem('astro_minimized') === 'true';
    this.bubbleTimeout = null;
    this.isCheering = false;
    this.hasUserInteracted = false;

    const setUserActive = () => { this.hasUserInteracted = true; };
    window.addEventListener('click', setUserActive, { once: true });
    window.addEventListener('keydown', setUserActive, { once: true });
    window.addEventListener('touchstart', setUserActive, { once: true });

    // Encouraging phrases in Uzbek and Russian
    this.phrases = {
      correct: {
        uz: [
          'Ofarin, qoyilmaqom!',
          'Ajoyib natija!',
          'Barakalla, to‘g‘ri!',
          'Sen haqiqiy bilimdonsan!',
          'Zo‘r! Shunday davom et!',
          'To‘g‘ri topding, daho!',
          'Juda yaxshi!'
        ],
        ru: [
          'Молодец, отлично!',
          'Замечательно!',
          'Умница, всё верно!',
          'Ты настоящий знаток!',
          'Супер! Так держать!',
          'Правильно, гений!',
          'Прекрасная работа!'
        ]
      },
      tryAgain: {
        uz: [
          'Hechqisi yo‘q, yana bir urinib ko‘r!',
          'Ozgina qoldi, sen albatta topasan!',
          'Qayta urinish - muvaffaqiyat garovi!'
        ],
        ru: [
          'Ничего страшного, попробуй ещё раз!',
          'Чуть-чуть не хватило, у тебя получится!',
          'Не сдавайся, ты сможешь!'
        ]
      },
      streak: {
        uz: [
          '🔥 Bugungi o‘rganish oloving yonmoqda!',
          '🔥 Ajoyib seriya! Biliming har kuni ortmoqda!'
        ],
        ru: [
          '🔥 Твой огонёк знаний горит ярко!',
          '🔥 Отличная серия! Каждый день всё умнее!'
        ]
      },
      levelUp: {
        uz: [
          '🚀 URAAA! Yangi darajaga ko‘tarilding!',
          '👑 Qoyil! Senga yangi unvon berildi!'
        ],
        ru: [
          '🚀 УРААА! Новый уровень открыт!',
          '👑 Потрясающе! Ты получил новое звание!'
        ]
      },
      greetings: {
        uz: [
          'Salom! Men Astro Mushukman 🐱 Men bilan birga o‘rgan!',
          'Menga bosing, men sizga yordam beraman!',
          'Bugun ajoyib kun, ko‘plab yulduzlar yig‘amiz! ⭐'
        ],
        ru: [
          'Привет! Я Астро Котик 🐱 Давай учиться вместе!',
          'Нажми на меня, и я помогу тебе!',
          'Сегодня отличный день собрать много звёзд! ⭐'
        ]
      }
    };

    this.initDOM();
  }

  getLang() {
    return localStorage.getItem('kiddo_language') || 'uz';
  }

  initDOM() {
    if (document.getElementById('mascot-companion-dock')) return;

    const dock = document.createElement('div');
    dock.id = 'mascot-companion-dock';
    dock.className = `mascot-companion-dock ${this.isMinimized ? 'mascot-dock-minimized' : ''}`;

    const isRu = this.getLang() === 'ru';
    const initText = isRu ? 'Привет! Я Астро Котик 🚀' : 'Salom! Men Astro Mushukman 🚀';

    dock.innerHTML = `
      <div class="mascot-bubble-wrap" id="mascot-speech-bubble" onclick="window.astroCat.onBubbleClick()">
        <span id="mascot-bubble-text">${initText}</span>
      </div>

      <div class="mascot-char-card" id="mascot-character-card" onclick="window.astroCat.onCatClick()" title="Astro Cat">
        <div class="mascot-controls-mini">
          <button class="mascot-mini-btn" id="mascot-chat-open-btn" onclick="event.stopPropagation(); if(window.astroBot) window.astroBot.open();" title="AstroBot bilan suhbatlashish">
            💬
          </button>
          <button class="mascot-mini-btn" id="mascot-mute-btn" onclick="event.stopPropagation(); window.astroCat.toggleMute();" title="Ovozni yoqish/o‘chirish">
            ${this.audio.isMuted ? '🔇' : '🔊'}
          </button>
          <button class="mascot-mini-btn" id="mascot-min-btn" onclick="event.stopPropagation(); window.astroCat.toggleMinimize();" title="Yig‘ish/Ochish">
            ${this.isMinimized ? '🐱' : '➖'}
          </button>
        </div>

        <div class="mascot-svg-wrap">
          <!-- Layer 1: Equipped Outfit -->
          <div class="mascot-item-outfit" id="mascot-layer-outfit"></div>

          <!-- Layer 2: Base Astro Cat SVG -->
          <svg class="mascot-base-avatar" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="catHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFD166" />
                <stop offset="100%" stop-color="#F4A261" />
              </linearGradient>
              <linearGradient id="catHelmetGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#38BDF8" stop-opacity="0.3" />
              </linearGradient>
            </defs>

            <!-- Helmet Glass Backing -->
            <circle cx="50" cy="50" r="44" fill="url(#catHelmetGlow)" stroke="#38BDF8" stroke-width="2.5" />

            <!-- Left Ear -->
            <polygon points="26,38 33,14 44,28" fill="#F4A261" stroke="#E76F51" stroke-width="2" stroke-linejoin="round" />
            <polygon points="29,35 34,20 41,28" fill="#FFB5A7" />

            <!-- Right Ear -->
            <polygon points="74,38 67,14 56,28" fill="#F4A261" stroke="#E76F51" stroke-width="2" stroke-linejoin="round" />
            <polygon points="71,35 66,20 59,28" fill="#FFB5A7" />

            <!-- Cat Head Round -->
            <circle cx="50" cy="52" r="32" fill="url(#catHeadGrad)" stroke="#E76F51" stroke-width="2.5" />

            <!-- Cheeks Blush -->
            <circle cx="34" cy="58" r="5" fill="#FF8FA3" opacity="0.6" />
            <circle cx="66" cy="58" r="5" fill="#FF8FA3" opacity="0.6" />

            <!-- Left Eye (Big Sparkling Cartoon) -->
            <circle cx="38" cy="48" r="6" fill="#1E293B" />
            <circle cx="36" cy="46" r="2.2" fill="#FFFFFF" />
            <circle cx="40" cy="50" r="1.1" fill="#FFFFFF" />

            <!-- Right Eye -->
            <circle cx="62" cy="48" r="6" fill="#1E293B" />
            <circle cx="60" cy="46" r="2.2" fill="#FFFFFF" />
            <circle cx="64" cy="50" r="1.1" fill="#FFFFFF" />

            <!-- Triangle Nose -->
            <polygon points="50,56 46,53 54,53" fill="#E76F51" />

            <!-- Cute Cat Mouth :3 -->
            <path d="M46 56 Q50 60 50 58 Q50 60 54 56" stroke="#8D3B1B" stroke-width="2" stroke-linecap="round" fill="none" />

            <!-- Whiskers -->
            <line x1="22" y1="52" x2="32" y2="54" stroke="#8D3B1B" stroke-width="1.5" stroke-linecap="round" />
            <line x1="22" y1="58" x2="32" y2="57" stroke="#8D3B1B" stroke-width="1.5" stroke-linecap="round" />
            <line x1="78" y1="52" x2="68" y2="54" stroke="#8D3B1B" stroke-width="1.5" stroke-linecap="round" />
            <line x1="78" y1="58" x2="68" y2="57" stroke="#8D3B1B" stroke-width="1.5" stroke-linecap="round" />

            <!-- Helmet Visor Reflection -->
            <path d="M22 34 Q50 18 78 34" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />
          </svg>

          <!-- Layer 3: Equipped Glasses / Mask -->
          <div class="mascot-item-acc" id="mascot-layer-acc"></div>

          <!-- Layer 4: Equipped Hat / Crown -->
          <div class="mascot-item-hat" id="mascot-layer-hat"></div>
        </div>
      </div>
    `;

    document.body.appendChild(dock);
    this.updateEquippedVisuals();
  }

  updateEquippedVisuals() {
    if (!window.gamificationHub) return;
    const equipped = window.gamificationHub.equipped;

    const hatEl = document.getElementById('mascot-layer-hat');
    const accEl = document.getElementById('mascot-layer-acc');
    const outfitEl = document.getElementById('mascot-layer-outfit');

    if (hatEl) {
      if (equipped && equipped.hat) {
        const item = STORE_ITEMS.find(i => i.id === equipped.hat);
        hatEl.textContent = item ? item.emoji : '';
      } else {
        hatEl.textContent = '';
      }
    }

    if (accEl) {
      if (equipped && equipped.acc) {
        const item = STORE_ITEMS.find(i => i.id === equipped.acc);
        accEl.textContent = item ? item.emoji : '';
      } else {
        accEl.textContent = '';
      }
    }

    if (outfitEl) {
      if (equipped && equipped.outfit) {
        const item = STORE_ITEMS.find(i => i.id === equipped.outfit);
        outfitEl.textContent = item ? item.emoji : '';
      } else {
        outfitEl.textContent = '';
      }
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    localStorage.setItem('astro_minimized', this.isMinimized);
    const dock = document.getElementById('mascot-companion-dock');
    const btn = document.getElementById('mascot-min-btn');
    if (dock) {
      dock.classList.toggle('mascot-dock-minimized', this.isMinimized);
    }
    if (btn) {
      btn.textContent = this.isMinimized ? '🐱' : '➖';
    }
  }

  toggleMute() {
    const isMuted = this.audio.toggleMute();
    const btn = document.getElementById('mascot-mute-btn');
    if (btn) {
      btn.textContent = isMuted ? '🔇' : '🔊';
    }
    const isRu = this.getLang() === 'ru';
    this.say(isMuted ? (isRu ? 'Звук отключён 🔕' : 'Ovoz o‘chirildi 🔕') : (isRu ? 'Звук включён! 🔔' : 'Ovoz yoqildi! 🔔'), false);
  }

  say(text, playSpeech = true) {
    if (this.isMinimized) return;

    const bubble = document.getElementById('mascot-speech-bubble');
    const textEl = document.getElementById('mascot-bubble-text');
    if (!bubble || !textEl) return;

    textEl.textContent = text;
    bubble.classList.add('visible');

    if (this.bubbleTimeout) clearTimeout(this.bubbleTimeout);
    this.bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('visible');
    }, 4500);

    if (playSpeech && !this.audio.isMuted) {
      this.speak(text);
    }
  }

  loadVoices() {
    if (!this.speechSynth) return;
    this.voices = this.speechSynth.getVoices() || [];
  }

  uzLatinToPhoneticCyrillic(text) {
    let s = text;
    s = s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '');

    // Convert Uzbek Latin digraphs into standard Cyrillic
    s = s.replace(/o[‘'ʻ`]/gi, 'о');
    s = s.replace(/g[‘'ʻ`]/gi, 'г');
    s = s.replace(/sh/gi, (m) => m[0] === 'S' ? 'Ш' : 'ш');
    s = s.replace(/ch/gi, (m) => m[0] === 'C' ? 'Ч' : 'ч');
    s = s.replace(/yo/gi, (m) => m[0] === 'Y' ? 'Ё' : 'ё');
    s = s.replace(/yu/gi, (m) => m[0] === 'Y' ? 'Ю' : 'ю');
    s = s.replace(/ya/gi, (m) => m[0] === 'Y' ? 'Я' : 'я');
    s = s.replace(/ye/gi, (m) => m[0] === 'Y' ? 'Е' : 'е');

    const map = {
      'a': 'а', 'A': 'А',
      'b': 'б', 'B': 'Б',
      'd': 'д', 'D': 'Д',
      'e': 'э', 'E': 'Э',
      'f': 'ф', 'F': 'Ф',
      'g': 'г', 'G': 'Г',
      'h': 'х', 'H': 'Х',
      'i': 'и', 'I': 'И',
      'j': 'ж', 'J': 'Ж',
      'k': 'к', 'K': 'К',
      'l': 'л', 'L': 'Л',
      'm': 'м', 'M': 'М',
      'n': 'н', 'N': 'Н',
      'o': 'о', 'O': 'О',
      'p': 'п', 'P': 'П',
      'q': 'к', 'Q': 'К',
      'r': 'р', 'R': 'Р',
      's': 'с', 'S': 'С',
      't': 'т', 'T': 'Т',
      'u': 'у', 'U': 'У',
      'v': 'в', 'V': 'В',
      'x': 'х', 'X': 'Х',
      'y': 'й', 'Y': 'Й',
      'z': 'з', 'Z': 'З'
    };

    s = s.replace(/[a-zA-Z]/g, char => map[char] || char);
    s = s.replace(/[‘'ʻ`]/g, '');
    return s.trim();
  }

  uzLatinToTurkish(text) {
    let s = text;
    s = s.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '');
    s = s.replace(/o[‘'ʻ`]/gi, 'o');
    s = s.replace(/g[‘'ʻ`]/gi, 'g');
    s = s.replace(/sh/gi, (m) => m[0] === 'S' ? 'Ş' : 'ş');
    s = s.replace(/ch/gi, (m) => m[0] === 'C' ? 'Ç' : 'ç');
    s = s.replace(/[‘'ʻ`]/g, '');
    return s.trim();
  }

  resolveVoiceAndText(rawText, lang) {
    this.loadVoices();

    if (lang === 'ru') {
      // --- Russian Mode ---
      const cleanText = rawText.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '').trim();
      const ruVoice = this.voices.find(v => 
        (v.lang && v.lang.toLowerCase().startsWith('ru')) ||
        (v.name && (v.name.toLowerCase().includes('russian') || v.name.toLowerCase().includes('русск') || v.name.toLowerCase().includes('irina') || v.name.toLowerCase().includes('pavel') || v.name.toLowerCase().includes('tatyana')))
      );
      return {
        voice: ruVoice || null,
        langCode: 'ru-RU',
        textToSpeak: cleanText
      };
    }

    // --- Uzbek Mode ('uz') ---
    // 1. Direct Uzbek voice if installed
    const uzVoice = this.voices.find(v => 
      (v.lang && v.lang.toLowerCase().startsWith('uz')) || 
      (v.name && v.name.toLowerCase().includes('uzbek'))
    );
    if (uzVoice) {
      return {
        voice: uzVoice,
        langCode: 'uz-UZ',
        textToSpeak: rawText.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/gu, '').trim()
      };
    }

    // 2. Turkish or Turkic voice (shares identical Turkic vowel harmony and phonology)
    const trVoice = this.voices.find(v => 
      (v.lang && v.lang.toLowerCase().startsWith('tr')) || 
      (v.name && (v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türk') || v.name.toLowerCase().includes('tolga') || v.name.toLowerCase().includes('emel')))
    );
    if (trVoice) {
      return {
        voice: trVoice,
        langCode: 'tr-TR',
        textToSpeak: this.uzLatinToTurkish(rawText)
      };
    }

    // 3. Azerbaijani or Kazakh Voice
    const azKkVoice = this.voices.find(v => 
      (v.lang && (v.lang.toLowerCase().startsWith('az') || v.lang.toLowerCase().startsWith('kk')))
    );
    if (azKkVoice) {
      return {
        voice: azKkVoice,
        langCode: azKkVoice.lang,
        textToSpeak: this.uzLatinToTurkish(rawText)
      };
    }

    // 4. Russian Voice (standard Windows CIS fallback - reading phonetic Cyrillic)
    // Produces an authentic, natural Central Asian / Uzbek accent without ANY English accent!
    const ruVoice = this.voices.find(v => 
      (v.lang && v.lang.toLowerCase().startsWith('ru')) ||
      (v.name && (v.name.toLowerCase().includes('russian') || v.name.toLowerCase().includes('русск') || v.name.toLowerCase().includes('irina')))
    );
    if (ruVoice) {
      return {
        voice: ruVoice,
        langCode: 'ru-RU',
        textToSpeak: this.uzLatinToPhoneticCyrillic(rawText)
      };
    }

    // 5. Spanish / Italian Voice (pure Latin vowels, avoids English diphthongs)
    const latinVoice = this.voices.find(v => 
      (v.lang && (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().startsWith('it')))
    );
    if (latinVoice) {
      return {
        voice: latinVoice,
        langCode: latinVoice.lang,
        textToSpeak: this.uzLatinToTurkish(rawText)
      };
    }

    // Last resort fallback
    const nonEnglishVoice = this.voices.find(v => !v.lang || !v.lang.toLowerCase().startsWith('en'));
    return {
      voice: nonEnglishVoice || null,
      langCode: nonEnglishVoice ? nonEnglishVoice.lang : 'tr-TR',
      textToSpeak: this.uzLatinToTurkish(rawText)
    };
  }

  speak(text) {
    if (!this.speechSynth || this.audio.isMuted) return;
    try {
      this.speechSynth.cancel(); // Stop prior speech
      const lang = this.getLang();
      const { voice, langCode, textToSpeak } = this.resolveVoiceAndText(text, lang);

      if (!textToSpeak) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      if (voice) {
        utterance.voice = voice;
      }

      // Kid-friendly tone
      utterance.pitch = lang === 'ru' ? 1.25 : 1.28;
      utterance.rate = 1.0;

      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }

  onLanguageChanged(newLang) {
    if (!this.hasUserInteracted) return;
    const isRu = newLang === 'ru';
    const msg = isRu 
      ? 'Привет! Я Астро Котик! Давай учиться вместе! 🐱🚀'
      : 'Salom! Men Astro Mushukman! Keling, birga o‘rganamiz! 🐱🚀';
    this.say(msg, true);
  }

  cheer(type = 'correct') {
    const lang = this.getLang();
    const list = this.phrases[type] ? (this.phrases[type][lang] || this.phrases[type].uz) : this.phrases.correct.uz;
    const randomPhrase = list[Math.floor(Math.random() * list.length)];

    // Animate Card
    const card = document.getElementById('mascot-character-card');
    if (card) {
      card.classList.add('mascot-cheering');
      setTimeout(() => card.classList.remove('mascot-cheering'), 1800);
    }

    if (type === 'correct') {
      this.audio.playChime();
    } else if (type === 'levelUp') {
      this.audio.playCheer();
      this.triggerConfetti();
    } else if (type === 'streak') {
      this.audio.playCoin();
    } else if (type === 'tryAgain') {
      this.audio.playBoing();
    }

    this.say(randomPhrase, true);
  }

  onCatClick() {
    this.audio.playPop();
    const lang = this.getLang();
    const list = this.phrases.greetings[lang] || this.phrases.greetings.uz;
    const phrase = list[Math.floor(Math.random() * list.length)];

    const card = document.getElementById('mascot-character-card');
    if (card) {
      card.classList.add('mascot-cheering');
      setTimeout(() => card.classList.remove('mascot-cheering'), 1200);
    }

    this.say(phrase, true);
  }

  onBubbleClick() {
    this.audio.playPop();
    const bubble = document.getElementById('mascot-speech-bubble');
    if (bubble) bubble.classList.remove('visible');
  }

  // Full-screen Celebratory Confetti System
  triggerConfetti(durationMs = 2800) {
    let canvas = document.getElementById('kiddo-confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'kiddo-confetti-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      document.body.appendChild(canvas);
    }

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFD166', '#EF476F', '#06D6A0', '#118AB2', '#073B4C', '#FF9F1C', '#9D4EDD'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 8 - 4,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    const startTime = performance.now();

    function render(currentTime) {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < durationMs) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(render);
  }

  updateEquippedDisplay() {
    this.updateEquippedVisuals();
  }
}

// Global instance
window.astroCat = new AstroCatMascot();
window.mascotCompanion = window.astroCat;
window.kiddoAudio = window.astroCat.audio;

document.addEventListener('DOMContentLoaded', () => {
  if (window.astroCat) {
    window.astroCat.initDOM();
  }
});

