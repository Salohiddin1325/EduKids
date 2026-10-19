/**
 * KiddoEducation - Universal Level Progression & Candy Crush / Duolingo Style World Map
 * Supports 50+ Progressive Levels per Subject:
 *   - Tier 1: Levels 1–10  (Starter / Beginner - Easy 🟢)
 *   - Tier 2: Levels 11–25 (Explorer / Intermediate - Medium 🟡)
 *   - Tier 3: Levels 26–50+ (Master / Expert - Challenging 🔴)
 */

class LevelProgressionSystem {
  constructor() {
    this.totalLevels = 50;
    this.activeGameId = null;
    this.onSelectCallback = null;
    this.currentTierFilter = 'all'; // 'all', 'starter', 'explorer', 'master'
  }

  // --------------------------------------------------------------------------
  // LOCAL STORAGE & PROGRESSION HELPERS
  // --------------------------------------------------------------------------
  getStorageKey(gameId) {
    return `kiddo_progress_${gameId}`;
  }

  getProgressData(gameId) {
    try {
      const data = localStorage.getItem(this.getStorageKey(gameId));
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse progress data:', e);
    }
    return {
      currentLevel: 1,
      maxUnlockedLevel: 1,
      stars: {} // { "1": 3, "2": 2, ... }
    };
  }

