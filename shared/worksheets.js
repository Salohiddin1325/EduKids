/**
 * EduKids — Printable PDF Worksheets Generator
 * Clean, printable A4 worksheets for Math, English, and Physics.
 */

(function () {
  'use strict';

  class WorksheetsManager {
    constructor() {
      this.currentSheet = 'math_fractions';
      this.modalEl = null;
    }

    getLang() {
      return localStorage.getItem('kiddo_language') || 'uz';
    }

    openModal(sheetType = 'math_fractions') {
      this.currentSheet = sheetType;
      this.createModalDOM();
      this.renderCurrentSheet();
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

    setSheet(sheetType) {
      this.currentSheet = sheetType;
      this.renderCurrentSheet();
      document.querySelectorAll('.ws-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-sheet') === sheetType);
      });
    }

    print() {
      window.print();
    }

    renderCurrentSheet() {
      const isRu = this.getLang() === 'ru';
      const container = document.getElementById('worksheet-print-area');
      if (!container) return;

      if (this.currentSheet === 'math_fractions') {
        container.innerHTML = `
          <div class="ws-paper-header">
            <div>
              <h2 class="ws-paper-title">${isRu ? 'Математика: Раскрась Дроби 🍕' : 'Matematika: Kasrlarni Bo‘yang 🍕'}</h2>
              <p class="ws-paper-subtitle">${isRu ? 'Раздели и раскрась части пиццы и геометрических кругов' : 'Pitsa va doiralarning berilgan qismlarini rangli qalam bilan bo‘yang'}</p>
            </div>
            <div class="ws-paper-meta">
              <div>${isRu ? 'Имя ученика:' : 'O‘quvchi ismi:'} _______________</div>
              <div>${isRu ? 'Дата:' : 'Sana:'} _________ | ${isRu ? 'Оценка: ⭐⭐⭐' : 'Baho: ⭐⭐⭐'}</div>
            </div>
          </div>

          <div class="ws-paper-grid">
            <div class="ws-task-box">
              <h4>1. 1/2 (Yarim / Половина)</h4>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="#1E293B" stroke-width="2.5"/>
              </svg>
              <p class="ws-task-prompt">${isRu ? 'Раскрась ровно 1 из 2 частей' : 'Aynan 1 ta bo‘lagini bo‘yang'}</p>
            </div>

            <div class="ws-task-box">
              <h4>2. 1/4 (Chorak / Четверть)</h4>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="5" y1="50" x2="95" y2="50" stroke="#1E293B" stroke-width="2.5"/>
              </svg>
              <p class="ws-task-prompt">${isRu ? 'Раскрась ровно 1 из 4 частей' : 'Aynan 1 ta bo‘lagini bo‘yang'}</p>
            </div>

            <div class="ws-task-box">
              <h4>3. 3/4 (Uch chorak / Три четверти)</h4>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="5" y1="50" x2="95" y2="50" stroke="#1E293B" stroke-width="2.5"/>
              </svg>
              <p class="ws-task-prompt">${isRu ? 'Раскрась 3 части из 4' : '3 ta bo‘lagini bo‘yang'}</p>
            </div>

            <div class="ws-task-box">
              <h4>4. 2/3 (Uchdan ikki / Две трети)</h4>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#FFF" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="50" x2="50" y2="5" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="50" x2="89" y2="72" stroke="#1E293B" stroke-width="2.5"/>
                <line x1="50" y1="50" x2="11" y2="72" stroke="#1E293B" stroke-width="2.5"/>
              </svg>
              <p class="ws-task-prompt">${isRu ? 'Раскрась 2 части из 3' : '2 ta bo‘lagini bo‘yang'}</p>
            </div>
          </div>

          <div class="ws-paper-footer-bar">
            <span>EduKids Yoshlar Akademiyasi • Oflayn Ta'lim Varakasi</span>
            <span>www.edukids.uz</span>
          </div>
        `;
      } else if (this.currentSheet === 'english_tracing') {
        container.innerHTML = `
          <div class="ws-paper-header">
            <div>
              <h2 class="ws-paper-title">${isRu ? 'Английский: Прописи Букв A–Z ✏️' : 'Ingliz Tili: Harflar Yozish Mashqi ✏️'}</h2>
              <p class="ws-paper-subtitle">${isRu ? 'Обведи буквы по точкам и назови их звуки' : 'Nuqtalar ustidan harflarni chizib chiqing va ovoz chiqarib talaffuz qiling'}</p>
            </div>
            <div class="ws-paper-meta">
              <div>${isRu ? 'Ученик:' : 'O‘quvchi:'} _______________</div>
              <div>${isRu ? 'Дата:' : 'Sana:'} _________</div>
            </div>
          </div>

          <div style="margin: 20px 0;">
            <div class="ws-tracing-row"><span>A a</span> <span>A a</span> <span>A a</span> <span>A a</span></div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1E3A8A; margin-bottom: 16px;">🍎 A is for Apple (/æ/) — Olma</div>

            <div class="ws-tracing-row"><span>B b</span> <span>B b</span> <span>B b</span> <span>B b</span></div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1E3A8A; margin-bottom: 16px;">🐻 B is for Bear (/b/) — Ayiqcha</div>

            <div class="ws-tracing-row"><span>C c</span> <span>C c</span> <span>C c</span> <span>C c</span></div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1E3A8A; margin-bottom: 16px;">🐱 C is for Cat (/k/) — Mushukcha</div>

            <div class="ws-tracing-row"><span>D d</span> <span>D d</span> <span>D d</span> <span>D d</span></div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #1E3A8A; margin-bottom: 16px;">🐶 D is for Dog (/d/) — Kuchukcha</div>
          </div>

          <div class="ws-paper-footer-bar">
            <span>EduKids Phonics Workbook • KiddoLingo</span>
            <span>www.edukids.uz</span>
          </div>
        `;
      } else if (this.currentSheet === 'math_multiplication') {
        container.innerHTML = `
          <div class="ws-paper-header">
            <div>
              <h2 class="ws-paper-title">${isRu ? 'Математика: Лабиринт Умножения ✖️' : 'Matematika: Karra Jadvali Labirinti ✖️'}</h2>
              <p class="ws-paper-subtitle">${isRu ? 'Реши примеры и помоги ракете долететь до Марса' : 'Misollarni to‘g‘ri yeching va raketaga Marsga yetib borishiga yordam bering'}</p>
            </div>
            <div class="ws-paper-meta">
              <div>${isRu ? 'Ученик:' : 'O‘quvchi:'} _______________</div>
              <div>${isRu ? 'Оценка:' : 'Baho:'} _________</div>
            </div>
          </div>

          <div class="ws-paper-grid" style="grid-template-columns: repeat(3, 1fr); gap: 14px;">
            <div class="ws-task-box"><h4>2 × 3 = ____</h4></div>
            <div class="ws-task-box"><h4>3 × 4 = ____</h4></div>
            <div class="ws-task-box"><h4>5 × 5 = ____</h4></div>
            <div class="ws-task-box"><h4>4 × 6 = ____</h4></div>
            <div class="ws-task-box"><h4>7 × 3 = ____</h4></div>
            <div class="ws-task-box"><h4>8 × 2 = ____</h4></div>
            <div class="ws-task-box"><h4>6 × 6 = ____</h4></div>
            <div class="ws-task-box"><h4>9 × 4 = ____</h4></div>
            <div class="ws-task-box"><h4>10 × 7 = ____</h4></div>
          </div>

          <div style="border: 2px solid #1E293B; border-radius: 14px; padding: 14px; text-align: center; margin-top: 20px; font-weight: 800; background: #F8FAFC; color: #1E3A8A; font-size: 1.05rem;">
            🚀 ➔ [ 2×3 ] ➔ [ 3×4 ] ➔ [ 5×5 ] ➔ [ 6×6 ] ➔ 🪐 MARSGA QO‘NDINGIZ!
          </div>

          <div class="ws-paper-footer-bar">
            <span>EduKids Math Academy • MathKids</span>
            <span>www.edukids.uz</span>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="ws-paper-header">
            <div>
              <h2 class="ws-paper-title">${isRu ? 'Физика: Научная Лаборатория ⚛️' : 'Fizika: Ilmiy Tajribalar Varaqasi ⚛️'}</h2>
              <p class="ws-paper-subtitle">${isRu ? 'Соедини предметы с их физическими свойствами' : 'Buyumlarni ularning fizik xususiyatlari bilan chiziq orqali tutashtiring'}</p>
            </div>
            <div class="ws-paper-meta">
              <div>${isRu ? 'Ученик:' : 'O‘quvchi:'} _______________</div>
              <div>${isRu ? 'Оценка:' : 'Baho:'} _________</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-around; margin: 30px 0; font-size: 1.15rem; font-weight: 700;">
            <div style="display: flex; flex-direction: column; gap: 24px;">
              <div>🪨 Og‘ir Tosh (Камень)</div>
              <div>🪵 Yog‘och Bo‘lagi (Дерево)</div>
              <div>🧲 Magnit (Магнит)</div>
              <div>💡 Lampochka (Лампочка)</div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 24px; color: #1E3A8A;">
              <div>⚪ Suvda suzadi (Плавает)</div>
              <div>⚪ Suvga cho‘kadi (Тонет)</div>
              <div>⚪ Temirni tortadi (Притягивает)</div>
              <div>⚪ Tok ulanganda yonadi (Светится)</div>
            </div>
          </div>

          <div class="ws-paper-footer-bar">
            <span>EduKids Physics Lab • PhysicsKids</span>
            <span>www.edukids.uz</span>
          </div>
        `;
      }
    }

    createModalDOM() {
      if (document.getElementById('worksheets-modal-overlay')) {
        this.modalEl = document.getElementById('worksheets-modal-overlay');
        return;
      }

      const isRu = this.getLang() === 'ru';
      const overlay = document.createElement('div');
      overlay.id = 'worksheets-modal-overlay';
      overlay.className = 'worksheets-modal-overlay';
      overlay.innerHTML = `
        <div class="worksheets-modal-container">
          <div class="worksheets-modal-header">
            <div class="ws-header-title">
              <span class="ws-header-icon">🖨️</span>
              <span id="ws-modal-title">${isRu ? 'Печать заданий (A4 Worksheets)' : 'Chop Etiladigan Ish Varaqalari (A4)'}</span>
              <span class="ws-header-badge">A4 PDF</span>
            </div>
            <button type="button" class="ws-close-btn" onclick="window.EduWorksheets.closeModal()" aria-label="Yopish">✕</button>
          </div>

          <div class="worksheets-nav-tabs">
            <button type="button" class="ws-tab-btn active" data-sheet="math_fractions" onclick="window.EduWorksheets.setSheet('math_fractions')">
              🍕 ${isRu ? 'Дроби и пицца' : 'Kasrlar pitsasi'}
            </button>
            <button type="button" class="ws-tab-btn" data-sheet="english_tracing" onclick="window.EduWorksheets.setSheet('english_tracing')">
              ✏️ ${isRu ? 'Прописи A-Z' : 'A-Z Yozuv mashqi'}
            </button>
            <button type="button" class="ws-tab-btn" data-sheet="math_multiplication" onclick="window.EduWorksheets.setSheet('math_multiplication')">
              ✖️ ${isRu ? 'Таблица умножения' : 'Karra jadvali'}
            </button>
            <button type="button" class="ws-tab-btn" data-sheet="physics_lab" onclick="window.EduWorksheets.setSheet('physics_lab')">
              ⚛️ ${isRu ? 'Опыты по физике' : 'Fizika sinovi'}
            </button>
          </div>

          <div class="worksheets-modal-body">
            <div class="ws-preview-paper" id="worksheet-print-area">
              <!-- Content injected -->
            </div>
          </div>

          <div class="worksheets-modal-footer">
            <span class="ws-footer-hint">
              💡 ${isRu ? 'Нажмите "Печать", чтобы распечатать на бумаге или сохранить в PDF' : 'Printerdan qog‘ozga chiqarish yoki PDF saqlash uchun "Chop Etish"ni bosing'}
            </span>
            <button type="button" class="btn-print-action" onclick="window.EduWorksheets.print()">
              <span>🖨️</span>
              <span>${isRu ? 'Печать / PDF' : 'Chop Etish / PDF'}</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      this.modalEl = overlay;
    }
  }

  window.EduWorksheets = new WorksheetsManager();
})();
