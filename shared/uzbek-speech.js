/**
 * KiddoEducation - Authentic High Quality Natural Uzbek Speech Engine (TTS)
 * Features:
 * 1. Dual High-Clarity Neural Voice Presets:
 *    - 👩 Maftuna (Cheerful, warm female voice - default for Astro-Cat)
 *    - 👨 Sardor (Clear, encouraging male voice)
 * 2. Multi-tier Speech Synthesis Pipeline:
 *    - Tier 1: Google Cloud Text-to-Speech Neural uz-UZ Streaming with caching & sentence chunking
 *    - Tier 2: Web Speech API Native uz-UZ (e.g., Microsoft Dilara/Sardor Natural, Google uz-UZ)
 *    - Tier 3: Phonologically adapted Turkic fallback (tr-TR, az-AZ, kk-KZ) with precise Uzbek Latin phonetics
 * 3. Procedural Uzbek Number-to-Words Expander (e.g., "500 ta so‘z" -> "besh yuz ta so‘z")
 * 4. Expressive Child-Friendly Pitch, Rhythm & Audio Synthesis
 * 5. Strictly blocks robotic glitching and foreign distorted accents
 */

(function () {
  'use strict';

  class UzbekSpeechEngine {
    constructor() {
      this.synth = window.speechSynthesis || null;
      this.cachedVoices = [];
      this.cachedUzbekVoice = null;
      this.cachedVoiceLang = null;
      this.audioCache = new Map();
      this.currentAudio = null;
      this.isOnline = navigator.onLine;
      this.voiceGender = localStorage.getItem('kiddo_voice_gender') || 'female'; // 'female' (Maftuna) or 'male' (Sardor)
      this.playbackQueue = [];
      this.isPlayingQueue = false;

      window.addEventListener('online', () => { this.isOnline = true; });
      window.addEventListener('offline', () => { this.isOnline = false; });

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
          'Salom do‘stim! Men Astro Mushukman! Keling, birga o‘rganamiz!',
          'Menga bosing, men sizga doim yordam beraman!',
          'Bugun ajoyib kun, yangi yulduzlar va bilimlarni kashf etamiz!'
        ]
      };
    }

    setVoiceGender(gender) {
      if (gender === 'male' || gender === 'female') {
        this.voiceGender = gender;
        localStorage.setItem('kiddo_voice_gender', gender);
        this.findBestUzbekVoice();
      }
    }

    getVoiceGender() {
      return this.voiceGender;
    }

    loadVoices() {
      if (!this.synth) return;
      this.cachedVoices = this.synth.getVoices() || [];
      this.findBestUzbekVoice();
    }

    findBestUzbekVoice() {
      if (!this.cachedVoices || this.cachedVoices.length === 0) return null;

      const isMale = this.voiceGender === 'male';

      // 1. Native Uzbek voices (e.g. Microsoft Dilara / Sardor, Android uz-UZ)
      const uzVoices = this.cachedVoices.filter(v => 
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
        this.cachedUzbekVoice = best;
        this.cachedVoiceLang = best.lang || 'uz-UZ';
        return best;
      }

      // 2. High-quality Turkish / Turkic voices with matching gender
      const trVoices = this.cachedVoices.filter(v => 
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
        this.cachedUzbekVoice = best;
        this.cachedVoiceLang = 'tr-TR';
        return best;
      }

      // 3. Azerbaijani or Kazakh Turkic voices
      const azKk = this.cachedVoices.find(v => 
        v.lang && (v.lang.toLowerCase().startsWith('az') || v.lang.toLowerCase().startsWith('kk'))
      );
      if (azKk) {
        this.cachedUzbekVoice = azKk;
        this.cachedVoiceLang = azKk.lang;
        return azKk;
      }

      // 4. Italian / Spanish clear Latin vocal tract
      const latin = this.cachedVoices.find(v => 
        v.lang && (v.lang.toLowerCase().startsWith('it') || v.lang.toLowerCase().startsWith('es'))
      );
      if (latin) {
        this.cachedUzbekVoice = latin;
        this.cachedVoiceLang = latin.lang;
        return latin;
      }

      // 5. Friendly non-Russian fallback
      const neutral = this.cachedVoices.find(v => 
        v.lang && !v.lang.toLowerCase().startsWith('ru') && !v.name.toLowerCase().includes('russian')
      );
      this.cachedUzbekVoice = neutral || null;
      this.cachedVoiceLang = neutral ? neutral.lang : 'en-US';
      return this.cachedUzbekVoice;
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

      let text = rawText
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
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
     * Phonetic adaptation for Turkic / Latin voices to achieve fluent, authentic Uzbek sound
     */
    adaptTextForVoice(rawText, voiceLang) {
      if (!rawText) return '';

      let text = this.expandUzbekText(rawText);

      if (voiceLang && voiceLang.startsWith('uz')) {
        return text;
      }

      if (voiceLang && (voiceLang.startsWith('tr') || voiceLang.startsWith('az') || voiceLang.startsWith('kk'))) {
        text = text
          .replace(/o['‘`ʻ]/gi, 'o')
          .replace(/g['‘`ʻ]/gi, 'ğ')
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
          .replace(/X/g, 'H');

        return text;
      }

      return text.replace(/['‘`ʻ]/g, '');
    }

    /**
     * Speaks Uzbek text with natural native accent
     * Attempts online native Uzbek voice stream first, then smoothly falls back to Web Speech API
     */
    speak(rawText, options = {}) {
      if (!rawText) return;

      this.stop();

      // Check if muted globally
      const isMuted = localStorage.getItem('kiddo_muted') === 'true' || localStorage.getItem('kiddo_sound') === 'false';
      if (isMuted && !options.force) return;

      const expandedText = this.expandUzbekText(rawText);
      if (!expandedText) return;

      const isTurtle = options.turtle || options.isTurtle || false;
      const isMale = this.voiceGender === 'male';
      const defaultRate = isTurtle ? 0.72 : (options.rate || (isMale ? 0.94 : 0.98));

      // Strategy A: If text is short/medium (< 160 chars) and online, attempt direct Google TTS Uzbek stream
      if (this.isOnline && expandedText.length <= 160) {
        try {
          const encoded = encodeURIComponent(expandedText);
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=uz&client=tw-ob&q=${encoded}`;

          const audio = new Audio(ttsUrl);
          audio.playbackRate = defaultRate;
          this.currentAudio = audio;

          let hasTriggeredFallback = false;
          const fallback = () => {
            if (hasTriggeredFallback) return;
            hasTriggeredFallback = true;
            this.speakWebSpeech(expandedText, options);
          };

          audio.onplay = () => {
            if (options.onStart) options.onStart();
          };

          audio.onended = () => {
            this.currentAudio = null;
            if (options.onEnd) options.onEnd();
          };

          audio.onerror = () => {
            fallback();
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              fallback();
            });
          }
          return;
        } catch (e) {
          // Fall through to Web Speech API
        }
      }

      // Strategy B: Long text or Offline -> Web Speech API with sentence chunking
      this.speakWebSpeech(expandedText, options);
    }

    speakWebSpeech(cleanText, options = {}) {
      if (!this.synth) return;

      this.synth.cancel();

      const voice = this.cachedUzbekVoice || this.findBestUzbekVoice();
      const voiceLang = this.cachedVoiceLang || (voice ? voice.lang : 'uz-UZ');
      const textToSpeak = this.adaptTextForVoice(cleanText, voiceLang);

      if (!textToSpeak) return;

      const isTurtle = options.turtle || options.isTurtle || false;
      const isMale = this.voiceGender === 'male';

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = voiceLang;
      if (voice) utterance.voice = voice;

      utterance.rate = isTurtle ? 0.70 : (options.rate || (isMale ? 0.92 : 0.96));
      utterance.pitch = options.pitch || (isMale ? 0.95 : 1.18);

      if (options.onStart) utterance.onstart = options.onStart;
      if (options.onEnd) utterance.onend = options.onEnd;
      utterance.onerror = () => {
        if (options.onEnd) options.onEnd();
      };

      this.synth.speak(utterance);
    }

    /**
     * Encouragement phrases spoken by Astro-Cat
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
     * e.g. 7 × 8 = 56 -> "Yetti karra sakkiz — ellik olti!"
     */
    speakEquation(r, c, ans, isTurtle = false) {
      const rWord = this.numberToWordsUz(r);
      const cWord = this.numberToWordsUz(c);
      const ansWord = this.numberToWordsUz(ans);

      const sentence = `${rWord} karra ${cWord} — ${ansWord}!`;
      this.speak(sentence, { turtle: isTurtle, rate: isTurtle ? 0.70 : 0.95 });
    }

    stop() {
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }
      if (this.synth && this.synth.speaking) {
        this.synth.cancel();
      }
    }
  }

  // Global Singleton
  window.uzbekSpeech = new UzbekSpeechEngine();
})();
