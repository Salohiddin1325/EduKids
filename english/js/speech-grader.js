/**
 * KiddoLingo — Interactive Speech Pronunciation Grader Engine
 * Evaluates child's English pronunciation using Web Speech Recognition.
 */

(function () {
  'use strict';

  const PHONICS_WORDS = [
    { word: 'APPLE', phonetics: '/ˈæp.əl/', emoji: '🍎', translationUz: 'Olma', translationRu: 'Яблоко' },
    { word: 'CAT', phonetics: '/kæt/', emoji: '🐱', translationUz: 'Mushuk', translationRu: 'Кот' },
    { word: 'DOG', phonetics: '/dɒɡ/', emoji: '🐶', translationUz: 'Kuchuk', translationRu: 'Собака' },
    { word: 'SUN', phonetics: '/sʌn/', emoji: '☀️', translationUz: 'Quyosh', translationRu: 'Солнце' },
    { word: 'STAR', phonetics: '/stɑːr/', emoji: '⭐', translationUz: 'Yulduz', translationRu: 'Звезда' },
    { word: 'BOOK', phonetics: '/bʊk/', emoji: '📖', translationUz: 'Kitob', translationRu: 'Книга' },
    { word: 'BALL', phonetics: '/bɔːl/', emoji: '⚽', translationUz: 'Koptok', translationRu: 'Мяч' },
    { word: 'FISH', phonetics: '/fɪʃ/', emoji: '🐟', translationUz: 'Baliq', translationRu: 'Рыба' },
    { word: 'MOON', phonetics: '/muːn/', emoji: '🌙', translationUz: 'Oy', translationRu: 'Луна' },
    { word: 'TREE', phonetics: '/triː/', emoji: '🌳', translationUz: 'Daraxt', translationRu: 'Дерево' },
    { word: 'BIRD', phonetics: '/bɜːd/', emoji: '🐦', translationUz: 'Qush', translationRu: 'Птица' },
    { word: 'MILK', phonetics: '/mɪlk/', emoji: '🥛', translationUz: 'Sut', translationRu: 'Молоко' },
    { word: 'LION', phonetics: '/ˈlaɪ.ən/', emoji: '🦁', translationUz: 'Sher', translationRu: 'Лев' },
    { word: 'SHIP', phonetics: '/ʃɪp/', emoji: '🚢', translationUz: 'Kema', translationRu: 'Корабль' },
    { word: 'CAR', phonetics: '/kɑːr/', emoji: '🚗', translationUz: 'Mashina', translationRu: 'Машина' }
  ];

  class SpeechPronunciationGrader {
    constructor() {
      this.currentIndex = 0;
      this.isListening = false;
      this.recognition = null;
      this.initSpeechRecognition();
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    getCurrentWordItem() {
      return PHONICS_WORDS[this.currentIndex] || PHONICS_WORDS[0];
    }

    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('Web Speech Recognition brauzerda qo‘llab-quvvatlanmaydi.');
        return;
      }

      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 3;

      rec.onstart = () => {
        this.isListening = true;
        this.updateMicUI(true);
        const statusEl = document.getElementById('speech-grader-status');
        const isRu = this.getLang() === 'ru';
        if (statusEl) statusEl.textContent = isRu ? 'Слушаю... Говорите в микрофон! 🎙️' : 'Eshityapman... Mikrofoningizga gapiring! 🎙️';
      };

      rec.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toUpperCase();
        this.evaluateSpokenWord(spoken);
      };

      rec.onerror = (event) => {
        this.isListening = false;
        this.updateMicUI(false);
        const statusEl = document.getElementById('speech-grader-status');
        const isRu = this.getLang() === 'ru';
        if (statusEl) statusEl.textContent = isRu ? 'Не расслышал. Попробуйте ещё раз!' : 'Eshitilmadi. Yana bir bor aytib ko‘ring!';
      };

      rec.onend = () => {
        this.isListening = false;
        this.updateMicUI(false);
      };

      this.recognition = rec;
    }

    startListening() {
      if (!this.recognition) {
        const isRu = this.getLang() === 'ru';
        alert(isRu ? 'Микрофон поддерживается в Google Chrome / Safari.' : 'Ovozli tanish Chrome yoki Safari brauzerida ishlaydi.');
        return;
      }

      if (this.isListening) {
        this.recognition.stop();
        return;
      }

      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Recognition start xatoligi:', e);
      }
    }

    updateMicUI(listening) {
      const btn = document.getElementById('btn-speech-mic');
      if (btn) {
        btn.classList.toggle('listening', listening);
      }
    }

    speakCurrentWord() {
      const item = this.getCurrentWordItem();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(item.word.toLowerCase());
        utter.lang = 'en-US';
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
      }
    }

    evaluateSpokenWord(spokenText) {
      const current = this.getCurrentWordItem();
      const target = current.word;
      const isRu = this.getLang() === 'ru';

      const statusEl = document.getElementById('speech-grader-status');
      const resultBox = document.getElementById('speech-result-box');
      const starsEl = document.getElementById('speech-result-stars');
      const heardEl = document.getElementById('speech-result-heard');

      // Check similarity
      const isExact = spokenText === target || spokenText.includes(target);
      const distance = this.levenshtein(spokenText, target);
      const similarity = Math.max(0, 1 - distance / Math.max(spokenText.length, target.length));

      let stars = 1;
      let feedback = '';

      if (isExact || similarity >= 0.8) {
        stars = 3;
        feedback = isRu ? '🌟 Идеальное произношение!' : '🌟 Mukammal talaffuz!';
        // Award XP and Stars
        if (window.gamificationHub) {
          window.gamificationHub.addXP(25, '(Talaffuz Grader)');
          window.gamificationHub.addStars(2);
        }
        if (window.screenVFXEngine && typeof window.screenVFXEngine.triggerConfettiBurst === 'function') {
          window.screenVFXEngine.triggerConfettiBurst();
        }
        if (window.kiddoAudio && typeof window.kiddoAudio.playFanfare === 'function') {
          window.kiddoAudio.playFanfare();
        }
      } else if (similarity >= 0.5) {
        stars = 2;
        feedback = isRu ? '👍 Очень хорошо! Почти идеально!' : '👍 Juda yaxshi! Deyarli to‘g‘ri!';
        if (window.gamificationHub) {
          window.gamificationHub.addXP(10, '(Talaffuz)');
        }
        if (window.kiddoAudio && typeof window.kiddoAudio.playSuccess === 'function') {
          window.kiddoAudio.playSuccess();
        }
      } else {
        stars = 1;
        feedback = isRu ? '💪 Хорошая попытка! Послушай ещё раз и повтори!' : '💪 Yaxshi harakat! Yana bir bor eshitib, qaytaring!';
        // Record in Leitner engine for review
        if (window.EduLearningEngine) {
          window.EduLearningEngine.recordAttempt('english', current.word, current, false);
        }
        if (window.kiddoAudio && typeof window.kiddoAudio.playPop === 'function') {
          window.kiddoAudio.playPop();
        }
      }

      if (statusEl) statusEl.textContent = feedback;
      if (starsEl) starsEl.textContent = '⭐'.repeat(stars);
      if (heardEl) {
        heardEl.innerHTML = isRu
          ? `Услышано: <strong>${spokenText}</strong> (Цель: ${target})`
          : `Eshitildi: <strong>${spokenText}</strong> (Kutilgan: ${target})`;
      }
      if (resultBox) resultBox.classList.add('active');
    }

    nextWord() {
      this.currentIndex = (this.currentIndex + 1) % PHONICS_WORDS.length;
      this.renderWordUI();

      const resultBox = document.getElementById('speech-result-box');
      if (resultBox) resultBox.classList.remove('active');

      const statusEl = document.getElementById('speech-grader-status');
      const isRu = this.getLang() === 'ru';
      if (statusEl) statusEl.textContent = isRu ? 'Нажмите на микрофон и произнесите слово' : 'Mikrofonni bosing va so‘zni ayting';

      // Play word sound automatically
      setTimeout(() => this.speakCurrentWord(), 300);
    }

    renderWordUI() {
      const item = this.getCurrentWordItem();
      const isRu = this.getLang() === 'ru';

      const emojiEl = document.getElementById('speech-card-emoji');
      const wordEl = document.getElementById('speech-target-word');
      const phoneticsEl = document.getElementById('speech-phonetics-badge');
      const transEl = document.getElementById('speech-card-trans');
      const progressEl = document.getElementById('speech-progress-tag');

      if (emojiEl) emojiEl.textContent = item.emoji;
      if (wordEl) wordEl.textContent = item.word;
      if (phoneticsEl) phoneticsEl.textContent = item.phonetics;
      if (transEl) transEl.textContent = isRu ? item.translationRu : item.translationUz;
      if (progressEl) progressEl.textContent = `${this.currentIndex + 1} / ${PHONICS_WORDS.length}`;
    }

    levenshtein(a, b) {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    }
  }

  window.EduSpeechGrader = new SpeechPronunciationGrader();

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('speech-card-emoji')) {
      window.EduSpeechGrader.renderWordUI();
    }
  });
})();
