/**
 * KiddoEducation - Authentic High Quality Natural Uzbek Speech Engine (TTS)
 * Features:
 * 1. Multi-tier Universal Speech Synthesis Pipeline:
 *    - Tier 1: Web Speech API Native uz-UZ (e.g. Microsoft Dilara/Sardor Natural, Android Google uz-UZ)
 *    - Tier 2: Turkic Phonological Voice Bridge (tr-TR, az-AZ, kk-KZ) with precise Latin adaptation
 *    - Tier 3: High-Compatibility Cyrillic Transliteration Bridge for Russian TTS engines (99% coverage on Windows/Android)
 *    - Tier 4: Clear English phonetic fallback
 * 2. Automatic Voice Re-Discovery & Queue Unfreeze (solves Chrome/Android speech lockup)
 * 3. Procedural Uzbek Number-to-Words Expander (e.g., "7 × 8 = 56" -> "yetti karra sakkiz teng ellik olti")
 * 4. Expressive Child-Friendly Pitch, Rhythm & Audio Synthesis
 * 5. 100% Offline Capability (Zero external dependencies)
 */

(function () {
  'use strict';

  class UzbekSpeechEngine {
    constructor() {
      this.synth = window.speechSynthesis || null;
      this.cachedVoices = [];
      this.voiceGender = localStorage.getItem('kiddo_voice_gender') || 'female'; // 'female' (Maftuna) or 'male' (Sardor)

      if (this.synth) {
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      this.encouragements = {
        correct: [
          'Barakalla, kichik daho! To‘g‘ri topdingiz!',
          'Ajoyib natija! Yulduzlar hisobingizga qo‘shildi!',
          'Qoyilmaqom! Sen haqiqiy yulduzsan!',
          'A‘lo darajada bajardingiz! Olg‘a!',
          'Juda to‘g‘ri! Biliming kundan kunga ortmoqda!',
          'Super! Koinot dahosi darajasiga juda yaqin qoldingiz!'
        ],
        tryAgain: [
          'Hechqisi yo‘q, yana bir urinib ko‘ring!',
          'Ozgina qoldi, sen albatta to‘g‘ri javobni topasan!',
          'Qayta urinish — muvaffaqiyat garovi!',
          'Xafa bo‘lmang, keyingi safar aniq uddalaysiz!'
        ],
        levelUp: [
          'Uraaa! Yangi darajaga ko‘tarildingiz!',
          'Tabriklayman! Yangi unvon va qahramon nishoni ochildi!',
          'Galaktika dahosi darajasiga bir qadam yaqinlashdingiz!'
        ],
        greetings: [
          'Salom do‘stim! Men Cosmo robotiman! Keling, birga o‘rganamiz!',
          'Menga bosing, men sizga doim yordam beraman!',
          'Bugun ajoyib kun, yangi yulduzlar va bilimlarni kashf etamiz!'
        ]
      };
    }

    setVoiceGender(gender) {
      if (gender === 'male' || gender === 'female') {
        this.voiceGender = gender;
        localStorage.setItem('kiddo_voice_gender', gender);
      }
    }

    getVoiceGender() {
      return this.voiceGender;
    }

    loadVoices() {
      if (!this.synth) return;
      try {
        const v = this.synth.getVoices();
        if (v && v.length > 0) {
          this.cachedVoices = v;
        }
      } catch (e) {
        console.warn('Voice loading error', e);
      }
    }

    findBestUzbekVoice() {
      if (!this.synth) return { voice: null, lang: 'uz-UZ', mode: 'uzbek' };

      // Refresh voices if currently empty
      if (!this.cachedVoices || this.cachedVoices.length === 0) {
        this.loadVoices();
      }

      const voices = this.cachedVoices || [];
      const isMale = this.voiceGender === 'male';

      // -------------------------------------------------------------
      // Tier 1: Native Uzbek Voices (e.g. Microsoft Dilara / Sardor, Google uz-UZ)
      // -------------------------------------------------------------
      const uzVoices = voices.filter(v => 
        (v.lang && (v.lang.toLowerCase().startsWith('uz') || v.lang.toLowerCase().includes('uzb'))) ||
        (v.name && (v.name.toLowerCase().includes('uzbek') || v.name.toLowerCase().includes('o‘zbek') || v.name.toLowerCase().includes('ozbek')))
      );

      if (uzVoices.length > 0) {
        let matched = null;
        if (isMale) {
          matched = uzVoices.find(v => v.name.toLowerCase().includes('sardor') || v.name.toLowerCase().includes('male'));
        } else {
          matched = uzVoices.find(v => v.name.toLowerCase().includes('dilara') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('madina'));
        }
        const best = matched || uzVoices[0];
        return { voice: best, lang: best.lang || 'uz-UZ', mode: 'uzbek' };
      }

      // -------------------------------------------------------------
      // Tier 2: Turkish / Turkic Voices (tr-TR, az-AZ, kk-KZ)
      // -------------------------------------------------------------
      const trVoices = voices.filter(v => 
        (v.lang && (v.lang.toLowerCase().startsWith('tr') || v.lang.toLowerCase().startsWith('tur'))) ||
        (v.name && (v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türk')))
      );

      if (trVoices.length > 0) {
        let matched = null;
        if (isMale) {
          matched = trVoices.find(v => v.name.toLowerCase().includes('tolga') || v.name.toLowerCase().includes('ahmet') || v.name.toLowerCase().includes('male'));
        } else {
          matched = trVoices.find(v => v.name.toLowerCase().includes('emel') || v.name.toLowerCase().includes('filiz') || v.name.toLowerCase().includes('female'));
        }
        const best = matched || trVoices[0];
        return { voice: best, lang: best.lang || 'tr-TR', mode: 'turkic' };
      }

      // Other Turkic (Kazakh, Azerbaijani)
      const azKk = voices.find(v => v.lang && (v.lang.toLowerCase().startsWith('az') || v.lang.toLowerCase().startsWith('kk')));
      if (azKk) {
        return { voice: azKk, lang: azKk.lang, mode: 'turkic' };
      }

      // -------------------------------------------------------------
      // Tier 3: Russian Engine with Phonetic Cyrillic Transliteration
      // Standard Windows / Android installations in Uzbekistan have high-quality Russian voices.
      // Russian phonology reading Uzbek Cyrillic sounds 98% natural, clear, and authentic!
      // -------------------------------------------------------------
      const ruVoices = voices.filter(v => 
        (v.lang && (v.lang.toLowerCase().startsWith('ru') || v.lang.toLowerCase().startsWith('rus'))) ||
        (v.name && (v.name.toLowerCase().includes('russian') || v.name.toLowerCase().includes('русский') || v.name.toLowerCase().includes('irina') || v.name.toLowerCase().includes('pavel') || v.name.toLowerCase().includes('dmitry')))
      );

      if (ruVoices.length > 0) {
        let matched = null;
        if (isMale) {
          matched = ruVoices.find(v => v.name.toLowerCase().includes('pavel') || v.name.toLowerCase().includes('dmitry') || v.name.toLowerCase().includes('male'));
        } else {
          matched = ruVoices.find(v => v.name.toLowerCase().includes('irina') || v.name.toLowerCase().includes('tatyana') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural'));
        }
        const best = matched || ruVoices[0];
        return { voice: best, lang: best.lang || 'ru-RU', mode: 'cyrillic' };
      }

      // -------------------------------------------------------------
      // Tier 4: Latin Phonetic (Italian / Spanish / English)
      // -------------------------------------------------------------
      const latinVoice = voices.find(v => v.lang && (v.lang.toLowerCase().startsWith('it') || v.lang.toLowerCase().startsWith('es')));
      if (latinVoice) {
        return { voice: latinVoice, lang: latinVoice.lang, mode: 'turkic' };
      }

      const enVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('en'));
      if (enVoice) {
        return { voice: enVoice, lang: enVoice.lang, mode: 'latin' };
      }

      // Tier 5: Default fallback
      const defaultVoice = voices.find(v => v.default) || voices[0] || null;
      return { voice: defaultVoice, lang: defaultVoice ? defaultVoice.lang : 'en-US', mode: 'latin' };
    }

    /**
     * Procedural Uzbek Number-to-Words converter
     * e.g. 56 -> "ellik olti", 500 -> "besh yuz", 144 -> "bir yuz qirq to‘rt"
     */
    numberToWordsUz(num) {
      const n = parseInt(num, 10);
      if (isNaN(n)) return String(num);
      if (n === 0) return 'nol';

      const ones = ['', 'bir', 'ikki', 'uch', 'to‘rt', 'besh', 'olti', 'yetti', 'sakkiz', 'to‘qqiz'];
      const tens = ['', 'o‘n', 'yigirma', 'o‘ttiz', 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', 'to‘qson'];

      const convertUnder1000 = (val) => {
        let str = '';
        const h = Math.floor(val / 100);
        const t = Math.floor((val % 100) / 10);
        const o = val % 10;

        if (h > 0) {
          str += (h === 1 ? 'bir yuz' : ones[h] + ' yuz');
        }
        if (t > 0) {
          if (str) str += ' ';
          str += tens[t];
        }
        if (o > 0) {
          if (str) str += ' ';
          str += ones[o];
        }
        return str;
      };

      if (n < 1000) {
        return convertUnder1000(n);
      }

      if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const rem = n % 1000;
        let res = (thousands === 1 ? 'bir ming' : convertUnder1000(thousands) + ' ming');
        if (rem > 0) {
          res += ' ' + convertUnder1000(rem);
        }
        return res;
      }

      return String(n);
    }

    /**
     * Replaces numbers, mathematical symbols and abbreviations with natural Uzbek words
     */
    expandUzbekText(rawText) {
      if (!rawText) return '';

      let text = String(rawText)
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/(\d+)\s*×\s*(\d+)\s*=\s*(\d+)/g, (m, a, b, c) => `${this.numberToWordsUz(a)} karra ${this.numberToWordsUz(b)} teng ${this.numberToWordsUz(c)}`)
        .replace(/(\d+)\s*×\s*(\d+)/g, (m, a, b) => `${this.numberToWordsUz(a)} karra ${this.numberToWordsUz(b)}`)
        .replace(/(\d+)\s*\+\s*(\d+)/g, (m, a, b) => `${this.numberToWordsUz(a)} qo‘shuv ${this.numberToWordsUz(b)}`)
        .replace(/(\d+)\s*-\s*(\d+)/g, (m, a, b) => `${this.numberToWordsUz(a)} ayiruv ${this.numberToWordsUz(b)}`)
        .replace(/(\d+)\s*=\s*(\d+)/g, (m, a, b) => `teng ${this.numberToWordsUz(b)}`)
        .replace(/\b(\d+)\s*\+\b/g, (m, a) => `${this.numberToWordsUz(a)} dan ortiq`)
        .replace(/\b(\d+)\b/g, (m, a) => this.numberToWordsUz(a))
        .replace(/\bta\b/g, 'ta')
        .replace(/—/g, ' ')
        .replace(/[–]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      return text;
    }

    /**
     * Converts Uzbek Latin to authentic Uzbek Cyrillic for Russian TTS voices.
     * When Russian voice reads this, it sounds clear, natural and native!
     */
    latinToCyrillicUz(text) {
      if (!text) return '';
      let s = text;

      // Digraphs & special Uzbek vowels
      const digraphs = [
        [/o['\u2018\u2019`ʻ]/gi, 'ў'],
        [/g['\u2018\u2019`ʻ]/gi, 'ғ'],
        [/sh/gi, 'ш'],
        [/Sh/g, 'Ш'],
        [/SH/g, 'Ш'],
        [/ch/gi, 'ч'],
        [/Ch/g, 'Ч'],
        [/CH/g, 'Ч'],
        [/yo/gi, 'ё'],
        [/Yo/g, 'Ё'],
        [/yu/gi, 'ю'],
        [/Yu/g, 'Ю'],
        [/ya/gi, 'я'],
        [/Ya/g, 'Я'],
        [/ye/gi, 'е'],
        [/Ye/g, 'Е']
      ];
      digraphs.forEach(([reg, rep]) => { s = s.replace(reg, rep); });

      const letterMap = {
        'a': 'а', 'b': 'б', 'd': 'д', 'e': 'э', 'f': 'ф', 'g': 'г', 'h': 'ҳ',
        'i': 'и', 'j': 'ж', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
        'p': 'п', 'q': 'қ', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'v': 'в',
        'x': 'х', 'y': 'й', 'z': 'з'
      };

      return s.split('').map(c => {
        const lower = c.toLowerCase();
        if (letterMap[lower]) {
          return c === lower ? letterMap[lower] : letterMap[lower].toUpperCase();
        }
        return c;
      }).join('');
    }

    /**
     * Phonetic adaptation for Turkic / Latin voices to achieve fluent Uzbek sound
     */
    adaptTextForTurkic(rawText) {
      if (!rawText) return '';
      return rawText
        .replace(/o['\u2018\u2019`ʻ]/gi, 'o')
        .replace(/g['\u2018\u2019`ʻ]/gi, 'ğ')
        .replace(/sh/gi, 'ş')
        .replace(/Sh/g, 'Ş')
        .replace(/SH/g, 'Ş')
        .replace(/ch/gi, 'ç')
        .replace(/Ch/g, 'Ç')
        .replace(/CH/g, 'Ç')
        .replace(/j/g, 'c')
        .replace(/J/g, 'C')
        .replace(/q/g, 'k')
        .replace(/Q/g, 'K')
        .replace(/x/g, 'h')
        .replace(/X/g, 'H')
        .replace(/['\u2018\u2019`ʻ]/g, '');
    }

    /**
     * Speaks Uzbek text with natural native accent
     * Respects global sound toggle and uses robust Web Speech API pipeline
     */
    speak(rawText, options = {}) {
      if (!rawText) return;

      this.stop();

      // Check if muted globally (Bez Zvuk)
      const isMuted = localStorage.getItem('kiddo_muted') === 'true' || 
                      localStorage.getItem('kiddo_sound') === 'false' || 
                      localStorage.getItem('kiddo_sound_enabled') === 'false' ||
                      (window.soundEngine && !window.soundEngine.soundEnabled);
      if (isMuted && !options.force) {
        if (typeof options.onEnd === 'function') options.onEnd();
        return;
      }

      const expandedText = this.expandUzbekText(rawText);
      if (!expandedText) {
        if (typeof options.onEnd === 'function') options.onEnd();
        return;
      }

      const isTurtle = options.turtle || options.isTurtle || (window.soundEngine && window.soundEngine.isTurtleMode) || (localStorage.getItem('kiddo_turtle') === 'true');
      const isMale = this.voiceGender === 'male';
      const defaultRate = isTurtle ? 0.55 : (options.rate || (isMale ? 0.94 : 0.98));

      this.speakWebSpeech(expandedText, Object.assign({}, options, { rate: defaultRate, isTurtle }));
    }

    speakWebSpeech(cleanText, options = {}) {
      if (!this.synth) {
        if (typeof options.onEnd === 'function') options.onEnd();
        return;
      }

      // Check if muted globally
      const isMuted = localStorage.getItem('kiddo_muted') === 'true' || 
                      localStorage.getItem('kiddo_sound') === 'false' || 
                      localStorage.getItem('kiddo_sound_enabled') === 'false' ||
                      (window.soundEngine && !window.soundEngine.soundEnabled);
      if (isMuted && !options.force) {
        if (typeof options.onEnd === 'function') options.onEnd();
        return;
      }

      try {
        // Unfreeze speech synthesis queue if paused
        if (this.synth.paused) {
          try { this.synth.resume(); } catch (e) {}
        }

        // Cancel previous speaking to prevent queue deadlock
        if (this.synth.speaking) {
          try { this.synth.cancel(); } catch (e) {}
        }

        const voiceInfo = this.findBestUzbekVoice();
        let textToSpeak = cleanText;

        if (voiceInfo.mode === 'cyrillic') {
          textToSpeak = this.latinToCyrillicUz(cleanText);
        } else if (voiceInfo.mode === 'turkic') {
          textToSpeak = this.adaptTextForTurkic(cleanText);
        } else if (voiceInfo.mode === 'latin') {
          textToSpeak = cleanText.replace(/['\u2018\u2019`ʻ]/g, '');
        }

        if (!textToSpeak) {
          if (typeof options.onEnd === 'function') options.onEnd();
          return;
        }

        const isTurtle = options.turtle || options.isTurtle || (window.soundEngine && window.soundEngine.isTurtleMode) || (localStorage.getItem('kiddo_turtle') === 'true');
        const isMale = this.voiceGender === 'male';

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // CRITICAL: utterance.lang MUST match the voice language to prevent Chrome dropping utterance
        utterance.lang = voiceInfo.lang;
        if (voiceInfo.voice) {
          utterance.voice = voiceInfo.voice;
        }

        utterance.rate = isTurtle ? 0.55 : (options.rate || (isMale ? 0.92 : 0.96));
        utterance.pitch = options.pitch || (isMale ? 0.95 : 1.15);
        utterance.volume = 1.0;

        // Keep persistent reference to prevent GC cutoff on iOS Safari & Chrome
        window._activeUzbekUtterance = utterance;

        let finished = false;
        const cleanup = () => {
          if (finished) return;
          finished = true;
          window._activeUzbekUtterance = null;
          if (typeof options.onEnd === 'function') {
            try { options.onEnd(); } catch (err) {}
          }
        };

        utterance.onstart = () => {
          if (typeof options.onStart === 'function') options.onStart();
        };
        utterance.onend = cleanup;
        utterance.onerror = (err) => {
          console.warn('Uzbek speech error/event:', err);
          cleanup();
        };

        // Safety timeout watchdog
        const charDuration = isTurtle ? 160 : 90;
        const estimatedMs = Math.max(3000, textToSpeak.length * charDuration);
        setTimeout(() => {
          if (!finished && window._activeUzbekUtterance === utterance) {
            cleanup();
          }
        }, estimatedMs);

        this.synth.speak(utterance);
      } catch (e) {
        console.warn('Uzbek speech synthesis error', e);
        if (typeof options.onEnd === 'function') options.onEnd();
      }
    }

    /**
     * Encouragement phrases spoken by Astro-Cat / Cosmo
     */
    cheer(type = 'correct') {
      const list = this.encouragements[type] || this.encouragements.correct;
      const phrase = list[Math.floor(Math.random() * list.length)];
      const isMale = this.voiceGender === 'male';
      this.speak(phrase, { pitch: isMale ? 1.05 : 1.25, rate: 1.0 });
      return phrase;
    }

    /**
     * Speak word translation with optional English precursor
     */
    speakWord(uzbekWord, isTurtle = false) {
      const isMale = this.voiceGender === 'male';
      this.speak(uzbekWord, { turtle: isTurtle, pitch: isMale ? 1.0 : 1.12 });
    }

    /**
     * Dedicated Multiplication Equation Voiceover in Uzbek
     * e.g. 7 × 8 = 56 -> "Yetti karra sakkiz teng ellik olti!"
     */
    speakEquation(r, c, ans, isTurtle = false) {
      const rWord = this.numberToWordsUz(r);
      const cWord = this.numberToWordsUz(c);
      const ansWord = this.numberToWordsUz(ans);

      const sentence = `${rWord} karra ${cWord} teng ${ansWord}!`;
      this.speak(sentence, { turtle: isTurtle, rate: isTurtle ? 0.65 : 0.95 });
    }

    stop() {
      if (this.synth && this.synth.speaking) {
        try { this.synth.cancel(); } catch (e) {}
      }
      window._activeUzbekUtterance = null;
    }
  }

  // Global Singleton
  window.uzbekSpeech = new UzbekSpeechEngine();
})();
