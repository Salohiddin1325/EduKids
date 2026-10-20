/**
 * EduKids — Universal PWA Service Worker (sw.js)
 * Strategiya: Cache-First (Keshdan birinchi olish va 100% oflayn ishlash)
 * Versiya: edukids-v1
 */

const CACHE_NAME = 'edukids-v1';

// Barcha statik resurslar ro'yxati (Pre-cache)
const PRECACHE_ASSETS = [
  // Root Hub
  './',
  './index.html',
  './manifest.json',

  // PWA Piktogrammalar
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/icon.svg',

  // Shared CSS
  './shared/shared.css',
  './shared/subscription.css',
  './shared/level-map.css',
  './shared/chatbot.css',

  // Shared JS Tizimlari
  './shared/pwa-register.js',
  './shared/uzbek-speech.js',
  './shared/audio.js',
  './shared/subscription.js',
  './shared/screen-vfx.js',
  './shared/gamification.js',
  './shared/level-map.js',
  './shared/mascot-companion.js',
  './shared/chatbot.js',

  // Matematika Moduli
  './math/index.html',
  './math/css/style.css',
  './math/js/audio.js',
  './math/js/confetti.js',
  './math/js/whiteboard.js',
  './math/js/lessons.js',
  './math/js/practice.js',
  './math/js/fraction-sandbox.js',
  './math/js/multiplication.js',
  './math/js/game.js',
  './math/js/app.js',

  // Ingliz Tili Moduli
  './english/index.html',
  './english/css/style.css',
  './english/js/data.js',
  './english/js/audio.js',
  './english/js/confetti.js',
  './english/js/exercises.js',
  './english/js/games.js',
  './english/js/app.js',

  // Fizika Moduli
  './physics/index.html',
  './physics/css/style.css',
  './physics/js/audio.js',
  './physics/js/confetti.js',
  './physics/js/concepts.js',
  './physics/js/experiments.js',
  './physics/js/physics-sandbox.js',
  './physics/js/quizzes.js',
  './physics/js/game.js',
  './physics/js/app.js'
];

/* ==========================================================================
   1. INSTALL HODISASI — Resurslarni keshga saqlash
   ========================================================================== */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Birorta fayl xato bo'lsa butun keshni buzmaslik uchun Promise.allSettled ishlatiladi
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`[SW] Resursni keshlab bo‘lmadi: ${url}`, err);
          });
        })
      );
    }).then(() => {
      // Kutmasdan darhol faollashish
      return self.skipWaiting();
    })
  );
});

/* ==========================================================================
   2. ACTIVATE HODISASI — Eski kesh versiyalarini tozalash
   ========================================================================== */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`[SW] Eski kesh o‘chirildi: ${name}`);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Barcha ochiq sahifalarni darhol boshqaruvga olish
      return self.clients.claim();
    })
  );
});

/* ==========================================================================
   3. FETCH HODISASI — Cache-First Strategiyasi va Oflayn Ishlash
   ========================================================================== */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Faqat GET so'rovlarini ushlaymiz
  if (request.method !== 'GET') return;

  // Brauzer plaginlari yoki ichki sxemalarni e'tiborsiz qoldirish
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      // Agar keshda mavjud bo'lsa, keshdan qaytaramiz (Cache-First)
      if (cachedResponse) {
        return cachedResponse;
      }

      // Keshda bo'lmasa, tarmoqdan yuklaymiz va keshga nusxa olamiz (Runtime Caching)
      return fetch(request).then((networkResponse) => {
        // Muvaffaqiyatli javob yoki tashqi CDN (masalan Google Fonts - opaque response)
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      }).catch((fetchError) => {
        // Tarmoq uzilgan (Oflayn) holatda zaxira (Fallback)
        if (request.mode === 'navigate') {
          // Navigatsiya bo'lsa qaysi fanga tegishli ekanligiga qarab mos sahifani beramiz
          const pathname = url.pathname;
          if (pathname.includes('/math/')) {
            return caches.match('./math/index.html');
          }
          if (pathname.includes('/english/')) {
            return caches.match('./english/index.html');
          }
          if (pathname.includes('/physics/')) {
            return caches.match('./physics/index.html');
          }
          return caches.match('./index.html');
        }

        // Rasm so'rovlari bo'lsa zaxira icon berish
        if (request.destination === 'image') {
          return caches.match('./icons/icon-192.png');
        }

        throw fetchError;
      });
    })
  );
});
