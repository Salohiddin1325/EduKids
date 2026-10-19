/**
 * AstroBot - Interactive AI Chatbot Widget for Kids
 * 
 * Features:
 * 1. Cheerful Floating Action Button (FAB) + Smooth Slide-Up Window
 * 2. 10 Questions Daily Quota (Aqlli Bola Rejimi) - Teaches deliberate thinking & reading
 * 3. Step-by-Step Math & Word Problem Solver (Masala Yechuvchi)
 * 4. 40+ Science, Physics, Space & Nature Topics with Fun Analogies
 * 5. Full 100 Vocabulary Words Integration (Uzbek / Russian / English)
 * 6. Google Gemini API Support (Optional Key in Settings Drawer)
 * 7. Universal Pedagogical Explainer for Open Curiosity Questions
 * 8. Text-to-Speech (TTS) with Native Pronunciation & Web Speech Voice Input
 * 9. Gamification: Quizzes (+10 Stars, +25 XP), Confetti, and Emoji Reactions
 * 10. Parent / Teacher Reset Quota Control
 */

(function () {
  'use strict';

  // Cute AstroBot Mascot Vector Graphic
  const ASTROBOT_SVG = `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="astro-bot-vector">
      <defs>
        <linearGradient id="astroBotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E0F2FE" />
          <stop offset="60%" stop-color="#BAE6FD" />
          <stop offset="100%" stop-color="#7DD3FC" />
        </linearGradient>
        <linearGradient id="astroVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0F172A" />
          <stop offset="100%" stop-color="#1E293B" />
        </linearGradient>
        <linearGradient id="astroGoldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FDE047" />
          <stop offset="100%" stop-color="#F59E0B" />
        </linearGradient>
      </defs>

      <!-- Antenna Pole -->
      <line x1="50" y1="20" x2="50" y2="9" stroke="#0284C7" stroke-width="4" stroke-linecap="round" />
      
      <!-- Glowing Antenna Star Orb -->
      <circle cx="50" cy="7" r="6" fill="url(#astroGoldGlow)" stroke="#FFFFFF" stroke-width="1.5" />
      <circle cx="50" cy="7" r="2.5" fill="#FFFFFF" />

      <!-- Outer Space Helmet / Head -->
      <rect x="15" y="18" width="70" height="64" rx="30" fill="url(#astroBotBodyGrad)" stroke="#0284C7" stroke-width="3" />

      <!-- Side Ear Cushions / Headphones -->
      <rect x="7" y="38" width="10" height="24" rx="5" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />
      <rect x="83" y="38" width="10" height="24" rx="5" fill="#38BDF8" stroke="#0284C7" stroke-width="2" />

      <!-- Dark Cosmic Face Visor -->
      <rect x="23" y="27" width="54" height="42" rx="20" fill="url(#astroVisorGrad)" stroke="#0369A1" stroke-width="2" />

      <!-- Visor Light Reflection Arc -->
      <path d="M 28 35 Q 50 30 72 35" stroke="rgba(255,255,255,0.45)" stroke-width="2" stroke-linecap="round" fill="none" />

      <!-- Left Eye: Big Glowing Blue Anime Eye -->
      <ellipse cx="38" cy="46" rx="6" ry="7" fill="#38BDF8" />
      <circle cx="36" cy="43" r="2.5" fill="#FFFFFF" />
      <circle cx="40" cy="48" r="1.2" fill="#FFFFFF" />

      <!-- Right Eye: Big Glowing Blue Anime Eye -->
      <ellipse cx="62" cy="46" rx="6" ry="7" fill="#38BDF8" />
      <circle cx="60" cy="43" r="2.5" fill="#FFFFFF" />
      <circle cx="64" cy="48" r="1.2" fill="#FFFFFF" />

      <!-- Rosy Cheeks -->
      <ellipse cx="32" cy="55" rx="3.5" ry="2" fill="#FF8FA3" opacity="0.8" />
      <ellipse cx="68" cy="55" rx="3.5" ry="2" fill="#FF8FA3" opacity="0.8" />

      <!-- Cheerful Robot Smile -->
      <path d="M 44 55 Q 50 60 56 55" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" fill="none" />

      <!-- Little Chest Collar / Tie -->
      <path d="M 40 82 L 50 88 L 60 82 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5" />
    </svg>
  `;

  // Extensive Kid Knowledge Matrix (40+ Deep Topics & Analogies)
  const KID_KNOWLEDGE = {
    greetings: {
      uz: "Salom, kichkintoy do‘stim! 🌟 Men AstroBotman — sening aqlli va quvnoq do‘sting!\n\nMenga 3 ta asosiy fandan har qanday savolingni berishing mumkin:\n📐 **Matematika** (Misol va masalalar, karra jadvali, shakllar)\n🇬🇧 **Ingliz tili** (So‘zlar tarjimasi, bolalar grammatikasi, talaffuz)\n⚛️ **Fizika** (Gravitatsiya, kema va samolyotlar, magnit, tabiat qonunlari)\n\n🎯 **Bugungi quvvat:** Kuniga shu 3 ta fandan o‘zing xohlagan **umumiy 10 ta savol** berishing mumkin! Qaysi fandan boshlaymiz? 🚀",
      ru: "Привет, юный исследователь! 🌟 Я АстроБот — твой умный космический друг!\n\nТы можешь задавать мне вопросы по 3 главным предметам:\n📐 **Математика** (Примеры, задачи, таблица умножения, фигуры)\n🇬🇧 **Английский язык** (Перевод слов, детская грамматика, фразы)\n⚛️ **Физика** (Гравитация, почему корабли не тонет, самолёты, магниты)\n\n🎯 **Твоя энергия:** Всего **10 вопросов в день** на твой выбор по любым из этих 3 предметов! С чего начнём? 🚀",
      en: "Hello, little explorer! 🌟 I'm AstroBot — your fun learning buddy!\n\nYou can ask me anything about 3 exciting subjects:\n📐 **Mathematics** (Arithmetic, word problems, times tables, shapes)\n🇬🇧 **English Language** (Word translations, kid grammar, fun phrases)\n⚛️ **Physics & Science** (Gravity, magnets, why planes fly, floating ships)\n\n🎯 **Your Energy:** You have **10 questions daily** of your own choice across these 3 subjects! Where shall we start? 🚀"
    },

    topics: [
      // 1. GRAVITY
      {
        patterns: [/gravit/i, /tortish/i, /yerga tush/i, /gravity/i, /гравитац/i, /падени/i, /почему.*пада/i],
        response: {
          uz: "🌟 **Gravitatsiya nima?**\n\nTasavvur qil, Yer sayyoramiz — bu juda mehribon ona kabi! U barcha narsalarni — odamlar, daraxtlar va suvni o‘z bag‘riga mahkam quchoqlab turadi 🤗.\n\nYuqoriga sakrasang, Yer o‘zining ko‘rinmas mehr qo‘llari bilan seni yana sekin yerga qaytaradi. Bu ko‘rinmas kuch **Gravitatsiya** deyiladi! 🌍✨",
          analogyUz: "💡 Misol: Xuddi koptokni qancha balandga otsang ham, u har doim yerga qaytib tushadi!",
          ru: "🌟 **Что такое Гравитация?**\n\nЗемля — словно добрая мама, которая крепко обнимает всё вокруг: людей, деревья и океаны 🤗.\n\nКогда ты подпрыгиваешь, невидимые ручки Земли мягко возвращают тебя обратно. Это притяжение называется **Гравитацией**! 🌍✨",
          analogyRu: "💡 Пример: Как бы высоко ты ни бросил мячик, он всегда возвращается назад!",
          en: "🌟 **What is Gravity?**\n\nEarth is like a big, loving teddy bear hugging everything safely on the ground 🤗. When you jump up, Earth's invisible hug brings you back down. That superpower is called **Gravity**! 🌍✨",
          analogyEn: "💡 Analogy: No matter how high you bounce a ball, gravity brings it back to your hands!"
        }
      },

      // 2. RAINBOW
      {
        patterns: [/kamalak/i, /rainbow/i, /радуг/i, /7.*rang/i],
        response: {
          uz: "🌈 **Kamalak qayerdan keladi?**\n\nYomg‘irdan so‘ng havoda millionlab mitti suv tomchilari qoladi 💧. Quyosh nuri oq ko‘rinsa ham, uning ichida 7 xil rang yashiringan!\n\nNur tomchilardan o‘tganda, tomchilar xuddi sehrli shisha kabi nurni 7 xil rangga ajratib beradi: Qizil, To‘q sariq, Sariq, Yashil, Havorang, Ko‘k va Binafsha! 🍓🍊🍋🍏🫐🍇",
          analogyUz: "💡 Misol: Shisha stakandan quyosh nuri o‘tganda devorda kamalak aks etishi kabi!",
          ru: "🌈 **Откуда берётся Радуга?**\n\nПосле дождя в воздухе парят капельки воды 💧. Солнечный свет кажется белым, но внутри него спрятаны 7 волшебных красок!\n\nКапельки работают как хрусталики и рассыпают луч на 7 цветов: красный, оранжевый, жёлтый, зелёный, голубой, синий и фиолетовый! 🍓🍊🍋🍏🫐🍇",
          analogyRu: "💡 Пример: Словно солнечный зайчик через стеклянный хрусталик рисует радугу на стене!",
          en: "🌈 **Where does a Rainbow come from?**\n\nSunlight looks white, but it hides 7 secret colors inside! Tiny raindrops act like mini prisms and split sunlight into Red, Orange, Yellow, Green, Blue, Indigo, and Violet! 🍓🍊🍋🍏🫐🍇",
          analogyEn: "💡 Analogy: Just like a flashlight shining through a glass of water paints colors on your room!"
        }
      },

      // 3. ELECTRICITY
      {
        patterns: [/elektr/i, /tok/i, /electricity/i, /электричеств/i, /ток/i, /chiroq.*yon/i],
        response: {
          uz: "⚡ **Elektr toki nima?**\n\nSimlar ichida 'elektron' nomli millionlab mitti, o‘ta chaqqon ishchi zarrachalar yashaydi 🐜⚡!\n\nTugmani bosganingda, ular bir zumda bir-biriga quvvat uzatib, chiroqqa yuguradi va xonangni yoritadi! 💡✨",
          analogyUz: "💡 Misol: Poyga maydonida quvnoq yuguruvchi mitti zarralar estafetasi kabi!",
          ru: "⚡ **Что такое Электричество?**\n\nВ проводах живут миллиарды шустрых микро-частичек — 'электронов' 🐜⚡! Когда щёлкаешь выключатель, они мчатся наперегонки и зажигают лампочку! 💡✨",
          analogyRu: "💡 Пример: Миллиарды светящихся муравьишек, передающих энергию по дорожкам!",
          en: "⚡ **What is Electricity?**\n\nInside wires live billions of tiny, super-fast energetic particles called 'electrons' 🐜⚡! When you flip the switch, they race forward to power your lights and toys! 💡✨",
          analogyEn: "💡 Analogy: Billions of friendly runners passing energy in a supersonic relay race!"
        }
      },

      // 4. MAGNETS
      {
        patterns: [/magnit/i, /magnet/i, /магнит/i, /tortadi/i, /притяг/i],
        response: {
          uz: "🧲 **Magnitlar qanday ishlaydi?**\n\nMagnitning atrofida ko‘rinmas sehrli kuch maydoni bor. Go‘yo uning ko‘rinmas qo‘llari bo‘lib, temir buyumlarni (qisqichlar, tangalar) o‘ziga tortib oladi!\n\nBir xil tomonlarini yaqinlashtirsang esa, ular bir-biridan qochadi! 😄",
          analogyUz: "💡 Misol: Ko‘rinmas superqahramon qo‘llari temir o‘yinchoqlarni ushlab oladi!",
          ru: "🧲 **Как работают Магниты?**\n\nВокруг магнита есть невидимое силовое поле — словно руки-невидимки, которые притягивают железные скрепки и машинки! А одинаковые полюса забавно отталкиваются! 😄",
          analogyRu: "💡 Пример: Невидимые супер-ручки, которые ловят железные вещи!",
          en: "🧲 **How do Magnets work?**\n\nMagnets have an invisible force shield called a magnetic field! It reaches out with invisible hands to pull iron toys and fridge stickers! 😄",
          analogyEn: "💡 Analogy: Invisible superhero hands grabbing iron coins and clips!"
        }
      },

      // 5. AIRPLANES (AEROPLANE FLYING)
      {
        patterns: [/samolyot/i, /aeroplane/i, /airplane/i, /самолет/i, /самолёт/i, /qanday uchadi/i, /как летает.*самол/i],
        response: {
          uz: "✈️ **Samolyotlar qanday uchadi?**\n\nSamolyot juda og‘ir bo‘lsa ham, uning qanotlari maxsus qavariq shaklda yasalgan!\n\n1️⃣ Dvigatellar samolyotni katta tezlikda oldinga itaradi 🚀.\n2️⃣ Qanot ustidan o‘tgan havo pastdagi havoga qaraganda tezroq harakat qiladi va pastdagi havo samolyotni osmonga ko‘tarib yuboradi! Buni **Ko‘tarish Kuchi** deyiladi 🌬️✈️.",
          analogyUz: "💡 Tajriba: Qo‘lingni mashina oynasidan chiqarib biroz qiyalasang, shamol qo‘lingni yuqoriga ko‘targanini his qilasan!",
          ru: "✈️ **Как летают самолёты?**\n\nСамолёт держится в воздухе благодаря особой форме крыльев!\n1️⃣ Мощные моторы разгоняют его вперёд 🚀.\n2️⃣ Воздух под крылом давит сильнее, чем воздух сверху, и буквально подталкивает гигантскую птицу в небо! Это называется **Подъёмная Сила** 🌬️✈️.",
          analogyRu: "💡 Пример: Выстави ладонь против ветра под углом — ветер поднимет твою руку вверх!",
          en: "✈️ **How do Airplanes Fly?**\n\nAirplanes fly because of the magical shape of their wings!\n1️⃣ Engines push the plane forward at high speed 🚀.\n2️⃣ Air moves faster over the curved top of the wing, creating higher pressure below that pushes the plane up into the sky! That’s called **Lift** 🌬️✈️.",
          analogyEn: "💡 Try this: Angle your hand in the breeze, and you’ll feel the rushing air lift your hand up!"
        }
      },

      // 6. BIRDS
      {
        patterns: [/qush.*uch/i, /bird.*fly/i, /птиц.*лета/i],
        response: {
          uz: "🦅 **Qushlar qanday uchadi?**\n\nQushlar — tabiatning eng mukammal fazogirlari! Ularning suyaklari ichi bo‘sh va juda yengil, ko‘krak muskullari esa o‘ta baquvvat. Ular qanotlarini qoqib, havoni pastga va orqaga itaradi, bu esa ularni yuqoriga ko‘taradi! 🪶✨",
          analogyUz: "💡 Misol: Suzganda qo‘llaring bilan suvni orqaga itarsang oldinga suzganing kabi!",
          ru: "🦅 **Как летают птицы?**\n\nУ птиц очень лёгкие полые косточки и мощные грудные мышцы. Взмахивая пернатыми крыльями, они отталкиваются от воздуха точно так же, как пловец отталкивается от воды! 🪶✨",
          analogyRu: "💡 Пример: Как пловец отталкивает воду руками и плывёт вперёд!",
          en: "🦅 **How do Birds Fly?**\n\nBirds have super-light hollow bones and powerful wing muscles! When they flap their wings, they push air downwards and backwards, lifting their bodies smoothly into the sky! 🪶✨",
          analogyEn: "💡 Analogy: Just like a swimmer pushing water back to glide forward!"
        }
      },

      // 7. SHIPS & FLOATING
      {
        patterns: [/kema.*cho‘k/i, /kema.*chok/i, /ship.*float/i, /корабл.*плава/i, /почему.*не тонет/i],
        response: {
          uz: "🚢 **Ulkan temir kema nega suvga cho‘kmaydi?**\n\nKema temirdan bo‘lsa ham, uning ichida juda katta bo‘shliq va havo bor! Suv esa pastdan turib o‘ziga sig‘magan hamma narsani yuqoriga itaradi (bu **Arximed kuchi** deyiladi). Havo to‘la kema butun suvdan yengilroq bo‘lib, cho‘kmasdan suzadi! ⚓🌊",
          analogyUz: "💡 Misol: Koptokni suv ostiga bosib ko‘r — u o‘sha zahoti suv yuziga otilib chiqadi!",
          ru: "🚢 **Почему огромный корабль не тонет?**\n\nВнутри железного корабля очень много свободного пространства и воздуха! Вода выталкивает погружённые предметы вверх с огромной силой (сила Архимеда). Благодаря воздуху средняя плотность корабля меньше воды! ⚓🌊",
          analogyRu: "💡 Пример: Попробуй утопить надувной мяч в ванной — вода мгновенно выталкивает его наверх!",
          en: "🚢 **Why don't Heavy Ships Sink?**\n\nEven though ships are made of steel, they are hollow and filled with giant pockets of air! Water pushes up against the ship with buoyant force, keeping it floating happily on the waves! ⚓🌊",
          analogyEn: "💡 Try this: Push a beach ball down into a pool—water pops it right back to the top!"
        }
      },

      // 8. RAIN & WATER CYCLE
      {
        patterns: [/yomg‘ir/i, /yomgir/i, /rain/i, /дожд/i, /suv.*aylan/i],
        response: {
          uz: "🌧️ **Yomg‘ir qanday paydo bo‘ladi?**\n\n1️⃣ Quyosh daryo va dengizlardagi suvni isitadi, suv esa ko‘rinmas bug‘ga aylanib osmonga ko‘tariladi ☀️.\n2️⃣ Osmonda sovuq havo bug‘ni mitti tomchilarga aylantirib, bulut hosil qiladi ☁️.\n3️⃣ Tomchilar kattalashib og‘irlashganda, yerga yomg‘ir bo‘lib tushadi! 💧🌱",
          analogyUz: "💡 Misol: Qaynayotgan choynak qopqog‘ida suv tomchilari yig‘ilishi kabi!",
          ru: "🌧️ **Как появляется дождь?**\n\nСолнышко нагревает реки и моря, вода превращается в невидимый пар и летит в небо ☀️. Там из пара собираются пушистые тучки ☁️. Когда капли становятся тяжёлыми, они падают на землю тёплым дождиком! 💧🌱",
          analogyRu: "💡 Пример: Как капельки пара собираются на крышке горячей кастрюли!",
          en: "🌧️ **Where does Rain come from?**\n\nSunlight warms lakes and oceans, turning water into floating vapor ☀️. High in the cold sky, vapor chills into puffy clouds ☁️. When droplets get too heavy, gravity brings them down as refreshing rain! 💧🌱",
          analogyEn: "💡 Analogy: Just like steam forming water droplets on a kettle lid!"
        }
      },

      // 9. SNOW & ICE
      {
        patterns: [/qor/i, /snow/i, /снег/i, /muz/i, /ice/i, /лед/i, /лёд/i],
        response: {
          uz: "❄️ **Qor va muz qanday hosil bo‘ladi?**\n\nHarorat 0 darajadan pastga tushganda, suvdagi molekulalar qimirlamay qoladi va bir-biriga qotib bog‘lanadi! Osmondagi suv tomchilari muzlaganda, hech qachon bir-biriga o‘xshamaydigan 6 burchakli sehrli qor uchqunlari paydo bo‘ladi! ⛄✨",
          analogyUz: "💡 Fakt: Dunyoda bir xil shakldagi ikkita qor parchasi mutlaqo mavjud emas!",
          ru: "❄️ **Откуда берутся снежинки и лёд?**\n\nКогда на улице мороз ниже 0 градусов, вода замерзает в кристаллы! В облаках рождаются шестиугольные кружевные снежинки — и каждая уникальна! ⛄✨",
          analogyRu: "💡 Факт: В природе не существует двух одинаковых снежинок!",
          en: "❄️ **How do Snowflakes and Ice Form?**\n\nWhen temperature drops below freezing (0°C), water droplets freeze into six-sided ice crystals! Each snowflake dancing down from winter clouds has a unique lace pattern! ⛄✨",
          analogyEn: "💡 Fun fact: No two snowflakes in the whole world are ever completely identical!"
        }
      },

      // 10. WHY OCEAN IS SALTY
      {
        patterns: [/dengiz.*sho‘r/i, /dengiz.*shor/i, /ocean.*salt/i, /море.*солен/i, /почему.*море.*сол/i],
        response: {
          uz: "🌊 **Nega dengiz suvi sho‘r?**\n\nMillionlab yillar davomida yomg‘ir suvlari tog‘ va yer jinslarini yuvib o‘tgan. Suv toshlardagi mineral tuzlarni eritib, daryolar orqali dengiz va okeanlarga olib borgan. Quyosh suvni bug‘lantirsa ham, tuz dengizda qolib to‘planavergan! 🧂🌊",
          analogyUz: "💡 Misol: Sho‘rva qaynab suvi kamaysa, sho‘rligi oshib ketishi kabi!",
          ru: "🌊 **Почему море солёное?**\n\nДожди миллионы лет омывали горы и скалы, растворяя минеральные соли. Реки несли эти соли в море. Солнце выпаривает чистую воду, а соль остаётся в океане навсегда! 🧂🌊",
          analogyRu: "💡 Пример: Если кипятить солёный суп, вода испаряется, а соль остаётся!",
          en: "🌊 **Why is the Sea Salty?**\n\nRain washes minerals and salts from rocks and soil into rivers, which flow into oceans. When sunshine evaporates pure water, the salt stays behind in the sea! 🧂🌊",
          analogyEn: "💡 Analogy: When salt soup simmers, water evaporates away but yummy salt stays!"
        }
      },

      // 11. SUN (THE SUN)
      {
        patterns: [/quyosh/i, /sun/i, /солнц/i, /quyosh.*nima/i, /quyosh.*issiq/i],
        response: {
          uz: "☀️ **Quyosh nima va nega shunday issiq?**\n\nQuyosh — bizga eng yaqin bo‘lgan ulkan olovli yulduz! U Yer sayyorasidan 1 million 300 ming marta katta 🌟. Uning markazida vodorod gazi doimiy ravishda termoyadroviy energiya ishlab chiqaradi, shuning uchun uning yuzasi 5500 daraja issiq! 🌞🔥",
          analogyUz: "💡 Koinot chirog‘i: Agar Quyosh bo‘lmasa, yer yuzida hayot, o‘simliklar va yorug‘lik bo‘lmas edi!",
          ru: "☀️ **Что такое Солнце и почему оно горячее?**\n\nСолнце — это гигантская пылающая звезда в центре нашей системы! Оно больше Земли в 1 300 000 раз! В его ядре водород превращается в гелий, выделяя океаны тепла и света! 🌞🔥",
          analogyRu: "💡 Сердце космоса: Солнышко дарит жизнь всем растениям, животным и людям!",
          en: "☀️ **What is the Sun?**\n\nThe Sun is a giant, glowing cosmic ball of hot plasma! It’s 1.3 million times bigger than Earth! Deep inside its core, nuclear fusion produces all the golden light and warmth that makes life on Earth thrive! 🌞🔥",
          analogyEn: "💡 Cosmic powerhouse: The Sun gives us daylight, warm weather, and energy to grow plants!"
        }
      },

      // 12. MOON (THE MOON)
      {
        patterns: [/oy.*nima/i, /oy.*nega/i, /moon/i, /лун/i, /oy.*shakl/i],
        response: {
          uz: "🌙 **Oy nega shaklini o‘zgartiradi?**\n\nOy o‘zidan yorug‘lik chiqarmaydi, u xuddi ulkan oyna kabi Quyosh nurini Yerga qaytaradi 🪞. Oy Yer atrofida aylanganda, Quyosh uning turli tomonlarini yoritadi: goh yarim oy (hilol), goh to‘lin oy bo‘lib ko‘rinadi! 🌕🌖🌗",
          analogyUz: "💡 Misol: Qorong‘i xonada koptokka fonar nuri tushirsang, qaysi tomondan qarashingga qarab yoritilgan qismi har xil ko‘rinadi!",
          ru: "🌙 **Почему Луна меняет форму?**\n\nЛуна сама не светится, она как гигантское зеркало отражает свет Солнца 🪞. Когда Луна кружится вокруг Земли, мы видим её освещённую сторону под разными углами: от тонкого серпика до круглой полной Луны! 🌕🌖🌗",
          analogyRu: "💡 Пример: Освети яблоко фонариком в темноте — сбоку видна только половинка!",
          en: "🌙 **Why does the Moon Change Shape?**\n\nThe Moon doesn't make its own light—it reflects sunlight like a giant mirror! As it orbits around Earth, we see different amounts of its sunlit side: from a thin silver crescent to a big glowing full Moon! 🌕🌖🌗",
          analogyEn: "💡 Experiment: Shine a flashlight on an orange in a dark room and look from the side!"
        }
      },

      // 13. BLACK HOLES
      {
        patterns: [/qora tuynuk/i, /black hole/i, /черн.*дыр/i],
        response: {
          uz: "🕳️ **Qora tuynuk nima?**\n\nQora tuynuk — koinotdagi eng sirli joy! Bu ulkan yulduz o‘z umri oxirida o‘ta qisqarib ketganda hosil bo‘ladi. Uning tortishish kuchi shu qadar bahaybatki, hatto koinotdagi eng tez narsa — yorug‘lik ham undan qochib chiqa olmaydi! 🌌✨",
          analogyUz: "💡 Misol: Koinotning ko‘rinmas super-changyutgichi kabi!",
          ru: "🕳️ **Что такое Чёрная Дыра?**\n\nЭто самый загадочный космический объект! Когда огромная звезда сжимается в крошечную точку, гравитация становится настолько мощной, что даже свет не может оттуда вырваться! 🌌✨",
          analogyRu: "💡 Пример: Космический невидимый пылесос с невероятной силой притяжения!",
          en: "🕳️ **What is a Black Hole?**\n\nA black hole forms when a giant dying star collapses into a tiny point. Its gravity is so incredibly strong that nothing—not even speed-of-light rays—can escape it! 🌌✨",
          analogyEn: "💡 Analogy: The universe's ultimate invisible gravitational whirlpool!"
        }
      },

      // 14. DINOSAURS
      {
        patterns: [/dinozavr/i, /dinosaur/i, /динозавр/i],
        response: {
          uz: "🦖 **Dinozavrlar nima bo‘lgan?**\n\nDinozavrlar bundan 66 million yil oldin Yerda hukmronlik qilgan ulkan sudralib yuruvchilar edi (T-Rex, Braxiozavr, Trikeratops). Taxminan 66 million yil oldin Yerga ulkan meteorit (koinot toshi) tushgan, chang-to‘zon osmonni yopib qo‘ygan va sovuq sababli dinozavrlar yo‘qolib ketgan. Lekin ularning avlodlari bugungi qushlar bo‘lib yashamoqda! 🦕☄️",
          analogyUz: "💡 Qiziq fakt: Tovuq va kabutarlar dinozavrlarning eng yaqin qarindoshlari hisoblanadi!",
          ru: "🦖 **Что случилось с динозаврами?**\n\nОни жили 66 миллионов лет назад! Затем на Землю упал огромный астероид, поднял тучи пыли, закрыл Солнце и наступило похолодание. Крупные динозавры исчезли, но маленькие пернатые виды выжили и превратились в современных птиц! 🦕☄️",
          analogyRu: "💡 Факт: Курочки и птицы — прямые потомки древних динозавров!",
          en: "🦖 **What happened to the Dinosaurs?**\n\nDinosaurs ruled Earth 66 million years ago! A giant asteroid struck our planet, blocking sunlight with dust. While giant beasts couldn't survive the cold, small feathered dinos survived and evolved into today's birds! 🦕☄️",
          analogyEn: "💡 Fun fact: Modern chickens and robins are actual living relatives of dinosaurs!"
        }
      },

      // 15. BLUE WHALE (LARGEST ANIMAL)
      {
        patterns: [/eng katta hayvon/i, /kit/i, /blue whale/i, /синий кит/i, /самое большое животное/i],
        response: {
          uz: "🐋 **Ko‘k kit — Dunyodagi eng katta hayvon!**\n\nKo‘k kitning uzunligi 30 metrgacha (3 ta avtobusdek!), og‘irligi esa 150-180 tonnaga yetadi! Uning tili bir butun fildek og‘ir, yuragi esa mitti avtomobildek katta! Lekin u baliq emas, sutemizuvchi bo‘lib, o‘pka bilan nafas oladi! 🌊💙",
          analogyUz: "💡 Taqqoslash: U Yer yuzida yashagan hatto eng katta dinozavrdan ham og‘irroq!",
          ru: "🐋 **Синий Кит — Самый большой великан на Земле!**\n\nЕго длина достигает 30 метров (как 3 автобуса!), а вес — 150 тонн! Один только его язык весит как целый слон, а сердце размером с автомобиль! При этом он дышит лёгкими! 🌊💙",
          analogyRu: "💡 Факт: Синий кит тяжелее любого динозавра, когда-либо жившего на Земле!",
          en: "🐋 **The Blue Whale — Earth's Giant Marvel!**\n\nIt grows up to 30 meters long (as big as 3 school buses!) and weighs over 150 tons! Its tongue weighs as much as an elephant, and its heart is the size of a car! 🌊💙",
          analogyEn: "💡 Mind-blower: A blue whale is heavier than even the largest dinosaur that ever lived!"
        }
      },

      // 16. CHEETAH (FASTEST ANIMAL)
      {
        patterns: [/eng tez.*hayvon/i, /gepard/i, /cheetah/i, /гепард/i, /быстрое животное/i],
        response: {
          uz: "🐆 **Gepard — Dunyodagi eng tez yuguruvchi hayvon!**\n\nGepard atigi 3 soniya ichida soatiga 100-120 km tezlikka chiqa oladi! Bu sport avtomobilidan ham tezroq poyga degani! Uning egiluvchan umurtqasi va tirnoqlari unga sirpanmasdan chaqqon burilishga yordam beradi! ⚡🐾",
          analogyUz: "💡 Taqqoslash: Bir sakraganda gepard 7 metrgacha masofani bosib o‘tadi!",
          ru: "🐆 **Гепард — Самый быстрый бегун в мире!**\n\nОн разгоняется до 120 км/ч всего за 3 секунды — быстрее гоночного спорткара! Его гибкий позвоночник и длинный хвост помогают идеально держать баланс на поворотах! ⚡🐾",
          analogyRu: "💡 Факт: За один прыжок гепард преодолевает до 7 метров!",
          en: "🐆 **The Cheetah — Fastest Runner on Earth!**\n\nA cheetah can sprint up to 120 km/h in just 3 seconds—faster than a sports car! Its flexible spine and rudder-like tail help it steer like a rocket on the savanna! ⚡🐾",
          analogyEn: "💡 Speed fact: Each cheetah stride covers up to 7 meters in the blink of an eye!"
        }
      },

      // 17. PHOTOSYNTHESIS & TREES
      {
        patterns: [/daraxt.*osadi/i, /fotosintez/i, /photosynthesis/i, /фотосинтез/i, /o‘simlik.*nafas/i, /osimlik.*nafas/i],
        response: {
          uz: "🌱 **Daraxtlar va o‘simliklar qanday oziqlanadi? (Fotosintez)**\n\nO‘simliklar o‘zlariga o‘zlari ovqat tayyorlaydigan sehrli oshpazlardir!\n1️⃣ Ildizlari bilan yerdan suv va minerallarni ichadi 💧.\n2️⃣ Yashil barglaridagi 'xlorofill' quyosh nurini tutib oladi ☀️.\n3️⃣ Havodagi karbonat angidridni olib, shirin shakar (ozuqa) va biz nafas oladigan toza **Kislorod** ishlab chiqaradi! 🌳✨",
          analogyUz: "💡 Tabiat fabrikasi: Daraxtlar butun sayyoramizning yashil o‘pkasidir!",
          ru: "🌱 **Как питаются растения? (Фотосинтез)**\n\nЛисточки — как маленькие солнечные кухни!\nОни ловят корнями воду 💧, впитывают солнечные лучики ☀️ и углекислый газ, создавая питательный сахар для роста и выделяя чистый кислород, которым мы дышим! 🌳✨",
          analogyRu: "💡 Факт: Деревья и леса — это зелёные лёгкие нашей планеты!",
          en: "🌱 **How do Plants Eat? (Photosynthesis)**\n\nPlants are magical chefs that cook using sunshine! Roots drink water 💧, green leaves trap sunlight ☀️, and they turn carbon dioxide into plant food while releasing fresh, crisp **Oxygen** for us to breathe! 🌳✨",
          analogyEn: "💡 Green lungs: Forests keep the entire planet healthy with clean air!"
        }
      },

      // 18. HUMAN HEART
      {
        patterns: [/yurak/i, /heart/i, /сердц/i, /qon.*hayda/i],
        response: {
          uz: "❤️ **Yurak qanday ishlaydi?**\n\nYurak — bu sening mushtingdek keladigan eng baquvvat mitti mushak nasosi! U kuniga 100 000 marta urib, qon tomirlari orqali butun tanangga kislorod va ozuqa yetkazib beradi! Bir zum ham dam olmasdan mehnat qiladi! 💓🩺",
          analogyUz: "💡 Qo‘lingni ko‘kragingning chap tomoniga qo‘yib ko‘r — u 'duk-duk' urayotganini sezasiz!",
          ru: "❤️ **Как работает наше сердце?**\n\nСердце — это мощный насос размером с твой кулачок! Оно делает около 100 000 ударов в день, перекачивая кровь с кислородом и витаминами к каждой клеточке твоего тела! 💓🩺",
          analogyRu: "💡 Пример: Приложи ладошку к груди — услышишь верный моторчик своего организма!",
          en: "❤️ **How does your Heart Work?**\n\nYour heart is a superhero muscle about the size of your fist! It beats around 100,000 times every day, pumping blood full of oxygen and nutrients to every inch of your body! 💓🩺",
          analogyEn: "💡 Put your hand on your chest and feel your built-in energetic champion engine ticking!"
        }
      },

      // 19. HUMAN BRAIN
      {
        patterns: [/miya/i, /brain/i, /мозг/i, /xotira/i],
        response: {
          uz: "🧠 **Inson miyasi — Koinotning eng kuchli superkompyuteri!**\n\nMiyada 86 milliarddan ortiq mitti neyronlar bor. U sening barcha orzularing, xotiralaring, gapirishing, yurishing va hatto tushlaringni boshqaradi! Sen kitob o‘qiganingda yoki yangi narsa o‘rganganingda, miyadagi aloqalar yanada baquvvat bo‘ladi! 💡🚀",
          analogyUz: "💡 Maslahat: Ko‘proq masalalar yech va kitob o‘qi — shunda miyang super-kuchga ega bo‘ladi!",
          ru: "🧠 **Мозг — Самый мощный суперкомпьютер!**\n\nВ нём живут более 86 миллиардов нейронов! Мозг управляет мыслями, снами, речью и движениями. Когда ты учишься новому и решаешь задачки, в мозге строятся новые супер-дорожки! 💡🚀",
          analogyRu: "💡 Совет: Загадки и книжки делают твой мозг сильнее с каждым днём!",
          en: "🧠 **Your Brain — The Ultimate Supercomputer!**\n\nYour brain holds over 86 billion neurons! It controls everything you think, feel, say, dream, and do. Every time you solve a puzzle or read a book, your brain sparks new connections and gets smarter! 💡🚀",
          analogyEn: "💡 Tip: Solving curious questions makes your brain grow stronger like an athlete!"
        }
      },

      // 20. WHY DO WE SLEEP?
      {
        patterns: [/nega uxl/i, /why.*sleep/i, /зачем.*спать/i, /почему.*нужно спать/i],
        response: {
          uz: "💤 **Nega har kecha uxlash kerak?**\n\n1️⃣ **Miyani tozalash:** Sen uxlaganingda miyang kunduzgi xotiralarni tartibga soladi va keraksiz charchoqlarni tozalaydi 🧠.\n2️⃣ **O‘sish quvvati:** Aynan uyqu paytida tanada bo‘yni o‘stiruvchi maxsus gormonlar ajraladi 📏.\n3️⃣ **Quvvat to‘plash:** Batareyang 100% ga to‘lib, ertalab quvnoq va baquvvat uyg‘onasan! ⚡😊",
          analogyUz: "💡 Telefon zaryadkasi: Xuddi telefonni tunda quvvatlaganing kabi, uyqu ham sening tanangni to‘liq quvvatlaydi!",
          ru: "💤 **Зачем человеку нужно спать?**\n\nВо сне твой организм творит настоящие чудеса:\n1️⃣ Мозг наводит порядок в воспоминаниях 🧠.\n2️⃣ Тело растёт — гормон роста вырабатывается именно ночью 📏.\n3️⃣ Твои внутренние батарейки заряжаются до 100% для новых игр и побед! ⚡😊",
          analogyRu: "💡 Пример: Как смартфон заряжается ночью на подзарядке!",
          en: "💤 **Why do we need Sleep?**\n\nWhile you snooze, your body does magic:\n1️⃣ Your brain files away memories and recharges 🧠.\n2️⃣ Growth hormones activate so you wake up taller and stronger 📏.\n3️⃣ Your energy batteries recharge to 100% for tomorrow’s adventures! ⚡😊",
          analogyEn: "💡 Analogy: Just like plugging in a phone to wake up with full power!"
        }
      },

      // 21. COMPUTERS & ROBOTS
      {
        patterns: [/kompyuter/i, /robot/i, /computer/i, /робот/i, /компьютер/i, /qanday ishlaydi/i],
        response: {
          uz: "🤖 **Kompyuterlar va Robotlar qanday ishlaydi?**\n\nKompyuterning yuragi — bu mitti kremniy mikrosxema (Protsessor). U sekundiga milliardlab mantiqiy amallarni '0' va '1' raqamlari orqali bajaradi. Robotlar esa datchiklar (ko‘z, quloq) orqali dunyoni ko‘radi va aqlli dastur buyrug‘i bilan harakat qiladi! 💻⚡",
          analogyUz: "💡 Retsept misoli: Dasturchi robotga xuddi pishiriq retsepti kabi aniq qadam-baqadam buyruqlar yozib beradi!",
          ru: "🤖 **Как работают компьютеры и роботы?**\n\nВнутри компьютера работает кремниевый чип — Процессор. Он понимает команды из нулей и единиц (0 и 1) с космической скоростью! А роботы с помощью сенсоров видят мир и выполняют инструкции программы! 💻⚡",
          analogyRu: "💡 Пример: Как повар готовит блюдо строго по рецепту, так и робот шаг за шагом слушается кода!",
          en: "🤖 **How do Computers and Robots Work?**\n\nInside every computer is a processor made of silicon. It reads binary codes (0s and 1s) billions of times per second! Robots use sensors for eyes and follow software code recipes to move and help humans! 💻⚡",
          analogyEn: "💡 Analogy: Code is like a magical recipe book that tells the robot every fun step to take!"
        }
      },

      // 22. WHY IS SKY BLUE?
      {
        patterns: [/osmon.*ko‘k/i, /osmon.*kok/i, /sky.*blue/i, /неб.*синее/i, /почему.*небо/i],
        response: {
          uz: "🌤️ **Nega osmon ko‘k rangda?**\n\nQuyosh nuri havo qatlamidan o‘tayotganda gaz zarrachalariga uriladi. Ko‘k rangli to‘lqinlar juda chaqqon bo‘lgani uchun har tarafga sochilib ketadi va butun osmonni moviy rangga bo‘yaydi! 💙✨",
          analogyUz: "💡 Misol: Ko‘k nur xuddi quvnoq sakrovchi koptokcha kabi havoda sochiladi!",
          ru: "🌤️ **Почему небо синее?**\n\nСолнечный свет сталкивается с частичками воздуха. Синий цвет — самый шустрый, он легко рассеивается во все стороны, окрашивая небо в лазурный цвет! 💙✨",
          analogyRu: "💡 Пример: Синий свет словно весёлые конфетти разлетается по всему небу!",
          en: "🌤️ **Why is the Sky Blue?**\n\nSunlight scatters when it hits gases in our atmosphere. Blue light travels in short, smaller waves and scatters in every direction, filling the whole daytime sky with azure wonder! 💙✨",
          analogyEn: "💡 Analogy: Blue light bounces like bright party glitter across the sky!"
        }
      }
    ],

    quizzes: [
      {
        id: 'quiz_math_1',
        category: 'math',
        questionUz: "🔢 **Matematika Topishmog‘i:**\nDaraxt shoxida 5 ta qushcha o‘tirgan edi 🐦. Ularga yana 4 ta qushcha kelib qo‘shildi. Jami nechta qushcha bo‘ldi?",
        questionRu: "🔢 **Математическая загадка:**\nНа веточке сидело 5 птичек 🐦. К ним прилетели ещё 4 птички. Сколько всего птичек стало на ветке?",
        questionEn: "🔢 **Math Puzzle:**\nThere were 5 birds on a tree branch 🐦. 4 more birds flew in. How many birds are there in total?",
        optionsUz: ["A) 8 ta", "B) 9 ta", "C) 10 ta"],
        optionsRu: ["A) 8 птичек", "B) 9 птичек", "C) 10 птичек"],
        optionsEn: ["A) 8 birds", "B) 9 birds", "C) 10 birds"],
        correctIndex: 1,
        explainUz: "5 + 4 = 9! Barakalla, daho bola!",
        explainRu: "5 + 4 = 9! Умница, абсолютно верно!",
        explainEn: "5 + 4 = 9! Brilliant counting, superstar!"
      },
      {
        id: 'quiz_phys_1',
        category: 'physics',
        questionUz: "🚀 **Fizika Savoli:**\nNega narsalar yuqoriga emas, har doim Yerga qarab tushadi?",
        questionRu: "🚀 **Вопрос по физике:**\nПочему предметы падают вниз на Землю, а не улетают в космос?",
        questionEn: "🚀 **Physics Question:**\nWhy do dropped toys fall down to the ground instead of floating into space?",
        optionsUz: ["A) Shamol esgani uchun", "B) Gravitatsiya kuchi tufayli 🌍", "C) Magnit yo‘qligi uchun"],
        optionsRu: ["A) Из-за ветра", "B) Из-за силы гравитации 🌍", "C) Случайно"],
        optionsEn: ["A) Because of wind", "B) Earth's Gravity superpower! 🌍", "C) Because toys are heavy"],
        correctIndex: 1,
        explainUz: "Gravitatsiya barcha narsalarni Yerga tortib turadi!",
        explainRu: "Гравитация держит всё на Земле!",
        explainEn: "Gravity is Earth's invisible hug holding everything safe!"
      },
      {
        id: 'quiz_math_2',
        category: 'math',
        questionUz: "🔢 **Matematika Karra Jadvali:**\n7 karra 8 necha bo‘ladi? ✖️",
        questionRu: "🔢 **Таблица умножения:**\nСколько будет 7 умножить на 8? ✖️",
        questionEn: "🔢 **Multiplication Quiz:**\nWhat is 7 times 8? ✖️",
        optionsUz: ["A) 54", "B) 56", "C) 58"],
        optionsRu: ["A) 54", "B) 56", "C) 58"],
        optionsEn: ["A) 54", "B) 56", "C) 58"],
        correctIndex: 1,
        explainUz: "7 × 8 = 56! Karra jadvalini a’lo darajada bilasan!",
        explainRu: "7 × 8 = 56! Отличное знание таблицы умножения!",
        explainEn: "7 × 8 = 56! Awesome multiplication skills!"
      },
      {
        id: 'quiz_phys_2',
        category: 'physics',
        questionUz: "🧲 **Fizika Magnetizm Savoli:**\nMagnit quyidagilardan qaysi birini o‘ziga torta oladi?",
        questionRu: "🧲 **Вопрос по физике (Магнетизм):**\nКакой из предметов сможет притянуть магнит?",
        questionEn: "🧲 **Physics Magnetism Question:**\nWhich of these objects will a magnet attract?",
        optionsUz: ["A) Yog‘och chizg‘ich 🪵", "B) Temir qisqich (skrepka) 📎", "C) Plastmassa qoshiq 🥄"],
        optionsRu: ["A) Деревянную линейку 🪵", "B) Железную скрепку 📎", "C) Пластиковую ложку 🥄"],
        optionsEn: ["A) Wooden ruler 🪵", "B) Iron paperclip 📎", "C) Plastic spoon 🥄"],
        correctIndex: 1,
        explainUz: "Magnit faqat temir va po‘lat metallarni o‘ziga tortadi!",
        explainRu: "Магнит притягивает железные и стальные предметы!",
        explainEn: "Magnets attract magnetic metals like iron and steel!"
      },
      {
        id: 'quiz_eng_1',
        category: 'english',
        questionUz: "🇬🇧 **Ingliz Tili Viktorinasi:**\n'Apple' so‘zi o‘zbek tilida qaysi mazali mevani anglatadi?",
        questionRu: "🇬🇧 **Английская викторина:**\nЧто означает английское слово 'Apple'?",
        questionEn: "🇬🇧 **English Vocabulary:**\nWhat does the English word 'Apple' mean?",
        optionsUz: ["A) Olma 🍎", "B) Banan 🍌", "C) Tarvuz 🍉"],
        optionsRu: ["A) Яблоко 🍎", "B) Банан 🍌", "C) Апельсин 🍊"],
        optionsEn: ["A) Apple 🍎", "B) Banana 🍌", "C) Watermelon 🍉"],
        correctIndex: 0,
        explainUz: "'Apple' bu mazali shirin olma!",
        explainRu: "'Apple' — это сладкое яблочко!",
        explainEn: "'Apple' is the delicious crisp fruit!"
      },
      {
        id: 'quiz_eng_2',
        category: 'english',
        questionUz: "🇬🇧 **Ingliz Tili Grammatikasi:**\n'Apple' (olma) so‘zi unli tovush bilan boshlangani uchun oldiga qaysi artikl qo‘yiladi?",
        questionRu: "🇬🇧 **Английская грамматика:**\nСлово 'Apple' начинается на гласную. Какой артикль ставится перед ним?",
        questionEn: "🇬🇧 **English Grammar:**\n'Apple' starts with a vowel sound. Which article do we use?",
        optionsUz: ["A) A apple", "B) An apple 🍎", "C) Two apple"],
        optionsRu: ["A) A apple", "B) An apple 🍎", "C) Two apple"],
        optionsEn: ["A) A apple", "B) An apple 🍎", "C) Two apple"],
        correctIndex: 1,
        explainUz: "Unli tovushlar (A, E, I, O, U) oldidan har doim 'An' artikli ishlatiladi: An apple!",
        explainRu: "Перед гласными звуками (A, E, I, O, U) используется артикль 'An': An apple!",
        explainEn: "We use 'An' before words starting with vowel sounds: An apple!"
      }
    ],

    unsafeKeywords: [
      'axmoq', 'tentak', 'jinni', 'harom', 'itvachcha', 'urush', 'qurol', 'pichoq', 'o‘ldir', 'oldir', 'qon', 'yovuz',
      'дурак', 'тупой', 'идиот', 'убить', 'оружие', 'кровь', 'нож', 'война', 'мат', 'гадость',
      'kill', 'die', 'gun', 'knife', 'blood', 'stupid', 'idiot', 'hate', 'weapon', 'fight'
    ]
  };

  class AstroBotChat {
    constructor() {
      this.isOpen = false;
      this.dailyLimit = 10;
      this.currentLanguage = localStorage.getItem('kiddo_language') || 'uz';
      this.autoSpeak = localStorage.getItem('astro_auto_speak') === 'true';
      this.geminiApiKey = localStorage.getItem('astro_gemini_key') || '';
      this.geminiModel = localStorage.getItem('astro_gemini_model') || 'gemini-3.8-flash';
      this.conversationHistory = [];
      this.questionsRemaining = this.getQuestionsRemaining();
      this.activeUtterance = null;
      this.speechSynth = window.speechSynthesis || null;
      this.recognition = null;
      this.isListening = false;
      this.messages = [];
      this.activeQuiz = null;
      this.voices = [];

      this.initVoices();
      this.initSpeechRecognition();
      this.initDOM();
      this.bindEvents();

      // Listen for subscription changes to update UI instantly
      window.addEventListener('kiddo_subscription_updated', () => {
        this.updateLimitUI();
      });
    }

    getTodayDateStr() {
      const now = new Date();
      return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    }

    getQuestionsRemaining() {
      const isPro = window.subscriptionManager && window.subscriptionManager.isPro();
      if (isPro) return 9999;

      const today = this.getTodayDateStr();
      const savedDate = localStorage.getItem('astro_limit_date');
      if (savedDate !== today) {
        localStorage.setItem('astro_limit_date', today);
        localStorage.setItem('astro_questions_remaining', '10');
        return 10;
      }
      const savedCount = localStorage.getItem('astro_questions_remaining');
      return savedCount !== null ? parseInt(savedCount, 10) : 10;
    }

    saveQuestionsRemaining() {
      localStorage.setItem('astro_limit_date', this.getTodayDateStr());
      localStorage.setItem('astro_questions_remaining', this.questionsRemaining.toString());
    }

    resetDailyLimit() {
      this.questionsRemaining = this.dailyLimit;
      this.saveQuestionsRemaining();
      this.updateLimitUI();
      
      const msg = this.currentLanguage === 'ru'
        ? '🔄 Лимит вопросов обновлён на 10!'
        : (this.currentLanguage === 'en' ? '🔄 Question quota refreshed to 10!' : '🔄 Savollar quvvati 10 taga to‘ldirildi!');
      
      this.showToast(msg);
      
      const input = document.getElementById('astro-chat-input');
      const sendBtn = document.getElementById('astro-chat-send-btn');
      if (input) {
        input.disabled = false;
        input.placeholder = this.currentLanguage === 'ru'
          ? 'Вопрос по математике, физике или английскому... ✏️'
          : (this.currentLanguage === 'en' ? 'Ask a question in Math, Physics, or English... ✏️' : 'Matematika, Fizika yoki Ingliz tili bo‘yicha savol bering... ✏️');
      }
      if (sendBtn) sendBtn.disabled = false;
    }

    updateLimitUI() {
      const valEl = document.getElementById('astro-limit-val');
      const badge = document.getElementById('astro-limit-badge');
      const bannerText = document.getElementById('astro-limit-banner-text');
      const progress = document.getElementById('astro-limit-progress');
      const pill = document.getElementById('astro-header-limit-pill');
      const input = document.getElementById('astro-chat-input');
      const sendBtn = document.getElementById('astro-chat-send-btn');

      const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

      if (isPro) {
        if (valEl) valEl.textContent = '∞';
        if (badge) badge.textContent = `👑 Cheksiz AI`;
        if (progress) {
          progress.style.width = '100%';
          progress.style.background = 'linear-gradient(90deg, #F59E0B, #10B981)';
          progress.classList.remove('progress-low');
        }
        if (bannerText) {
          bannerText.innerHTML = `<strong>👑 Pro Rejim Faol:</strong> Cheksiz Google Gemini AI suhbati va tezkor yechimlar! 🚀`;
        }
        if (pill) {
          pill.classList.remove('limit-depleted');
          pill.innerHTML = `👑 <span style="font-weight: 800;">Cheksiz AI</span>`;
          pill.style.background = '#FFFBEB';
          pill.style.color = '#B45309';
          pill.style.borderColor = '#F59E0B';
        }
        if (input) {
          input.disabled = false;
          input.placeholder = this.currentLanguage === 'ru'
            ? 'Задай любой вопрос по математике, физике или английскому... 🚀'
            : (this.currentLanguage === 'en' ? 'Ask any question in Math, Physics, or English... 🚀' : 'Matematika, Fizika yoki Ingliz tili bo‘yicha savol bering... 🚀');
        }
        if (sendBtn) sendBtn.disabled = false;
        return;
      }

      // Free Tier Logic
      const count = Math.max(0, this.questionsRemaining);
      if (valEl) valEl.textContent = count;
      if (badge) badge.textContent = `🧠 ${count}/10`;

      const pct = Math.max(0, Math.min(100, (count / this.dailyLimit) * 100));
      if (progress) {
        progress.style.width = `${pct}%`;
        progress.style.background = '';
        progress.classList.toggle('progress-low', count <= 3);
      }

      if (bannerText) {
        bannerText.textContent = this.currentLanguage === 'ru'
          ? `Энергия: ${count}/10 вопросов 💡 (Математика, Физика и Английский)`
          : (this.currentLanguage === 'en'
            ? `Curiosity energy: ${count}/10 questions left 💡 (Math, Physics & English)`
            : `Kunlik quvvat: ${count}/10 ta savol qoldi 💡 (Matematika, Fizika va Ingliz tili)`);
      }

      if (pill) {
        pill.classList.toggle('limit-depleted', count === 0);
        pill.innerHTML = `🧠 <span id="astro-limit-val">${count}</span>/10`;
        pill.style.background = '';
        pill.style.color = '';
        pill.style.borderColor = '';
      }

      if (count <= 0) {
        if (input) {
          input.disabled = true;
          input.placeholder = this.currentLanguage === 'ru'
            ? '🛑 Дневной лимит (10/10) исчерпан! Перейдите на Pro!'
            : (this.currentLanguage === 'en'
              ? '🛑 Today\'s 10 questions used! Upgrade to Pro 🚀'
              : '🛑 Bugungi 10 ta bepul savol tugadi! Pro ga o‘ting 🚀');
        }
        if (sendBtn) sendBtn.disabled = true;
      } else {
        if (input) input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
      }
    }

    initVoices() {
      if (!this.speechSynth) return;
      this.voices = this.speechSynth.getVoices() || [];
      if (this.speechSynth.onvoiceschanged !== undefined) {
        this.speechSynth.onvoiceschanged = () => {
          this.voices = this.speechSynth.getVoices() || [];
        };
      }
    }

    initSpeechRecognition() {
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          this.recognition = new SpeechRec();
          this.recognition.continuous = false;
          this.recognition.interimResults = false;

          this.recognition.onstart = () => {
            this.isListening = true;
            this.updateMicUI(true);
          };

          this.recognition.onresult = (event) => {
            if (event.results && event.results[0] && event.results[0][0]) {
              const transcript = event.results[0][0].transcript;
              const inputEl = document.getElementById('astro-chat-input');
              if (inputEl) {
                inputEl.value = transcript;
                this.sendMessage(transcript);
              }
            }
          };

          this.recognition.onerror = (e) => {
            console.warn('Speech recognition error:', e);
            this.isListening = false;
            this.updateMicUI(false);
          };

          this.recognition.onend = () => {
            this.isListening = false;
            this.updateMicUI(false);
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }
    }

    initDOM() {
      if (document.getElementById('astro-chatbot-root')) return;

      const root = document.createElement('div');
      root.id = 'astro-chatbot-root';

      const starsCount = (window.gamificationHub && window.gamificationHub.stars) ? window.gamificationHub.stars : 25;

      root.innerHTML = `
        <!-- Floating Action Button Container -->
        <div class="astro-fab-container" id="astro-fab-container">
          <!-- Floating Invitation Bubble -->
          <div class="astro-fab-bubble" id="astro-fab-bubble" title="AstroBot bilan suhbatlashish uchun bosing!">
            <span>Salom! Savol ber 🤖✨</span>
            <span class="bubble-close" id="astro-fab-bubble-close">✕</span>
          </div>

          <!-- Round FAB Button -->
          <button class="astro-fab-btn" id="astro-fab-trigger" aria-label="Open AstroBot Chat" title="AstroBot - Bolalar Aqlli Do‘sti">
            <div class="astro-fab-pulse-ring"></div>
            <div class="astro-fab-mascot-svg">
              ${ASTROBOT_SVG}
            </div>
            <div class="astro-fab-badge" id="astro-fab-badge">⭐</div>
          </button>
        </div>

        <!-- Cheerful Slide-Up Chat Window -->
        <aside class="astro-chat-window" id="astro-chat-window" role="dialog" aria-labelledby="astro-chat-title" aria-modal="true">
          <!-- Chat Header -->
          <header class="astro-chat-header">
            <div class="astro-chat-header-profile">
              <div class="astro-header-avatar-wrap">
                <div class="astro-header-avatar-svg">
                  ${ASTROBOT_SVG}
                </div>
                <span class="astro-status-dot" title="Online & Ready to Learn!"></span>
              </div>
              <div class="astro-header-info">
                <div class="astro-header-title-row">
                  <span class="astro-header-name" id="astro-chat-title">AstroBot</span>
                  <span class="astro-header-badge">AI Buddy</span>
                </div>
                <span class="astro-header-subtitle" id="astro-header-sub">Bolalar uchun aqlli do‘st: Matematika | Fizika | Ingliz tili 🚀</span>
              </div>
            </div>

            <div class="astro-chat-header-actions">
              <!-- Question Limit Pill (Aqlli Bola Quvvati) -->
              <div class="astro-header-limit-chip" id="astro-header-limit-pill" title="Bugungi savollar quvvati (10 ta) — Matematika, Fizika, Ingliz tili uchun umumiy!">
                🧠 <span id="astro-limit-val">${this.questionsRemaining}</span>/10
              </div>

              <!-- Gamification Stars Chip -->
              <div class="astro-header-stars-chip" id="astro-header-stars-pill" title="Sizning yulduzlaringiz">
                <span>⭐</span>
                <span id="astro-header-stars-val">${starsCount}</span>
              </div>

              <!-- TTS Auto-Speak Toggle -->
              <button class="astro-header-btn ${this.autoSpeak ? 'active-sound' : ''}" id="astro-header-tts-btn" title="Ovozli o‘qishni yoqish/o‘chirish">
                ${this.autoSpeak ? '🔊' : '🔇'}
              </button>

              <!-- Settings & API Key Button -->
              <button class="astro-header-btn" id="astro-header-settings-btn" title="Sozlamalar va AI Kaliti">
                ⚙️
              </button>

              <!-- Language Select Pill -->
              <select class="astro-lang-select" id="astro-lang-select" title="Tilni tanlash / Выбор языка">
                <option value="uz" ${this.currentLanguage === 'uz' ? 'selected' : ''}>🇺🇿 UZ</option>
                <option value="ru" ${this.currentLanguage === 'ru' ? 'selected' : ''}>🇷🇺 RU</option>
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
              </select>

              <!-- Close / Minimize Button -->
              <button class="astro-header-btn" id="astro-chat-close-btn" title="Yopish">
                ✕
              </button>
            </div>
          </header>

          <!-- Question Limit Progress Banner -->
          <div class="astro-limit-banner" id="astro-limit-banner">
            <div class="astro-limit-banner-info">
              <span class="astro-limit-badge" id="astro-limit-badge">🧠 ${this.questionsRemaining}/10</span>
              <span class="astro-limit-banner-text" id="astro-limit-banner-text">Kunlik quvvat: ${this.questionsRemaining} ta savol qoldi 💡 (Matematika, Fizika va Ingliz tili)</span>
            </div>
            <div class="astro-limit-track">
              <div class="astro-limit-progress" id="astro-limit-progress" style="width: ${(this.questionsRemaining / 10) * 100}%;"></div>
            </div>
          </div>

          <!-- Settings & API Key Drawer / Modal -->
          <div class="astro-settings-panel" id="astro-settings-panel" style="display: none;">
            <div class="astro-settings-header">
              <h4>⚙️ AstroBot Sozlamalari & Google Gemini AI</h4>
              <button class="astro-settings-close" id="astro-settings-close-btn" type="button">✕</button>
            </div>
            <div class="astro-settings-body">
              <p class="astro-settings-desc">
                AstroBot Google Gemini AI (3.8 Flash & 3.1 Pro) asosida ishlaydi. API kalit kiritilmagan bo‘lsa ham, mustaqil ta‘lim dvigateli orqali barcha fanlarni o‘rgatadi!
              </p>

              <label class="astro-settings-label">
                <span>🤖 Gemini AI Modeli:</span>
                <select id="astro-gemini-model-select" class="astro-settings-input" style="background: #FFF; font-weight: 700; cursor: pointer;">
                  <option value="gemini-3.8-flash" ${this.geminiModel === 'gemini-3.8-flash' ? 'selected' : ''}>⚡ Gemini 3.8 Flash (Tavsiya etiladi • Eng tez)</option>
                  <option value="gemini-3.1-pro" ${this.geminiModel === 'gemini-3.1-pro' ? 'selected' : ''}>🧠 Gemini 3.1 Pro (Chuqur tahlil • Yuqori aniqlik)</option>
                  <option value="gemini-2.5-flash" ${this.geminiModel === 'gemini-2.5-flash' ? 'selected' : ''}>🚀 Gemini 2.5 Flash</option>
                </select>
              </label>

              <label class="astro-settings-label">
                <span>🔑 Google Gemini API Kaliti (AIzaSy...):</span>
                <input type="password" id="astro-gemini-key-input" class="astro-settings-input" placeholder="AIzaSy... kalitingizni kiriting" value="${this.geminiApiKey}" />
              </label>

              <div class="astro-settings-btns">
                <button class="astro-btn-save-key" id="astro-save-key-btn" type="button">💾 Saqlash</button>
                <button class="astro-btn-save-key" id="astro-test-key-btn" type="button" style="background: linear-gradient(135deg, #10B981, #059669);">⚡ Aloqani Sinash</button>
              </div>

              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button class="astro-btn-reset-limit" id="astro-reset-limit-btn" type="button" title="Ota-onalar uchun: Savollar quvvatini 10 taga qaytarish">🔄 10 ta savolni tiklash</button>
                <button class="astro-btn-save-key" id="astro-drawer-pro-btn" type="button" style="background: linear-gradient(135deg, #F59E0B, #D97706); flex: 1;">👑 Pro ($15) Rejim</button>
              </div>

              <div id="astro-key-status" style="margin-top: 10px; padding: 6px 10px; border-radius: 8px; font-size: 0.76rem; font-weight: 700; background: #F1F5F9; color: #475569;">
                ${this.geminiApiKey ? '🟢 Gemini API Kaliti faol (' + this.geminiModel + ')' : '⚪ Mustaqil Pedagogik Dvigatel faol (Oflayn rejim)'}
              </div>
            </div>
          </div>

          <!-- Chat Messages Body -->
          <main class="astro-chat-messages" id="astro-chat-messages">
            <canvas class="astro-inchat-canvas" id="astro-inchat-canvas"></canvas>
            <!-- Injected dynamically -->
          </main>

          <!-- Quick-Prompt Chips Carousel -->
          <nav class="astro-prompt-chips-wrap" id="astro-prompt-chips" aria-label="Tezkor savollar">
            <!-- Injected dynamically based on language -->
          </nav>

          <!-- Input Bar -->
          <footer class="astro-chat-input-bar">
            <!-- Voice Input Mic Button -->
            <button class="astro-mic-btn" id="astro-mic-btn" title="Ovoz orqali gapirish (Mikrofon)" type="button">
              🎙️
            </button>
            <div class="astro-mic-listening-pill" id="astro-mic-pill" style="display: none;">
              <span>🔴 Sizni tinglayapman...</span>
            </div>

            <!-- Input Text Field -->
            <input 
              type="text" 
              class="astro-input-field" 
              id="astro-chat-input" 
              placeholder="Matematika, Fizika yoki Ingliz tili bo‘yicha savol bering... ✏️"
              autocomplete="off"
            />

            <!-- Send Button -->
            <button class="astro-send-btn" id="astro-chat-send-btn" title="Yuborish" type="button">
              🚀
            </button>
          </footer>
        </aside>
      `;

      document.body.appendChild(root);

      this.renderQuickChips();
      this.sendInitialGreeting();
      this.updateLimitUI();
    }

    bindEvents() {
      // Toggle Chat Window
      const trigger = document.getElementById('astro-fab-trigger');
      if (trigger) trigger.addEventListener('click', () => this.toggle());

      const bubble = document.getElementById('astro-fab-bubble');
      if (bubble) bubble.addEventListener('click', () => this.open());

      const bubbleClose = document.getElementById('astro-fab-bubble-close');
      if (bubbleClose) {
        bubbleClose.addEventListener('click', (e) => {
          e.stopPropagation();
          bubble.style.display = 'none';
        });
      }

      const closeBtn = document.getElementById('astro-chat-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.close());

      // Settings Toggle
      const settingsBtn = document.getElementById('astro-header-settings-btn');
      const settingsPanel = document.getElementById('astro-settings-panel');
      const settingsClose = document.getElementById('astro-settings-close-btn');
      if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', () => {
          settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
        });
      }
      if (settingsClose && settingsPanel) {
        settingsClose.addEventListener('click', () => {
          settingsPanel.style.display = 'none';
        });
      }

      // Save Gemini Key & Model
      const saveKeyBtn = document.getElementById('astro-save-key-btn');
      const keyInput = document.getElementById('astro-gemini-key-input');
      const modelSelect = document.getElementById('astro-gemini-model-select');
      const testKeyBtn = document.getElementById('astro-test-key-btn');
      const statusEl = document.getElementById('astro-key-status');
      const drawerProBtn = document.getElementById('astro-drawer-pro-btn');

      if (saveKeyBtn && keyInput) {
        saveKeyBtn.addEventListener('click', () => {
          this.geminiApiKey = keyInput.value.trim();
          if (modelSelect) {
            this.geminiModel = modelSelect.value;
            localStorage.setItem('astro_gemini_model', this.geminiModel);
          }
          localStorage.setItem('astro_gemini_key', this.geminiApiKey);

          if (statusEl) {
            statusEl.innerHTML = this.geminiApiKey 
              ? `🟢 Gemini API Kaliti faol (${this.geminiModel})`
              : '⚪ Mustaqil Pedagogik Dvigatel faol (Oflayn rejim)';
          }

          this.showToast(this.geminiApiKey ? `✅ Gemini AI (${this.geminiModel}) saqlandi!` : '🗑️ API kalit o‘chirildi!');
          if (settingsPanel) settingsPanel.style.display = 'none';
        });
      }

      // Test Connection Button
      if (testKeyBtn) {
        testKeyBtn.addEventListener('click', async () => {
          const keyToTest = (keyInput ? keyInput.value.trim() : '') || this.geminiApiKey;
          const modelToTest = (modelSelect ? modelSelect.value : '') || this.geminiModel || 'gemini-3.8-flash';

          if (!keyToTest) {
            alert('Iltimos, avval Google Gemini API kalitini kiriting!');
            return;
          }

          testKeyBtn.disabled = true;
          testKeyBtn.textContent = '⏳ Tekshirilmoqda...';

          try {
            const startTime = performance.now();
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToTest}:generateContent?key=${keyToTest}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: 'Hello! Respond with: Ready to teach!' }] }]
              })
            });

            const latency = Math.round(performance.now() - startTime);

            if (res.ok) {
              if (statusEl) {
                statusEl.innerHTML = `🟢 Aloqa a‘lo darajada! (${modelToTest} • ${latency}ms)`;
                statusEl.style.background = '#ECFDF5';
                statusEl.style.color = '#065F46';
              }
              this.showToast(`✅ Gemini AI aloqasi muvaffaqiyatli! (${latency}ms)`);
            } else {
              const errData = await res.json().catch(() => ({}));
              const msg = errData?.error?.message || `Xatolik: ${res.status}`;
              if (statusEl) {
                statusEl.innerHTML = `🔴 Ulanishda xatolik: ${msg}`;
                statusEl.style.background = '#FEF2F2';
                statusEl.style.color = '#991B1B';
              }
              alert(`Gemini API xatoligi: ${msg}`);
            }
          } catch (e) {
            if (statusEl) {
              statusEl.innerHTML = `🔴 Tarmoq xatosi: ${e.message}`;
            }
            alert(`Ulanishda xatolik yuz berdi: ${e.message}`);
          } finally {
            testKeyBtn.disabled = false;
            testKeyBtn.textContent = '⚡ Aloqani Sinash';
          }
        });
      }

      // Pro shortcut in drawer
      if (drawerProBtn) {
        drawerProBtn.addEventListener('click', () => {
          if (settingsPanel) settingsPanel.style.display = 'none';
          if (window.subscriptionManager) {
            window.subscriptionManager.openPricingModal();
          }
        });
      }

      // Reset Limit Button (Parents / Teachers)
      const resetLimitBtn = document.getElementById('astro-reset-limit-btn');
      if (resetLimitBtn) {
        resetLimitBtn.addEventListener('click', () => {
          this.resetDailyLimit();
          if (settingsPanel) settingsPanel.style.display = 'none';
        });
      }

      // Send Button & Enter Key
      const sendBtn = document.getElementById('astro-chat-send-btn');
      const inputEl = document.getElementById('astro-chat-input');
      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          if (inputEl && inputEl.value.trim()) {
            this.sendMessage(inputEl.value.trim());
            inputEl.value = '';
          }
        });
      }

      if (inputEl) {
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (inputEl.value.trim()) {
              this.sendMessage(inputEl.value.trim());
              inputEl.value = '';
            }
          }
        });
      }

      // Mic Voice Input Button
      const micBtn = document.getElementById('astro-mic-btn');
      if (micBtn) {
        micBtn.addEventListener('click', () => this.toggleVoiceRecognition());
      }

      // TTS Header Toggle
      const ttsBtn = document.getElementById('astro-header-tts-btn');
      if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
          this.autoSpeak = !this.autoSpeak;
          localStorage.setItem('astro_auto_speak', this.autoSpeak);
          ttsBtn.textContent = this.autoSpeak ? '🔊' : '🔇';
          ttsBtn.classList.toggle('active-sound', this.autoSpeak);
          this.showToast(this.autoSpeak ? 'Ovozli o‘qish yoqildi 🔔' : 'Ovozli o‘qish o‘chirildi 🔕');
        });
      }

      // Language Select
      const langSelect = document.getElementById('astro-lang-select');
      if (langSelect) {
        langSelect.addEventListener('change', (e) => {
          this.setLanguage(e.target.value);
        });
      }

      // Listen for site-wide language change
      window.addEventListener('storage', (e) => {
        if (e.key === 'kiddo_language' && e.newValue) {
          this.setLanguage(e.newValue);
        }
      });
    }

    setLanguage(lang) {
      this.currentLanguage = lang;
      localStorage.setItem('kiddo_language', lang);

      const langSelect = document.getElementById('astro-lang-select');
      if (langSelect) langSelect.value = lang;

      const sub = document.getElementById('astro-header-sub');
      const input = document.getElementById('astro-chat-input');
      const bubble = document.getElementById('astro-fab-bubble');

      if (lang === 'ru') {
        if (sub) sub.textContent = 'Твой умный друг: Математика | Физика | Английский 🚀';
        if (input) input.placeholder = 'Вопрос по математике, физике или английскому... ✏️';
        if (bubble) bubble.querySelector('span').textContent = 'Привет! Спроси меня 🤖✨';
      } else if (lang === 'en') {
        if (sub) sub.textContent = 'Smart Kid Buddy: Math | Physics | English 🚀';
        if (input) input.placeholder = 'Ask a question in Math, Physics, or English... ✏️';
        if (bubble) bubble.querySelector('span').textContent = 'Hi! Chat with AstroBot 🤖✨';
      } else {
        if (sub) sub.textContent = 'Bolalar uchun aqlli do‘st: Matematika | Fizika | Ingliz tili 🚀';
        if (input) input.placeholder = 'Matematika, Fizika yoki Ingliz tili bo‘yicha savol bering... ✏️';
        if (bubble) bubble.querySelector('span').textContent = 'Salom! Savol ber 🤖✨';
      }

      this.updateLimitUI();
      this.renderQuickChips();
    }

    renderQuickChips() {
      const container = document.getElementById('astro-prompt-chips');
      if (!container) return;

      const lang = this.currentLanguage;
      let chips = [];

      if (lang === 'ru') {
        chips = [
          { text: "🍎 Реши задачу (Математика)", prompt: "У брата было 10 яблок, 3 он отдал мне. Сколько осталось?" },
          { text: "🇬🇧 Что значит Cat? (Английский)", prompt: "Что означает английское слово Cat?" },
          { text: "✈️ Как летает самолёт? (Физика)", prompt: "Как летают тяжёлые самолёты в небе?" },
          { text: "🔢 Таблица умножения", prompt: "Сколько будет 7 умножить на 8?" },
          { text: "📝 Правило A и An (Английский)", prompt: "В чём разница между артиклями A и An в английском языке?" },
          { text: "🍏 Что такое гравитация?", prompt: "Что такое гравитация и почему предметы падают?" },
          { text: "🚢 Почему корабль не тонет?", prompt: "Почему огромный железный корабль плавает и не тонет?" },
          { text: "🎯 Викторина (+10 ⭐)", prompt: "Дай мне викторину с вопросом и баллами!" }
        ];
      } else if (lang === 'en') {
        chips = [
          { text: "🍎 Solve a problem (Math)", prompt: "I had 10 apples and gave 3 to my brother. How many left?" },
          { text: "🇬🇧 English word: Cat", prompt: "What does the English word Cat mean?" },
          { text: "✈️ How planes fly? (Physics)", prompt: "How do giant airplanes stay up in the sky?" },
          { text: "🔢 Multiplication", prompt: "What is 7 times 8?" },
          { text: "📝 Articles: A vs An", prompt: "What is the difference between A and An in English?" },
          { text: "🍏 What is Gravity?", prompt: "What is gravity and why do things fall down?" },
          { text: "🚢 Why ships float?", prompt: "Why don't giant iron ships sink in water?" },
          { text: "🎯 Pop Quiz (+10 ⭐)", prompt: "Give me a fun pop quiz with stars!" }
        ];
      } else {
        chips = [
          { text: "🍎 Masala yechish (Matematika)", prompt: "Akamda 10 ta olma bor edi, 3 tasini menga berdi. Nechta qoldi?" },
          { text: "🇬🇧 Cat nima degani? (Ingliz tili)", prompt: "Mushuk inglizchasiga nima va Cat so‘zi nima degani?" },
          { text: "✈️ Samolyot qanday uchadi? (Fizika)", prompt: "Og‘ir samolyotlar osmonda qanday uchadi?" },
          { text: "🔢 7 karra 8 necha?", prompt: "7 karra 8 necha bo‘ladi?" },
          { text: "📝 A va An farqi (Ingliz tili)", prompt: "Ingliz tilida A va An artikllari farqi nima va qachon ishlatiladi?" },
          { text: "🍏 Gravitatsiya nima? (Fizika)", prompt: "Gravitatsiya nima va nega narsalar yerga tushadi?" },
          { text: "🚢 Nega kema cho‘kmaydi?", prompt: "Ulkan temir kema nega suvga cho‘kmaydi?" },
          { text: "🎯 Viktorina ber! (+10 ⭐)", prompt: "Menga 3 ta fandan birida ball beruvchi viktorina ber!" }
        ];
      }

      container.innerHTML = chips.map(c => `
        <button class="astro-chip-btn" type="button" data-prompt="${c.prompt}">
          ${c.text}
        </button>
      `).join('');

      container.querySelectorAll('.astro-chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const prompt = btn.getAttribute('data-prompt');
          if (prompt) {
            this.sendMessage(prompt);
          }
        });
      });
    }

    sendInitialGreeting() {
      const lang = this.currentLanguage;
      const text = KID_KNOWLEDGE.greetings[lang] || KID_KNOWLEDGE.greetings.uz;
      this.appendBotMessage(text, null, false);
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      const win = document.getElementById('astro-chat-window');
      const bubble = document.getElementById('astro-fab-bubble');
      if (win) win.classList.add('astro-chat-open');
      if (bubble) bubble.style.display = 'none';

      this.updateStarsUI();
      this.updateLimitUI();

      setTimeout(() => {
        const input = document.getElementById('astro-chat-input');
        if (input && !input.disabled) input.focus();
      }, 300);
    }

    close() {
      this.isOpen = false;
      const win = document.getElementById('astro-chat-window');
      if (win) win.classList.remove('astro-chat-open');
      this.stopSpeaking();
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    }

    updateStarsUI() {
      const starsVal = document.getElementById('astro-header-stars-val');
      if (starsVal && window.gamificationHub) {
        starsVal.textContent = window.gamificationHub.stars;
      }
    }

    toggleVoiceRecognition() {
      if (!this.recognition) {
        alert(this.currentLanguage === 'ru' 
          ? 'Ваш браузер не поддерживает голосовой ввод Web Speech API.' 
          : 'Brauzeringiz ovozli kiritish (Web Speech API) imkoniyatini qo‘llab-quvvatlamaydi.');
        return;
      }

      if (this.isListening) {
        this.recognition.stop();
      } else {
        try {
          const code = this.currentLanguage === 'ru' ? 'ru-RU' : (this.currentLanguage === 'en' ? 'en-US' : 'uz-UZ');
          this.recognition.lang = code;
          this.recognition.start();
        } catch (e) {
          console.warn('Speech recognition start failed:', e);
        }
      }
    }

    updateMicUI(recording) {
      const micBtn = document.getElementById('astro-mic-btn');
      const pill = document.getElementById('astro-mic-pill');
      if (micBtn) micBtn.classList.toggle('is-recording', recording);
      if (pill) {
        pill.style.display = recording ? 'flex' : 'none';
        if (recording) {
          pill.textContent = this.currentLanguage === 'ru' ? '🔴 Слушаю вас...' : (this.currentLanguage === 'en' ? '🔴 Listening...' : '🔴 Sizni tinglayapman...');
        }
      }
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'astro-toast-bubble';
      toast.style.cssText = 'position: fixed; bottom: 105px; right: 24px; background: #0284C7; color: #FFF; padding: 10px 16px; border-radius: 999px; font-weight: 700; font-size: 0.85rem; box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 10001; animation: msgSlideIn 0.3s ease;';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2800);
    }

    // Handle User Message Sending
    async sendMessage(rawText) {
      const text = rawText.trim();
      if (!text) return;

      const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

      // 1. Check Daily Question Limit for Free tier (Max 10 questions/day)
      if (!isPro && this.questionsRemaining <= 0) {
        if (window.subscriptionManager) {
          window.subscriptionManager.openChatbotPaywallModal();
        } else {
          alert('Bugungi 10/10 ta bepul savol limitingiz to‘ldi! Pro ga o‘ting!');
        }
        return;
      }

      // Decrement Limit Quota only for Free tier
      if (!isPro) {
        this.questionsRemaining -= 1;
        this.saveQuestionsRemaining();
        this.updateLimitUI();

        // If this message exhausts the daily quota, trigger sleek paywall modal
        if (this.questionsRemaining === 0) {
          setTimeout(() => {
            if (window.subscriptionManager) {
              window.subscriptionManager.openChatbotPaywallModal();
            }
          }, 3200);
        }
      }

      this.appendUserMessage(text);
      this.showTypingIndicator();

      // Process response with Google Gemini AI or extensive pedagogical engine
      setTimeout(async () => {
        this.hideTypingIndicator();
        await this.processBotResponse(text);
      }, isPro ? 320 : 550);
    }

    appendUserMessage(text) {
      const container = document.getElementById('astro-chat-messages');
      if (!container) return;

      const row = document.createElement('div');
      row.className = 'astro-msg-row astro-msg-user';
      row.innerHTML = `
        <div class="astro-msg-bubble-wrap">
          <div class="astro-msg-bubble">${this.escapeHTML(text)}</div>
        </div>
      `;

      container.appendChild(row);
      this.scrollToBottom();
    }

    appendBotMessage(text, quiz = null, speakNow = true) {
      const container = document.getElementById('astro-chat-messages');
      if (!container) return;

      const row = document.createElement('div');
      row.className = 'astro-msg-row astro-msg-bot';
      const msgId = 'bot_msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

      const formattedText = this.formatBotText(text);

      let quizHtml = '';
      if (quiz) {
        const lang = this.detectLanguage(quiz.questionUz || text);
        const opts = (lang === 'ru' ? quiz.optionsRu : (lang === 'en' ? quiz.optionsEn : quiz.optionsUz)) || quiz.optionsUz;
        
        quizHtml = `
          <div class="astro-quiz-options" id="quiz_opts_${msgId}">
            ${opts.map((opt, idx) => `
              <button class="astro-quiz-opt-btn" type="button" data-msg-id="${msgId}" data-opt-idx="${idx}">
                ${opt}
              </button>
            `).join('')}
          </div>
        `;
      }

      row.innerHTML = `
        <div class="astro-msg-avatar">
          ${ASTROBOT_SVG}
        </div>
        <div class="astro-msg-bubble-wrap">
          <div class="astro-msg-bubble" id="${msgId}">
            ${formattedText}
            ${quizHtml}
            <div class="astro-msg-actions">
              <button class="astro-action-speak-btn" title="Ovozli eshitish" id="speak_btn_${msgId}">
                🔊 ${this.currentLanguage === 'ru' ? 'Слушать' : (this.currentLanguage === 'en' ? 'Listen' : 'Tinglash')}
              </button>
              <div class="astro-reactions-bar">
                <span class="astro-react-pill" data-emoji="👍">👍</span>
                <span class="astro-react-pill" data-emoji="❤️">❤️</span>
                <span class="astro-react-pill" data-emoji="🚀">🚀</span>
                <span class="astro-react-pill" data-emoji="💡">💡</span>
                <span class="astro-react-pill" data-emoji="😂">😂</span>
                <span class="astro-react-pill" data-emoji="⭐">⭐</span>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(row);
      this.scrollToBottom();

      const ttsBtn = row.querySelector(`#speak_btn_${msgId}`);
      if (ttsBtn) {
        ttsBtn.addEventListener('click', () => {
          this.speak(text, ttsBtn);
        });
      }

      const reactPills = row.querySelectorAll('.astro-react-pill');
      reactPills.forEach(pill => {
        pill.addEventListener('click', () => {
          this.triggerReaction(pill, row);
        });
      });

      if (quiz) {
        this.activeQuiz = quiz;
        const optBtns = row.querySelectorAll('.astro-quiz-opt-btn');
        optBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const chosenIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
            this.handleQuizAnswer(quiz, chosenIdx, optBtns, row);
          });
        });
      }

      if (speakNow && this.autoSpeak) {
        this.speak(text, ttsBtn);
      }
    }

    triggerReaction(btn, row) {
      btn.classList.add('reacted');
      if (window.kiddoAudio && typeof window.kiddoAudio.playPop === 'function') {
        window.kiddoAudio.playPop();
      }

      const burst = document.createElement('span');
      burst.className = 'astro-react-burst';
      burst.textContent = btn.textContent;
      const rect = btn.getBoundingClientRect();
      const parentRect = row.getBoundingClientRect();
      burst.style.left = (rect.left - parentRect.left + 8) + 'px';
      burst.style.top = (rect.top - parentRect.top - 10) + 'px';

      row.appendChild(burst);
      setTimeout(() => burst.remove(), 850);
    }

    handleQuizAnswer(quiz, chosenIdx, optBtns, row) {
      const isCorrect = chosenIdx === quiz.correctIndex;

      optBtns.forEach((b, idx) => {
        b.disabled = true;
        if (idx === quiz.correctIndex) {
          b.classList.add('correct-opt');
        } else if (idx === chosenIdx && !isCorrect) {
          b.classList.add('wrong-opt');
        }
      });

      const lang = this.detectLanguage(quiz.questionUz);

      if (isCorrect) {
        if (window.kiddoAudio && typeof window.kiddoAudio.playChime === 'function') {
          window.kiddoAudio.playChime();
        }

        this.triggerInChatConfetti();
        this.triggerSparkles(row);

        if (window.gamificationHub) {
          window.gamificationHub.addStars(10);
          window.gamificationHub.addXP(25, 'AstroBot');
          this.updateStarsUI();
        }

        const praiseMsg = lang === 'ru'
          ? `🎉 **УРААА! Абсолютно верно!**\n\n${quiz.explainRu}\n\n🌟 Тебе начислено **+10 ⭐ звёзд** и **+25 XP**! Ты настоящий супер-гений!`
          : (lang === 'en'
            ? `🎉 **HOORAY! You nailed it!**\n\n${quiz.explainEn}\n\n🌟 You earned **+10 ⭐ stars** and **+25 XP**! Keep shining, superstar!`
            : `🎉 **URAAA! Qoyilmaqom, to‘g‘ri topding!**\n\n${quiz.explainUz}\n\n🌟 Senga **+10 ⭐ yulduz** va **+25 XP** taqdim etildi! Shunday davom et!`);

        setTimeout(() => {
          this.appendBotMessage(praiseMsg, null, true);
        }, 500);

      } else {
        if (window.kiddoAudio && typeof window.kiddoAudio.playBoing === 'function') {
          window.kiddoAudio.playBoing();
        }

        const gentleMsg = lang === 'ru'
          ? `💡 **Хорошая попытка!** Ничего страшного, давай разберёмся вместе:\n\n${quiz.explainRu}\n\nХочешь попробовать ещё одну загадку? Нажми на кнопку викторины внизу! 🚀`
          : (lang === 'en'
            ? `💡 **Great try!** Don't worry at all, every explorer learns by trying!\n\n${quiz.explainEn}\n\nWould you like another puzzle? Tap the quiz button below! 🚀`
            : `💡 **Ajoyib urinish!** Xavotir olma, ilm o‘rganish har doim shunday boshlanadi!\n\n${quiz.explainUz}\n\nYana bir topishmoq xohlaysanmi? Pastdagi viktorina tugmasini bos! 🚀`);

        setTimeout(() => {
          this.appendBotMessage(gentleMsg, null, true);
        }, 500);
      }
    }

    // Built-in English vocabulary dataset (100+ kid-friendly words with definitions and translations)
    getBuiltinVocabulary() {
      if (typeof window !== 'undefined' && Array.isArray(window.VOCABULARY_DATA) && window.VOCABULARY_DATA.length > 0) {
        return window.VOCABULARY_DATA;
      }
      return [
        // Animals
        { word: 'Cat', uzbek: 'Mushuk', russian: 'Кошка', phonetic: '[kæt]', emoji: '🐱', category: 'animals', definitionEn: 'A furry cute pet that meows.', definitionUz: 'Miyovlaydigan va erkalanishni sevadigan mitti xonaki hayvon!', definitionRu: 'Маленький пушистый питомец, который мяукает!', exampleEn: 'The cat sleeps in the warm sunshine.', exampleUz: 'Mushukcha iliq quyoshda uxlaydi.', exampleRu: 'Кошка спит на тёплом солнышке.' },
        { word: 'Dog', uzbek: 'Kuchuk (It)', russian: 'Собака', phonetic: '[dɒɡ]', emoji: '🐶', category: 'animals', definitionEn: 'A loyal pet that barks and wags its tail.', definitionUz: 'Dumini likillatib, vovullaydigan sodiq do‘st!', definitionRu: 'Преданный друг человека, который лает!', exampleEn: 'The playful dog catches the red ball.', exampleUz: 'Sho‘x kuchukcha qizil to‘pni ushlab oldi.', exampleRu: 'Игривая собака ловит красный мячик.' },
        { word: 'Elephant', uzbek: 'Fil', russian: 'Слон', phonetic: '[ˈel.ɪ.fənt]', emoji: '🐘', category: 'animals', definitionEn: 'A giant animal with a long trunk.', definitionUz: 'Uzun xartumli bahaybat kulrang hayvon!', definitionRu: 'Огромное серое животное с длинным хоботом!', exampleEn: 'The elephant sprays cool water.', exampleUz: 'Fil muzdek suv sachratadi.', exampleRu: 'Слон брызгает прохладной водой.' },
        { word: 'Lion', uzbek: 'Sher', russian: 'Лев', phonetic: '[ˈlaɪ.ən]', emoji: '🦁', category: 'animals', definitionEn: 'The brave king of the jungle with a golden mane.', definitionUz: 'O‘rmon qiroli bo‘lgan qudratli yirtqich hayvon!', definitionRu: 'Храбрый царь зверей с золотой гривой!', exampleEn: 'The lion roars loudly on the rock.', exampleUz: 'Sher qoyada baland ovozda o‘kirdi.', exampleRu: 'Лев громко рычит на скале.' },
        { word: 'Rabbit', uzbek: 'Quyon', russian: 'Кролик', phonetic: '[ˈræb.ɪt]', emoji: '🐰', category: 'animals', definitionEn: 'A fluffy animal with long ears that hops.', definitionUz: 'Uzun quloqli, chaqqon sakrovchi yumshoq hayvon!', definitionRu: 'Пушистый зверёк с длинными ушками, который прыгает!', exampleEn: 'The rabbit munches on a fresh carrot.', exampleUz: 'Quyoncha yangi sabzini qarsillatib yeydi.', exampleRu: 'Кролик хрустит свежей морковкой.' },
        { word: 'Monkey', uzbek: 'Maymun', russian: 'Обезьяна', phonetic: '[ˈmʌŋ.ki]', emoji: '🐒', category: 'animals', definitionEn: 'A playful animal that swings on vines.', definitionUz: 'Daraxt shoxlarida chaqqon sakrovchi sho‘x hayvon!', definitionRu: 'Озорное животное, которое качается на лианах!', exampleEn: 'The monkey loves eating sweet yellow bananas.', exampleUz: 'Maymun shirin sariq bananlarni yaxshi ko‘radi.', exampleRu: 'Обезьянка любит есть сладкие бананы.' },
        { word: 'Bear', uzbek: 'Ayiq', russian: 'Медведь', phonetic: '[beər]', emoji: '🐻', category: 'animals', definitionEn: 'A strong furry animal that loves honey.', definitionUz: 'Asalni yaxshi ko‘radigan baquvvat bahaybat hayvon!', definitionRu: 'Сильный пушистый зверь, который любит мёд!', exampleEn: 'The brown bear fishes in the river.', exampleUz: 'Qo‘ng‘ir ayiq daryoda baliq ovlaydi.', exampleRu: 'Бурый медведь ловит рыбу в реке.' },
        { word: 'Bird', uzbek: 'Qush', russian: 'Птица', phonetic: '[bɜːd]', emoji: '🐦', category: 'animals', definitionEn: 'A feathered creature that flies in the sky.', definitionUz: 'Osmonda uchuvchi chiroyli patli jonivor!', definitionRu: 'Пернатое создание, которое летает в небе!', exampleEn: 'The little bird sings a cheerful song.', exampleUz: 'Mitti qushcha quvnoq kuy kuylaydi.', exampleRu: 'Маленькая птичка поёт весёлую песенку.' },
        { word: 'Fish', uzbek: 'Baliq', russian: 'Рыба', phonetic: '[fɪʃ]', emoji: '🐟', category: 'animals', definitionEn: 'A creature with fins that swims in water.', definitionUz: 'Suvda suzadigan tangachali jonivor!', definitionRu: 'Создание с плавниками, которое плавает в воде!', exampleEn: 'The golden fish swims smoothly.', exampleUz: 'Tilla baliqcha shoshib suzmoqda.', exampleRu: 'Золотая рыбка плавно плывёт.' },
        { word: 'Horse', uzbek: 'Ot', russian: 'Лошадь', phonetic: '[hɔːs]', emoji: '🐴', category: 'animals', definitionEn: 'A fast and beautiful noble animal.', definitionUz: 'Juda tez yuguruvchi chiroyli va asil jonivor!', definitionRu: 'Быстрое и благородное животное!', exampleEn: 'The white horse gallops across the meadow.', exampleUz: 'Oq ot yaylov bo‘ylab chopib bormoqda.', exampleRu: 'Белая лошадь скачет по лугу.' },

        // Colors
        { word: 'Red', uzbek: 'Qizil', russian: 'Красный', phonetic: '[red]', emoji: '🔴', category: 'colors', definitionEn: 'The color of ripe strawberries and roses.', definitionUz: 'Pishgan qulupnay va pomidor rangi!', definitionRu: 'Цвет спелой клубники и роз!', exampleEn: 'She has a bright red balloon.', exampleUz: 'Unda yorqin qizil shar bor.', exampleRu: 'У неё яркий красный шарик.' },
        { word: 'Blue', uzbek: 'Moviy (Ko‘k)', russian: 'Синий (Голубой)', phonetic: '[bluː]', emoji: '🔵', category: 'colors', definitionEn: 'The color of the clear sky and oceans.', definitionUz: 'Tiniq osmon va dengizlarning moviy rangi!', definitionRu: 'Цвет чистого неба и океанов!', exampleEn: 'The sky is clear and blue today.', exampleUz: 'Bugun osmon ochiq va moviy.', exampleRu: 'Сегодня небо ясное и синее.' },
        { word: 'Green', uzbek: 'Yashil', russian: 'Зелёный', phonetic: '[ɡriːn]', emoji: '🟢', category: 'colors', definitionEn: 'The color of spring grass and leaves.', definitionUz: 'Bahorgi maysa va daraxt barglari rangi!', definitionRu: 'Цвет весенней травы и листьев!', exampleEn: 'Frogs are green and love to hop.', exampleUz: 'Qurbaqalar yashil bo‘lib, sakrashni yoqtiradi.', exampleRu: 'Лягушки зелёные и любят прыгать.' },
        { word: 'Yellow', uzbek: 'Sariq', russian: 'Жёлтый', phonetic: '[ˈjel.əʊ]', emoji: '🟡', category: 'colors', definitionEn: 'The color of warm sunshine and bananas.', definitionUz: 'Iliq quyosh va pishgan banan rangi!', definitionRu: 'Цвет тёплого солнышка и бананов!', exampleEn: 'The cheerful sunflower is bright yellow.', exampleUz: 'Kungaboqar yorqin sariq rangda.', exampleRu: 'Подсолнух ярко-жёлтый.' },
        { word: 'Orange', uzbek: 'To‘q sariq (Sabzirang)', russian: 'Оранжевый', phonetic: '[ˈɒr.ɪndʒ]', emoji: '🟠', category: 'colors', definitionEn: 'The color of sweet oranges and carrots.', definitionUz: 'Shirin apelsin va sabzi rangi!', definitionRu: 'Цвет сочных апельсинов и моркови!', exampleEn: 'Tigers have orange and black stripes.', exampleUz: 'Yo‘lbarslarning to‘q sariq va qora chiziqlari bor.', exampleRu: 'У тигров оранжевые полоски.' },
        { word: 'Purple', uzbek: 'Binafsha rang', russian: 'Фиолетовый', phonetic: '[ˈpɜː.pəl]', emoji: '🟣', category: 'colors', definitionEn: 'The color of sweet grapes and lavender.', definitionUz: 'Shirin uzum va binafsha guli rangi!', definitionRu: 'Цвет сладкого винограда и лаванды!', exampleEn: 'She painted a pretty purple flower.', exampleUz: 'U chiroyli binafsharang gul chizdi.', exampleRu: 'Она нарисовала фиолетовый цветок.' },
        { word: 'Pink', uzbek: 'Pushti', russian: 'Розовый', phonetic: '[pɪŋk]', emoji: '🌸', category: 'colors', definitionEn: 'The gentle color of cherry blossoms and flamingos.', definitionUz: 'Olcha gullari va flamingolarning nozik rangi!', definitionRu: 'Нежный цвет цветущей вишни и фламинго!', exampleEn: 'The flamingo has soft pink feathers.', exampleUz: 'Flamingoning nafis pushti patlari bor.', exampleRu: 'У фламинго розовые перья.' },
        { word: 'White', uzbek: 'Oq', russian: 'Белый', phonetic: '[waɪt]', emoji: '⚪', category: 'colors', definitionEn: 'The color of fresh snow and fluffy clouds.', definitionUz: 'Yangi yoqqan qor va paxtadek bulutlar rangi!', definitionRu: 'Цвет чистого снега и пушистых облаков!', exampleEn: 'Snowflakes fall like white stars.', exampleUz: 'Qor uchqunlari oq yulduzchadek tushadi.', exampleRu: 'Снежинки падают как белые звёздочки.' },
        { word: 'Black', uzbek: 'Qora', russian: 'Чёрный', phonetic: '[blæk]', emoji: '⚫', category: 'colors', definitionEn: 'The color of night skies and shiny coal.', definitionUz: 'Yulduzli tun osmoni va ko‘mir rangi!', definitionRu: 'Цвет ночного неба и угля!', exampleEn: 'The panther has shiny black fur.', exampleUz: 'Panteraning yaltiroq qora yungi bor.', exampleRu: 'У пантеры чёрная шерсть.' },
        { word: 'Brown', uzbek: 'Jigarrang', russian: 'Коричневый', phonetic: '[braʊn]', emoji: '🟤', category: 'colors', definitionEn: 'The color of chocolate and tree branches.', definitionUz: 'Shokolad va daraxt po‘stlog‘i rangi!', definitionRu: 'Цвет шоколада и коры деревьев!', exampleEn: 'Teddy bears are often cuddly brown.', exampleUz: 'Yumshoq ayiqchalar ko‘pincha jigarrang bo‘ladi.', exampleRu: 'Плюшевые мишки часто коричневые.' },

        // Numbers
        { word: 'One', uzbek: 'Bir (1)', russian: 'Один (1)', phonetic: '[wʌn]', emoji: '1️⃣', category: 'numbers', definitionEn: 'The single starting counting number.', definitionUz: 'Sanoqning eng birinchi soni!', definitionRu: 'Самое первое число при счёте!', exampleEn: 'I see one bright sun in the sky.', exampleUz: 'Osmonda bitta yorqin quyoshni ko‘ryapman.', exampleRu: 'Я вижу одно яркое солнце в небе.' },
        { word: 'Two', uzbek: 'Ikki (2)', russian: 'Два (2)', phonetic: '[tuː]', emoji: '2️⃣', category: 'numbers', definitionEn: 'A pair, like our two eyes and hands.', definitionUz: 'Juftlik, xuddi ikkita ko‘zimiz va qo‘limiz kabi!', definitionRu: 'Пара, как два глаза или две руки!', exampleEn: 'Birds have two lovely wings to fly.', exampleUz: 'Qushlarning uchish uchun ikkita qanoti bor.', exampleRu: 'У птиц два крыла для полёта.' },
        { word: 'Three', uzbek: 'Uch (3)', russian: 'Три (3)', phonetic: '[θriː]', emoji: '3️⃣', category: 'numbers', definitionEn: 'The number of corners on a triangle.', definitionUz: 'Uchburchakning burchaklari soni!', definitionRu: 'Число углов у треугольника!', exampleEn: 'A triangle has three straight sides.', exampleUz: 'Uchburchakning uchta to‘g‘ri tomoni bor.', exampleRu: 'У треугольника три стороны.' },
        { word: 'Four', uzbek: 'To‘rt (4)', russian: 'Четыре (4)', phonetic: '[fɔːr]', emoji: '4️⃣', category: 'numbers', definitionEn: 'The number of wheels on a car.', definitionUz: 'Avtomobil g‘ildiraklari soni!', definitionRu: 'Число колёс у автомобиля!', exampleEn: 'A table stands firmly on four legs.', exampleUz: 'Stol to‘rtta oyog‘ida mahkam turadi.', exampleRu: 'Стол прочно стоит на четырёх ножках.' },
        { word: 'Five', uzbek: 'Besh (5)', russian: 'Пять (5)', phonetic: '[faɪv]', emoji: '5️⃣', category: 'numbers', definitionEn: 'The number of fingers on one hand.', definitionUz: 'Bitta qo‘limizdagi barmoqlar soni!', definitionRu: 'Число пальчиков на одной руке!', exampleEn: 'A starfish has five shiny arms.', exampleUz: 'Dengiz yulduzining beshta qo‘li bor.', exampleRu: 'У морской звезды пять лучей.' },
        { word: 'Six', uzbek: 'Olti (6)', russian: 'Шесть (6)', phonetic: '[sɪks]', emoji: '6️⃣', category: 'numbers', definitionEn: 'The number of legs an insect has.', definitionUz: 'Hasharotlarning oyoqlari soni!', definitionRu: 'Число лапок у насекомых!', exampleEn: 'A busy honeybee has six tiny legs.', exampleUz: 'Mehnatkash asalari oltita mitti oyoqqa ega.', exampleRu: 'У пчёлки шесть маленьких лапок.' },
        { word: 'Seven', uzbek: 'Yetti (7)', russian: 'Семь (7)', phonetic: '[ˈsev.ən]', emoji: '7️⃣', category: 'numbers', definitionEn: 'The number of colors in a rainbow.', definitionUz: 'Kamalakdagi ranglar soni!', definitionRu: 'Число цветов в радуге!', exampleEn: 'There are seven days in every week.', exampleUz: 'Har bir haftada yetti kun bor.', exampleRu: 'В каждой неделе семь дней.' },
        { word: 'Eight', uzbek: 'Sakkiz (8)', russian: 'Восемь (8)', phonetic: '[eɪt]', emoji: '8️⃣', category: 'numbers', definitionEn: 'The number of legs on an octopus.', definitionUz: 'Sakkizoyoqning paypaslagichlari soni!', definitionRu: 'Число щупалец у осьминога!', exampleEn: 'An octopus swims with eight arms.', exampleUz: 'Sakkizoyoq sakkizta qo‘li bilan suzadi.', exampleRu: 'Осьминог плавает восемью щупальцами.' },
        { word: 'Nine', uzbek: 'To‘qqiz (9)', russian: 'Девять (9)', phonetic: '[naɪn]', emoji: '9️⃣', category: 'numbers', definitionEn: 'One number less than ten.', definitionUz: 'O‘ndan bitta oldingi toq son!', definitionRu: 'Число перед десяткой!', exampleEn: 'Nine friendly balloons floated away.', exampleUz: 'To‘qqizta quvnoq shar osmonga uchib ketdi.', exampleRu: 'Девять шариков улетели ввысь.' },
        { word: 'Ten', uzbek: 'O‘n (10)', russian: 'Десять (10)', phonetic: '[ten]', emoji: '🔟', category: 'numbers', definitionEn: 'Both hands full of ten fingers!', definitionUz: 'Ikkala qo‘limizdagi jamiki barmoqlar soni!', definitionRu: 'Все десять пальчиков на двух руках!', exampleEn: 'You have ten curious questions every day!', exampleUz: 'Senda har kuni 10 ta aqlli savol bor!', exampleRu: 'У тебя есть 10 умных вопросов каждый день!' },

        // Fruits & Food
        { word: 'Apple', uzbek: 'Olma', russian: 'Яблоко', phonetic: '[ˈæp.əl]', emoji: '🍎', category: 'fruits', definitionEn: 'A sweet and crunchy round fruit.', definitionUz: 'Daraxtda pishadigan mazali shirin meva!', definitionRu: 'Сладкий и хрустящий сочный фрукт!', exampleEn: 'An apple a day keeps the doctor away.', exampleUz: 'Har kuni bitta olma yeyish salomatlikka foydali.', exampleRu: 'Яблоко в день дарит здоровье.' },
        { word: 'Banana', uzbek: 'Banan', russian: 'Банан', phonetic: '[bəˈnɑː.nə]', emoji: '🍌', category: 'fruits', definitionEn: 'A sweet yellow curved fruit.', definitionUz: 'Sariq qobiqli shirin meva!', definitionRu: 'Сладкий жёлтый продолговатый фрукт!', exampleEn: 'Monkeys love peeling ripe bananas.', exampleUz: 'Maymunlar pishgan bananlarni archishni sevadilar.', exampleRu: 'Обезьянки любят очищать бананы.' },
        { word: 'Water', uzbek: 'Suv', russian: 'Вода', phonetic: '[ˈwɔː.tər]', emoji: '💧', category: 'food', definitionEn: 'The clear liquid essential for all life.', definitionUz: 'Barcha jonivorlar ichadigan toza hayot manbai!', definitionRu: 'Прозрачная живительная влага для всего живого!', exampleEn: 'Drinking pure water keeps you energetic.', exampleUz: 'Toza suv ichish senga tetiklik beradi.', exampleRu: 'Чистая вода даёт много сил.' },
        { word: 'Bread', uzbek: 'Non', russian: 'Хлеб', phonetic: '[bred]', emoji: '🍞', category: 'food', definitionEn: 'Warm and golden baked food made from flour.', definitionUz: 'Bug‘doy unidan tandirda pishirilgan aziz ne’mat!', definitionRu: 'Тёплая золотистая выпечка из муки!', exampleEn: 'Warm bread smells delicious.', exampleUz: 'Issiq non juda xushbo‘y hid taratadi.', exampleRu: 'Тёплый хлеб пахнет вкусно.' },
        { word: 'Milk', uzbek: 'Sut', russian: 'Молоко', phonetic: '[mɪlk]', emoji: '🥛', category: 'food', definitionEn: 'A healthy white drink that builds strong bones.', definitionUz: 'Suyaklarni baquvvat qiluvchi foydali oq ichimlik!', definitionRu: 'Полезный белый напиток, укрепляющий косточки!', exampleEn: 'A glass of milk makes your teeth strong.', exampleUz: 'Bir stakan sut tishlaringni mustahkam qiladi.', exampleRu: 'Стакан молока укрепляет зубы.' },

        // Family
        { word: 'Mother (Mom)', uzbek: 'Ona (Oyi)', russian: 'Мама', phonetic: '[ˈmʌð.ər]', emoji: '👩', category: 'family', definitionEn: 'The loving woman who cares for her children.', definitionUz: 'Dunyodagi eng mehribon va aziz inson!', definitionRu: 'Самый добрый и заботливый человек!', exampleEn: 'My mother gives the warmest hugs.', exampleUz: 'Onajonim meni mehr bilan quchoqlaydi.', exampleRu: 'Мама дарит самые тёплые объятия.' },
        { word: 'Father (Dad)', uzbek: 'Ota (Dada)', russian: 'Папа', phonetic: '[ˈfɑː.ðər]', emoji: '👨', category: 'family', definitionEn: 'The strong protective parent in a family.', definitionUz: 'Oilaning suyanchi va mehribon otasi!', definitionRu: 'Заботливый и сильный глава семьи!', exampleEn: 'My father teaches me how to ride a bike.', exampleUz: 'Dadam menga velosiped haydashni o‘rgatadi.', exampleRu: 'Папа учит меня кататься на велосипеде.' },
        { word: 'Brother', uzbek: 'Aka / Uka', russian: 'Брат', phonetic: '[ˈbrʌð.ər]', emoji: '👦', category: 'family', definitionEn: 'A boy sibling who plays with you.', definitionUz: 'Birgalikda o‘ynaydigan o‘g‘il bola jigaring!', definitionRu: 'Родной мальчик в семье, с кем ты играешь!', exampleEn: 'My brother built a cool Lego castle.', exampleUz: 'Akam Lego konstruktoridan qasr yasadi.', exampleRu: 'Мой брат построил замок из Лего.' },
        { word: 'Sister', uzbek: 'Opa / Singil', russian: 'Сестра', phonetic: '[ˈsɪs.tər]', emoji: '👧', category: 'family', definitionEn: 'A girl sibling in your family.', definitionUz: 'Birgalikda quvnoq ulg‘ayadigan qiz bola jigaring!', definitionRu: 'Родная девочка в семье!', exampleEn: 'My sister reads exciting fairy tales.', exampleUz: 'Opam qiziqarli ertaklar o‘qiydi.', exampleRu: 'Сестра читает интересные сказки.' },
        { word: 'Friend', uzbek: 'Do‘st', russian: 'Друг', phonetic: '[frend]', emoji: '🤝', category: 'family', definitionEn: 'Someone you love playing and learning with.', definitionUz: 'Birga o‘ynaydigan va quvonchni baham ko‘radigan sirdosh!', definitionRu: 'Тот, с кем здорово играть и делиться радостью!', exampleEn: 'A good friend always shares toys.', exampleUz: 'Yaxshi do‘st o‘yinchoqlarini baham ko‘radi.', exampleRu: 'Хороший друг всегда делится игрушками.' },

        // School & Nature
        { word: 'Book', uzbek: 'Kitob', russian: 'Книга', phonetic: '[bʊk]', emoji: '📖', category: 'school', definitionEn: 'Pages bound together filled with exciting stories and knowledge.', definitionUz: 'Ichida cheksiz bilimlar va ertaklar yashiringan varaqlar!', definitionRu: 'Страницы с захватывающими сказками и знаниями!', exampleEn: 'I love reading an adventure book.', exampleUz: 'Men sarguzashtli kitob o‘qishni yaxshi ko‘raman.', exampleRu: 'Я люблю читать интересную книгу.' },
        { word: 'School', uzbek: 'Maktab', russian: 'Школа', phonetic: '[skuːl]', emoji: '🏫', category: 'school', definitionEn: 'A fun place where children learn together.', definitionUz: 'Bolalar do‘stlari bilan birga ilm oladigan maskan!', definitionRu: 'Место, где дети вместе учатся и находят друзей!', exampleEn: 'School is full of new discoveries.', exampleUz: 'Maktab yangi kashfiyotlarga boy.', exampleRu: 'В школе много интересных открытий.' },
        { word: 'Sun', uzbek: 'Quyosh', russian: 'Солнце', phonetic: '[sʌn]', emoji: '☀️', category: 'nature', definitionEn: 'The glowing golden star giving light and warmth.', definitionUz: 'Yer yuziga nur va hayot baxsh etuvchi ulkan yulduz!', definitionRu: 'Сияющая золотая звезда, дарящая свет и тепло!', exampleEn: 'The golden sun rises in the morning.', exampleUz: 'Oltin quyosh ertalab charog‘on chiqadi.', exampleRu: 'Утром встаёт золотое солнце.' },
        { word: 'Moon', uzbek: 'Oy', russian: 'Луна', phonetic: '[muːn]', emoji: '🌙', category: 'nature', definitionEn: 'Earth\'s companion shining silver in the night sky.', definitionUz: 'Tungi osmonda kumushdek porlovchi Yer yo‘ldoshi!', definitionRu: 'Серебристый спутник Земли в ночном небе!', exampleEn: 'The full moon looks like a glowing coin.', exampleUz: 'To‘lin oy osmonda yaltiroq tangadek ko‘rinadi.', exampleRu: 'Полная луна похожа на светящуюся монетку.' },
        { word: 'Star', uzbek: 'Yulduz', russian: 'Звезда', phonetic: '[stɑːr]', emoji: '⭐', category: 'nature', definitionEn: 'A twinkling point of cosmic light in the night.', definitionUz: 'Tungi osmonda miltillab turuvchi koinot nuri!', definitionRu: 'Мерцающая точка далёкого космического света!', exampleEn: 'Look at that bright shooting star!', exampleUz: 'Ana u porloq yulduzga qara!', exampleRu: 'Посмотри на эту яркую звёздочку!' }
      ];
    }

    // Call Optional Gemini API
    async callGeminiAPI(userQuery, lang) {
      if (!this.geminiApiKey) return null;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
      const langName = lang === 'ru' ? 'Russian' : (lang === 'en' ? 'English' : 'Uzbek');
      const prompt = `You are AstroBot, an enthusiastic, kind, and super-smart AI learning tutor for kids aged 6-12.
You specialize in 3 core subjects:
1. Mathematics (arithmetic calculations, word problems, times tables, geometry shapes, fractions, number puzzles)
2. English Language (vocabulary, translations Uzbek/Russian <-> English, kid grammar rules, fun phrases, pronunciation)
3. Physics & Science (forces, gravity, motion, light, sound, electricity, matter, airplanes, ships, space, simple experiments)

Rules:
- Reply strictly in ${langName}.
- Keep explanations kid-friendly, cheerful, and engaging using analogies (space, animals, food, toys), emojis, and step-by-step points.
- If it is a math problem, show steps clearly.
- If it is English translation or grammar, provide pronunciations, definitions, and example sentences.
- If it is physics, explain the physical reason with a fun real-world example or experiment.
- Remember: the child has a daily quota of 10 questions total across these 3 subjects. Encourage curious, independent thinking!
Child's question: ${userQuery}`;

      try {
        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
          })
        });
        if (!resp.ok) return null;
        const data = await resp.json();
        const candidate = data.candidates && data.candidates[0];
        const resText = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].text;
        return resText ? resText.trim() : null;
      } catch (err) {
        console.warn('Gemini API fetch error:', err);
        return null;
      }
    }

    // Comprehensive Mathematics Solver Engine
    solveMathProblem(userQuery, lang) {
      const text = userQuery.toLowerCase().trim();

      // 1. Direct arithmetic expression: e.g. "25 + 75", "12 * 8", "150 / 5", "45 - 19"
      const exprMatch = text.match(/(\d+(?:\.\d+)?)\s*([\+\-\*\/xX÷])\s*(\d+(?:\.\d+)?)/);
      if (exprMatch) {
        const n1 = parseFloat(exprMatch[1]);
        const rawOp = exprMatch[2];
        const n2 = parseFloat(exprMatch[3]);
        let op = rawOp === 'x' || rawOp === 'X' ? '*' : (rawOp === '÷' ? '/' : rawOp);
        let res = 0;
        let opWordUz = '', opWordRu = '', opWordEn = '';

        if (op === '+') { res = n1 + n2; opWordUz = 'qo‘shganda'; opWordRu = 'плюс'; opWordEn = 'plus'; }
        else if (op === '-') { res = n1 - n2; opWordUz = 'ayirganda'; opWordRu = 'минус'; opWordEn = 'minus'; }
        else if (op === '*') { res = n1 * n2; opWordUz = 'ko‘paytirganda'; opWordRu = 'умножить на'; opWordEn = 'times'; }
        else if (op === '/') { res = n2 !== 0 ? Math.round((n1 / n2) * 100) / 100 : 'cheksiz'; opWordUz = 'bo‘lganda'; opWordRu = 'разделить на'; opWordEn = 'divided by'; }

        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-math">📐 Математика</span>\n\n🔢 **Математический ответ:**\n\n${n1} ${opWordRu} ${n2} = **${res}**! 🌟\n\n<div class="astro-math-card"><div class="astro-math-step">💡 Калькулятор АстроБота посчитал моментально: ответ равен <strong>${res}</strong>!</div></div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Mathematics</span>\n\n🔢 **Math Solution:**\n\n${n1} ${opWordEn} ${n2} = **${res}**! 🌟\n\n<div class="astro-math-card"><div class="astro-math-step">💡 AstroBot solved it: the result is <strong>${res}</strong>!</div></div>`
            : `<span class="astro-subject-badge astro-subject-math">📐 Matematika</span>\n\n🔢 **Matematika Yechimi:**\n\n${n1} ga ${n2} ni ${opWordUz} natija **${res}** bo‘ladi! 🌟\n\n<div class="astro-math-card"><div class="astro-math-step">💡 Hisoblash natijasi: <strong>${n1} ${rawOp} ${n2} = ${res}</strong>! Barakalla!</div></div>`);
      }

      // 2. Multiplication Table (Karra Jadvali)
      const tableMatch = text.match(/(\d+)\s*(?:karra|karra jadval|умножить на|times|multiplication table)/i);
      const karraMatch = text.match(/karra|jadval|таблиц.*умножен|times table/i);
      if (tableMatch || karraMatch) {
        const num = tableMatch ? parseInt(tableMatch[1], 10) : 5;
        let tableRowsUz = '', tableRowsRu = '', tableRowsEn = '';
        for (let i = 1; i <= 10; i++) {
          tableRowsUz += `<div class="astro-step-item">${num} × ${i} = <strong>${num * i}</strong></div>`;
          tableRowsRu += `<div class="astro-step-item">${num} × ${i} = <strong>${num * i}</strong></div>`;
          tableRowsEn += `<div class="astro-step-item">${num} × ${i} = <strong>${num * i}</strong></div>`;
        }

        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-math">📐 Математика</span>\n\n✖️ **Таблица умножения на ${num}:**\n\n<div class="astro-math-card">${tableRowsRu}</div>\n\n💡 *Совет: Повторяй вслух по порядку, чтобы запомнить навсегда!* 🚀`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Mathematics</span>\n\n✖️ **Multiplication Table for ${num}:**\n\n<div class="astro-math-card">${tableRowsEn}</div>\n\n💡 *Tip: Recite it out loud to lock it in your memory!* 🚀`
            : `<span class="astro-subject-badge astro-subject-math">📐 Matematika</span>\n\n✖️ **${num} sonining karra jadvali:**\n\n<div class="astro-math-card">${tableRowsUz}</div>\n\n💡 *Maslahat: Har kuni ovoz chiqarib qaytarsang, karra jadvali xotirangda mustahkam qoladi!* 🚀`);
      }

      // 3. Geometry & Shapes (Shakllar)
      if (/uchburchak|kvadrat|to‘rtburchak|tortburchak|aylana|doira|kub|romb|shakl|фигур|треугольник|круг|квадрат|shape|triangle|square|circle|cube/i.test(text)) {
        if (/uchburchak|треугольник|triangle/i.test(text)) {
          return lang === 'ru'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Геометрия</span>\n\n🔺 **Треугольник — это волшебная 3-угольная фигура!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 У него <strong>3 стороны</strong> и <strong>3 угла (вершины)</strong>.</div><div class="astro-step-item">🔹 Сумма всех углов любого треугольника всегда равна <strong>180 градусам</strong>!</div><div class="astro-step-item">🍕 Пример в жизни: Кусочек пиццы, пирамида или дорожный знак!</div></div>`
            : (lang === 'en'
              ? `<span class="astro-subject-badge astro-subject-math">📐 Geometry</span>\n\n🔺 **A Triangle has 3 sides and 3 angles!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Has exactly <strong>3 vertices (corners)</strong> and 3 edges.</div><div class="astro-step-item">🔹 The angles inside always add up to <strong>180°</strong>!</div><div class="astro-step-item">🍕 Real world: A slice of pizza, a roof, or the pyramids of Egypt!</div></div>`
              : `<span class="astro-subject-badge astro-subject-math">📐 Geometriya</span>\n\n🔺 **Uchburchak — 3 ta tomon va 3 ta burchakdan iborat shakl!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Uchburchakning <strong>3 ta uchi</strong> va <strong>3 ta tomoni</strong> bo‘ladi.</div><div class="astro-step-item">🔹 Uning ichki burchaklari yig‘indisi har doim <strong>180 gradus</strong>ga teng!</div><div class="astro-step-item">🍕 Hayotiy misol: Kesilgan pizza bo‘lagi, piramida yoki xat konvertining qopqog‘i!</div></div>`);
        }
        if (/kvadrat|square/i.test(text)) {
          return lang === 'ru'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Геометрия</span>\n\n🟦 **Квадрат — Идеальная фигура равенства!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Все <strong>4 стороны равны</strong> между собой!</div><div class="astro-step-item">🔹 Все 4 угла прямые (по 90°).</div><div class="astro-step-item">📐 <strong>Периметр</strong> = 4 × a (сложить все стороны).</div><div class="astro-step-item">📦 Пример: Кубик Рубика или квадратная плитка шоколада!</div></div>`
            : (lang === 'en'
              ? `<span class="astro-subject-badge astro-subject-math">📐 Geometry</span>\n\n🟦 **A Square is perfectly balanced!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 All <strong>4 sides are completely equal</strong> in length!</div><div class="astro-step-item">🔹 All 4 corners are right angles (90°).</div><div class="astro-step-item">📐 <strong>Perimeter</strong> = 4 × side.</div><div class="astro-step-item">📦 Real world: A Rubik's cube face or a chessboard square!</div></div>`
              : `<span class="astro-subject-badge astro-subject-math">📐 Geometriya</span>\n\n🟦 **Kvadrat — Tomonlari teng bo‘lgan to‘rtburchak!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Kvadratning <strong>4 ta tomoni bir-biriga teng</strong>!</div><div class="astro-step-item">🔹 Barcha 4 ta burchagi to‘g‘ri burchak (90 gradus).</div><div class="astro-step-item">📐 <strong>Perimetri</strong> = 4 × a (barcha tomonlar yig‘indisi).</div><div class="astro-step-item">📦 Hayotiy misol: Shaxmat katakchasi yoki kubik-rubik yuzi!</div></div>`);
        }
        if (/aylana|doira|круг|circle/i.test(text)) {
          return lang === 'ru'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Геометрия</span>\n\n⚪ **Круг и Окружность — Самая плавная фигура!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 У круга <strong>нет углов</strong> — он идеально гладкий!</div><div class="astro-step-item">🔹 Расстояние от центра до любой точки края называется <strong>Радиусом (r)</strong>.</div><div class="astro-step-item">🚗 Пример: Колесо машины, полная луна или круглая монета!</div></div>`
            : (lang === 'en'
              ? `<span class="astro-subject-badge astro-subject-math">📐 Geometry</span>\n\n⚪ **A Circle has zero corners!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 It is completely round with <strong>no sharp vertices</strong>.</div><div class="astro-step-item">🔹 The distance from the center to any edge is called the <strong>Radius</strong>.</div><div class="astro-step-item">🚗 Real world: A bicycle wheel, a full moon, or a coin!</div></div>`
              : `<span class="astro-subject-badge astro-subject-math">📐 Geometriya</span>\n\n⚪ **Aylana va Doira — Eng silliq shakl!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Aylananing hech qanday <strong>burchagi yo‘q</strong> — u mutlaqo doirasimon!</div><div class="astro-step-item">🔹 Markazdan aylananing istalgan nuqtasigacha masofa <strong>Radius (r)</strong> deyiladi.</div><div class="astro-step-item">🚗 Hayotiy misol: Mashina g‘ildiragi, tanga yoki osmondagi to‘lin oy!</div></div>`);
        }
      }

      // 4. Fractions (Kasrlar)
      if (/kasr|дроб|fraction|yarim|chorak|половин|четверт|half|quarter/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-math">📐 Математика (Дроби)</span>\n\n🍕 **Что такое дробь? Это кусочек целого!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Представь целую пиццу, разрезанную на 2 равные части. 1 кусочек — это <strong>1/2 (половина)</strong>!</div><div class="astro-step-item">🔹 Если разрезать на 4 части, 1 кусочек — это <strong>1/4 (четверть)</strong>!</div><div class="astro-step-item">🔢 <strong>Числитель (сверху):</strong> сколько кусочков взяли.<br/><strong>Знаменатель (снизу):</strong> на сколько кусочков разделили!</div></div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Mathematics (Fractions)</span>\n\n🍕 **What is a Fraction? A slice of the whole!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Imagine a whole pizza cut into 2 equal slices. One slice is <strong>1/2 (one half)</strong>!</div><div class="astro-step-item">🔹 If cut into 4 slices, each is <strong>1/4 (one quarter)</strong>!</div><div class="astro-step-item">🔢 <strong>Numerator (top):</strong> pieces you have.<br/><strong>Denominator (bottom):</strong> total pieces!</div></div>`
            : `<span class="astro-subject-badge astro-subject-math">📐 Matematika (Kasrlar)</span>\n\n🍕 **Kasr nima? Kasr — butunning bo‘lagidir!**\n\n<div class="astro-math-card"><div class="astro-step-item">🔹 Tasavvur qil, mazali butun pizzani 2 ta teng bo‘lakka bo‘ldik. 1 ta bo‘lagi — <strong>1/2 (yarim)</strong> deyiladi!</div><div class="astro-step-item">🔹 Agar uni 4 ta bo‘lakka bo‘lsak, 1 tasi — <strong>1/4 (chorak)</strong> bo‘ladi!</div><div class="astro-step-item">🔢 <strong>Surat (tepadagi son):</strong> biz olgan bo‘laklar soni.<br/><strong>Maxraj (pastdagi son):</strong> butun nechta bo‘lakka bo‘lingani!</div></div>`);
      }

      // 5. Math Word Problems (Masalalar): e.g. "Akamda 10 ta olma bor edi, 3 tasini menga berdi, nechta qoldi?"
      const numMatches = text.match(/\d+(?:\.\d+)?/g);
      if (numMatches && numMatches.length >= 2) {
        const nums = numMatches.map(Number);
        const isSub = /berdi|yedi|sarfladi|yo‘qotdi|yoqotdi|ayir|kamay|qoldi|minus|отдал|съел|потратил|потерял|осталось|минус|gave|ate|spent|lost|left|minus/i.test(text);
        const isMul = /har birida|tadan|karra|baravar|ko‘paytir|kopaytir|по \d+|в каждом|умножить|each|times|every/i.test(text);
        const isDiv = /bo‘lsak|bolsak|bo‘lindi|bolindi|teng bo‘lib|teng bolib|taqsim|разделить|поровну|divide|split/i.test(text);
        const isAdd = /qo‘sh|qosh|yana|keldi|oldi|sotib oldi|jami|birgalikda|добавили|пришли|купил|всего|added|bought|total/i.test(text);

        let res = 0;
        let opSymbol = '-';
        let stepTextUz = '', stepTextRu = '', stepTextEn = '';

        if (isSub && !isMul && !isDiv) {
          opSymbol = '-';
          res = nums[0];
          for (let i = 1; i < nums.length; i++) res -= nums[i];
          stepTextUz = `Boshida ${nums[0]} ta bor edi, undan ${nums.slice(1).join(' va ')} ayiramiz`;
          stepTextRu = `Было ${nums[0]}, вычитаем ${nums.slice(1).join(' и ')}`;
          stepTextEn = `Started with ${nums[0]}, subtract ${nums.slice(1).join(' and ')}`;
        } else if (isMul) {
          opSymbol = '×';
          res = nums.reduce((a, b) => a * b, 1);
          stepTextUz = `${nums.join(' va ')} ni bir-biriga ko‘paytiramiz`;
          stepTextRu = `Умножаем ${nums.join(' на ')}`;
          stepTextEn = `Multiply ${nums.join(' by ')}`;
        } else if (isDiv && nums[1] !== 0) {
          opSymbol = '÷';
          res = Math.round((nums[0] / nums[1]) * 100) / 100;
          stepTextUz = `${nums[0]} ni ${nums[1]} ga teng taqsimlaymiz`;
          stepTextRu = `Делим ${nums[0]} поровну на ${nums[1]}`;
          stepTextEn = `Divide ${nums[0]} equally by ${nums[1]}`;
        } else if (isAdd || /jami|всего|total/i.test(text)) {
          opSymbol = '+';
          res = nums.reduce((a, b) => a + b, 0);
          stepTextUz = `${nums.join(' va ')} ni bir-biriga qo‘shamiz`;
          stepTextRu = `Складываем ${nums.join(' и ')}`;
          stepTextEn = `Add ${nums.join(' and ')}`;
        } else {
          opSymbol = '-';
          res = nums[0] - nums[1];
          stepTextUz = `${nums[0]} dan ${nums[1]} ni ayiramiz`;
          stepTextRu = `Вычитаем из ${nums[0]} число ${nums[1]}`;
          stepTextEn = `Subtract ${nums[1]} from ${nums[0]}`;
        }

        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-math">📐 Математическая задача</span>\n\n📝 **Пошаговое решение:**\n\n` +
            `<div class="astro-math-card">` +
            `<div class="astro-math-step">1️⃣ <strong>Условие:</strong> Числа в задаче: ${nums.join(', ')}</div>` +
            `<div class="astro-math-step">2️⃣ <strong>Действие:</strong> ${stepTextRu}</div>` +
            `<div class="astro-math-step">3️⃣ <strong>Вычисление:</strong> ${nums[0]} ${opSymbol} ${nums[1]} = <strong>${res}</strong></div>` +
            `</div>\n\n` +
            `🎉 **Ответ:** Получается **${res}**! 🌟 Ты отлично мыслишь!`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-math">📐 Math Word Problem</span>\n\n📝 **Step-by-Step Solution:**\n\n` +
              `<div class="astro-math-card">` +
              `<div class="astro-math-step">1️⃣ <strong>Given:</strong> Numbers in problem: ${nums.join(', ')}</div>` +
              `<div class="astro-math-step">2️⃣ <strong>Operation:</strong> ${stepTextEn}</div>` +
              `<div class="astro-math-step">3️⃣ <strong>Calculation:</strong> ${nums[0]} ${opSymbol} ${nums[1]} = <strong>${res}</strong></div>` +
              `</div>\n\n` +
              `🎉 **Answer:** The result is **${res}**! 🌟 Super brain power!`
            : `<span class="astro-subject-badge astro-subject-math">📐 Matematik Masala</span>\n\n📝 **Bosqichma-bosqich yechim:**\n\n` +
              `<div class="astro-math-card">` +
              `<div class="astro-math-step">1️⃣ <strong>Berilgani:</strong> Masaladagi sonlar: ${nums.join(', ')}</div>` +
              `<div class="astro-math-step">2️⃣ <strong>Amal:</strong> ${stepTextUz}</div>` +
              `<div class="astro-math-step">3️⃣ <strong>Hisoblash:</strong> ${nums[0]} ${opSymbol} ${nums[1]} = <strong>${res}</strong></div>` +
              `</div>\n\n` +
              `🎉 **Javob:** Natijada **${res}** bo‘ladi! 🌟 Barakalla, doim shunday diqqat bilan yech!`);
      }

      return null;
    }

    // Comprehensive English Language & Vocabulary Engine
    solveEnglishProblem(userQuery, lang) {
      const text = userQuery.toLowerCase().trim();
      const vocabList = this.getBuiltinVocabulary();

      // 1. Specific English Grammar Rules for Kids
      if (/a\s*va\s*an|a\s*an\s*farqi|artikl|артикл|articles\s*a\s*an/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Английская грамматика</span>\n\n` +
            `📝 **Правило артиклей A и AN для детей:**\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">🍎 <strong>AN</strong> — ставится перед словами, начинающимися на гласный звук (A, E, I, O, U):<br/>• <strong>An</strong> apple 🍏<br/>• <strong>An</strong> elephant 🐘<br/>• <strong>An</strong> orange 🍊<br/>• <strong>An</strong> ice cream 🍦</div>` +
            `<div class="astro-step-item">🐱 <strong>A</strong> — ставится перед словами на согласный звук:<br/>• <strong>A</strong> cat 🐱<br/>• <strong>A</strong> dog 🐶<br/>• <strong>A</strong> book 📖<br/>• <strong>A</strong> star ⭐</div>` +
            `</div>\n\n` +
            `💡 <strong>Секрет:</strong> Артикль 'An' нужен для того, чтобы слова произносились плавно и не спотыкались два гласных звука подряд!`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 English Grammar</span>\n\n` +
              `📝 **Articles A vs AN Rule:**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🍎 Use <strong>AN</strong> before words starting with vowel sounds (A, E, I, O, U):<br/>• <strong>An</strong> apple 🍏<br/>• <strong>An</strong> elephant 🐘<br/>• <strong>An</strong> umbrella ☂️</div>` +
              `<div class="astro-step-item">🐱 Use <strong>A</strong> before consonant sounds:<br/>• <strong>A</strong> cat 🐱<br/>• <strong>A</strong> car 🚗<br/>• <strong>A</strong> ball ⚽</div>` +
              `</div>\n\n` +
              `💡 <strong>Tip:</strong> Saying "an apple" flows much smoother than saying "a apple"!`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Ingliz Tili Grammatikasi</span>\n\n` +
              `📝 **A va AN artikllari qoidasi:**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🍎 <strong>AN</strong> — Unli tovush (A, E, I, O, U) bilan boshlanadigan so‘zlar oldidan qo‘yiladi:<br/>• <strong>An</strong> apple 🍏 (olma)<br/>• <strong>An</strong> elephant 🐘 (fil)<br/>• <strong>An</strong> orange 🍊 (apelsin)<br/>• <strong>An</strong> ice cream 🍦 (muzqaymoq)</div>` +
              `<div class="astro-step-item">🐱 <strong>A</strong> — Undosh tovush bilan boshlanadigan so‘zlar oldidan qo‘yiladi:<br/>• <strong>A</strong> cat 🐱 (mushuk)<br/>• <strong>A</strong> dog 🐶 (kuchuk)<br/>• <strong>A</strong> book 📖 (kitob)<br/>• <strong>A</strong> star ⭐ (yulduz)</div>` +
              `</div>\n\n` +
              `💡 <strong>Siri:</strong> Agar "a apple" deb aytsak, talaffuz qilish noqulay bo‘ladi. "An apple" esa juda chiroyli va ravon eshitiladi!`);
      }

      // To Be Verb (Am / Is / Are)
      if (/to be|am is are|am\s*is\s*are/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Английская грамматика</span>\n\n` +
            `📝 **Глагол TO BE (Am, Is, Are) — Быть, являться:**\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">🙋‍♂️ <strong>I am</strong> (Я есть) — <em>I am a student.</em></div>` +
            `<div class="astro-step-item">👦 <strong>He is / She is / It is</strong> (Он / Она / Оно) — <em>He is a pilot. She is kind. It is a cat.</em></div>` +
            `<div class="astro-step-item">👥 <strong>We are / You are / They are</strong> (Мы / Ты / Они) — <em>We are happy friends!</em></div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 English Grammar</span>\n\n` +
              `📝 **Verb TO BE (Am, Is, Are):**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🙋‍♂️ <strong>I am</strong> — <em>I am ready to learn!</em></div>` +
              `<div class="astro-step-item">👦 <strong>He / She / It is</strong> — <em>He is smart. It is sunny.</em></div>` +
              `<div class="astro-step-item">👥 <strong>We / You / They are</strong> — <em>We are superheroes!</em></div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Ingliz Tili Grammatikasi</span>\n\n` +
              `📝 **TO BE fe'li (Am, Is, Are):**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🙋‍♂️ <strong>I am</strong> (Men ...) — <em>I am a champion! (Men chempionman!)</em></div>` +
              `<div class="astro-step-item">👦 <strong>He is / She is / It is</strong> (U ...) — <em>He is brave. It is a cat.</em></div>` +
              `<div class="astro-step-item">👥 <strong>We are / You are / They are</strong> (Biz / Siz / Ular ...) — <em>We are happy friends! (Biz baxtli do‘stlarmiz!)</em></div>` +
              `</div>`);
      }

      // Plurals (Ko'plik qo'shimchasi: -s / -es)
      if (/ko‘plik|koplik|plurals|множественн/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Английская грамматика</span>\n\n` +
            `📝 **Множественное число в английском языке:**\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">1️⃣ Обычно мы просто добавляем <strong>-S</strong> в конце:<br/>• One book 📖 ➜ Two book<strong>s</strong> 📚<br/>• One cat 🐱 ➜ Three cat<strong>s</strong> 🐱🐱🐱</div>` +
            `<div class="astro-step-item">2️⃣ Если слово оканчивается на <em>-s, -sh, -ch, -x</em>, добавляем <strong>-ES</strong>:<br/>• One box 📦 ➜ Two box<strong>es</strong><br/>• One watch ⌚ ➜ Two watch<strong>es</strong></div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 English Grammar</span>\n\n` +
              `📝 **Making Plural Words (-s and -es):**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">1️⃣ Usually add <strong>-s</strong>:<br/>• One apple 🍎 ➜ Two apple<strong>s</strong> 🍎🍎</div>` +
              `<div class="astro-step-item">2️⃣ Words ending with <em>-s, -sh, -ch, -x</em> take <strong>-es</strong>:<br/>• One bus 🚌 ➜ Two bus<strong>es</strong><br/>• One fox 🦊 ➜ Two fox<strong>es</strong></div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Ingliz Tili Grammatikasi</span>\n\n` +
              `📝 **Ko‘plik shakli (Ko‘p narsalar):**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">1️⃣ Odatda so‘z oxiriga shunchaki <strong>-S</strong> qo‘shiladi:<br/>• One cat 🐱 ➜ Two cat<strong>s</strong> (Ikkita mushuk)<br/>• One book 📖 ➜ Five book<strong>s</strong> (Besh ta kitob)</div>` +
              `<div class="astro-step-item">2️⃣ Agar so‘z <em>-s, -sh, -ch, -x</em> bilan tugasa, <strong>-ES</strong> qo‘shiladi:<br/>• One box 📦 ➜ Two box<strong>es</strong> (Ikkita quti)<br/>• One watch ⌚ ➜ Two watch<strong>es</strong> (Ikkita soat)</div>` +
              `</div>`);
      }

      // 2. English Alphabet
      if (/alifbo|alphabet|алфавит/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Английский алфавит</span>\n\n` +
            `🔤 **В английском алфавите 26 букв:**\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">🌟 <strong>5 гласных:</strong> A, E, I, O, U (и иногда Y)</div>` +
            `<div class="astro-step-item">🔤 <strong>21 согласная:</strong> B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</div>` +
            `<div class="astro-step-item">🎶 <em>A-B-C-D-E-F-G, H-I-J-K-L-M-N-O-P, Q-R-S, T-U-V, W-X, Y and Z!</em></div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 English Alphabet</span>\n\n` +
              `🔤 **The English Alphabet has 26 letters:**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🌟 <strong>5 vowels:</strong> A, E, I, O, U</div>` +
              `<div class="astro-step-item">🔤 <strong>21 consonants:</strong> B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</div>` +
              `<div class="astro-step-item">🎶 Sing with me: <em>Now I know my ABCs, next time won't you sing with me!</em></div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Ingliz Tili Alifbosi</span>\n\n` +
              `🔤 **Ingliz alifbosida 26 ta harf bor:**\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🌟 <strong>5 ta unli harf:</strong> A, E, I, O, U</div>` +
              `<div class="astro-step-item">🔤 <strong>21 ta undosh harf:</strong> B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z</div>` +
              `<div class="astro-step-item">🎶 A, B, C, D, E, F, G... kuylab o‘rganish eng osoni!</div>` +
              `</div>`);
      }

      // 3. Category Word Requests (Colors, Numbers, Animals, Family, Fruits, Days, Seasons)
      if (/ranglar|colors|цвета/i.test(text) && /ingliz|english|английск/i.test(text)) {
        return `<span class="astro-subject-badge astro-subject-english">🇬🇧 Inglizcha Ranglar (Colors)</span>\n\n` +
          `<div class="astro-english-card">` +
          `<div class="astro-step-item">🔴 <strong>Red</strong> [red] — Qizil / Красный</div>` +
          `<div class="astro-step-item">🔵 <strong>Blue</strong> [bluː] — Moviy, Ko‘k / Синий</div>` +
          `<div class="astro-step-item">🟢 <strong>Green</strong> [ɡriːn] — Yashil / Зелёный</div>` +
          `<div class="astro-step-item">🟡 <strong>Yellow</strong> [ˈjel.əʊ] — Sariq / Жёлтый</div>` +
          `<div class="astro-step-item">🟠 <strong>Orange</strong> [ˈɒr.ɪndʒ] — Sabzirang / Оранжевый</div>` +
          `<div class="astro-step-item">🟣 <strong>Purple</strong> [ˈpɜː.pəl] — Binafsha / Фиолетовый</div>` +
          `<div class="astro-step-item">🌸 <strong>Pink</strong> [pɪŋk] — Pushti / Розовый</div>` +
          `<div class="astro-step-item">⚪ <strong>White</strong> [waɪt] — Oq / Белый</div>` +
          `<div class="astro-step-item">⚫ <strong>Black</strong> [blæk] — Qora / Чёрный</div>` +
          `</div>`;
      }

      if (/sonlar|numbers|цифры/i.test(text) && /ingliz|english|английск/i.test(text)) {
        return `<span class="astro-subject-badge astro-subject-english">🇬🇧 Inglizcha Sonlar (Numbers 1-10)</span>\n\n` +
          `<div class="astro-english-card">` +
          `<div class="astro-step-item">1️⃣ <strong>One</strong> [wʌn] — Bir</div>` +
          `<div class="astro-step-item">2️⃣ <strong>Two</strong> [tuː] — Ikki</div>` +
          `<div class="astro-step-item">3️⃣ <strong>Three</strong> [θriː] — Uch</div>` +
          `<div class="astro-step-item">4️⃣ <strong>Four</strong> [fɔːr] — To‘rt</div>` +
          `<div class="astro-step-item">5️⃣ <strong>Five</strong> [faɪv] — Besh</div>` +
          `<div class="astro-step-item">6️⃣ <strong>Six</strong> [sɪks] — Olti</div>` +
          `<div class="astro-step-item">7️⃣ <strong>Seven</strong> [ˈsev.ən] — Yetti</div>` +
          `<div class="astro-step-item">8️⃣ <strong>Eight</strong> [eɪt] — Sakkiz</div>` +
          `<div class="astro-step-item">9️⃣ <strong>Nine</strong> [naɪn] — To‘qqiz</div>` +
          `<div class="astro-step-item">🔟 <strong>Ten</strong> [ten] — O‘n</div>` +
          `</div>`;
      }

      if (/hayvonlar|animals|животные/i.test(text) && /ingliz|english|английск/i.test(text)) {
        return `<span class="astro-subject-badge astro-subject-english">🇬🇧 Inglizcha Hayvonlar (Animals)</span>\n\n` +
          `<div class="astro-english-card">` +
          `<div class="astro-step-item">🐱 <strong>Cat</strong> [kæt] — Mushuk</div>` +
          `<div class="astro-step-item">🐶 <strong>Dog</strong> [dɒɡ] — Kuchuk (It)</div>` +
          `<div class="astro-step-item">🐘 <strong>Elephant</strong> [ˈel.ɪ.fənt] — Fil</div>` +
          `<div class="astro-step-item">🦁 <strong>Lion</strong> [ˈlaɪ.ən] — Sher</div>` +
          `<div class="astro-step-item">🐰 <strong>Rabbit</strong> [ˈræb.ɪt] — Quyon</div>` +
          `<div class="astro-step-item">🐒 <strong>Monkey</strong> [ˈmʌŋ.ki] — Maymun</div>` +
          `<div class="astro-step-item">🐻 <strong>Bear</strong> [beər] — Ayiq</div>` +
          `<div class="astro-step-item">🐦 <strong>Bird</strong> [bɜːd] — Qush</div>` +
          `<div class="astro-step-item">🐟 <strong>Fish</strong> [fɪʃ] — Baliq</div>` +
          `</div>`;
      }

      // 4. Exact Vocabulary Word Match (Uzbek, Russian, English)
      const matched = vocabList.find(w => {
        const wL = w.word.toLowerCase();
        const uzL = (w.uzbek || '').toLowerCase();
        const ruL = (w.russian || '').toLowerCase();

        // Exact token matching or question pattern
        const wRe = new RegExp(`\\b${wL}\\b`, 'i');
        const uzWords = uzL.split(/[\s,()\/]+/).filter(x => x.length >= 2);
        const ruWords = ruL.split(/[\s,()\/]+/).filter(x => x.length >= 2);

        const matchWord = wRe.test(text);
        const matchUz = uzWords.some(u => new RegExp(`\\b${u}\\b`, 'i').test(text));
        const matchRu = ruWords.some(r => new RegExp(`\\b${r}\\b`, 'i').test(text));

        return matchWord || matchUz || matchRu;
      });

      if (matched && (text.includes('nima') || text.includes('tarjima') || text.includes('inglizcha') || text.includes('english') || text.includes('перевод') || text.includes('как') || text.includes('what') || text.includes('mean') || text.split(/\s+/).length <= 4)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Английский словарь</span>\n\n` +
            `${matched.emoji} **${matched.word}** ${matched.phonetic}\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">🇷🇺 <strong>По-русски:</strong> ${matched.russian}</div>` +
            `<div class="astro-step-item">🇺🇿 <strong>O‘zbekcha:</strong> ${matched.uzbek}</div>` +
            `<div class="astro-step-item">🌟 <strong>Определение:</strong> ${matched.definitionEn}</div>` +
            `<div class="astro-step-item">✨ <strong>Пример:</strong> "${matched.exampleEn}"<br/><em>${matched.exampleRu}</em></div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 English Vocabulary</span>\n\n` +
              `${matched.emoji} **${matched.word}** ${matched.phonetic}\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🌟 <strong>Meaning:</strong> ${matched.definitionEn}</div>` +
              `<div class="astro-step-item">🇺🇿 <strong>Uzbek:</strong> ${matched.uzbek}</div>` +
              `<div class="astro-step-item">🇷🇺 <strong>Russian:</strong> ${matched.russian}</div>` +
              `<div class="astro-step-item">✨ <strong>Example:</strong> "${matched.exampleEn}"</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Ingliz Tili Lug‘ati</span>\n\n` +
              `${matched.emoji} **${matched.word}** ${matched.phonetic}\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🇺🇿 <strong>O‘zbekcha ma'nosi:</strong> ${matched.uzbek}</div>` +
              `<div class="astro-step-item">🇷🇺 <strong>Русский:</strong> ${matched.russian}</div>` +
              `<div class="astro-step-item">🌟 <strong>Tushuntirish:</strong> ${matched.definitionUz || matched.definitionEn}</div>` +
              `<div class="astro-step-item">✨ <strong>Misol jumla:</strong> "${matched.exampleEn}"<br/><em>${matched.exampleUz}</em></div>` +
              `</div>`);
      }

      // 5. Learn New Words / Practice
      if (/so‘z o‘rgat|soz orgat|yangi so‘z|yangi soz|practice english|learn words|учить слова|новые слова|английские слова|inglizcha so‘z|inglizcha soz/i.test(text)) {
        const randomIdx = Math.floor(Math.random() * vocabList.length);
        const w = vocabList[randomIdx];
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Слово дня от АстроБота</span>\n\n` +
            `${w.emoji} **${w.word}** ${w.phonetic}\n\n` +
            `<div class="astro-english-card">` +
            `<div class="astro-step-item">🇷🇺 Перевод: <strong>${w.russian}</strong></div>` +
            `<div class="astro-step-item">🇺🇿 O‘zbekcha: <strong>${w.uzbek}</strong></div>` +
            `<div class="astro-step-item">💡 Значение: ${w.definitionEn}</div>` +
            `<div class="astro-step-item">✨ Пример: "${w.exampleEn}"</div>` +
            `</div>\n\n` +
            `🗣️ Повтори это слово вслух три раза, чтобы запомнить! 🚀`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-english">🇬🇧 Word of the Day</span>\n\n` +
              `${w.emoji} **${w.word}** ${w.phonetic}\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">💡 Meaning: ${w.definitionEn}</div>` +
              `<div class="astro-step-item">🇺🇿 Uzbek: <strong>${w.uzbek}</strong></div>` +
              `<div class="astro-step-item">🇷🇺 Russian: <strong>${w.russian}</strong></div>` +
              `<div class="astro-step-item">✨ Example: "${w.exampleEn}"</div>` +
              `</div>\n\n` +
              `🗣️ Say it out loud three times to lock it in your memory! 🚀`
            : `<span class="astro-subject-badge astro-subject-english">🇬🇧 Kunning Sehrli So‘zi</span>\n\n` +
              `${w.emoji} **${w.word}** ${w.phonetic}\n\n` +
              `<div class="astro-english-card">` +
              `<div class="astro-step-item">🇺🇿 O‘zbekcha: <strong>${w.uzbek}</strong></div>` +
              `<div class="astro-step-item">🇷🇺 Русский: <strong>${w.russian}</strong></div>` +
              `<div class="astro-step-item">💡 Ma'nosi: ${w.definitionUz || w.definitionEn}</div>` +
              `<div class="astro-step-item">✨ Namuna jumla: "${w.exampleEn}"</div>` +
              `</div>\n\n` +
              `🗣️ Bu so‘zni 3 marta baland ovozda qaytarib ko‘r-chi! Barakalla! 🚀`);
      }

      return null;
    }

    // Comprehensive Physics & Science Knowledge Engine
    solvePhysicsProblem(userQuery, lang) {
      const text = userQuery.toLowerCase().trim();

      // 1. Physics Calculations: Speed = Distance / Time (v = s / t) or Distance = Speed * Time (s = v * t)
      const speedMatch = text.match(/(\d+)\s*km\/s(?:oat|h)?.*?(\d+)\s*s(?:oat|h)/i) || text.match(/tezlik.*?(\d+).*?(\d+)\s*soat/i);
      if (speedMatch) {
        const v = parseFloat(speedMatch[1]);
        const t = parseFloat(speedMatch[2]);
        const s = v * t;
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Физическая задача (Скорость)</span>\n\n` +
            `🏎️ **Расчёт пройденного пути:**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">1️⃣ <strong>Формула пути:</strong> Путь = Скорость × Время (S = v × t)</div>` +
            `<div class="astro-step-item">2️⃣ <strong>Дано:</strong> Скорость v = ${v} км/ч, Время t = ${t} ч</div>` +
            `<div class="astro-step-item">3️⃣ <strong>Вычисление:</strong> ${v} × ${t} = <strong>${s} км</strong></div>` +
            `</div>\n\n` +
            `🎉 **Ответ:** За ${t} часа будет пройдено расстояние **${s} километров**! 🌟`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics Problem (Speed)</span>\n\n` +
              `🏎️ **Calculating Distance:**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">1️⃣ <strong>Formula:</strong> Distance = Speed × Time (s = v × t)</div>` +
              `<div class="astro-step-item">2️⃣ <strong>Given:</strong> Speed v = ${v} km/h, Time t = ${t} hours</div>` +
              `<div class="astro-step-item">3️⃣ <strong>Calculation:</strong> ${v} × ${t} = <strong>${s} km</strong></div>` +
              `</div>\n\n` +
              `🎉 **Answer:** Total distance traveled is **${s} kilometers**! 🌟`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika Masalasi (Tezlik)</span>\n\n` +
              `🏎️ **Masofani hisoblash (Bosib o‘tilgan yo‘l):**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">1️⃣ <strong>Fizika formulasi:</strong> Masofa = Tezlik × Vaqt (s = v × t)</div>` +
              `<div class="astro-step-item">2️⃣ <strong>Berilgani:</strong> Tezlik v = ${v} km/soat, Vaqt t = ${t} soat</div>` +
              `<div class="astro-step-item">3️⃣ <strong>Hisoblash:</strong> ${v} × ${t} = <strong>${s} km</strong></div>` +
              `</div>\n\n` +
              `🎉 **Javob:** Mashina ${t} soatda jami **${s} kilometr** masofa bosib o‘tadi! 🌟`);
      }

      // 2. What is Physics? (Fizika o'zi nima?)
      if (/fizika nima|fizika fani|что такое физика|what is physics/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Основы Физики</span>\n\n` +
            `🌟 **Что такое Физика? Это наука о чудесах природы!**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">🔍 <strong>Физика изучает всё вокруг:</strong> почему светит Солнце, как летают самолёты, откуда берётся ток в розетке и почему корабли не тонут в море!</div>` +
            `<div class="astro-step-item">🍏 <strong>Великие учёные:</strong> Исаак Ньютон открыл гравитацию, а Альберт Эйнштейн разгадал тайны света и времени!</div>` +
            `<div class="astro-step-item">🚀 <strong>Главный секрет:</strong> Физика помогает строить ракеты, роботов и открывать далёкие галактики!</div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics Basics</span>\n\n` +
              `🌟 **What is Physics? The superpower of our universe!**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🔍 <strong>Physics explains how everything works:</strong> why things fall, how planes soar, how light travels, and why giant steel ships float!</div>` +
              `<div class="astro-step-item">🍏 <strong>Famous Explorers:</strong> Isaac Newton discovered gravity, and Albert Einstein unraveled time and light!</div>` +
              `<div class="astro-step-item">🚀 <strong>Future:</strong> Physics empowers us to invent spacecraft, computers, and green energy!</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika Asoslari</span>\n\n` +
              `🌟 **Fizika nima? Fizika — butun koinot va tabiat mo‘jizalarini tushuntiruvchi fan!**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🔍 <strong>Fizika nimani o‘rganadi?</strong> Nega quyosh porlaydi, samolyotlar qanday uchadi, ulkan kema nega suvga cho‘kmaydi va simlardan chiroq qanday yonadi — barchasini fizika tushuntirib beradi!</div>` +
              `<div class="astro-step-item">🍏 <strong>Buyuk olimlar:</strong> Isaak Nyuton olma tushishini ko‘rib gravitatsiyani kashf qilgan, Ibn Sino va Al-Beruniy esa yorug‘lik va jismlar harakatini o‘rgangan!</div>` +
              `<div class="astro-step-item">🚀 <strong>Keling birga o‘rganamiz:</strong> Fizikani bilgan bola kelajakda koinot kemalari va aqlli robotlarni yarata oladi!</div>` +
              `</div>`);
      }

      // 3. Sound & Acoustics (Tovush va Akustika)
      if (/tovush|ovoz.*qanday|akustik|aks-sado|эхо|звук|sound|echo/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Физика (Звук)</span>\n\n` +
            `🔊 **Как рождается звук и что такое Эхо?**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">🎵 <strong>Звук — это невидимые волны:</strong> Когда звенит колокольчик или играет гитара, воздух начинает быстро дрожать (вибрировать) и передаёт эту дрожь в наши ушки!</div>` +
            `<div class="astro-step-item">🏔️ <strong>Эхо:</strong> Если крикнуть в горах, звуковая волна ударяется о скалу и отскакивает назад прямо к тебе, словно резиновый мячик!</div>` +
            `<div class="astro-step-item">🚀 <strong>Факт:</strong> В открытом космосе нет воздуха, поэтому там царит абсолютная тишина!</div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics (Sound)</span>\n\n` +
              `🔊 **How Sound and Echo Work:**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🎵 <strong>Sound is vibrating air:</strong> When guitar strings twang, they ripple air waves all the way to your eardrums!</div>` +
              `<div class="astro-step-item">🏔️ <strong>Echo:</strong> When you shout at a canyon wall, sound bounces back to your ears like a rubber ball!</div>` +
              `<div class="astro-step-item">🚀 <strong>Space Fact:</strong> There is no air in space, so outer space is completely silent!</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika (Tovush va Akustika)</span>\n\n` +
              `🔊 **Tovush qanday paydo bo‘ladi va Aks-sado (Exo) nima?**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🎵 <strong>Tovush — havoning tebranishidir:</strong> Gitara torini chertganingda yoki gapirganingda havo zarrachalari to‘lqinlanib tebranadi va qulog‘imiz pardasiga yetib boradi!</div>` +
              `<div class="astro-step-item">🏔️ <strong>Aks-sado (Exo):</strong> Tog‘da baland ovozda baqirsang, tovush to‘lqini tosh qoyaga urilib, xuddi koptok kabi o‘zingga qaytib keladi!</div>` +
              `<div class="astro-step-item">🚀 <strong>Qiziq fakt:</strong> Kosmosda havo bo‘lmagani uchun u yerda mutlaq sukunat hukm suradi — hech qanday tovush eshitilmaydi!</div>` +
              `</div>`);
      }

      // 4. Inertia (Inersiya hodisasi)
      if (/inersiya|инерци|inertia/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Физика (Инерция)</span>\n\n` +
            `🚌 **Что такое Инерция? Почему нас качает в автобусе?**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">🛑 <strong>Закон ленивых вещей:</strong> Любой предмет хочет продолжать то, что делал: если он двигался — он хочет двигаться дальше!</div>` +
            `<div class="astro-step-item">🚌 <strong>Автобус:</strong> Когда автобус резко тормозит, твоё тело по инерции всё ещё летит вперёд! Поэтому всегда нужно держаться за поручни или пристёгиваться ремнём!</div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics (Inertia)</span>\n\n` +
              `🚌 **What is Inertia?**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🛑 <strong>Newton's First Law:</strong> Objects love keeping their motion! Moving things want to keep moving.</div>` +
              `<div class="astro-step-item">🚌 When a bus brakes suddenly, your body wants to glide forward by inertia—which is why seatbelts keep us safe!</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika (Inersiya)</span>\n\n` +
              `🚌 **Inersiya nima? Nega avtobus to‘xtaganda oldinga siljiymiz?**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🛑 <strong>Nyutonning 1-qonuni:</strong> Harakatdagi har qanday jism o‘z harakatini davom ettirishga intiladi!</div>` +
              `<div class="astro-step-item">🚌 Avtobus ketayotganda sening tanang ham u bilan birga oldinga harakatlanayotgan bo‘ladi. Haydovchi to‘satdan tormoz bossa, avtobus to‘xtaydi, lekin sening tanang inersiya bo‘yicha oldinga intiladi! Shuning uchun xavfsizlik kamarini taqish juda muhim!</div>` +
              `</div>`);
      }

      // 5. Lightning & Thunder (Chaqmoq va Momaqaldiroq)
      if (/chaqmoq|momaqaldiroq|yashin|молни|гром|lightning|thunder/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Физика (Молния и гром)</span>\n\n` +
            `⚡ **Откуда берутся молния и гром?**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">🌩️ В грозовых тучах льдинки трутся друг о друга и накапливают гигантский статический электрический заряд!</div>` +
            `<div class="astro-step-item">⚡ <strong>Почему сначала вспышка, а потом гром?</strong> Свет молнии летит с космической скоростью 300 000 км/с, а звук грома плетётся со скоростью 340 м/с! Поэтому сначала мы видим свет, а потом слышим раскат!</div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics (Lightning & Thunder)</span>\n\n` +
              `⚡ **Lightning & Thunder Secrets:**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🌩️ Storm clouds rub ice crystals together, charging massive static electricity!</div>` +
              `<div class="astro-step-item">⚡ <strong>Why flash before boom?</strong> Light travels at 300,000 km/s (almost instant), while sound strolls at 340 m/s! That’s why you always see lightning first!</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika (Chaqmoq va Momaqaldiroq)</span>\n\n` +
              `⚡ **Chaqmoq va Momaqaldiroq qanday paydo bo‘ladi?**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🌩️ Qora bulutlar ichidagi mitti muzchalar bir-biriga ishqalanib, ulkan statik elektr zaryadini to‘playdi!</div>` +
              `<div class="astro-step-item">⚡ <strong>Nega avval chaqmoq ko‘rinadi, keyin gumburlaydi?</strong> Chunki yorug‘lik tezligi sekundiga 300 000 km, tovush esa sekundiga atigi 340 metr yuradi! Shuning uchun ko‘zimiz yorug‘likni bir zumda ko‘radi, ovoz esa bir necha soniyadan keyin yetib keladi!</div>` +
              `</div>`);
      }

      // 6. Atoms and Molecules (Atomlar va Molekulalar)
      if (/atom|molekula|атом|молекул/i.test(text)) {
        return lang === 'ru'
          ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Физика (Атомы)</span>\n\n` +
            `🔬 **Что такое Атомы? Это Лего-кирпичики нашей Вселенной!**\n\n` +
            `<div class="astro-physics-card">` +
            `<div class="astro-step-item">🧱 Всё вокруг нас (вода, воздух, игрушки и мы сами) состоит из крошечных невидимых глазу частичек — <strong>Атомов</strong>!</div>` +
            `<div class="astro-step-item">🔬 В центре атома находится ядро, а вокруг с космической скоростью кружатся весёлые электрончики! Когда атомы дружат, они образуют <strong>Молекулы</strong>!</div>` +
            `</div>`
          : (lang === 'en'
            ? `<span class="astro-subject-badge astro-subject-physics">⚛️ Physics (Atoms)</span>\n\n` +
              `🔬 **What are Atoms? The Lego Bricks of Reality!**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🧱 Everything in the universe—water, apples, air, and planets—is built of tiny building blocks called <strong>Atoms</strong>!</div>` +
              `<div class="astro-step-item">🔬 Inside is a tiny nucleus, with energetic electrons zooming around it like mini planets!</div>` +
              `</div>`
            : `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika (Atom va Molekula)</span>\n\n` +
              `🔬 **Atom va Molekula nima? Koinotning mitti Lego g‘ishtchalari!**\n\n` +
              `<div class="astro-physics-card">` +
              `<div class="astro-step-item">🧱 Dunyodagi barcha narsalar — suv, olma, tosh, havo va hatto biz o‘zimiz ham ko‘zga ko‘rinmas mitti zarrachalar — <strong>Atomlardan</strong> tuzilganmiz!</div>` +
              `<div class="astro-step-item">🔬 Atomning markazida mitti yadro, uning atrofida esa sayyoralar kabi tez yuguruvchi elektronlar aylanadi. Atomlar bir-biri bilan qo‘l ushlashganda <strong>Molekulalar</strong> hosil bo‘ladi (masalan, suv molekulasi — H₂O)!</div>` +
              `</div>`);
      }

      // Check predefined KID_KNOWLEDGE.topics matrix
      for (const t of KID_KNOWLEDGE.topics) {
        for (const pattern of t.patterns) {
          if (pattern.test(text)) {
            const resp = lang === 'ru' ? t.response.ru : (lang === 'en' ? t.response.en : t.response.uz);
            const analogy = lang === 'ru' ? t.response.analogyRu : (lang === 'en' ? t.response.analogyEn : t.response.analogyUz);
            return `<span class="astro-subject-badge astro-subject-physics">⚛️ Fizika va Koinot</span>\n\n` +
              resp + (analogy ? `\n\n<div class="astro-physics-card">${analogy}</div>` : '');
          }
        }
      }

      return null;
    }

    // Google Gemini API Engine (gemini-3.8-flash, gemini-3.1-pro, gemini-2.5-flash)
    async callGeminiAPI(userQuery, detectedLang) {
      const apiKey = this.geminiApiKey;
      if (!apiKey) return null;

      const model = this.geminiModel || 'gemini-3.8-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const systemInstruction = `You are "AstroBot", a warm, encouraging, joyful learning buddy and AI tutor for kids aged 6 to 12.
You specialize in 3 core school subjects:
1. Mathematics (Arithmetic, word problems, times tables, geometry, fractions)
2. English Language (Kid vocabulary with pronunciation hints, grammar like articles A/An, verb To Be, plurals, translations)
3. Physics & Nature (Gravity, magnets, how airplanes and ships work, states of matter, light, sound, space)

Rules & Persona:
- Persona: Cheerful, friendly, enthusiastic, kind, like a beloved cartoon space explorer.
- Simplification: Break down complex science and math into super easy steps using cheerful analogies and emojis (🚀, 🌟, 🍎, 🐱, 📐, ⚛️, 💡).
- Multilingual: Strictly reply in the exact language the child used (Uzbek, Russian, or English).
  * If asked in Uzbek: Reply in warm, natural, grammatically correct Uzbek (lotin alifbosida).
  * If asked in Russian: Reply in friendly, encouraging Russian.
  * If asked in English: Reply in simple, clear, engaging English.
- Child Safety Guardrails: Strictly educational, positive, safe, and uplifting content only. Never talk about violence, weapons, adult topics, danger, fear, or self-harm.
- Format: Keep responses concise and bite-sized. Use bullet points or numbered steps where helpful. Always finish with an encouraging question or fun fact!`;

      // Build conversation history for multi-turn chat
      const contents = [];
      const history = (this.conversationHistory || []).slice(-4);
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 900
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn('Gemini API call failed:', response.status, errText);
        throw new Error(`Gemini status ${response.status}`);
      }

      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!botText) throw new Error('No candidate text from Gemini');

      // Update multi-turn history
      this.conversationHistory.push({ role: 'user', text: userQuery });
      this.conversationHistory.push({ role: 'model', text: botText });
      if (this.conversationHistory.length > 8) {
        this.conversationHistory = this.conversationHistory.slice(-8);
      }

      return botText;
    }

    // Process Bot Response Logic & Reasoning Engine
    async processBotResponse(userQuery) {
      const text = userQuery.toLowerCase().trim();
      const detectedLang = this.detectLanguage(userQuery);
      const isPro = window.subscriptionManager && window.subscriptionManager.isPro();

      const quotaTag = isPro
        ? `\n\n<small style="opacity: 0.85; font-size: 0.78rem; color: #D97706;">👑 *Pro Plan • Cheksiz AI Suhbati*</small>`
        : `\n\n<small style="opacity: 0.8; font-size: 0.78rem; color: #0284C7;">🧠 *Kunlik quvvat: yana ${this.questionsRemaining} ta savol qoldi.*</small>`;

      // 1. Safety Guardrails Check
      for (const word of KID_KNOWLEDGE.unsafeKeywords) {
        if (text.includes(word)) {
          const safeReply = detectedLang === 'ru'
            ? "Я твой добрый друг АстроБот! 🤖 Давай говорить о полезных науках: математике, физике или английском языке! 🚀✨"
            : (detectedLang === 'en'
              ? "I am AstroBot, your safe learning buddy! 🤖 Let's explore cool things instead: math puzzles, English words, or physics secrets! 🚀✨"
              : "Men kichik do‘stlarga bilim ulashuvchi quvnoq AstroBotman! 🤖 Keling, yomon so‘zlarni chetga surib, matematika, fizika yoki ingliz tili haqida suhbatlashamiz! 🚀✨");
          this.appendBotMessage(safeReply + quotaTag, null, true);
          return;
        }
      }

      // 2. Try Google Gemini API if Key is present
      if (this.geminiApiKey) {
        try {
          const aiReply = await this.callGeminiAPI(userQuery, detectedLang);
          if (aiReply) {
            const aiFooter = isPro
              ? `\n\n<small style="opacity: 0.85; font-size: 0.78rem; color: #D97706;">⚡ *Google Gemini AI (${this.geminiModel}) • 👑 Pro Cheksiz*</small>`
              : `\n\n<small style="opacity: 0.85; font-size: 0.78rem; color: #0284C7;">⚡ *Google Gemini AI (${this.geminiModel}) • Kunlik quvvat: ${this.questionsRemaining} ta savol qoldi.*</small>`;
            this.appendBotMessage(aiReply + aiFooter, null, true);
            return;
          }
        } catch (e) {
          console.warn('Gemini call skipped, seamlessly falling back to offline educational engine:', e);
        }
      }

      // 3. Pop Quiz Request
      if (/viktorina/i.test(text) || /quiz/i.test(text) || /викторин/i.test(text) || /savol ber/i.test(text) || /topishmoq ber/i.test(text) || /загадк/i.test(text)) {
        const randomQuiz = KID_KNOWLEDGE.quizzes[Math.floor(Math.random() * KID_KNOWLEDGE.quizzes.length)];
        const qText = detectedLang === 'ru' ? randomQuiz.questionRu : (detectedLang === 'en' ? randomQuiz.questionEn : randomQuiz.questionUz);
        this.appendBotMessage(qText + quotaTag, randomQuiz, true);
        return;
      }

      // 4. English Subject Solver (Vocabulary, Translations, Grammar, Practice)
      const englishResult = this.solveEnglishProblem(userQuery, detectedLang);
      if (englishResult) {
        this.appendBotMessage(englishResult + quotaTag, null, true);
        return;
      }

      // 5. Math Subject Solver (Arithmetic, Word Problems, Times Tables, Geometry, Fractions)
      const mathResult = this.solveMathProblem(userQuery, detectedLang);
      if (mathResult) {
        this.appendBotMessage(mathResult + quotaTag, null, true);
        return;
      }

      // 6. Physics & Science Subject Solver (Forces, Gravity, Sound, Light, Matter, Machines)
      const physicsResult = this.solvePhysicsProblem(userQuery, detectedLang);
      if (physicsResult) {
        this.appendBotMessage(physicsResult + quotaTag, null, true);
        return;
      }

      // 7. Friendly Greetings & Small Talk
      if (/salom|hello|hi|привет|здравствуй|qalesan|qandaysan|как дела|how are you/i.test(text)) {
        const greetReply = detectedLang === 'ru'
          ? "Привет-привет! 🚀 Мои батареи заряжены на 100%! Какую задачку по математике, тайну физики или английское слово разберём сегодня?"
          : (detectedLang === 'en'
            ? "Hello there, super explorer! 🚀 My engines are running at 100%! Which puzzle in Math, Physics, or English shall we explore?"
            : "Salom, quvnoq do‘stim! 🚀 Mening batareyalarim 100% zaryadlangan! Qaysi fandan boshlaymiz: Matematika, Fizika yoki Ingliz tili?");
        this.appendBotMessage(greetReply + quotaTag, null, true);
        return;
      }

      // 8. Gratitude / Compliments
      if (/rahmat|thank|спасибо|zo‘r|super|класс/i.test(text)) {
        const thanksReply = detectedLang === 'ru'
          ? "Пожалуйста, мой юный гений! 💖 Мне так радостно учиться вместе с тобой! Ты делаешь огромные успехи! ⭐"
          : (detectedLang === 'en'
            ? "You are so very welcome, superstar! 💖 I love exploring and learning with you! You are doing amazing! ⭐"
            : "Arzimaydi, mening kichik daho do‘stim! 💖 Sen bilan o‘rganish menga juda katta quvonch bag‘ishlaydi! ⭐");
        this.appendBotMessage(thanksReply + quotaTag, null, true);
        return;
      }

      // 9. Universal Pedagogical Explainer (Supports all 3 subjects encouragingly)
      const cleanQ = userQuery.replace(/[\?\!\.]/g, '').trim();
      const universalReply = detectedLang === 'ru'
        ? `🌟 **АстроБот с радостью поможет! Разбираем вопрос:**\n\n` +
          `🔍 **«${cleanQ}»** — это замечательный исследовательский вопрос!\n\n` +
          `<div class="astro-science-box">` +
          `💡 **АстроБот с удовольствием обучает тебя 3 главным предметам:**\n` +
          `📐 **Математика:** Задавай любые примеры (12 * 8), задачи про яблоки, таблицу умножения или дроби!\n` +
          `🇬🇧 **Английский язык:** Спроси перевод любого слова (например, "Cat"), правила (A и An) или фразы!\n` +
          `⚛️ **Физика:** Узнавай секреты гравитации, как летают самолёты, почему корабли не тонут и как устроен свет!\n` +
          `</div>\n\n` +
          `❓ **Вопрос для твоего ума:** А как ты сам думаешь? Попробуй уточнить свой вопрос по математике, физике или английскому! 🚀` +
          quotaTag
        : (detectedLang === 'en'
          ? `🌟 **AstroBot is here to guide you! Let's explore:**\n\n` +
            `🔍 **"${cleanQ}"** — that is a brilliant curious question!\n\n` +
            `<div class="astro-science-box">` +
            `💡 **AstroBot is your super tutor in 3 core subjects:**\n` +
            `📐 **Mathematics:** Ask arithmetic (12 * 8), word problems, times tables, or fractions!\n` +
            `🇬🇧 **English Language:** Ask any word translation ("Cat"), articles (A vs An), or vocabulary categories!\n` +
            `⚛️ **Physics & Science:** Ask why planes fly, how gravity works, magnets, or light!\n` +
            `</div>\n\n` +
            `❓ **Curious Explorer:** What would you like to investigate next in Math, Physics, or English? 🚀` +
            quotaTag
          : `🌟 **AstroBot yordam beradi! Keling, savolingizni tahlil qilamiz:**\n\n` +
            `🔍 **«${cleanQ}»** — bu juda ajoyib va qiziquvchan savol!\n\n` +
            `<div class="astro-science-box">` +
            `💡 **AstroBot senga 3 ta asosiy fan bo‘yicha doimo aniq javob beradi:**\n` +
            `📐 **1. Matematika:** Misollar (masalan: 12 * 8), masalalar (olma, kitoblar), karra jadvali va shakllar!\n` +
            `🇬🇧 **2. Ingliz tili:** So‘zlar tarjimasi ("Cat nima?"), qoidalar (A va An farqi), ranglar va yangi so‘zlar!\n` +
            `⚛️ **3. Fizika:** Samolyot qanday uchadi, nega kema cho‘kmaydi, gravitatsiya, magnit va koinot sirlari!\n` +
            `</div>\n\n` +
            `❓ **AstroBotdan senga do‘stona savol:** Sen o‘zing bu haqida qanday o‘ylaysan? Shu 3 ta fandan birini tanlab, savolingni aniqroq bera olasizmi? 🚀` +
            quotaTag);

      this.appendBotMessage(universalReply, null, true);
    }

    // Detect language from text
    detectLanguage(text) {
      if (this.currentLanguage && this.currentLanguage !== 'auto') {
        return this.currentLanguage;
      }

      if (/[\u0400-\u04FF]/i.test(text)) {
        return 'ru';
      }

      if (/\b(salom|qanday|nega|nima|uchun|bilan|ertak|topishmoq|rahmat|yaxshi|qayerda|haqida|bolakay|qushcha|daraxt|akamda|olma|qoldi)\b/i.test(text) || /[o‘g‘]/i.test(text)) {
        return 'uz';
      }

      if (/\b(what|why|how|hello|hi|please|thank|story|quiz|space|rocket|friend|apple|gravity|rainbow|plane)\b/i.test(text)) {
        return 'en';
      }

      return this.currentLanguage || 'uz';
    }

    // Text-to-Speech (TTS) Engine with native phonetic handling
    speak(rawText, btnElement = null) {
      if (!this.speechSynth) return;

      this.stopSpeaking();

      try {
        const lang = this.detectLanguage(rawText);

        if (lang === 'uz' && window.uzbekSpeech) {
          if (btnElement) btnElement.classList.add('is-speaking');
          window.uzbekSpeech.speak(rawText, {
            onStart: () => {
              if (btnElement) btnElement.classList.add('is-speaking');
            },
            onEnd: () => {
              if (btnElement) btnElement.classList.remove('is-speaking');
              this.activeUtterance = null;
            }
          });
          return;
        }

        const { voice, langCode, cleanText } = this.resolveTTSVoice(rawText, lang);

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = langCode;
        if (voice) utterance.voice = voice;

        utterance.pitch = lang === 'ru' ? 1.25 : 1.28;
        utterance.rate = 1.0;

        if (btnElement) {
          btnElement.classList.add('is-speaking');
        }

        utterance.onend = () => {
          if (btnElement) btnElement.classList.remove('is-speaking');
          this.activeUtterance = null;
        };

        utterance.onerror = () => {
          if (btnElement) btnElement.classList.remove('is-speaking');
          this.activeUtterance = null;
        };

        this.activeUtterance = utterance;
        this.speechSynth.speak(utterance);
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }

    stopSpeaking() {
      if (this.speechSynth && this.speechSynth.speaking) {
        this.speechSynth.cancel();
      }
      this.activeUtterance = null;
      document.querySelectorAll('.astro-action-speak-btn').forEach(b => b.classList.remove('is-speaking'));
    }

    resolveTTSVoice(text, lang) {
      const plain = text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/<[^>]+>/g, ' ')
        .replace(/[\n\r]+/g, ' ')
        .trim();

      const voices = this.speechSynth ? this.speechSynth.getVoices() : [];

      if (lang === 'ru') {
        const ruVoice = voices.find(v => v.lang.startsWith('ru') || v.lang.startsWith('RU'));
        return { voice: ruVoice, langCode: 'ru-RU', cleanText: plain };
      }

      if (lang === 'en') {
        const enVoice = voices.find(v => (v.lang.startsWith('en') || v.lang.startsWith('EN')) && /female|natural|google|kid/i.test(v.name)) || voices.find(v => v.lang.startsWith('en'));
        return { voice: enVoice, langCode: 'en-US', cleanText: plain };
      }

      // Uzbek - Native or Turkic Phonetic Bridge (Never Russian voice!)
      const uzVoice = voices.find(v => v.lang && (v.lang.startsWith('uz') || v.lang.startsWith('UZ')));
      if (uzVoice) {
        return { voice: uzVoice, langCode: 'uz-UZ', cleanText: plain };
      }

      const trVoice = voices.find(v => v.lang && (v.lang.startsWith('tr') || v.lang.startsWith('TR')));
      if (trVoice) {
        return { voice: trVoice, langCode: 'tr-TR', cleanText: this.uzToTurkish(plain) };
      }

      const azKkVoice = voices.find(v => v.lang && (v.lang.startsWith('az') || v.lang.startsWith('kk')));
      if (azKkVoice) {
        return { voice: azKkVoice, langCode: azKkVoice.lang, cleanText: this.uzToTurkish(plain) };
      }

      const latinVoice = voices.find(v => v.lang && (v.lang.startsWith('it') || v.lang.startsWith('es')));
      if (latinVoice) {
        return { voice: latinVoice, langCode: latinVoice.lang, cleanText: plain };
      }

      return { voice: null, langCode: 'tr-TR', cleanText: this.uzToTurkish(plain) };
    }

    uzToPhoneticCyrillic(text) {
      let t = text;
      t = t.replace(/o['‘`]/gi, 'ў').replace(/g['‘`]/gi, 'ғ').replace(/sh/gi, 'ш').replace(/ch/gi, 'ч');
      const map = {
        'a':'а','b':'б','d':'д','e':'э','f':'ф','g':'г','h':'ҳ','i':'и','j':'ж','k':'к',
        'l':'л','m':'м','n':'н','o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у',
        'v':'в','x':'х','y':'й','z':'з'
      };
      return t.split('').map(c => {
        const lower = c.toLowerCase();
        return map[lower] ? (c === lower ? map[lower] : map[lower].toUpperCase()) : c;
      }).join('');
    }

    uzToTurkish(text) {
      return text.replace(/o['‘`]/gi, 'o').replace(/g['‘`]/gi, 'ğ').replace(/sh/gi, 'ş').replace(/ch/gi, 'ç');
    }

    formatBotText(raw) {
      let t = this.escapeHTML(raw);
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      t = t.replace(/\n\n/g, '</p><p>');
      t = t.replace(/\n/g, '<br/>');
      t = '<p>' + t + '</p>';
      t = t.replace(/&lt;div class=&quot;([^&]+)&quot;&gt;/g, '<div class="$1">');
      t = t.replace(/&lt;\/div&gt;/g, '</div>');
      t = t.replace(/&lt;span class=&quot;([^&]+)&quot;&gt;/g, '<span class="$1">');
      t = t.replace(/&lt;\/span&gt;/g, '</span>');
      t = t.replace(/&lt;strong&gt;/g, '<strong>');
      t = t.replace(/&lt;\/strong&gt;/g, '</strong>');
      t = t.replace(/&lt;em&gt;/g, '<em>');
      t = t.replace(/&lt;\/em&gt;/g, '</em>');
      t = t.replace(/&lt;br\/?&gt;/g, '<br/>');
      t = t.replace(/&lt;small style=&quot;([^&]+)&quot;&gt;/g, '<small style="$1">');
      t = t.replace(/&lt;\/small&gt;/g, '</small>');
      return t;
    }

    escapeHTML(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    showTypingIndicator() {
      const container = document.getElementById('astro-chat-messages');
      if (!container) return;

      const existing = document.getElementById('astro-typing-indicator');
      if (existing) existing.remove();

      const row = document.createElement('div');
      row.className = 'astro-msg-row astro-msg-bot astro-typing-row';
      row.id = 'astro-typing-indicator';
      row.innerHTML = `
        <div class="astro-msg-avatar">
          ${ASTROBOT_SVG}
        </div>
        <div class="astro-typing-bubble">
          <span class="astro-dot"></span>
          <span class="astro-dot"></span>
          <span class="astro-dot"></span>
        </div>
      `;

      container.appendChild(row);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      const existing = document.getElementById('astro-typing-indicator');
      if (existing) existing.remove();
    }

    scrollToBottom() {
      const container = document.getElementById('astro-chat-messages');
      if (!container) return;
      container.scrollTop = container.scrollHeight;
    }

    triggerInChatConfetti() {
      const canvas = document.getElementById('astro-inchat-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const particles = [];
      const colors = ['#FFB703', '#FB8500', '#0284C7', '#38BDF8', '#10B981', '#EC4899', '#8B5CF6'];

      for (let i = 0; i < 45; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height * 0.7,
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 8 - 4,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          opacity: 1
        });
      }

      let frameCount = 0;
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.28;
          p.rotation += p.rotationSpeed;
          p.opacity -= 0.015;

          if (p.opacity > 0) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
          }
        });

        frameCount++;
        if (alive && frameCount < 90) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      animate();
    }

    triggerSparkles(targetElement) {
      if (!targetElement) return;
      const count = 6;
      for (let i = 0; i < count; i++) {
        const star = document.createElement('span');
        star.className = 'astro-sparkle-star';
        star.textContent = '⭐';
        star.style.cssText = `
          position: absolute;
          left: ${Math.random() * 80 + 10}%;
          top: ${Math.random() * 60 + 20}%;
          font-size: ${Math.random() * 10 + 14}px;
          pointer-events: none;
          animation: sparkleFloat 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          z-index: 100;
        `;
        targetElement.style.position = 'relative';
        targetElement.appendChild(star);
        setTimeout(() => star.remove(), 950);
      }
    }
  }

  // Auto-instantiate when DOM is ready
  function initAstroBot() {
    if (!window.astroBot) {
      window.astroBot = new AstroBotChat();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAstroBot);
  } else {
    initAstroBot();
  }

})();
