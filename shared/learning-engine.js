/**
 * EduKids — Spaced Repetition / Leitner Memory Engine
 * Implements cognitive review intervals for long-term retention.
 * Box 1: 1 day, Box 2: 3 days, Box 3: 7 days, Box 4: Mastered (30 days)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'kiddo_spaced_memory';

  const INTERVALS_MS = {
    1: 24 * 60 * 60 * 1000,      // 1 day
    2: 3 * 24 * 60 * 60 * 1000,  // 3 days
    3: 7 * 24 * 60 * 60 * 1000,  // 7 days
    4: 30 * 24 * 60 * 60 * 1000  // 30 days
  };

  class SpacedLearningEngine {
    constructor() {
      this.memory = this.loadMemory();
    }

    loadMemory() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch (e) {
        return {};
      }
    }

    saveMemory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.memory));
      } catch (e) {}
    }

    recordAttempt(subject, itemId, itemMeta = {}, isCorrect = true) {
      const key = `${subject}_${itemId}`;
      const now = Date.now();

      if (!this.memory[key]) {
        this.memory[key] = {
          subject,
          itemId,
          meta: itemMeta,
          box: 1,
          nextReview: now,
          attempts: 0,
          mistakes: 0,
          lastReviewed: now
        };
      }

      const item = this.memory[key];
      item.attempts += 1;
      item.lastReviewed = now;
      if (itemMeta && Object.keys(itemMeta).length) {
        item.meta = { ...item.meta, ...itemMeta };
      }

      if (isCorrect) {
        item.box = Math.min(4, item.box + 1);
        item.nextReview = now + (INTERVALS_MS[item.box] || INTERVALS_MS[1]);
      } else {
        item.mistakes += 1;
        item.box = 1;
        // Review again in 5 minutes
        item.nextReview = now + 5 * 60 * 1000;
      }

      this.saveMemory();
      window.dispatchEvent(new CustomEvent('edu:review-updated', {
        detail: { subject, count: this.getDueReviews(subject).length }
      }));
    }

    getDueReviews(subject = null) {
      const now = Date.now();
      const allItems = Object.values(this.memory);
      return allItems.filter(item => {
        if (subject && item.subject !== subject) return false;
        return item.nextReview <= now && item.box < 4;
      });
    }

    getReviewCount(subject = null) {
      return this.getDueReviews(subject).length;
    }

    clearSubject(subject) {
      Object.keys(this.memory).forEach(key => {
        if (this.memory[key].subject === subject) {
          delete this.memory[key];
        }
      });
      this.saveMemory();
    }
  }

  window.EduLearningEngine = new SpacedLearningEngine();
})();
