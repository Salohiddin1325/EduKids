/**
 * PhysicsKids - Magnet Maze & Star Rescue Mini-Game
 * Guide the iron rescue ball through the obstacle maze using magnetic attraction & repulsion!
 */

class MagnetMazeGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.active = false;
    this.animFrame = null;

    // Game state
    this.score = 0;
    this.starsCollected = 0;
    this.totalStars = 4;
    this.isRepelMode = false; // false = attract (pull), true = repel (push)

    // Ball physics
    this.ball = {
      x: 60,
      y: 60,
      vx: 0,
      vy: 0,
      radius: 16,
      color: '#94A3B8'
    };

    // Magnet wand position (mouse / touch)
    this.wand = {
      x: 100,
      y: 100,
      active: false
    };

    // Maze elements
    this.walls = [];
    this.stars = [];
    this.portal = { x: 0, y: 0, radius: 26 };
    this.particles = [];
  }

  init() {
    this.canvas = document.getElementById('magnet-maze-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Controls
    const togglePoleBtn = document.getElementById('maze-toggle-pole-btn');
    if (togglePoleBtn) {
      togglePoleBtn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        this.isRepelMode = !this.isRepelMode;
        this.updatePoleButtonText();
        togglePoleBtn.classList.toggle('repel-active', this.isRepelMode);
      });
    }

    const startBtn = document.getElementById('maze-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.toggleStart());
    }

    // Pointer events (Mouse & Touch)
    const updateWand = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.wand.x = clientX - rect.left;
      this.wand.y = clientY - rect.top;
      this.wand.active = true;
    };

    this.canvas.addEventListener('mousemove', (e) => updateWand(e.clientX, e.clientY));
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const t = e.touches[0];
      updateWand(t.clientX, t.clientY);
    }, { passive: false });

    this.canvas.addEventListener('mouseleave', () => this.wand.active = false);
    this.canvas.addEventListener('touchend', () => this.wand.active = false);

    this.buildMaze();
  }

  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  updatePoleButtonText() {
    const togglePoleBtn = document.getElementById('maze-toggle-pole-btn');
    if (!togglePoleBtn) return;
    const isRu = this.getLang() === 'ru';
    if (this.isRepelMode) {
      togglePoleBtn.innerHTML = isRu 
        ? '<span>⚡ Режим: <strong>Отталкивание (Repel)</strong></span>' 
        : '<span>⚡ Rejim: <strong>Itarish (Repel)</strong></span>';
    } else {
      togglePoleBtn.innerHTML = isRu 
        ? '<span>🧲 Режим: <strong>Притяжение (Attract)</strong></span>' 
        : '<span>🧲 Rejim: <strong>Tortish (Attract)</strong></span>';
    }
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 440;
    this.buildMaze();
  }

  buildMaze() {
    if (!this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ball.x = 55;
    this.ball.y = 55;
    this.ball.vx = 0;
    this.ball.vy = 0;

    this.portal = { x: w - 60, y: h - 60, radius: 26 };

    // Walls
    this.walls = [
      { x: w * 0.3, y: 0, w: 20, h: h * 0.65 },
      { x: w * 0.65, y: h * 0.35, w: 20, h: h * 0.65 },
      { x: w * 0.45, y: h * 0.35, w: w * 0.22, h: 20 }
    ];

    // Stars to collect
    this.stars = [
      { x: w * 0.18, y: h * 0.75, radius: 14, collected: false },
      { x: w * 0.48, y: h * 0.18, radius: 14, collected: false },
      { x: w * 0.52, y: h * 0.65, radius: 14, collected: false },
      { x: w * 0.85, y: h * 0.25, radius: 14, collected: false }
    ];

    this.totalStars = this.stars.length;
    this.starsCollected = 0;
    this.updateStatsUI();
  }

  toggleStart() {
    if (this.active) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.active = true;
    this.score = 0;
    this.buildMaze();

    const isRu = this.getLang() === 'ru';
    const startBtn = document.getElementById('maze-start-btn');
    if (startBtn) startBtn.textContent = isRu ? '⏸️ Пауза / Pause' : '⏸️ To‘xtatish / Pause';

    const winBanner = document.getElementById('maze-win-banner');
    if (winBanner) winBanner.style.display = 'none';

    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.loop();
  }

  stop() {
    this.active = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    const isRu = this.getLang() === 'ru';
    const startBtn = document.getElementById('maze-start-btn');
    if (startBtn) startBtn.textContent = isRu ? '▶️ Начать игру / Start Game' : '▶️ O‘yinni Boshlash / Start Game';
  }

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  update() {
    const b = this.ball;

    // Apply magnetic force from wand
    if (this.wand.active) {
      const dx = this.wand.x - b.x;
      const dy = this.wand.y - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5 && dist < 240) {
        const force = (1 - dist / 240) * 0.65;
        const dir = this.isRepelMode ? -1 : 1;
        b.vx += (dx / dist) * force * dir;
        b.vy += (dy / dist) * force * dir;
      }
    }

    // Damping / Friction
    b.vx *= 0.94;
    b.vy *= 0.94;

    // Move
    b.x += b.vx;
    b.y += b.vy;

    // Canvas boundary collision
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -0.6; window.physicsAudio.playBounce(); }
    if (b.x + b.radius > w) { b.x = w - b.radius; b.vx *= -0.6; window.physicsAudio.playBounce(); }
    if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -0.6; window.physicsAudio.playBounce(); }
    if (b.y + b.radius > h) { b.y = h - b.radius; b.vy *= -0.6; window.physicsAudio.playBounce(); }

    // Wall collisions
    this.walls.forEach(wall => {
      // Nearest point on rectangle to circle
      const nearestX = Math.max(wall.x, Math.min(b.x, wall.x + wall.w));
      const nearestY = Math.max(wall.y, Math.min(b.y, wall.y + wall.h));
      const distX = b.x - nearestX;
      const distY = b.y - nearestY;
      const distance = Math.hypot(distX, distY);

      if (distance < b.radius) {
        // Bounce off wall
        const overlap = b.radius - distance;
        const normX = distX / (distance || 1);
        const normY = distY / (distance || 1);

        b.x += normX * overlap;
        b.y += normY * overlap;
        b.vx *= -0.5;
        b.vy *= -0.5;
        window.physicsAudio.playBounce();
      }
    });

    // Collect stars
    this.stars.forEach(star => {
      if (!star.collected) {
        const d = Math.hypot(b.x - star.x, b.y - star.y);
        if (d < b.radius + star.radius) {
          star.collected = true;
          this.starsCollected++;
          this.score += 25;
          window.physicsAudio.playCorrect();
          this.createSparkles(star.x, star.y, '#FFD166');
          window.physicsApp.addStars(1);
          this.updateStatsUI();
        }
      }
    });

    // Check finish portal
    const distToPortal = Math.hypot(b.x - this.portal.x, b.y - this.portal.y);
    if (distToPortal < b.radius + this.portal.radius && this.starsCollected >= this.totalStars) {
      this.handleVictory();
    }

    // Fade particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  createSparkles(x, y, color) {
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        alpha: 1
      });
    }
  }

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark high-tech sci-fi grid
    this.ctx.fillStyle = '#0F172A';
    this.ctx.fillRect(0, 0, w, h);

    // Subtle Grid Lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, h); this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(w, y); this.ctx.stroke();
    }

    // Draw Walls
    this.ctx.fillStyle = '#334155';
    this.ctx.strokeStyle = '#8B5CF6';
    this.ctx.lineWidth = 3;
    this.walls.forEach(wall => {
      this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      this.ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
    });

    // Draw Stars
    this.stars.forEach(star => {
      if (!star.collected) {
        this.ctx.save();
        this.ctx.font = '24px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('⭐', star.x, star.y);
        this.ctx.restore();
      }
    });

    // Draw Portal
    this.ctx.save();
    this.ctx.strokeStyle = this.starsCollected >= this.totalStars ? '#10B981' : '#64748B';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([6, 6]);
    this.ctx.beginPath();
    this.ctx.arc(this.portal.x, this.portal.y, this.portal.radius, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.font = '28px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.starsCollected >= this.totalStars ? '🌀' : '🔒', this.portal.x, this.portal.y);
    this.ctx.restore();

    // Draw Magnetic Field Waves if wand active
    if (this.wand.active) {
      const dist = Math.hypot(this.wand.x - this.ball.x, this.wand.y - this.ball.y);
      if (dist < 240) {
        this.ctx.save();
        this.ctx.strokeStyle = this.isRepelMode ? 'rgba(239, 68, 68, 0.4)' : 'rgba(6, 182, 212, 0.4)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.wand.x, this.wand.y);
        this.ctx.lineTo(this.ball.x, this.ball.y);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

    // Draw Particles
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Draw Ball (Iron Sphere)
    this.ctx.save();
    this.ctx.fillStyle = '#CBD5E1';
    this.ctx.strokeStyle = '#06B6D4';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Ball Emoji Center
    this.ctx.font = '16px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('⚙️', this.ball.x, this.ball.y);
    this.ctx.restore();

    // Draw Wand Cursor
    if (this.wand.active) {
      this.ctx.save();
      this.ctx.font = '28px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.isRepelMode ? '⚡' : '🧲', this.wand.x, this.wand.y);
      this.ctx.restore();
    }
  }

  updateStatsUI() {
    const scoreEl = document.getElementById('maze-score-display');
    const starsEl = document.getElementById('maze-stars-display');
    if (scoreEl) scoreEl.textContent = this.score;
    if (starsEl) starsEl.textContent = `${this.starsCollected} / ${this.totalStars}`;
  }

  handleVictory() {
    this.stop();
    window.physicsAudio.playFanfare();
    if (window.physicsConfetti) window.physicsConfetti.launch(80, 0.5, 0.5);
    window.physicsApp.unlockBadge('maze-champ');

    const isRu = this.getLang() === 'ru';
    const title = isRu ? 'Вы Достигли Портала! / Victory!' : 'Portalga Yetib Keldingiz! / Victory!';
    const desc = isRu 
      ? 'Все звезды собраны, и магнитный лабиринт успешно пройден!' 
      : 'Barcha yulduzlar to‘plandi va magnit yordamida labirint zabt etildi!';
    const scoreText = isRu ? `⭐ Набранные Очки: <strong>${this.score}</strong>` : `⭐ To‘plangan Ball: <strong>${this.score}</strong>`;
    const btnReplay = isRu ? '🔄 Сыграть снова (Уровень 1)' : '🔄 Qaytadan O‘ynash (1-daraja)';
    const btnNext = isRu ? '🚀 Уровень 2 • 👑 Pro' : '🚀 Keyingi Daraja (2-daraja • 👑 Pro)';

    const winBanner = document.getElementById('maze-win-banner');
    if (winBanner) {
      winBanner.innerHTML = `
        <div class="maze-win-card bounce-in">
          <div class="win-trophy">🌀🏆</div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <div class="win-score-pill">${scoreText}</div>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
            <button class="btn btn-secondary" onclick="window.magnetMazeGame.start()">
              ${btnReplay}
            </button>
            <button class="btn btn-primary" onclick="window.magnetMazeGame.tryNextLevel()">
              ${btnNext}
            </button>
          </div>
        </div>
      `;
      winBanner.style.display = 'block';
    }
  }

  tryNextLevel() {
    if (window.subscriptionManager && !window.subscriptionManager.canPlayGameLevel('physics_maze', 2)) {
      return;
    }
    const winBanner = document.getElementById('maze-win-banner');
    if (winBanner) winBanner.style.display = 'none';
    this.currentLevel = 2;
    this.start();
  }
}

window.magnetMazeGame = new MagnetMazeGame();
