/**
 * PhysicsKids - Interactive Gravity & Physics Sandbox
 * 2D Canvas Physics Engine with Earth, Moon, Jupiter & Zero-G toggles,
 * interactive draggable objects, throw physics, air resistance, and audio feedback!
 * 100% Offline, Vanilla Canvas + Web Audio
 */

class PhysicsGravitySandbox {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.objects = [];
    this.environment = 'earth'; // 'earth', 'moon', 'jupiter', 'zerog'
    this.airResistance = true;
    this.slowMotion = false;
    
    // Physics constants
    this.gravityConfigs = {
      earth: { g: 9.8, labelUz: 'Yer (Earth, 9.8 m/s²)', labelRu: 'Земля (9.8 м/с²)', bgClass: 'env-earth' },
      moon: { g: 1.62, labelUz: 'Oy (Moon, 1.6 m/s²)', labelRu: 'Луна (1.6 м/с²)', bgClass: 'env-moon' },
      jupiter: { g: 24.8, labelUz: 'Yupiter (24.8 m/s²)', labelRu: 'Юпитер (24.8 м/с²)', bgClass: 'env-jupiter' },
      zerog: { g: 0.0, labelUz: 'Kosmos (Vaznsizlik, 0 m/s²)', labelRu: 'Космос (Невесомость, 0 м/с²)', bgClass: 'env-zerog' }
    };

    // Dragging state
    this.draggedObject = null;
    this.dragOffset = { x: 0, y: 0 };
    this.dragHistory = []; // {x, y, t} for fling velocity

