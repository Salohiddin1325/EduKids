/**
 * PhysicsKids - Physics Rules & Concepts Dataset & Logic
 * Simple, visual explanations for beginners with real-world examples and interactive checks.
 * Fully bilingual: Uzbek & Russian.
 */

const PHYSICS_CONCEPTS = [
  // --- 1. GRAVITY ---
  {
    id: 'gravity',
    titleUz: "Gravitatsiya: Nega Narsalar Pastga Tushadi?",
    titleRu: "Гравитация: Почему предметы падают вниз?",
    titleEn: "Gravity: Why Do Things Fall Down?",
    symbol: "🍏",
    color: "#8B5CF6",
    badgeUz: "Yashirin Tortish Kuchi!",
    badgeRu: "Невидимая сила притяжения!",
    summaryUz: "Yer — ulkan bir gigant magnitdek barcha narsalarni o‘zining markaziga qarab tortib turadi!",
    summaryRu: "Земля — словно гигантский магнит, притягивающий все вещи к своему центру!",
    summaryEn: "Earth pulls everything toward its center like an invisible gentle hand!",
    explanationUz: `
      <div class="concept-detail-box">
        <h4>🍎 Nyuton va Olma Sadosi:</h4>
        <p>Agar qo‘lingizdagi to‘pni yoki olmani qo‘yib yuborsangiz, u nima uchun tepaga uchib ketmaydi? Chunki Yer uni <strong>Gravitatsiya (tortishish kuchi)</strong> bilan quchoqlab oladi!</p>
        <p>Oyda esa gravitatsiya Yerga qaraganda 6 barobar kuchsizroq, shuning uchun kosmonavtlar oyda xuddi quyonlardek baland sakray olishadi! 🌕</p>
      </div>
    `,
    explanationRu: `
      <div class="concept-detail-box">
        <h4>🍎 Ньютон и яблоко:</h4>
        <p>Если отпустить мяч или яблоко, почему они не улетают в небо? Потому что Земля обнимает их своей <strong>Гравитацией (силой притяжения)</strong>!</p>
        <p>На Луне гравитация в 6 раз слабее, чем на Земле, поэтому космонавты могут прыгать там высоко, как зайчики! 🌕</p>
      </div>
    `,
    realWorldExampleUz: "Daraxtdan uzilgan yaproqlar, sakraganimizda yerga qaytishimiz va to‘kilib ketgan sharbat — hammasi gravitatsiya tufayli pastga tushadi!",
    realWorldExampleRu: "Опадающие с деревьев листья, наше приземление после прыжка и пролитый сок — всё падает вниз из-за гравитации!",
    factsUz: [
      { icon: "🌍", text: "Yer gravitatsiyasi bizni koinotga uchib ketishdan asraydi." },
      { icon: "🪶", text: "Havoning qarshiligi bo‘lmaganda og‘ir tosh va yengil pat bir vaqtda tushadi!" },
      { icon: "🧑‍🚀", text: "Kosmosda vaznsizlik bor, u yerda suv tomchilari sharcha bo‘lib havoda suzadi." }
    ],
    factsRu: [
      { icon: "🌍", text: "Земная гравитация удерживает нас и не дает улететь в открытый космос." },
      { icon: "🪶", text: "Без сопротивления воздуха тяжелый камень и легкое перо падают одновременно!" },
      { icon: "🧑‍🚀", text: "В космосе царит невесомость, там капли воды летают в виде круглых шариков." }
    ],
    quickTest: {
      questionUz: "Qo‘lingizdagi koptokni havoga otsangiz, u nima uchun yana pastga tushadi?",
      questionRu: "Если подбросить мячик вверх, почему он обязательно упадет обратно?",
      optionsUz: [
        { text: "Gravitatsiya kuchi tortgani uchun", correct: true },
        { text: "Charchab qolgani uchun", correct: false },
        { text: "Shamollab qolgani uchun", correct: false }
      ],
      optionsRu: [
        { text: "Потому что сила гравитации притягивает его", correct: true },
        { text: "Потому что он устал летать", correct: false },
        { text: "Потому что он замерз", correct: false }
      ],
      explanationUz: "To‘g‘ri! Yerning tortishish kuchi (Gravitatsiya) uni pastga qaytaradi!",
      explanationRu: "Правильно! Сила притяжения Земли (гравитация) возвращает его вниз!"
    }
  },

  // --- 2. MAGNETISM ---
  {
    id: 'magnetism',
    titleUz: "Magnetizm: Tortishish va Itarish Mo‘jizasi",
    titleRu: "Магнетизм: Чудо притяжения и отталкивания",
    titleEn: "Magnetism: Attract and Repel",
    symbol: "🧲",
    color: "#EC4899",
    badgeUz: "Sehrli Qutblar!",
    badgeRu: "Волшебные полюса!",
    summaryUz: "Har bir magnitning Shimoliy (N) va Janubiy (S) qutblari bor. Bir xil qutblar itarishadi, qarama-qarshilari esa mahkam tortishadi!",
    summaryRu: "У каждого магнита есть Северный (N) и Южный (S) полюса. Одинаковые полюса отталкиваются, а разные — крепко притягиваются!",
    summaryEn: "Magnets have North (N) and South (S) poles. Opposite poles attract, like poles push away!",
    explanationUz: `
      <div class="concept-detail-box">
        <h4>🧲 Magnitning Qonuni:</h4>
        <p><span class="badge-n">Qizil (N)</span> + <span class="badge-s">Moviy (S)</span> ➜ <strong>TORTISHADI (Attract)</strong> 💕</p>
        <p><span class="badge-n">Qizil (N)</span> + <span class="badge-n">Qizil (N)</span> ➜ <strong>ITARISHADI (Repel)</strong> 🚫</p>
        <p>Magnitlar temir va po‘latdan yasalgan narsalarni (mixlar, qisqichlar, tangalar) osonlikcha o‘ziga yopishtirib oladi, lekin yog‘och va plastmassani tortmaydi!</p>
      </div>
    `,
    explanationRu: `
      <div class="concept-detail-box">
        <h4>🧲 Закон магнита:</h4>
        <p><span class="badge-n">Красный (N)</span> + <span class="badge-s">Синий (S)</span> ➜ <strong>ПРИТЯГИВАЮТСЯ (Attract)</strong> 💕</p>
        <p><span class="badge-n">Красный (N)</span> + <span class="badge-n">Красный (N)</span> ➜ <strong>ОТТАЛКИВАЮТСЯ (Repel)</strong> 🚫</p>
        <p>Магниты легко притягивают железные и стальные предметы (скрепки, гвоздики, монетки), но не притягивают дерево и пластик!</p>
      </div>
    `,
    realWorldExampleUz: "Muzlatgich eshigidagi chiroyli stikerlar, kompas milining shimolga burilishi va tezyurar poyezdlar (Maglev) magnit kuchida ishlaydi!",
    realWorldExampleRu: "Наклейки на холодильнике, стрелка компаса и сверхбыстрые поезда на магнитной подушке работают на силе магнитов!",
    factsUz: [
      { icon: "🧭", text: "Kompas mili Yerning ulkan magnit maydoniga qarab yo‘l ko‘rsatadi." },
      { icon: "📎", text: "Bitta magnit bir nechta qisqichni ketma-ket ilashtirib oladi." },
      { icon: "🚂", text: "Yaponiyadagi poyezdlar magnit yostig‘ida relsdan 10 sm ko‘tarilib uchadi!" }
    ],
    factsRu: [
      { icon: "🧭", text: "Стрелка компаса показывает на север по магнитному полю Земли." },
      { icon: "📎", text: "Один магнит может удержать целую цепочку скрепок." },
      { icon: "🚂", text: "Поезда на магнитной подушке парят в 10 см над рельсами!" }
    ],
    quickTest: {
      questionUz: "Magnit qaysi buyumni o‘ziga torta oladi?",
      questionRu: "Какой предмет сможет притянуть магнит?",
      optionsUz: [
        { text: "Plastmassa o‘yinchoq 🧸", correct: false },
        { text: "Temir qisqich (skrepka) 📎", correct: true },
        { text: "Yog‘och chizg‘ich 🪵", correct: false }
      ],
      optionsRu: [
        { text: "Пластиковую игрушку 🧸", correct: false },
        { text: "Железную скрепку 📎", correct: true },
        { text: "Деревянную линейку 🪵", correct: false }
      ],
      explanationUz: "To‘g‘ri! Magnit temirdan yasalgan qisqichni bir zumda o‘ziga yopishtiradi!",
      explanationRu: "Верно! Магнит моментально притягивает металлическую скрепку!"
    }
  },

  // --- 3. LIGHT & SHADOWS ---
  {
    id: 'light-shadows',
    titleUz: "Yorug‘lik va Soyalar: Yashirin Soyalar Qayerdan Keladi?",
    titleRu: "Свет и тени: Откуда берутся тени?",
    titleEn: "Light & Shadows: The Journey of Rays",
    symbol: "💡",
    color: "#F59E0B",
    badgeUz: "To‘g‘ri Chiziqli Nurlar!",
    badgeRu: "Прямые лучи!",
    summaryUz: "Yorug‘lik nurlari doim to‘g‘ri yo‘nalishda uchadi. Agar yo‘lini to‘sib qo‘ysangiz, uning orqasida soya paydo bo‘ladi!",
    summaryRu: "Лучи света всегда летят по прямой линии! Если перекрыть им путь, позади появится тень!",
    summaryEn: "Light travels in straight lines! When something blocks its path, a shadow is formed behind it!",
    explanationUz: `
      <div class="concept-detail-box">
        <h4>☀️ Soya Qanday Hosil Bo‘ladi?</h4>
        <p>Quyosh yoki chiroq nurlari oldiga qo‘lingizni tutsangiz, nurlar qo‘lingizdan o‘ta olmaydi. Nurlar yetib bormagan joy esa devorda <strong>Qora Soya (Shadow)</strong> bo‘lib ko‘rinadi!</p>
        <p>Chiroqqa qanchalik yaqin kelsangiz, soyangiz shunchalik ulkan bo‘lib kattalashadi! 🐰</p>
      </div>
    `,
    explanationRu: `
      <div class="concept-detail-box">
        <h4>☀️ Как появляется тень?</h4>
        <p>Если подставить ладошку перед лампой или солнцем, лучи не смогут пройти сквозь неё. Место, куда свет не попал, образует на стене <strong>тень (Shadow)</strong>!</p>
        <p>Чем ближе ты к источнику света, тем больше становится твоя тень! 🐰</p>
      </div>
    `,
    realWorldExampleUz: "Quyoshli kunda ko‘chada yursangiz, soyangiz sizning orqangizdan bir qadam ham qolmasdan ergashib yuradi!",
    realWorldExampleRu: "В солнечный день на улице твоя тень ходит за тобой след в след, словно верный друг!",
    factsUz: [
      { icon: "⚡", text: "Yorug‘lik koinotdagi eng tez narsa: 1 soniyada 300 000 km masofani bosib o‘tadi!" },
      { icon: "🌈", text: "Oq yorug‘lik nuri yomg‘ir tomchisidan o‘tganda 7 rangli kamalakka aylanadi." },
      { icon: "🎭", text: "Barmoqlaringiz soyasi orqali devorda quyoncha va qushchalar yasashingiz mumkin!" }
    ],
    factsRu: [
      { icon: "⚡", text: "Свет — самый быстрый во Вселенной: пролетает 300 000 км всего за 1 секунду!" },
      { icon: "🌈", text: "Белый луч солнца, проходя сквозь каплю дождя, превращается в радугу из 7 цветов." },
      { icon: "🎭", text: "С помощью теней от пальцев можно создавать на стене зайчиков и птичек!" }
    ],
    quickTest: {
      questionUz: "Quyoshli kunda daraxtning orqasida nima paydo bo‘ladi?",
      questionRu: "Что появляется позади дерева в ясный солнечный день?",
      optionsUz: [
        { text: "Daraxtning soyasi 🌳", correct: true },
        { text: "Kamalak 🌈", correct: false },
        { text: "Olov 🔥", correct: false }
      ],
      optionsRu: [
        { text: "Тень дерева 🌳", correct: true },
        { text: "Радуга 🌈", correct: false },
        { text: "Огонь 🔥", correct: false }
      ],
      explanationUz: "To‘g‘ri! Daraxt quyosh nurlarini to‘sib qo‘ygani uchun yerda uning soyasi tushadi!",
      explanationRu: "Верно! Дерево преграждает путь солнечным лучам, и на земле появляется тень!"
    }
  },

  // --- 4. MOTION & SPEED ---
  {
    id: 'motion',
    titleUz: "Harakat va Kuch: Itarish, Tortish va Ishqalanish",
    titleRu: "Движение и сила: Толкай, тяни и трение",
    titleEn: "Motion & Speed: Push, Pull & Friction",
    symbol: "🏎️",
    color: "#06B6D4",
    badgeUz: "Harakat Kuchi!",
    badgeRu: "Сила движения!",
    summaryUz: "Narsalar o‘z-o‘zidan harakatlanmaydi! Ularni yo itarish (Push), yoki tortish (Pull) kerak bo‘ladi!",
    summaryRu: "Вещи не двигаются сами по себе! Чтобы они начали двигаться, их нужно либо толкнуть (Push), либо потянуть (Pull)!",
    summaryEn: "Objects cannot move by themselves! They need a push or a pull force to start moving!",
    explanationUz: `
      <div class="concept-detail-box">
        <h4>🚗 Tezlik va Ishqalanish Sirlari:</h4>
        <p><strong>Itarish (Push):</strong> Koptokni tepish yoki aravachani oldinga surish.</p>
        <p><strong>Tortish (Pull):</strong> Arqonni o‘zingizga tortish yoki eshikni ochish.</p>
        <p><strong>Ishqalanish (Friction):</strong> Muz ustida silliq bo‘lgani uchun chana tez uchadi, gilam ustida esa g‘adir-budurlik uni to‘xtatib qoladi!</p>
      </div>
    `,
    explanationRu: `
      <div class="concept-detail-box">
        <h4>🚗 Секреты скорости и трения:</h4>
        <p><strong>Толкать (Push):</strong> Пнуть мяч или катить тележку вперед.</p>
        <p><strong>Тянуть (Pull):</strong> Тянуть за веревочку или открывать дверь на себя.</p>
        <p><strong>Трение (Friction):</strong> По гладкому льду санки летят с ветерком, а на ковре неровности быстро их тормозят!</p>
      </div>
    `,
    realWorldExampleUz: "Velosiped tormozini bosganingizda, rezina g‘ildirakka ishqalanadi va velosiped to‘xtaydi!",
    realWorldExampleRu: "Когда ты жмешь на тормоз велосипеда, резиновые колодки трутся о колесо и останавливают его!",
    factsUz: [
      { icon: "🎿", text: "Qor va muz ustida ishqalanish juda kam, shuning uchun chang‘i uchish oson!" },
      { icon: "🛞", text: "G‘ildiraklarning ixtiro qilinishi insoniyatga yuklarni oson tashish imkonini berdi." },
      { icon: "🚀", text: "Raketalar pastga olov purkab, o‘zini kuch bilan osmonga itaradi." }
    ],
    factsRu: [
      { icon: "🎿", text: "На снегу и льду трение очень маленькое, поэтому кататься на лыжах так легко!" },
      { icon: "🛞", text: "Изобретение колеса позволило людям легко перевозить тяжелые грузы." },
      { icon: "🚀", text: "Ракеты выбрасывают струю огня вниз и с мощной силой взмывают в небо." }
    ],
    quickTest: {
      questionUz: "Aravachani oldinga siljitish uchun nima qilish kerak?",
      questionRu: "Что нужно сделать, чтобы тележка поехала вперед?",
      optionsUz: [
        { text: "Uni oldinga itarish kerak (Push) 🛒", correct: true },
        { text: "Uni kutib o‘tirish kerak", correct: false },
        { text: "Unga qarab qichqirish kerak", correct: false }
      ],
      optionsRu: [
        { text: "Толкнуть её вперед (Push) 🛒", correct: true },
        { text: "Сидеть и просто ждать", correct: false },
        { text: "Громко закричать на неё", correct: false }
      ],
      explanationUz: "Barakalla! Aravachaga kuch berib itarganimizda u harakatga keladi!",
      explanationRu: "Молодец! Приложив силу и толкнув тележку, мы приводим её в движение!"
    }
  },

  // --- 5. STATES OF MATTER ---
  {
    id: 'matter-states',
    titleUz: "Moddaning Holatlari: Muz, Suv va Bug‘",
    titleRu: "Состояния вещества: Лед, вода и пар",
    titleEn: "States of Matter: Solid, Liquid & Gas",
    symbol: "🧊",
    color: "#10B981",
    badgeUz: "Sehrli Shakllar!",
    badgeRu: "Волшебные превращения!",
    summaryUz: "Suv — haqiqiy sehrgar! Sovuqda qattiq muzga, xonada oquvchan suvga, issiqda esa ko‘rinmas bug‘ga aylanadi!",
    summaryRu: "Вода — настоящий волшебник! На морозе она превращается в твердый лед, в комнате — в текучую воду, а от жары — в пар!",
    summaryEn: "Water is a true shapeshifter: Solid ice in the cold, liquid water to drink, and gas steam in heat!",
    explanationUz: `
      <div class="concept-detail-box">
        <h4>💧 3 Xil Sehrli Holat:</h4>
        <p><strong>1. Qattiq (Solid) 🧊:</strong> Muz, tosh, qalam. O‘z shaklini mahkam saqlaydi.</p>
        <p><strong>2. Suyuq (Liquid) 💧:</strong> Suv, sut, sharbat. Har qanday idish shakliga kiradi.</p>
        <p><strong>3. Gaz (Gas) 💨:</strong> Havo, choynakdan chiqayotgan bug‘. Butun xonaga erkin tarqaladi!</p>
      </div>
    `,
    explanationRu: `
      <div class="concept-detail-box">
        <h4>💧 3 волшебных состояния:</h4>
        <p><strong>1. Твердое (Solid) 🧊:</strong> Лед, камень, карандаш. Сохраняют свою форму.</p>
        <p><strong>2. Жидкое (Liquid) 💧:</strong> Вода, молоко, сок. Принимают форму любой кружки или кувшина.</p>
        <p><strong>3. Газообразное (Gas) 💨:</strong> Воздух, пар из чайника. Свободно летает по всей комнате!</p>
      </div>
    `,
    realWorldExampleUz: "Muzlatgichdan olingan muz bo‘lagi iliq xonada erib suv bo‘ladi, choynak qaynaganda esa osmonga bug‘ bo‘lib uchadi!",
    realWorldExampleRu: "Кусочек льда из морозилки в теплой комнате тает в воду, а если вскипятить чайник, вода улетит в виде пара!",
    factsUz: [
      { icon: "❄️", text: "Har bir qor parchasi bir-biriga o‘xshamaydigan noyob qattiq kristall shakliga ega." },
      { icon: "☁️", text: "Osmondagi oppoq bulutlar millionlab mittivoy suv tomchilari va muzchalardan iborat." },
      { icon: "🎈", text: "Geliy gazi havoda yengil bo‘lgani uchun havo sharlarini osmonga olib chiqadi!" }
    ],
    factsRu: [
      { icon: "❄️", text: "Каждая снежинка имеет свой неповторимый красивый узор кристалла." },
      { icon: "☁️", text: "Белые облака на небе состоят из миллионов крошечных капелек воды и льдинок." },
      { icon: "🎈", text: "Газ гелий легче воздуха, поэтому воздушные шарики взлетают в небо!" }
    ],
    quickTest: {
      questionUz: "Muzni issiq quyosh tagiga qo‘ysangiz, u nimalarga aylanadi?",
      questionRu: "Если положить кубик льда под теплое солнце, во что он превратится?",
      optionsUz: [
        { text: "Erib suyuq suvga aylanadi 💧", correct: true },
        { text: "Toshga aylanadi 🪨", correct: false },
        { text: "Olovga aylanadi 🔥", correct: false }
      ],
      optionsRu: [
        { text: "Растает в жидкую воду 💧", correct: true },
        { text: "Превратится в камень 🪨", correct: false },
        { text: "Превратится в огонь 🔥", correct: false }
      ],
      explanationUz: "To‘g‘ri! Issiqlik ta’sirida qattiq muz erib suyuq suvga aylanadi!",
      explanationRu: "Верно! От тепла твердый лед тает и превращается в жидкую воду!"
    }
  }
];

