/**
 * Kiddo Academy - Subscription, Uzbekistan Local Payment Gateways & Strict Form Validation
 * Features:
 * 1. STRICT Form Validation:
 *    - Phone Number: Uzbekistan format ONLY +998 (XX) XXX-XX-XX, exactly 9 digits, auto-formats dynamically.
 *    - Expiration Date: MM/YY, MM strictly 01-12 (cannot enter 13+), auto-slashes.
 *    - CVC / CVV: strictly digits, exactly 3 digits.
 *    - Card Number: 16 digits, 4-by-4 grouping, brand detection (Uzcard, Humo, Visa, MC).
 * 2. Pro Plan Management: $2.50/month (32,000 UZS) or $1.99/month annual (25,000 UZS)
 * 3. Local Gateways: Click Pass, Payme.uz, Bank Cards (Uzcard/Humo/Visa/MC) with SMS OTP
 * 4. STRICT Hard-Earned Merit Certificate System (End-Game Reward):
 *    - Strict unlock conditions (ALL 4 REQUIRED):
 *      1. Active Pro Subscription ($2.50/mo).
 *      2. Complete ALL 50+ game levels in English, Math, and Physics.
 *      3. Master all 500 vocabulary words with 100% completion.
 *      4. Pass the Final "Master Grand Quiz" with 90%+ score.
 *    - Built-in Master Grand Quiz (20 questions testing English, Math, and Physics).
 *    - High-res Canvas export (PNG) and Print (PDF).
 */

