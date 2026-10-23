/**
 * MathKids - Audio Engine Adapter
 * Powered by Unified Core Audio Engine (shared/audio.js)
 * 100% Offline, Zero external dependencies, Safe Child Volume Limiter (<= 0.35)
 */

(function () {
  'use strict';

  window.mathAudio = window.kiddoAudio || {
    playPop: () => {},
    playCorrect: () => {},
    playWrong: () => {},
    playDing: () => {},
    playBuzzer: () => {},
    playFanfare: () => {},
    playLaser: () => {},
    playExplosion: () => {},
    toggleSound: () => true
  };

  window.MathAudioEngine = window.UnifiedKiddoAudioEngine || class {
    constructor() {
      return window.mathAudio;
    }
  };
})();
