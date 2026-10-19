/**
 * KiddoEducation - Screen-Wide Magical Items Visual Effects Engine (VFX)
 * Provides immersive real-time VFX and sound themes triggered by equipped items:
 * 1. 🥽 "Wizard / Lab Goggles" (acc_goggles):
 *    - Sci-Fi / Cyberpunk Laboratory mode: Glowing neon particle trails following cursor, matrix digital rain backdrop
 * 2. 🚀 "Cosmic Astronaut Helmet" (hat_space / hat_astro_gold):
 *    - Low-gravity cosmic mode: Floating celestial stars & mini-planets drifting slowly across screen, zero-gravity float
 * 3. 🧙‍♂️ "Magician Cape & Wand" (hat_wizard / outfit_cape):
 *    - Spell-casting mode: Clicking buttons triggers colorful magic sparkle explosions and spell sound effects
 * 4. 👑 "Golden Scholar Crown" (hat_crown):
 *    - Golden shimmering aura frame vignette around viewport + 2X XP and Star multiplier!
 * 5. 🕶️ "Cool Agent Sunglasses" (acc_glasses):
 *    - Retro Cyber Dark Mode: Neon laser borders, dark carbon theme, laser sound effects
 */

(function () {
  'use strict';

  class ScreenVFXEngine {
    constructor() {
      this.activeEffects = new Set();
      this.matrixCanvas = null;
      this.matrixCtx = null;
      this.matrixAnimId = null;
      this.spaceCanvas = null;
      this.spaceCtx = null;
      this.spaceAnimId = null;
      this.cursorParticles = [];
      this.audioCtx = null;

      this.init();
    }

    init() {
      // Apply initial equipped items
      this.updateFromStorage();

      // Listen for storage changes
      window.addEventListener('storage', (e) => {
        if (e.key === 'kiddo_equipped') {
          this.updateFromStorage();
        }
      });

      // Mousemove listener for cursor particle trails
      window.addEventListener('mousemove', (e) => this.onMouseMove(e));
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          this.onMouseMove(e.touches[0]);
        }
      }, { passive: true });

      // Click listener for magician magic sparkle explosions & laser sounds
      window.addEventListener('click', (e) => this.onClick(e), true);
    }

    getAudioContext() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    }

    updateFromStorage() {
      try {
        const raw = localStorage.getItem('kiddo_equipped');
        const equipped = raw ? JSON.parse(raw) : {};
        this.applyVFX(equipped);
      } catch (e) {
        console.warn('Failed to parse equipped VFX data', e);
      }
    }

    updateFromEquipped(equipped) {
      if (!equipped && window.gamificationHub) {
        equipped = window.gamificationHub.equipped;
      }
      this.applyVFX(equipped || {});
    }

    applyVFX(equipped = {}) {
      // Clear previous classes
      document.body.classList.remove(
        'vfx-lab-goggles',
        'vfx-cosmic-astronaut',
        'vfx-magician-spell',
        'vfx-golden-crown',
        'vfx-agent-sunglasses'
      );

      const newEffects = new Set();

      // 1. Lab Goggles (acc_goggles)
      if (equipped.acc === 'acc_goggles') {
        newEffects.add('lab-goggles');
        document.body.classList.add('vfx-lab-goggles');
      }

      // 2. Cosmic Astronaut Helmet (hat_space or hat_astro_gold)
      if (equipped.hat === 'hat_space' || equipped.hat === 'hat_astro_gold') {
        newEffects.add('cosmic-astronaut');
        document.body.classList.add('vfx-cosmic-astronaut');
      }

      // 3. Magician Cape & Wand (hat_wizard or outfit_cape)
      if (equipped.hat === 'hat_wizard' || equipped.outfit === 'outfit_cape') {
        newEffects.add('magician-spell');
        document.body.classList.add('vfx-magician-spell');
      }

      // 4. Golden Scholar Crown (hat_crown)
      if (equipped.hat === 'hat_crown') {
        newEffects.add('golden-crown');
        document.body.classList.add('vfx-golden-crown');
      }

      // 5. Cool Agent Sunglasses (acc_glasses)
      if (equipped.acc === 'acc_glasses') {
        newEffects.add('agent-sunglasses');
        document.body.classList.add('vfx-agent-sunglasses');
      }

      this.activeEffects = newEffects;

      // Handle Matrix Canvas for Lab Goggles
      if (newEffects.has('lab-goggles')) {
        this.startMatrixCanvas();
      } else {
        this.stopMatrixCanvas();
      }

      // Handle Space Canvas for Cosmic Astronaut
      if (newEffects.has('cosmic-astronaut')) {
        this.startSpaceCanvas();
      } else {
        this.stopSpaceCanvas();
      }

      // Handle Crown Golden Banner
      this.updateGoldenCrownBanner(newEffects.has('golden-crown'));

      // Handle Agent HUD
      this.updateAgentHUD(newEffects.has('agent-sunglasses'));
    }

    // -------------------------------------------------------------
    // EFFECT 1: LAB GOGGLES (Matrix Code Rain + Neon Particle Trail)
    // -------------------------------------------------------------
    startMatrixCanvas() {
      if (this.matrixCanvas) return;

      const canvas = document.createElement('canvas');
      canvas.id = 'vfx-matrix-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      canvas.style.opacity = '0.35';
      document.body.prepend(canvas);

      this.matrixCanvas = canvas;
      this.matrixCtx = canvas.getContext('2d');

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      const chars = '01XYZλπΩΔΨФ01011001#*+~<>{}';
      const fontSize = 16;
      const columns = Math.floor(canvas.width / fontSize);
      const drops = Array(columns).fill(1);

      const draw = () => {
        if (!this.matrixCanvas) return;
        this.matrixCtx.fillStyle = 'rgba(15, 23, 42, 0.1)';
        this.matrixCtx.fillRect(0, 0, canvas.width, canvas.height);

        this.matrixCtx.fillStyle = '#00FFCC';
        this.matrixCtx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          this.matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        this.matrixAnimId = requestAnimationFrame(draw);
      };
      draw();
    }

    stopMatrixCanvas() {
      if (this.matrixAnimId) {
        cancelAnimationFrame(this.matrixAnimId);
        this.matrixAnimId = null;
      }
      if (this.matrixCanvas) {
        this.matrixCanvas.remove();
        this.matrixCanvas = null;
      }
    }

    onMouseMove(e) {
      if (!this.activeEffects.has('lab-goggles')) return;

      // Spawn glowing neon cyber particle following cursor
      for (let i = 0; i < 2; i++) {
        const p = document.createElement('div');
        p.className = 'vfx-neon-particle';
        const size = Math.random() * 8 + 4;
        const color = Math.random() > 0.5 ? '#00FFCC' : '#FF00A0';
        p.style.cssText = `
          position: fixed;
          left: ${e.clientX + (Math.random() * 16 - 8)}px;
          top: ${e.clientY + (Math.random() * 16 - 8)}px;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
          pointer-events: none;
          z-index: 99998;
          transition: transform 0.6s ease-out, opacity 0.6s ease-out;
        `;
        document.body.appendChild(p);

        requestAnimationFrame(() => {
          p.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(0)`;
          p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 600);
      }
    }

    // -------------------------------------------------------------
    // EFFECT 2: COSMIC ASTRONAUT (Low-Gravity Floating Planets & Stars)
    // -------------------------------------------------------------
    startSpaceCanvas() {
      if (this.spaceCanvas) return;

      const canvas = document.createElement('canvas');
      canvas.id = 'vfx-space-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      canvas.style.opacity = '0.85';
      document.body.prepend(canvas);

      this.spaceCanvas = canvas;
      this.spaceCtx = canvas.getContext('2d');

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);

      // Celestial bodies drifting in low gravity
      const planets = [
        { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 18, emoji: '🪐', vx: 0.15, vy: 0.08 },
        { x: canvas.width * 0.82, y: canvas.height * 0.35, r: 14, emoji: '🌕', vx: -0.12, vy: 0.06 },
        { x: canvas.width * 0.45, y: canvas.height * 0.75, r: 16, emoji: '🌍', vx: 0.1, vy: -0.09 },
        { x: canvas.width * 0.70, y: canvas.height * 0.80, r: 12, emoji: '⭐', vx: -0.18, vy: -0.1 },
        { x: canvas.width * 0.28, y: canvas.height * 0.60, r: 14, emoji: '🛸', vx: 0.2, vy: -0.12 }
      ];

      const drawSpace = () => {
        if (!this.spaceCanvas) return;
        this.spaceCtx.clearRect(0, 0, canvas.width, canvas.height);

        planets.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -30) p.x = canvas.width + 30;
          if (p.x > canvas.width + 30) p.x = -30;
          if (p.y < -30) p.y = canvas.height + 30;
          if (p.y > canvas.height + 30) p.y = -30;

          this.spaceCtx.font = `${p.r * 2}px sans-serif`;
          this.spaceCtx.textAlign = 'center';
          this.spaceCtx.textBaseline = 'middle';
          this.spaceCtx.shadowColor = '#60A5FA';
          this.spaceCtx.shadowBlur = 12;
          this.spaceCtx.fillText(p.emoji, p.x, p.y);
          this.spaceCtx.shadowBlur = 0;
        });

        this.spaceAnimId = requestAnimationFrame(drawSpace);
      };
      drawSpace();
    }

    stopSpaceCanvas() {
      if (this.spaceAnimId) {
        cancelAnimationFrame(this.spaceAnimId);
        this.spaceAnimId = null;
      }
      if (this.spaceCanvas) {
        this.spaceCanvas.remove();
        this.spaceCanvas = null;
      }
    }

    // -------------------------------------------------------------
    // EFFECT 3: MAGICIAN CAPE & WAND (Magic Sparkle Explosions & Chimes)
    // -------------------------------------------------------------
    onClick(e) {
      // 1. Magician Sparkle explosion on clicking any button or interactive element
      if (this.activeEffects.has('magician-spell')) {
        const target = e.target.closest('button, a, .card, .portal-card, .store-card, .quiz-option-btn, input, .level-map-node');
        if (target) {
          this.triggerMagicSparkles(e.clientX, e.clientY);
          this.playMagicSpellSound();
        }
      }

      // 2. Agent Laser Sound
      if (this.activeEffects.has('agent-sunglasses')) {
        const target = e.target.closest('button, a, .portal-card, .store-card');
        if (target) {
          this.playLaserSound();
        }
      }
    }

    triggerMagicSparkles(x, y) {
      const sparkles = ['✨', '⭐', '💫', '🌟', '🔮', '🎉'];
      const colors = ['#C084FC', '#F472B6', '#FBBF24', '#38BDF8', '#34D399'];

      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'vfx-magic-sparkle';
        const char = sparkles[Math.floor(Math.random() * sparkles.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        p.textContent = char;
        p.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          font-size: ${Math.random() * 16 + 14}px;
          color: ${color};
          text-shadow: 0 0 10px ${color};
          pointer-events: none;
          z-index: 99999;
          transition: transform 0.75s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.75s ease-out;
        `;
        document.body.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 90 + 35;
        const destX = Math.cos(angle) * dist;
        const destY = Math.sin(angle) * dist - 25;

        requestAnimationFrame(() => {
          p.style.transform = `translate(${destX}px, ${destY}px) rotate(${Math.random() * 360}deg) scale(0)`;
          p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 750);
      }
    }

    playMagicSpellSound() {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + idx * 0.04;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, start + 0.15);

          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + 0.24);
        });
      } catch (e) {}
    }

    playLaserSound() {
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
      } catch (e) {}
    }

    // -------------------------------------------------------------
    // EFFECT 4: GOLDEN SCHOLAR CROWN (Shimmering Aura Frame & 2X Multiplier)
    // -------------------------------------------------------------
    updateGoldenCrownBanner(isActive) {
      let banner = document.getElementById('vfx-gold-crown-banner');
      if (isActive) {
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'vfx-gold-crown-banner';
          banner.className = 'vfx-crown-ribbon';
          banner.innerHTML = `
            <span>👑</span>
            <span><strong>OLTIN TOJ:</strong> 2X XP & Yulduzlar Kuchaytirgichi Faol!</span>
          `;
          document.body.appendChild(banner);
        }
      } else {
        if (banner) banner.remove();
      }
    }

    // -------------------------------------------------------------
    // EFFECT 5: COOL AGENT SUNGLASSES (Retro Cyber Dark Mode HUD)
    // -------------------------------------------------------------
    updateAgentHUD(isActive) {
      let hud = document.getElementById('vfx-agent-hud-badge');
      if (isActive) {
        if (!hud) {
          hud = document.createElement('div');
          hud.id = 'vfx-agent-hud-badge';
          hud.className = 'vfx-agent-badge';
          hud.innerHTML = `
            <span>🕶️</span>
            <span>CYBER AGENT 007 MODE</span>
          `;
          document.body.appendChild(hud);
        }
      } else {
        if (hud) hud.remove();
      }
    }
  }

  window.screenVFXEngine = new ScreenVFXEngine();
})();
