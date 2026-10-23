/**
 * MathKids - Celebration Confetti & Sparkles Adapter
 * Powered by Unified ScreenVFX Engine (shared/screen-vfx.js)
 */

(function () {
  'use strict';

  class MathConfettiAdapter {
    launch(count = 70, ox = 0.5, oy = 0.5) {
      if (window.ScreenVFX && typeof window.ScreenVFX.launchConfetti === 'function') {
        window.ScreenVFX.launchConfetti(
          count,
          ox,
          oy,
          ['+', '-', '×', '÷', '=', '★', '●', '▲'],
          ['#FF5E13', '#10B981', '#2563EB', '#FFD166', '#7C3AED', '#00E676']
        );
      }
    }
  }

  window.mathConfetti = new MathConfettiAdapter();
  window.MathConfetti = MathConfettiAdapter;
})();
