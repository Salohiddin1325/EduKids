/**
 * KiddoLingo - Confetti Engine Adapter
 * Powered by Unified ScreenVFX Engine (shared/screen-vfx.js)
 */

(function () {
  'use strict';

  class ConfettiEngineAdapter {
    launch(count = 70, ox = 0.5, oy = 0.5) {
      if (window.ScreenVFX && typeof window.ScreenVFX.launchConfetti === 'function') {
        window.ScreenVFX.launchConfetti(
          count,
          ox,
          oy,
          ['★', '●', '▲', '🎈', '✨'],
          ['#FF477E', '#FFB703', '#06D6A0', '#48CAE4', '#845EC2', '#FF9671', '#FFE66D']
        );
      }
    }
  }

  window.confettiEngine = new ConfettiEngineAdapter();
  window.ConfettiEngine = ConfettiEngineAdapter;
})();
