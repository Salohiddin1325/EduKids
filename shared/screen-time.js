/**
 * EduKids — Eye Safety & Screen Time Limiter ("Cosmo bilan Dam Olish")
 * In line with AAP / COPPA 20-20-20 eye strain guidelines for kids.
 */

(function () {
  'use strict';

  const STORAGE_KEY_MINUTES = 'kiddo_active_session_seconds';
  const STORAGE_KEY_INTERVAL = 'kiddo_screen_break_interval'; // default 20 minutes
  const DEFAULT_INTERVAL_MINUTES = 20;

  class ScreenTimeManager {
    constructor() {
      this.intervalMinutes = parseInt(localStorage.getItem(STORAGE_KEY_INTERVAL) || `${DEFAULT_INTERVAL_MINUTES}`, 10);
      this.activeSeconds = parseInt(sessionStorage.getItem(STORAGE_KEY_MINUTES) || '0', 10);
      this.overlayEl = null;
      this.countdownTimer = null;
      this.remainingBreakSeconds = 30;
      this.isBreakActive = false;

      this.initTimer();
      this.createOverlayDOM();
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    initTimer() {
      // Ticking active seconds
      setInterval(() => {
        if (this.isBreakActive || document.hidden) return;
        this.activeSeconds += 1;
        sessionStorage.setItem(STORAGE_KEY_MINUTES, `${this.activeSeconds}`);

        // Trigger break after configured interval
        if (this.activeSeconds >= this.intervalMinutes * 60) {
          this.triggerBreak();
        }
      }, 1000);
    }

    triggerBreak() {
      if (this.isBreakActive) return;
      this.isBreakActive = true;
      this.remainingBreakSeconds = 30;

      // Play soothing chime via Web Audio API
      this.playGentleChime();

      if (!this.overlayEl) this.createOverlayDOM();
      this.updateTexts();
      this.overlayEl.classList.add('active');

      const countNum = document.getElementById('screen-time-countdown-num');
      const contBtn = document.getElementById('btn-screen-time-continue');
      if (contBtn) contBtn.disabled = true;

      clearInterval(this.countdownTimer);
      this.countdownTimer = setInterval(() => {
        this.remainingBreakSeconds -= 1;
        if (countNum) countNum.textContent = `${this.remainingBreakSeconds}s`;

        if (this.remainingBreakSeconds <= 0) {
          clearInterval(this.countdownTimer);
          if (contBtn) {
            contBtn.disabled = false;
            const isRu = this.getLang() === 'ru';
            contBtn.textContent = isRu ? '✨ Готово! Продолжить' : '✨ Tayyor! Davom etamiz';
          }
        }
      }, 1000);
    }

    finishBreak() {
      this.isBreakActive = false;
      this.activeSeconds = 0;
      sessionStorage.setItem(STORAGE_KEY_MINUTES, '0');
      clearInterval(this.countdownTimer);
      if (this.overlayEl) {
        this.overlayEl.classList.remove('active');
      }
      if (window.kiddoAudio && typeof window.kiddoAudio.playSuccess === 'function') {
        window.kiddoAudio.playSuccess();
      }
    }

    skipBreakWithParentGate() {
      const isRu = this.getLang() === 'ru';
      const a = Math.floor(Math.random() * 5) + 3;
      const b = Math.floor(Math.random() * 5) + 2;
      const promptText = isRu
        ? `Родительский контроль: Сколько будет ${a} + ${b}?`
        : `Ota-onalar kodi: ${a} + ${b} nechiga teng?`;

      const answer = window.prompt(promptText);
      if (answer && parseInt(answer.trim(), 10) === (a + b)) {
        this.finishBreak();
      } else if (answer !== null) {
        alert(isRu ? 'Неверный ответ.' : 'Noto‘g‘ri javob.');
      }
    }

    playGentleChime() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);
          gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.15 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.15 + 0.9);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.95);
        });
      } catch (e) {}
    }

    updateTexts() {
      const isRu = this.getLang() === 'ru';
      const title = document.getElementById('screen-time-title');
      const desc = document.getElementById('screen-time-desc');
      const step1 = document.getElementById('ex-step-1');
      const step2 = document.getElementById('ex-step-2');
      const step3 = document.getElementById('ex-step-3');
      const contBtn = document.getElementById('btn-screen-time-continue');
      const skipBtn = document.getElementById('btn-screen-time-skip');

      if (title) title.textContent = isRu ? 'Время отдохнуть глазкам! 🌿' : 'Ko‘zlarimizni Dam Oldiramiz! 🌿';
      if (desc) desc.textContent = isRu
        ? 'Мы отлично занимались 20 минут! Сделаем простую гимнастику, чтобы глазки оставались зоркими и здоровыми.'
        : '20 daqiqa zo‘r shug‘ullandik! Keling, ko‘zlarimiz doim charoq va sog‘lom bo‘lishi uchun birga dam beramiz.';
      if (step1) step1.innerHTML = isRu ? '<span class="exercise-step-icon">🏔️</span>Посмотри вдаль' : '<span class="exercise-step-icon">🏔️</span>Uzoqqa qara';
      if (step2) step2.innerHTML = isRu ? '<span class="exercise-step-icon">👀</span>Моргни 5 раз' : '<span class="exercise-step-icon">👀</span>5 marta pirpira';
      if (step3) step3.innerHTML = isRu ? '<span class="exercise-step-icon">🫁</span>Вдохни глубоко' : '<span class="exercise-step-icon">🫁</span>Chuqur nafas ol';
      if (contBtn && contBtn.disabled) contBtn.textContent = isRu ? 'Отдыхаем...' : 'Dam olyapmiz...';
      if (skipBtn) skipBtn.textContent = isRu ? 'Родительский пропуск' : 'Ota-ona kodi';
    }

    createOverlayDOM() {
      if (document.getElementById('screen-time-break-overlay')) {
        this.overlayEl = document.getElementById('screen-time-break-overlay');
        return;
      }

      const overlay = document.createElement('div');
      overlay.id = 'screen-time-break-overlay';
      overlay.className = 'screen-time-overlay';
      overlay.innerHTML = `
        <div class="screen-time-card">
          <div class="screen-time-mascot-wrap">🤖</div>
          <h2 class="screen-time-title" id="screen-time-title">Ko‘zlarimizni Dam Oldiramiz! 🌿</h2>
          <p class="screen-time-desc" id="screen-time-desc">
            20 daqiqa zo‘r shug‘ullandik! Keling, ko‘zlarimiz sog‘lom bo‘lishi uchun birga dam beramiz.
          </p>

          <div class="screen-time-exercises">
            <div class="exercise-step" id="ex-step-1">
              <span class="exercise-step-icon">🏔️</span>
              <span>Uzoqqa qara</span>
            </div>
            <div class="exercise-step" id="ex-step-2">
              <span class="exercise-step-icon">👀</span>
              <span>5 marta pirpira</span>
            </div>
            <div class="exercise-step" id="ex-step-3">
              <span class="exercise-step-icon">🫁</span>
              <span>Chuqur nafas ol</span>
            </div>
          </div>

          <div class="breathing-circle-wrap">
            <div class="breathing-circle-outer"></div>
            <div class="breathing-circle-inner">
              <div id="screen-time-countdown-num">30s</div>
              <span>Nafas</span>
            </div>
          </div>

          <div class="screen-time-footer">
            <button type="button" class="btn-screen-time-parent-skip" id="btn-screen-time-skip" onclick="window.EduScreenTime.skipBreakWithParentGate()">
              Ota-ona kodi
            </button>
            <button type="button" class="btn-screen-time-continue" id="btn-screen-time-continue" disabled onclick="window.EduScreenTime.finishBreak()">
              Dam olyapmiz...
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.overlayEl = overlay;
    }
  }

  window.EduScreenTime = new ScreenTimeManager();
})();
