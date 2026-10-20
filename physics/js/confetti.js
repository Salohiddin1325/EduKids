/**
 * PhysicsKids - Confetti Engine Adapter
 * Powered by Unified ScreenVFX Engine (shared/screen-vfx.js)
 */

(function () {
  'use strict';

  class PhysicsConfettiAdapter {
    launch(count = 70, ox = 0.5, oy = 0.5) {
      if (window.ScreenVFX && typeof window.ScreenVFX.launchConfetti === 'function') {
        window.ScreenVFX.launchConfetti(
          count,
          ox,
          oy,
          ['⚛️', '⚡', '💡', '🧲', '🌟', '●', '▲'],
          ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#3B82F6']
        );
      }
    }
  }

  window.physicsConfetti = new PhysicsConfettiAdapter();
  window.PhysicsConfetti = PhysicsConfettiAdapter;
})();