  saveProgressData(gameId, data) {
    try {
      localStorage.setItem(this.getStorageKey(gameId), JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save progress data:', e);
    }
  }

  getCurrentLevel(gameId) {
    const data = this.getProgressData(gameId);
    return data.currentLevel || 1;
  }

  setCurrentLevel(gameId, level) {
    const data = this.getProgressData(gameId);
    data.currentLevel = Math.max(1, Math.min(this.totalLevels, level));
    this.saveProgressData(gameId, data);
  }

  getMaxUnlockedLevel(gameId) {
    const data = this.getProgressData(gameId);
    return Math.max(1, data.maxUnlockedLevel || 1);
  }

  getLevelStars(gameId, level) {
    const data = this.getProgressData(gameId);
    return (data.stars && data.stars[level]) || 0;
  }

  getTotalStars(gameId) {
    const data = this.getProgressData(gameId);
    let total = 0;
    if (data.stars) {
      Object.values(data.stars).forEach(s => {
        total += (s || 0);
      });
    }
    return total;
  }

  recordLevelCompletion(gameId, level, starsEarned = 3) {
    const data = this.getProgressData(gameId);
    if (!data.stars) data.stars = {};
    const existing = data.stars[level] || 0;
    data.stars[level] = Math.max(existing, Math.min(3, starsEarned));

    // Unlock next level
    const nextLevel = level + 1;
    if (nextLevel <= this.totalLevels) {
      data.maxUnlockedLevel = Math.max(data.maxUnlockedLevel || 1, nextLevel);
      data.currentLevel = nextLevel;
    }

    this.saveProgressData(gameId, data);

    // Track for Free Plan Daily Limit in subscriptionManager
    if (window.subscriptionManager && window.subscriptionManager.recordGameLevelPlayed) {
      window.subscriptionManager.recordGameLevelPlayed(gameId, level);
    }
  }

  // --------------------------------------------------------------------------
  // TIER METADATA & CONFIGURATION
  // --------------------------------------------------------------------------
  getTierInfo(level) {
    const lang = this.getLang();
    const isRu = lang === 'ru';

    if (level <= 10) {
      return {
        id: 'starter',
        nameUz: 'Boshlang‘ich / Starter',
        nameRu: 'Новичок / Starter',
        descUz: 'Oson va qiziqarli mashqlar',
        descRu: 'Легкие и веселые задания',
        color: '#10B981',
        accentBg: 'linear-gradient(135deg, #10B981, #059669)',
        themeEmoji: '🌱',
        badge: 'EASY'
      };
    } else if (level <= 25) {
      return {
        id: 'explorer',
        nameUz: 'Kashfiyotchi / Explorer',
        nameRu: 'Исследователь / Explorer',
        descUz: 'O‘rta qiyinlik, tezkor reaksiya',
        descRu: 'Средняя сложность, быстрота',
        color: '#F59E0B',
        accentBg: 'linear-gradient(135deg, #F59E0B, #D97706)',
        themeEmoji: '⚡',
        badge: 'MEDIUM'
      };
    } else {
      return {
        id: 'master',
        nameUz: 'Chempion / Master',
        nameRu: 'Чемпион / Master',
        descUz: 'Yuqori tezlik va chaqqonlik',
        descRu: 'Высокая скорость и мастерство',
        color: '#8B5CF6',
        accentBg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        themeEmoji: '👑',
        badge: 'HARD'
      };
    }
  }

  getLang() {
    return (window.appState && window.appState.lang) ||
      (window.mathApp && window.mathApp.lang) ||
      (window.physicsApp && window.physicsApp.lang) ||
      localStorage.getItem('kiddo_language') || 'uz';
  }

  // --------------------------------------------------------------------------
  // GAME LEVEL DIFFICULTY SCALING PARAMETERS
  // --------------------------------------------------------------------------
  getLevelConfig(gameId, level) {
    const tier = this.getTierInfo(level);
    const progressFactor = (level - 1) / 49; // 0.0 to 1.0

    return {
      level,
      tier,
      // Target score to pass level
      targetScore: Math.round(50 + progressFactor * 250),
      // Speed multiplier
      speedMultiplier: 1.0 + (progressFactor * 1.8),
      // Items or obstacles
      obstacleCount: Math.min(8, 3 + Math.floor(progressFactor * 6)),
      // Time limit in seconds (if applicable)
      timeLimitSeconds: Math.max(30, Math.round(60 - progressFactor * 20)),
      // Math equation max range
      mathMaxNum: level <= 10 ? 10 + level : (level <= 25 ? 50 + (level * 2) : 100 + (level * 2))
    };
  }

  // --------------------------------------------------------------------------
  // CAN ACCESS LEVEL CHECK (FREE VS PRO ENFORCEMENT)
  // --------------------------------------------------------------------------
  canAccessLevel(gameId, level) {
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    if (isPro) return true;

    // Free user: Level 1 is free! Level 2+ requires Pro ($2/month)
    return level === 1;
  }

  handleLevelClick(gameId, level, onSelect) {
    this.playSound('pop');

    const maxUnlocked = this.getMaxUnlockedLevel(gameId);
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

    // Check if user is trying to access a locked Pro level
    if (level > 1 && !isPro) {
      if (window.subscriptionManager) {
        window.subscriptionManager.openGamePaywallModal(gameId, level);
      }
      return;
    }

    // Check if level is locked by progression (e.g. trying to skip to level 20 before level 2)
    if (level > maxUnlocked) {
      const isRu = this.getLang() === 'ru';
      const msg = isRu 
        ? `🔒 Сначала пройдите уровень ${maxUnlocked}!` 
        : `🔒 Avval ${maxUnlocked}-bosqichni muvaffaqiyatli yakunlang!`;
      this.showToastNotice(msg);
      this.playSound('boing');
      return;
    }

    // Set active and invoke callback
    this.setCurrentLevel(gameId, level);
    if (typeof onSelect === 'function') {
      onSelect(level, this.getLevelConfig(gameId, level));
    }

    // Close modal if open
    this.closeMapModal();
  }

  // --------------------------------------------------------------------------
  // WORLD MAP RENDERING (Candy Crush / Duolingo S-Curve Path)
  // --------------------------------------------------------------------------
  renderMap(container, gameId, onSelect) {
    if (!container) return;

    this.activeGameId = gameId;
    this.onSelectCallback = onSelect;

    const lang = this.getLang();
    const isRu = lang === 'ru';
    const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
    const maxUnlocked = this.getMaxUnlockedLevel(gameId);
    const currentActiveLevel = this.getCurrentLevel(gameId);
    const totalStars = this.getTotalStars(gameId);
    const maxStarsPossible = this.totalLevels * 3;

    // Filter levels based on active tab
    const levels = [];
    for (let i = 1; i <= this.totalLevels; i++) {
      if (this.currentTierFilter === 'starter' && (i < 1 || i > 10)) continue;
      if (this.currentTierFilter === 'explorer' && (i < 11 || i > 25)) continue;
      if (this.currentTierFilter === 'master' && (i < 26 || i > 50)) continue;
      levels.push(i);
    }

    const filterAllText = isRu ? '✨ Все (1–50)' : '✨ Barchasi (1–50)';
    const filter1Text = isRu ? '🟢 1–10 Легкий' : '🟢 1–10 Oson';
    const filter2Text = isRu ? '🟡 11–25 Средний' : '🟡 11–25 O‘rta';
    const filter3Text = isRu ? '🔴 26–50 Чемпион' : '🔴 26–50 Chempion';

    const progressPercent = Math.min(100, Math.round((maxUnlocked / this.totalLevels) * 100));

    container.innerHTML = `
      <div class="world-map-wrapper">
        <!-- Progress Header Card -->
        <div class="map-progress-header">
          <div class="map-stats-row">
            <div class="map-stat-pill">
              <span class="stat-ico">🎯</span>
              <span class="stat-txt"><strong>${maxUnlocked}</strong> / ${this.totalLevels} ${isRu ? 'Уровней' : 'Bosqich'}</span>
            </div>
            <div class="map-stat-pill stars-pill">
              <span class="stat-ico">⭐</span>
              <span class="stat-txt"><strong>${totalStars}</strong> / ${maxStarsPossible}</span>
            </div>
            <div class="map-stat-pill plan-pill ${isPro ? 'pro' : 'free'}">
              <span class="stat-ico">${isPro ? '👑' : '🎁'}</span>
              <span class="stat-txt">${isPro ? 'PRO PLAN ($13/oy)' : 'FREE PLAN'}</span>
            </div>
          </div>

          <div class="map-progress-bar-wrap">
            <div class="map-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Tier Navigation Chips -->
        <div class="map-tier-tabs">
          <button class="tier-tab-btn ${this.currentTierFilter === 'all' ? 'active' : ''}" onclick="window.levelProgressionSystem.setTierFilter('all')">
            ${filterAllText}
          </button>
          <button class="tier-tab-btn ${this.currentTierFilter === 'starter' ? 'active' : ''}" onclick="window.levelProgressionSystem.setTierFilter('starter')">
            ${filter1Text}
          </button>
          <button class="tier-tab-btn ${this.currentTierFilter === 'explorer' ? 'active' : ''}" onclick="window.levelProgressionSystem.setTierFilter('explorer')">
            ${filter2Text}
          </button>
          <button class="tier-tab-btn ${this.currentTierFilter === 'master' ? 'active' : ''}" onclick="window.levelProgressionSystem.setTierFilter('master')">
            ${filter3Text}
          </button>
        </div>

        <!-- S-Curve Winding Node Tree -->
        <div class="map-path-stream">
          ${levels.map((lvl, index) => {
            const stars = this.getLevelStars(gameId, lvl);
            const isCompleted = stars > 0;
            const isCurrent = lvl === currentActiveLevel;
            const tier = this.getTierInfo(lvl);
            const isAccessible = this.canAccessLevel(gameId, lvl) && lvl <= maxUnlocked;
            const isProLocked = lvl > 1 && !isPro;

            // Candy Crush horizontal zigzag wave: offsets from -60px to +60px
            const waveX = Math.round(Math.sin((lvl - 1) * 0.95) * 65);

            // Milestone chests at 10, 25, 50
            const isMilestone = lvl === 10 || lvl === 25 || lvl === 50;
            let milestoneLabel = '';
            if (lvl === 10) milestoneLabel = isRu ? '🎁 Сундук Новичка' : '🎁 Oltin Sandiq (10)';
            if (lvl === 25) milestoneLabel = isRu ? '💎 Кристальный Клад' : '💎 Olmos Sandig‘i (25)';
            if (lvl === 50) milestoneLabel = isRu ? '👑 Кубок Гранд Чемпиона' : '👑 Katta Kubok (50)';

            return `
              <div class="map-node-row" style="transform: translateX(${waveX}px);">
                <div 
                  class="level-map-node ${tier.id} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${!isAccessible ? 'locked' : ''} ${isProLocked ? 'pro-locked' : ''} ${isMilestone ? 'milestone-node' : ''}"
                  onclick="window.levelProgressionSystem.handleLevelClick('${gameId}', ${lvl}, window.levelProgressionSystem.onSelectCallback)"
                  title="${isProLocked ? '👑 Pro Plan ($13/oy)' : (isAccessible ? `Daraja ${lvl} - ${tier.nameUz}` : 'Qulflangan')}"
                >
                  <!-- Node Level Number & Badge -->
                  <div class="node-inner">
                    ${isProLocked ? `
                      <span class="node-pro-crown">👑</span>
                      <span class="node-num">${lvl}</span>
                      <span class="node-lock-tag">PRO</span>
                    ` : (isAccessible ? `
                      <span class="node-num">${lvl}</span>
                      ${isCurrent ? '<span class="current-avatar-marker">🚀</span>' : ''}
                    ` : `
                      <span class="node-lock-ico">🔒</span>
                      <span class="node-num muted">${lvl}</span>
                    `)}
                  </div>

                  <!-- Stars Rating Display -->
                  <div class="node-stars-row">
                    <span class="mini-star ${stars >= 1 ? 'filled' : ''}">★</span>
                    <span class="mini-star ${stars >= 2 ? 'filled' : ''}">★</span>
                    <span class="mini-star ${stars >= 3 ? 'filled' : ''}">★</span>
                  </div>

                  <!-- Milestone Banner -->
                  ${isMilestone ? `
                    <div class="milestone-ribbon">
                      ${milestoneLabel}
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  setTierFilter(tier) {
    this.currentTierFilter = tier;
    this.playSound('pop');
    const container = document.getElementById('world-map-modal-content') || document.getElementById('world-map-container');
    if (container && this.activeGameId) {
      this.renderMap(container, this.activeGameId, this.onSelectCallback);
    }
  }

  // --------------------------------------------------------------------------
  // MODAL WORLD MAP LAUNCHER
  // --------------------------------------------------------------------------
  openMapModal(gameId, gameTitle, onSelect) {
    this.playSound('pop');
    let modal = document.getElementById('world-map-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'world-map-modal';
      modal.className = 'world-map-modal';
      modal.innerHTML = `
        <div class="map-modal-card">
          <div class="map-modal-header">
            <div class="modal-title-wrap">
              <span class="modal-title-icon">🗺️</span>
              <div>
                <h3 id="map-modal-title">Bosqichlar Xaritasi (50+ Daraja)</h3>
                <p id="map-modal-subtitle">Har bir darajani yutib, 3 ta yulduz va kuboklarni to‘plang!</p>
              </div>
            </div>
            <button class="map-modal-close" onclick="window.levelProgressionSystem.closeMapModal()">✕</button>
          </div>
          <div class="map-modal-scroll" id="world-map-modal-content">
            <!-- Map Injected Here -->
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeMapModal();
      });
    }

