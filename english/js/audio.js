/**
 * KiddoLingo - English Audio & Speech Adapter
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
    playFanfare: () => {},
    playCheer: () => {},
    playFlip: () => {},
    playSparkle: () => {},
    playBoing: () => {},
    playWhoosh: () => {},
    playChime: () => {},
    playCoin: () => {},
    playCollect: () => {},
    speak: () => {},
    toggleSound: () => true,
    toggleTurtleMode: () => false
  };

  window.soundEngine = window.kiddoAudio || dummy;
  window.EnglishAudio = window.soundEngine;

  window.SoundEngine = window.UnifiedKiddoAudioEngine || class {
    constructor() {
      return window.soundEngine;
    }
  };
})();
