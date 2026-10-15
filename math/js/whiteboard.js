/**
 * MathKids - Interactive Visual Whiteboard / Scratchpad (Qoralama Doska)
 * Allows children to calculate, draw numbers, count dots, and scribble math notes!
 * Supports mouse & touch (tablets/smartphones).
 */

class Whiteboard {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = '#FFD166'; // Default sunshine yellow chalk
    this.brushSize = 5;
    this.isEraser = false;
    this.gridType = 'grid'; // 'grid', 'dots', 'plain'
    this.isOpen = false;
  }

  init() {
    this.canvas = document.getElementById('whiteboard-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.bindEvents();
    this.bindUIControls();
    this.drawBackgroundPattern();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Save current drawing if any
    let tempImage = null;
    if (this.canvas.width > 0 && this.canvas.height > 0) {
      tempImage = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    this.canvas.width = rect.width * dpr;
    this.canvas.height = (rect.height || 360) * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height || 360}px`;

    this.ctx.scale(dpr, dpr);
    this.drawBackgroundPattern();

    if (tempImage) {
      // Draw previous contents
    }
  }

  drawBackgroundPattern() {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dark chalkboard theme background
    this.ctx.fillStyle = '#1A2238';
    this.ctx.fillRect(0, 0, w, h);

    if (this.gridType === 'grid') {
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = 1;
      const step = 28;

      for (let x = 0; x < w; x += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, h);
        this.ctx.stroke();
      }

      for (let y = 0; y < h; y += step) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(w, y);
        this.ctx.stroke();
      }
    } else if (this.gridType === 'dots') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const step = 24;
      for (let x = step; x < w; x += step) {
        for (let y = step; y < h; y += step) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  bindEvents() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDraw = (e) => {
      this.isDrawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      this.setupBrush();
    };

    const draw = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);

      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
    };

    const stopDraw = () => {
      this.isDrawing = false;
      this.ctx.beginPath();
    };

    // Mouse Events
    this.canvas.addEventListener('mousedown', startDraw);
    this.canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    // Touch Events for Tablets & Phones
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDraw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      draw(e);
    }, { passive: false });

    this.canvas.addEventListener('touchend', stopDraw);
  }

  setupBrush() {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (this.isEraser) {
      this.ctx.strokeStyle = '#1A2238'; // Erase with chalkboard color
      this.ctx.lineWidth = this.brushSize * 3;
    } else {
      this.ctx.strokeStyle = this.currentColor;
      this.ctx.lineWidth = this.brushSize;
    }
  }

  bindUIControls() {
    // Color Swatches
    const swatches = document.querySelectorAll('.chalk-color-btn');
    swatches.forEach(btn => {
      btn.addEventListener('click', () => {
        window.mathAudio.playPop();
        swatches.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        this.currentColor = btn.dataset.color;
        this.isEraser = false;
        const eraserBtn = document.getElementById('whiteboard-eraser-btn');
        if (eraserBtn) eraserBtn.classList.remove('active');
      });
    });

    // Eraser
    const eraserBtn = document.getElementById('whiteboard-eraser-btn');
    if (eraserBtn) {
      eraserBtn.addEventListener('click', () => {
        window.mathAudio.playPop();
        this.isEraser = !this.isEraser;
        eraserBtn.classList.toggle('active', this.isEraser);
      });
    }

    // Brush Size
    const sizeSelect = document.getElementById('whiteboard-size');
    if (sizeSelect) {
      sizeSelect.addEventListener('input', (e) => {
        this.brushSize = parseInt(e.target.value, 10);
      });
    }

    // Clear Button
    const clearBtn = document.getElementById('whiteboard-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        window.mathAudio.playPop();
        this.clear();
      });
    }

    // Grid toggle
    const gridBtn = document.getElementById('whiteboard-grid-btn');
    if (gridBtn) {
      gridBtn.addEventListener('click', () => {
        window.mathAudio.playPop();
        const types = ['grid', 'dots', 'plain'];
        const currentIdx = types.indexOf(this.gridType);
        this.gridType = types[(currentIdx + 1) % types.length];
        gridBtn.textContent = this.gridType === 'grid' ? '📐 Katak' : (this.gridType === 'dots' ? ':: Nuqta' : '◻️ Oq');
        this.drawBackgroundPattern();
      });
    }

    // Toggle Drawer / Modal
    const toggleBtn = document.getElementById('toggle-scratchpad-btn');
    const container = document.getElementById('scratchpad-drawer');
    const closeBtn = document.getElementById('close-scratchpad-btn');

    if (toggleBtn && container) {
      toggleBtn.addEventListener('click', () => {
        window.mathAudio.playPop();
        this.toggle(container);
      });
    }

    if (closeBtn && container) {
      closeBtn.addEventListener('click', () => {
        window.mathAudio.playPop();
        this.close(container);
      });
    }
  }

  toggle(container) {
    this.isOpen = !this.isOpen;
    container.classList.toggle('open', this.isOpen);
    if (this.isOpen) {
      setTimeout(() => this.resizeCanvas(), 100);
    }
  }

  close(container) {
    this.isOpen = false;
    container.classList.remove('open');
  }

  clear() {
    this.drawBackgroundPattern();
  }
}

window.whiteboard = new Whiteboard();