    const titleEl = document.getElementById('map-modal-title');
    const subtitleEl = document.getElementById('map-modal-subtitle');
    const isRu = this.getLang() === 'ru';

    if (titleEl) {
      titleEl.textContent = isRu 
        ? `🗺️ Карта уровней: ${gameTitle || '50+ Уровней'}` 
        : `🗺️ Bosqichlar Xaritasi: ${gameTitle || '50+ Daraja'}`;
    }
    if (subtitleEl) {
      subtitleEl.textContent = isRu
        ? 'Побеждай на уровнях, собирай по 3 звезды и открывай сокровищницы!'
        : 'Har bir bosqichni yutib, 3 tadan yulduz va qimmatbaho sandiqlarni oching!';
    }

    const contentContainer = document.getElementById('world-map-modal-content');
    this.renderMap(contentContainer, gameId, onSelect);
    modal.classList.add('active');
  }

  closeMapModal() {
    const modal = document.getElementById('world-map-modal');
    if (modal) modal.classList.remove('active');
  }

  // --------------------------------------------------------------------------
  // AUDIO & TOAST UTILITIES
  // --------------------------------------------------------------------------
  playSound(type) {
    const engine = window.soundEngine || window.mathAudio || window.physicsAudio;
    if (!engine) return;

    if (type === 'pop' && engine.playPop) engine.playPop();
    else if (type === 'success' && engine.playSuccess) engine.playSuccess();
    else if (type === 'boing' && engine.playBoing) engine.playBoing();
    else if (type === 'fanfare' && engine.playFanfare) engine.playFanfare();
  }

  showToastNotice(message) {
    let toast = document.getElementById('map-toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'map-toast-notice';
      toast.className = 'map-toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 2800);
  }
}

// Global Singleton Instance
window.levelProgressionSystem = new LevelProgressionSystem();
