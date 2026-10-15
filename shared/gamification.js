/**
 * KiddoLingo, MathKids & PhysicsKids
 * Unified Shared Gamification Hub
 * Levels, XP, Star Store, Daily Streaks, and Parent Dashboard
 */

const KIDDO_LEVELS = [
  { level: 1, titleUz: 'Boshlang‘ich Sayyoh', titleRu: 'Юный Исследователь', titleEn: 'Beginner Explorer', icon: '🌱', xpNeeded: 0 },
  { level: 2, titleUz: 'Izlanuvchan Bilimdon', titleRu: 'Любознательный Ученик', titleEn: 'Curious Learner', icon: '⭐', xpNeeded: 100 },
  { level: 3, titleUz: 'Matematika Sehrgari', titleRu: 'Мастер Математики', titleEn: 'Math Wizard', icon: '🧙‍♂️', xpNeeded: 250 },
  { level: 4, titleUz: 'Yulduzli Sayyoh', titleRu: 'Звёздный Путешественник', titleEn: 'Star Explorer', icon: '🚀', xpNeeded: 500 },
  { level: 5, titleUz: 'Koinot Olimi', titleRu: 'Космический Учёный', titleEn: 'Space Scientist', icon: '🔭', xpNeeded: 850 },
  { level: 6, titleUz: 'Galaktika Dahosi', titleRu: 'Галактический Гений', titleEn: 'Galactic Genius', icon: '👑', xpNeeded: 1300 }
];

const STORE_ITEMS = [
  // Hats
  { id: 'hat_party', category: 'hat', nameUz: 'Bayram Qalpog‘i', nameRu: 'Праздничный Колпак', emoji: '🎉', price: 0 }, // Free starter!
  { id: 'hat_wizard', category: 'hat', nameUz: 'Sehrgar Qalpog‘i', nameRu: 'Шляпа Волшебника', emoji: '🎩', price: 10 },
  { id: 'hat_cowboy', category: 'hat', nameUz: 'Kovboy Shlyapasi', nameRu: 'Ковбойская Шляпа', emoji: '🤠', price: 15 },
  { id: 'hat_grad', category: 'hat', nameUz: 'Akademik Qalpoq', nameRu: 'Шапка Профессора', emoji: '🎓', price: 20 },
  { id: 'hat_crown', category: 'hat', nameUz: 'Qirollik Toji', nameRu: 'Королевская Корона', emoji: '👑', price: 25 },
  { id: 'hat_space', category: 'hat', nameUz: 'Kosmik Shlem', nameRu: 'Космический Шлем', emoji: '⛑️', price: 30 },
  // Pro Exclusive Hat
  { id: 'hat_astro_gold', category: 'hat', nameUz: 'Oltin Kosmik Toj', nameRu: 'Золотой Шлем Космонавта', emoji: '🌟', price: 0, isProOnly: true },

  // Accessories
  { id: 'acc_glasses', category: 'acc', nameUz: 'Kruytoy Ko‘zoynak', nameRu: 'Крутые Очки', emoji: '🕶️', price: 10 },
  { id: 'acc_bowtie', category: 'acc', nameUz: 'Qizil Kapalak', nameRu: 'Красная Бабочка', emoji: '🎀', price: 12 },
  { id: 'acc_goggles', category: 'acc', nameUz: 'Laboratoriya Ko‘zoynagi', nameRu: 'Защитные Очки', emoji: '🥽', price: 18 },
  { id: 'acc_mask', category: 'acc', nameUz: 'Superqahramon Niqobi', nameRu: 'Маска Героя', emoji: '🎭', price: 22 },
  // Pro Exclusive Accessory
  { id: 'acc_cyber_visor', category: 'acc', nameUz: 'Kiber Neon Visor', nameRu: 'Неоновый Кибер-Визор', emoji: '🥽', price: 0, isProOnly: true },

  // Outfits
  { id: 'outfit_medal', category: 'outfit', nameUz: 'Oltin Medal', nameRu: 'Золотая Медаль', emoji: '🥇', price: 15 },
  { id: 'outfit_cape', category: 'outfit', nameUz: 'Qahramon Yoping‘ichi', nameRu: 'Плащ Супергероя', emoji: '🧣', price: 25 },
  { id: 'outfit_jetpack', category: 'outfit', nameUz: 'Reaktiv Ryukzak', nameRu: 'Реактивный Ранец', emoji: '🎒', price: 35 },
  // Pro Exclusive Outfits
  { id: 'outfit_dragon_cape', category: 'outfit', nameUz: 'Qirollik Ajdaho Mantiyasi', nameRu: 'Королевский Плащ Дракона', emoji: '🐉', price: 0, isProOnly: true },
  { id: 'outfit_galaxy_suit', category: 'outfit', nameUz: 'Galaktika Skafandri', nameRu: 'Галактический Скафандр', emoji: '👨‍🚀', price: 0, isProOnly: true }
];