    this.isRunning = false;
    this.isInitialized = false;
  }

  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    if (this.isInitialized) return;
    this.renderSandboxUI();
    this.initCanvas();
    this.spawnPresetObjects();
    this.isInitialized = true;

    // Only start simulation if sandbox tab is currently active
    const sec = document.getElementById('sec-physics-sandbox');
    if (sec && sec.classList.contains('active')) {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    const sec = document.getElementById('sec-physics-sandbox');
    if (!sec || !sec.classList.contains('active')) return;

    this.isRunning = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.resizeCanvas();
    this.startLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setEnvironment(envKey) {
    if (!this.gravityConfigs[envKey]) return;
    this.environment = envKey;
    if (window.kiddoAudio) window.kiddoAudio.playWhoosh();

    const isRu = this.getLang() === 'ru';
    if (window.astroCat) {
      if (envKey === 'moon') {
        window.astroCat.say(isRu ? 'Мы на Луне! Гравитация слабая, всё летает плавно!' : 'Biz Oydamiz! Gravitatsiya past, narsalar mayin suzmoqda!');
      } else if (envKey === 'zerog') {
        window.astroCat.say(isRu ? 'Невесомость! Полный полёт в открытом космосе!' : 'Vaznsizlik! Haqiqiy kosmik erkin parvoz!');
      } else if (envKey === 'jupiter') {
        window.astroCat.say(isRu ? 'Ого, Юпитер! Всё невероятно тяжёлое!' : 'Oho, Yupiter! Narsalar juda og‘ir va tez tushadi!');
      } else {
        window.astroCat.say(isRu ? 'Родная Земля! Привычная сила тяжести 9.8 м/с²' : 'Ona Yerimiz! Qulay 9.8 m/s² tortishish kuchi');
      }
    }

    if (window.gamificationHub) {
      window.gamificationHub.recordActivity('physics', true);
      window.gamificationHub.addXP(15, 'gravity-switch');
    }

    // Update active button state
    document.querySelectorAll('.gravity-toggle-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.env === envKey);
    });

    const gMeter = document.getElementById('sandbox-g-value');
    if (gMeter) gMeter.textContent = `${this.gravityConfigs[envKey].g} m/s²`;
  }

  toggleVacuum() {
    this.airResistance = !this.airResistance;
    if (window.kiddoAudio) window.kiddoAudio.playPop();
    const btn = document.getElementById('btn-toggle-vacuum');
    const isRu = this.getLang() === 'ru';
    if (btn) {
      btn.classList.toggle('active', !this.airResistance);
      btn.innerHTML = !this.airResistance
        ? `🌌 <span>${isRu ? 'Вакуум: ВКЛ (Без воздуха)' : 'Vakuum: YONIQ (Havosiz)'}</span>`
        : `💨 <span>${isRu ? 'Воздух: ВКЛ' : 'Havo bor'}</span>`;
    }
  }

  toggleSlowMo() {
    this.slowMotion = !this.slowMotion;
    if (window.kiddoAudio) window.kiddoAudio.playPop();
    const btn = document.getElementById('btn-toggle-slowmo');
    if (btn) {
      btn.classList.toggle('active', this.slowMotion);
    }
  }

  spawnObject(type) {
    if (!this.canvas) return;
    if (window.kiddoAudio) window.kiddoAudio.playPop();

    const w = this.canvas.width;
    const x = Math.random() * (w - 120) + 60;
    const y = 60;

    const templates = {
      apple: { emoji: '🍎', name: 'Olma', r: 24, mass: 1.0, restitution: 0.52, color: '#EF4444' },
      feather: { emoji: '🪶', name: 'Pat', r: 22, mass: 0.08, restitution: 0.15, isFeather: true, color: '#F8FAFC' },
      ball: { emoji: '⚽', name: 'Koptok', r: 26, mass: 0.7, restitution: 0.84, color: '#3B82F6' },
      anvil: { emoji: '⚓', name: 'Og‘ir Zangir', r: 28, mass: 9.0, restitution: 0.12, isHeavy: true, color: '#475569' },
      balloon: { emoji: '🎈', name: 'Pufak', r: 26, mass: -0.25, restitution: 0.65, isBalloon: true, color: '#EC4899' }
    };

    const t = templates[type] || templates.apple;
    this.objects.push({
      id: Date.now() + Math.random(),
      type: type,
      emoji: t.emoji,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 2,
      radius: t.r,
      mass: t.mass,
      restitution: t.restitution,
      isFeather: !!t.isFeather,
      isHeavy: !!t.isHeavy,
      isBalloon: !!t.isBalloon,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 0.1
    });

    this.updateObjectCount();
  }

  clearObjects() {
    if (window.kiddoAudio) window.kiddoAudio.playWhoosh();
    this.objects = [];
    this.updateObjectCount();
  }

  updateObjectCount() {
    const el = document.getElementById('sandbox-obj-count');
    if (el) el.textContent = this.objects.length;
  }

  spawnPresetObjects() {
    this.objects = [];
    this.spawnObject('apple');
    this.spawnObject('feather');
    this.spawnObject('ball');
    this.spawnObject('anvil');
  }

  initCanvas() {
    this.canvas = document.getElementById('physics-gravity-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Pointer events for smooth drag and throw
    this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }
  }

  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onPointerDown(e) {
    const pos = this.getPointerPos(e);

    // Hit test from top to bottom
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      const dist = Math.hypot(obj.x - pos.x, obj.y - pos.y);
      if (dist <= obj.radius * 1.3) {
        this.draggedObject = obj;
        this.dragOffset = { x: obj.x - pos.x, y: obj.y - pos.y };
        this.dragHistory = [{ x: pos.x, y: pos.y, t: performance.now() }];
        obj.vx = 0;
        obj.vy = 0;
        if (window.kiddoAudio) window.kiddoAudio.playPop();
        break;
      }
    }
  }

  onPointerMove(e) {
    if (!this.draggedObject) return;
    const pos = this.getPointerPos(e);
    this.draggedObject.x = pos.x + this.dragOffset.x;
    this.draggedObject.y = pos.y + this.dragOffset.y;

    const now = performance.now();
    this.dragHistory.push({ x: pos.x, y: pos.y, t: now });
    if (this.dragHistory.length > 5) {
      this.dragHistory.shift();
    }
  }

  onPointerUp(e) {
    if (!this.draggedObject) return;

    // Calculate throw velocity from drag history
    if (this.dragHistory.length >= 2) {
      const first = this.dragHistory[0];
      const last = this.dragHistory[this.dragHistory.length - 1];
      const dt = (last.t - first.t) / 1000;
      if (dt > 0.01) {
        const vx = (last.x - first.x) / dt * 0.05;
        const vy = (last.y - first.y) / dt * 0.05;
        this.draggedObject.vx = Math.max(-25, Math.min(25, vx));
        this.draggedObject.vy = Math.max(-25, Math.min(25, vy));
        if (Math.hypot(vx, vy) > 5 && window.kiddoAudio) {
          window.kiddoAudio.playWhoosh();
        }
      }
    }

    this.draggedObject = null;
    this.dragHistory = [];
  }

  startLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    const loop = () => {
      if (!this.isRunning) return;
      this.updatePhysics();
      this.render();
      if (this.isRunning) {
        this.animationId = requestAnimationFrame(loop);
      }
    };
    this.animationId = requestAnimationFrame(loop);
  }

  updatePhysics() {
    if (!this.isRunning || !this.canvas) return;

    // Safety guard: if section is no longer active, halt immediately
    const sec = document.getElementById('sec-physics-sandbox');
    if (!sec || !sec.classList.contains('active')) {
      this.stop();
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // If canvas has zero or negative dimensions (hidden), never process collisions!
    if (width < 60 || height < 60) return;

    const gConfig = this.gravityConfigs[this.environment] || this.gravityConfigs.earth;
    let dt = this.slowMotion ? 0.008 : 0.016;
    const gravityAccel = gConfig.g * 35; // Pixels / sec² scaling
    const now = performance.now();

    this.objects.forEach(obj => {
      if (obj === this.draggedObject) return;

      // Apply Gravity
      if (obj.isBalloon && this.airResistance) {
        // Buoyancy in atmosphere pulls balloon up
        obj.vy -= 180 * dt;
      } else {
        obj.vy += gravityAccel * dt;
      }

      // Air Resistance (Drift)
      if (this.airResistance) {
        if (obj.isFeather) {
          // Feather flutters side-to-side
          obj.vx += Math.sin(now * 0.008 + obj.id) * 12 * dt;
          obj.vy *= 0.94; // Float slowly
          obj.vx *= 0.92;
        } else {
          obj.vx *= 0.992;
          obj.vy *= 0.995;
        }
      }

      // Position step
      obj.x += obj.vx;
      obj.y += obj.vy;
      obj.rotation += obj.vRot;

      // Floor Collision
      const floorY = height - obj.radius - 8;
      if (obj.y >= floorY) {
        obj.y = floorY;
        if (Math.abs(obj.vy) > 1.2) {
          obj.vy = -obj.vy * obj.restitution;
          obj.vx *= 0.85; // Ground friction
          obj.vRot *= 0.8;
          // Play soft bounce only on hard impact with strict cooldown
          if (Math.abs(obj.vy) > 4.2 && window.kiddoAudio && (!obj.lastBounceSound || (now - obj.lastBounceSound > 220))) {
            obj.lastBounceSound = now;
            window.kiddoAudio.playPop();
          }
        } else {
          obj.vy = 0;
          obj.vx *= 0.8;
          obj.vRot = 0;
        }
      }

      // Ceiling Collision
      const ceilY = obj.radius + 6;
      if (obj.y <= ceilY) {
        obj.y = ceilY;
        obj.vy = -obj.vy * obj.restitution;
      }

      // Wall Collisions
      if (obj.x <= obj.radius + 6) {
        obj.x = obj.radius + 6;
        obj.vx = -obj.vx * obj.restitution;
      } else if (obj.x >= width - obj.radius - 6) {
        obj.x = width - obj.radius - 6;
        obj.vx = -obj.vx * obj.restitution;
      }
    });
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    this.ctx.clearRect(0, 0, w, h);

    // Draw Background Environment
    this.renderEnvironmentBackdrop(w, h);

    // Draw Objects
    this.objects.forEach(obj => {
      this.ctx.save();
      this.ctx.translate(obj.x, obj.y);
      this.ctx.rotate(obj.rotation);

      // Shadow on floor
      if (this.environment !== 'zerog') {
        const floorDist = (h - 8) - obj.y;
        if (floorDist > 0 && floorDist < 250) {
          const shadowAlpha = Math.max(0.05, 0.25 - floorDist / 350);
          const shadowWidth = obj.radius * (1 - floorDist / 400);
          this.ctx.save();
          this.ctx.resetTransform?.();
          this.ctx.beginPath();
          this.ctx.ellipse(obj.x, h - 6, Math.max(4, shadowWidth), 4, 0, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
          this.ctx.fill();
          this.ctx.restore();
        }
      }

      // Glowing aura if dragged
      if (obj === this.draggedObject) {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, obj.radius + 6, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
        this.ctx.fill();
      }

      // Emoji graphic
      this.ctx.font = `${obj.radius * 1.75}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(obj.emoji, 0, 2);

      this.ctx.restore();
    });
  }

  renderEnvironmentBackdrop(w, h) {
    if (this.environment === 'moon') {
      // Cosmic dark sky + moon surface
      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.7, '#1E293B');
      grad.addColorStop(1, '#334155');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // Little stars
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 73) % w;
        const sy = (i * 47) % (h * 0.6);
        this.ctx.fillRect(sx, sy, 2, 2);
      }

      // Lunar surface floor
      this.ctx.fillStyle = '#64748B';
      this.ctx.fillRect(0, h - 14, w, 14);
      this.ctx.fillStyle = '#475569';
      this.ctx.fillRect(0, h - 6, w, 6);
    } else if (this.environment === 'jupiter') {
      // Jupiter orange/copper banded atmosphere
      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#7C2D12');
      grad.addColorStop(0.5, '#C2410C');
      grad.addColorStop(1, '#EA580C');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // Floor
      this.ctx.fillStyle = '#9A3412';
      this.ctx.fillRect(0, h - 14, w, 14);
    } else if (this.environment === 'zerog') {
      // Space Nebula
      const grad = this.ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#1E1B4B');
      grad.addColorStop(0.5, '#312E81');
      grad.addColorStop(1, '#0F172A');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // Distant stars
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 30; i++) {
        const sx = (i * 41) % w;
        const sy = (i * 83) % h;
        this.ctx.fillRect(sx, sy, 2, 2);
      }
    } else {
      // Earth Sky & Grass
      const grad = this.ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#BAE6FD');
      grad.addColorStop(0.85, '#E0F2FE');
      grad.addColorStop(1, '#F0F9FF');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // Green grass floor
      this.ctx.fillStyle = '#10B981';
      this.ctx.fillRect(0, h - 14, w, 14);
      this.ctx.fillStyle = '#059669';
      this.ctx.fillRect(0, h - 6, w, 6);
    }
  }

  renderSandboxUI() {
    const container = document.getElementById('sec-physics-sandbox');
    if (!container) return;

    const isRu = this.getLang() === 'ru';

    container.innerHTML = `
      <div class="section-hero-title">
        <h2 id="sec-sandbox-title">${isRu ? 'Песочница Гравитации: Земля, Луна и Космос 🌍🌕' : 'Gravitatsiya Sandbo‘ksi: Yer, Oy va Kosmos 🌍🌕'}</h2>
        <p id="sec-sandbox-desc">${isRu ? 'Переключайте силу тяжести, бросайте предметы, перетаскивайте их пальцем и изучайте закон всемирного тяготения!' : 'Gravitatsiyani o‘zgartiring, narsalarni tepadan tashlang, sichqoncha bilan irg‘iting va Nyuton qonunini jonli ko‘ring!'}</p>
      </div>

      <!-- Controls & Environment Presets -->
      <div class="sandbox-toolbar">
        <div class="sandbox-env-strip">
          <span class="toolbar-label">${isRu ? 'Гравитация:' : 'Gravitatsiya:'}</span>
          <button class="btn btn-ctrl gravity-toggle-btn ${this.environment === 'earth' ? 'active' : ''}" data-env="earth" onclick="window.physicsSandbox.setEnvironment('earth')">
            🌍 ${isRu ? 'Земля (9.8)' : 'Yer (9.8)'}
          </button>
          <button class="btn btn-ctrl gravity-toggle-btn ${this.environment === 'moon' ? 'active' : ''}" data-env="moon" onclick="window.physicsSandbox.setEnvironment('moon')">
            🌕 ${isRu ? 'Луна (1.6)' : 'Oy (1.6)'}
          </button>
          <button class="btn btn-ctrl gravity-toggle-btn ${this.environment === 'jupiter' ? 'active' : ''}" data-env="jupiter" onclick="window.physicsSandbox.setEnvironment('jupiter')">
            🪐 ${isRu ? 'Юпитер (24.8)' : 'Yupiter (24.8)'}
          </button>
          <button class="btn btn-ctrl gravity-toggle-btn ${this.environment === 'zerog' ? 'active' : ''}" data-env="zerog" onclick="window.physicsSandbox.setEnvironment('zerog')">
            🛸 ${isRu ? 'Космос (0-G)' : 'Vaznsizlik (0-G)'}
          </button>
        </div>

        <div class="sandbox-actions-strip">
          <button class="btn btn-ctrl" id="btn-toggle-vacuum" onclick="window.physicsSandbox.toggleVacuum()">
            💨 <span>${isRu ? 'Воздух: ВКЛ' : 'Havo bor'}</span>
          </button>
          <button class="btn btn-ctrl" id="btn-toggle-slowmo" onclick="window.physicsSandbox.toggleSlowMo()">
            ⏱️ <span>Slow-Mo</span>
          </button>
          <button class="btn btn-ctrl" onclick="window.physicsSandbox.clearObjects()">
            🗑️ <span>${isRu ? 'Очистить' : 'Tozalash'}</span>
          </button>
        </div>
      </div>

      <!-- Live Physics Canvas Arena -->
      <div class="sandbox-canvas-card">
        <div class="sandbox-hud-bar">
          <div class="hud-item">
            <span class="hud-item-lbl">${isRu ? 'Ускорение g:' : 'Tezlanish g:'}</span>
            <strong class="hud-item-val" id="sandbox-g-value">${this.gravityConfigs[this.environment].g} m/s²</strong>
          </div>
          <div class="hud-item">
            <span class="hud-item-lbl">${isRu ? 'Предметов:' : 'Narsalar soni:'}</span>
            <strong class="hud-item-val" id="sandbox-obj-count">${this.objects.length}</strong>
          </div>
          <div class="hud-item">
            <span class="hud-item-lbl">${isRu ? 'Управление:' : 'Boshqaruv:'}</span>
            <span class="hud-item-val">${isRu ? 'Хватай и бросай! 👆' : 'Ushlang va irg‘iting! 👆'}</span>
          </div>
        </div>

        <div class="sandbox-canvas-wrapper">
          <canvas id="physics-gravity-canvas"></canvas>
        </div>

        <!-- Spawn Palette -->
        <div class="sandbox-spawn-palette">
          <span class="palette-lbl">${isRu ? 'Добавить предмет:' : 'Narsa qo‘shish:'}</span>
          <div class="spawn-buttons-row">
            <button class="spawn-chip" onclick="window.physicsSandbox.spawnObject('apple')">🍎 ${isRu ? 'Яблоко' : 'Olma'}</button>
            <button class="spawn-chip" onclick="window.physicsSandbox.spawnObject('feather')">🪶 ${isRu ? 'Перо' : 'Pat'}</button>
            <button class="spawn-chip" onclick="window.physicsSandbox.spawnObject('ball')">⚽ ${isRu ? 'Мяч' : 'Koptok'}</button>
            <button class="spawn-chip" onclick="window.physicsSandbox.spawnObject('anvil')">⚓ ${isRu ? 'Наковальня' : 'Og‘ir Zangir'}</button>
            <button class="spawn-chip" onclick="window.physicsSandbox.spawnObject('balloon')">🎈 ${isRu ? 'Шарик' : 'Pufak'}</button>
          </div>
        </div>
      </div>

      <!-- Educational Physics Fact Cards -->
      <div class="sandbox-facts-row">
        <div class="fact-card">
          <h4>🍏 ${isRu ? 'Опыт Галилея и Ньютона' : 'Nyuton va Galiley Tajribasi'}</h4>
          <p>${isRu ? 'Если выключить сопротивление воздуха (Вакуум), и перо, и тяжелая наковальня падают с абсолютно одинаковой скоростью!' : 'Agar havo qarshiligini o‘chirsangiz (Vakuum), hatto yengil pat va og‘ir temir zangir ham bir xil tezlikda tushadi!'}</p>
        </div>
        <div class="fact-card">
          <h4>🌕 ${isRu ? 'Почему на Луне легко прыгать?' : 'Nega Oyda sakrash oson?'}</h4>
          <p>${isRu ? 'Масса Луны меньше массы Земли, поэтому её притяжение в 6 раз слабее! Астронавты на Луне парили, как пушинки.' : 'Oyning massasi Yernikidan ancha kichik, shuning uchun uning tortishish kuchi 6 barobar kuchsizroq! Astronavtlar Oyda xuddi par kabi uchganlar.'}</p>
        </div>
      </div>
    `;
  }

  updateLanguage() {
    if (!this.isInitialized) {
      this.init();
      return;
    }
    const isRu = this.getLang() === 'ru';
    const title = document.getElementById('sec-sandbox-title');
    if (title) title.textContent = isRu ? 'Песочница Гравитации: Земля, Луна и Космос 🌍🌕' : 'Gravitatsiya Sandbo‘ksi: Yer, Oy va Kosmos 🌍🌕';
    
    const desc = document.getElementById('sec-sandbox-desc');
    if (desc) desc.textContent = isRu ? 'Переключайте силу тяжести, бросайте предметы, перетаскивайте их пальцем и изучайте закон всемирного тяготения!' : 'Gravitatsiyani o‘zgartiring, narsalarni tepadan tashlang, sichqoncha bilan irg‘iting va Nyuton qonunini jonli ko‘ring!';

    const vacBtn = document.getElementById('btn-toggle-vacuum');
    if (vacBtn) {
      vacBtn.innerHTML = !this.airResistance
        ? `🌌 <span>${isRu ? 'Вакуум: ВКЛ (Без воздуха)' : 'Vakuum: YONIQ (Havosiz)'}</span>`
        : `💨 <span>${isRu ? 'Воздух: ВКЛ' : 'Havo bor'}</span>`;
    }

    const gMeter = document.getElementById('sandbox-g-value');
    if (gMeter) gMeter.textContent = `${this.gravityConfigs[this.environment].g} m/s²`;
  }
}

window.physicsSandbox = new PhysicsGravitySandbox();
