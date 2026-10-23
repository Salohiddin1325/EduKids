/**
 * EduKids — Age-Adaptive Learning Track System
 * Tracks:
 * - 'all' (Barchasi / Все возрасты)
 * - 'toddler' (3–5 yosh: Bog'cha / Малыши)
 * - 'junior' (6–8 yosh: Boshlang'ich / Начальная школа)
 * - 'senior' (9–12 yosh: Katta yosh / Старшие классы)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kiddo_age_track';

  const TRACK_DEFINITIONS = {
    all: {
      id: 'all',
      emoji: '🌟',
      titleUz: 'Barchasi',
      titleRu: 'Все возрасты',
      descUz: 'Barcha 3–12 yoshdagi mashg‘ulotlar',
      descRu: 'Все задания от 3 до 12 лет'
    },
    toddler: {
      id: 'toddler',
      emoji: '👶',
      titleUz: '3–5 Yosh (Kichkintoylar)',
      titleRu: '3–5 Лет (Малыши)',
      descUz: 'Sanash, shakllar, harflar fonikasi va yorqin ranglar',
      descRu: 'Счёт, фигуры, звуки букв и яркие картинки'
    },
    junior: {
      id: 'junior',
      emoji: '👦',
      titleUz: '6–8 Yosh (Boshlang‘ich)',
      titleRu: '6–8 Лет (Начальная)',
      descUz: 'Qo‘shish/ayirish, 100 ta so‘z, tortishish kuchi va oddiy zanjir',
      descRu: 'Сложение, вычитание, 100 слов, гравитация и цепь'
    },
    senior: {
      id: 'senior',
      emoji: '🧑',
      titleUz: '9–12 Yosh (Katta yosh)',
      titleRu: '9–12 Лет (Старшие)',
      descUz: 'Kasrlar pitsasi, karra jadvali, grammatika va prizma optikasi',
      descRu: 'Дроби, таблица умножения, грамматика и призма'
    }
  };

  class AgeTrackManager {
    constructor() {
      this.currentTrack = localStorage.getItem(STORAGE_KEY) || 'all';
      this.applyTrackToDOM(this.currentTrack);
    }

    getTrack() {
      return this.currentTrack;
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    setTrack(trackId) {
      if (!TRACK_DEFINITIONS[trackId]) trackId = 'all';
      this.currentTrack = trackId;
      localStorage.setItem(STORAGE_KEY, trackId);
      this.applyTrackToDOM(trackId);
      this.updateBarUI();

      // Trigger audio chime if available
      if (window.kiddoAudio && typeof window.kiddoAudio.playPop === 'function') {
        window.kiddoAudio.playPop();
      }

      // Dispatch event
      window.dispatchEvent(new CustomEvent('edu:age-track-changed', {
        detail: { track: trackId, definition: TRACK_DEFINITIONS[trackId] }
      }));
    }

    applyTrackToDOM(trackId) {
      if (trackId === 'all') {
        document.documentElement.removeAttribute('data-active-age');
      } else {
        document.documentElement.setAttribute('data-active-age', trackId);
      }
    }

    renderSelectorHTML() {
      const isRu = this.getLang() === 'ru';
      const label = isRu ? 'Возраст:' : 'Yosh Guruhi:';

      const buttonsHtml = Object.values(TRACK_DEFINITIONS).map(t => {
        const title = isRu ? t.titleRu : t.titleUz;
        const isActive = this.currentTrack === t.id ? 'active' : '';
        return `
          <button type="button" class="age-track-btn ${isActive}" data-track="${t.id}" onclick="window.EduAgeTracks.setTrack('${t.id}')" title="${isRu ? t.descRu : t.descUz}">
            <span>${t.emoji}</span>
            <span>${title}</span>
          </button>
        `;
      }).join('');

      return `
        <div class="age-track-selector-bar" role="group" aria-label="Yosh toifasi">
          <span class="age-track-pill-label">🎯 ${label}</span>
          ${buttonsHtml}
        </div>
      `;
    }

    updateBarUI() {
      document.querySelectorAll('.age-track-selector-bar .age-track-btn').forEach(btn => {
        const track = btn.getAttribute('data-track');
        btn.classList.toggle('active', track === this.currentTrack);
      });
    }

    autoMount(mountId = 'age-track-mount') {
      const el = document.getElementById(mountId);
      if (el) {
        el.innerHTML = this.renderSelectorHTML();
      }
    }
  }

  window.EduAgeTracks = new AgeTrackManager();

  document.addEventListener('DOMContentLoaded', () => {
    window.EduAgeTracks.autoMount();
  });
})();