(function () {
  'use strict';

  class SubscriptionManager {
    constructor() {
      this.subData = this.loadSubscription();
      this.lang = localStorage.getItem('kiddo_language') || 'uz';
      this.selectedBillingCycle = 'monthly'; // 'monthly' or 'annual'
      this.selectedPaymentMethod = 'click';  // 'click', 'payme', 'card'
      this.demoCertUnlocked = localStorage.getItem('kiddo_demo_cert_override') === 'true';
      this.parentGateVerified = false;

      this.initHeaderBadge();
      this.initAds();
      this.listenStorageChanges();
    }

    // -------------------------------------------------------------
    // DATA PERSISTENCE & STATE
    // -------------------------------------------------------------
    loadSubscription() {
      const saved = localStorage.getItem('kiddo_subscription');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse subscription data', e);
        }
      }
      return {
        plan: 'free', // 'free' or 'pro'
        billingCycle: 'monthly',
        activatedAt: null,
        expiresAt: null,
        paymentMethod: null,
        transactionId: null
      };
    }

    saveSubscription() {
      localStorage.setItem('kiddo_subscription', JSON.stringify(this.subData));
      this.updateUI();
      window.dispatchEvent(new CustomEvent('kiddo_subscription_updated', { detail: this.subData }));
    }

    isPro() {
      return this.subData && this.subData.plan === 'pro';
    }

    getPlan() {
      return this.isPro() ? 'pro' : 'free';
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    toggleDemoPlan() {
      if (this.isPro()) {
        this.subData = {
          plan: 'free',
          billingCycle: 'monthly',
          activatedAt: null,
          expiresAt: null,
          paymentMethod: null,
          transactionId: null
        };
      } else {
        const now = new Date();
        const expires = new Date();
        expires.setMonth(now.getMonth() + 1);
        this.subData = {
          plan: 'pro',
          billingCycle: 'monthly',
          activatedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
          paymentMethod: 'Uzcard (8600 •••• 9921)',
          transactionId: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000)
        };
      }
      this.saveSubscription();
      this.showToast(this.isPro() ? '👑 Pro Rejim ($2.50/oy) faollashtirildi!' : '🆓 Bepul Rejimga o‘tildi!');
      setTimeout(() => location.reload(), 700);
    }

    activatePro(paymentMethod, details = {}) {
      const now = new Date();
      const expires = new Date();
      if (this.selectedBillingCycle === 'annual') {
        expires.setFullYear(now.getFullYear() + 1);
      } else {
        expires.setMonth(now.getMonth() + 1);
      }

      const txId = 'PAY-' + Math.floor(10000000 + Math.random() * 90000000);

      this.subData = {
        plan: 'pro',
        billingCycle: this.selectedBillingCycle,
        activatedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        paymentMethod: paymentMethod,
        transactionId: txId,
        details: details
      };

      this.saveSubscription();

      if (window.kiddoAudio && typeof window.kiddoAudio.playFanfare === 'function') {
        window.kiddoAudio.playFanfare();
      }
      this.triggerConfetti();

      if (window.astroBot) {
        window.astroBot.updateLimitUI();
      }
    }

    // -------------------------------------------------------------
    // STRICT INPUT FORMATTERS & VALIDATORS
    // -------------------------------------------------------------
    /**
     * Strict Uzbekistan Phone Formatter
     * Enforces ONLY +998 (XX) XXX-XX-XX
     * Exactly 9 digits after 998
     */
    static formatUzPhone(val) {
      // Extract all digits
      let digits = (val || '').replace(/\D/g, '');
      
      // If starts with 998, strip it so we only handle the 9 payload digits
      if (digits.startsWith('998')) {
        digits = digits.slice(3);
      }

      // Restrict strictly to maximum 9 digits
      digits = digits.slice(0, 9);

      let formatted = '+998';
      if (digits.length > 0) {
        formatted += ' (' + digits.slice(0, 2);
      }
      if (digits.length >= 2) {
        formatted += ') ';
      }
      if (digits.length > 2) {
        formatted += digits.slice(2, 5);
      }
      if (digits.length >= 5) {
        formatted += '-';
      }
      if (digits.length > 5) {
        formatted += digits.slice(5, 7);
      }
      if (digits.length >= 7) {
        formatted += '-';
      }
      if (digits.length > 7) {
        formatted += digits.slice(7, 9);
      }

      const digitCount = digits.length;
      const isValid = digitCount === 9;

      return {
        formatted,
        rawDigits: digits,
        digitCount,
        isValid
      };
    }

    /**
     * Strict Expiration Date Formatter (MM/YY)
     * MM strictly 01 to 12. Cannot enter 13 or higher!
     * Auto-slashes after typing MM.
     */
    static formatCardExp(val) {
      let digits = (val || '').replace(/\D/g, '').slice(0, 4);

      if (digits.length === 0) {
        return { formatted: '', isValid: false, month: 0, year: 0 };
      }

      let mStr = '';
      let yStr = '';

      // First digit logic:
      // If user types 2-9 as the very first digit, auto-convert to 02, 03... and append slash!
      const firstDigit = parseInt(digits[0], 10);
      if (digits.length === 1) {
        if (firstDigit > 1) {
          mStr = '0' + firstDigit;
          digits = '0' + firstDigit;
        } else {
          mStr = digits[0];
        }
      } else {
        // We have at least 2 digits for month
        let monthNum = parseInt(digits.slice(0, 2), 10);
        if (monthNum > 12) {
          monthNum = 12; // Clamp strictly to 12
        } else if (monthNum === 0) {
          monthNum = 1;
        }
        mStr = monthNum < 10 ? '0' + monthNum : '' + monthNum;

        if (digits.length > 2) {
          yStr = digits.slice(2, 4);
        }
      }

      let formatted = mStr;
      if (mStr.length === 2) {
        formatted += '/' + yStr;
      }

      const isValid = mStr.length === 2 && yStr.length === 2;

      return {
        formatted,
        isValid,
        month: parseInt(mStr, 10) || 0,
        year: parseInt(yStr, 10) || 0
      };
    }

    /**
     * Strict CVC / CVV Formatter
     * Strictly digits 0-9 ONLY
     * Strictly minimum and maximum 3 digits
     */
    static formatCardCVC(val) {
      const digits = (val || '').replace(/\D/g, '').slice(0, 3);
      return {
        formatted: digits,
        isValid: digits.length === 3,
        digitCount: digits.length
      };
    }

    /**
     * Strict Card Number Formatter
     * Exactly 16 digits, 4-by-4 grouping
     */
    static formatCardNumber(val) {
      const digits = (val || '').replace(/\D/g, '').slice(0, 16);
      const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
      
      let brand = 'UZCARD';
      let brandColor = '#004B93';

      if (digits.startsWith('8600')) {
        brand = 'UZCARD';
        brandColor = '#004B93';
      } else if (digits.startsWith('9860')) {
        brand = 'HUMO';
        brandColor = '#E67E22';
      } else if (digits.startsWith('4')) {
        brand = 'VISA';
        brandColor = '#1A1F71';
      } else if (digits.startsWith('5')) {
        brand = 'MASTERCARD';
        brandColor = '#EB001B';
      }

      return {
        formatted,
        rawDigits: digits,
        isValid: digits.length === 16,
        brand,
        brandColor
      };
    }

    // -------------------------------------------------------------
    // LIMIT CHECKS FOR FREE VS PRO
    // -------------------------------------------------------------
    checkChatbotLimit() {
      if (this.isPro()) return true;

      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('astro_limit_date');
      let count = parseInt(localStorage.getItem('astro_questions_remaining') || '10', 10);

      if (savedDate !== today) {
        count = 10;
        localStorage.setItem('astro_limit_date', today);
        localStorage.setItem('astro_questions_remaining', '10');
      }

      if (count <= 0) {
        this.openChatbotPaywallModal();
        return false;
      }
      return true;
    }

    canPlayGameLevel(gameId, level = 1) {
      if (this.isPro()) return true;
      if (level <= 1) return true;
      this.openGamePaywallModal(gameId, level);
      return false;
    }

    recordGameLevelPlayed(gameId, level) {
      if (this.isPro()) return;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`kiddo_game_${gameId}_date`, today);
      localStorage.setItem(`kiddo_game_${gameId}_level`, level);
    }

    canAccessVocabularyWord(wordIndex) {
      if (this.isPro()) return true;
      if (wordIndex < 50) return true;
      return false;
    }

    canAccessMultiplicationCell(r, c) {
      if (this.isPro()) return true;
      return (r <= 5 && c <= 5);
    }

    canAccessMultiplicationQuiz() {
      if (this.isPro()) return true;
      this.openMultiplicationPaywallModal(6, 6);
      return false;
    }

    canAccessCategory(catId) {
      if (this.isPro()) return true;
      const freeCategories = ['all', 'animals', 'fruits', 'colors', 'basic-math', 'gravity'];
      if (freeCategories.includes(catId)) return true;
      this.openContentPaywallModal(catId);
      return false;
    }

    // -------------------------------------------------------------
    // PAYWALL MODALS
    // -------------------------------------------------------------
    openChatbotPaywallModal() {
      const isRu = this.getLang() === 'ru';
      const isEn = this.getLang() === 'en';

      this.showSoftPaywallModal({
        icon: '🤖',
        title: isRu ? 'Вы использовали 10/10 бесплатных вопросов на сегодня!' : 'Bugungi 10/10 ta bepul savol limitingiz tugadi!',
        desc: isRu 
          ? 'Перейдите на Pro ($2.50/мес) для 100% безлимитного общения с умным АстроБотом и решения любых задач!'
          : 'AstroBot bilan cheksiz suhbatlashish va barcha savollarga javob olish uchun Pro rejimga ($2.50/oy, 32,000 UZS) o‘ting! 🚀',
        perks: [
          '⚡ 100% Cheksiz savol-javob (Google Gemini 3.8 Flash AI)',
          '🎮 Barcha mini-o‘yinlarda 50+ darajalar cheksiz ochiq',
          '📚 500 ta to‘liq lug‘at (20+ toifalar, audio talaffuz)',
          '✖️ Karra jadvali 1×1 dan 12×12 gacha + Tezkor Poyga',
          '🚫 100% Reklamasiz toza muhit'
        ]
      });
    }

    openGamePaywallModal(gameName, levelNumber) {
      const isRu = this.getLang() === 'ru';
      this.showSoftPaywallModal({
        icon: '🎮',
        title: isRu ? `Уровень ${levelNumber} доступен в Pro версии!` : `${levelNumber}-Daraja Pro A‘zolar uchun ochiq!`,
        desc: isRu 
          ? 'В бесплатном режиме доступен 1 уровень в день. Перейдите на Pro ($2.50/мес) для 50+ уровней!'
          : 'Bepul rejimda kuniga 1 ta daraja ochiq. Barcha 50+ bosqichlarni ochish uchun Pro ga o‘ting ($2.50/oy, 32,000 UZS)!',
        perks: [
          '🚀 Barcha o‘yinlarda 50+ cheksiz darajalar va xaritalar',
          '⭐ Do‘konda Pro a‘zolar uchun maxsus liboslar',
          '📜 Rasmiy Yutuq Sertifikati (Barcha shartlar bajarilganda)',
          '👨‍👩‍👧 Ota-onalar uchun chuqur tahlil paneli'
        ]
      });
    }

    openVocabPaywallModal(word) {
      const wordTitle = word ? (word.word + ' ' + (word.emoji || '')) : '';
      this.showSoftPaywallModal({
        icon: '📚',
        title: `${wordTitle} so‘zi Pro A‘zolikda mavjud!`,
        desc: 'Bepul tarifda dastlabki 50 ta asosiy so‘z ochiq. Barcha 500 ta so‘z va 20+ mavzularni ochish uchun Pro ga o‘ting ($2.50/oy, 32,000 UZS)!',
        perks: [
          '🌟 Barcha 500 ta so‘z va 20+ qiziqarli mavzular',
          '🔊 Web Speech API jonli audio talaffuz va toshbaqa rejimi',
          '🇺🇿 O‘zbekcha va 🇷🇺 Ruscha mukammal tarjima',
          '👑 Cheksiz xotira o‘yinlari va sharlar poygasi'
        ]
      });
    }

    openMultiplicationPaywallModal(r, c) {
      this.showSoftPaywallModal({
        icon: '✖️',
        title: `Karra jadvali ${r}×${c} Pro A‘zolikda mavjud!`,
        desc: 'Bepul rejimda 1×1 dan 5×5 gacha ochiq. To‘liq 1×1 dan 12×12 gacha bo‘lgan jadvallar va 60s Tezkor Poygani ochish uchun Pro ga o‘ting ($2.50/oy, 32,000 UZS)!',
        perks: [
          '🍎 To‘liq 1×1 dan 12×12 gacha vizual mevali hisoblagich',
          '🔊 O‘zbekcha va Ruscha audio ovozli ifodalash',
          '⚡ 60 soniyalik Tezkor Poyga (Speed Drill) sinovlari',
          '🏆 Maxsus yulduzlar, XP va nishonlar'
        ]
      });
    }

    openContentPaywallModal(catName) {
      this.showSoftPaywallModal({
        icon: '🔒',
        title: 'Ushbu toifa Pro A‘zolikda mavjud! 👑',
        desc: 'Barcha mavzulardagi lug‘atlar, murakkab matematika amallari va fizika laboratoriyalarini to‘liq oching!',
        perks: [
          '🌟 500 ta to‘liq lug‘at va audio talaffuz',
          '⚛️ Fizika tajribalari va magnit labirinti',
          '📐 Qiziqarli karra jadvali va 60s poyga',
          '👑 Do‘kondagi maxsus oltin shlem va qahramon mantiyasi'
        ]
      });
    }

    showSoftPaywallModal({ icon, title, desc, perks }) {
      const existing = document.getElementById('kiddo-paywall-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'kiddo-paywall-modal';
      modal.className = 'sub-modal-backdrop open';

      const isRu = this.getLang() === 'ru';

      modal.innerHTML = `
        <div class="paywall-modal-box">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-paywall-modal').remove()">✕</button>
          
          <div class="paywall-mascot-head">${icon || '👑'}</div>
          <h3>${title}</h3>
          <p>${desc}</p>

          <div class="paywall-perks-pill-list">
            ${perks.map(p => `<div><span style="color: #10B981; font-weight: 800;">✓</span> <span>${p}</span></div>`).join('')}
          </div>

          <div class="paywall-actions">
            <button class="btn-paywall-close" onclick="document.getElementById('kiddo-paywall-modal').remove()">
              ${isRu ? 'Позже' : 'Keyinroq'}
            </button>
            <button class="btn-paywall-upgrade" onclick="document.getElementById('kiddo-paywall-modal').remove(); window.subscriptionManager.openPricingModal();">
              ${isRu ? '👑 Перейти на Pro ($2.50) 🚀' : '👑 Pro ga O‘tish ($2.50) 🚀'}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
    }

    // -------------------------------------------------------------
    // PRICING MODAL & CHECKOUT UI (Click, Payme, Cards)
    // -------------------------------------------------------------
    openPricingModal() {
      const existing = document.getElementById('kiddo-subscription-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'kiddo-subscription-modal';
      modal.className = 'sub-modal-backdrop open';

      modal.innerHTML = this.renderPricingModalHTML();
      document.body.appendChild(modal);
      this.bindPricingEvents();
    }

    renderPricingModalHTML() {
      const isPro = this.isPro();
      const isRu = this.getLang() === 'ru';
      const isAnnual = this.selectedBillingCycle === 'annual';

      // Price: $2.50/mo monthly, $1.99/mo annual
      const monthlyUSD = '2.50';
      const annualUSD = '1.99';
      const monthlyUZS = '32,000';
      const annualUZS = '25,000';

      const currentPriceUSD = isAnnual ? annualUSD : monthlyUSD;
      const currentPriceUZS = isAnnual ? annualUZS : monthlyUZS;

      return `
        <div class="sub-modal-card">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-subscription-modal').remove()">✕</button>

          <!-- Hero Header -->
          <div class="sub-modal-hero">
            <span class="sub-modal-badge">🌟 ${isRu ? 'Тарифные Планы' : 'Ta‘lim Rejalari'}</span>
            
            <div class="discount-special-badge">
              <span>🔥</span>
              <span>${isRu ? 'Специальное предложение: Pro план всего $2.50/мес!' : 'Maxsus Taklif: Pro Plan $2.50/oy (32,000 UZS) • Cheksiz Kirish!'}</span>
            </div>

            <h2>${isRu ? 'Открой Все Возможности с Pro!' : 'Cheksiz Bilim Dunyosiga Pro Bilan!'}</h2>
            <p>${isRu ? 'Безлимитный ИИ АстроБот, 500 слов, 50+ уровней игр и таблица умножения!' : 'Farzandingiz uchun eng qulay ta‘rif: cheksiz AstroBot AI, 500 ta so‘z, 50+ darajali o‘yinlar va karra jadvali!'}</p>

            <!-- Billing Cycle Switcher -->
            <div class="billing-cycle-toggle-wrap">
              <div class="billing-toggle-pill">
                <button class="billing-toggle-btn ${!isAnnual ? 'active' : ''}" id="btn-billing-monthly">
                  ${isRu ? 'Ежемесячно ($2.50/мес)' : 'Oylik ($2.50/oy)'}
                </button>
                <button class="billing-toggle-btn ${isAnnual ? 'active' : ''}" id="btn-billing-annual">
                  ${isRu ? 'На 1 Год ($1.99/мес)' : 'Yillik ($1.99/oy)'}
                  <span class="save-chip-tag">-20%</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Plans Grid Comparison -->
          <div class="sub-plans-grid">
            <!-- Free Plan Card -->
            <div class="plan-card plan-card-free">
              <div class="plan-header">
                <h3>🆓 ${isRu ? 'Бесплатный План' : 'Bepul Rejim'}</h3>
                <p class="plan-desc">${isRu ? 'Базовое ознакомление с платформой' : 'Platforma va asosiy darslar bilan tanishish'}</p>
                <div class="plan-price-wrap">
                  <span class="price-amount">$0</span>
                  <span class="price-period">/ ${isRu ? 'навсегда' : 'doimiy'}</span>
                </div>
                <div class="plan-uzs-price">0 UZS</div>
              </div>

              <ul class="plan-features-list">
                <li><span class="feat-icon-limit">🔸</span> <span><strong>10 ta savol / kun</strong> (Gemini AI AstroBot)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span><strong>1 ta daraja / kun</strong> (Barcha mini-o‘yinlarda)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span><strong>Dastlabki 50 ta so‘z</strong> (Lug‘at Hubi)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span><strong>1×1 dan 5×5 gacha</strong> karra jadvali</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span>Kunlik oddiy seriya (Streak 🔥)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span>Bolalar uchun reklama bannerlari</span></li>
                <li><span class="feat-icon-limit">✕</span> <span style="opacity: 0.6;">Sertifikat (Faqat barcha 4 shart bajarilganda)</span></li>
              </ul>

              <button class="plan-card-btn ${!isPro ? 'btn-current-plan' : 'btn-select-pro'}" onclick="window.subscriptionManager.switchToFree()">
                ${!isPro ? (isRu ? 'Текущий план' : 'Amaldagi reja') : (isRu ? 'Выбрать Бесплатный' : 'Bepulga qaytish')}
              </button>
            </div>

            <!-- Pro Plan Card -->
            <div class="plan-card plan-card-pro">
              <span class="plan-popular-ribbon">⭐ ${isRu ? 'ХИТ • РЕКОМЕНДУЕМ' : 'TAVSIYA ETILADI'}</span>
              
              <div class="plan-header">
                <h3>👑 Pro Plan (Cheksiz)</h3>
                <p class="plan-desc">${isRu ? 'Полный безлимит, ИИ-репетитор, 500 слов, все игры' : 'Cheksiz AI o‘qituvchi, 500 ta so‘z va barcha o‘yinlar'}</p>
                
                <div class="plan-price-wrap">
                  <span class="price-amount" style="color: #FF2A55;">$${currentPriceUSD}</span>
                  <span class="price-period">/ ${isRu ? 'месяц' : 'oyiga'}</span>
                </div>
                <div class="plan-uzs-price">${currentPriceUZS} UZS / oy</div>
              </div>

              <ul class="plan-features-list">
                <li><span class="feat-icon-check">✓</span> <span><strong>100% CHEKSIZ AstroBot</strong> (Google Gemini 3.8 Flash AI)</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Barcha mini-o‘yinlarda 50+ darajalar</strong> cheksiz ochiq</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>500 ta to‘liq lug‘at</strong> (20+ toifalar, jonli audio talaffuz)</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Karra jadvali 1×1 dan 12×12 gacha</strong> + Tezkor Poyga</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>100% Reklamasiz</strong> toza va xavfsiz muhit</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Maxsus liboslar</strong>: Oltin Shlem, Ajdaho Mantiyasi</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Ota-onalar chuqur tahlili</strong>: o‘sish ko‘rsatkichlari</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Sertifikat Sharti #1</strong>: Pro a‘zolik talabi qoplanadi</span></li>
              </ul>

              <button class="plan-card-btn btn-select-pro" onclick="window.subscriptionManager.openCheckoutView()">
                <span>${isPro ? '👑 Obunani Boshqarish' : '🚀 Pro Rejimga O‘tish ($' + currentPriceUSD + '/oy)'}</span>
                <span>➜</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    bindPricingEvents() {
      const btnMonthly = document.getElementById('btn-billing-monthly');
      const btnAnnual = document.getElementById('btn-billing-annual');

      if (btnMonthly) {
        btnMonthly.addEventListener('click', () => {
          this.selectedBillingCycle = 'monthly';
          this.refreshPricingModal();
        });
      }
      if (btnAnnual) {
        btnAnnual.addEventListener('click', () => {
          this.selectedBillingCycle = 'annual';
          this.refreshPricingModal();
        });
      }
    }

    refreshPricingModal() {
      const modal = document.getElementById('kiddo-subscription-modal');
      if (modal) {
        modal.innerHTML = this.renderPricingModalHTML();
        this.bindPricingEvents();
      }
    }

    switchToFree() {
      if (this.isPro()) {
        if (confirm('Rostdan ham bepul rejimga o‘tmoqchimisiz? Cheksiz AI va o‘yinlar cheklanadi.')) {
          this.toggleDemoPlan();
        }
      }
    }

    // -------------------------------------------------------------
    // PARENT GATE (Ota-onalar Darvozasi - CYBERSECURITY & SAFETY)
    // -------------------------------------------------------------
    verifyParentGate(onSuccess, context = 'checkout') {
      if (this.parentGateVerified && context !== 'reset_progress') {
        if (typeof onSuccess === 'function') onSuccess();
        return;
      }

      const existing = document.getElementById('kiddo-parent-gate-modal');
      if (existing) existing.remove();

      const isRu = this.getLang() === 'ru';

      // 2 xonali arifmetik misol (15 dan 49 gacha)
      let num1 = Math.floor(Math.random() * 30) + 18;
      let num2 = Math.floor(Math.random() * 25) + 12;
      const isAdd = Math.random() > 0.35;
      let operator = '+';
      let correctAnswer = num1 + num2;

      if (!isAdd) {
        operator = '−';
        if (num1 < num2) [num1, num2] = [num2, num1];
        correctAnswer = num1 - num2;
      }

      let attempts = 0;

      const modal = document.createElement('div');
      modal.id = 'kiddo-parent-gate-modal';
      modal.className = 'sub-modal-backdrop open';

      const titleText = isRu ? '👨‍👩‍👧 Вход для Родителей (Parent Gate)' : '👨‍👩‍👧 Ota-onalar Uchun Himoya (Parent Gate)';
      const contextDesc = context === 'reset_progress'
        ? (isRu ? 'Внимание! Для подтверждения сброса всех результатов решите этот математический пример:' : 'Diqqat! Barcha o‘yin va bilim natijalarini tozalash uchun quyidagi arifmetik misolni yeching:')
        : (isRu ? 'Xavfsiz to‘lov tizimiga o‘tish va obunani rasmiylashtirish uchun quyidagi misolni yeching:' : 'Xavfsiz to‘lov tizimiga o‘tish va obunani rasmiylashtirish uchun quyidagi misolni yeching:');

      modal.innerHTML = `
        <div class="sub-modal-card parent-gate-modal-card">
          <button class="sub-modal-close" id="btn-parent-gate-close" aria-label="Yopish">✕</button>

          <div class="parent-gate-header">
            <div class="parent-gate-icon-badge">🛡️ 👨‍👩‍👧</div>
            <h3 class="parent-gate-title">${titleText}</h3>
            <p class="parent-gate-desc">${contextDesc}</p>
          </div>

          <div class="parent-gate-body">
            <div class="parent-gate-math-badge" id="parent-gate-question">
              <span class="math-expr">${num1} ${operator} ${num2} = ?</span>
            </div>

            <form id="parent-gate-form" class="parent-gate-form-box" onsubmit="return false;">
              <div class="form-group-custom">
                <label for="parent-gate-input" class="parent-gate-label">
                  ${isRu ? 'Правильный ответ:' : 'To‘g‘ri javobni kiriting:'}
                </label>
                <div class="parent-gate-input-wrapper">
                  <input 
                    type="number" 
                    id="parent-gate-input" 
                    class="form-input-custom parent-gate-input-field" 
                    placeholder="${isRu ? 'Javob...' : 'Javob...'}" 
                    autocomplete="off" 
                    inputmode="numeric" 
                  />
                </div>
                <div id="parent-gate-error-msg" class="parent-gate-error-text" style="display: none;"></div>
              </div>

              <div class="parent-gate-actions">
                <button type="button" class="btn-parent-gate-cancel" id="btn-parent-gate-cancel">
                  ${isRu ? 'Bekor qilish' : 'Bekor qilish'}
                </button>
                <button type="submit" class="btn-parent-gate-submit" id="btn-parent-gate-submit">
                  <span>${isRu ? 'Tasdiqlash' : 'Tasdiqlash'}</span>
                  <span>➜</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const inputEl = document.getElementById('parent-gate-input');
      const errorEl = document.getElementById('parent-gate-error-msg');
      const formEl = document.getElementById('parent-gate-form');
      const closeBtn = document.getElementById('btn-parent-gate-close');
      const cancelBtn = document.getElementById('btn-parent-gate-cancel');

      if (inputEl) {
        setTimeout(() => inputEl.focus(), 150);
      }

      const closeModal = () => {
        modal.remove();
      };

      if (closeBtn) closeBtn.onclick = closeModal;
      if (cancelBtn) cancelBtn.onclick = closeModal;

      const validateAnswer = () => {
        const val = inputEl ? inputEl.value.trim() : '';
        const userVal = parseInt(val, 10);

        if (val === '' || isNaN(userVal)) {
          if (errorEl) {
            errorEl.textContent = isRu ? 'Пожалуйста, введите число!' : 'Iltimos, son kiriting!';
            errorEl.style.display = 'block';
          }
          if (inputEl) {
            inputEl.classList.add('input-error', 'shake-anim');
            setTimeout(() => inputEl.classList.remove('shake-anim'), 500);
          }
          return;
        }

        if (userVal === correctAnswer) {
          this.parentGateVerified = true;
          if (window.kiddoAudio && typeof window.kiddoAudio.playChime === 'function') {
            window.kiddoAudio.playChime();
          }
          closeModal();
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        } else {
          attempts++;
          if (window.kiddoAudio && typeof window.kiddoAudio.playBoing === 'function') {
            window.kiddoAudio.playBoing();
          }
          if (inputEl) {
            inputEl.classList.add('input-error', 'shake-anim');
            setTimeout(() => inputEl.classList.remove('shake-anim'), 500);
          }
          if (errorEl) {
            errorEl.textContent = isRu 
              ? 'Неверно! Пожалуйста, проверьте вычисления.' 
              : 'Noto‘g‘ri javob! Iltimos, hisob-kitobni qayta tekshiring.';
            errorEl.style.display = 'block';
          }
          if (inputEl) inputEl.value = '';

          if (attempts >= 2) {
            num1 = Math.floor(Math.random() * 30) + 18;
            num2 = Math.floor(Math.random() * 25) + 12;
            operator = '+';
            correctAnswer = num1 + num2;
            const qEl = document.getElementById('parent-gate-question');
            if (qEl) {
              qEl.innerHTML = `<span class="math-expr">${num1} ${operator} ${num2} = ?</span>`;
            }
            attempts = 0;
          }
          if (inputEl) inputEl.focus();
        }
      };

      if (formEl) {
        formEl.onsubmit = (e) => {
          e.preventDefault();
          validateAnswer();
        };
      }
    }

    // -------------------------------------------------------------
    // CHECKOUT FLOW & PAYMENT METHODS
    // -------------------------------------------------------------
    openCheckoutView() {
      // Enforce Parent Gate before allowing checkout
      if (!this.parentGateVerified) {
        this.verifyParentGate(() => this.openCheckoutView(), 'checkout');
        return;
      }

      const modal = document.getElementById('kiddo-subscription-modal');
      if (!modal) return;

      const isAnnual = this.selectedBillingCycle === 'annual';
      const usdPrice = isAnnual ? '1.99/oy ($24/yil)' : '2.50/oy';
      const uzsPrice = isAnnual ? '300,000 UZS/yil' : '32,000 UZS/oy';
      const periodName = isAnnual ? 'Yillik to‘lov (25,000 UZS/oy)' : 'Oylik to‘lov (32,000 UZS/oy)';

      modal.innerHTML = `
        <div class="sub-modal-card">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-subscription-modal').remove()">✕</button>

          <div class="checkout-view-wrap">
            <div class="checkout-steps-nav">
              <button class="checkout-back-btn" onclick="window.subscriptionManager.refreshPricingModal()">
                <span>⬅</span> <span>Ta‘riflarni ko‘rish</span>
              </button>
              <div class="checkout-order-summary">
                <div class="order-plan-name">👑 Pro Plan (${periodName})</div>
                <div class="order-total-price">$${usdPrice} / ${uzsPrice}</div>
              </div>
            </div>

            <div class="checkout-header-badge-row">
              <span class="parent-gate-passed-tag">🛡️ Ota-onalar Nazoratidan O‘tildi</span>
              <span class="security-chip-pill">🔒 256-bit Shifrlangan</span>
            </div>

            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">O‘zbekiston Mahalliy To‘lov Tizimlari</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 20px;">O‘zingizga qulay 3D taktil to‘lov usulini tanlang (Click, Payme yoki Milliy/Xalqaro kartalar):</p>

            <!-- Payment Methods 3D Grid -->
            <div class="payment-methods-grid payment-methods-3d-grid">
              <button class="payment-tab-btn payment-card-3d-tab tab-click ${this.selectedPaymentMethod === 'click' ? 'active' : ''}" id="tab-pay-click">
                <div class="pay-logo-badge"><span class="pay-logo-custom-click">CLICK</span></div>
                <span class="pay-method-name">Click Pass / Click.uz</span>
                <span class="pay-method-sub">Tezkor to‘lov so‘rovi</span>
              </button>

              <button class="payment-tab-btn payment-card-3d-tab tab-payme ${this.selectedPaymentMethod === 'payme' ? 'active' : ''}" id="tab-pay-payme">
                <div class="pay-logo-badge"><span class="pay-logo-custom-payme">payme</span></div>
                <span class="pay-method-name">Payme.uz</span>
                <span class="pay-method-sub">Hisob yoki telefon</span>
              </button>

              <button class="payment-tab-btn payment-card-3d-tab tab-card ${this.selectedPaymentMethod === 'card' ? 'active' : ''}" id="tab-pay-card">
                <div class="pay-logo-badge">
                  <div class="pay-logo-custom-cards">
                    <span class="card-mini-chip chip-uzcard">Uzcard</span>
                    <span class="card-mini-chip chip-humo">Humo</span>
                    <span class="card-mini-chip chip-visa">Visa</span>
                    <span class="card-mini-chip chip-master" style="background: #EB001B; color: white;">MC</span>
                  </div>
                </div>
                <span class="pay-method-name">Bank Kartalari</span>
                <span class="pay-method-sub">Jonli 3D Virtual Karta</span>
              </button>
            </div>

            <!-- Dynamic Form Area -->
            <div id="checkout-form-container">
              ${this.renderPaymentMethodForm()}
            </div>

            <!-- Security Assurance -->
            <div class="security-assurance-bar">
              <span>🔒 256-bit SSL Shifrlash</span>
              <span>⚡ Bir zumda faollashadi</span>
              <span>🔄 Istalgan payt bekor qilish</span>
            </div>
          </div>
        </div>
      `;

      this.bindCheckoutEvents();
    }

    renderPaymentMethodForm() {
      const uzsAmount = this.selectedBillingCycle === 'annual' ? '300,000' : '32,000';

      if (this.selectedPaymentMethod === 'click') {
        return `
          <div class="payment-form-box payment-form-3d-box">
            <!-- 3D Tactical Click Card Header -->
            <div class="tactical-brand-card click-brand-3d-card">
              <div class="t-card-top">
                <span class="pay-logo-custom-click" style="font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">CLICK</span>
                <span class="t-card-badge">🇺🇿 O‘zbekiston • Click Evolution</span>
              </div>
              <div class="t-card-desc">
                <strong>Click Pass orqali tezkor to‘lov</strong>
                <p>Telefoningizga bir zumda tasdiqlash xabarnomasi yoki USSD so‘rov yuboriladi.</p>
              </div>
            </div>

            <div class="form-group-custom" style="margin-top: 18px;">
              <label for="click-phone-input">Telefon raqamingiz (+998 formati):</label>
              <div class="phone-input-wrapper">
                <span class="phone-flag-icon">🇺🇿</span>
                <input type="tel" id="click-phone-input" class="form-input-custom strict-phone-input" placeholder="+998 (90) 123-45-67" maxlength="19" autocomplete="tel" />
              </div>
              <div class="field-validation-status" id="click-phone-status">
                <span class="status-counter">0 / 9 raqam</span>
              </div>
            </div>

            <button class="btn-submit-pay btn-submit-click-3d" id="btn-submit-click">
              <span>Click orqali to‘lash (${uzsAmount} UZS)</span>
              <span>➜</span>
            </button>
          </div>
        `;
      }

      if (this.selectedPaymentMethod === 'payme') {
        return `
          <div class="payment-form-box payment-form-3d-box">
            <!-- 3D Tactical Payme Card Header -->
            <div class="tactical-brand-card payme-brand-3d-card">
              <div class="t-card-top">
                <span class="pay-logo-custom-payme" style="font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">payme</span>
                <span class="t-card-badge">🛡️ Payme Xavfsiz To‘lov</span>
              </div>
              <div class="t-card-desc">
                <strong>Payme.uz hisobi orqali to‘lash</strong>
                <p>Payme profilingizga biriktirilgan telefon raqami orqali bir necha soniyada to‘lang.</p>
              </div>
            </div>

            <div class="form-group-custom" style="margin-top: 18px;">
              <label for="payme-phone-input">Payme hisob raqami (Telefon):</label>
              <div class="phone-input-wrapper">
                <span class="phone-flag-icon">🇺🇿</span>
                <input type="tel" id="payme-phone-input" class="form-input-custom strict-phone-input" placeholder="+998 (97) 123-45-67" maxlength="19" autocomplete="tel" />
              </div>
              <div class="field-validation-status" id="payme-phone-status">
                <span class="status-counter">0 / 9 raqam</span>
              </div>
            </div>

            <button class="btn-submit-pay btn-submit-payme-3d" id="btn-submit-payme">
              <span>Payme orqali to‘lash (${uzsAmount} UZS)</span>
              <span>➜</span>
            </button>
          </div>
        `;
      }

      // Direct Bank Card Payment (Uzcard, Humo, Visa, Mastercard) with Live 3D Virtual Plastic Card Preview
      return `
        <div class="payment-form-box payment-form-3d-box">
          <!-- 3D Virtual Plastic Card Stage -->
          <div class="virtual-card-stage">
            <div class="virtual-card-3d card-theme-uzcard" id="virtual-card-preview">
              <div class="card-shimmer-glare"></div>
              
              <div class="vcard-top">
                <div class="vcard-chip-box">
                  <div class="vcard-chip-pattern">
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
                <div class="vcard-contactless" title="Contactless Payment">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M8.5 16.5a5 5 0 0 1 0-9"/>
                    <path d="M12 19a8.5 8.5 0 0 0 0-14"/>
                    <path d="M15.5 21.5a12 12 0 0 0 0-19"/>
                  </svg>
                </div>
                <div class="vcard-brand-badge" id="preview-brand-logo">UZCARD</div>
              </div>
              
              <div class="vcard-number-display" id="preview-card-num">8600 •••• •••• ••••</div>
              
              <div class="vcard-bottom">
                <div class="vcard-col">
                  <span class="vcard-label">KARTA EGASI / HOLDER</span>
                  <span class="vcard-text">OTA-ONA (VALIY)</span>
                </div>
                <div class="vcard-col vcard-col-right">
                  <span class="vcard-label">MUDDATI</span>
                  <span class="vcard-text" id="preview-card-exp">MM/YY</span>
                </div>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 18px 0 14px;">
            <strong style="font-size: 1.05rem;">Karta Rekvizitlari:</strong>
            <div class="accepted-cards-pill-list">
              <span class="pill-badge pill-uzcard">Uzcard</span>
              <span class="pill-badge pill-humo">Humo</span>
              <span class="pill-badge pill-visa">Visa</span>
              <span class="pill-badge pill-mc">Mastercard</span>
            </div>
          </div>

          <div class="form-group-custom input-with-icon-wrap">
            <label for="card-num-input">Karta raqami (16 xonali):</label>
            <input type="text" id="card-num-input" class="form-input-custom" placeholder="8600 0000 0000 0000" maxlength="19" autocomplete="cc-number" />
            <span class="card-detected-badge" id="card-type-badge">UZCARD</span>
            <div class="field-validation-status" id="card-num-status">
              <span class="status-counter">0 / 16 raqam</span>
            </div>
          </div>

          <div class="card-inputs-row">
            <div class="form-group-custom">
              <label for="card-exp-input">Amal qilish muddati (MM/YY):</label>
              <input type="text" id="card-exp-input" class="form-input-custom" placeholder="MM/YY (01-12)" maxlength="5" autocomplete="cc-exp" />
              <div class="field-validation-status" id="card-exp-status">
                <span class="status-hint">Oy (01-12) / Yil</span>
              </div>
            </div>
            <div class="form-group-custom">
              <label for="card-cvc-input">CVC / CVV Kodi:</label>
              <input type="password" id="card-cvc-input" class="form-input-custom" placeholder="•••" maxlength="3" autocomplete="cc-csc" />
              <div class="field-validation-status" id="card-cvc-status">
                <span class="status-counter">0 / 3 raqam</span>
              </div>
            </div>
          </div>

          <button class="btn-submit-pay btn-submit-card-3d" id="btn-submit-card" style="margin-top: 14px;">
            <span>Kartadan to‘lash (${uzsAmount} UZS)</span>
            <span>➜</span>
          </button>
        </div>
      `;
    }

    bindCheckoutEvents() {
      // Tab switching
      const tabClick = document.getElementById('tab-pay-click');
      const tabPayme = document.getElementById('tab-pay-payme');
      const tabCard = document.getElementById('tab-pay-card');

      if (tabClick) tabClick.addEventListener('click', () => { this.selectedPaymentMethod = 'click'; this.openCheckoutView(); });
      if (tabPayme) tabPayme.addEventListener('click', () => { this.selectedPaymentMethod = 'payme'; this.openCheckoutView(); });
      if (tabCard) tabCard.addEventListener('click', () => { this.selectedPaymentMethod = 'card'; this.openCheckoutView(); });

      // Setup Strict Phone validation for Click
      const clickPhone = document.getElementById('click-phone-input');
      const clickStatus = document.getElementById('click-phone-status');
      if (clickPhone) {
        clickPhone.value = '+998 ';
        clickPhone.addEventListener('input', (e) => {
          const res = SubscriptionManager.formatUzPhone(e.target.value);
          e.target.value = res.formatted;
          if (clickStatus) {
            if (res.isValid) {
              clickStatus.innerHTML = `<span style="color: #10B981; font-weight: 800;">✓ To‘g‘ri raqam</span>`;
              clickPhone.classList.remove('input-error');
              clickPhone.classList.add('input-success');
            } else {
              clickStatus.innerHTML = `<span class="status-counter">${res.digitCount} / 9 raqam (yana ${9 - res.digitCount} ta kerak)</span>`;
              clickPhone.classList.remove('input-success');
            }
          }
        });
      }

      // Setup Strict Phone validation for Payme
      const paymePhone = document.getElementById('payme-phone-input');
      const paymeStatus = document.getElementById('payme-phone-status');
      if (paymePhone) {
        paymePhone.value = '+998 ';
        paymePhone.addEventListener('input', (e) => {
          const res = SubscriptionManager.formatUzPhone(e.target.value);
          e.target.value = res.formatted;
          if (paymeStatus) {
            if (res.isValid) {
              paymeStatus.innerHTML = `<span style="color: #10B981; font-weight: 800;">✓ To‘g‘ri raqam</span>`;
              paymePhone.classList.remove('input-error');
              paymePhone.classList.add('input-success');
            } else {
              paymeStatus.innerHTML = `<span class="status-counter">${res.digitCount} / 9 raqam (yana ${9 - res.digitCount} ta kerak)</span>`;
              paymePhone.classList.remove('input-success');
            }
          }
        });
      }

      // Card Fields strict validation and 3D Virtual Card preview syncing
      const cardNum = document.getElementById('card-num-input');
      const cardBadge = document.getElementById('card-type-badge');
      const cardNumStatus = document.getElementById('card-num-status');
      const cardExp = document.getElementById('card-exp-input');
      const cardExpStatus = document.getElementById('card-exp-status');
      const cardCvc = document.getElementById('card-cvc-input');
      const cardCvcStatus = document.getElementById('card-cvc-status');

      const vcardPreview = document.getElementById('virtual-card-preview');
      const previewCardNum = document.getElementById('preview-card-num');
      const previewCardExp = document.getElementById('preview-card-exp');
      const previewBrandLogo = document.getElementById('preview-brand-logo');

      if (cardNum) {
        cardNum.addEventListener('input', (e) => {
          const res = SubscriptionManager.formatCardNumber(e.target.value);
          e.target.value = res.formatted;
          
          if (cardBadge) {
            cardBadge.style.display = 'block';
            cardBadge.style.background = res.brandColor;
            cardBadge.style.color = '#FFF';
            cardBadge.textContent = res.brand;
          }

          // Live 3D Virtual Card Sync
          if (previewCardNum) {
            previewCardNum.textContent = res.formatted || '8600 •••• •••• ••••';
          }
          if (previewBrandLogo) {
            previewBrandLogo.textContent = res.brand;
          }
          if (vcardPreview) {
            vcardPreview.className = 'virtual-card-3d';
            if (res.brand === 'HUMO') {
              vcardPreview.classList.add('card-theme-humo');
            } else if (res.brand === 'VISA') {
              vcardPreview.classList.add('card-theme-visa');
            } else if (res.brand === 'MASTERCARD') {
              vcardPreview.classList.add('card-theme-mastercard');
            } else {
              vcardPreview.classList.add('card-theme-uzcard');
            }
          }

          if (cardNumStatus) {
            if (res.isValid) {
              cardNumStatus.innerHTML = `<span style="color: #10B981; font-weight: 800;">✓ 16 xonali karta</span>`;
              cardNum.classList.add('input-success');
              cardNum.classList.remove('input-error');
            } else {
              cardNumStatus.innerHTML = `<span class="status-counter">${res.rawDigits.length} / 16 raqam</span>`;
              cardNum.classList.remove('input-success');
            }
          }
        });
      }

      if (cardExp) {
        cardExp.addEventListener('input', (e) => {
          const res = SubscriptionManager.formatCardExp(e.target.value);
          e.target.value = res.formatted;
          
          // Live 3D Virtual Card Exp Sync
          if (previewCardExp) {
            previewCardExp.textContent = res.formatted || 'MM/YY';
          }

          if (cardExpStatus) {
            if (res.isValid) {
              cardExpStatus.innerHTML = `<span style="color: #10B981; font-weight: 800;">✓ To‘g‘ri muddat</span>`;
              cardExp.classList.add('input-success');
              cardExp.classList.remove('input-error');
            } else {
              cardExpStatus.innerHTML = `<span class="status-hint" style="color: #EF4444;">Oy 01 dan 12 gacha bo‘lishi shart!</span>`;
              cardExp.classList.remove('input-success');
            }
          }
        });
      }

      if (cardCvc) {
        cardCvc.addEventListener('input', (e) => {
          const res = SubscriptionManager.formatCardCVC(e.target.value);
          e.target.value = res.formatted;
          if (cardCvcStatus) {
            if (res.isValid) {
              cardCvcStatus.innerHTML = `<span style="color: #10B981; font-weight: 800;">✓ 3 xonali CVC</span>`;
              cardCvc.classList.add('input-success');
              cardCvc.classList.remove('input-error');
            } else {
              cardCvcStatus.innerHTML = `<span class="status-counter">${res.digitCount} / 3 raqam</span>`;
              cardCvc.classList.remove('input-success');
            }
          }
        });
      }

      // Submit handlers with strict verification
      const btnClick = document.getElementById('btn-submit-click');
      if (btnClick && clickPhone) {
        btnClick.addEventListener('click', () => {
          const res = SubscriptionManager.formatUzPhone(clickPhone.value);
          if (!res.isValid) {
            clickPhone.classList.add('input-error', 'shake-anim');
            setTimeout(() => clickPhone.classList.remove('shake-anim'), 500);
            alert('Iltimos, O‘zbekiston telefon raqamini to‘liq 9 ta raqamda kiriting! (+998 XX XXX-XX-XX)');
            return;
          }
          this.processSimulatedPayment('Click Pass', res.formatted);
        });
      }

      const btnPayme = document.getElementById('btn-submit-payme');
      if (btnPayme && paymePhone) {
        btnPayme.addEventListener('click', () => {
          const res = SubscriptionManager.formatUzPhone(paymePhone.value);
          if (!res.isValid) {
            paymePhone.classList.add('input-error', 'shake-anim');
            setTimeout(() => paymePhone.classList.remove('shake-anim'), 500);
            alert('Iltimos, Payme hisob raqamini to‘liq 9 ta raqamda kiriting! (+998 XX XXX-XX-XX)');
            return;
          }
          this.processSimulatedPayment('Payme.uz', res.formatted);
        });
      }

      const btnCard = document.getElementById('btn-submit-card');
      if (btnCard) {
        btnCard.addEventListener('click', () => {
          const numRes = SubscriptionManager.formatCardNumber(cardNum ? cardNum.value : '');
          const expRes = SubscriptionManager.formatCardExp(cardExp ? cardExp.value : '');
          const cvcRes = SubscriptionManager.formatCardCVC(cardCvc ? cardCvc.value : '');

          if (!numRes.isValid) {
            cardNum.classList.add('input-error', 'shake-anim');
            setTimeout(() => cardNum.classList.remove('shake-anim'), 500);
            alert('Karta raqami roppa-rosa 16 ta raqamdan iborat bo‘lishi shart!');
            return;
          }
          if (!expRes.isValid) {
            cardExp.classList.add('input-error', 'shake-anim');
            setTimeout(() => cardExp.classList.remove('shake-anim'), 500);
            alert('Amal qilish muddati noto‘g‘ri! Oy 01-12 oralig‘ida bo‘lishi kerak (MM/YY).');
            return;
          }
          if (!cvcRes.isValid) {
            cardCvc.classList.add('input-error', 'shake-anim');
            setTimeout(() => cardCvc.classList.remove('shake-anim'), 500);
            alert('CVC kodi roppa-rosa 3 ta raqamdan iborat bo‘lishi shart!');
            return;
          }

          this.processSimulatedPayment(`Bank Kartasi (${numRes.brand})`, numRes.formatted);
        });
      }
    }

    // -------------------------------------------------------------
    // OTP VERIFICATION & PRO CELEBRATION
    // -------------------------------------------------------------
    processSimulatedPayment(methodName, accountId) {
      const modal = document.getElementById('kiddo-subscription-modal');
      if (!modal) return;

      modal.innerHTML = `
        <div class="sub-modal-card" style="max-width: 520px;">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-subscription-modal').remove()">✕</button>

          <div style="padding: 34px 28px;">
            <div class="otp-verify-box">
              <div class="otp-icon">📲</div>
              <h4>SMS Tasdiqlash Kodi</h4>
              <p>To‘lovni tasdiqlash uchun <strong>${accountId}</strong> raqamiga yuborilgan 6 xonali SMS kodni kiriting:</p>

              <span class="otp-hint-demo">💡 Sinov kodi: <strong>777888</strong> (yoki istalgan kod)</span>

              <input type="text" id="otp-input-field" class="otp-input-code" placeholder="••••••" maxlength="6" value="777888" autofocus />

              <button class="btn-submit-pay" id="btn-verify-otp" style="margin-top: 10px;">
                <span>Tasdiqlash va Faollashtirish</span>
                <span>➜</span>
              </button>
            </div>
          </div>
        </div>
      `;

      const otpBtn = document.getElementById('btn-verify-otp');
      if (otpBtn) {
        otpBtn.addEventListener('click', () => {
          otpBtn.disabled = true;
          otpBtn.innerHTML = `<span>⏳ To‘lov tekshirilmoqda...</span>`;

          setTimeout(() => {
            this.activatePro(methodName, { account: accountId });
            this.showProConfirmationScreen(methodName);
          }, 1200);
        });
      }
    }

    showProConfirmationScreen(methodName) {
      const modal = document.getElementById('kiddo-subscription-modal');
      if (!modal) return;

      const sub = this.subData;
      const isAnnual = sub.billingCycle === 'annual';
      const usdAmount = isAnnual ? '$1.99/oy ($24/yil)' : '$2.50/oy';
      const uzsAmount = isAnnual ? '300,000 UZS/yil' : '32,000 UZS/oy';

      modal.innerHTML = `
        <div class="sub-modal-card" style="max-width: 560px;">
          <div class="pro-success-screen">
            <span class="pro-success-mascot">🎉 👑 🚀</span>
            <h2>Tabriklaymiz! Siz Pro A‘zosisiz!</h2>
            <p style="color: #64748B; font-size: 1.05rem;">Barcha fanlar, AstroBot cheksiz AI va qiziqarli o‘yinlar to‘liq ochildi!</p>

            <div class="pro-receipt-card">
              <div class="receipt-row">
                <span class="receipt-lbl">To‘lov Holati:</span>
                <span style="color: #10B981; font-weight: 800;">✓ To‘landi (Muvaffaqiyatli)</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-lbl">Reja:</span>
                <span>Pro Plan (${isAnnual ? 'Yillik' : 'Oylik'})</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-lbl">To‘lov Usuli:</span>
                <span>${sub.paymentMethod || methodName || 'Click Pass'}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-lbl">Tranzaksiya ID:</span>
                <span style="font-family: monospace;">${sub.transactionId}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-lbl">Jami To‘lov:</span>
                <span style="color: #2563EB;">${usdAmount} (${uzsAmount})</span>
              </div>
            </div>

            <button class="btn-start-pro-adventure" onclick="document.getElementById('kiddo-subscription-modal').remove(); location.reload();">
              🚀 O‘qishni Boshlash!
            </button>
          </div>
        </div>
      `;
    }

    // -------------------------------------------------------------
    // STRICT 4-CONDITION ACHIEVEMENT CERTIFICATE SYSTEM (End-Game Reward)
    // -------------------------------------------------------------
    getCertificateCriteria() {
      // 1. Pro Plan Check
      const condition1 = this.isPro();

      // 2. 50+ Game Levels Completed across English, Math, and Physics
      const gameIds = ['balloon-pop', 'word-match', 'space-rocket', 'speed-drill', 'gravity-tower', 'magnet-lab'];
      let levelsCount = 0;
      gameIds.forEach(id => {
        try {
          const raw = localStorage.getItem(`kiddo_progress_${id}`);
          if (raw) {
            const data = JSON.parse(raw);
            levelsCount += Math.max(1, data.maxUnlockedLevel || 1);
          } else {
            levelsCount += 1;
          }
        } catch (e) {}
      });
      // Cap at 50 minimum needed
      const condition2 = levelsCount >= 50;

      // 3. 500 Vocabulary Words Mastered
      let wordsCount = 0;
      try {
        const rawWords = localStorage.getItem('kiddo_words_listened');
        if (rawWords) {
          const arr = JSON.parse(rawWords);
          wordsCount = Array.isArray(arr) ? arr.length : 0;
        }
      } catch (e) {}
      const condition3 = wordsCount >= 500;

      // 4. Final Master Grand Quiz passed with 90%+
      const grandQuizScore = parseInt(localStorage.getItem('kiddo_grand_quiz_score') || '0', 10);
      const condition4 = (localStorage.getItem('kiddo_grand_quiz_passed') === 'true') && grandQuizScore >= 90;

      const isAllUnlocked = (condition1 && condition2 && condition3 && condition4) || this.demoCertUnlocked;

      return {
        condition1: { completed: condition1 || this.demoCertUnlocked, title: '1. Pro Obuna ($2.50/oy)', value: condition1 ? 'Faol 👑' : 'Nofaol 🔒' },
        condition2: { completed: condition2 || this.demoCertUnlocked, title: '2. 50+ O‘yin Bosqichlari', value: `${Math.min(50, levelsCount)} / 50 bosqich` },
        condition3: { completed: condition3 || this.demoCertUnlocked, title: '3. 500 Lug‘at So‘zlari', value: `${Math.min(500, wordsCount)} / 500 so‘z` },
        condition4: { completed: condition4 || this.demoCertUnlocked, title: '4. Grand Master Imtihoni (90%+)', value: grandQuizScore ? `${grandQuizScore}% Natija` : 'Topshirilmagan' },
        isAllUnlocked,
        levelsCount,
        wordsCount,
        grandQuizScore
      };
    }

    openCertificateModal() {
      const existing = document.getElementById('kiddo-cert-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'kiddo-cert-modal';
      modal.className = 'sub-modal-backdrop open';

      const criteria = this.getCertificateCriteria();
      const studentName = localStorage.getItem('kiddo_student_name') || 'Mening Kichik Qahramonim';

      modal.innerHTML = `
        <div class="certificate-modal-box">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-cert-modal').remove()">✕</button>

          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 2.4rem;">🏆</span>
            <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 4px; background: linear-gradient(135deg, #B45309, #D97706); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">
              Rasmiy Grand Master Yutuq Sertifikati
            </h2>
            <p style="color: #64748B; font-size: 0.95rem;">
              Kiddo Academy yakuniy mukofoti — faqat eng tirishqoq va bilimdon o‘quvchilar uchun!
            </p>
          </div>

          <!-- STRICT 4 CRITERIA DASHBOARD -->
          <div class="cert-criteria-card-grid">
            <div class="cert-crit-box ${criteria.condition1.completed ? 'crit-passed' : 'crit-locked'}">
              <span class="crit-badge">${criteria.condition1.completed ? '✓ BAJARILDI' : '🔒 TALAB ETILADI'}</span>
              <h4>${criteria.condition1.title}</h4>
              <p>${criteria.condition1.value}</p>
            </div>

            <div class="cert-crit-box ${criteria.condition2.completed ? 'crit-passed' : 'crit-locked'}">
              <span class="crit-badge">${criteria.condition2.completed ? '✓ BAJARILDI' : '🔒 TALAB ETILADI'}</span>
              <h4>${criteria.condition2.title}</h4>
              <p>${criteria.condition2.value}</p>
            </div>

            <div class="cert-crit-box ${criteria.condition3.completed ? 'crit-passed' : 'crit-locked'}">
              <span class="crit-badge">${criteria.condition3.completed ? '✓ BAJARILDI' : '🔒 TALAB ETILADI'}</span>
              <h4>${criteria.condition3.title}</h4>
              <p>${criteria.condition3.value}</p>
            </div>

            <div class="cert-crit-box ${criteria.condition4.completed ? 'crit-passed' : 'crit-locked'}">
              <span class="crit-badge">${criteria.condition4.completed ? '✓ BAJARILDI' : '🔒 TALAB ETILADI'}</span>
              <h4>${criteria.condition4.title}</h4>
              <p>${criteria.condition4.value}</p>
            </div>
          </div>

          <!-- Exam Action Banner if Exam Not Passed -->
          ${!criteria.condition4.completed ? `
            <div class="cert-exam-banner">
              <div>
                <strong>🎓 Grand Master Yakuniy Imtihoni:</strong>
                <p>Ingliz tili, Matematika va Fizika bo‘yicha 20 ta savoldan iborat yakuniy test (Kamida 90% talab qilinadi).</p>
              </div>
              <button class="btn btn-primary" onclick="window.subscriptionManager.startGrandQuiz()" style="background: linear-gradient(135deg, #2563EB, #1D4ED8); border-radius: 999px; padding: 10px 22px; font-weight: 800;">
                ✍️ Imtihonni Topshirish ➜
              </button>
            </div>
          ` : ''}

          <!-- Student Name Input Bar -->
          <div style="display: flex; gap: 12px; justify-content: center; align-items: center; margin: 18px 0; flex-wrap: wrap;">
            <label style="font-weight: 800; color: #1E293B;">Farzandingiz Ismi (Diplomda aks etadi):</label>
            <input type="text" id="cert-student-name-input" value="${studentName}" style="padding: 8px 16px; border-radius: 12px; border: 2px solid #CBD5E1; font-family: inherit; font-size: 1.05rem; font-weight: 700; width: 260px;" />
            <button class="btn btn-primary" id="btn-cert-redraw" style="padding: 8px 18px; border-radius: 12px;">🔄 Yangilash</button>
          </div>

          <!-- Canvas Preview -->
          <div class="certificate-preview-container">
            ${!criteria.isAllUnlocked ? `
              <div class="certificate-watermark">
                <div class="certificate-watermark-text">🔒 QULFLANGAN / LOCKED</div>
                <p style="font-weight: 800; color: #1E293B; margin-bottom: 12px; text-align: center; max-width: 500px;">
                  Sertifikat faqat barcha 4 ta shart (Pro obuna, 50+ darajalar, 500 so‘z, va 90%+ Grand Imtihon) to‘liq bajarilganda ochiladi!
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                  <button class="btn-upgrade-pro" onclick="document.getElementById('kiddo-cert-modal').remove(); window.subscriptionManager.openPricingModal();">
                    👑 Pro ga O‘tish ($2.50)
                  </button>
                  <button class="btn btn-ctrl" onclick="window.subscriptionManager.startGrandQuiz()">
                    ✍️ Grand Imtihon
                  </button>
                </div>
              </div>
            ` : ''}

            <canvas id="cert-canvas" width="1200" height="800" style="width: 100%; height: auto; display: block; border-radius: 8px;"></canvas>
          </div>

          <!-- Bottom Actions & Demo Toggle -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; flex-wrap: wrap; gap: 14px;">
            <button class="cert-demo-toggle-btn" onclick="window.subscriptionManager.toggleDemoCert()">
              ${this.demoCertUnlocked ? '⚡ Sinov Rejimini O‘chirish (Haqiqiy shartlarga qaytish)' : '⚡ Sinov Rejimi: Barcha 4 ta shartni ochish (Demo Test)'}
            </button>
            
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-ctrl" onclick="window.print()" ${!criteria.isAllUnlocked ? 'disabled style="opacity:0.5;"' : ''}>
                🖨️ Chop Etish / PDF
              </button>
              <button class="btn btn-primary" id="btn-cert-download" style="background: #10B981; font-weight: 800; border-radius: 999px; padding: 10px 22px;" ${!criteria.isAllUnlocked ? 'disabled style="opacity:0.5; cursor: not-allowed;"' : ''}>
                📥 Oltin Sertifikatni Yuklab Olish (PNG/PDF)
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      this.renderCertificateCanvas(studentName, criteria.isAllUnlocked);

      const redrawBtn = document.getElementById('btn-cert-redraw');
      const nameInput = document.getElementById('cert-student-name-input');
      const downloadBtn = document.getElementById('btn-cert-download');

      if (redrawBtn && nameInput) {
        redrawBtn.addEventListener('click', () => {
          const val = nameInput.value.trim() || 'Kichik Daho';
          localStorage.setItem('kiddo_student_name', val);
          this.renderCertificateCanvas(val, criteria.isAllUnlocked);
        });
      }

      if (downloadBtn && criteria.isAllUnlocked) {
        downloadBtn.addEventListener('click', () => {
          const canvas = document.getElementById('cert-canvas');
          if (canvas) {
            const link = document.createElement('a');
            link.download = `Kiddo_Grand_Master_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        });
      }
    }

    toggleDemoCert() {
      this.demoCertUnlocked = !this.demoCertUnlocked;
      localStorage.setItem('kiddo_demo_cert_override', this.demoCertUnlocked);
      this.openCertificateModal();
    }

    renderCertificateCanvas(name, isUnlocked) {
      const canvas = document.getElementById('cert-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      // 1. Parchment Background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 700);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(1, '#FFFDF0');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Multi-layer Royal Golden Guilloche Border
      ctx.lineWidth = 18;
      ctx.strokeStyle = '#B45309';
      ctx.strokeRect(18, 18, w - 36, h - 36);

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(34, 34, w - 68, h - 68);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#D97706';
      ctx.strokeRect(42, 42, w - 84, h - 84);

      // Corner Rosettes
      const drawRosette = (cx, cy) => {
        ctx.save();
        ctx.translate(cx, cy);
        for (let i = 0; i < 8; i++) {
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = '#F59E0B';
          ctx.fillRect(-6, -6, 12, 12);
        }
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      drawRosette(60, 60);
      drawRosette(w - 60, 60);
      drawRosette(60, h - 60);
      drawRosette(w - 60, h - 60);

      // 3. Header Academy Title
      ctx.font = 'bold 22px "Fredoka", sans-serif';
      ctx.fillStyle = '#2563EB';
      ctx.textAlign = 'center';
      ctx.fillText('🌟 YOSHLAR AKADEMIYASI • KIDDO PORTAL 🌟', w / 2, 95);

      // 4. Main Certificate Title
      ctx.font = 'bold 50px "Fredoka", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('YUTUQ VA MAHORAT SERTIFIKATI', w / 2, 160);

      // Subtitle
      ctx.font = '600 22px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('GRAND MASTER AKADEMIK UNVONI', w / 2, 205);

      // Recognition line
      ctx.font = '20px "Fredoka", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Ushbu rasmiy diplom ajoyib irodasi va yuksak bilimi uchun taqdim etiladi:', w / 2, 260);

      // Student Name with Gold Ribbon effect
      ctx.font = 'bold 48px "Fredoka", sans-serif';
      ctx.fillStyle = '#B45309';
      ctx.fillText(name, w / 2, 330);

      // Golden Underline
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 280, 355);
      ctx.lineTo(w / 2 + 280, 355);
      ctx.stroke();

      // Certificate Body Text (Achievements across 3 subjects)
      ctx.font = '21px "Fredoka", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('Ingliz Tili (500 so‘z), Matematika (12×12 karra) va Fizika (50+ daraja)', w / 2, 410);
      ctx.fillText('fanlaridagi barcha sarguzashtli darslarni va Yakuniy Katta Grand Imtihonni', w / 2, 445);
      ctx.fillText('90%+ yuqori natija bilan muvaffaqiyatli yakunlaganligi tasdiqlanadi!', w / 2, 480);

      // Golden Embossed Wax Seal Badge
      const sealX = w / 2;
      const sealY = 575;
      ctx.save();
      ctx.beginPath();
      ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Seal Ribbon tails
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.moveTo(sealX - 25, sealY + 40);
      ctx.lineTo(sealX - 40, sealY + 95);
      ctx.lineTo(sealX - 25, sealY + 80);
      ctx.lineTo(sealX - 10, sealY + 95);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(sealX + 25, sealY + 40);
      ctx.lineTo(sealX + 10, sealY + 95);
      ctx.lineTo(sealX + 25, sealY + 80);
      ctx.lineTo(sealX + 40, sealY + 95);
      ctx.closePath();
      ctx.fill();

      ctx.font = '40px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText('👑', sealX, sealY + 14);
      ctx.restore();

      // Date & Signatures
      const todayStr = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

      // Left: Date
      ctx.font = '16px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText('Taqdim Etilgan Sana:', 110, 670);
      ctx.font = 'bold 20px "Fredoka", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(todayStr, 110, 700);

      // Right: Signatures
      ctx.textAlign = 'right';
      ctx.font = '16px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Astro-Cat Hamkor & Maslahatchi:', w - 110, 670);
      ctx.font = 'bold 24px "Fredoka", cursive';
      ctx.fillStyle = '#2563EB';
      ctx.fillText('Astro-Cat 🐱🎓 ✨', w - 110, 702);

      // Verifier ID
      ctx.textAlign = 'center';
      ctx.font = '14px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`Rasmiy Tekshirish ID: KIDDO-CERT-2026-${Math.floor(100000 + Math.random() * 900000)} | verify.kiddo-academy.uz`, w / 2, 765);
    }

    // -------------------------------------------------------------
    // GRAND MASTER FINAL QUIZ
    // -------------------------------------------------------------
    startGrandQuiz() {
      const existing = document.getElementById('kiddo-grand-quiz-modal');
      if (existing) existing.remove();

      const questions = [
        // English (7 questions)
        { q: "Ingliz tilida 'Olma' so‘zi qanday yoziladi?", options: ["Apple", "Orange", "Banana", "Grape"], answer: 0 },
        { q: "Qaysi so‘z oldidan 'An' artikli qo‘yiladi?", options: ["An Elephant", "An Book", "An Dog", "An Tiger"], answer: 0 },
        { q: "'Sun' so‘zining o‘zbekcha tarjimasi nima?", options: ["Quyosh", "Oy", "Yulduz", "Bulut"], answer: 0 },
        { q: "'Butterfly' so‘zi nima ma‘noni anglatadi?", options: ["Kapalak", "Chumoli", "Ari", "Ninachi"], answer: 0 },
        { q: "Ranglardan 'Green' qaysi rang?", options: ["Yashil", "Qizil", "Moviy", "Sariq"], answer: 0 },
        { q: "'Book' so‘zining ma'nosi nima?", options: ["Kitob", "Daftar", "Qalam", "Xalta"], answer: 0 },
        { q: "'Good morning' nima degani?", options: ["Xayrli tong", "Xayrli tun", "Kechirasiz", "Rahmat"], answer: 0 },
        // Math (7 questions)
        { q: "7 × 8 karra amali natijasi nechaga teng?", options: ["56", "54", "48", "64"], answer: 0 },
        { q: "9 × 9 amali natijasi nechaga teng?", options: ["81", "72", "63", "90"], answer: 0 },
        { q: "12 × 5 nechaga teng bo‘ladi?", options: ["60", "55", "65", "50"], answer: 0 },
        { q: "48 sonini 6 ga bo‘lsak, necha chiqadi?", options: ["8", "7", "9", "6"], answer: 0 },
        { q: "25 + 35 yig‘indisi nechaga teng?", options: ["60", "50", "70", "55"], answer: 0 },
        { q: "100 dan 45 ni ayirsak, necha qoladi?", options: ["55", "65", "45", "50"], answer: 0 },
        { q: "6 × 7 amali natijasi nechaga teng?", options: ["42", "48", "36", "49"], answer: 0 },
        // Physics (6 questions)
        { q: "Daraxtdan yerga tushayotgan olmaga qaysi kuch ta‘sir qiladi?", options: ["Gravitatsiya (tortishish kuchi)", "Magnit kuchi", "Shamol kuchi", "Elektr kuchi"], answer: 0 },
        { q: "Magnitning qanday qutblari bir-birini tortadi?", options: ["Har xil qutblar (N va S)", "Bir xil qutblar (N va N)", "Ikkala tomon ham itaradi", "Faqat bir xil qutblar"], answer: 0 },
        { q: "Muz eriganda nima hosil bo‘ladi?", options: ["Suv (suyuqlik)", "Bug‘", "Tosh", "Olov"], answer: 0 },
        { q: "Quyosh bizga qanday energiya turlarini beradi?", options: ["Yorug‘lik va issiqlik", "Faqat sovuq", "Ovoz to‘lqini", "Magnit bo‘roni"], answer: 0 },
        { q: "Yorug‘lik tezligi tovush tezligidan qanday?", options: ["Ancha tezroq (Chaqmoq avval ko‘rinadi)", "Sekinroq", "Bir xil", "Tovush tezroq"], answer: 0 },
        { q: "Kompas mili nima uchun doim shimolga qaraydi?", options: ["Yerning magnit maydoni sababli", "Quyosh nuri sababli", "Shamol sababli", "Oy tortishuvi sababli"], answer: 0 }
      ];

      let currentIndex = 0;
      let score = 0;

      const quizModal = document.createElement('div');
      quizModal.id = 'kiddo-grand-quiz-modal';
      quizModal.className = 'sub-modal-backdrop open';

      const renderQuestion = () => {
        const item = questions[currentIndex];
        quizModal.innerHTML = `
          <div class="sub-modal-card" style="max-width: 600px;">
            <button class="sub-modal-close" onclick="document.getElementById('kiddo-grand-quiz-modal').remove()">✕</button>

            <div style="padding: 24px 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="font-weight: 800; color: #2563EB;">🎓 Grand Master Imtihoni</span>
                <span style="background: #EFF6FF; color: #1D4ED8; font-weight: 800; padding: 4px 12px; border-radius: 999px;">
                  Savol: ${currentIndex + 1} / ${questions.length}
                </span>
              </div>

              <div class="xp-bar-wrap" style="width: 100%; height: 10px; margin-bottom: 20px;">
                <div class="xp-bar-fill" style="width: ${((currentIndex + 1) / questions.length) * 100}%;"></div>
              </div>

              <h3 style="font-size: 1.25rem; font-weight: 800; color: #1E293B; margin-bottom: 24px;">
                ${item.q}
              </h3>

              <div class="quiz-options-list" style="display: flex; flex-direction: column; gap: 12px;">
                ${item.options.map((opt, idx) => `
                  <button class="quiz-option-btn" data-idx="${idx}" style="padding: 14px 18px; border-radius: 14px; border: 2px solid #E2E8F0; background: #FFF; font-size: 1.05rem; font-weight: 700; text-align: left; cursor: pointer; transition: all 0.2s ease;">
                    <span style="display: inline-block; width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 50%; background: #F1F5F9; margin-right: 10px; font-weight: 800;">
                      ${String.fromCharCode(65 + idx)}
                    </span>
                    ${opt}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        `;

        quizModal.querySelectorAll('.quiz-option-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const selected = parseInt(btn.dataset.idx, 10);
            const isCorrect = selected === item.answer;

            if (isCorrect) {
              score++;
              btn.style.background = '#ECFDF5';
              btn.style.borderColor = '#10B981';
            } else {
              btn.style.background = '#FEF2F2';
              btn.style.borderColor = '#EF4444';
            }

            // Disable all options
            quizModal.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);

            setTimeout(() => {
              currentIndex++;
              if (currentIndex < questions.length) {
                renderQuestion();
              } else {
                finishGrandQuiz();
              }
            }, 600);
          });
        });
      };

      const finishGrandQuiz = () => {
        const pct = Math.round((score / questions.length) * 100);
        const isPassed = pct >= 90;

        localStorage.setItem('kiddo_grand_quiz_score', pct);
        if (isPassed) {
          localStorage.setItem('kiddo_grand_quiz_passed', 'true');
          this.triggerConfetti();
        }

        quizModal.innerHTML = `
          <div class="sub-modal-card" style="max-width: 520px; text-align: center; padding: 36px 24px;">
            <div style="font-size: 3.5rem; margin-bottom: 10px;">${isPassed ? '🎉 👑 🏆' : '💪 📚'}</div>
            <h2 style="font-size: 1.8rem; font-weight: 800; color: #1E293B; margin-bottom: 8px;">
              ${isPassed ? 'Tabriklaymiz! Siz O‘tdingiz!' : 'Yana Ozgina Harakat Qiling!'}
            </h2>
            <p style="color: #64748B; font-size: 1rem; margin-bottom: 20px;">
              ${isPassed ? 'Siz Grand Master talablarini namunali bajardingiz!' : 'Sertifikatni ochish uchun kamida 90% to‘plash zarur.'}
            </p>

            <div style="background: #F8FAFC; border: 2px solid ${isPassed ? '#10B981' : '#F59E0B'}; border-radius: 18px; padding: 18px; margin-bottom: 24px;">
              <div style="font-size: 2.2rem; font-weight: 900; color: ${isPassed ? '#10B981' : '#B45309'};">
                ${pct}% (${score} / ${questions.length})
              </div>
              <div style="color: #64748B; font-size: 0.88rem; font-weight: 700;">
                ${isPassed ? '✓ 4-Shart Bajarildi!' : 'Talab: Kamida 90% (18/20)'}
              </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: center;">
              <button class="btn btn-ctrl" onclick="document.getElementById('kiddo-grand-quiz-modal').remove()">
                Yopish
              </button>
              <button class="btn btn-primary" onclick="document.getElementById('kiddo-grand-quiz-modal').remove(); window.subscriptionManager.openCertificateModal();" style="background: #2563EB;">
                📜 Sertifikatni Ko‘rish
              </button>
            </div>
          </div>
        `;
      };

      renderQuestion();
      document.body.appendChild(quizModal);
    }

    // -------------------------------------------------------------
    // ADS INJECTOR (Free Users Only)
    // -------------------------------------------------------------
    initAds() {
      if (this.isPro()) return;

      const adBanners = [
        { title: '📚 KiddoBooks: 100 ta O‘zbek Xalq Ertaklari', desc: 'Bolalar uchun rangli suratli kitoblar to‘plami!', icon: '📖' },
        { title: '🎨 ArtKids: Kichik Rassomlar To‘garagi', desc: 'Qalam va bo‘yoqlar bilan rasm chizishni o‘rganamiz!', icon: '🎨' },
        { title: '🧩 Bolajon Mantiqiy Topishmoqlar To‘plami', desc: 'Miyani charxlovchi ajoyib o‘yinchoqlar!', icon: '🧸' }
      ];

      document.addEventListener('DOMContentLoaded', () => {
        if (this.isPro()) return;
        const footer = document.querySelector('.app-footer') || document.querySelector('.math-footer') || document.querySelector('.physics-footer');
        if (footer && !document.getElementById('kiddo-ad-banner-injected')) {
          const randomAd = adBanners[Math.floor(Math.random() * adBanners.length)];
          const adWrap = document.createElement('div');
          adWrap.id = 'kiddo-ad-banner-injected';
          adWrap.className = 'kiddo-ad-banner-wrap';
          adWrap.innerHTML = `
            <div class="kiddo-ad-card">
              <span class="kiddo-ad-badge">Homiylik E‘loni (Bepul Rejim)</span>
              <div class="kiddo-ad-content">
                <span class="kiddo-ad-icon">${randomAd.icon}</span>
                <div class="kiddo-ad-info">
                  <h5>${randomAd.title}</h5>
                  <p>${randomAd.desc}</p>
                </div>
              </div>
              <div class="kiddo-ad-actions">
                <button class="kiddo-ad-remove-pro-btn" onclick="window.subscriptionManager.openPricingModal()" title="Reklamani o‘chirish">
                  🚫 Reklamasiz (Pro)
                </button>
              </div>
            </div>
          `;
          footer.parentNode.insertBefore(adWrap, footer);
        }
      });
    }

    // -------------------------------------------------------------
    // HEADER BADGES & UI INJECTION
    // -------------------------------------------------------------
    initHeaderBadge() {
      const injectBadge = () => {
        const topBar = document.querySelector('.hub-top-bar') || document.querySelector('.header-controls') || document.querySelector('.header-inner');
        if (!topBar) return;

        if (document.getElementById('hud-sub-badge')) return;

        const isPro = this.isPro();
        const badge = document.createElement('div');
        badge.id = 'hud-sub-badge';
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.gap = '8px';

        const badgeHtml = isPro
          ? `<span class="header-plan-badge plan-badge-pro" title="👑 Pro Member - Cheksiz kirish faollashtirilgan">
              <span class="crown-icon">👑</span> <span>Pro A‘zo ($2.50)</span>
             </span>`
          : `<span class="header-plan-badge plan-badge-free" title="Bepul Plan">
              <span>🆓</span> <span>Bepul</span>
             </span>
             <button class="btn-upgrade-pro" title="Pro ga a‘zo bo‘lish">
               <span>👑 Pro ($2.50) 🚀</span>
             </button>`;

        badge.innerHTML = badgeHtml;

        badge.addEventListener('click', () => {
          this.openPricingModal();
        });

        const existingBtnPro = topBar.querySelector('.btn-pro-upgrade') || document.querySelector('.btn-pro-upgrade');
        if (existingBtnPro) {
          const proTxt = existingBtnPro.querySelector('#txt-hub-pro') || existingBtnPro.querySelector('span:last-child');
          const isRu = this.getLang() === 'ru';
          if (isPro) {
            existingBtnPro.classList.add('pro-active');
            existingBtnPro.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            existingBtnPro.style.borderColor = '#059669';
            existingBtnPro.style.color = '#FFFFFF';
            if (proTxt) proTxt.textContent = isRu ? 'PRO АКТИВЕН' : 'PRO FAOL';
            existingBtnPro.title = isRu ? 'Pro Активен - Полный доступ' : 'Pro A‘zo - Cheksiz kirish';
          }
          return;
        }

        const langSwitcher = topBar.querySelector('.lang-switcher-pill') || topBar.querySelector('#btn-lang-uz')?.parentElement;
        if (langSwitcher && langSwitcher.parentNode) {
          langSwitcher.parentNode.insertBefore(badge, langSwitcher);
        } else {
          topBar.appendChild(badge);
        }
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectBadge);
      } else {
        injectBadge();
      }
    }

    updateUI() {
      const existing = document.getElementById('hud-sub-badge');
      if (existing) existing.remove();
      this.initHeaderBadge();

      if (this.isPro()) {
        const ad = document.getElementById('kiddo-ad-banner-injected');
        if (ad) ad.remove();
      }
    }

    listenStorageChanges() {
      window.addEventListener('storage', (e) => {
        if (e.key === 'kiddo_subscription') {
          this.subData = this.loadSubscription();
          this.updateUI();
        }
      });
    }

    triggerConfetti() {
      if (window.ScreenVFX && typeof window.ScreenVFX.launchConfetti === 'function') {
        window.ScreenVFX.launchConfetti(80, 0.5, 0.5);
        return;
      }
      const colors = ['#FFD166', '#FF5E7E', '#06D6A0', '#48CAE4', '#845EC2', '#F59E0B'];
      for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.style.cssText = `
          position: fixed;
          top: -20px;
          left: ${Math.random() * 100}vw;
          width: ${Math.random() * 12 + 8}px;
          height: ${Math.random() * 12 + 8}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
          z-index: 10009;
          pointer-events: none;
          transform: rotate(${Math.random() * 360}deg);
          animation: confettiDrop ${Math.random() * 2 + 2}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 4200);
      }
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #0F172A;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.95rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10008;
        animation: toastFade 0.3s ease;
      `;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    }
  }

  // Keyframes for animations
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes confettiDrop {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
    }
    @keyframes toastFade {
      0% { opacity: 0; transform: translate(-50%, 15px); }
      100% { opacity: 1; transform: translate(-50%, 0); }
    }
  `;
  document.head.appendChild(styleSheet);

  window.subscriptionManager = new SubscriptionManager();

})();
