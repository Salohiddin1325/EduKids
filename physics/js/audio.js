/**
 * PhysicsKids - Audio Engine Adapter
 * Powered by Unified Core Audio Engine (shared/audio.js)
 * 100% Offline, Zero external dependencies, Calibrated Child-Friendly Volume (0.55)
 */

(function () {
  'use strict';

  const dummy = {
    playPop: () => {},
    playBounce: () => {},
    playMagnetSnap: () => {},
    playRepel: () => {},
    playSizzle: () => {},
    playCorrect: () => {},
    playSuccess: () => {},
    playWrong: () => {},
    playError: () => {},
    playFanfare: () => {},
    playCheer: () => {},
    playCollect: () => {},
    playCoin: () => {},
    playWhoosh: () => {},
    playChime: () => {},
    playBoing: () => {},
    toggleSound: () => true,
    toggleTurtleMode: () => false
  };

  window.physicsAudio = window.kiddoAudio || dummy;

  window.PhysicsAudioEngine = window.UnifiedKiddoAudioEngine || class {
    constructor() {
      return window.physicsAudio;
    }
  };
})();
