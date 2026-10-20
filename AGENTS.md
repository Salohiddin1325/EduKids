# AGENTS.md — EduKids AI Agent Yo‘riqnomasi

EduKids (Yoshlar Akademiyasi) — 3–12 yoshdagi bolalar uchun interaktiv, xavfsiz va gamifikatsiyalashgan ta’lim portali (Ingliz tili, Matematika, Fizika).

## 1. Arxitektura va Texnologik Stack
- **Texnologiyalar:** Sof HTML5, Vanilla CSS3, Sof JavaScript (ES6+). Framework yoki bundler o‘rnatilmaydi.
- **Fayllar tuzilishi:**
  - `index.html` — Bosh portal (Hub).
  - `math/`, `english/`, `physics/` — Fanlar modullari (`index.html`, `css/style.css`, `js/main.js`).
  - `shared/` — Umumiy tizimlar (`shared.css`, `gamification.js`, `chatbot.*`, `subscription.*`, `level-map.*`, `screen-vfx.js`, `uzbek-speech.js`).
  - `DESIGN.md` — To‘liq dizayn tizimi, tokenlar va komponentlar katalogi.

## 2. Dizayn va UI Qoidalari (DESIGN.md ga qat’iy amal qiling)
- **Shriftlar:** Sarlavhalar va tugmalar: `'Fredoka', sans-serif`; Matnlar: `'Quicksand', sans-serif`.
- **Fan Ranglari:**
  - *Matematika:* Ko‘k (`#2563EB`), Qizg‘ish-olovrang (`#FF5E13`), Yashil (`#10B981`).
  - *Ingliz tili:* Pushti-marjon (`#FF5E7E`), Yalpiz (`#06D6A0`), Quyosh sariq (`#FFD166`).
  - *Fizika:* Elektr binafsha (`#8B5CF6`), Moviy (`#06B6D4`), Oltin qahrabo (`#F59E0B`).
- **Taktil 3D Tugmalar:** Pastki soya (`box-shadow: 0 4px 0 ...`), bosilganda `translateY(2px)`.
- **Cross-Browser & Safari iOS Majburiy Qoidasi:**
  - Matn belgilanmasligi: `-webkit-user-select: none; user-select: none;`
  - Shisha effekti: `-webkit-backdrop-filter: blur(14px); backdrop-filter: blur(14px);`
- **Mavzular:** Light va Dark rejim (`[data-theme="dark"]`), `transition: 0.35s`.
- **Ergonomika:** Sensor ekranda barcha bosiladigan elementlar kamida `44px × 44px`.

## 3. Kodlash va Xulq-atvor Standartlari
- **Oflayn Ishlash:** Ovozlar (Web Audio API), ma’lumotlar (`localStorage`) 100% oflayn ishlashi shart.
- **Xavfsizlik:** Kontent va AI chatbot promptlari faqat bolalar uchun do‘stona va xavfsiz bo‘lishi lozim.
- **Ikki Tilli Tizim:** Matnlar doimo O‘zbek (`uz`) va Rus (`ru`) tillariga mos bo‘lishi lozim.
- **Mavjud Kodni Saqlash:** Boshqa funksiyalarni buzmasdan, o‘zgarishlarni nuqtali va ehtiyotkorlik bilan kiriting.

## 4. O‘zgarishlarni Tekshirish Ro‘yxati (Checklist)
- [ ] `shared/` skriptlari va stillari yangi sahifaga to‘g‘ri ulanganmi?
- [ ] Yagona Header va `.subject-nav-item` tasmachasi buzilmaganmi?
- [ ] CSS-da `-webkit-` prefikslari (user-select, backdrop-filter) to‘liqmi?
- [ ] Mobil ekranda (320px–768px) interfeys toza va sig‘imli ko‘rinyaptimi?
