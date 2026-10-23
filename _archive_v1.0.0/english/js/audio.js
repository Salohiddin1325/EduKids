/**
 * KiddoLingo - English Audio & Speech Adapter
 * Powered by Unified Core Audio Engine (shared/audio.js)
 * 100% Offline, Zero external dependencies, Safe Child Volume Limiter (<= 0.35)
 */

(function () {
  'use strict';

  window.soundEngine = window.kiddoAudio || {
    playPop: () => {},
    playSuccess: () => {},
    playError: () => {},
    playFanfare: () => {},
    playFlip: () => {},
    playSparkle: () => {},
    playBoing: () => {},
    speak: () => {},
    toggleSound: () => true,
    toggleTurtleMode: () => false
  };

  window.EnglishAudio = window.soundEngine;

  window.SoundEngine = window.UnifiedKiddoAudioEngine || class {
    constructor() {
      return window.soundEngine;
    }
  };
})();
