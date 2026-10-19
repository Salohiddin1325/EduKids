/**
 * MathKids - Math Rocket Blaster & Space Defender Mini-Game
 * Action-oriented math game featuring 50+ progressive levels and World Map progression:
 *   - Levels 1–10: Starter / Beginner (Easy)
 *   - Levels 11–25: Explorer / Intermediate (Medium)
 *   - Levels 26–50+: Master / Expert (Challenging)
 */

class MathRocketGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.active = false;
    this.animFrame = null;

    // Progression & Level
    this.currentLevel = 1;
    this.targetScore = 80;
    this.asteroidSpeedMultiplier = 1.0;

    // Game stats
    this.score = 0;
    this.lives = 3;
    this.combo = 1;
    this.targetProblem = null;
    
    // Entities
    this.asteroids = [];
    this.lasers = [];
    this.particles = [];
    this.stars = [];
    this.rocketX = 0;
  }

  init() {
    this.canvas = document.getElementById('rocket-game-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initStarfield();

    // Canvas click / touch listener
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.handleCanvasClick(touch);
    }, { passive: false });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 460;
    this.rocketX = this.canvas.width / 2;
  }

  initStarfield() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * (this.canvas ? this.canvas.width : 600),
        y: Math.random() * 460,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1.5 + 0.5
      });
    }
  }

  start(forcedLevel = null) {
    if (forcedLevel) {
      this.currentLevel = forcedLevel;
    } else if (window.levelProgressionSystem) {
      this.currentLevel = window.levelProgressionSystem.getCurrentLevel('math_rocket');
    }

    const cfg = window.levelProgressionSystem 
      ? window.levelProgressionSystem.getLevelConfig('math_rocket', this.currentLevel)
      : { speedMultiplier: 1.0, tier: { nameUz: 'Oson', nameRu: 'Легкий' } };

    this.targetScore = 60 + (this.currentLevel * 20);
    this.asteroidSpeedMultiplier = cfg.speedMultiplier;

    // Update Level Display
    const lvlEl = document.getElementById('rocket-level-display');
    if (lvlEl) {
      const isRu = this.getLang() === 'ru';
      lvlEl.textContent = `${this.currentLevel} (${isRu ? cfg.tier.nameRu : cfg.tier.nameUz})`;
    }

    // Hide any game over banner
    const banner = document.getElementById('rocket-game-over-banner');
    if (banner) banner.style.display = 'none';

    this.active = true;
    this.score = 0;
    this.lives = 3;
    this.combo = 1;
    this.asteroids = [];
    this.lasers = [];
    this.particles = [];

    this.updateStatsUI();
    this.generateNewTarget();
    this.spawnAsteroidsForTarget();

    const isRu = this.getLang() === 'ru';
    const startBtn = document.getElementById('rocket-start-btn');
    if (startBtn) startBtn.textContent = isRu ? '⏸️ Пауза / Pause' : '⏸️ To‘xtatish / Pause';

    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.loop();
  }

  getLang() {
    return window.mathApp ? window.mathApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  stop() {
    this.active = false;
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    const isRu = this.getLang() === 'ru';
    const startBtn = document.getElementById('rocket-start-btn');
    if (startBtn) startBtn.textContent = isRu ? '🚀 Начать игру / Launch' : '🚀 O‘yinni boshlash / Launch Game';
  }

  generateNewTarget() {
    let ops = ['+', '-'];
    if (this.currentLevel >= 11) ops.push('×');
    if (this.currentLevel >= 26) ops.push('÷');

    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === '+') {
      const maxVal = this.currentLevel <= 10 ? 10 + this.currentLevel : (this.currentLevel <= 25 ? 50 : 100);
      a = Math.floor(Math.random() * maxVal) + 2;
      b = Math.floor(Math.random() * maxVal) + 2;
      ans = a + b;
    } else if (op === '-') {
      const maxVal = this.currentLevel <= 10 ? 12 : (this.currentLevel <= 25 ? 50 : 100);
      b = Math.floor(Math.random() * maxVal) + 2;
      a = b + Math.floor(Math.random() * maxVal) + 1;
      ans = a - b;
    } else if (op === '×') {
      const maxFactor = this.currentLevel <= 25 ? 6 : 12;
      a = Math.floor(Math.random() * maxFactor) + 2;
      b = Math.floor(Math.random() * maxFactor) + 2;
      ans = a * b;
    } else { // Division
      b = Math.floor(Math.random() * 9) + 2;
      ans = Math.floor(Math.random() * 10) + 1;
      a = b * ans;
    }

    this.targetProblem = { a, b, op, ans };
    const hud = document.getElementById('rocket-target-display');
    if (hud) {
      const isRu = this.getLang() === 'ru';
      hud.innerHTML = `${isRu ? 'Мишень:' : 'Nishon:'} <strong>${a} ${op} ${b} = ?</strong> (Maqsad: ${this.score}/${this.targetScore})`;
    }
  }

  spawnAsteroidsForTarget() {
    this.asteroids = [];
    const ans = this.targetProblem.ans;
    const values = [ans];

    while (values.length < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 6) + 1);
      const fake = Math.max(1, ans + offset);
      if (!values.includes(fake)) values.push(fake);
    }

    values.sort(() => Math.random() - 0.5);

    const step = this.canvas.width / 5;
    for (let i = 0; i < 4; i++) {
      this.asteroids.push({
        x: step * (i + 1) + (Math.random() * 20 - 10),
        y: -40 - Math.random() * 60,
        radius: 34,
        value: values[i],
        isCorrect: values[i] === ans,
        speed: (Math.random() * 0.7 + 0.8) * (this.asteroidSpeedMultiplier || 1.0),
        color: values[i] === ans ? '#38BDF8' : '#94A3B8'
      });
    }
  }

  handleCanvasClick(e) {
    if (!this.active) return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check collision with asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      const ast = this.asteroids[i];
      const dist = Math.hypot(clickX - ast.x, clickY - ast.y);
      if (dist < ast.radius + 15) {
        this.blastAsteroid(ast);
        break;
      }
    }
  }

  blastAsteroid(ast) {
    window.mathAudio.playLaser();

    // Laser beam animation
    this.lasers.push({
      x1: this.canvas.width / 2,
      y1: this.canvas.height - 40,
      x2: ast.x,
      y2: ast.y,
      alpha: 1
    });

    if (ast.isCorrect) {
      setTimeout(() => {
        window.mathAudio.playExplosion();
        this.createExplosionParticles(ast.x, ast.y, '#FF5E13');
        this.score += 20 * this.combo;
        this.combo++;
        window.mathApp.addStars(1);

        this.updateStatsUI();

        // Check if level completed!
        if (this.score >= this.targetScore) {
          this.handleLevelWin();
          return;
        }

        this.generateNewTarget();
        this.spawnAsteroidsForTarget();
      }, 80);
    } else {
      setTimeout(() => {
        window.mathAudio.playWrong();
        this.createExplosionParticles(ast.x, ast.y, '#94A3B8');
        this.lives--;
        this.combo = 1;
        this.updateStatsUI();

        // Shake canvas
        this.canvas.classList.add('canvas-shake');
        setTimeout(() => this.canvas.classList.remove('canvas-shake'), 400);

        if (this.lives <= 0) {
          this.handleGameOver();
        }
      }, 80);
    }
  }

  handleLevelWin() {
    this.stop();
    window.mathAudio.playFanfare();
    if (window.mathConfetti) window.mathConfetti.launch(100, 0.5, 0.5);

    const stars = this.lives === 3 ? 3 : (this.lives === 2 ? 2 : 1);
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.recordLevelCompletion('math_rocket', this.currentLevel, stars);
    }

    window.mathApp.unlockBadge('rocket-master');

    const isRu = this.getLang() === 'ru';
    const starsStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const title = isRu 
      ? `🎉 Уровень ${this.currentLevel} успешно пройден!` 
      : `🎉 ${this.currentLevel}-Bosqich Muvaffaqiyatli Yakunlandi!`;
    const scoreText = isRu 
      ? `Набранные очки: <strong>${this.score}</strong> | Жизней осталось: <strong>${'❤️'.repeat(this.lives)}</strong>` 
      : `To‘plangan ball: <strong>${this.score}</strong> | Qolgan qalqon: <strong>${'❤️'.repeat(this.lives)}</strong>`;

    const nextLevel = this.currentLevel + 1;
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const btnNext = isRu 
      ? `🚀 Уровень ${nextLevel} ${(!isPro && nextLevel > 1) ? '• 👑 Pro' : ''}` 
      : `🚀 Keyingi Daraja (${nextLevel}) ${(!isPro && nextLevel > 1) ? '• 👑 Pro' : ''}`;

    const banner = document.getElementById('rocket-game-over-banner');
    if (banner) {
      banner.innerHTML = `
        <div class="game-over-box bounce-in" style="background: rgba(15, 23, 42, 0.95); border: 3px solid #38BDF8; border-radius: 24px; padding: 25px; color: #FFF; text-align: center; max-width: 480px; margin: 0 auto;">
          <div class="win-stars" style="font-size: 2.4rem; margin-bottom: 8px;">${starsStr}</div>
          <h3 style="font-size: 1.4rem; color: #38BDF8; margin-bottom: 10px;">${title}</h3>
          <p style="font-size: 1rem; color: #CBD5E1; margin-bottom: 18px;">${scoreText}</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="window.mathRocketGame.start(${this.currentLevel})">
              🔄 ${isRu ? 'Сыграть снова' : 'Qaytadan o‘ynash'}
            </button>
            <button class="btn btn-primary" onclick="window.mathRocketGame.tryNextLevel()">
              ${btnNext}
            </button>
            <button class="game-level-map-btn" onclick="window.mathRocketGame.openWorldMap()">
              🗺️ ${isRu ? 'Карта 50+ уровней' : '50+ Bosqichlar Xaritasi'}
            </button>
          </div>
        </div>
      `;
      banner.style.display = 'block';
    }
  }

  tryNextLevel() {
    const nextLevel = this.currentLevel + 1;
    if (window.levelProgressionSystem && !window.levelProgressionSystem.canAccessLevel('math_rocket', nextLevel)) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openGamePaywallModal('math_rocket', nextLevel);
      }
      return;
    }

    const banner = document.getElementById('rocket-game-over-banner');
    if (banner) banner.style.display = 'none';

    this.currentLevel = nextLevel;
    this.start(nextLevel);
  }

  openWorldMap() {
    if (window.levelProgressionSystem) {
      window.levelProgressionSystem.openMapModal(
        'math_rocket',
        this.getLang() === 'ru' ? 'Ракетный Перехват (Rocket Blaster)' : 'Koinot Qutqaruvchisi (Rocket Blaster)',
        (lvl) => {
          this.start(lvl);
        }
      );
    }
  }

  createExplosionParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color,
        alpha: 1
      });
    }
  }

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  update() {
    // Move asteroids
    let targetAsteroidsOffscreen = false;

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const ast = this.asteroids[i];
      ast.y += ast.speed;

      if (ast.y > this.canvas.height + 40) {
        if (ast.isCorrect) targetAsteroidsOffscreen = true;
        this.asteroids.splice(i, 1);
      }
    }

    // If correct asteroid escaped, generate new wave
    if (targetAsteroidsOffscreen || this.asteroids.length === 0) {
      this.spawnAsteroidsForTarget();
    }

    // Update laser beams
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].alpha -= 0.08;
      if (this.lasers[i].alpha <= 0) this.lasers.splice(i, 1);
    }

    // Update explosion particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }

    // Move starfield
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].y += this.stars[i].speed;
      if (this.stars[i].y > this.canvas.height) {
        this.stars[i].y = 0;
        this.stars[i].x = Math.random() * this.canvas.width;
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Deep space background
    this.ctx.fillStyle = '#0B0F19';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars
    this.ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      this.ctx.globalAlpha = Math.random() * 0.4 + 0.6;
      this.ctx.fillRect(s.x, s.y, s.size, s.size);
    }
    this.ctx.globalAlpha = 1;

    // Laser beams
    for (let i = 0; i < this.lasers.length; i++) {
      const l = this.lasers[i];
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(56, 189, 248, ${l.alpha})`;
      this.ctx.lineWidth = 5;
      this.ctx.shadowColor = '#38BDF8';
      this.ctx.shadowBlur = 15;
      this.ctx.beginPath();
      this.ctx.moveTo(l.x1, l.y1);
      this.ctx.lineTo(l.x2, l.y2);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Asteroids
    for (let i = 0; i < this.asteroids.length; i++) {
      const ast = this.asteroids[i];
      this.drawAsteroid(ast);
    }

    // Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Player Rocket
    this.drawRocket(this.rocketX, this.canvas.height - 45);
  }

  drawAsteroid(ast) {
    this.ctx.save();
    this.ctx.translate(ast.x, ast.y);

    // Glow effect
    this.ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
    this.ctx.shadowBlur = 8;

    // Outer rock body
    this.ctx.fillStyle = '#1E293B';
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // Inner glowing number
    this.ctx.fillStyle = '#F8FAFC';
    this.ctx.font = 'bold 22px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(ast.value, 0, 0);

    this.ctx.restore();
  }

  drawRocket(x, y) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.font = '44px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🚀', 0, 0);
    this.ctx.restore();
  }

  updateStatsUI() {
    const scoreEl = document.getElementById('rocket-score');
    const livesEl = document.getElementById('rocket-lives');
    const comboEl = document.getElementById('rocket-combo');

    if (scoreEl) scoreEl.textContent = this.score;
    if (livesEl) livesEl.innerHTML = '❤️'.repeat(Math.max(0, this.lives));
    if (comboEl) comboEl.textContent = `x${this.combo}`;
  }

  handleGameOver() {
    this.stop();
    window.mathAudio.playFanfare();

    const isRu = this.getLang() === 'ru';
    const title = isRu ? 'Игра окончена!' : 'O‘yin Yakunlandi!';
    const scoreText = isRu ? `Набранные очки: <strong>${this.score} / ${this.targetScore}</strong>` : `To‘plangan ball: <strong>${this.score} / ${this.targetScore}</strong>`;
    const btnText = isRu ? '🔄 Сыграть снова' : '🔄 Qaytadan Parvoz';

    const banner = document.getElementById('rocket-game-over-banner');
    if (banner) {
      banner.innerHTML = `
        <div class="game-over-box bounce-in" style="background: rgba(15, 23, 42, 0.95); border: 3px solid #EF4444; border-radius: 24px; padding: 25px; color: #FFF; text-align: center; max-width: 480px; margin: 0 auto;">
          <div class="trophy-icon" style="font-size: 2.4rem; margin-bottom: 8px;">💥</div>
          <h3 style="font-size: 1.4rem; color: #EF4444; margin-bottom: 10px;">${title}</h3>
          <p style="font-size: 1rem; color: #CBD5E1; margin-bottom: 18px;">${scoreText}</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="window.mathRocketGame.start(${this.currentLevel})">
              ${btnText}
            </button>
            <button class="game-level-map-btn" onclick="window.mathRocketGame.openWorldMap()">
              🗺️ 50+ Bosqichlar
            </button>
          </div>
        </div>
      `;
      banner.style.display = 'block';
    }
  }
}

window.mathRocketGame = new MathRocketGame();
