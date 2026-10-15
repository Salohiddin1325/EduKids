/**
 * PhysicsKids - Celebration Confetti & Quantum Sparkles
 */

class PhysicsConfetti {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animFrame = null;
    this.colors = ['#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#3B82F6'];
    this.symbols = ['⚛️', '⚡', '💡', '🧲', '🌟', '●', '▲'];
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'physics-confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    if (this.ctx) {
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  }

  launch(count = 70, ox = 0.5, oy = 0.5) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const sx = ox * w;
    const sy = oy * h;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 5;
      this.particles.push({
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: Math.random() * 14 + 10,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        drag: 0.94,
        life: 1
      });
    }

    if (!this.animFrame) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life -= 0.015;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.font = `bold ${p.size}px Fredoka, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(p.symbol, 0, 0);
      this.ctx.restore();

      if (p.life <= 0 || p.y > window.innerHeight + 40) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.animFrame = null;
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }
}

window.physicsConfetti = null;
document.addEventListener('DOMContentLoaded', () => {
  window.physicsConfetti = new PhysicsConfetti();
});
