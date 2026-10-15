/**
 * MathKids - Math Rocket Blaster & Space Defender Mini-Game
 * Action-oriented math game: Solve the equations, blast the right asteroids with rocket lasers!
 */

class MathRocketGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.active = false;
    this.animFrame = null;

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
    this.spawnTimer = null;
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

  start() {
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
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, ans;

    if (op === '+') {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      ans = a + b;
    } else if (op === '-') {
      b = Math.floor(Math.random() * 10) + 2;
      a = b + Math.floor(Math.random() * 10) + 1;
      ans = a - b;
    } else {
      a = Math.floor(Math.random() * 6) + 2;
      b = Math.floor(Math.random() * 6) + 2;
      ans = a * b;
    }

    this.targetProblem = { a, b, op, ans };
    const hud = document.getElementById('rocket-target-display');
    if (hud) {
      hud.innerHTML = `Nishon: <strong>${a} ${op} ${b} = ?</strong>`;
    }
  }

  spawnAsteroidsForTarget() {
    this.asteroids = [];
    const ans = this.targetProblem.ans;
    const values = [ans];

    while (values.length < 4) {
      const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      const fake = Math.max(1, ans + offset);
      if (!values.includes(fake)) values.push(fake);
    }

    values.sort(() => Math.random() - 0.5);

    const w = this.canvas.width;
    const colWidth = w / 4;

    values.forEach((val, idx) => {
      this.asteroids.push({
        x: colWidth * idx + colWidth / 2,
        y: Math.random() * -120 - 40,
        radius: 34,
        value: val,
        isCorrect: val === ans,
        speed: Math.random() * 0.8 + 0.9,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        color: val === ans ? '#FF5E13' : '#3A86FF'
      });
    });
  }

  handleCanvasClick(e) {
    if (!this.active) return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const ast = this.asteroids[i];
      const dist = Math.hypot(clickX - ast.x, clickY - ast.y);

      if (dist <= ast.radius + 15) {
        this.fireLaserAt(ast);
        break;
      }
    }
  }

  fireLaserAt(ast) {
    window.mathAudio.playLaser();
    this.rocketX = ast.x;

    // Laser beam animation
    this.lasers.push({
      x1: this.canvas.width / 2,
      y1: this.canvas.height - 40,
      x2: ast.x,
      y2: ast.y,
      alpha: 1
    });

    if (ast.isCorrect) {
      // Correct target blasted!
      setTimeout(() => {
        window.mathAudio.playExplosion();
        this.createExplosionParticles(ast.x, ast.y, '#FF5E13');
        this.score += 20 * this.combo;
        this.combo++;
        window.mathApp.addStars(1);

        if (this.score >= 100) {
          window.mathApp.unlockBadge('rocket-master');
          if (!this.level1Reached) {
            this.level1Reached = true;
            if (window.subscriptionManager && !window.subscriptionManager.canPlayGameLevel('rocket', 2)) {
              this.stop();
              return;
            }
          }
        }

        this.updateStatsUI();
        this.generateNewTarget();
        this.spawnAsteroidsForTarget();
      }, 80);
    } else {
      // Wrong asteroid hit!
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

  createExplosionParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color: Math.random() > 0.4 ? color : '#FFD166',
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
    // Starfield scroll
    this.stars.forEach(s => {
      s.y += s.speed;
      if (s.y > this.canvas.height) {
        s.y = 0;
        s.x = Math.random() * this.canvas.width;
      }
    });

    // Asteroids movement
    let allFell = true;
    this.asteroids.forEach(ast => {
      ast.y += ast.speed;
      ast.rot += ast.rotSpeed;
      if (ast.y < this.canvas.height + 50) {
        allFell = false;
      }
    });

    if (allFell && this.asteroids.length > 0) {
      // Respawn if all passed
      this.spawnAsteroidsForTarget();
    }

    // Lasers fade
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].alpha -= 0.15;
      if (this.lasers[i].alpha <= 0) this.lasers.splice(i, 1);
    }

    // Particles fade
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.035;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }

  draw() {
    this.ctx.fillStyle = '#0B0F19';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Stars
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.stars.forEach(s => {
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Lasers
    this.lasers.forEach(l => {
      this.ctx.save();
      this.ctx.strokeStyle = `rgba(0, 230, 118, ${l.alpha})`;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(l.x1, l.y1);
      this.ctx.lineTo(l.x2, l.y2);
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Asteroids
    this.asteroids.forEach(ast => {
      this.ctx.save();
      this.ctx.translate(ast.x, ast.y);
      this.ctx.rotate(ast.rot);

      // Asteroid rock circle
      this.ctx.fillStyle = '#1E293B';
      this.ctx.strokeStyle = ast.color;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, ast.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      // Number text inside asteroid
      this.ctx.rotate(-ast.rot); // unrotate text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 22px Fredoka, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(ast.value, 0, 0);

      this.ctx.restore();
    });

    // Particles
    this.particles.forEach(p => {
      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    // Rocket Hero at bottom center
    this.drawRocket(this.canvas.width / 2, this.canvas.height - 45);
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
    if (window.mathConfetti) window.mathConfetti.launch(80, 0.5, 0.5);

    const isRu = this.getLang() === 'ru';
    const title = isRu ? 'Миссия Завершена! / Mission Complete!' : 'Missiya Yakunlandi! / Mission Complete!';
    const scoreText = isRu ? `Набранные очки: <strong>${this.score}</strong>` : `Siz to‘plagan umumiy ball: <strong>${this.score}</strong>`;
    const btnText = isRu ? '🚀 Полететь снова / Launch Again' : '🚀 Qaytadan Parvoz / Launch Again';

    const banner = document.getElementById('rocket-game-over-banner');
    if (banner) {
      banner.innerHTML = `
        <div class="game-over-box bounce-in">
          <div class="trophy-icon">🏆</div>
          <h3>${title}</h3>
          <p>${scoreText}</p>
          <button class="btn btn-primary" onclick="window.mathRocketGame.start()">
            ${btnText}
          </button>
        </div>
      `;
      banner.style.display = 'block';
    }
  }
}

window.mathRocketGame = new MathRocketGame();