class PhysicsConceptsManager {
  getLang() {
    return window.physicsApp ? window.physicsApp.lang : (localStorage.getItem('kiddo_language') || 'uz');
  }

  renderConcepts() {
    const container = document.getElementById('physics-concepts-list');
    if (!container) return;

    const isRu = this.getLang() === 'ru';

    container.innerHTML = PHYSICS_CONCEPTS.map(c => {
      const title = isRu ? c.titleRu : c.titleUz;
      const badge = isRu ? c.badgeRu : c.badgeUz;
      const summary = isRu ? c.summaryRu : c.summaryUz;
      const explanation = isRu ? c.explanationRu : c.explanationUz;
      const realWorld = isRu ? c.realWorldExampleRu : c.realWorldExampleUz;
      const facts = isRu ? c.factsRu : c.factsUz;
      const testQ = isRu ? c.quickTest.questionRu : c.quickTest.questionUz;
      const testOpts = isRu ? c.quickTest.optionsRu : c.quickTest.optionsUz;
      const testExplanation = isRu ? c.quickTest.explanationRu : c.quickTest.explanationUz;
      const storyLabel = isRu ? "🌍 Жизненный пример:" : "🌍 Hayotiy Misol:";
      const testLead = isRu ? "🎯 Быстрая проверка / Quick Check:" : "🎯 Tezkor Sinov / Quick Check:";

      return `
        <div class="physics-concept-card" style="--p-color: ${c.color};" id="concept-card-${c.id}">
          <div class="p-card-header">
            <div class="p-icon-box" style="background-color: ${c.color};">
              ${c.symbol}
            </div>
            <div class="p-title-group">
              <span class="p-badge-pill">${badge}</span>
              <h3 class="p-main-title">${title}</h3>
              <span class="p-sub-title">${c.titleEn}</span>
            </div>
          </div>

          <div class="p-card-body">
            <div class="p-summary-box">
              <p class="summary-uz">💡 ${summary}</p>
              <p class="summary-en">🌐 ${c.summaryEn}</p>
            </div>

            <div class="p-detailed-explanation">
              ${explanation}
            </div>

            <div class="p-real-world-box">
              <strong>${storyLabel}</strong>
              <p>${realWorld}</p>
            </div>

            <div class="p-facts-strip">
              ${facts.map(f => `
                <div class="p-fact-pill">
                  <span class="fact-icon">${f.icon}</span>
                  <span class="fact-text">${f.text}</span>
                </div>
              `).join('')}
            </div>

            <!-- Interactive Mini-Checker -->
            <div class="p-mini-test-box">
              <span class="test-lead">${testLead}</span>
              <p class="test-q">${testQ}</p>
              <div class="test-options-row">
                ${testOpts.map((opt, idx) => `
                  <button class="test-choice-btn" onclick="window.physicsConcepts.checkTest('${c.id}', ${idx}, ${opt.correct}, '${testExplanation.replace(/'/g, "\\'")}')">
                    ${opt.text}
                  </button>
                `).join('')}
              </div>
              <div class="test-feedback" id="feedback-${c.id}" style="display: none;"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  checkTest(conceptId, chosenIdx, isCorrect, explanation) {
    const card = document.getElementById(`concept-card-${conceptId}`);
    const feedback = document.getElementById(`feedback-${conceptId}`);
    if (!card || !feedback) return;

    const isRu = this.getLang() === 'ru';
    const buttons = card.querySelectorAll('.test-choice-btn');
    buttons.forEach(b => b.disabled = true);

    if (isCorrect) {
      buttons[chosenIdx].classList.add('correct');
      window.physicsAudio.playCorrect();
      if (window.physicsConfetti) window.physicsConfetti.launch(35, 0.5, 0.6);
      window.physicsApp.addStars(2);

      feedback.className = 'test-feedback success-feedback bounce-in';
      const msg = isRu ? "🎉 Молодец!" : "🎉 Barakalla!";
      feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
      feedback.style.display = 'block';
    } else {
      buttons[chosenIdx].classList.add('incorrect');
      window.physicsAudio.playWrong();

      feedback.className = 'test-feedback error-feedback shake-anim';
      const msg = isRu ? "💡 Подумай еще раз!" : "💡 Qaytadan o‘ylab ko‘ring!";
      feedback.innerHTML = `${msg} <br><small>${explanation}</small>`;
      feedback.style.display = 'block';
    }

    setTimeout(() => {
      buttons.forEach(b => {
        b.disabled = false;
        b.classList.remove('correct', 'incorrect');
      });
      feedback.style.display = 'none';
    }, 3200);
  }
}

window.physicsConcepts = new PhysicsConceptsManager();
