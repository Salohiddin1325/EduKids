/**
 * EduKids — PWA Ro'yxatdan O'tkazuvchi va 3D Taktil O'rnatish Tizimi (TASK-06)
 * (Service Worker Registration & PWA Install Manager)
 */

(function () {
  'use strict';

  // Ilova allaqachon alohida oyna (standalone) sifatida o'rnatilganmi?
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true ||
                       document.referrer.includes('android-app://');

  // Global EduKidsPWA obyekti
  window.EduKidsPWA = {
    deferredPrompt: null,
    isInstalled: isStandalone,
    isOnline: navigator.onLine,
    lang: localStorage.getItem('kiddo_language') || 'uz',

    /**
     * PWA O'rnatish taklifini chaqirish
     */
    async promptInstall() {
      // 1. Agar brauzer rasmiy deferredPrompt tayyorlab bergan bo'lsa
      if (this.deferredPrompt) {
        try {
          this.deferredPrompt.prompt();
          const choiceResult = await this.deferredPrompt.userChoice;
          console.log('[EduKids PWA] O‘rnatish natijasi:', choiceResult.outcome);

          if (choiceResult.outcome === 'accepted') {
            this.isInstalled = true;
            this.updateUI();
            if (window.ScreenVFX && typeof window.ScreenVFX.celebrateStars === 'function') {
              window.ScreenVFX.celebrateStars(window.innerWidth / 2, window.innerHeight / 2);
            }
          }
          this.deferredPrompt = null;
          return choiceResult.outcome === 'accepted';
        } catch (err) {
          console.warn('[EduKids PWA] Prompt chaqirishda xatolik:', err);
        }
      }

      // 2. Agar deferredPrompt bo'lmasa (masalan, iOS Safari yoki qo'lda chaqirilganda)
      this.showInstallGuideModal();
      return false;
    },

    /**
     * Qurilmaga mos o'rnatish yo'riqnomasi modalini ko'rsatish
     */
    showInstallGuideModal() {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isRu = this.lang === 'ru';

      let modalEl = document.getElementById('pwa-guide-modal');
      if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'pwa-guide-modal';
        modalEl.className = 'pwa-modal-overlay';
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.innerHTML = `
          <div class="pwa-modal-card">
            <button class="pwa-modal-close-btn" onclick="window.EduKidsPWA.closeInstallGuideModal()" aria-label="Yopish">✕</button>
            <img class="pwa-modal-badge-icon" src="${this.getIconPath()}" alt="EduKids Logo">
            <h3 class="pwa-modal-title" id="pwa-modal-title">📲 EduKids Ilovasini O‘rnatish</h3>
            <p class="pwa-modal-desc" id="pwa-modal-desc">
              Telefon, planshet yoki kompyuteringizga o‘rnating va internet uzilganda ham 100% oflayn o‘ynang!
            </p>
            <div class="pwa-guide-box" id="pwa-modal-guide-text">
              <!-- Dynamically injected -->
            </div>
            <button class="pwa-modal-action-btn" id="pwa-modal-btn" onclick="window.EduKidsPWA.onModalActionClick()">
              <span>📲</span> <span id="pwa-modal-btn-txt">Ilovani O‘rnatish</span>
            </button>
          </div>
        `;
        document.body.appendChild(modalEl);

        // Backdrop orqali yopish
        modalEl.addEventListener('click', (e) => {
          if (e.target === modalEl) this.closeInstallGuideModal();
        });
      }

      // Matnlarni til va qurilmaga qarab to'ldirish
      const guideBox = document.getElementById('pwa-modal-guide-text');
      const titleEl = document.getElementById('pwa-modal-title');
      const descEl = document.getElementById('pwa-modal-desc');
      const btnTxt = document.getElementById('pwa-modal-btn-txt');

      if (isRu) {
        titleEl.textContent = '📲 Установка EduKids';
        descEl.textContent = 'Установите приложение на телефон, планшет или ПК и играйте даже без интернета!';
        btnTxt.textContent = this.deferredPrompt ? 'Установить Сейчас' : 'Понятно, спасибо!';
        
        if (isIOS) {
          guideBox.innerHTML = `
            <strong>🍏 Для iPhone и iPad (Safari):</strong><br>
            1. Нажмите иконку <strong>«Поделиться»</strong> ⎋ внизу экрана.<br>
            2. Прокрутите и выберите <strong>«На экран «Домой»»</strong> ➕.<br>
            3. Нажмите <strong>«Добавить»</strong> в правом верхнем углу!
          `;
        } else {
          guideBox.innerHTML = `
            <strong>🤖 Для Android и Компьютера (Chrome / Edge):</strong><br>
            1. Нажмите кнопку <strong>«Установить Сейчас»</strong> ниже.<br>
            2. Или в меню браузера (три точки ⋮) выберите <strong>«Установить приложение»</strong> 📲.
          `;
        }
      } else {
        titleEl.textContent = '📲 EduKids Ilovasini O‘rnatish';
        descEl.textContent = 'Telefon, planshet yoki kompyuteringizga o‘rnating va internet uzilganda ham 100% oflayn o‘ynang!';
        btnTxt.textContent = this.deferredPrompt ? 'Hozir O‘rnatish' : 'Tushunarli, rahmat!';

        if (isIOS) {
          guideBox.innerHTML = `
            <strong>🍏 iPhone va iPad uchun (Safari):</strong><br>
            1. Ekran pastidagi <strong>«Ulashish» (Share)</strong> ⎋ belgisini bosing.<br>
            2. Pastroqqa tushib <strong>«Bosh ekranga qo‘shish» (Add to Home Screen)</strong> ➕ ni tanlang.<br>
            3. Yuqori o‘ng burchakdagi <strong>«Qo‘shish» (Add)</strong> tugmasini bosing!
          `;
        } else {
          guideBox.innerHTML = `
            <strong>🤖 Android va Kompyuter uchun (Chrome / Edge):</strong><br>
            1. Quyidagi <strong>«Hozir O‘rnatish»</strong> tugmasini bosing.<br>
            2. Yoki brauzer menyusi (uch nuqta ⋮) dan <strong>«Ilovani o‘rnatish»</strong> 📲 ni tanlang.
          `;
        }
      }

      modalEl.classList.add('active');
    },

    /**
     * Modal ichidagi tugma bosilganda
     */
    async onModalActionClick() {
      if (this.deferredPrompt) {
        this.closeInstallGuideModal();
        await this.promptInstall();
      } else {
        this.closeInstallGuideModal();
      }
    },

    /**
     * Modalni yopish
     */
    closeInstallGuideModal() {
      const modalEl = document.getElementById('pwa-guide-modal');
      if (modalEl) modalEl.classList.remove('active');
    },

    /**
     * To'g'ri nisbiy icon yo'lini olish
     */
    getIconPath() {
      const isSubDir = window.location.pathname.includes('/math/') ||
                       window.location.pathname.includes('/english/') ||
                       window.location.pathname.includes('/physics/');
      return isSubDir ? '../icons/icon-192.png' : 'icons/icon-192.png';
    },

    /**
     * UI elementlarini yangilash
     */
    updateUI() {
      const installBtns = document.querySelectorAll('.btn-pwa-install, #btn-pwa-install');
      const isRu = this.lang === 'ru';

      installBtns.forEach((btn) => {
        if (this.isInstalled) {
          btn.style.display = 'none';
        } else {
          btn.style.display = 'inline-flex';
          const txtEl = btn.querySelector('#txt-pwa-install') || btn.querySelector('.txt-pwa-install');
          if (txtEl) {
            txtEl.textContent = isRu ? 'Установить' : 'Ilovani O‘rnatish';
          }
        }
      });
    },

    /**
     * Til o'zgarganda yangilash
     */
    setLanguage(newLang) {
      this.lang = newLang || 'uz';
      this.updateUI();
    }
  };

  /* ==========================================================================
     1. Service Worker ni Ro'yxatdan O'tkazish
     ========================================================================== */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const path = window.location.pathname;
      const isSubDir = path.includes('/math/') || path.includes('/english/') || path.includes('/physics/');
      
      const swPath = isSubDir ? '../sw.js' : './sw.js';
      const swScope = isSubDir ? '../' : './';

      navigator.serviceWorker.register(swPath, { scope: swScope })
        .then((registration) => {
          console.log('[EduKids PWA] Service Worker faol. Scope:', registration.scope);
        })
        .catch((error) => {
          if (window.location.protocol !== 'file:') {
            console.warn('[EduKids PWA] Service Worker xatoligi:', error);
          }
        });

      // UI ni sahifa yuklanganda ishga tushirish
      window.EduKidsPWA.updateUI();
    });
  } else {
    window.addEventListener('load', () => {
      window.EduKidsPWA.updateUI();
    });
  }

  /* ==========================================================================
     2. PWA O'rnatish Taklifi (beforeinstallprompt) ni ushlash
     ========================================================================== */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.EduKidsPWA.deferredPrompt = e;
    window.EduKidsPWA.isInstalled = false;
    window.EduKidsPWA.updateUI();
    console.log('[EduKids PWA] beforeinstallprompt hodisasi ushlandi 🚀');
    window.dispatchEvent(new CustomEvent('edukids-pwa-installable'));
  });

  window.addEventListener('appinstalled', () => {
    window.EduKidsPWA.isInstalled = true;
    window.EduKidsPWA.deferredPrompt = null;
    window.EduKidsPWA.updateUI();
    console.log('[EduKids PWA] EduKids muvaffaqiyatli o‘rnatildi! 🎉');
    window.dispatchEvent(new CustomEvent('edukids-pwa-installed'));
  });

  /* ==========================================================================
     3. Oflayn / Onlayn holatini kuzatish
     ========================================================================== */
  window.addEventListener('online', () => {
    window.EduKidsPWA.isOnline = true;
    console.log('[EduKids] Internet aloqasi tiklandi 🟢');
    window.dispatchEvent(new CustomEvent('edukids-connection-change', { detail: { online: true } }));
  });

  window.addEventListener('offline', () => {
    window.EduKidsPWA.isOnline = false;
    console.log('[EduKids] Oflayn rejimga o‘tildi 🔴');
    window.dispatchEvent(new CustomEvent('edukids-connection-change', { detail: { online: false } }));
  });

})();
