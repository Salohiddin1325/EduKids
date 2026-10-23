/**
 * EduKids — Multi-Child Profile Switcher & Data Backup/Restore Engine
 * Allows multiple siblings to learn independently on the same tablet/device.
 */

(function () {
  'use strict';

  const STORAGE_KEY_PROFILES = 'kiddo_profiles_list';
  const STORAGE_KEY_ACTIVE = 'kiddo_active_profile_id';

  class ProfileManager {
    constructor() {
      this.profiles = this.loadProfiles();
      this.activeId = localStorage.getItem(STORAGE_KEY_ACTIVE) || (this.profiles[0] ? this.profiles[0].id : 'child_1');
      this.modalEl = null;

      // Ensure current profile is active
      this.syncActiveToStorage();
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    loadProfiles() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}

      // Backward compatible migration from single-user storage
      const existingXp = parseInt(localStorage.getItem('kiddo_xp') || '60', 10);
      const existingStars = parseInt(localStorage.getItem('kiddo_stars') || '35', 10);
      const existingGems = parseInt(localStorage.getItem('kiddo_gems') || '8', 10);
      const existingStreak = parseInt(localStorage.getItem('kiddo_streak') || '1', 10);
      const existingAvatar = localStorage.getItem('kiddo_active_avatar') || 'avatar_cat';
      const existingInv = JSON.parse(localStorage.getItem('kiddo_inventory') || '["hat_party", "avatar_cat"]');
      const existingEq = JSON.parse(localStorage.getItem('kiddo_equipped') || '{"hat":"hat_party","acc":null,"outfit":null,"pet":null}');

      const defaultProfile = {
        id: 'child_1',
        name: 'Alixon',
        age: 6,
        avatar: existingAvatar,
        xp: existingXp,
        stars: existingStars,
        gems: existingGems,
        streak: existingStreak,
        inventory: existingInv,
        equipped: existingEq,
        createdAt: new Date().toISOString()
      };

      const initialList = [defaultProfile];
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(initialList));
      localStorage.setItem(STORAGE_KEY_ACTIVE, 'child_1');
      return initialList;
    }

    saveProfiles() {
      try {
        localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(this.profiles));
        localStorage.setItem(STORAGE_KEY_ACTIVE, this.activeId);
      } catch (e) {}
    }

    getActiveProfile() {
      let p = this.profiles.find(item => item.id === this.activeId);
      if (!p) {
        p = this.profiles[0];
        if (p) this.activeId = p.id;
      }
      return p;
    }

    syncActiveToStorage() {
      const p = this.getActiveProfile();
      if (!p) return;
      localStorage.setItem('kiddo_xp', `${p.xp}`);
      localStorage.setItem('kiddo_stars', `${p.stars}`);
      localStorage.setItem('kiddo_gems', `${p.gems}`);
      localStorage.setItem('kiddo_streak', `${p.streak}`);
      localStorage.setItem('kiddo_active_avatar', p.avatar);
      localStorage.setItem('kiddo_inventory', JSON.stringify(p.inventory));
      localStorage.setItem('kiddo_equipped', JSON.stringify(p.equipped));
    }

    syncStorageToActive() {
      const p = this.getActiveProfile();
      if (!p) return;
      p.xp = parseInt(localStorage.getItem('kiddo_xp') || `${p.xp}`, 10);
      p.stars = parseInt(localStorage.getItem('kiddo_stars') || `${p.stars}`, 10);
      p.gems = parseInt(localStorage.getItem('kiddo_gems') || `${p.gems}`, 10);
      p.streak = parseInt(localStorage.getItem('kiddo_streak') || `${p.streak}`, 10);
      p.avatar = localStorage.getItem('kiddo_active_avatar') || p.avatar;
      try {
        p.inventory = JSON.parse(localStorage.getItem('kiddo_inventory') || JSON.stringify(p.inventory));
        p.equipped = JSON.parse(localStorage.getItem('kiddo_equipped') || JSON.stringify(p.equipped));
      } catch (e) {}
      this.saveProfiles();
    }

    switchProfile(profileId) {
      this.syncStorageToActive(); // Save current progress before switching
      const target = this.profiles.find(p => p.id === profileId);
      if (!target) return;

      this.activeId = profileId;
      this.saveProfiles();
      this.syncActiveToStorage();

      // Trigger gamification UI update
      if (window.gamificationHub) {
        window.gamificationHub.xp = target.xp;
        window.gamificationHub.stars = target.stars;
        window.gamificationHub.gems = target.gems;
        window.gamificationHub.streak = target.streak;
        window.gamificationHub.activeAvatar = target.avatar;
        window.gamificationHub.inventory = target.inventory;
        window.gamificationHub.equipped = target.equipped;
        window.gamificationHub.updateAllUI();
      }

      this.updateTriggerUI();
      this.closeModal();

      if (window.kiddoAudio && typeof window.kiddoAudio.playFanfare === 'function') {
        window.kiddoAudio.playFanfare();
      }

      // Dispatch event
      window.dispatchEvent(new CustomEvent('edu:profile-switched', { detail: target }));
    }

    createProfile(name, age = 6, avatar = 'avatar_cat') {
      const trimmed = name.trim();
      if (!trimmed) return;

      const newId = `child_${Date.now()}`;
      const newProfile = {
        id: newId,
        name: trimmed,
        age: parseInt(age, 10) || 6,
        avatar: avatar || 'avatar_cat',
        xp: 10,
        stars: 15,
        gems: 5,
        streak: 1,
        inventory: ['hat_party', 'avatar_cat'],
        equipped: { hat: 'hat_party', acc: null, outfit: null, pet: null },
        createdAt: new Date().toISOString()
      };

      this.profiles.push(newProfile);
      this.saveProfiles();
      this.switchProfile(newId);
    }

    exportJSON() {
      this.syncStorageToActive();
      const exportData = {
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        profiles: this.profiles,
        activeProfileId: this.activeId,
        settings: {
          language: localStorage.getItem('kiddo_language') || 'uz',
          ageTrack: localStorage.getItem('kiddo_age_track') || 'all'
        }
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute('href', dataStr);
      dlAnchor.setAttribute('download', `EduKids_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(dlAnchor);
      dlAnchor.click();
      dlAnchor.remove();
    }

    importJSON(file) {
      const reader = new FileReader();
      const isRu = this.getLang() === 'ru';
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed && Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
            this.profiles = parsed.profiles;
            this.activeId = parsed.activeProfileId || this.profiles[0].id;
            this.saveProfiles();
            this.syncActiveToStorage();
            alert(isRu ? 'Профили успешно восстановлены!' : 'Profillar muvaffaqiyatli tiklandi!');
            location.reload();
          } else {
            alert(isRu ? 'Ошибка: Неверный формат файла.' : 'Xatolik: Noto‘g‘ri fayl formati.');
          }
        } catch (err) {
          alert(isRu ? 'Ошибка чтения файла.' : 'Faylni o‘qishda xatolik yuz berdi.');
        }
      };
      reader.readAsText(file);
    }

    openModal() {
      this.syncStorageToActive();
      this.createModalDOM();
      this.renderProfilesList();
      this.modalEl.classList.add('active');

      if (window.kiddoAudio && typeof window.kiddoAudio.playPop === 'function') {
        window.kiddoAudio.playPop();
      }
    }

    closeModal() {
      if (this.modalEl) {
        this.modalEl.classList.remove('active');
      }
    }

    renderProfilesList() {
      const isRu = this.getLang() === 'ru';
      const container = document.getElementById('profile-cards-container');
      if (!container) return;

      const avatarEmojis = {
        avatar_cat: '🐱',
        avatar_astronaut: '👨‍🚀',
        avatar_dino: '🦖',
        avatar_wizard: '🧙‍♂️',
        avatar_robot: '🤖',
        avatar_fox: '🦊',
        avatar_owl: '🦉',
        avatar_alien: '👽'
      };

      container.innerHTML = this.profiles.map(p => {
        const isActive = p.id === this.activeId ? 'active' : '';
        const emoji = avatarEmojis[p.avatar] || '🐱';
        return `
          <div class="profile-card-item ${isActive}" onclick="window.EduProfiles.switchProfile('${p.id}')">
            <div class="profile-card-avatar">${emoji}</div>
            <div class="profile-card-info">
              <h4>${p.name}</h4>
              <p>${p.age} ${isRu ? 'лет' : 'yosh'} • ⭐ ${p.stars} • ⚡ ${p.xp} XP</p>
            </div>
            ${isActive ? '<span style="margin-left:auto; font-size:1.1rem; color:#6366F1;">✔</span>' : ''}
          </div>
        `;
      }).join('');
    }

    createModalDOM() {
      if (document.getElementById('profile-switcher-modal')) {
        this.modalEl = document.getElementById('profile-switcher-modal');
        return;
      }

      const isRu = this.getLang() === 'ru';
      const overlay = document.createElement('div');
      overlay.id = 'profile-switcher-modal';
      overlay.className = 'profile-modal-overlay';
      overlay.innerHTML = `
        <div class="profile-modal-box">
          <div class="profile-modal-header">
            <div class="profile-modal-title">
              <span>👥</span>
              <span>${isRu ? 'Профили Учеников (Семья)' : 'O‘quvchi Profillari (Oila)'}</span>
            </div>
            <button type="button" class="ws-close-btn" onclick="window.EduProfiles.closeModal()">✕</button>
          </div>

          <div class="profile-list-grid" id="profile-cards-container">
            <!-- Injected -->
          </div>

          <!-- Add Child Form -->
          <div class="profile-add-form">
            <h4 style="font-size:0.95rem; font-weight:800; margin-bottom:10px; color:#475569;">
              ➕ ${isRu ? 'Добавить нового ученика:' : 'Yangi bola profilini qo‘shish:'}
            </h4>
            <div class="profile-form-inputs">
              <input type="text" id="new-profile-name" class="profile-form-input" placeholder="${isRu ? 'Имя ребенка (напр. Мадина)' : 'Bola ismi (masalan, Madina)'}" maxlength="20">
              <input type="number" id="new-profile-age" class="profile-form-input" style="max-width:80px;" placeholder="${isRu ? 'Возраст' : 'Yoshi'}" min="3" max="14" value="7">
              <button type="button" class="btn-add-profile" onclick="window.EduProfiles.onAddChildClick()">
                ${isRu ? 'Добавить' : 'Qo‘shish'}
              </button>
            </div>
          </div>

          <!-- Backup / Restore Box -->
          <div class="profile-backup-box">
            <button type="button" class="btn-backup-action" onclick="window.EduProfiles.exportJSON()">
              <span>📥</span>
              <span>${isRu ? 'Экспорт (Резервная копия)' : 'Zaxira nusxasi (Export)'}</span>
            </button>
            <label class="btn-backup-action" style="cursor:pointer; margin:0;">
              <span>📤</span>
              <span>${isRu ? 'Импорт из файла' : 'Qayta yuklash (Import)'}</span>
              <input type="file" accept=".json" style="display:none;" onchange="window.EduProfiles.importJSON(this.files[0])">
            </label>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.modalEl = overlay;
    }

    onAddChildClick() {
      const nameInput = document.getElementById('new-profile-name');
      const ageInput = document.getElementById('new-profile-age');
      if (nameInput && nameInput.value.trim()) {
        const avatars = ['avatar_cat', 'avatar_astronaut', 'avatar_dino', 'avatar_wizard', 'avatar_fox', 'avatar_owl'];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        this.createProfile(nameInput.value, ageInput ? ageInput.value : 6, randomAvatar);
        nameInput.value = '';
      }
    }

    updateTriggerUI() {
      const p = this.getActiveProfile();
      if (!p) return;
      const avatarEmojis = {
        avatar_cat: '🐱',
        avatar_astronaut: '👨‍🚀',
        avatar_dino: '🦖',
        avatar_wizard: '🧙‍♂️',
        avatar_robot: '🤖',
        avatar_fox: '🦊',
        avatar_owl: '🦉',
        avatar_alien: '👽'
      };
      const emoji = avatarEmojis[p.avatar] || '🐱';

      document.querySelectorAll('.profile-pill-trigger').forEach(trigger => {
        trigger.innerHTML = `
          <div class="profile-avatar-circle">${emoji}</div>
          <span class="profile-name-txt">${p.name} (${p.age} yosh)</span>
          <span style="font-size:0.75rem; color:#94A3B8;">▼</span>
        `;
      });
    }

    renderTriggerHTML() {
      const p = this.getActiveProfile();
      const avatarEmojis = {
        avatar_cat: '🐱',
        avatar_astronaut: '👨‍🚀',
        avatar_dino: '🦖',
        avatar_wizard: '🧙‍♂️',
        avatar_robot: '🤖',
        avatar_fox: '🦊',
        avatar_owl: '🦉',
        avatar_alien: '👽'
      };
      const emoji = p ? (avatarEmojis[p.avatar] || '🐱') : '🐱';
      const name = p ? p.name : 'Alixon';
      const age = p ? p.age : 6;

      return `
        <button type="button" class="profile-pill-trigger" onclick="window.EduProfiles.openModal()" title="Profilni almashtirish">
          <div class="profile-avatar-circle">${emoji}</div>
          <span class="profile-name-txt">${name} (${age} yosh)</span>
          <span style="font-size:0.75rem; color:#94A3B8;">▼</span>
        </button>
      `;
    }

    autoMount(mountId = 'profile-trigger-mount') {
      const el = document.getElementById(mountId);
      if (el) {
        el.innerHTML = this.renderTriggerHTML();
      }
    }
  }

  window.EduProfiles = new ProfileManager();

  document.addEventListener('DOMContentLoaded', () => {
    window.EduProfiles.autoMount();
  });
})();
