/**
 * MathKids - Interactive Pizza Fraction Slicer Sandbox
 * Visualizes fractions (numerator / denominator), cutting into 2, 3, 4, 6, 8 slices,
 * eating slices, percentages, decimals, and interactive customer challenge mode!
 * 100% Offline, Pure Canvas/SVG + Web Audio
 */

class FractionPizzaSandbox {
  constructor() {
    this.totalSlices = 4;
    this.slicesState = [true, true, true, true]; // true = active/present, false = eaten
    this.targetChallenge = null; // { total: 4, remaining: 3 }
    this.streakOrders = 0;
  }

  getLang() {
    return window.mathApp ? window.mathApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  init() {
    this.renderSandbox();
    this.bindEvents();
    this.startNewChallenge();
  }

  setSlices(count) {
    if (window.kiddoAudio) window.kiddoAudio.playPop();
    this.totalSlices = count;
    this.slicesState = new Array(count).fill(true);
    this.renderPizza();
    this.updateStats();
  }

  toggleSlice(index) {
    if (window.kiddoAudio) window.kiddoAudio.playPop();
    this.slicesState[index] = !this.slicesState[index];
    this.renderPizza();
    this.updateStats();
  }

  restoreAll() {
    if (window.kiddoAudio) window.kiddoAudio.playWhoosh();
    this.slicesState = new Array(this.totalSlices).fill(true);
    this.renderPizza();
    this.updateStats();
  }

  eatOne() {
    const presentIdx = this.slicesState.lastIndexOf(true);
    if (presentIdx !== -1) {
      this.toggleSlice(presentIdx);
    }
  }

  eatHalf() {
    if (window.kiddoAudio) window.kiddoAudio.playPop();
    const half = Math.floor(this.totalSlices / 2);
    for (let i = 0; i < this.totalSlices; i++) {
      this.slicesState[i] = i >= half;
    }
    this.renderPizza();
    this.updateStats();
  }

  getFractionWords(numerator, denominator) {
    const isRu = this.getLang() === 'ru';
    if (numerator === 0) return isRu ? 'Ноль (Пустая тарелка)' : 'Nol (Bo‘sh likopcha)';
    if (numerator === denominator) return isRu ? 'Целая пицца (1)' : 'Butun pitsa (1)';

    const uzNames = {
      2: { 1: 'Yarim (Ikkidan bir)' },
      3: { 1: 'Uchdan bir', 2: 'Uchdan ikki' },
      4: { 1: 'Chorak (To‘rtdan bir)', 2: 'Yarim (To‘rtdan ikki)', 3: 'To‘rtdan uch' },
      6: { 1: 'Oltidan bir', 2: 'Oltidan ikki (Uchdan bir)', 3: 'Oltidan uch (Yarim)', 4: 'Oltidan to‘rt', 5: 'Oltidan besh' },
      8: { 1: 'Sakkizdan bir', 2: 'Sakkizdan ikki (Chorak)', 3: 'Sakkizdan uch', 4: 'Sakkizdan to‘rt (Yarim)', 5: 'Sakkizdan besh', 6: 'Sakkizdan olti', 7: 'Sakkizdan yetti' }
    };

    const ruNames = {
      2: { 1: 'Половина (Одна вторая)' },
      3: { 1: 'Одна треть', 2: 'Две третьих' },
      4: { 1: 'Четверть (Одна четвёртая)', 2: 'Половина (Две четвёртых)', 3: 'Три четвёртых' },
      6: { 1: 'Одна шестая', 2: 'Две шестых', 3: 'Половина (Три шестых)', 4: 'Четыре шестых', 5: 'Пять шестых' },
      8: { 1: 'Одна восьмая', 2: 'Две восьмых (Четверть)', 3: 'Три восьмых', 4: 'Половина (Четыре восьмых)', 5: 'Пять восьмых', 6: 'Шесть восьмых', 7: 'Семь восьмых' }
    };

    const dict = isRu ? ruNames : uzNames;
    if (dict[denominator] && dict[denominator][numerator]) {
      return dict[denominator][numerator];
    }
    return isRu ? `${numerator} из ${denominator} частей` : `${denominator} tadan ${numerator} qismi`;
  }

  updateStats() {
    const remaining = this.slicesState.filter(Boolean).length;
    const total = this.totalSlices;
    const pct = Math.round((remaining / total) * 100);
    const decimal = (remaining / total).toFixed(2);
    const isRu = this.getLang() === 'ru';

    const numEl = document.getElementById('frac-numerator');
    const denEl = document.getElementById('frac-denominator');
    const wordsEl = document.getElementById('frac-words-text');
    const pctEl = document.getElementById('frac-pct-value');
    const decEl = document.getElementById('frac-decimal-value');
    const barEl = document.getElementById('frac-progress-fill');
    const eatenEl = document.getElementById('frac-eaten-note');

    if (numEl) numEl.textContent = remaining;
    if (denEl) denEl.textContent = total;
    if (wordsEl) wordsEl.textContent = this.getFractionWords(remaining, total);
    if (pctEl) pctEl.textContent = `${pct}%`;
    if (decEl) decEl.textContent = decimal;
    if (barEl) barEl.style.width = `${pct}%`;

    if (eatenEl) {
      const eaten = total - remaining;
      eatenEl.innerHTML = isRu
        ? `Съедено: <strong>${eaten}/${total}</strong> кусочков (${100 - pct}%)`
        : `Yeyildi: <strong>${eaten}/${total}</strong> bo‘lak (${100 - pct}%)`;
    }
  }

  renderPizza() {
    const svg = document.getElementById('fraction-pizza-svg');
    if (!svg) return;

    svg.innerHTML = '';
    const cx = 150;
    const cy = 150;
    const r = 125;

    // SVG Defs (Gradients and shadows)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <radialGradient id="plateGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F8FAFC" />
        <stop offset="90%" stop-color="#E2E8F0" />
        <stop offset="100%" stop-color="#CBD5E1" />
      </radialGradient>
      <radialGradient id="crustGrad" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stop-color="#E76F51" />
        <stop offset="90%" stop-color="#D97706" />
        <stop offset="100%" stop-color="#B45309" />
      </radialGradient>
      <radialGradient id="cheeseGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFF3B0" />
        <stop offset="85%" stop-color="#FFD166" />
        <stop offset="100%" stop-color="#F4A261" />
      </radialGradient>
      <filter id="pizzaShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-opacity="0.25"/>
      </filter>
    `;
    svg.appendChild(defs);

    // Plate (empty dish)
    const plate = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    plate.setAttribute('cx', cx);
    plate.setAttribute('cy', cy);
    plate.setAttribute('r', r + 15);
    plate.setAttribute('fill', 'url(#plateGrad)');
    plate.setAttribute('stroke', '#94A3B8');
    plate.setAttribute('stroke-width', '4');
    plate.setAttribute('filter', 'url(#pizzaShadow)');
    svg.appendChild(plate);

    // Plate rim grooves
    const plateInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    plateInner.setAttribute('cx', cx);
    plateInner.setAttribute('cy', cy);
    plateInner.setAttribute('r', r + 6);
    plateInner.setAttribute('fill', 'none');
    plateInner.setAttribute('stroke', '#CBD5E1');
    plateInner.setAttribute('stroke-width', '2');
    svg.appendChild(plateInner);

    // Slice angle step in radians
    const sliceAngle = (2 * Math.PI) / this.totalSlices;

    for (let i = 0; i < this.totalSlices; i++) {
      const isPresent = this.slicesState[i];
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = (i + 1) * sliceAngle - Math.PI / 2;
      const midAngle = startAngle + sliceAngle / 2;

      // Group for slice
      const sliceG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      sliceG.setAttribute('class', `pizza-slice-group ${isPresent ? 'slice-present' : 'slice-eaten'}`);
      sliceG.style.cursor = 'pointer';
      sliceG.onclick = () => this.toggleSlice(i);

      if (isPresent) {
        // Pizza Crust / Cheese Sector Path
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = sliceAngle > Math.PI ? 1 : 0;

        const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        const slicePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        slicePath.setAttribute('d', pathData);
        slicePath.setAttribute('fill', 'url(#cheeseGrad)');
        slicePath.setAttribute('stroke', '#B45309');
        slicePath.setAttribute('stroke-width', '2.5');
        sliceG.appendChild(slicePath);

        // Crust Border Arc
        const crustArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        crustArc.setAttribute('d', `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`);
        crustArc.setAttribute('fill', 'none');
        crustArc.setAttribute('stroke', 'url(#crustGrad)');
        crustArc.setAttribute('stroke-width', '14');
        crustArc.setAttribute('stroke-linecap', 'round');
        sliceG.appendChild(crustArc);

        // Pepperoni Toppings on this slice
        const pepR = r * 0.58;
        const pepX = cx + pepR * Math.cos(midAngle);
        const pepY = cy + pepR * Math.sin(midAngle);

        const pepperoni = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pepperoni.setAttribute('cx', pepX);
        pepperoni.setAttribute('cy', pepY);
        pepperoni.setAttribute('r', '11');
        pepperoni.setAttribute('fill', '#EF4444');
        pepperoni.setAttribute('stroke', '#B91C1C');
        pepperoni.setAttribute('stroke-width', '2');
        sliceG.appendChild(pepperoni);

        // Pepperoni grease dots
        const pepDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pepDot.setAttribute('cx', pepX - 3);
        pepDot.setAttribute('cy', pepY - 3);
        pepDot.setAttribute('r', '2.5');
        pepDot.setAttribute('fill', '#F87171');
        sliceG.appendChild(pepDot);

        // Basil leaf
        const basilR = r * 0.32;
        const basilX = cx + basilR * Math.cos(midAngle + 0.12);
        const basilY = cy + basilR * Math.sin(midAngle + 0.12);
        const basil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        basil.setAttribute('cx', basilX);
        basil.setAttribute('cy', basilY);
        basil.setAttribute('r', '5');
        basil.setAttribute('fill', '#10B981');
        sliceG.appendChild(basil);

        // Slice number badge
        const badgeR = r * 0.78;
        const badgeX = cx + badgeR * Math.cos(midAngle);
        const badgeY = cy + badgeR * Math.sin(midAngle);

        const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        badgeText.setAttribute('x', badgeX);
        badgeText.setAttribute('y', badgeY + 4);
        badgeText.setAttribute('text-anchor', 'middle');
        badgeText.setAttribute('font-size', '13');
        badgeText.setAttribute('font-weight', '900');
        badgeText.setAttribute('fill', '#78350F');
        badgeText.textContent = `${i + 1}`;
        sliceG.appendChild(badgeText);
      } else {
        // Eaten slice marker (Crumbs on the plate)
        const crumbR = r * 0.55;
        const crumbX = cx + crumbR * Math.cos(midAngle);
        const crumbY = cy + crumbR * Math.sin(midAngle);

        const crumb1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        crumb1.setAttribute('cx', crumbX);
        crumb1.setAttribute('cy', crumbY);
        crumb1.setAttribute('r', '2.5');
        crumb1.setAttribute('fill', '#D97706');
        crumb1.setAttribute('opacity', '0.6');
        sliceG.appendChild(crumb1);

        const crumb2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        crumb2.setAttribute('cx', crumbX + 7);
        crumb2.setAttribute('cy', crumbY - 5);
        crumb2.setAttribute('r', '1.8');
        crumb2.setAttribute('fill', '#B45309');
        crumb2.setAttribute('opacity', '0.5');
        sliceG.appendChild(crumb2);
      }

      svg.appendChild(sliceG);
    }
  }

  // --- CHALLENGE / CUSTOMER ORDER MODE ---
  startNewChallenge() {
    const availableDenominators = [2, 3, 4, 6, 8];
    const den = availableDenominators[Math.floor(Math.random() * availableDenominators.length)];
    const num = Math.floor(Math.random() * (den - 1)) + 1; // 1 to den - 1

    this.targetChallenge = { total: den, remaining: num };
    this.renderChallengeUI();
  }

  renderChallengeUI() {
    const promptEl = document.getElementById('frac-challenge-prompt');
    if (!promptEl || !this.targetChallenge) return;

    const isRu = this.getLang() === 'ru';
    const t = this.targetChallenge;

    promptEl.innerHTML = isRu
      ? `👨‍🍳 <strong>Заказ Гостя:</strong> Подготовьте ровно <span class="challenge-target-frac">${t.remaining}/${t.total}</span> пиццы!`
      : `👨‍🍳 <strong>Mijoz Buyurtmasi:</strong> Likopchada rosa <span class="challenge-target-frac">${t.remaining}/${t.total}</span> pitsa qoldiring!`;
  }

  checkOrderSubmission() {
    if (!this.targetChallenge) return;
    const remaining = this.slicesState.filter(Boolean).length;
    const total = this.totalSlices;
    const isRu = this.getLang() === 'ru';

    // Check fraction equality: remaining / total === target.remaining / target.total
    const isCorrect = (remaining * this.targetChallenge.total) === (this.targetChallenge.remaining * total);

    const feedbackEl = document.getElementById('frac-challenge-feedback');

    if (isCorrect) {
      this.streakOrders += 1;
      if (window.kiddoAudio) window.kiddoAudio.playChime();
      if (window.astroCat) {
        window.astroCat.cheer('correct');
      }

      if (window.gamificationHub) {
        window.gamificationHub.addXP(25, 'math-fractions');
        window.gamificationHub.addStars(2);
        window.gamificationHub.recordActivity('math', true);
      }

      if (feedbackEl) {
        feedbackEl.className = 'frac-feedback success bounce-in';
        feedbackEl.innerHTML = isRu
          ? `🎉 Превосходно! Клиент счастлив! Получено: <strong>+25 XP</strong> и <strong>+2 ⭐</strong>`
          : `🎉 Qoyilmaqom! Mijoz juda xursand bo‘ldi! <strong>+25 XP</strong> va <strong>+2 ⭐</strong> taqdirlandingiz!`;
        feedbackEl.style.display = 'block';
      }

      setTimeout(() => {
        if (feedbackEl) feedbackEl.style.display = 'none';
        this.startNewChallenge();
      }, 2400);
    } else {
      if (window.kiddoAudio) window.kiddoAudio.playBoing();
      if (window.astroCat) {
        window.astroCat.cheer('tryAgain');
      }
      if (window.gamificationHub) {
        window.gamificationHub.recordActivity('math', false);
      }

      if (feedbackEl) {
        feedbackEl.className = 'frac-feedback error shake-anim';
        feedbackEl.innerHTML = isRu
          ? `💡 У вас сейчас <strong>${remaining}/${total}</strong>, а нужно <strong>${this.targetChallenge.remaining}/${this.targetChallenge.total}</strong>. Попробуйте еще раз!`
          : `💡 Hozir likopchada <strong>${remaining}/${total}</strong> pitsa bor, mijozga esa <strong>${this.targetChallenge.remaining}/${this.targetChallenge.total}</strong> kerak. Qayta urinib ko‘ring!`;
        feedbackEl.style.display = 'block';
      }
    }
  }

  renderSandbox() {
    const container = document.getElementById('sec-fractions');
    if (!container) return;

    const isRu = this.getLang() === 'ru';

    container.innerHTML = `
      <div class="section-hero-title">
        <h2 id="sec-frac-title">${isRu ? 'Интерактивная Пицца: Изучаем Дроби 🍕' : 'Interaktiv Pitsa: Kasrlarni Kesish Sandbo‘ksi 🍕'}</h2>
        <p id="sec-frac-desc">${isRu ? 'Нарезайте кусочки, угощайте друзей и смотрите, как устроены дроби, проценты и десятичные числа!' : 'Pitsani teng bo‘laklarga bo‘ling, yeb ko‘ring va kasrlar, foizlar hamda o‘nlik sonlarning qanday ishlashini bilib oling!'}</p>
      </div>

      <!-- Challenge Customer Banner -->
      <div class="frac-challenge-banner" id="frac-challenge-banner">
        <div class="frac-challenge-text" id="frac-challenge-prompt">
          <!-- Injected via renderChallengeUI -->
        </div>
        <button class="btn btn-primary" onclick="window.fractionSandbox.checkOrderSubmission()" id="btn-submit-order">
          ✅ ${isRu ? 'Отдать Заказ Гостю' : 'Buyurtmani Topshirish'}
        </button>
      </div>
      <div id="frac-challenge-feedback" class="frac-feedback" style="display: none;"></div>

      <div class="fraction-sandbox-grid">
        <!-- Left: Interactive Digital Pizza Canvas -->
        <div class="fraction-visual-card">
          <div class="pizza-canvas-wrap">
            <svg id="fraction-pizza-svg" viewBox="0 0 300 300" width="300" height="300"></svg>
          </div>

          <!-- Slicing Buttons Toolbar -->
          <div class="fraction-cutter-toolbar">
            <span class="cutter-label">${isRu ? 'Нарезать на:' : 'Bo‘laklar soni:'}</span>
            <div class="cutter-buttons-row">
              <button class="cutter-btn ${this.totalSlices === 2 ? 'active' : ''}" onclick="window.fractionSandbox.setSlices(2)">2</button>
              <button class="cutter-btn ${this.totalSlices === 3 ? 'active' : ''}" onclick="window.fractionSandbox.setSlices(3)">3</button>
              <button class="cutter-btn ${this.totalSlices === 4 ? 'active' : ''}" onclick="window.fractionSandbox.setSlices(4)">4 (¼)</button>
              <button class="cutter-btn ${this.totalSlices === 6 ? 'active' : ''}" onclick="window.fractionSandbox.setSlices(6)">6</button>
              <button class="cutter-btn ${this.totalSlices === 8 ? 'active' : ''}" onclick="window.fractionSandbox.setSlices(8)">8 (⅛)</button>
            </div>

            <!-- Action Quick Buttons -->
            <div class="cutter-actions-row">
              <button class="btn btn-ctrl" onclick="window.fractionSandbox.eatOne()">😋 ${isRu ? 'Съесть 1' : '1 ta yeyish'}</button>
              <button class="btn btn-ctrl" onclick="window.fractionSandbox.eatHalf()">⚖️ ${isRu ? 'Съесть ровно ½' : 'Yarmini yeyish'}</button>
              <button class="btn btn-ctrl" onclick="window.fractionSandbox.restoreAll()">🔄 ${isRu ? 'Новая пицца' : 'Barchasini tiklash'}</button>
            </div>
          </div>
        </div>

        <!-- Right: Dynamic Math Fraction Dashboard -->
        <div class="fraction-math-card">
          <div class="math-card-header">
            <h3>📊 ${isRu ? 'Математика Дроби' : 'Kasr Hisoblagichi'}</h3>
            <span class="badge-live">LIVE</span>
          </div>

          <!-- Big Fraction Display -->
          <div class="big-fraction-container">
            <div class="fraction-vertical-stack">
              <div class="frac-number numerator" id="frac-numerator">4</div>
              <div class="frac-bar"></div>
              <div class="frac-number denominator" id="frac-denominator">4</div>
            </div>
            
            <div class="frac-equals">=</div>

            <div class="frac-extra-stats">
              <div class="frac-stat-item">
                <span class="stat-tag">${isRu ? 'Процент' : 'Foiz'}</span>
                <span class="stat-highlight" id="frac-pct-value">100%</span>
              </div>
              <div class="frac-stat-item">
                <span class="stat-tag">${isRu ? 'Десятичная' : 'O‘nlik kasr'}</span>
                <span class="stat-highlight" id="frac-decimal-value">1.00</span>
              </div>
            </div>
          </div>

          <!-- Fraction Meaning Words -->
          <div class="fraction-word-meaning">
            <div class="meaning-icon">💡</div>
            <div class="meaning-text">
              <span class="meaning-label">${isRu ? 'Как это звучит:' : 'So‘z bilan aytilishi:'}</span>
              <h4 id="frac-words-text">Butun pitsa (1)</h4>
              <p id="frac-eaten-note">${isRu ? 'Съедено: 0/4 кусочков' : 'Yeyildi: 0/4 bo‘lak'}</p>
            </div>
          </div>

          <!-- Progress Bar Representation -->
          <div class="fraction-bar-preview">
            <div class="bar-labels">
              <span>0</span>
              <span>½</span>
              <span>1</span>
            </div>
            <div class="fraction-bar-outer">
              <div class="fraction-bar-inner" id="frac-progress-fill" style="width: 100%;"></div>
            </div>
          </div>

          <!-- Interactive Tip -->
          <div class="frac-pro-tip">
            <span>🍕</span>
            <p>${isRu ? 'Подсказка: нажимайте на любые кусочки пиццы прямо на тарелке, чтобы съесть их или вернуть!' : 'Maslahat: likopchadagi xohlagan pitsa bo‘lagiga bosing, uni yeyishingiz yoki qaytarishingiz mumkin!'}</p>
          </div>
        </div>
      </div>
    `;

    this.renderPizza();
    this.updateStats();
    this.renderChallengeUI();
  }

  bindEvents() {}
}

window.fractionSandbox = new FractionPizzaSandbox();
