/**
 * Kiddo Academy - Subscription & Local Uzbekistan Payment Gateway System
 * Features:
 * 1. Plan Management: Free Plan (Bepul) vs Pro Plan ($15 / month / 185,000 UZS)
 * 2. Local Payment Gateways: Click Pass (Click.uz), Payme (Payme.uz), Uzcard / Humo / Visa / Mastercard
 * 3. SMS OTP Verification Simulation & Celebratory Confetti Activation
 * 4. Free Tier Limits Enforcement:
 *    - 10 Daily Chatbot queries with sleek limit reached modal
 *    - 1 Game level per day across English, Math & Physics
 *    - Basic content only (Locks advanced categories)
 *    - Kid-friendly placeholder banner ads
 * 5. Pro Plan Perks:
 *    - 100% Unlimited Gemini AI Chatbot
 *    - Unlimited games & exercises
 *    - 100+ Vocabulary categories & physics simulations unlocked
 *    - Ad-Free experience
 *    - Official Downloadable Achievement Certificate (PDF / Canvas)
 *    - Deep Parent Dashboard Analytics & Learning Bottlenecks
 * 6. Header Badges & One-Click Plan Switcher (Demo Toggle)
 */

(function () {
  'use strict';

  class SubscriptionManager {
    constructor() {
      this.subData = this.loadSubscription();
      this.lang = localStorage.getItem('kiddo_language') || 'uz';
      this.selectedBillingCycle = 'monthly'; // 'monthly' or 'annual'
      this.selectedPaymentMethod = 'click';  // 'click', 'payme', 'card'
      this.demoOtpCode = '777888';

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

    // -------------------------------------------------------------
    // DEMO TOGGLE & UPGRADE LOGIC
    // -------------------------------------------------------------
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
      this.showToast(this.isPro() ? '👑 Pro Rejim faollashtirildi (Cheksiz kirish)!' : '🆓 Bepul Rejimga o‘tildi (10 ta savol/kun)!');
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

      // Trigger Confetti Celebration and Sound
      if (window.kiddoAudio && typeof window.kiddoAudio.playFanfare === 'function') {
        window.kiddoAudio.playFanfare();
      }
      this.triggerConfetti();

      // Refresh AstroBot Chatbot limit if open
      if (window.astroBot) {
        window.astroBot.updateLimitUI();
      }
    }

    // -------------------------------------------------------------
    // LIMIT CHECKS FOR FREE VS PRO
    // -------------------------------------------------------------
    // 1. Chatbot Questions Limit Check
    checkChatbotLimit() {
      if (this.isPro()) return true; // Unlimited!

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

    // 2. Daily Game Level Limit (Free: 1 level per day across games)
    canPlayGameLevel(gameId, level = 1) {
      if (this.isPro()) return true;

      // Free user can play level 1
      if (level <= 1) {
        return true;
      }

      // Level 2+ requires Pro!
      this.openGamePaywallModal(gameId, level);
      return false;
    }

    recordGameLevelPlayed(gameId, level) {
      if (this.isPro()) return;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`kiddo_game_${gameId}_date`, today);
      localStorage.setItem(`kiddo_game_${gameId}_level`, level);
    }

    // 3. Content Lock Check (Categories / Lessons)
    canAccessCategory(catId) {
      if (this.isPro()) return true;

      // Basic categories are free
      const freeCategories = ['all', 'animals', 'fruits', 'colors', 'basic-math', 'gravity'];
      if (freeCategories.includes(catId)) {
        return true;
      }

      this.openContentPaywallModal(catId);
      return false;
    }

    // -------------------------------------------------------------
    // PAYWALL MODALS
    // -------------------------------------------------------------
    openChatbotPaywallModal() {
      const isRu = this.getLang() === 'ru';
      const isEn = this.getLang() === 'en';

      const title = isRu
        ? 'Вы использовали 10/10 бесплатных вопросов на сегодня!'
        : (isEn ? 'You used 10/10 free questions today!' : 'Bugungi 10/10 ta bepul savol limitingiz tugadi!');

      const desc = isRu
        ? 'Перейдите на Pro план ($15/мес) для 100% безлимитного общения с умным АстроБотом, ускоренных ответов и решения любых задач! 🚀'
        : (isEn 
          ? 'Upgrade to Pro ($15/month) for 100% unlimited AI chat with AstroBot, instant answers, and all subject solvers! 🚀'
          : 'AstroBot bilan cheksiz suhbatlashish, barcha misol va vazifalarni bir zumda yechish uchun Pro rejimga ($15/oy) o‘ting! 🚀');

      this.showSoftPaywallModal({
        icon: '🤖',
        title: title,
        desc: desc,
        perks: [
          '⚡ 100% Cheksiz savol-javob (Google Gemini AI)',
          '🎮 Barcha mini-o‘yinlarda cheksiz darajalar',
          '📚 100+ barcha toifalar va grammatika qoidalari',
          '🚫 100% Reklamasiz o‘rganish tajribasi'
        ]
      });
    }

    openGamePaywallModal(gameName, levelNumber) {
      const isRu = this.getLang() === 'ru';
      const isEn = this.getLang() === 'en';

      const title = isRu
        ? `Уровень ${levelNumber} доступен в Pro версии!`
        : (isEn ? `Level ${levelNumber} is a Pro Feature!` : `${levelNumber}-Daraja Pro A‘zolar uchun ochiq!`);

      const desc = isRu
        ? 'В бесплатном режиме доступен 1 уровень в день. Перейдите на Pro для бесконечной игры и всех уровней сложности!'
        : (isEn
          ? 'Free plan includes 1 level per day. Upgrade to Pro for unlimited gameplay, all planets, and high-score battles!'
          : 'Bepul rejimda kuniga 1 ta daraja o‘ynash mumkin. Barcha bosqichlar va yangi qiyinlik darajalarini ochish uchun Pro ga o‘ting!');

      this.showSoftPaywallModal({
        icon: '🎮',
        title: title,
        desc: desc,
        perks: [
          '🚀 Barcha o‘yinlarda cheksiz darajalar va raketalar',
          '⭐ Do‘konda Pro a‘zolar uchun maxsus kostyumlar',
          '📜 Rasmiy Yutuq Sertifikati (PDF yuklab olish)',
          '👨‍👩‍👧 Ota-onalar uchun chuqur tahlil paneli'
        ]
      });
    }

    openContentPaywallModal(catName) {
      const isRu = this.getLang() === 'ru';
      const isEn = this.getLang() === 'en';

      const title = isRu
        ? 'Этот раздел открыт для Pro подписчиков! 👑'
        : (isEn ? 'This category is part of the Pro Plan! 👑' : 'Ushbu toifa Pro A‘zolikda mavjud! 👑');

      const desc = isRu
        ? 'Откройте полный доступ ко всем 100+ темам английского словаря, сложным математическим тренажёрам и физическим симуляциям!'
        : (isEn
          ? 'Unlock all 100+ vocabulary topics, advanced math fractions, and physics simulation experiments!'
          : 'Barcha 100+ mavzudagi inglizcha lug‘atlar, murakkab matematika amallari va fizika laboratoriyalarini to‘liq oching!');

      this.showSoftPaywallModal({
        icon: '🔒',
        title: title,
        desc: desc,
        perks: [
          '🌟 100+ toifadagi to‘liq lug‘at va audio talaffuz',
          '⚛️ Fizika tajribalari va modda o‘zgarishi laboratoriyasi',
          '📐 Qiziqarli kasrlar va 60 soniyalik poyga o‘yini',
          '👑 Do‘kondagi Qirollik toji va Superqahramon liboslari'
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
      const isEn = this.getLang() === 'en';

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
              ${isRu ? 'Позже' : (isEn ? 'Maybe Later' : 'Keyinroq')}
            </button>
            <button class="btn-paywall-upgrade" onclick="document.getElementById('kiddo-paywall-modal').remove(); window.subscriptionManager.openPricingModal();">
              ${isRu ? '👑 Перейти на Pro ($15) 🚀' : (isEn ? '👑 Upgrade to Pro ($15) 🚀' : '👑 Pro ga O‘tish ($15) 🚀')}
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
      const isEn = this.getLang() === 'en';
      const isAnnual = this.selectedBillingCycle === 'annual';

      // Price calculation
      const monthlyUSD = 15;
      const annualUSD = 12; // 20% discount
      const monthlyUZS = '185,000';
      const annualUZS = '148,000';

      const currentPriceUSD = isAnnual ? annualUSD : monthlyUSD;
      const currentPriceUZS = isAnnual ? annualUZS : monthlyUZS;

      return `
        <div class="sub-modal-card">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-subscription-modal').remove()">✕</button>

          <!-- Hero Header -->
          <div class="sub-modal-hero">
            <span class="sub-modal-badge">🌟 ${isRu ? 'Тарифные Планы' : (isEn ? 'Subscription Plans' : 'Ta‘lim Rejalari')}</span>
            <h2>${isRu ? 'Открой Все Возможности с Pro!' : (isEn ? 'Supercharge Learning with Pro!' : 'Cheksiz Bilim Dunyosiga Pro bilan!')}</h2>
            <p>${isRu ? 'Выбирайте подходящий план для вашего ребёнка. Безлимитный ИИ АстроБот, все предметы и игры!' : (isEn ? 'Choose the ideal plan for your superstar. Unlimited AI Chatbot, games, and certificates!' : 'Farzandingiz uchun eng qulay ta‘rifni tanlang: cheksiz AstroBot, barcha fanlar, o‘yinlar va rasmiy sertifikat!')}</p>

            <!-- Billing Cycle Switcher -->
            <div class="billing-cycle-toggle-wrap">
              <div class="billing-toggle-pill">
                <button class="billing-toggle-btn ${!isAnnual ? 'active' : ''}" id="btn-billing-monthly">
                  ${isRu ? 'Ежемесячно' : (isEn ? 'Monthly' : 'Oylik')}
                </button>
                <button class="billing-toggle-btn ${isAnnual ? 'active' : ''}" id="btn-billing-annual">
                  ${isRu ? 'На 1 Год' : (isEn ? 'Annual' : 'Yillik')}
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
                <h3>🆓 ${isRu ? 'Бесплатный План' : (isEn ? 'Free Plan' : 'Bepul Rejim')}</h3>
                <p class="plan-desc">${isRu ? 'Базовое ознакомление с платформой и играми' : (isEn ? 'Explore basics and daily starter quests' : 'Platforma va asosiy darslar bilan tanishish')}</p>
                <div class="plan-price-wrap">
                  <span class="price-amount">$0</span>
                  <span class="price-period">/ ${isRu ? 'навсегда' : (isEn ? 'forever' : 'doimiy')}</span>
                </div>
                <div class="plan-uzs-price">0 UZS</div>
              </div>

              <ul class="plan-features-list">
                <li><span class="feat-icon-limit">🔸</span> <span><strong>10 ta savol / kun</strong> (Gemini AI AstroBot)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span><strong>1 ta daraja / kun</strong> (Barcha o‘yinlarda)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span>Faqat asosiy lug‘at va formulalar</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span>Kunlik oddiy seriya (Streak 🔥)</span></li>
                <li><span class="feat-icon-limit">🔸</span> <span>Bolalar uchun reklama bannerlari</span></li>
                <li><span class="feat-icon-limit">✕</span> <span style="opacity: 0.6;">Rasmiy Sertifikat (Mavjud emas)</span></li>
              </ul>

              <button class="plan-card-btn ${!isPro ? 'btn-current-plan' : 'btn-select-pro'}" onclick="window.subscriptionManager.switchToFree()">
                ${!isPro ? (isRu ? 'Текущий план' : (isEn ? 'Current Plan' : 'Amaldagi reja')) : (isRu ? 'Выбрать Бесплатный' : 'Bepulga qaytish')}
              </button>
            </div>

            <!-- Pro Plan Card -->
            <div class="plan-card plan-card-pro">
              <span class="plan-popular-ribbon">⭐ ${isRu ? 'ХИТ • РЕКОМЕНДУЕМ' : (isEn ? 'MOST POPULAR' : 'TAVSIYA ETILADI')}</span>
              
              <div class="plan-header">
                <h3>👑 Pro Plan (Cheksiz)</h3>
                <p class="plan-desc">${isRu ? 'Полный безлимит, ИИ-репетитор, сертификаты и игры' : (isEn ? 'Unlimited AI companion, all games, certificate' : 'Cheksiz AI o‘qituvchi, barcha o‘yinlar va sertifikat')}</p>
                
                <div class="plan-price-wrap">
                  <span class="price-amount">$${currentPriceUSD}</span>
                  <span class="price-period">/ ${isRu ? 'месяц' : (isEn ? 'month' : 'oyiga')}</span>
                </div>
                <div class="plan-uzs-price">${currentPriceUZS} UZS / oy</div>
              </div>

              <ul class="plan-features-list">
                <li><span class="feat-icon-check">✓</span> <span><strong>100% CHEKSIZ AstroBot</strong> (Google Gemini 3.8 Flash AI)</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Cheksiz o‘yinlar</strong> va barcha kosmik darajalar</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>100+ to‘liq lug‘at</strong>, grammatika va fizika laboratoriyalari</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>100% Reklamasiz</strong> toza va xavfsiz muhit</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Rasmiy Yutuq Sertifikati</strong> (PDF formatda)</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Maxsus kostyumlar</strong>: Qirollik toji, Reaktiv ryukzak</span></li>
                <li><span class="feat-icon-check">✓</span> <span><strong>Ota-onalar chuqur tahlili</strong>: qiyinchiliklar va tavsiyalar</span></li>
              </ul>

              <button class="plan-card-btn btn-select-pro" onclick="window.subscriptionManager.openCheckoutView()">
                <span>${isPro ? '👑 Obunani Boshqarish' : '🚀 Pro Rejimga O‘tish ($' + currentPriceUSD + ')'}</span>
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
        if (confirm('Rostdan ham bepul rejimmga o‘tmoqchimisiz? Cheksiz AI va o‘yinlar cheklanadi.')) {
          this.toggleDemoPlan();
        }
      }
    }

    // -------------------------------------------------------------
    // CHECKOUT FLOW & PAYMENT METHODS
    // -------------------------------------------------------------
    openCheckoutView() {
      const modal = document.getElementById('kiddo-subscription-modal');
      if (!modal) return;

      const isAnnual = this.selectedBillingCycle === 'annual';
      const usdPrice = isAnnual ? 12 : 15;
      const uzsPrice = isAnnual ? '148,000' : '185,000';
      const periodName = isAnnual ? 'Yillik hisob-kitob (1,776,000 UZS/yil)' : 'Oylik to‘lov';

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
                <div class="order-total-price">$${usdPrice} / ${uzsPrice} UZS</div>
              </div>
            </div>

            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 6px;">O‘zbekiston Mahalliy To‘lov Tizimlari</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-bottom: 20px;">O‘zingizga qulay to‘lov usulini tanlang (Click, Payme yoki Milliy kartalar):</p>

            <!-- Payment Methods Grid -->
            <div class="payment-methods-grid">
              <!-- Click Pass Tab -->
              <button class="payment-tab-btn ${this.selectedPaymentMethod === 'click' ? 'active' : ''}" id="tab-pay-click">
                <div class="pay-logo-badge">
                  <span class="pay-logo-custom-click">CLICK</span>
                </div>
                <span class="pay-method-name">Click Pass / Click.uz</span>
              </button>

              <!-- Payme Tab -->
              <button class="payment-tab-btn ${this.selectedPaymentMethod === 'payme' ? 'active' : ''}" id="tab-pay-payme">
                <div class="pay-logo-badge">
                  <span class="pay-logo-custom-payme">payme</span>
                </div>
                <span class="pay-method-name">Payme.uz</span>
              </button>

              <!-- Cards Tab -->
              <button class="payment-tab-btn ${this.selectedPaymentMethod === 'card' ? 'active' : ''}" id="tab-pay-card">
                <div class="pay-logo-badge">
                  <div class="pay-logo-custom-cards">
                    <span class="card-mini-chip chip-uzcard">Uzcard</span>
                    <span class="card-mini-chip chip-humo">Humo</span>
                    <span class="card-mini-chip chip-visa">Visa</span>
                  </div>
                </div>
                <span class="pay-method-name">Bank Kartalari</span>
              </button>
            </div>

            <!-- Dynamic Form Area -->
            <div id="checkout-form-container">
              ${this.renderPaymentMethodForm()}
            </div>

            <!-- Security Assurance -->
            <div class="security-assurance-bar">
              <span>🔒 256-bit Shifrlangan Xavfsiz To‘lov</span>
              <span>⚡ Bir zumda faollashtirish</span>
              <span>🔄 Istalgan vaqtda bekor qilish</span>
            </div>
          </div>
        </div>
      `;

      this.bindCheckoutEvents();
    }

    renderPaymentMethodForm() {
      const uzsAmount = this.selectedBillingCycle === 'annual' ? '1,776,000' : '185,000';

      if (this.selectedPaymentMethod === 'click') {
        return `
          <div class="payment-form-box">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span class="pay-logo-custom-click" style="font-size: 0.9rem;">CLICK</span>
              <div>
                <strong style="display: block; font-size: 1.05rem;">Click Evolution / Click Pass</strong>
                <small style="color: #64748B;">Telefon raqamingizga to‘lov so‘rovi yuboriladi</small>
              </div>
            </div>

            <div class="form-group-custom">
              <label for="click-phone-input">Telefon raqamingiz (Click hisobi):</label>
              <input type="tel" id="click-phone-input" class="form-input-custom" placeholder="+998 90 123 45 67" value="+998 90 " />
            </div>

            <button class="btn-submit-pay" id="btn-submit-click" style="background: linear-gradient(135deg, #0073FF, #0056BF);">
              <span>Click orqali to‘lash (${uzsAmount} UZS)</span>
              <span>➜</span>
            </button>
          </div>
        `;
      }

      if (this.selectedPaymentMethod === 'payme') {
        return `
          <div class="payment-form-box">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
              <span class="pay-logo-custom-payme" style="font-size: 0.9rem;">payme</span>
              <div>
                <strong style="display: block; font-size: 1.05rem;">Payme.uz To‘lov Tizimi</strong>
                <small style="color: #64748B;">Telefon raqamingiz yoki Payme ID orqali to‘lang</small>
              </div>
            </div>

            <div class="form-group-custom">
              <label for="payme-phone-input">Payme hisob raqami (Telefon):</label>
              <input type="tel" id="payme-phone-input" class="form-input-custom" placeholder="+998 93 987 65 43" value="+998 97 " />
            </div>

            <button class="btn-submit-pay" id="btn-submit-payme" style="background: linear-gradient(135deg, #14D8C8, #0E9F94); color: #0F172A;">
              <span>Payme orqali to‘lash (${uzsAmount} UZS)</span>
              <span>➜</span>
            </button>
          </div>
        `;
      }

      // Direct Card Payment (Uzcard, Humo, Visa, Mastercard)
      return `
        <div class="payment-form-box">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
            <strong style="font-size: 1.05rem;">Karta Ma'lumotlari:</strong>
            <small style="color: #64748B;">Uzcard, Humo, Visa, Mastercard qo‘llab-quvvatlanadi</small>
          </div>

          <div class="form-group-custom input-with-icon-wrap">
            <label for="card-num-input">Karta raqami (16 xonali):</label>
            <input type="text" id="card-num-input" class="form-input-custom" placeholder="8600 0000 0000 0000" maxlength="19" />
            <span class="card-detected-badge" id="card-type-badge">UZCARD</span>
          </div>

          <div class="card-inputs-row">
            <div class="form-group-custom">
              <label for="card-exp-input">Amal qilish muddati:</label>
              <input type="text" id="card-exp-input" class="form-input-custom" placeholder="MM/YY (masalan: 12/28)" maxlength="5" />
            </div>
            <div class="form-group-custom">
              <label for="card-cvc-input">CVC / Kod (ixtiyoriy):</label>
              <input type="password" id="card-cvc-input" class="form-input-custom" placeholder="•••" maxlength="4" />
            </div>
          </div>

          <button class="btn-submit-pay" id="btn-submit-card" style="margin-top: 14px;">
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

      // Click submit
      const btnClick = document.getElementById('btn-submit-click');
      if (btnClick) {
        btnClick.addEventListener('click', () => {
          const phone = document.getElementById('click-phone-input').value.trim();
          this.processSimulatedPayment('Click Pass', phone);
        });
      }

      // Payme submit
      const btnPayme = document.getElementById('btn-submit-payme');
      if (btnPayme) {
        btnPayme.addEventListener('click', () => {
          const phone = document.getElementById('payme-phone-input').value.trim();
          this.processSimulatedPayment('Payme.uz', phone);
        });
      }

      // Card submit & formatting
      const btnCard = document.getElementById('btn-submit-card');
      const cardNum = document.getElementById('card-num-input');
      const cardBadge = document.getElementById('card-type-badge');
      const cardExp = document.getElementById('card-exp-input');

      if (cardNum && cardBadge) {
        cardNum.addEventListener('input', (e) => {
          let val = e.target.value.replace(/\D/g, '');
          let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
          e.target.value = formatted;

          // Detect brand
          if (val.startsWith('8600')) {
            cardBadge.style.display = 'block';
            cardBadge.style.background = '#004B93';
            cardBadge.style.color = '#FFF';
            cardBadge.textContent = 'UZCARD';
          } else if (val.startsWith('9860')) {
            cardBadge.style.display = 'block';
            cardBadge.style.background = '#E67E22';
            cardBadge.style.color = '#FFF';
            cardBadge.textContent = 'HUMO';
          } else if (val.startsWith('4')) {
            cardBadge.style.display = 'block';
            cardBadge.style.background = '#1A1F71';
            cardBadge.style.color = '#FFF';
            cardBadge.textContent = 'VISA';
          } else if (val.startsWith('5')) {
            cardBadge.style.display = 'block';
            cardBadge.style.background = '#EB001B';
            cardBadge.style.color = '#FFF';
            cardBadge.textContent = 'MASTERCARD';
          } else {
            cardBadge.style.display = 'none';
          }
        });
      }

      if (cardExp) {
        cardExp.addEventListener('input', (e) => {
          let val = e.target.value.replace(/\D/g, '');
          if (val.length >= 2) {
            e.target.value = val.slice(0, 2) + '/' + val.slice(2, 4);
          } else {
            e.target.value = val;
          }
        });
      }

      if (btnCard) {
        btnCard.addEventListener('click', () => {
          const num = (document.getElementById('card-num-input') || {}).value || '8600 1234 5678 9921';
          this.processSimulatedPayment('Bank Kartasi', num);
        });
      }
    }

    // -------------------------------------------------------------
    // OTP VERIFICATION & CELEBRATION
    // -------------------------------------------------------------
    processSimulatedPayment(methodName, accountId) {
      const modal = document.getElementById('kiddo-subscription-modal');
      if (!modal) return;

      // Show OTP Verification Screen
      modal.innerHTML = `
        <div class="sub-modal-card" style="max-width: 520px;">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-subscription-modal').remove()">✕</button>

          <div style="padding: 34px 28px;">
            <div class="otp-verify-box">
              <div class="otp-icon">📲</div>
              <h4>SMS Tasdiqlash Kodi</h4>
              <p>To‘lovni tasdiqlash uchun <strong>${accountId || '+998 90 ••• •• 77'}</strong> raqamiga yuborilgan 6 xonali SMS kodni kiriting:</p>

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
      const otpInput = document.getElementById('otp-input-field');

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
      const usdAmount = isAnnual ? '$12/oy ($144)' : '$15/oy';
      const uzsAmount = isAnnual ? '1,776,000 UZS' : '185,000 UZS';

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
    // OFFICIAL ACHIEVEMENT CERTIFICATE GENERATOR (Canvas & PDF)
    // -------------------------------------------------------------
    openCertificateModal() {
      const existing = document.getElementById('kiddo-cert-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'kiddo-cert-modal';
      modal.className = 'sub-modal-backdrop open';

      const isPro = this.isPro();
      const studentName = localStorage.getItem('kiddo_student_name') || 'Mening Kichik Qahramonim';

      modal.innerHTML = `
        <div class="certificate-modal-box">
          <button class="sub-modal-close" onclick="document.getElementById('kiddo-cert-modal').remove()">✕</button>

          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-size: 2.2rem;">🏆</span>
            <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 4px;">Rasmiy Yutuq Sertifikati</h2>
            <p style="color: #64748B;">Kiddo Academy tomonidan tasdiqlangan maxsus diplom</p>
          </div>

          <div style="display: flex; gap: 12px; justify-content: center; align-items: center; margin-bottom: 16px; flex-wrap: wrap;">
            <label style="font-weight: 700; color: #475569;">Farzandingiz Ismi:</label>
            <input type="text" id="cert-student-name-input" value="${studentName}" style="padding: 8px 16px; border-radius: 12px; border: 2px solid #CBD5E1; font-family: inherit; font-size: 1rem; font-weight: 700;" />
            <button class="btn btn-primary" id="btn-cert-redraw" style="padding: 8px 18px;">🔄 Yangilash</button>
          </div>

          <div class="certificate-preview-container">
            ${!isPro ? `
              <div class="certificate-watermark">
                <div class="certificate-watermark-text">NAMUNA / SAMPLE (FREE)</div>
                <p style="font-weight: 800; color: #1E293B; margin-bottom: 12px;">Rasmiy muhrlangan sertifikatni yuklab olish uchun Pro a‘zo bo‘ling!</p>
                <button class="btn-upgrade-pro" onclick="document.getElementById('kiddo-cert-modal').remove(); window.subscriptionManager.openPricingModal();">
                  👑 Pro ga O‘tish ($15) 🚀
                </button>
              </div>
            ` : ''}

            <canvas id="cert-canvas" width="1000" height="650" style="width: 100%; height: auto; display: block;"></canvas>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; flex-wrap: wrap; gap: 12px;">
            <span style="color: #64748B; font-size: 0.9rem;">⭐ A4 formatda yuqori sifatli chop etish (300 DPI) uchun moslashtirilgan.</span>
            
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-ctrl" onclick="window.print()">🖨️ Chop Etish</button>
              <button class="btn btn-primary" id="btn-cert-download" style="background: #10B981;">
                📥 Sertifikatni Yuklab Olish (PNG/PDF)
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      this.renderCertificateCanvas(studentName);

      const redrawBtn = document.getElementById('btn-cert-redraw');
      const nameInput = document.getElementById('cert-student-name-input');
      const downloadBtn = document.getElementById('btn-cert-download');

      if (redrawBtn && nameInput) {
        redrawBtn.addEventListener('click', () => {
          const val = nameInput.value.trim() || 'Bolajon';
          localStorage.setItem('kiddo_student_name', val);
          this.renderCertificateCanvas(val);
        });
      }

      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          if (!this.isPro()) {
            this.openChatbotPaywallModal();
            return;
          }
          const canvas = document.getElementById('cert-canvas');
          if (canvas) {
            const link = document.createElement('a');
            link.download = `Kiddo_Academy_Certificate_${studentName.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
          }
        });
      }
    }

    renderCertificateCanvas(name) {
      const canvas = document.getElementById('cert-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;

      // Background Paper
      ctx.fillStyle = '#FFFDF7';
      ctx.fillRect(0, 0, w, h);

      // Outer Golden Border
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#D97706';
      ctx.strokeRect(16, 16, w - 32, h - 32);

      // Inner Fancy Frame
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(32, 32, w - 64, h - 64);

      // Corner Stars
      const drawCornerStar = (x, y) => {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', x, y);
      };
      drawCornerStar(50, 50);
      drawCornerStar(w - 50, 50);
      drawCornerStar(50, h - 50);
      drawCornerStar(w - 50, h - 50);

      // Header Brand
      ctx.font = 'bold 20px "Fredoka", sans-serif';
      ctx.fillStyle = '#2563EB';
      ctx.textAlign = 'center';
      ctx.fillText('🌟 YOSHLAR AKADEMIYASI • KIDDO PORTAL 🌟', w / 2, 80);

      // Main Title
      ctx.font = 'bold 44px "Fredoka", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText('YUTUQ SERTIFIKATI', w / 2, 140);

      // Subtitle
      ctx.font = '600 20px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Ushbu diplom ajoyib bilim va irodasi uchun taqdim etiladi:', w / 2, 190);

      // Student Name with Gold Ribbon effect
      ctx.font = 'bold 42px "Fredoka", sans-serif';
      ctx.fillStyle = '#B45309';
      ctx.fillText(name, w / 2, 260);

      // Line under name
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 250, 280);
      ctx.lineTo(w / 2 + 250, 280);
      ctx.stroke();

      // Certificate Body Text
      ctx.font = '20px "Fredoka", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Ingliz Tili (KiddoLingo), Matematika (MathKids) va Fizika (PhysicsKids)', w / 2, 330);
      ctx.fillText('fanlaridagi barcha sarguzashtli dars va topshiriqlarni namunali yakunladi!', w / 2, 365);

      // Golden Badge in the Center-Bottom
      ctx.beginPath();
      ctx.arc(w / 2, 450, 48, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      ctx.font = '40px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('👑', w / 2, 460);

      // Date & Signatures
      const todayStr = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

      // Left: Date
      ctx.font = '16px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText('Sana:', 100, 540);
      ctx.font = 'bold 18px "Fredoka", sans-serif';
      ctx.fillStyle = '#1E293B';
      ctx.fillText(todayStr, 100, 565);

      // Right: Signatures
      ctx.textAlign = 'right';
      ctx.font = '16px "Fredoka", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('AstroBot AI Ta‘lim Hamkori:', w - 100, 540);
      ctx.font = 'bold 22px "Fredoka", cursive';
      ctx.fillStyle = '#2563EB';
      ctx.fillText('AstroBot 🤖 ✨', w - 100, 568);

      // Bottom Verifier ID
      ctx.textAlign = 'center';
      ctx.font = '13px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`Rasmiy Sertifikat ID: KIDDO-CERT-${Math.floor(100000 + Math.random() * 900000)} | kiddo-academy.uz`, w / 2, 610);
    }

    // -------------------------------------------------------------
    // ADS INJECTOR (Free Users Only)
    // -------------------------------------------------------------
    initAds() {
      if (this.isPro()) return; // Complete Ad-Free for Pro!

      const adBanners = [
        {
          title: '📚 KiddoBooks: 100 ta O‘zbek Xalq Ertaklari',
          desc: 'Bolalar uchun rangli suratli kitoblar to‘plami!',
          icon: '📖',
          btn: 'Ko‘rish ➜'
        },
        {
          title: '🎨 ArtKids: Kichik Rassomlar To‘garagi',
          desc: 'Qalam va bo‘yoqlar bilan rasm chizishni o‘rganamiz!',
          icon: '🎨',
          btn: 'Batafsil ➜'
        },
        {
          title: '🧩 Bolajon Mantiqiy Topishmoqlar To‘plami',
          desc: 'Miyani charxlovchi ajoyib o‘yinchoqlar!',
          icon: '🧸',
          btn: 'O‘rganish ➜'
        }
      ];

      // Insert an ad banner before app footer if on subject page
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

        // Check if badge already injected
        if (document.getElementById('hud-sub-badge')) return;

        const isPro = this.isPro();
        const badge = document.createElement('div');
        badge.id = 'hud-sub-badge';
        badge.style.display = 'inline-flex';
        badge.style.alignItems = 'center';
        badge.style.gap = '8px';

        const badgeHtml = isPro
          ? `<span class="header-plan-badge plan-badge-pro" title="👑 Pro Member - Cheksiz kirish faollashtirilgan">
              <span class="crown-icon">👑</span> <span>Pro A‘zo</span>
             </span>`
          : `<span class="header-plan-badge plan-badge-free" title="Bepul Plan">
              <span>🆓</span> <span>Bepul</span>
             </span>
             <button class="btn-upgrade-pro" title="Pro ga a‘zo bo‘lish">
               <span>👑 Pro ga O‘tish 🚀</span>
             </button>`;

        badge.innerHTML = badgeHtml;

        badge.addEventListener('click', (e) => {
          this.openPricingModal();
        });

        // Insert into proper position in header
        const langSwitcher = topBar.querySelector('.lang-switcher-pill') || topBar.querySelector('#btn-lang-uz')?.parentElement;
        if (langSwitcher) {
          topBar.insertBefore(badge, langSwitcher);
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
      // Re-render header badge
      const existing = document.getElementById('hud-sub-badge');
      if (existing) existing.remove();
      this.initHeaderBadge();

      // Remove ads if upgraded to Pro
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

  // Keyframes for confetti
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
