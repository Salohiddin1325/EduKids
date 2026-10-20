# 🎨 EduKids — Universal UI/UX Dizayn Tizimi (Design System)

Ushbu hujjat **EduKids (Yoshlar Akademiyasi)** platformasining barcha sahifalari, fanlari (*Ingliz tili, Matematika, Fizika*) hamda umumiy modullari (*Gamifikatsiya, Chatbot, Level Map, Obuna tizimi*) uchun **yagona UI/UX qoidalari, dizayn tokenlari, komponentlar anatomiyasi va uslubiy qo‘llanmasi** hisoblanadi.

Loyihaning barcha kelgusi sahifalari va komponentlari ushbu dizayn tizimiga qat’iy mos holda yaratilishi lozim.

---

## 📑 Mundarija

1. [Dizayn Falsafasi va Maqsadi](#1-dizayn-falsafasi-va-maqsadi)
2. [Tipografiya Tizimi (Typography)](#2-tipografiya-tizimi-typography)
3. [Ranglar Palitrasi va Mavzular (Colors & Themes)](#3-ranglar-palitrasi-va-mavzular-colors--themes)
   - [Global Neytral Ranglar](#global-neytral-ranglar)
   - [Fanlar Kesimidagi Ranglar](#fanlar-kesimidagi-ranglar)
   - [Light va Dark Mode Mexanizmi](#light-va-dark-mode-mexanizmi)
4. [Soya, Chegara va Bo‘shliqlar (Elevation, Radii & Spacing)](#4-soya-chegara-va-boshliqlar-elevation-radii--spacing)
5. [Mikro-harakatlar va Animatsiyalar (Motion & VFX)](#5-mikro-harakatlar-va-animatsiyalar-motion--vfx)
6. [Asosiy UI Komponentlar Anatomiyasi](#6-asosiy-ui-komponentlar-anatomiyasi)
   - [Yagona Header (Unified Header)](#61-yagona-header-unified-header)
   - [Fanlararo O‘tish Tugmalari (Subject Pill Strip)](#62-fanlararo-otish-tugmalari-subject-pill-strip)
   - [Gamifikatsiya Elementlari (Level, XP, Flame, Stars)](#63-gamifikatsiya-elementlari-level-xp-flame-stars)
   - [Tugmalar (3D Tactile Buttons)](#64-tugmalar-3d-tactile-buttons)
   - [Kartochkalar va Konteynerlar (Cards)](#65-kartochkalar-va-konteynerlar-cards)
   - [Modal Oynalar (Glassmorphic Modals)](#66-modal-oynalar-glassmorphic-modals)
   - [Darajalar Xaritasi (Level World Map)](#67-darajalar-xaritasi-level-world-map)
   - [Interaktiv Maskot va AI Yordamchi](#68-interaktiv-maskot-va-ai-yordamchi)
7. [Mobil va Sensorli Ekran Qoidalari (Mobile & Touch UX)](#7-mobil-va-sensorli-ekran-qoidalari-mobile--touch-ux)
8. [Yangi Fan yoki Komponent Qo‘shish Bo‘yicha Qo‘llanma](#8-yangi-fan-yoki-komponent-qoshish-boyicha-qollanma)

---

## 1. Dizayn Falsafasi va Maqsadi

* **Maqsadli Auditoriya:** 3 yoshdan 12 yoshgacha bo‘lgan bolalar, ularning ota-onalari va boshlang‘ich ta’lim o‘qituvchilari.
* **Hissiy Ohang (Tone & Emotion):** Quvnoq, rag‘batlantiruvchi, do‘stona, sehrli, xavfsiz va o‘yin shaklidagi (gamified).
* **Asosiy Printsiplar:**
  1. **Seziluvchan Taktillik (Tactile 3D Feel):** Har bir tugma haqiqiy o‘yinchoq kabi sezilishi kerak (pastki qalin 3D soyalar, bosganda pastga siljish).
  2. **Yumaloq va Xavfsiz Shakllar (Soft & Round Geometry):** O‘tkir burchaklar yo‘q! Barcha kartochkalar, tugmalar va piktogrammalar yumshoq radiusli (`16px`, `24px` yoki to‘liq pill `999px`).
  3. **Yorqin va Mazmunli Ranglar (Vibrant Chromatic Coding):** Har bir fan o‘zining individual ramziy rangiga ega, bu esa bolaga qayerda ekanligini bir zumda his qildiradi.
  4. **Matn Belgilanmasligi (Non-selectable UI):** Bolalar ekranni tez-tez bosganida ko‘k matn belgilanishi paydo bo‘lib qolmasligi uchun barcha boshqaruv elementlarida `-webkit-user-select: none; user-select: none;` bo‘lishi shart.
  5. **100% Oflayn va Xavfsiz Rag‘bat:** Yulduzchalar, XP barlar, ovozli maqtovlar va konfettilar bolaga uzluksiz yutuq hissini beradi.

---

## 2. Tipografiya Tizimi (Typography)

Loyihada Google Fonts orqali ulanadigan, bolalar uchun eng qulay ikkita asosiy shrift ishlatiladi:

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@500;600;700&display=swap');
```

| Shrift Nomi | Vazifasi | Tavsifi |
| :--- | :--- | :--- |
| **Fredoka** | Sarlavhalar, Tugmalar, Raqamlar, Brand Logo | Dumaloq, qalin, quvnoq va bolalar psixologiyasiga juda yaqin. |
| **Quicksand** | Tushuntirish matnlari, Ko‘rsatmalar, Modal matnlari | O‘qishga nihoyatda oson, toza va yumshoq chiziqli sans-serif. |

### Tipografik Iyerarxiya

```css
/* Asosiy matn o'lchamlari va parametrlar */
--font-display: 'Fredoka', sans-serif;
--font-body: 'Quicksand', 'Fredoka', sans-serif;

/* Masshtab */
--text-hero:    2.4rem;  /* 38-42px - Bosh sahifa va katta tabriklar */
--text-h1:      1.8rem;  /* 28-30px - Sahifa va modul sarlavhalari */
--text-h2:      1.4rem;  /* 22-24px - Karta va blok sarlavhalari */
--text-h3:      1.15rem; /* 18-20px - Kichik sarlavhalar, o'yin savollari */
--text-body:    1.0rem;  /* 16px - Asosiy tushuntirish matni */
--text-small:   0.88rem; /* 14px - Tugma yorliqlari, daraja statusi */
--text-caption: 0.75rem; /* 12px - XP foizlari, kichik belgilar */
```

---

## 3. Ranglar Palitrasi va Mavzular (Colors & Themes)

### Global Neytral Ranglar

| Token | Light Mode Qiymati | Dark Mode Qiymati | Tavsifi |
| :--- | :--- | :--- | :--- |
| `--bg-surface` | `#FFFFFF` | `#1E293B` | Asosiy kartalar yuzasi |
| `--bg-surface-soft` | `#F8FAFC` | `#0F172A` | Ichki bloklar, fon yorliqlari |
| `--text-main` | `#1E293B` | `#F8FAFC` | Asosiy o‘qiladigan matn |
| `--text-muted` | `#64748B` | `#94A3B8` | Ikkinchi darajali tushuntirish matni |
| `--border-color` | `#E2E8F0` | `#334155` | Chiziqlar va bo‘linmalar |
| `--header-bg` | `rgba(255, 255, 255, 0.92)` | `rgba(15, 23, 42, 0.92)` | Shaffof sarlavha foni |

---

### Fanlar Kesimidagi Ranglar

Har bir fan bolada vizual assotsiatsiyani shakllantirish uchun maxsus ranglar tizimi bilan kodlangan:

#### 1. 🚀 Matematika (MathKids)
* **Asosiy Falsafa:** Fazoviy, mantiqiy va baquvvat tuyg‘u.
* **Belgisi (Icon):** 🚀 / 📐 / 🔢
* **Ranglar:**
  * `--blue`: `#2563EB` (Asosiy ko‘k)
  * `--blue-light`: `#3A86FF`
  * `--blue-shadow`: `#1D4ED8` (3D tugma soyasi)
  * `--orange`: `#FF5E13` (Diqqatni jalb qiluvchi aksent)
  * `--orange-shadow`: `#C2410C`
  * `--green`: `#10B981` (To‘g‘ri javoblar va tasdiq)
  * `--yellow`: `#FFD166` (Yulduzlar va ballar)

#### 2. 🦁 Ingliz Tili (KiddoLingo)
* **Asosiy Falsafa:** Ochiq, iliq, ijtimoiy va so‘zlashuvchan tuyg‘u.
* **Belgisi (Icon):** 🦁 / 🔤 / 🎈
* **Ranglar:**
  * `--coral`: `#FF5E7E` (Asosiy iliq pushti)
  * `--coral-shadow`: `#D93858`
  * `--mint`: `#06D6A0` (Tiniq yalpiz yashil)
  * `--mint-shadow`: `#048C68`
  * `--yellow`: `#FFD166` (Quyosh sariq)
  * `--sky`: `#48CAE4` (Ochiq osmon ko‘k)
  * `--purple`: `#845EC2` (Sehrli binafsha)

#### 3. ⚛️ Fizika (PhysicsKids)
* **Asosiy Falsafa:** Ilmiy kashfiyotlar, elektr, magnit va koinot sirlari.
* **Belgisi (Icon):** ⚛️ / 💡 / 🧲
* **Ranglar:**
  * `--purple`: `#8B5CF6` (Elektr binafsha)
  * `--purple-light`: `#A78BFA`
  * `--purple-shadow`: `#6D28D9`
  * `--cyan`: `#06B6D4` (Neon moviy)
  * `--cyan-shadow`: `#0E7490`
  * `--amber`: `#F59E0B` (Quyosh energiyasi / Olov)
  * `--amber-shadow`: `#B45309`
  * `--pink`: `#EC4899` (Optik nurlar)

---

### Light va Dark Mode Mexanizmi

Mavzuni boshqarish HTML root tegiga `data-theme="dark"` atributi qo‘shilishi bilan amalga oshadi:

```javascript
// Mavzuni almashtirish kodi namunasi
const currentTheme = document.documentElement.getAttribute('data-theme');
const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('kiddos_theme', newTheme);
```

```css
/* Silliq rang almashinuvi */
body {
  transition: background 0.35s ease, color 0.35s ease;
}
```

---

## 4. Soya, Chegara va Bo‘shliqlar (Elevation, Radii & Spacing)

### Border Radius Shkalasi

```css
--radius-pill:   999px; /* Tugmalar, Badge, Nav-item, XP bar */
--radius-xl:     24px;  /* Bosh sahifa kartalari, asosiy o'yin paneli */
--radius-lg:     20px;  /* Modal oynalar, modul qutilari */
--radius-md:     16px;  /* Kartochkalar, savol bloklari */
--radius-sm:     12px;  /* Input maydonlari, avatar ramkalari */
```

### 3D Tactile Tugma Soyasi Formulalari

Bolalar uchun mo‘ljallangan tugmalar tekis (flat) bo‘lmasligi, ularni bosish istagi tug‘ilishi kerak:

```css
/* Standart 3D Tugma effekti */
.btn-tactile-primary {
  background: var(--blue);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-pill);
  padding: 12px 28px;
  box-shadow: 0 4px 0 var(--blue-shadow), 0 8px 18px rgba(37, 99, 235, 0.3);
  transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-tactile-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 var(--blue-shadow), 0 12px 22px rgba(37, 99, 235, 0.35);
}

.btn-tactile-primary:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--blue-shadow), 0 4px 10px rgba(37, 99, 235, 0.2);
}
```

### Glassmorphism Qoidasi

Barcha sarlavha va qalqib chiquvchi modal panellarda zamonaviy shaffof shisha effekti qo‘llanadi:

```css
background: rgba(255, 255, 255, 0.92);
-webkit-backdrop-filter: blur(14px);
backdrop-filter: blur(14px);
border: 2px solid var(--border-color);
```

---

## 5. Mikro-harakatlar va Animatsiyalar (Motion & VFX)

EduKids interfeysida animatsiya shunchaki bezak emas, balki bolaga xatti-harakati uchun javob reaktsiyasidir.

### Bouncy Spring Easing
Barcha o‘tish va hover effektlarida standart `ease` o‘rniga **elastik spring egri chizig‘i** ishlatiladi:
```css
transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Mavjud Asosiy Keyframe Animatsiyalari

1. **`flamePulse`** — Kunlik streak (olov) yonib turishi:
   ```css
   @keyframes flamePulse {
     0%   { transform: scale(1) rotate(-3deg); filter: drop-shadow(0 0 4px rgba(234, 88, 12, 0.4)); }
     50%  { transform: scale(1.22) rotate(4deg); filter: drop-shadow(0 0 10px rgba(255, 107, 0, 0.8)); }
     100% { transform: scale(1.08) rotate(-2deg); filter: drop-shadow(0 0 7px rgba(245, 158, 11, 0.7)); }
   }
   ```
2. **`proCrownPulse` & `crownWiggle`** — Pro obuna toji tebranishi:
   ```css
   @keyframes crownWiggle {
     0%, 80%, 100% { transform: rotate(0deg); }
     85% { transform: rotate(-8deg) scale(1.1); }
     95% { transform: rotate(8deg) scale(1.1); }
   }
   ```
3. **`mascotBob`** — Maskot qahramonning suzib turishi.
4. **VFX Effektlar (`shared/screen-vfx.js`):**
   * `ScreenVFX.confetti()` — Bosqich tugaganda butun ekranga uchuvchi yorqin zarralar.
   * `ScreenVFX.screenShake()` — Noto‘g‘ri javobda ekranning yengil silkinishi.
   * `ScreenVFX.floatingXP(x, y, "+20 XP")` — Sichqoncha/barmoq tekkan joydan yuqoriga suzib chiquvchi XP yozuvi.

---

## 6. Asosiy UI Komponentlar Anatomiyasi

### 6.1. Yagona Header (Unified Header)

Har bir sahifaning yuqori qismida yagona boshqaruv paneli joylashgan:

```html
<header class="physics-header">
  <div class="header-inner">
    <!-- 1. Chap tomon: Brand Logo -->
    <div class="brand-link" onclick="location.reload()">
      <span class="brand-icon">⚛️</span>
      <div class="brand-title">
        <h1>PhysicsKids</h1>
        <span>Fizika — Tabiat Mo‘jizalari! 💡</span>
      </div>
    </div>

    <!-- 2. Markaz: Fanlararo tezkor o'tish tasmachasi -->
    <nav class="header-subject-nav">
      <a href="../english/index.html" class="subject-nav-item">🦁 Ingliz Tili</a>
      <a href="../math/index.html" class="subject-nav-item">🚀 Matematika</a>
      <span class="subject-nav-item active-subject">⚛️ Fizika</span>
    </nav>

    <!-- 3. O'ng tomon: Gamifikatsiya va Amallar -->
    <div class="header-actions">
      <!-- Level & XP Pill -->
      <div class="header-level-pill" onclick="window.LevelMap && LevelMap.open()">...</div>
      <!-- Streak Flame -->
      <div class="flame-streak-chip"><span class="flame-icon">🔥</span><span class="streak-count">3</span></div>
      <!-- Star Store -->
      <button class="btn-star-store" onclick="window.SubscriptionModal && SubscriptionModal.openStore()">⭐ 120</button>
      <!-- Theme & Lang -->
      <button class="action-btn-circle" id="theme-toggle">🌙</button>
    </div>
  </div>
</header>
```

### 6.2. Fanlararo O‘tish Tugmalari (Subject Pill Strip)

* Faol bo‘lmagan fanlar: yumshoq matn rangi, ustiga borganda oq fon va `translateY(-1px)`.
* Faol fan (`.active-subject`): Rangli gradient fon, oq matn, soya va `cursor: default`.
* **Muhim:** Har doim `-webkit-user-select: none; user-select: none;` kiritilgan bo‘lishi shart.

### 6.3. Gamifikatsiya Elementlari (Level, XP, Flame, Stars)

* **Level Pill:** Chapda daraja nishoni (masalan: `🌱 Havaskor`, `⚡ Izlanuvchi`, `🎓 Professor`), o‘ngda mini progress bar (`.xp-bar-wrap`).
* **Flame Streak:** Bolaning qatorasiga necha kun kirganini ko‘rsatadi, animatsiyali olov belgisi bilan ta’minlangan.
* **Star Store Button:** To‘plangan yulduzlar hisobi. Bosilganda mukofotlar do‘koni ochiladi.

### 6.4. Tugmalar (3D Tactile Buttons)

| Tugma Turi | Klass Nomi | Foydalanish O‘rni |
| :--- | :--- | :--- |
| **Bosh Amal (CTA)** | `.btn-primary`, `.btn-tactile-primary` | "Boshlash", "Tekshirish", "Keyingisi" |
| **Ikkinchi Darajali** | `.btn-secondary`, `.btn-ghost` | "Qaytadan", "Yordam", "Orqaga" |
| **Dumaloq Belgili** | `.action-btn-circle`, `.btn-sound-toggle` | Ovozni o‘chirish, Tungi rejim, Yopish `✕` |
| **Yulduzcha Do‘koni** | `.btn-star-store` | Yulduzlarni sarflash do‘koni |

### 6.5. Kartochkalar va Konteynerlar (Cards)

Kartochkalar oq fonda, yumshoq chegaralar va pastel gradientlar bilan quriladi:

```css
.card-base {
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 24px;
  box-shadow: var(--card-shadow);
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s ease;
}

.card-base:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px -10px rgba(0, 0, 0, 0.12);
}
```

### 6.6. Modal Oynalar (Glassmorphic Modals)

Barcha modal oynalar (`#star-store-modal`, `#level-map-modal`, `#parent-gate-modal`) quyidagi tuzilishga ega:
* `modal-overlay`: Qoraytirilgan va xiralashtirilgan fon (`backdrop-filter: blur(8px)`).
* `modal-container`: Markazda joylashgan, yuqoridan `popIn` animatsiyasi bilan paydo bo‘luvchi oyna.
* `modal-header`: Sarlavha, emoji nishoni va mutlaq o‘ng burchakdagi `.btn-modal-close` tugmasi.

### 6.7. Darajalar Xaritasi (Level World Map)

* Duolingo / Candy Crush uslubidagi ilon izi (zigzag) yo‘l.
* Tugunlar holatlari:
  * **Bajarilgan (Completed):** Yashil yoki Oltin nishon, 3 ta to‘liq yulduzcha.
  * **Hozirgi (Current):** Pulsatsiyalanuvchi nurlar (`box-shadow: 0 0 20px ...`), sakrab turuvchi ko‘rsatkich.
  * **Qulflangan (Locked):** Kulrang qulf belgisi `🔒`, bosilganda bolaga zarur daraja yoki Pro reja haqida xabar beradi.

### 6.8. Interaktiv Maskot va AI Yordamchi

* Har bir fanda o‘z xos qahramoni mavjud:
  * Matematika: **Robo 🤖**
  * Ingliz tili: **Leo 🦁**
  * Fizika: **Nyuton Boyo‘g‘li 🦉** yoki **Atomvoy ⚛️**
* Ekranning quyi o‘ng burchagida suzib yuradi (`.mascot-avatar-fab`).
* Bolaga xush kelibsiz deydi, maslahat beradi va o‘zbekcha ovozda gapiradi (`uzbek-speech.js`).

---

## 7. Mobil va Sensorli Ekran Qoidalari (Mobile & Touch UX)

Bolalar aksariyat hollarda planshet yoki telefonlardan foydalanadi. Shu sababli quyidagi qoidalar majburiydir:

1. **Minimal Bosish Maydoni (Touch Target):** Har qanday tugma, belgi yoki javob varianti kamida **`44px x 44px`** o‘lchamda bo‘lishi shart.
2. **Kengaytirilgan Breakpoints:**
   * **Desktop Katta:** `> 1200px` (To‘liq 3-4 ustunli panellar)
   * **Noutbuk / Planshet Landscape:** `1024px` (2-3 ustun)
   * **Planshet Portrait:** `768px - 1023px` (Header elementlari ixchamlashadi)
   * **Mobil Telefon:** `< 768px` (Header ustun shakliga keladi, nav pufakchalari gorizontal skroll bo‘ladi, o‘yin kartalari 1 ustunga o‘tadi)
   * **Kichik Mobil:** `< 480px` (Shriftlar ixchamlashadi, paddinglar 12px ga qisqaradi)
3. **Safari va iOS uchun Maxsus Qoidalar:**
   * Matn belgilanishini o‘chirish uchun har doim ikkita qator birga yoziladi:
     ```css
     -webkit-user-select: none;
     user-select: none;
     ```
   * Ko‘k sensor nurini yo‘qotish:
     ```css
     -webkit-tap-highlight-color: transparent;
     ```
   * Shisha effekti uchun:
     ```css
     -webkit-backdrop-filter: blur(14px);
     backdrop-filter: blur(14px);
     ```

---

## 8. Yangi Fan yoki Komponent Qo‘shish Bo‘yicha Qo‘llanma

### Yangi Fan Qo‘shilganda (Masalan: Kimyo yoki Astronomiya):

1. **Fanning o‘ziga xos 3 ta asosiy rangini tanlang:**
   * 1 ta dominant rang (masalan, Zumrad yashil `#059669`).
   * 1 ta 3D soya rangi (masalan, To‘q yashil `#047857`).
   * 1 ta yorqin aksent rangi (masalan, Neon sariq `#FACC15`).
2. **Fanning ramziy emojisini tanlang:** (Masalan: `🧪 Kimyo` yoki `🪐 Astronomiya`).
3. **Mavjud sahifalarning Header qismidagi Nav tasmachasiga qo‘shing:**
   ```html
   <a href="../chemistry/index.html" class="subject-nav-item">
     <span class="subject-icon">🧪</span>
     <span class="subject-label">Kimyo</span>
   </a>
   ```
4. **Umumiy skript va stillarni ulang:**
   Har qanday yangi fanning `index.html` sahifasiga quyidagi fayllar ulanishi lozim:
   ```html
   <link rel="stylesheet" href="../shared/shared.css">
   <link rel="stylesheet" href="../shared/subscription.css">
   <link rel="stylesheet" href="../shared/level-map.css">
   <link rel="stylesheet" href="../shared/chatbot.css">

   <!-- Skriptlar -->
   <script src="../shared/gamification.js"></script>
   <script src="../shared/screen-vfx.js"></script>
   <script src="../shared/uzbek-speech.js"></script>
   <script src="../shared/mascot-companion.js"></script>
   <script src="../shared/level-map.js"></script>
   <script src="../shared/subscription.js"></script>
   <script src="../shared/chatbot.js"></script>
   ```

---

*Hujjat versiyasi: 1.0.0*  
*Muallif: EduKids UI/UX Arxitektura Jamoasi*  
*Oxirgi yangilanish: 2026-yil*