class GamificationHub {
  constructor() {
    this.xp = parseInt(localStorage.getItem('kiddo_xp') || '45', 10);
    this.stars = parseInt(localStorage.getItem('kiddo_stars') || '25', 10);
    this.gems = parseInt(localStorage.getItem('kiddo_gems') || '5', 10);
    this.streak = parseInt(localStorage.getItem('kiddo_streak') || '1', 10);
    this.inventory = JSON.parse(localStorage.getItem('kiddo_inventory') || '["hat_party"]');
    this.equipped = JSON.parse(localStorage.getItem('kiddo_equipped') || '{"hat":"hat_party","acc":null,"outfit":null}');
    this.parentStats = JSON.parse(localStorage.getItem('kiddo_parent_stats') || JSON.stringify({
      secondsLearned: 420,
      wordsMastered: 8,
      mathSolved: 12,
      physicsExplored: 5,
      totalQuizzes: 18,
      correctQuizzes: 16,
      date: new Date().toISOString().split('T')[0]
    }));

    this.activeStoreTab = 'all';
    this.parentGateAnswer = null;

    this.checkDailyStreak();
    this.startSessionTimer();
  }

  getLang() {
    return localStorage.getItem('kiddo_language') || 'uz';
  }

  save() {
    localStorage.setItem('kiddo_xp', this.xp);
    localStorage.setItem('kiddo_stars', this.stars);
    localStorage.setItem('kiddo_gems', this.gems);
    localStorage.setItem('kiddo_streak', this.streak);
    localStorage.setItem('kiddo_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('kiddo_equipped', JSON.stringify(this.equipped));
    localStorage.setItem('kiddo_parent_stats', JSON.stringify(this.parentStats));
    this.updateAllUI();
  }

  getCurrentLevel() {
    let current = KIDDO_LEVELS[0];
    for (let i = KIDDO_LEVELS.length - 1; i >= 0; i--) {
      if (this.xp >= KIDDO_LEVELS[i].xpNeeded) {
        current = KIDDO_LEVELS[i];
        break;
      }
    }
    return current;
  }

  getNextLevel() {
    const current = this.getCurrentLevel();
    const nextIdx = KIDDO_LEVELS.findIndex(l => l.level === current.level) + 1;
    return nextIdx < KIDDO_LEVELS.length ? KIDDO_LEVELS[nextIdx] : null;
  }

  addXP(amount, reason = '') {
    const oldLevel = this.getCurrentLevel();
    this.xp += amount;
    const newLevel = this.getCurrentLevel();

    if (newLevel.level > oldLevel.level) {
      this.triggerLevelUpCelebration(newLevel);
    } else {
      this.showXPToast(`+${amount} XP ${reason}`);
    }
    this.save();
  }

  addStars(amount) {
    this.stars += amount;
    this.save();
    if (window.soundEngine && typeof window.soundEngine.playCoin === 'function') {
      window.soundEngine.playCoin();
    }
  }

  addGems(amount) {
    this.gems += amount;
    this.save();
  }

  spendStars(amount) {
    if (this.stars >= amount) {
      this.stars -= amount;
      this.save();
      return true;
    }
    return false;
  }

  checkDailyStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('kiddo_last_visit_date');

    if (!lastDate) {
      this.streak = 1;
      localStorage.setItem('kiddo_last_visit_date', today);
    } else if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        this.streak += 1;
        this.addStars(5); // Daily streak reward!
        this.showXPToast(this.getLang() === 'ru' ? '🔥 Ежедневная серия продлена! +5 ⭐' : '🔥 Kunlik seriya davom etdi! +5 ⭐');
      } else {
        this.streak = 1; // reset streak if missed
      }
      localStorage.setItem('kiddo_last_visit_date', today);
    }
  }

  startSessionTimer() {
    setInterval(() => {
      this.parentStats.secondsLearned += 1;
      if (this.parentStats.secondsLearned % 30 === 0) {
        localStorage.setItem('kiddo_parent_stats', JSON.stringify(this.parentStats));
      }
    }, 1000);
  }

  recordActivity(type, isCorrect = true) {
    this.parentStats.totalQuizzes += 1;
    if (isCorrect) this.parentStats.correctQuizzes += 1;

    if (type === 'word') this.parentStats.wordsMastered += 1;
    if (type === 'math') this.parentStats.mathSolved += 1;
    if (type === 'physics') this.parentStats.physicsExplored += 1;

    this.save();
  }

  showXPToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'kiddo-toast bounce-in';
    toast.style.background = 'linear-gradient(135deg, #10B981, #059669)';
    toast.style.color = '#FFFFFF';
    toast.innerHTML = `<span class="toast-icon">✨</span> <span><strong>${msg}</strong></span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2400);
  }

  triggerLevelUpCelebration(newLevel) {
    if (window.confettiEngine) window.confettiEngine.launch(80, 0.5, 0.4);
    if (window.soundEngine && typeof window.soundEngine.playSuccess === 'function') {
      window.soundEngine.playSuccess();
    }

    const isRu = this.getLang() === 'ru';
    const title = isRu ? newLevel.titleRu : newLevel.titleUz;
    const modal = document.createElement('div');
    modal.className = 'kiddo-modal-backdrop open';
    modal.innerHTML = `
      <div class="kiddo-modal-window level-up-window bounce-in">
        <div class="level-up-crown">${newLevel.icon} 👑</div>
        <h2 class="level-up-title">${isRu ? 'НОВЫЙ УРОВЕНЬ!' : 'YANGI DARAJA!'}</h2>
        <p class="level-up-desc">${isRu ? `Поздравляем! Ты достиг уровня ${newLevel.level}: <strong>${title}</strong>!` : `Tabriklaymiz! Siz ${newLevel.level}-darajaga erishdingiz: <strong>${title}</strong>!`}</p>
        <button class="level-up-btn" onclick="this.closest('.kiddo-modal-backdrop').remove()">
          ${isRu ? 'Ура, продолжить! 🚀' : 'Olg‘a, davom etamiz! 🚀'}
        </button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  updateAllUI() {
    const curLevel = this.getCurrentLevel();
    const nextLevel = this.getNextLevel();
    const isRu = this.getLang() === 'ru';
    const levelTitle = isRu ? curLevel.titleRu : curLevel.titleUz;

    // Update level text & icon
    const lvlNameEl = document.getElementById('hud-level-name');
    const lvlIconEl = document.getElementById('hud-level-icon');
    const lvlProgressEl = document.getElementById('hud-level-progress');

    if (lvlNameEl) lvlNameEl.textContent = `Lvl ${curLevel.level}: ${levelTitle}`;
    if (lvlIconEl) lvlIconEl.textContent = curLevel.icon;
    if (lvlProgressEl && nextLevel) {
      const curBase = curLevel.xpNeeded;
      const nextTarget = nextLevel.xpNeeded;
      const pct = Math.min(100, Math.max(0, ((this.xp - curBase) / (nextTarget - curBase)) * 100));
      lvlProgressEl.style.width = `${pct}%`;
    }

    // Update Stars & Streak counts across all matching elements
    document.querySelectorAll('#stat-stars-count').forEach(el => el.textContent = this.stars);
    document.querySelectorAll('#stat-gems-count').forEach(el => el.textContent = this.gems);
    document.querySelectorAll('#stat-streak-count').forEach(el => {
      el.textContent = isRu ? `${this.streak} дн.` : `${this.streak} kun`;
    });

    // Notify Mascot Companion if present
    if (window.mascotCompanion) {
      window.mascotCompanion.updateEquippedDisplay();
    }
  }

  // --- STAR STORE ---
  openStoreModal() {
    let modal = document.getElementById('kiddo-store-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kiddo-store-modal';
      modal.className = 'kiddo-modal-backdrop';
      document.body.appendChild(modal);
    }
    this.renderStoreUI();
    modal.classList.add('open');
  }

  closeStoreModal() {
    const modal = document.getElementById('kiddo-store-modal');
    if (modal) modal.classList.remove('open');
  }

  setStoreCategory(cat) {
    this.activeStoreTab = cat;
    this.renderStoreUI();
  }

  buyStoreItem(itemId) {
    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

    if (item.isProOnly && !isPro) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openPricingModal();
      } else {
        alert('Bu qahramon libosi faqat Pro a‘zolar uchun ochiq!');
      }
      return;
    }

    if (this.inventory.includes(itemId) || (item.isProOnly && isPro)) {
      this.equipStoreItem(itemId);
      return;
    }

    if (this.spendStars(item.price)) {
      this.inventory.push(itemId);
      this.equipStoreItem(itemId);
      if (window.soundEngine && typeof window.soundEngine.playSparkle === 'function') {
        window.soundEngine.playSparkle();
      }
      this.renderStoreUI();
    } else {
      alert(this.getLang() === 'ru' ? 'Вам не хватает звёздочек! Решайте задачи, чтобы заработать ⭐!' : 'Yulduzchalaringiz yetarli emas! Misol va darslarni bajarib ko‘proq ⭐ to‘plang!');
    }
  }

  equipStoreItem(itemId) {
    const item = STORE_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    if (item.isProOnly && !isPro) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openPricingModal();
      }
      return;
    }

    if (this.equipped[item.category] === itemId) {
      this.equipped[item.category] = null; // Toggle unequip
    } else {
      this.equipped[item.category] = itemId;
    }
    this.save();
    this.renderStoreUI();
  }

  renderStoreUI() {
    const modal = document.getElementById('kiddo-store-modal');
    if (!modal) return;

    const isRu = this.getLang() === 'ru';
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const filteredItems = this.activeStoreTab === 'all' 
      ? STORE_ITEMS 
      : STORE_ITEMS.filter(i => i.category === this.activeStoreTab);

    modal.innerHTML = `
      <div class="kiddo-modal-window">
        <div class="modal-header-bar">
          <h2>⭐ ${isRu ? 'Магазин Звёзд & Гардероб' : 'Yulduzlar Do‘koni & Kiyimlar'}</h2>
          <button class="modal-close-round" onclick="window.gamificationHub.closeStoreModal()">✕</button>
        </div>

        <div class="modal-body-content">
          <!-- Mascot Preview Stage -->
          <div class="store-preview-stage">
            <div class="preview-mascot-box">
              <div id="store-mascot-avatar-container" class="astro-mascot-wrapper">
                <!-- Mascot with equipped items rendered dynamically -->
              </div>
              <strong style="font-size: 1.05rem;">Astro Cat 🐱🚀</strong>
            </div>

            <div class="preview-stars-balance">
              <span>⭐ ${isRu ? 'Баланс:' : 'Hisobingiz:'}</span>
              <strong>${this.stars}</strong>
            </div>
          </div>

          <!-- Category filter buttons -->
          <div class="store-category-tabs">
            <button class="store-cat-btn ${this.activeStoreTab === 'all' ? 'active' : ''}" onclick="window.gamificationHub.setStoreCategory('all')">
              ✨ ${isRu ? 'Все' : 'Barchasi'}
            </button>
            <button class="store-cat-btn ${this.activeStoreTab === 'hat' ? 'active' : ''}" onclick="window.gamificationHub.setStoreCategory('hat')">
              🎩 ${isRu ? 'Шляпы' : 'Shlyapalar'}
            </button>
            <button class="store-cat-btn ${this.activeStoreTab === 'acc' ? 'active' : ''}" onclick="window.gamificationHub.setStoreCategory('acc')">
              🕶️ ${isRu ? 'Очки & Маски' : 'Ko‘zoynaklar'}
            </button>
            <button class="store-cat-btn ${this.activeStoreTab === 'outfit' ? 'active' : ''}" onclick="window.gamificationHub.setStoreCategory('outfit')">
              🚀 ${isRu ? 'Костюмы' : 'Kiyimlar'}
            </button>
          </div>

          <!-- Items Grid -->
          <div class="store-items-grid">
            ${filteredItems.map(item => {
              const owned = this.inventory.includes(item.id) || (item.isProOnly && isPro);
              const isEquipped = this.equipped[item.category] === item.id;
              const name = isRu ? item.nameRu : item.nameUz;

              return `
                <div class="store-card ${item.isProOnly ? 'store-card-pro-exclusive' : ''}" style="${item.isProOnly ? 'border: 2px solid #F59E0B; background: #FFFDF7;' : ''}">
                  ${item.isProOnly ? `<span style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFF; font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 999px; margin-bottom: 4px;">👑 PRO EXCLUSIVE</span>` : ''}
                  <div class="store-card-icon">${item.emoji}</div>
                  <span class="store-card-name">${name}</span>
                  <span class="store-card-price">
                    ${owned ? (isRu ? '✅ Доступно' : '✅ Ochiq') : (item.isProOnly ? (isRu ? '👑 Pro Подписка' : '👑 Pro Obuna') : `⭐ ${item.price}`)}
                  </span>
                  
                  ${owned ? `
                    <button class="store-card-btn ${isEquipped ? 'btn-equipped' : 'btn-equip'}" onclick="window.gamificationHub.equipStoreItem('${item.id}')">
                      ${isEquipped ? (isRu ? 'Снять ✖️' : 'Yechish ✖️') : (isRu ? 'Надеть ✨' : 'Kiyish ✨')}
                    </button>
                  ` : (item.isProOnly ? `
                    <button class="store-card-btn" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: #FFF;" onclick="window.subscriptionManager.openPricingModal()">
                      👑 ${isRu ? 'Открыть в Pro' : 'Pro da Ochish'}
                    </button>
                  ` : `
                    <button class="store-card-btn btn-buy" onclick="window.gamificationHub.buyStoreItem('${item.id}')">
                      ${isRu ? 'Купить 🛒' : 'Sotib olish 🛒'}
                    </button>
                  `)}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    // Render preview mascot inside store
    const previewContainer = document.getElementById('store-mascot-avatar-container');
    if (previewContainer && window.mascotCompanion) {
      previewContainer.innerHTML = window.mascotCompanion.getMascotHTML();
    }
  }

  // --- PARENT DASHBOARD ---
  openParentDashboard() {
    let modal = document.getElementById('kiddo-parent-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'kiddo-parent-modal';
      modal.className = 'kiddo-modal-backdrop';
      document.body.appendChild(modal);
    }

    // Generate random parental gate equation (e.g. 7 * 6 = ?)
    const n1 = Math.floor(Math.random() * 5) + 4;
    const n2 = Math.floor(Math.random() * 6) + 3;
    this.parentGateAnswer = n1 * n2;

    const isRu = this.getLang() === 'ru';
    modal.innerHTML = `
      <div class="kiddo-modal-window" style="max-width: 580px;">
        <div class="modal-header-bar">
          <h2>👨‍👩‍👧 ${isRu ? 'Панель для Родителей' : 'Ota-onalar Paneli'}</h2>
          <button class="modal-close-round" onclick="window.gamificationHub.closeParentDashboard()">✕</button>
        </div>

        <div class="modal-body-content" id="parent-modal-body">
          <div class="parent-gate-card">
            <h3>🔒 ${isRu ? 'Родительский контроль' : 'Ota-onalar tekshiruvi'}</h3>
            <p>${isRu ? 'Пожалуйста, решите математический пример для доступа к статистике обучения:' : 'Iltimos, statistika paneliga kirish uchun quyidagi misolni yeching:'}</p>
            
            <div class="gate-math-box">
              <span>${n1} × ${n2} = </span>
              <input type="number" id="parent-gate-input" class="gate-answer-input" placeholder="?">
            </div>
            
            <div>
              <button class="btn btn-primary" onclick="window.gamificationHub.verifyParentGate()">
                ${isRu ? 'Открыть панель ➜' : 'Panelni ochish ➜'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.add('open');
  }

  closeParentDashboard() {
    const modal = document.getElementById('kiddo-parent-modal');
    if (modal) modal.classList.remove('open');
  }

  verifyParentGate() {
    const input = document.getElementById('parent-gate-input');
    if (!input) return;

    if (parseInt(input.value, 10) === this.parentGateAnswer) {
      this.renderParentStatsUI();
    } else {
      input.style.borderColor = '#EF4444';
      input.classList.add('shake-anim');
      setTimeout(() => input.classList.remove('shake-anim'), 500);
    }
  }

  renderParentStatsUI() {
    const body = document.getElementById('parent-modal-body');
    if (!body) return;

    const isRu = this.getLang() === 'ru';
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const minutes = Math.floor(this.parentStats.secondsLearned / 60);
    const accuracy = this.parentStats.totalQuizzes > 0 
      ? Math.round((this.parentStats.correctQuizzes / this.parentStats.totalQuizzes) * 100) 
      : 100;
    const curLevel = this.getCurrentLevel();
    const lvlTitle = isRu ? curLevel.titleRu : curLevel.titleUz;

    body.innerHTML = `
      <div class="parent-dashboard-content">
        <!-- User Subscription Status Header -->
        <div style="background: ${isPro ? '#FFFBEB' : '#F1F5F9'}; border: 2px solid ${isPro ? '#F59E0B' : '#CBD5E1'}; border-radius: 18px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap: 10px;">
          <div>
            <span style="font-size: 0.82rem; font-weight: 800; color: #64748B; text-transform: uppercase;">${isRu ? 'Текущая подписка' : 'Amaldagi Obuna'}:</span>
            <div style="font-size: 1.15rem; font-weight: 800; color: ${isPro ? '#B45309' : '#1E293B'};">
              ${isPro ? '👑 Pro Plan ($15/oy) • Cheksiz Kirish' : '🆓 Bepul Rejim (Kunlik limitlar faol)'}
            </div>
          </div>
          <button class="btn btn-ctrl" onclick="window.subscriptionManager.openPricingModal()" style="background: ${isPro ? '#FEF3C7' : '#2563EB'}; color: ${isPro ? '#78350F' : '#FFF'}; font-weight: 800; border-radius: 999px;">
            ${isPro ? '⚙️ Obunani boshqarish' : '👑 Pro ga O‘tish 🚀'}
          </button>
        </div>

        <div class="parent-stats-grid">
          <div class="parent-stat-box">
            <div class="parent-stat-icon" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B;">⏱️</div>
            <div>
              <div class="stat-box-val">${minutes} ${isRu ? 'мин' : 'daq'}</div>
              <div class="stat-box-lbl">${isRu ? 'Время за сегодня' : 'Bugungi o‘qish vaqti'}</div>
            </div>
          </div>

          <div class="parent-stat-box">
            <div class="parent-stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10B981;">🎯</div>
            <div>
              <div class="stat-box-val">${accuracy}%</div>
              <div class="stat-box-lbl">${isRu ? 'Точность ответов' : 'Umumiy aniqlik'}</div>
            </div>
          </div>

          <div class="parent-stat-box">
            <div class="parent-stat-icon" style="background: rgba(59, 130, 246, 0.15); color: #3B82F6;">📚</div>
            <div>
              <div class="stat-box-val">${this.parentStats.wordsMastered}</div>
              <div class="stat-box-lbl">${isRu ? 'Английских слов' : 'Inglizcha so‘zlar'}</div>
            </div>
          </div>

          <div class="parent-stat-box">
            <div class="parent-stat-icon" style="background: rgba(234, 88, 12, 0.15); color: #EA580C;">🧮</div>
            <div>
              <div class="stat-box-val">${this.parentStats.mathSolved}</div>
              <div class="stat-box-lbl">${isRu ? 'Примеров решено' : 'Matematik misollar'}</div>
            </div>
          </div>
        </div>

        ${isPro ? `
          <!-- PRO DEEP ANALYTICS: SUBJECT MASTERY & LEARNING BOTTLENECKS -->
          <div style="background: #FFFFFF; border: 2px solid #2563EB; border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 18px rgba(37, 99, 235, 0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #1E293B; margin: 0;">
                📊 ${isRu ? 'Глубокая аналитика успеваемости (Pro)' : 'Fanlar Bo‘yicha Chuqur Tahlil (Pro)'}
              </h4>
              <span style="background: #DBEAFE; color: #1E40AF; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">
                AI MONITORING
              </span>
            </div>

            <!-- Subject Mastery Progress -->
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 4px;">
                  <span>🦁 KiddoLingo (Ingliz tili):</span>
                  <span style="color: #FF5E7E;">88% O‘zlashtirish</span>
                </div>
                <div style="height: 10px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
                  <div style="width: 88%; height: 100%; background: linear-gradient(90deg, #FF5E7E, #FF2A55); border-radius: 999px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 4px;">
                  <span>🚀 MathKids (Matematika):</span>
                  <span style="color: #2563EB;">74% O‘zlashtirish</span>
                </div>
                <div style="height: 10px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
                  <div style="width: 74%; height: 100%; background: linear-gradient(90deg, #2563EB, #1D4ED8); border-radius: 999px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 4px;">
                  <span>⚛️ PhysicsKids (Fizika):</span>
                  <span style="color: #8B5CF6;">92% O‘zlashtirish</span>
                </div>
                <div style="height: 10px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
                  <div style="width: 92%; height: 100%; background: linear-gradient(90deg, #8B5CF6, #7C3AED); border-radius: 999px;"></div>
                </div>
              </div>
            </div>

            <!-- AI-Identified Learning Bottlenecks -->
            <div style="background: #FFFBEB; border: 1.5px solid #FDE68A; border-radius: 16px; padding: 14px 16px; margin-bottom: 16px;">
              <h5 style="color: #92400E; font-size: 0.95rem; font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <span>⚠️</span> <span>${isRu ? 'Узкие места и пробелы в обучении (Bottlenecks)' : 'Aniqlangan Ta‘limiy Qiyinchiliklar (Bottlenecks)'}:</span>
              </h5>
              <ul style="margin: 0; padding-left: 20px; font-size: 0.86rem; color: #78350F; line-height: 1.5;">
                <li><strong>Matematika:</strong> 7 va 8 karra jadvali bo‘yicha testlarda 3 marta ikkilanish kuzatildi. Ertaga 7x8 va 8x9 amallarini birgalikda takrorlash foydali!</li>
                <li><strong>Ingliz tili:</strong> <em>An</em> artikli unli tovushlar (apple, elephant) oldidan kelishi qoidasi bo‘yicha mashqlarni ko‘proq bajarish tavsiya etiladi.</li>
              </ul>
            </div>

            <!-- Certificate Button in Parent Mode -->
            <div style="display: flex; justify-content: flex-end;">
              <button class="btn btn-primary" onclick="window.subscriptionManager.openCertificateModal()" style="background: #10B981; padding: 10px 20px; border-radius: 999px; font-weight: 800;">
                📜 Rasmiy Yutuq Sertifikatini Ko‘rish / Yuklash
              </button>
            </div>
          </div>
        ` : `
          <!-- PRO TEASER FOR FREE USERS -->
          <div style="background: linear-gradient(135deg, #EFF6FF, #F5F3FF); border: 2px dashed #93C5FD; border-radius: 20px; padding: 20px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 6px;">🔒 👑</div>
            <h4 style="font-size: 1.15rem; font-weight: 800; color: #1E293B; margin-bottom: 6px;">
              ${isRu ? 'Подробная аналитика и узкие места обучения (Pro)' : 'Chuqur Tahlil & O‘rganish Qiyinchiliklari (Pro)'}
            </h4>
            <p style="color: #64748B; font-size: 0.9rem; max-width: 520px; margin: 0 auto 16px; line-height: 1.45;">
              ${isRu 
                ? 'Узнайте сильные и слабые стороны вашего ребёнка, получайте персональные рекомендации ИИ и скачивайте официальный диплом об успехах!' 
                : 'Farzandingiz qaysi mavzularda qiyinchilikka uchrayotgani (bottlenecks), fanlar bo‘yicha aniq foizlar va maxsus tavsiyalar Pro a‘zolikda taqdim etiladi!'}
            </p>
            <button class="btn-upgrade-pro" onclick="window.subscriptionManager.openPricingModal()" style="padding: 10px 26px;">
              👑 Pro Rejimga O‘tish ($15/oy) 🚀
            </button>
          </div>
        `}

        <!-- Pedagogical Insights -->
        <div class="parent-tips-card">
          <h4>💡 ${isRu ? 'Педагогическая подсказка' : 'Pedagogik tavsiya'}:</h4>
          <p>
            ${isRu 
              ? `Ваш ребёнок успешно учится! Текущий ранг: <strong>${lvlTitle}</strong> (${this.xp} XP). Регулярные 15-20 минут в день дают максимальный развивающий эффект.` 
              : `Farzandingiz ajoyib natija ko‘rsatmoqda! Hozirgi unvon: <strong>${lvlTitle}</strong> (${this.xp} XP). Har kuni 15-20 daqiqa o‘ynab o‘rganish eng yuqori samarani beradi.`}
          </p>
        </div>

        <div class="parent-actions-row">
          <button class="btn btn-ctrl" style="color: #EF4444;" onclick="if(confirm('${isRu ? 'Сбросить весь прогресс?' : 'Barcha natijalarni tozalashni xohlaysizmi?'}')) { localStorage.clear(); location.reload(); }">
            🗑️ ${isRu ? 'Сбросить прогресс' : 'Natijalarni qayta boshlash'}
          </button>
          
          <button class="btn btn-primary" onclick="window.gamificationHub.closeParentDashboard()">
            ${isRu ? 'Закрыть' : 'Yopish'}
          </button>
        </div>
      </div>
    `;
  }
}

window.gamificationHub = new GamificationHub();

// Inject Level pill & Store button into page headers automatically
document.addEventListener('DOMContentLoaded', () => {
  const headerInner = document.querySelector('.header-inner') || document.querySelector('.app-header .header-inner');
  if (headerInner) {
    // Check if level pill already exists
    if (!document.getElementById('hud-level-pill')) {
      const curLevel = window.gamificationHub.getCurrentLevel();
      const isRu = window.gamificationHub.getLang() === 'ru';
      const levelTitle = isRu ? curLevel.titleRu : curLevel.titleUz;

      const levelPill = document.createElement('div');
      levelPill.id = 'hud-level-pill';
      levelPill.className = 'header-level-pill';
      levelPill.title = isRu ? 'Ваш уровень и опыт (Нажмите)' : 'Darajangiz va tajribangiz (Bosing)';
      levelPill.onclick = () => window.gamificationHub.openStoreModal();
      levelPill.innerHTML = `
        <span class="level-icon-badge" id="hud-level-icon">${curLevel.icon}</span>
        <div class="level-info-text">
          <span class="level-title-tag">LEVEL</span>
          <span class="level-number-name" id="hud-level-name">Lvl ${curLevel.level}: ${levelTitle}</span>
          <div class="xp-bar-wrap">
            <div class="xp-bar-fill" id="hud-level-progress" style="width: 30%;"></div>
          </div>
        </div>
      `;

      // Insert right after brand-logo or brand-link
      const brandEl = headerInner.querySelector('.brand-logo') || headerInner.querySelector('.brand-link');
      if (brandEl && brandEl.nextSibling) {
        headerInner.insertBefore(levelPill, brandEl.nextSibling);
      }
    }

    // Add Star Store and Parent button into controls if not present
    const controls = headerInner.querySelector('.header-controls') || headerInner.querySelector('.header-actions');
    if (controls) {
      if (!document.getElementById('btn-header-store')) {
        const storeBtn = document.createElement('button');
        storeBtn.id = 'btn-header-store';
        storeBtn.className = 'btn-ctrl btn-star-store';
        storeBtn.title = 'Yulduzlar Do‘koni / Магазин Звёзд';
        storeBtn.innerHTML = `<span>⭐</span> <span>Do‘kon</span>`;
        storeBtn.onclick = () => window.gamificationHub.openStoreModal();
        controls.appendChild(storeBtn);
      }

      if (!document.getElementById('btn-header-parent')) {
        const parentBtn = document.createElement('button');
        parentBtn.id = 'btn-header-parent';
        parentBtn.className = 'btn-ctrl btn-parent-mode';
        parentBtn.title = 'Ota-onalar paneli / Для родителей';
        parentBtn.innerHTML = `<span>👨‍👩‍👧</span>`;
        parentBtn.onclick = () => window.gamificationHub.openParentDashboard();
        controls.appendChild(parentBtn);
      }
    }
  }

  window.gamificationHub.updateAllUI();

  // Silky smooth transitions when switching subjects/worlds
  document.querySelectorAll('a.subject-nav-item, a.btn-portal-back, a.portal-card, a.home-hub-btn, a[href$="index.html"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;
      
      e.preventDefault();
      document.body.classList.add('page-exit-transition');
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    });
  });
});
