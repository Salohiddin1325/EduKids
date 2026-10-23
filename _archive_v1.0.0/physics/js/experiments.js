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

    // Circuit Lab State
    this.circuitClosed = true;
    this.circuitVoltage = 4.5;
    this.circuitMaterial = 'copper';
    this.isConductor = true;
    this.electronLoopActive = false;
    this.electronAnimId = null;
    this.electronOffset = 0;
  }

  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.bindGravityLab();
    this.bindMagnetLab();
    this.bindStateChangerLab();
    this.bindCircuitLab();
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
    const tower = document.getElementById('gravity-tower-arena');
    const isRu = this.getLang() === 'ru';

    if (tower) {
      tower.className = `gravity-tower-arena env-${this.gravityEnvironment}`;
    }

    if (objectEl) {
      objectEl.style.transition = 'none';
      objectEl.style.top = '20px';
      objectEl.style.transform = 'translateX(-50%)';
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

    const isRu = this.getLang() === 'ru';
    let baseTime = 0.75;
    const dropDistance = tower.clientHeight - 85;
    let targetTop = `${dropDistance}px`;
    let isZeroG = (this.gravityEnvironment === 'zerog');

    if (this.gravityEnvironment === 'earth') {
      baseTime = (this.gravityObject === 'feather') ? 1.9 : 0.75;
    } else if (this.gravityEnvironment === 'moon') {
      // In lunar vacuum, all objects fall gently in 1.85s
      baseTime = 1.85;
    } else if (this.gravityEnvironment === 'jupiter') {
      // Violent 24.8 m/s² gravity
      baseTime = 0.42;
    } else if (isZeroG) {
      baseTime = 2.4;
      targetTop = '45px';
    }

    if (isZeroG) {
      objectEl.style.transition = `top ${baseTime}s cubic-bezier(0.2, 0.8, 0.4, 1), transform ${baseTime}s ease-in-out`;
      objectEl.style.top = targetTop;
      objectEl.style.transform = 'translateX(-50%) rotate(45deg) scale(1.15)';
    } else if (this.gravityObject === 'feather' && this.gravityEnvironment === 'earth') {
      objectEl.style.transition = `top ${baseTime}s ease-in-out, transform 0.4s ease-in-out`;
      objectEl.style.top = targetTop;
      objectEl.style.transform = 'translateX(-50%) rotate(-15deg)';
    } else if (this.gravityEnvironment === 'jupiter') {
      objectEl.style.transition = `top ${baseTime}s cubic-bezier(0.8, 0, 1, 1)`;
      objectEl.style.top = targetTop;
      objectEl.style.transform = 'translateX(-50%)';
    } else {
      objectEl.style.transition = `top ${baseTime}s cubic-bezier(0.45, 0, 0.9, 1)`;
      objectEl.style.top = targetTop;
      objectEl.style.transform = 'translateX(-50%)';
    }

    let start = performance.now();
    this.dropTimerInterval = setInterval(() => {
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      if (timerDisplay) timerDisplay.textContent = `${elapsed}s`;
    }, 40);

    setTimeout(() => {
      clearInterval(this.dropTimerInterval);
      if (timerDisplay) timerDisplay.textContent = `${baseTime.toFixed(2)}s`;
      this.isDropping = false;

      if (!isZeroG) {
        if (this.gravityEnvironment === 'jupiter') {
          window.physicsAudio.playBounce();
          tower.classList.add('tower-shake');
          setTimeout(() => tower.classList.remove('tower-shake'), 400);
        } else if (this.gravityObject !== 'feather') {
          window.physicsAudio.playBounce();
        }
      } else {
        if (window.kiddoAudio) window.kiddoAudio.playWhoosh();
      }

      if (noteDisplay) {
        if (isZeroG) {
          noteDisplay.innerHTML = isRu
            ? `🛸 <strong>Невесомость (0-G):</strong> В открытом космосе гравитация отсутствует! Предмет свободно парит и не падает вниз!`
            : `🛸 <strong>Vaznsizlik (0-G):</strong> Ochiq kosmosda gravitatsiya yo‘q! Obyekt yerga tushmaydi, balki koinotda erkin suzib yuradi!`;
        } else if (this.gravityEnvironment === 'jupiter') {
          noteDisplay.innerHTML = isRu
            ? `🪐 <strong>Гравитация Юпитера (24.8 м/с²):</strong> Юпитер — планета-гигант! Притяжение в 2.5 раза сильнее земного, предмет врезался в пол с колоссальной силой!`
            : `🪐 <strong>Yupiter gravitatsiyasi (24.8 m/s²):</strong> Yupiter bahaybat sayyora! Tortishish kuchi Yernikidan 2.5 barobar kuchli bo‘lgani uchun obyekt chaqmoqdek tezlikda polga urildi!`;
        } else if (this.gravityEnvironment === 'moon') {
          noteDisplay.innerHTML = isRu
            ? `🌕 <strong>Лунная гравитация (1.6 м/с²):</strong> На Луне притяжение в 6 раз слабее! И главное: на Луне нет воздуха, поэтому и перо, и тяжелый камень падают синхронно!`
            : `🌕 <strong>Oy gravitatsiyasi (1.6 m/s²):</strong> Oyda tortishish kuchi 6 barobar zaif! Eng qizig‘i — Oyda havo yo‘qligi sababli pat ham, og‘ir tosh ham bir xil tezlikda tushadi!`;
        } else if (this.gravityObject === 'feather') {
          noteDisplay.innerHTML = isRu
            ? `🪶 <strong>Сопротивление воздуха:</strong> Перо легкое, воздух его придерживает, поэтому оно плавно покачивается при падении!`
            : `🪶 <strong>Havo qarshiligi:</strong> Pat yengil va unga havo qarshilik ko‘rsatgani uchun u havoda tebranib, sekinroq tushdi!`;
        } else {
          noteDisplay.innerHTML = isRu
            ? `🌍 <strong>Земная гравитация (9.8 м/с²):</strong> Сила притяжения быстро устремила предмет прямо к поверхности Земли!`
            : `🌍 <strong>Yer gravitatsiyasi (9.8 m/s²):</strong> Erkin tushish tezlanishi tufayli obyekt yer sathiga tez yetib keldi!`;
        }
      }

      window.physicsApp.unlockBadge('gravity-drop');
      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('physics', true);
        window.gamificationHub.addXP(15, 'gravity-drop');
      }
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

  // ==========================================
  // 4. ELECTRIC CIRCUIT & NEON BULB LAB
  // ==========================================
  bindCircuitLab() {
    // Switch toggle button & 3D switch element
    const switchBtn = document.getElementById('btn-toggle-switch');
    const switchUnit = document.getElementById('circuit-switch');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => this.toggleKnifeSwitch());
    }
    if (switchUnit) {
      switchUnit.addEventListener('click', () => this.toggleKnifeSwitch());
    }

    // Voltage buttons
    const voltBtns = document.querySelectorAll('.circuit-voltage-btn');
    voltBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        voltBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.circuitVoltage = parseFloat(btn.dataset.voltage) || 4.5;
        this.updateCircuitUI();
      });
    });

    // Material buttons
    const matBtns = document.querySelectorAll('.circuit-material-btn');
    matBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        matBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.circuitMaterial = btn.dataset.material;
        this.isConductor = (btn.dataset.conductor === 'true');
        this.updateCircuitUI();
      });
    });

    // Reset button
    const resetBtn = document.getElementById('btn-circuit-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        window.physicsAudio.playPop();
        this.circuitClosed = true;
        this.circuitVoltage = 4.5;
        this.circuitMaterial = 'copper';
        this.isConductor = true;

        voltBtns.forEach(b => b.classList.toggle('active', b.dataset.voltage === '4.5'));
        matBtns.forEach(b => b.classList.toggle('active', b.dataset.material === 'copper'));
        this.updateCircuitUI();
      });
    }

    // Init canvas resize for electron flow
    const canvas = document.getElementById('circuit-electrons-canvas');
    if (canvas) {
      window.addEventListener('resize', () => this.resizeCircuitCanvas());
    }

    this.updateCircuitUI();
  }

  toggleKnifeSwitch() {
    this.circuitClosed = !this.circuitClosed;
    const spark = document.getElementById('switch-spark');

    if (this.circuitClosed) {
      window.physicsAudio.playPop();
      if (spark) {
        spark.classList.add('sparkle-anim');
        setTimeout(() => spark.classList.remove('sparkle-anim'), 350);
      }
    } else {
      window.physicsAudio.playPop();
    }

    this.updateCircuitUI();
  }

  updateCircuitUI() {
    const isRu = this.getLang() === 'ru';
    const voltDisplay = document.getElementById('circuit-voltage-display');
    const currDisplay = document.getElementById('circuit-current-display');
    const statDisplay = document.getElementById('circuit-status-display');
    const switchBtnTxt = document.getElementById('txt-switch-btn');
    const switchLabel = document.getElementById('switch-label');
    const switchUnit = document.getElementById('circuit-switch');
    const bulbUnit = document.getElementById('circuit-bulb');
    const bulbCaption = document.getElementById('bulb-status-caption');
    const batteryVoltsTag = document.getElementById('battery-volts-tag');
    const descBox = document.getElementById('circuit-desc-box');
    const specimenHolder = document.getElementById('test-specimen-holder');

    // Material names mapping
    const matDetails = {
      copper: { icon: '⚡', nameUz: 'Mis sim (O‘tkazgich)', nameRu: 'Медный провод (Проводник)' },
      iron: { icon: '🔩', nameUz: 'Temir mix (O‘tkazgich)', nameRu: 'Железный гвоздь (Проводник)' },
      graphite: { icon: '✏️', nameUz: 'Grafit qalam (O‘tkazgich)', nameRu: 'Графит грифель (Проводник)' },
      plastic: { icon: '📏', nameUz: 'Plastmassa chizg‘ich (Izolyator)', nameRu: 'Пластиковая линейка (Изолятор)' },
      wood: { icon: '🪵', nameUz: 'Yog‘och tayoqcha (Izolyator)', nameRu: 'Деревянная палочка (Изолятор)' },
      rubber: { icon: '🎈', nameUz: 'Rezina pufak (Izolyator)', nameRu: 'Резиновый шарик (Изолятор)' }
    };
    const currentMat = matDetails[this.circuitMaterial] || matDetails.copper;

    if (specimenHolder) {
      specimenHolder.innerHTML = `
        <div class="specimen-item ${this.circuitMaterial} ${this.isConductor ? 'conductor' : 'insulator'}">
          <span class="specimen-icon">${currentMat.icon}</span>
          <span class="specimen-text">${isRu ? currentMat.nameRu : currentMat.nameUz}</span>
        </div>
      `;
    }

    if (batteryVoltsTag) {
      batteryVoltsTag.textContent = `${this.circuitVoltage}V`;
    }
    if (voltDisplay) {
      voltDisplay.textContent = `${this.circuitVoltage}V`;
    }

    // Switch state UI
    if (switchUnit) {
      switchUnit.className = `circuit-component switch-unit ${this.circuitClosed ? 'closed' : 'open'}`;
    }
    if (switchLabel) {
      switchLabel.textContent = this.circuitClosed 
        ? (isRu ? 'Ключ: Замкнут 🔒' : 'Kalit: Yopiq 🔒')
        : (isRu ? 'Ключ: Разомкнут 🔓' : 'Kalit: Ochiq 🔓');
    }
    if (switchBtnTxt) {
      switchBtnTxt.textContent = this.circuitClosed
        ? (isRu ? '🔌 Разомкнуть цепь' : '🔌 Kalitni Ochish (Uzish)')
        : (isRu ? '⚡ Замкнуть цепь' : '⚡ Kalitni Yopish (Tutash)');
    }

    const isCurrentFlowing = this.circuitClosed && this.isConductor;

    if (isCurrentFlowing) {
      const currentVal = (this.circuitVoltage / 10).toFixed(2);
      if (currDisplay) currDisplay.textContent = `${currentVal}A`;
      if (statDisplay) {
        statDisplay.style.color = 'var(--green)';
        statDisplay.textContent = isRu ? 'Цепь замкнута (Ток идет ⚡)' : 'Yopiq (Tok oqyapti ⚡)';
      }

      // Bulb glowing with voltage scaling
      if (bulbUnit) {
        bulbUnit.className = 'circuit-component neon-bulb-unit lit';
        const powerLevel = this.circuitVoltage === 9 ? 'high' : (this.circuitVoltage === 4.5 ? 'med' : 'low');
        bulbUnit.setAttribute('data-power', powerLevel);
      }
      if (bulbCaption) {
        bulbCaption.textContent = isRu 
          ? `Лампа: Ярко светит! (${this.circuitVoltage}V) 💡` 
          : `Lampochka: Yorug‘ yonmoqda! (${this.circuitVoltage}V) 💡`;
      }

      if (descBox) {
        descBox.innerHTML = isRu
          ? `⚡ <strong>Цепь замкнута!</strong> ${currentMat.nameRu} отлично проводит электрический ток. Электроны устремились по проводам, раскалили нить накала и неоновая лампа ярко зажглась!`
          : `⚡ <strong>Zanjir to‘liq tutashdi!</strong> ${currentMat.nameUz} elektr tokini juda yaxshi o‘tkazadi. Elektronlar simlar bo‘ylab yugurib, lampochkani issiq neon nurlari bilan porlatdi!`;
      }

      window.physicsAudio.playChime();
      window.physicsApp.unlockBadge('electrician');
      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('physics', true);
        window.gamificationHub.addXP(20, 'circuit-complete');
      }

      this.startElectronAnimation();
    } else {
      if (currDisplay) currDisplay.textContent = '0.00A';
      if (bulbUnit) {
        bulbUnit.className = 'circuit-component neon-bulb-unit unlit';
        bulbUnit.removeAttribute('data-power');
      }
      if (bulbCaption) {
        bulbCaption.textContent = isRu ? 'Лампа: Погасла ⚪' : 'Lampochka: O‘chgan ⚪';
      }

      this.stopElectronAnimation();

      if (!this.circuitClosed) {
        if (statDisplay) {
          statDisplay.style.color = 'var(--amber)';
          statDisplay.textContent = isRu ? 'Разомкнута (Ключ выкл)' : 'Ochiq (Kalit o‘chiq)';
        }
        if (descBox) {
          descBox.innerHTML = isRu
            ? `🔌 <strong>Цепь разомкнута!</strong> Рубильник открыт, воздушный зазор не дает току течь. Нажмите на ключ или кнопку выше, чтобы соединить контакты!`
            : `🔌 <strong>Zanjir uzilgan!</strong> Kalit ochiq turgani sababli havo orqali tok o‘tolmaydi. Kontaktlarni ulash uchun kalitni bosing!`;
        }
      } else {
        // Closed but insulator
        if (statDisplay) {
          statDisplay.style.color = '#EF4444';
          statDisplay.textContent = isRu ? 'Изолятор (Ток заблокирован)' : 'Izolyator (Tok to‘sildi)';
        }
        if (descBox) {
          descBox.innerHTML = isRu
            ? `⚠️ <strong>Ток не проходит!</strong> ${currentMat.nameRu} — это изолятор. В его структуре нет свободных электронов, поэтому электричество через него не протекает!`
            : `⚠️ <strong>Tok o‘tmadi!</strong> ${currentMat.nameUz} — izolyator (elektr o‘tkazmaydigan material). Uning tarkibida erkin elektronlar bo‘lmagani sababli zanjir orqali tok oqa olmaydi!`;
        }
      }
    }
  }

  resizeCircuitCanvas() {
    const canvas = document.getElementById('circuit-electrons-canvas');
    if (!canvas) return;
    const arena = document.getElementById('circuit-schematic-arena');
    if (!arena) return;

    const rect = arena.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }

  startElectronAnimation() {
    if (this.electronLoopActive) return;
    this.electronLoopActive = true;
    this.resizeCircuitCanvas();

    const canvas = document.getElementById('circuit-electrons-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      if (!this.electronLoopActive) return;

      const w = canvas.width;
      const h = canvas.height;
      if (w < 40 || h < 40) {
        this.electronAnimId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Define circuit wire rectangle path
      const padX = 55;
      const padY = 50;
      const wireLeft = padX;
      const wireRight = w - padX;
      const wireTop = padY;
      const wireBottom = h - padY;

      // Draw subtle glowing circuit trace
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.strokeRect(wireLeft, wireTop, wireRight - wireLeft, wireBottom - wireTop);
      ctx.restore();

      // Calculate perimeter
      const pathW = wireRight - wireLeft;
      const pathH = wireBottom - wireTop;
      const perimeter = 2 * (pathW + pathH);

      // Speed depends on voltage
      const speed = this.circuitVoltage === 9 ? 3.8 : (this.circuitVoltage === 4.5 ? 2.2 : 1.2);
      this.electronOffset = (this.electronOffset + speed) % perimeter;

      // 24 electrons spaced along the wire
      const numElectrons = 22;
      const spacing = perimeter / numElectrons;

      for (let i = 0; i < numElectrons; i++) {
        const dist = (this.electronOffset + i * spacing) % perimeter;
        let ex = 0;
        let ey = 0;

        // Traverse rectangle clockwise: Top -> Right -> Bottom -> Left
        if (dist < pathW) {
          // Top edge: Left to Right
          ex = wireLeft + dist;
          ey = wireTop;
        } else if (dist < pathW + pathH) {
          // Right edge: Top to Bottom
          ex = wireRight;
          ey = wireTop + (dist - pathW);
        } else if (dist < 2 * pathW + pathH) {
          // Bottom edge: Right to Left
          ex = wireRight - (dist - (pathW + pathH));
          ey = wireBottom;
        } else {
          // Left edge: Bottom to Top
          ex = wireLeft;
          ey = wireBottom - (dist - (2 * pathW + pathH));
        }

        // Draw glowing electron particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(ex, ey, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.restore();
      }

      this.electronAnimId = requestAnimationFrame(animate);
    };

    this.electronAnimId = requestAnimationFrame(animate);
  }

  stopElectronAnimation() {
    this.electronLoopActive = false;
    if (this.electronAnimId) {
      cancelAnimationFrame(this.electronAnimId);
      this.electronAnimId = null;
    }
    const canvas = document.getElementById('circuit-electrons-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

window.physicsLab = new PhysicsLabManager();
