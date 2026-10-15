/**
 * PhysicsKids - Interactive Physics Experiments & Simulations (Laboratoriya)
 * 1. Gravity Drop Tower (Earth vs Moon, Feather vs Apple vs Rock)
 * 2. Magnet Attraction & Repulsion Playground
 * 3. Temperature State Changer (Ice -> Water -> Steam)
 * Fully bilingual: Uzbek & Russian.
 */

class PhysicsLabManager {
  constructor() {
    // Gravity Lab State
    this.gravityObject = 'apple';
    this.gravityEnvironment = 'earth'; // 'earth', 'moon'
    this.isDropping = false;
    this.dropStartTime = 0;
    this.dropTimerInterval = null;

    // Magnet Lab State
    this.activeMagnetItem = 'paperclip';
    this.magnetPole = 'N'; // N or S

    // State Changer Lab State
    this.temperature = 20; // 20 C
  }

  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.bindGravityLab();
    this.bindMagnetLab();
    this.bindStateChangerLab();
  }

  // ==========================================
  // 1. GRAVITY DROP TOWER
  // ==========================================
  bindGravityLab() {
    const objBtns = document.querySelectorAll('.gravity-obj-btn');
    objBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isDropping) return;
        window.physicsAudio.playPop();
        objBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.gravityObject = btn.dataset.object;
        this.resetGravityDrop();
      });
    });

    const envBtns = document.querySelectorAll('.gravity-env-btn');
    envBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isDropping) return;
        window.physicsAudio.playPop();
        envBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.gravityEnvironment = btn.dataset.env;
        this.resetGravityDrop();
      });
    });

    const dropBtn = document.getElementById('gravity-drop-btn');
    if (dropBtn) {
      dropBtn.addEventListener('click', () => this.startGravityDrop());
    }

    const resetBtn = document.getElementById('gravity-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetGravityDrop());
    }

    this.resetGravityDrop();
  }

  resetGravityDrop() {
    this.isDropping = false;
    clearInterval(this.dropTimerInterval);

    const objectEl = document.getElementById('gravity-falling-item');
    const timerDisplay = document.getElementById('gravity-timer-display');
    const noteDisplay = document.getElementById('gravity-result-note');
    const isRu = this.getLang() === 'ru';

    if (objectEl) {
      objectEl.style.transition = 'none';
      objectEl.style.top = '20px';
      objectEl.className = 'gravity-item';

      const icons = {
        feather: '🪶',
        apple: '🍎',
        basketball: '🏀',
        rock: '🪨'
      };
      objectEl.innerHTML = `<span>${icons[this.gravityObject] || '🍎'}</span>`;
    }

    if (timerDisplay) timerDisplay.textContent = '0.00s';
    if (noteDisplay) {
      noteDisplay.textContent = isRu 
        ? 'Выберите предмет и нажмите «Сбросить (Drop)»!' 
        : 'Obyektni tanlang va "Tashlash" tugmasini bosing!';
    }
  }

  startGravityDrop() {
    if (this.isDropping) return;
    this.isDropping = true;

    const objectEl = document.getElementById('gravity-falling-item');
    const timerDisplay = document.getElementById('gravity-timer-display');
    const noteDisplay = document.getElementById('gravity-result-note');
    const tower = document.getElementById('gravity-tower-arena');
    if (!objectEl || !tower) return;

    let baseTime = this.gravityEnvironment === 'earth' ? 0.75 : 1.85;

    // Air resistance on feather on Earth
    if (this.gravityObject === 'feather' && this.gravityEnvironment === 'earth') {
      baseTime = 1.9;
    }

    const dropDistance = tower.clientHeight - 85;

    objectEl.style.transition = `top ${baseTime}s ${this.gravityObject === 'feather' && this.gravityEnvironment === 'earth' ? 'ease-in-out' : 'cubic-bezier(0.5, 0, 1, 1)'}`;
    objectEl.style.top = `${dropDistance}px`;

    let start = performance.now();
    this.dropTimerInterval = setInterval(() => {
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      if (timerDisplay) timerDisplay.textContent = `${elapsed}s`;
    }, 40);

    setTimeout(() => {
      clearInterval(this.dropTimerInterval);
      if (timerDisplay) timerDisplay.textContent = `${baseTime.toFixed(2)}s`;
      this.isDropping = false;

      if (this.gravityObject === 'rock' || this.gravityObject === 'apple' || this.gravityObject === 'basketball') {
        window.physicsAudio.playBounce();
      }

      const isRu = this.getLang() === 'ru';
      if (noteDisplay) {
        if (this.gravityEnvironment === 'moon') {
          noteDisplay.innerHTML = isRu
            ? `🌕 <strong>Полет на Луне:</strong> Из-за низкой лунной гравитации предмет падает очень медленно, словно во сне!`
            : `🌕 <strong>Oydagi parvoz:</strong> Oydagi past gravitatsiya tufayli narsa juda sekin, xuddi tushdagidek mayin tushdi!`;
        } else if (this.gravityObject === 'feather') {
          noteDisplay.innerHTML = isRu
            ? `🪶 <strong>Сопротивление воздуха:</strong> Перо легкое, воздух его придерживает, поэтому оно плавно покачивается!`
            : `🪶 <strong>Havo qarshiligi:</strong> Pat yengil va unga havo qarshilik ko‘rsatgani uchun u tebranib tushdi!`;
        } else {
          noteDisplay.innerHTML = isRu
            ? `🌍 <strong>Земная гравитация:</strong> Сила притяжения быстро устремила предмет прямо к поверхности Земли!`
            : `🌍 <strong>Yer gravitatsiyasi:</strong> Obyekt katta tezlanish bilan to‘g‘ridan-to‘g‘ri yerga yetib keldi!`;
        }
      }

      window.physicsApp.unlockBadge('gravity-drop');
    }, baseTime * 1000);
  }

  // ==========================================
  // 2. MAGNET ATTRACTION & REPULSION
  // ==========================================
  bindMagnetLab() {
    const itemBtns = document.querySelectorAll('.magnet-test-btn');
    itemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        itemBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeMagnetItem = btn.dataset.item;
        this.testMagnetInteraction();
      });
    });

    const flipPoleBtn = document.getElementById('flip-magnet-pole-btn');
    if (flipPoleBtn) {
      flipPoleBtn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        this.magnetPole = this.magnetPole === 'N' ? 'S' : 'N';
        this.updateMagnetPoleUI();
        this.testMagnetInteraction();
      });
    }

    this.testMagnetInteraction();
  }

  updateMagnetPoleUI() {
    const poleN = document.getElementById('lab-magnet-n');
    const poleS = document.getElementById('lab-magnet-s');
    if (!poleN || !poleS) return;

    if (this.magnetPole === 'N') {
      poleN.style.order = '1';
      poleS.style.order = '2';
    } else {
      poleN.style.order = '2';
      poleS.style.order = '1';
    }
  }

  testMagnetInteraction() {
    const targetEl = document.getElementById('magnet-target-object');
    const statusMsg = document.getElementById('magnet-status-msg');
    if (!targetEl || !statusMsg) return;

    const isRu = this.getLang() === 'ru';
    targetEl.className = 'magnet-target-box';

    const items = {
      paperclip: { 
        name: isRu ? 'Железная Скрепка (Paperclip)' : 'Temir Qisqich (Paperclip)', 
        emoji: '📎', 
        magnetic: true 
      },
      nail: { 
        name: isRu ? 'Железный Гвоздь (Iron Nail)' : 'Temir Mix (Iron Nail)', 
        emoji: '🔩', 
        magnetic: true 
      },
      duck: { 
        name: isRu ? 'Резиновая Уточка (Rubber Duck)' : 'Rezina O‘rdakcha (Rubber Duck)', 
        emoji: '🦆', 
        magnetic: false 
      },
      wood: { 
        name: isRu ? 'Кусочек Дерева (Wood)' : 'Yog‘och Bo‘lak (Wood)', 
        emoji: '🪵', 
        magnetic: false 
      },
      magnet: { 
        name: isRu ? 'Второй Магнит (полюс N)' : 'Ikkinchi Magnit (N qutbli)', 
        emoji: '🧲', 
        magnetic: 'repel_or_attract' 
      }
    };

    const cur = items[this.activeMagnetItem];
    targetEl.innerHTML = `<span class="target-emoji">${cur.emoji}</span><span class="target-name">${cur.name}</span>`;

    if (cur.magnetic === true) {
      setTimeout(() => {
        targetEl.classList.add('snapped-to-magnet');
        window.physicsAudio.playMagnetSnap();
        const msg = isRu
          ? `🧲 <strong>Притянулось! (Attract):</strong> ${cur.name} сделан из железа, поэтому магнит моментально притянул его!`
          : `🧲 <strong>Yopishdi! (Attract):</strong> ${cur.name} temirdan qilingan, shuning uchun magnit uni o‘ziga bir zumda tortib oldi!`;
        statusMsg.innerHTML = msg;
        statusMsg.className = 'magnet-status-box status-success bounce-in';
        window.physicsApp.unlockBadge('magnet-master');
      }, 150);
    } else if (cur.magnetic === 'repel_or_attract') {
      if (this.magnetPole === 'N') {
        setTimeout(() => {
          targetEl.classList.add('repelled-from-magnet');
          window.physicsAudio.playRepel();
          const msg = isRu
            ? `🚫 <strong>Оттолкнулись! (Repel):</strong> Одинаковые полюса (N и N)! Они с силой отталкиваются!`
            : `🚫 <strong>Itarishdi! (Repel):</strong> Ikkala qutb ham bir xil (N va N)! Ular bir-birini qattiq itarib yubormoqda!`;
          statusMsg.innerHTML = msg;
          statusMsg.className = 'magnet-status-box status-warning bounce-in';
        }, 150);
      } else {
        setTimeout(() => {
          targetEl.classList.add('snapped-to-magnet');
          window.physicsAudio.playMagnetSnap();
          const msg = isRu
            ? `💕 <strong>Притянулись! (Attract):</strong> Противоположные полюса (S и N) крепко соединились!`
            : `💕 <strong>Tortishdi! (Attract):</strong> Qarama-qarshi qutblar (S va N) bir-birini mahkam quchoqlab oldi!`;
          statusMsg.innerHTML = msg;
          statusMsg.className = 'magnet-status-box status-success bounce-in';
        }, 150);
      }
    } else {
      setTimeout(() => {
        const msg = isRu
          ? `❌ <strong>Не притягивает:</strong> ${cur.name} не из железа (резина или дерево). Магнит притягивает только металлические предметы!`
          : `❌ <strong>Tortmadi:</strong> ${cur.name} temir emas (rezina yoki yog‘och), magnit faqat metall/temir buyumlarni tortadi!`;
        statusMsg.innerHTML = msg;
        statusMsg.className = 'magnet-status-box status-neutral';
      }, 150);
    }
  }

  // ==========================================
  // 3. TEMPERATURE STATE CHANGER
  // ==========================================
  bindStateChangerLab() {
    const slider = document.getElementById('temp-slider');
    const tempVal = document.getElementById('temp-value-display');
    const stateVisual = document.getElementById('state-visual-container');
    const stateDesc = document.getElementById('state-desc-box');

    this.updateState = (temp) => {
      this.temperature = parseInt(temp, 10);
      if (tempVal) tempVal.textContent = `${this.temperature}°C`;

      const isRu = this.getLang() === 'ru';
      let stateName = '';
      let stateTag = '';
      let visualContent = '';

      if (this.temperature <= 0) {
        stateName = isRu ? 'Твердое Состояние (Лед 🧊 / Solid)' : 'Qattiq Holat (Muz 🧊 / Solid)';
        stateTag = 'state-ice';
        const sub = isRu 
          ? 'Молекулы крепко сцеплены и сохраняют свою твердую форму!' 
          : 'Molekulalar qattiq birlashgan va o‘z shaklini saqlaydi!';
        visualContent = `
          <div class="ice-cubes-display bounce-in">
            <span class="ice-icon">🧊</span>
            <span class="ice-icon">🧊</span>
            <span class="ice-icon">🧊</span>
            <p class="state-sub">${sub}</p>
          </div>
        `;
      } else if (this.temperature < 100) {
        stateName = isRu ? 'Жидкое Состояние (Вода 💧 / Liquid)' : 'Suyuq Holat (Suv 💧 / Liquid)';
        stateTag = 'state-water';
        const sub = isRu 
          ? 'Лед растаял! Вода легко принимает форму любого стакана или чашки.' 
          : 'Muz eridi! Suv har qanday stakan yoki idish shakliga kiradi.';
        visualContent = `
          <div class="water-liquid-display bounce-in">
            <div class="water-waves">
              <span class="drop-icon">💧</span>
              <span class="drop-icon">🌊</span>
              <span class="drop-icon">💧</span>
            </div>
            <p class="state-sub">${sub}</p>
          </div>
        `;
      } else {
        stateName = isRu ? 'Газообразное Состояние (Пар 💨 / Gas)' : 'Gaz Holati (Bug‘ 💨 / Gas)';
        stateTag = 'state-steam';
        const sub = isRu 
          ? 'Точка кипения (100°C)! Вода превратилась в пар и свободно разлетается по комнате!' 
          : 'Qaynash nuqtasi (100°C)! Suv bug‘ga aylanib butun xonaga uchib ketmoqda!';
        visualContent = `
          <div class="steam-gas-display bounce-in">
            <div class="steam-clouds">
              <span class="steam-icon float-steam">💨</span>
              <span class="steam-icon float-steam-2">☁️</span>
              <span class="steam-icon float-steam-3">💨</span>
            </div>
            <p class="state-sub">${sub}</p>
          </div>
        `;
        window.physicsAudio.playSizzle();
        window.physicsApp.unlockBadge('state-changer');
      }

      if (stateVisual) {
        stateVisual.className = `state-visual-box ${stateTag}`;
        stateVisual.innerHTML = visualContent;
      }

      if (stateDesc) {
        const lead = isRu ? "Текущее состояние:" : "Hozirgi holat:";
        stateDesc.innerHTML = `<strong>${lead}</strong> ${stateName}`;
      }
    };

    if (slider) {
      slider.addEventListener('input', (e) => this.updateState(e.target.value));
    }

    const presetFreeze = document.getElementById('preset-freeze-btn');
    const presetRoom = document.getElementById('preset-room-btn');
    const presetBoil = document.getElementById('preset-boil-btn');

    if (presetFreeze) {
      presetFreeze.addEventListener('click', () => {
        window.physicsAudio.playPop();
        if (slider) slider.value = -10;
        this.updateState(-10);
      });
    }

    if (presetRoom) {
      presetRoom.addEventListener('click', () => {
        window.physicsAudio.playPop();
        if (slider) slider.value = 25;
        this.updateState(25);
      });
    }

    if (presetBoil) {
      presetBoil.addEventListener('click', () => {
        window.physicsAudio.playPop();
        if (slider) slider.value = 105;
        this.updateState(105);
      });
    }

    this.updateState(20);
  }
}

window.physicsLab = new PhysicsLabManager();
