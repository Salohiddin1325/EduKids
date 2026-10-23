/**
 * MathKids - Audio Engine Adapter
 * Powered by Unified Core Audio Engine (shared/audio.js)
 * 100% Offline, Zero external dependencies, Calibrated Child-Friendly Volume (0.55)
 */

(function () {
  'use strict';

  const dummy = {
    playPop: () => {},
    playCorrect: () => {},
    playSuccess: () => {},
    playWrong: () => {},
    playError: () => {},
    playDing: () => {},
    playBuzzer: () => {},
    playFanfare: () => {},
    playCheer: () => {},
    playCoin: () => {},
    playCollect: () => {},
    playWhoosh: () => {},
    playSwoosh: () => {},
    playChime: () => {},
    playBoing: () => {},
    playBounce: () => {},
    playLaser: () => {},
    playExplosion: () => {},
    toggleSound: () => true,
    toggleTurtleMode: () => false
  };

  window.mathAudio = window.kiddoAudio || dummy;

  window.MathAudioEngine = window.UnifiedKiddoAudioEngine || class {
    constructor() {
      return window.mathAudio;
    }
  };
})();
