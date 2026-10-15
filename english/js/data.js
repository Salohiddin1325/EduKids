/**
 * KiddoLingo - English for Kids
 * Complete Educational Dataset: Vocabulary, Grammar Lessons, Quizzes & Badges
 * Includes English, Uzbek, and Russian translations with kid-friendly definitions.
 */

const VOCABULARY_DATA = [
  // =========================================================================
  // 1. ANIMALS (Hayvonlar / Животные) - 10 Words
  // =========================================================================
  {
    id: 'cat',
    word: 'Cat',
    phonetic: '[kæt]',
    category: 'animals',
    emoji: '🐱',
    color: '#FFB703',
    definitionEn: 'A small furry pet that meows.',
    definitionUz: 'Miyovlaydigan va erkalanishni sevadigan mitti xonaki hayvon!',
    definitionRu: 'Маленький пушистый питомец, который мяукает!',
    uzbek: 'Mushuk',
    russian: 'Кошка',
    exampleEn: 'The little cat loves to nap in the warm sunshine.',
    exampleUz: 'Mitti mushukcha iliq quyoshda uxlashni yaxshi ko‘radi.',
    exampleRu: 'Маленькая кошечка любит спать на тёплом солнышке.'
  },
  {
    id: 'dog',
    word: 'Dog',
    phonetic: '[dɒɡ]',
    category: 'animals',
    emoji: '🐶',
    color: '#E07A5F',
    definitionEn: 'A loyal animal that barks and wags its tail.',
    definitionUz: 'Dumini likillatib, vovullaydigan sodiq va quvnoq do‘st!',
    definitionRu: 'Преданный друг человека, который лает и виляет хвостиком!',
    uzbek: 'It',
    russian: 'Собака',
    exampleEn: 'The playful dog runs and catches the red ball.',
    exampleUz: 'Sho‘x kuchukcha yugurib borib qizil to‘pni ushlab oldi.',
    exampleRu: 'Игривая собака бежит и ловит красный мячик.'
  },
  {
    id: 'elephant',
    word: 'Elephant',
    phonetic: '[ˈel.ɪ.fənt]',
    category: 'animals',
    emoji: '🐘',
    color: '#8ECAE6',
    definitionEn: 'A huge grey animal with a long trunk.',
    definitionUz: 'Uzun xartumli va katta quloqli bahaybat kulrang hayvon!',
    definitionRu: 'Огромное серое животное с длинным хоботом и большими ушами!',
    uzbek: 'Fil',
    russian: 'Слон',
    exampleEn: 'The elephant sprays cool water with its long trunk.',
    exampleUz: 'Fil uzun xartumi bilan muzdek suv sachratadi.',
    exampleRu: 'Слон брызгает прохладной водой из своего длинного хобота.'
  },
  {
    id: 'lion',
    word: 'Lion',
    phonetic: '[ˈlaɪ.ən]',
    category: 'animals',
    emoji: '🦁',
    color: '#F4A261',
    definitionEn: 'The big wild king of the jungle.',
    definitionUz: 'Qalin yoli bor kuchli hayvon, o‘rmon va savannaning qiroli!',
    definitionRu: 'Большой и смелый царь зверей с пышной золотой гривой!',
    uzbek: 'Sher',
    russian: 'Лев',
    exampleEn: 'The lion roars loudly and proudly on the hill.',
    exampleUz: 'Sher tepalikda baland va mag‘rur o‘kiradi.',
    exampleRu: 'Лев громко и гордо рычит на холме.'
  },
  {
    id: 'monkey',
    word: 'Monkey',
    phonetic: '[ˈmʌŋ.ki]',
    category: 'animals',
    emoji: '🐒',
    color: '#DDA15E',
    definitionEn: 'A playful animal that loves bananas and climbing trees.',
    definitionUz: 'Daraxtlarga chaqqon tirmashib, banan yeydigan sho‘x maymun!',
    definitionRu: 'Озорное животное, любящее бананы и прыжки по деревьям!',
    uzbek: 'Maymun',
    russian: 'Обезьяна',
    exampleEn: 'The funny monkey swings quickly from branch to branch.',
    exampleUz: 'Kulgili maymun shoxdan-shoxga chaqqon sakraydi.',
    exampleRu: 'Смешная обезьянка быстро прыгает с ветки на ветку.'
  },
  {
    id: 'rabbit',
    word: 'Rabbit',
    phonetic: '[ˈræb.ɪt]',
    category: 'animals',
    emoji: '🐰',
    color: '#FFB5A7',
    definitionEn: 'A fluffy animal with long ears that hops.',
    definitionUz: 'Uzun quloqlari bor, sabzi yeb chaqqon sakraydigan paxmoq hayvoncha!',
    definitionRu: 'Пушистый зверёк с длинными ушками, который быстро прыгает!',
    uzbek: 'Quyon',
    russian: 'Кролик',
    exampleEn: 'The white rabbit munches a crunchy sweet carrot.',
    exampleUz: 'Oq quyoncha shirin va qarsildoq sabzini kemiradi.',
    exampleRu: 'Белый кролик грызёт сладкую хрустящую морковку.'
  },
  {
    id: 'bear',
    word: 'Bear',
    phonetic: '[beər]',
    category: 'animals',
    emoji: '🐻',
    color: '#A77B5A',
    definitionEn: 'A large furry animal that loves honey.',
    definitionUz: 'Shirin asalni juda yaxshi ko‘radigan katta paxmoq o‘rmon polvoni!',
    definitionRu: 'Большой пушистый лесной великан, который обожает мёд!',
    uzbek: 'Ayiq',
    russian: 'Медведь',
    exampleEn: 'The big brown bear looks for sweet honey in the forest.',
    exampleUz: 'Katta qo‘ng‘ir ayiq o‘rmonda shirin asal qidiradi.',
    exampleRu: 'Большой бурый медведь ищет сладкий мёд в лесу.'
  },
  {
    id: 'giraffe',
    word: 'Giraffe',
    phonetic: '[dʒɪˈrɑːf]',
    category: 'animals',
    emoji: '🦒',
    color: '#F39C12',
    definitionEn: 'A tall animal with a very long neck.',
    definitionUz: 'Bo‘yni juda uzun, baland daraxt barglarini oson yeydigan hayvon!',
    definitionRu: 'Высокое пятнистое животное с очень длинной шеей!',
    uzbek: 'Jirafa',
    russian: 'Жираф',
    exampleEn: 'The tall giraffe easily eats tender leaves from high trees.',
    exampleUz: 'Baland jirafa baland daraxtlardagi mayin barglarni oson yeydi.',
    exampleRu: 'Высокий жираф легко кушает сочные листья с верхушек деревьев.'
  },
  {
    id: 'frog',
    word: 'Frog',
    phonetic: '[frɒɡ]',
    category: 'animals',
    emoji: '🐸',
    color: '#2ECC71',
    definitionEn: 'A green animal that jumps and lives near water.',
    definitionUz: 'Suv bo‘yida yashaydigan, quvnoq sakrab vaqillaydigan yashil jonzot!',
    definitionRu: 'Зелёное животное, которое высоко прыгает и живёт у воды!',
    uzbek: 'Baqa',
    russian: 'Лягушка',
    exampleEn: 'The little green frog hops into the pond with a splash!',
    exampleUz: 'Kichik yashil baqa ko‘lmakka chovillab sakradi!',
    exampleRu: 'Маленькая зелёная лягушка прыгнула в пруд с брызгами!'
  },
  {
    id: 'duck',
    word: 'Duck',
    phonetic: '[dʌk]',
    category: 'animals',
    emoji: '🦆',
    color: '#3498DB',
    definitionEn: 'A bird that swims and says quack.',
    definitionUz: 'Suvda suzishni yoqtiradigan va "vaq-vaq" deb ovoz chiqaradigan qush!',
    definitionRu: 'Птица, которая плавает по воде и говорит «кря-кря»!',
    uzbek: 'O‘rdak',
    russian: 'Утка',
    exampleEn: 'The mother duck swims with her yellow ducklings.',
    exampleUz: 'Ona o‘rdak sariq polaponlari bilan birga suzmoqda.',
    exampleRu: 'Мама утка плавает вместе со своими жёлтыми утятами.'
  },

  // =========================================================================
  // 2. FRUITS & FOOD (Mevalar va Ovqatlar / Фрукты и Еда) - 10 Words
  // =========================================================================
  {
    id: 'apple',
    word: 'Apple',
    phonetic: '[ˈæp.əl]',
    category: 'fruits',
    emoji: '🍎',
    color: '#E74C3C',
    definitionEn: 'A sweet round red or green fruit.',
    definitionUz: 'Salomatlik uchun juda foydali, shirin va qarsildoq qizil yoki yashil meva!',
    definitionRu: 'Сладкий круглый красный или зелёный сочный фрукт!',
    uzbek: 'Olma',
    russian: 'Яблоко',
    exampleEn: 'An apple a day keeps the doctor away!',
    exampleUz: 'Har kuni bitta olma yesang, shifokorga hojat qolmaydi!',
    exampleRu: 'Одно яблоко в день дарит здоровье на весь день!'
  },
  {
    id: 'banana',
    word: 'Banana',
    phonetic: '[bəˈnɑː.nə]',
    category: 'fruits',
    emoji: '🍌',
    color: '#F1C40F',
    definitionEn: 'A long yellow fruit that monkeys love.',
    definitionUz: 'Sariq po‘stlog‘ini archib yeyiladigan shirin va yumshoq meva!',
    definitionRu: 'Длинный жёлтый сладкий фрукт, который так любят обезьянки!',
    uzbek: 'Banan',
    russian: 'Банан',
    exampleEn: 'Monkeys love sweet yellow bananas for breakfast.',
    exampleUz: 'Maymunlar nonushtaga shirin sariq bananlarni yaxshi ko‘radi.',
    exampleRu: 'Обезьянки любят сладкие жёлтые бананы на завтрак.'
  },
  {
    id: 'watermelon',
    word: 'Watermelon',
    phonetic: '[ˈwɔː.təˌmel.ən]',
    category: 'fruits',
    emoji: '🍉',
    color: '#1ABC9C',
    definitionEn: 'A large sweet green fruit with red inside.',
    definitionUz: 'Tashqarisi yashil, ichi esa qip-qizil, muzdek va juda shirin poliz mevasi!',
    definitionRu: 'Огромный зелёный снаружи и сочно-красный внутри сладкий плод!',
    uzbek: 'Tarvuz',
    russian: 'Арбуз',
    exampleEn: 'We slice cool watermelon on warm sunny afternoons.',
    exampleUz: 'Quyoshli issiq kunda muzdek tarvuz tilimlarini yeymiz.',
    exampleRu: 'Мы режем прохладный арбуз в жаркий солнечный день.'
  },
  {
    id: 'milk',
    word: 'Milk',
    phonetic: '[mɪlk]',
    category: 'fruits',
    emoji: '🥛',
    color: '#BDC3C7',
    definitionEn: 'A healthy white drink from cows.',
    definitionUz: 'Suyaklar va tishlarni mustahkam qiluvchi oppoq shifobaxsh ichimlik!',
    definitionRu: 'Белый полезный напиток от коров, укрепляющий кости и зубки!',
    uzbek: 'Sut',
    russian: 'Молоко',
    exampleEn: 'Drinking warm milk helps you sleep soundly.',
    exampleUz: 'Iliq sut ichish shirin uxlashga yordam beradi.',
    exampleRu: 'Тёплое молоко помогает крепко и сладко спать.'
  },
  {
    id: 'bread',
    word: 'Bread',
    phonetic: '[bred]',
    category: 'fruits',
    emoji: '🍞',
    color: '#D4AC0D',
    definitionEn: 'Soft food made from flour that we eat daily.',
    definitionUz: 'Bug‘doy unidan yopiladigan, har kuni dasturxonga qo‘yiladigan yumshoq noz-ne’mat!',
    definitionRu: 'Мягкая ароматная выпечка из муки, которую мы кушаем каждый день!',
    uzbek: 'Non',
    russian: 'Хлеб',
    exampleEn: 'We have fresh warm bread with breakfast.',
    exampleUz: 'Nonushtaga issiq yangi non yeymiz.',
    exampleRu: 'Мы кушаем свежий тёплый хлеб на завтрак.'
  },
  {
    id: 'cheese',
    word: 'Cheese',
    phonetic: '[tʃiːz]',
    category: 'fruits',
    emoji: '🧀',
    color: '#F39C12',
    definitionEn: 'A tasty yellow food made from milk.',
    definitionUz: 'Sutdan tayyorlanadigan mazali va to‘yimli sariq mahsulot!',
    definitionRu: 'Вкусная жёлтая еда из молока, которую обожают мышата!',
    uzbek: 'Pishloq',
    russian: 'Сыр',
    exampleEn: 'I put a slice of yellow cheese on my sandwich.',
    exampleUz: 'Buterbrodim ustiga bir tilim sariq pishloq qo‘ydim.',
    exampleRu: 'Я положил ломтик жёлтого сыра на бутерброд.'
  },
  {
    id: 'ice_cream',
    word: 'Ice cream',
    phonetic: '[ˈaɪs ˌkriːm]',
    category: 'fruits',
    emoji: '🍨',
    color: '#FF7675',
    definitionEn: 'A cold, sweet frozen treat.',
    definitionUz: 'Issiq kunda tanaga xush yoquvchi muzdek va shirin shirinlik!',
    definitionRu: 'Холодное, сладкое и самое любимое детское лакомство!',
    uzbek: 'Muzqaymoq',
    russian: 'Мороженое',
    exampleEn: 'I love strawberry ice cream on hot summer days!',
    exampleUz: 'Issiq yoz kunlarida qulupnayli muzqaymoq yeyishni yaxshi ko‘raman!',
    exampleRu: 'Я люблю клубничное мороженое в жаркие летние дни!'
  },
  {
    id: 'orange',
    word: 'Orange',
    phonetic: '[ˈɒr.ɪndʒ]',
    category: 'fruits',
    emoji: '🍊',
    color: '#E67E22',
    definitionEn: 'A juicy round orange-colored fruit.',
    definitionUz: 'C vitaminiga boy, to‘q sariq rangli xushbo‘y va suvli meva!',
    definitionRu: 'Круглый оранжевый фрукт с сочным сладким соком и витамином C!',
    uzbek: 'Apelsin',
    russian: 'Апельсин',
    exampleEn: 'Fresh orange juice tastes delicious in the morning.',
    exampleUz: 'Ertalab yangi siqilgan apelsin sharbati juda mazali bo‘ladi.',
    exampleRu: 'Свежий апельсиновый сок очень вкусный утром.'
  },
  {
    id: 'cake',
    word: 'Cake',
    phonetic: '[keɪk]',
    category: 'fruits',
    emoji: '🎂',
    color: '#FD79A8',
    definitionEn: 'A sweet baked dessert for birthdays.',
    definitionUz: 'Tug‘ilgan kun va bayramlarda pishiriladigan shirin va chiroyli pishiriq!',
    definitionRu: 'Сладкое праздничное угощение со свечками на день рождения!',
    uzbek: 'Tort',
    russian: 'Торт',
    exampleEn: 'We blew out the candles on the birthday cake.',
    exampleUz: 'Tug‘ilgan kun tortidagi shamlarni puflab o‘chirdik.',
    exampleRu: 'Мы задули свечи на праздничном торте.'
  },
  {
    id: 'pizza',
    word: 'Pizza',
    phonetic: '[ˈpiːt.sə]',
    category: 'fruits',
    emoji: '🍕',
    color: '#E17055',
    definitionEn: 'Flat round bread with cheese and toppings.',
    definitionUz: 'Erigan cho‘ziluvchan pishloq va pomidorlar bilan pishirilgan mazali pitsa!',
    definitionRu: 'Вкусная горячая лепёшка с тягучим сыром и томатами!',
    uzbek: 'Pitsa',
    russian: 'Пицца',
    exampleEn: 'We made delicious cheese pizza with mom today.',
    exampleUz: 'Bugun onam bilan birga mazali pishloqli pitsa pishirdik.',
    exampleRu: 'Сегодня мы с мамой приготовили вкусную пиццу.'
  },

  // =========================================================================
  // 3. COLORS & SHAPES (Ranglar va Shakllar / Цвета и Формы) - 10 Words
  // =========================================================================
  {
    id: 'red',
    word: 'Red',
    phonetic: '[red]',
    category: 'colors',
    emoji: '🔴',
    color: '#FF4757',
    definitionEn: 'The color of strawberries and tomatoes.',
    definitionUz: 'Qulupnay, pomidor va o‘t o‘chiruvchi mashinaning yorqin rangi!',
    definitionRu: 'Яркий цвет спелой клубники, огня и сочных помидоров!',
    uzbek: 'Qizil',
    russian: 'Красный',
    exampleEn: 'The bright red balloon flies high into the sky.',
    exampleUz: 'Yorqin qizil shar osmonga qarab uchib ketdi.',
    exampleRu: 'Яркий красный шарик улетает высоко в небо.'
  },
  {
    id: 'blue',
    word: 'Blue',
    phonetic: '[bluː]',
    category: 'colors',
    emoji: '🔵',
    color: '#1E90FF',
    definitionEn: 'The color of the clear sky and ocean.',
    definitionUz: 'Musaffo osmon va bepoyon moviy dengiz to‘lqinlarining tinchlantiruvchi rangi!',
    definitionRu: 'Красивый цвет ясного неба и глубокого бескрайнего моря!',
    uzbek: 'Ko‘k',
    russian: 'Синий',
    exampleEn: 'The birds fly high up in the blue sky.',
    exampleUz: 'Qushlar moviy osmonda baland parvoz qiladi.',
    exampleRu: 'Птицы летают высоко в голубом небе.'
  },
  {
    id: 'yellow',
    word: 'Yellow',
    phonetic: '[ˈjel.əʊ]',
    category: 'colors',
    emoji: '🟡',
    color: '#FFA502',
    definitionEn: 'The bright color of the sun and bananas.',
    definitionUz: 'Nur sochayotgan quyosh, kungaboqar va yetilgan bananning yorqin rangi!',
    definitionRu: 'Весёлый солнечный цвет тёплого солнышка и спелых бананов!',
    uzbek: 'Sariq',
    russian: 'Жёлтый',
    exampleEn: 'The yellow sun smiles warmly above us.',
    exampleUz: 'Sariq quyosh tepamizda mehr bilan jilmaymoqda.',
    exampleRu: 'Жёлтое солнце тепло улыбается нам с неба.'
  },
  {
    id: 'green',
    word: 'Green',
    phonetic: '[ɡriːn]',
    category: 'colors',
    emoji: '🟢',
    color: '#2ED573',
    definitionEn: 'The color of grass and tree leaves.',
    definitionUz: 'Yam-yashil o‘t-o‘lanlar, daraxt barglari va baqaloq qurbaqaning rangi!',
    definitionRu: 'Свежий цвет сочной травы, листьев на деревьях и лягушат!',
    uzbek: 'Yashil',
    russian: 'Зелёный',
    exampleEn: 'In spring, trees are covered with fresh green leaves.',
    exampleUz: 'Bahorda barcha daraxtlar yam-yashil yaproqlarga burkanadi.',
    exampleRu: 'Весной деревья покрываются свежими зелёными листьями.'
  },
  {
    id: 'sun_colors',
    word: 'Sun',
    phonetic: '[sʌn]',
    category: 'colors',
    emoji: '☀️',
    color: '#FFB703',
    definitionEn: 'The bright hot yellow star in the sky.',
    definitionUz: 'Yer yuziga yorug‘lik va iliq harorat ulashuvchi osmondagi yorqin quyosh!',
    definitionRu: 'Яркая жёлтая звезда, дарящая свет и тепло нашей планете!',
    uzbek: 'Quyosh',
    russian: 'Солнце',
    exampleEn: 'The warm sun shines down on the green meadow.',
    exampleUz: 'Iliq quyosh yashil o‘tloq uzra nur sochmoqda.',
    exampleRu: 'Тёплое солнце сияет над зелёной полянкой.'
  },
  {
    id: 'star',
    word: 'Star',
    phonetic: '[stɑːr]',
    category: 'colors',
    emoji: '⭐',
    color: '#F9CA24',
    definitionEn: 'A shiny glowing point in the night sky.',
    definitionUz: 'Tungi osmonda miltirab nur sochadigan yorqin yulduzcha!',
    definitionRu: 'Сверкающая светящаяся точка в ночном небе!',
    uzbek: 'Yulduz',
    russian: 'Звезда',
    exampleEn: 'You did great, here is a shiny golden star for you!',
    exampleUz: 'Juda zo‘r bajardingiz, mana sizga oltin yulduzcha!',
    exampleRu: 'Ты отлично справился, вот тебе золотая звёздочка!'
  },
  {
    id: 'circle',
    word: 'Circle',
    phonetic: '[ˈsɜː.kəl]',
    category: 'colors',
    emoji: '⭕',
    color: '#3742FA',
    definitionEn: 'A round shape like a wheel or coin.',
    definitionUz: 'Koptok yoki tanga kabi burchaklari yo‘q, mutlaqo dumaloq shakl!',
    definitionRu: 'Идеально круглая фигура без уголков, как колесо или монетка!',
    uzbek: 'Doira',
    russian: 'Круг',
    exampleEn: 'Draw a big round circle for the smiling face.',
    exampleUz: 'Kulib turgan yuz uchun katta doira chizing.',
    exampleRu: 'Нарисуй большой круг для весёлого личика.'
  },
  {
    id: 'square',
    word: 'Square',
    phonetic: '[skweər]',
    category: 'colors',
    emoji: '⏹️',
    color: '#9B59B6',
    definitionEn: 'A shape with four equal straight sides.',
    definitionUz: 'To‘rtta tomoni va burchaklari bir xil teng bo‘lgan geometrik shakl!',
    definitionRu: 'Геометрическая фигура с четырьмя одинаковыми прямыми сторонами!',
    uzbek: 'Kvadrat',
    russian: 'Квадрат',
    exampleEn: 'The picture frame is shaped like a perfect square.',
    exampleUz: 'Rasm ramkasi xuddi tekis kvadrat shaklida.',
    exampleRu: 'Рамочка для фото имеет форму правильного квадрата.'
  },
  {
    id: 'heart_shape',
    word: 'Heart',
    phonetic: '[hɑːt]',
    category: 'colors',
    emoji: '❤️',
    color: '#FF4757',
    definitionEn: 'A shape that represents love.',
    definitionUz: 'Mehr-muhabbat va ezgulikni ifodalovchi yoqimli shakl!',
    definitionRu: 'Красивая фигура, которая обозначает любовь и доброту!',
    uzbek: 'Yurak',
    russian: 'Сердце',
    exampleEn: 'She drew a sweet red heart on her drawing paper.',
    exampleUz: 'U chizgan rasmiga chiroyli qizil yurakcha qo‘shdi.',
    exampleRu: 'Она нарисовала красивое красное сердечко на рисунке.'
  },
  {
    id: 'rainbow',
    word: 'Rainbow',
    phonetic: '[ˈreɪn.bəʊ]',
    category: 'colors',
    emoji: '🌈',
    color: '#FF6B81',
    definitionEn: 'Beautiful colorful arch in the sky after rain.',
    definitionUz: 'Yomg‘irdan keyin osmonda paydo bo‘ladigan 7 xil rangli sehrli kamalak!',
    definitionRu: 'Красивая разноцветная дуга на небе после дождя!',
    uzbek: 'Kamalak',
    russian: 'Радуга',
    exampleEn: 'A brilliant rainbow stretched across the blue sky.',
    exampleUz: 'Moviy osmon uzra jilvalanuvchi kamalak cho‘zildi.',
    exampleRu: 'Яркая радуга протянулась через всё синее небо.'
  },

  // =========================================================================
  // 4. FAMILY & PEOPLE (Oila va Odamlar / Семья и Люди) - 10 Words
  // =========================================================================
  {
    id: 'mother',
    word: 'Mother',
    phonetic: '[ˈmʌð.ər]',
    category: 'family',
    emoji: '👩',
    color: '#FF6B8B',
    definitionEn: 'The loving woman who takes care of you.',
    definitionUz: 'Bizni mehr bilan quchoqlovchi, eng yaxshi ko‘ruvchi mehribon ona!',
    definitionRu: 'Самый добрый и заботливый человек, дарящий тепло и любовь!',
    uzbek: 'Ona',
    russian: 'Мама',
    exampleEn: 'My mother reads me sweet bedtime fairy tales.',
    exampleUz: 'Mening onam menga yotishdan oldin ertaklar o‘qib beradi.',
    exampleRu: 'Моя мама читает мне сказки перед сном.'
  },
  {
    id: 'father',
    word: 'Father',
    phonetic: '[ˈfɑː.ðər]',
    category: 'family',
    emoji: '👨',
    color: '#2F3542',
    definitionEn: 'The man who cares for and guides the family.',
    definitionUz: 'Bizni himoya qiladigan, qo‘llab-quvvatlaydigan suyukli va g‘amxo‘r ota!',
    definitionRu: 'Сильный и добрый папа, который заботится о семье и всегда поможет!',
    uzbek: 'Ota',
    russian: 'Папа',
    exampleEn: 'My father taught me how to ride a bicycle.',
    exampleUz: 'Dadam menga velosiped minishni o‘rgatgan.',
    exampleRu: 'Мой папа научил меня кататься на велосипеде.'
  },
  {
    id: 'brother',
    word: 'Brother',
    phonetic: '[ˈbrʌð.ər]',
    category: 'family',
    emoji: '👦',
    color: '#1E90FF',
    definitionEn: 'A boy or man who has the same parents as you.',
    definitionUz: 'Birga o‘sib, o‘yinchoqlarni baham ko‘radigan o‘g‘il farzand — aka yoki uka!',
    definitionRu: 'Мальчик в семье с теми же родителями — надёжный друг!',
    uzbek: 'Aka / Uka',
    russian: 'Брат',
    exampleEn: 'My brother and I build tall castles from toy blocks.',
    exampleUz: 'Akam bilan birgalikda o‘yinchoq kubiklardan baland qasrlar quramiz.',
    exampleRu: 'Мы с братом строим высокие замки из кубиков.'
  },
  {
    id: 'sister',
    word: 'Sister',
    phonetic: '[ˈsɪs.tər]',
    category: 'family',
    emoji: '👧',
    color: '#FF9FF3',
    definitionEn: 'A girl or woman who has the same parents as you.',
    definitionUz: 'Birgalikda dars qilib, sirlashadigan qadrdon opa yoki singil!',
    definitionRu: 'Девочка в семье с теми же родителями, с которой весело дружить!',
    uzbek: 'Opa / Singil',
    russian: 'Сестра',
    exampleEn: 'My sister sings joyful songs with her sweet voice.',
    exampleUz: 'Singlim o‘zining shirin ovozi bilan quvnoq qo‘shiqlar aytadi.',
    exampleRu: 'Моя сестрёнка поёт весёлые песенки своим звонким голоском.'
  },
  {
    id: 'baby',
    word: 'Baby',
    phonetic: '[ˈbeɪ.bi]',
    category: 'family',
    emoji: '👶',
    color: '#F8C291',
    definitionEn: 'A very young child that giggles and sleeps.',
    definitionUz: 'Kichkintoy, kulgisi shirin va ko‘p uxlaydigan mitti bola!',
    definitionRu: 'Крошечный ребёнок, который мило улыбается и много спит!',
    uzbek: 'Chaqaloq',
    russian: 'Малыш',
    exampleEn: 'The baby giggles happily when playing peek-a-boo.',
    exampleUz: 'Chaqaloq bekinmachoq o‘ynaganda quvnoq kuladi.',
    exampleRu: 'Малыш весело смеётся, когда играет в прятки.'
  },
  {
    id: 'friend',
    word: 'Friend',
    phonetic: '[frend]',
    category: 'family',
    emoji: '🤝',
    color: '#70A1FF',
    definitionEn: 'Someone you play with and like spending time with.',
    definitionUz: 'O‘yinchoqlarni baham ko‘rib, birga quvnoq o‘ynaydigan qadrdon do‘st!',
    definitionRu: 'Тот, с кем весело играть, делиться игрушками и дружить!',
    uzbek: 'Do‘st',
    russian: 'Друг',
    exampleEn: 'A best friend always shares toys and smiles.',
    exampleUz: 'Eng yaqin do‘st doim o‘yinchoqlarini ulashadi va kular yuz bo‘ladi.',
    exampleRu: 'Лучший друг всегда делится игрушками и улыбкой.'
  },
  {
    id: 'teacher',
    word: 'Teacher',
    phonetic: '[ˈtiː.tʃər]',
    category: 'family',
    emoji: '🧑‍🏫',
    color: '#5352ED',
    definitionEn: 'A person who helps kids learn new things at school.',
    definitionUz: 'Maktabda bolalarga o‘qish, yozish va bilimlarni o‘rgatuvchi mehribon ustoz!',
    definitionRu: 'Человек, который помогает детям узнавать новое и полезное в школе!',
    uzbek: 'O‘qituvchi',
    russian: 'Учитель',
    exampleEn: 'Our teacher explains interesting science facts in class.',
    exampleUz: 'O‘qituvchimiz darsda qiziqarli fan faktlarini tushuntiradi.',
    exampleRu: 'Наш учитель объясняет интересные научные факты на уроке.'
  },
  {
    id: 'doctor',
    word: 'Doctor',
    phonetic: '[ˈdɒk.tər]',
    category: 'family',
    emoji: '🧑‍⚕️',
    color: '#2ED573',
    definitionEn: 'A person who helps sick people get well.',
    definitionUz: 'Bemorlarni davolab, ularning tezroq sog‘ayishiga yordam beruvchi shifokor!',
    definitionRu: 'Добрый человек, который лечит людей и помогает им быть здоровыми!',
    uzbek: 'Shifokor',
    russian: 'Врач',
    exampleEn: 'The kind doctor helps children stay strong and healthy.',
    exampleUz: 'Mehribon shifokor bolalarning baquvvat va sog‘lom bo‘lishiga ko‘maklashadi.',
    exampleRu: 'Добрый врач помогает детям оставаться сильными и здоровыми.'
  },
  {
    id: 'boy',
    word: 'Boy',
    phonetic: '[bɔɪ]',
    category: 'family',
    emoji: '👦',
    color: '#1E90FF',
    definitionEn: 'A young male child.',
    definitionUz: 'O‘g‘il bola — quvnoq va harakatchan kichik qahramon!',
    definitionRu: 'Юный мальчик, который любит приключения и подвижные игры!',
    uzbek: 'O‘g‘il bola',
    russian: 'Мальчик',
    exampleEn: 'The boy rides his bicycle quickly through the park.',
    exampleUz: 'O‘g‘il bola bog‘ bo‘ylab velosipedini tez haydab ketdi.',
    exampleRu: 'Мальчик быстро едет на велосипеде по парку.'
  },
  {
    id: 'girl',
    word: 'Girl',
    phonetic: '[ɡɜːl]',
    category: 'family',
    emoji: '👧',
    color: '#FF4757',
    definitionEn: 'A young female child.',
    definitionUz: 'Qiz bola — aqlli, quvnoq va mehribon qizaloq!',
    definitionRu: 'Юная девочка, которая любит учиться, смеяться и мечтать!',
    uzbek: 'Qiz bola',
    russian: 'Девочка',
    exampleEn: 'The girl draws a colorful picture of our happy school.',
    exampleUz: 'Qizaloq bizning quvnoq maktabimizning rangli rasmini chizdi.',
    exampleRu: 'Девочка нарисовала яркую картинку нашей весёлой школы.'
  },

  // =========================================================================
  // 5. NATURE & WEATHER (Tabiat va Ob-havo / Природа и Погода) - 10 Words
  // =========================================================================
  {
    id: 'moon',
    word: 'Moon',
    phonetic: '[muːn]',
    category: 'nature',
    emoji: '🌙',
    color: '#F1C40F',
    definitionEn: 'The bright circle that shines in the night sky.',
    definitionUz: 'Tungi osmonda kumushdek porlab nur sochuvchi go‘zal oy!',
    definitionRu: 'Серебристый светящийся круг на тёмном ночном небе!',
    uzbek: 'Oy',
    russian: 'Луна',
    exampleEn: 'The bright moon lights up the quiet night.',
    exampleUz: 'Yorqin oy sokin tunni nurga to‘ldiradi.',
    exampleRu: 'Яркая луна освещает тихую ночь.'
  },
  {
    id: 'rain',
    word: 'Rain',
    phonetic: '[reɪn]',
    category: 'nature',
    emoji: '🌧️',
    color: '#74B9FF',
    definitionEn: 'Water drops falling from clouds in the sky.',
    definitionUz: 'Osmondagi bulutlardan yerga tushadigan musaffo suv tomchilari!',
    definitionRu: 'Капельки чистой воды, падающие из облаков на землю!',
    uzbek: 'Yomg‘ir',
    russian: 'Дождь',
    exampleEn: 'Pitter-patter, the fresh rain washes the green garden.',
    exampleUz: 'Shivir-shivir, toza yomg‘ir yashil bog‘ni yuvmoqda.',
    exampleRu: 'Кап-кап, свежий дождик умывает зелёный сад.'
  },
  {
    id: 'tree',
    word: 'Tree',
    phonetic: '[triː]',
    category: 'nature',
    emoji: '🌳',
    color: '#27AE60',
    definitionEn: 'A tall plant with a wooden trunk and green leaves.',
    definitionUz: 'Yog‘och tanali, yam-yashil shoxlari bor baland o‘simlik!',
    definitionRu: 'Высокое растение с крепким стволом и зелёными листьями!',
    uzbek: 'Daraxt',
    russian: 'Дерево',
    exampleEn: 'Apples grow on the big green tree.',
    exampleUz: 'Katta yashil daraxtda mazali olmalar pishadi.',
    exampleRu: 'На большом зелёном дереве растут яблоки.'
  },
  {
    id: 'flower',
    word: 'Flower',
    phonetic: '[ˈflaʊ.ər]',
    category: 'nature',
    emoji: '🌸',
    color: '#FD79A8',
    definitionEn: 'A pretty, colorful, and sweet-smelling plant.',
    definitionUz: 'Bahorda ochiladigan, xushbo‘y hidli va juda go‘zal o‘simlik!',
    definitionRu: 'Прекрасное ароматное растение с яркими лепестками!',
    uzbek: 'Gul',
    russian: 'Цветок',
    exampleEn: 'The pink flower smells sweet and fresh.',
    exampleUz: 'Pushti gul juda xushbo‘y va mayin hid taratadi.',
    exampleRu: 'Розовый цветок пахнет сладко и свежо.'
  },
  {
    id: 'wind',
    word: 'Wind',
    phonetic: '[wɪnd]',
    category: 'nature',
    emoji: '💨',
    color: '#A4B0BE',
    definitionEn: 'Moving air that you can feel outside.',
    definitionUz: 'Havoning harakati — yuzimizga uriladigan yoqimli va salqin shabada!',
    definitionRu: 'Движение воздуха, которое мы чувствуем на прогулке!',
    uzbek: 'Shamol',
    russian: 'Ветер',
    exampleEn: 'The cool wind helps our kite fly very high.',
    exampleUz: 'Salqin shamol varragimizning baland uchishiga yordam beradi.',
    exampleRu: 'Прохладный ветерок помогает нашему змею взлететь высоко.'
  },
  {
    id: 'cloud',
    word: 'Cloud',
    phonetic: '[klaʊd]',
    category: 'nature',
    emoji: '☁️',
    color: '#CED6E0',
    definitionEn: 'White fluffy shapes floating in the sky.',
    definitionUz: 'Moviy osmonda suzib yuruvchi paxtadek oppoq va mayin shakllar!',
    definitionRu: 'Белые пушистые барашки, плывущие по синему небу!',
    uzbek: 'Bulut',
    russian: 'Облако',
    exampleEn: 'Look at that white fluffy cloud floating by!',
    exampleUz: 'Suzib o‘tayotgan anavi oppoq paxmoq bulutga qarang!',
    exampleRu: 'Посмотри на то белое пушистое облако в небе!'
  },
  {
    id: 'snow',
    word: 'Snow',
    phonetic: '[snəʊ]',
    category: 'nature',
    emoji: '❄️',
    color: '#70A1FF',
    definitionEn: 'Cold, soft white ice flakes falling in winter.',
    definitionUz: 'Qishda osmondan tushadigan oppoq, muzdek va mayin muz parchalari!',
    definitionRu: 'Мягкие белые снежинки, падающие с неба морозной зимой!',
    uzbek: 'Qor',
    russian: 'Снег',
    exampleEn: 'We love to play and make snowmen in the white snow.',
    exampleUz: 'Oppoq qorda o‘ynashni va qorbobo yasashni yaxshi ko‘ramiz.',
    exampleRu: 'Мы любим играть и лепить снеговика из белого снега.'
  },
  {
    id: 'sea',
    word: 'Sea',
    phonetic: '[siː]',
    category: 'nature',
    emoji: '🌊',
    color: '#00CEC9',
    definitionEn: 'A huge body of salty blue water.',
    definitionUz: 'To‘lqinlari jilvalanib turadigan ulkan va moviy suv havzasi!',
    definitionRu: 'Огромное водное пространство с синими солёными волнами!',
    uzbek: 'Dengiz',
    russian: 'Море',
    exampleEn: 'Dolphins jump high out of the deep blue sea.',
    exampleUz: 'Delfinlar moviy chuqur dengizdan baland sakraydi.',
    exampleRu: 'Дельфины высоко выпрыгивают из синего моря.'
  },
  {
    id: 'mountain',
    word: 'Mountain',
    phonetic: '[ˈmaʊn.tɪn]',
    category: 'nature',
    emoji: '🏔️',
    color: '#57606F',
    definitionEn: 'A very tall and high rocky land.',
    definitionUz: 'Cho‘qqilari osmonga qadalgan ulkan va baland qoyali tog‘!',
    definitionRu: 'Очень высокая каменная возвышенность с заснеженной вершиной!',
    uzbek: 'Tog‘',
    russian: 'Гора',
    exampleEn: 'The snow-capped mountain looks majestic in the morning.',
    exampleUz: 'Qorli cho‘qqili tog‘ ertalab juda mahobatli ko‘rinadi.',
    exampleRu: 'Заснеженная гора выглядит величественно утром.'
  },
  {
    id: 'river',
    word: 'River',
    phonetic: '[ˈrɪv.ər]',
    category: 'nature',
    emoji: '🏞️',
    color: '#0984E3',
    definitionEn: 'A long natural stream of flowing water.',
    definitionUz: 'Tog‘lardan boshlanib dengizga tomon shoshilib oqadigan toza suv oqimi!',
    definitionRu: 'Природный поток чистой воды, плавно текущий по земле!',
    uzbek: 'Daryo',
    russian: 'Река',
    exampleEn: 'The clear river flows peacefully through the green valley.',
    exampleUz: 'Musaffo daryo yashil vodiy bo‘ylab sokin oqadi.',
    exampleRu: 'Чистая река спокойно течёт через зелёную долину.'
  },

  // =========================================================================
  // 6. BODY PARTS (Tana a'zolari / Части тела) - 10 Words
  // =========================================================================
  {
    id: 'eye',
    word: 'Eye',
    phonetic: '[aɪ]',
    category: 'body',
    emoji: '👁️',
    color: '#00CEC9',
    definitionEn: 'The body part used for seeing things.',
    definitionUz: 'Rang-barang olamni, kamalakni va yaqinlarni ko‘rish uchun ko‘z!',
    definitionRu: 'Орган зрения, с помощью которого мы видим все краски мира!',
    uzbek: 'Ko‘z',
    russian: 'Глаз',
    exampleEn: 'Close your eyes and make a happy birthday wish!',
    exampleUz: 'Ko‘zlaringizni yuming va tug‘ilgan kun orzusini niyat qiling!',
    exampleRu: 'Закрой глаза и загадай заветное желание!'
  },
  {
    id: 'ear',
    word: 'Ear',
    phonetic: '[ɪər]',
    category: 'body',
    emoji: '👂',
    color: '#E17055',
    definitionEn: 'The body part used for hearing sounds.',
    definitionUz: 'Shirin musiqalar, qushlar sayrashi va so‘zlarni eshitadigan a’zo!',
    definitionRu: 'Орган слуха, с помощью которого мы слышим музыку и голоса друзей!',
    uzbek: 'Quloq',
    russian: 'Ухо',
    exampleEn: 'We hear sweet birds singing with our ears.',
    exampleUz: 'Quloqlarimiz bilan qushlarning sayrashini eshitamiz.',
    exampleRu: 'Мы слышим пение птичек своими ушками.'
  },
  {
    id: 'hand',
    word: 'Hand',
    phonetic: '[hænd]',
    category: 'body',
    emoji: '✋',
    color: '#F39C12',
    definitionEn: 'The end of your arm used for touching and holding.',
    definitionUz: 'Besh barmog‘i bor, ushlash, chizish va qarsak chalish uchun qulay qo‘l!',
    definitionRu: 'Часть тела, которой мы держим игрушки, рисуем и хлопаем в ладоши!',
    uzbek: 'Qo‘l',
    russian: 'Рука',
    exampleEn: 'Clap your hands together when you feel happy!',
    exampleUz: 'Xursand bo‘lganingizda quvnoq qarsak chaling!',
    exampleRu: 'Хлопай в ладоши, когда тебе весело!'
  },
  {
    id: 'foot',
    word: 'Foot',
    phonetic: '[fʊt]',
    category: 'body',
    emoji: '🦶',
    color: '#D63031',
    definitionEn: 'The bottom part of your leg used for walking.',
    definitionUz: 'Yurish, yugurish va sakrashda yordam beruvchi oyoq kafti!',
    definitionRu: 'Нижняя часть ножки, на которую мы наступаем при ходьбе!',
    uzbek: 'Oyoq',
    russian: 'Ступня',
    exampleEn: 'Stamp your feet to the joyful music beat!',
    exampleUz: 'Quvnoq musiqa sadolariga oyoqlaringiz bilan jo‘r bo‘ling!',
    exampleRu: 'Топай ножками в такт весёлой музыке!'
  },
  {
    id: 'nose',
    word: 'Nose',
    phonetic: '[nəʊz]',
    category: 'body',
    emoji: '👃',
    color: '#E84393',
    definitionEn: 'The part of your face used for smelling.',
    definitionUz: 'Xushbo‘y gullar, mevalar iforini hidlash va nafas olish a’zosi!',
    definitionRu: 'Часть лица, с помощью которой мы дышим и чувствуем ароматы!',
    uzbek: 'Burun',
    russian: 'Нос',
    exampleEn: 'I smell the fresh blossom with my little nose.',
    exampleUz: 'Yangi ochilgan gulni burnim bilan hidlayman.',
    exampleRu: 'Я чувствую аромат цветка своим носиком.'
  },
  {
    id: 'mouth',
    word: 'Mouth',
    phonetic: '[maʊθ]',
    category: 'body',
    emoji: '👄',
    color: '#FF7675',
    definitionEn: 'The body part used for eating and speaking.',
    definitionUz: 'Mazali taomlarni yeyish, chiroyli gapirish va kulish a’zosi!',
    definitionRu: 'Часть лица, с помощью которой мы кушаем, разговариваем и поём!',
    uzbek: 'Og‘iz',
    russian: 'Рот',
    exampleEn: 'Open your mouth and take a bite of the sweet red apple.',
    exampleUz: 'Og‘zingizni oching va shirin qizil olmadan tishlang.',
    exampleRu: 'Открой рот и откуси кусочек сладкого красного яблока.'
  },
  {
    id: 'head',
    word: 'Head',
    phonetic: '[hed]',
    category: 'body',
    emoji: '🗣️',
    color: '#6C5CE7',
    definitionEn: 'The top part of your body with hair and face.',
    definitionUz: 'Tananing eng yuqori, aqlli fikrlar tug‘iladigan va soch o‘sadigan qismi!',
    definitionRu: 'Верхняя часть тела, где находятся глазки, носик и умные мысли!',
    uzbek: 'Bosh',
    russian: 'Голова',
    exampleEn: 'Wear a warm woolen hat on your head in winter.',
    exampleUz: 'Qishda boshingizga issiq jun shapka kiying.',
    exampleRu: 'Зимой надевай тёплую шапку на голову.'
  },
  {
    id: 'smile_body',
    word: 'Smile',
    phonetic: '[smaɪl]',
    category: 'body',
    emoji: '😊',
    color: '#FDCB6E',
    definitionEn: 'A happy expression on your face.',
    definitionUz: 'Yuzdagi quvonchli, iliq va mehrli kulgi ifodasi!',
    definitionRu: 'Радостное доброе выражение лица, дарящее свет!',
    uzbek: 'Tabassum',
    russian: 'Улыбка',
    exampleEn: 'Her cheerful smile lit up the whole room.',
    exampleUz: 'Uning quvnoq tabassumi butun xonani yoritib yubordi.',
    exampleRu: 'Её весёлая улыбка озарила всю комнату.'
  },
  {
    id: 'hair',
    word: 'Hair',
    phonetic: '[heər]',
    category: 'body',
    emoji: '💇',
    color: '#A29BFE',
    definitionEn: 'The soft strands that grow on top of your head.',
    definitionUz: 'Boshimiz ustida o‘sadigan mayin tolalar!',
    definitionRu: 'Мягкие пряди, которые растут на голове!',
    uzbek: 'Soch',
    russian: 'Волосы',
    exampleEn: 'She brushes her soft brown hair every morning.',
    exampleUz: 'U har kuni ertalab mayin qo‘ng‘ir sochlarini taraydi.',
    exampleRu: 'Она расчёсывает свои мягкие волосы каждое утро.'
  },
  {
    id: 'heart_body',
    word: 'Heart',
    phonetic: '[hɑːt]',
    category: 'body',
    emoji: '🫀',
    color: '#D63031',
    definitionEn: 'The organ in your chest that pumps blood.',
    definitionUz: 'Ko‘krakda urib, butun tanaga hayot va quvvat yetkazib beruvchi a’zo!',
    definitionRu: 'Важный орган в груди, который ритмично бьётся: тук-тук!',
    uzbek: 'Yurak',
    russian: 'Сердце',
    exampleEn: 'My heart beats fast when I play active games.',
    exampleUz: 'Faol o‘yinlar o‘ynaganimda yuragim tez uradi.',
    exampleRu: 'Моё сердце бьётся быстрее, когда я весело бегаю.'
  },

  // =========================================================================
  // 7. SCHOOL & HOME (Maktab va Uy / Школа и Дом) - 10 Words
  // =========================================================================
  {
    id: 'book',
    word: 'Book',
    phonetic: '[bʊk]',
    category: 'school',
    emoji: '📖',
    color: '#4361EE',
    definitionEn: 'Pages with words and pictures to read and learn.',
    definitionUz: 'Sehrli ertaklar, qiziqarli bilimlar va rangli rasmlarga to‘la kitob!',
    definitionRu: 'Страницы со сказками, рассказами и яркими картинками!',
    uzbek: 'Kitob',
    russian: 'Книга',
    exampleEn: 'I love reading an exciting story book before sleep.',
    exampleUz: 'Uxlashdan oldin qiziqarli kitob o‘qishni yaxshi ko‘raman.',
    exampleRu: 'Я люблю читать интересную книгу перед сном.'
  },
  {
    id: 'pen',
    word: 'Pen',
    phonetic: '[pen]',
    category: 'school',
    emoji: '🖊️',
    color: '#2D3436',
    definitionEn: 'A tool filled with ink used for writing.',
    definitionUz: 'Siyoh bilan to‘ldirilgan, daftarga chiroyli so‘zlar yozadigan asbob!',
    definitionRu: 'Письменная принадлежность с чернилами для школы!',
    uzbek: 'Ruchka',
    russian: 'Ручка',
    exampleEn: 'Write your name neatly with a smooth blue pen.',
    exampleUz: 'Ko‘k ruchka bilan ismingizni chiroyli qilib yozing.',
    exampleRu: 'Аккуратно напиши своё имя синей ручкой.'
  },
  {
    id: 'pencil',
    word: 'Pencil',
    phonetic: '[ˈpen.səl]',
    category: 'school',
    emoji: '✏️',
    color: '#FF9E00',
    definitionEn: 'A wooden tool used for drawing or writing.',
    definitionUz: 'Daftarga so‘zlar yozish va chiroyli rasmlar chizish uchun yog‘och qalam!',
    definitionRu: 'Деревянная палочка с грифелем для рисования и письма!',
    uzbek: 'Qalam',
    russian: 'Карандаш',
    exampleEn: 'Sharpen your pencil to draw a cute little cat.',
    exampleUz: 'Mushukcha rasmini chizish uchun qalamingizni charxlang.',
    exampleRu: 'Заточи карандаш, чтобы нарисовать милого котика.'
  },
  {
    id: 'school',
    word: 'School',
    phonetic: '[skuːl]',
    category: 'school',
    emoji: '🏫',
    color: '#E74C3C',
    definitionEn: 'A fun place where kids learn from teachers.',
    definitionUz: 'Ustozlar bilan birga yangi bilimlarni o‘rganadigan quvnoq ziyo maskani!',
    definitionRu: 'Место, где дети учатся, заводят друзей и узнают много нового!',
    uzbek: 'Maktab',
    russian: 'Школа',
    exampleEn: 'We learn English and solve math puzzles at school.',
    exampleUz: 'Maktabda ingliz tilini o‘rganamiz va misollar yechamiz.',
    exampleRu: 'В школе мы учим английский и решаем задачки.'
  },
  {
    id: 'house',
    word: 'House',
    phonetic: '[haʊs]',
    category: 'school',
    emoji: '🏠',
    color: '#06D6A0',
    definitionEn: 'A building where a family lives together.',
    definitionUz: 'Oilangiz bilan birga yashaydigan shinam, issiq va baxtli uy!',
    definitionRu: 'Уютный дом, где ты счастливо живёшь со своей любимой семьёй!',
    uzbek: 'Uy',
    russian: 'Дом',
    exampleEn: 'Our house has a lovely garden with blooming flowers.',
    exampleUz: 'Bizning uyimizda gullar ekilgan chiroyli bog‘cha bor.',
    exampleRu: 'У нашего дома есть красивый сад с цветами.'
  },
  {
    id: 'room',
    word: 'Room',
    phonetic: '[ruːm]',
    category: 'school',
    emoji: '🛋️',
    color: '#8E44AD',
    definitionEn: 'A space inside a house with walls.',
    definitionUz: 'Uy ichidagi devorlar bilan ajratilgan qulay yashash xonasi!',
    definitionRu: 'Уютное пространство внутри дома со стенами и окнами!',
    uzbek: 'Xona',
    russian: 'Комната',
    exampleEn: 'My room is tidy and filled with colorful books.',
    exampleUz: 'Mening xonam ozoda va rang-barang kitoblarga to‘la.',
    exampleRu: 'Моя комната чистая и полна красочных книг.'
  },
  {
    id: 'table',
    word: 'Table',
    phonetic: '[ˈteɪ.bəl]',
    category: 'school',
    emoji: '🪵',
    color: '#D35400',
    definitionEn: 'A piece of furniture with legs used to put things on.',
    definitionUz: 'Ustida dars qilish, rasm chizish yoki ovqatlanish mumkin bo‘lgan mebel!',
    definitionRu: 'Мебель на ножках, за которой удобно заниматься и кушать!',
    uzbek: 'Stol',
    russian: 'Стол',
    exampleEn: 'Put your English notebook on the study table.',
    exampleUz: 'Ingliz tili daftaringizni dars stoliga qo‘ying.',
    exampleRu: 'Положи свою тетрадь по английскому на письменный стол.'
  },
  {
    id: 'chair',
    word: 'Chair',
    phonetic: '[tʃeər]',
    category: 'school',
    emoji: '🪑',
    color: '#27AE60',
    definitionEn: 'A seat with legs and a back support.',
    definitionUz: 'Suyanchig‘i bor, ustida qulay o‘tiriladigan o‘rindiq!',
    definitionRu: 'Удобное сиденье со спинкой и ножками для занятий!',
    uzbek: 'Stul',
    russian: 'Стул',
    exampleEn: 'Sit nicely on the chair and listen to the teacher.',
    exampleUz: 'Stulga chiroyli o‘tirib ustozni diqqat bilan tinglang.',
    exampleRu: 'Сядь аккуратно на стул и слушай учителя.'
  },
  {
    id: 'bag',
    word: 'Bag',
    phonetic: '[bæɡ]',
    category: 'school',
    emoji: '🎒',
    color: '#2980B9',
    definitionEn: 'A container used to carry school stuff or toys.',
    definitionUz: 'Kitob-daftarlarni solib, maktabga orqalab boriladigan qulay sumka!',
    definitionRu: 'Удобная сумка с ручками для учебников и школьных вещей!',
    uzbek: 'Sumka',
    russian: 'Портфель',
    exampleEn: 'My school bag has books, pencils, and a snack.',
    exampleUz: 'Maktab sumkamda kitoblar, qalamlar va yegulik bor.',
    exampleRu: 'В моём портфеле лежат книги, карандаши и яблоко.'
  },
  {
    id: 'computer',
    word: 'Computer',
    phonetic: '[kəmˈpjuː.tər]',
    category: 'school',
    emoji: '💻',
    color: '#2C3E50',
    definitionEn: 'An electronic screen used for work and games.',
    definitionUz: 'Ta’lim olish, o‘yinlar o‘ynash va dasturlash uchun mo‘ljallangan aqlli ekranli qurilma!',
    definitionRu: 'Электронное устройство с экраном для учёбы и полезных игр!',
    uzbek: 'Kompyuter',
    russian: 'Компьютер',
    exampleEn: 'We play interactive vocabulary games on the computer.',
    exampleUz: 'Kompyuterda qiziqarli so‘z o‘yinlarini o‘ynaymiz.',
    exampleRu: 'Мы играем в обучающие игры со словами на компьютере.'
  },

  // =========================================================================
  // 8. ACTIONS / VERBS (Harakatlar / Действия) - 10 Words
  // =========================================================================
  {
    id: 'run',
    word: 'Run',
    phonetic: '[rʌn]',
    category: 'actions',
    emoji: '🏃',
    color: '#FF7675',
    definitionEn: 'To move very fast on your feet.',
    definitionUz: 'Oyoqlar bilan chaqqon va tez olg‘a harakatlanish!',
    definitionRu: 'Очень быстро передвигаться на ножках!',
    uzbek: 'Yugurish',
    russian: 'Бегать',
    exampleEn: 'The children run fast across the green yard.',
    exampleUz: 'Bolalar yashil hovli bo‘ylab tez yugurishadi.',
    exampleRu: 'Дети быстро бегают по зелёному двору.'
  },
  {
    id: 'jump',
    word: 'Jump',
    phonetic: '[dʒʌmp]',
    category: 'actions',
    emoji: '🦘',
    color: '#55E6C1',
    definitionEn: 'To push yourself up off the ground into the air.',
    definitionUz: 'Yerdan yuqoriga, havoga qarab kuch bilan ko‘tarilish!',
    definitionRu: 'Отталкиваться ножками от земли и взлетать вверх!',
    uzbek: 'Sakrash',
    russian: 'Прыгать',
    exampleEn: 'Can you jump as high as a playful kangaroo?',
    exampleUz: 'Sho‘x kengurudek baland sakray olasizmi?',
    exampleRu: 'Ты можешь подпрыгнуть так же высоко, как кенгуру?'
  },
  {
    id: 'read',
    word: 'Read',
    phonetic: '[riːd]',
    category: 'actions',
    emoji: '📖',
    color: '#58B19F',
    definitionEn: 'To look at written words and understand them.',
    definitionUz: 'Kitobdagi yozuvlarga qarab, ularning ma’nosini tushunish va zavqlanish!',
    definitionRu: 'Смотреть на буквы и понимать интересные истории!',
    uzbek: 'O‘qish',
    russian: 'Читать',
    exampleEn: 'I love to read new English words every day.',
    exampleUz: 'Har kuni yangi inglizcha so‘zlarni o‘qishni yaxshi ko‘raman.',
    exampleRu: 'Я люблю читать новые английские слова каждый день.'
  },
  {
    id: 'write',
    word: 'Write',
    phonetic: '[raɪt]',
    category: 'actions',
    emoji: '✍️',
    color: '#E71A64',
    definitionEn: 'To make letters or words with a pen or pencil.',
    definitionUz: 'Qalam yoki ruchka bilan daftarga harflar va so‘zlar tushirish!',
    definitionRu: 'Выводить буквы и слова ручкой или карандашом в тетрадке!',
    uzbek: 'Yozish',
    russian: 'Писать',
    exampleEn: 'Write your answers neatly with your favorite pencil.',
    exampleUz: 'Javoblaringizni sevimli qalamingiz bilan chiroyli qilib yozing.',
    exampleRu: 'Аккуратно напиши ответы своим любимым карандашом.'
  },
  {
    id: 'sleep',
    word: 'Sleep',
    phonetic: '[sliːp]',
    category: 'actions',
    emoji: '😴',
    color: '#1B9CFC',
    definitionEn: 'To rest your body and mind with eyes closed at night.',
    definitionUz: 'Kechasi ko‘zlarni yumib, tanaga va miyaga orom berish!',
    definitionRu: 'Закрывать глазки ночью и видеть сладкие волшебные сны!',
    uzbek: 'Uxlash',
    russian: 'Спать',
    exampleEn: 'Sleep well and have sweet dreams of stars and rockets.',
    exampleUz: 'Yaxshi uxlang va yulduzlaru raketalar haqida shirin tushlar ko‘ring.',
    exampleRu: 'Спи крепко и пусть тебе снятся звёзды и ракеты.'
  },
  {
    id: 'eat',
    word: 'Eat',
    phonetic: '[iːt]',
    category: 'actions',
    emoji: '🍽️',
    color: '#F368E0',
    definitionEn: 'To chew and swallow delicious food.',
    definitionUz: 'Mazali taom yoki mevalarni chaynash va tanovul qilish!',
    definitionRu: 'С аппетитом кушать полезную и вкусную еду!',
    uzbek: 'Yeyish',
    russian: 'Есть',
    exampleEn: 'We eat fresh crunchy apples for a healthy snack.',
    exampleUz: 'Sog‘lom tamaddi uchun qarsildoq yangi olmalarni yeymiz.',
    exampleRu: 'Мы кушаем свежие хрустящие яблочки на полдник.'
  },
  {
    id: 'drink',
    word: 'Drink',
    phonetic: '[drɪŋk]',
    category: 'actions',
    emoji: '🧃',
    color: '#0ABDE3',
    definitionEn: 'To swallow liquid like water or milk.',
    definitionUz: 'Suv, sut yoki sharbat kabi ichimliklarni qabul qilish!',
    definitionRu: 'Пить чистую воду, сок или тёплое молоко!',
    uzbek: 'Ichish',
    russian: 'Пить',
    exampleEn: 'Drink a glass of warm milk before going to bed.',
    exampleUz: 'Yotishdan oldin bir stakan iliq sut iching.',
    exampleRu: 'Выпей стакан тёплого молока перед сном.'
  },
  {
    id: 'play',
    word: 'Play',
    phonetic: '[pleɪ]',
    category: 'actions',
    emoji: '🎮',
    color: '#10AC84',
    definitionEn: 'To have fun doing activities or playing games.',
    definitionUz: 'Do‘stlar bilan turli qiziqarli o‘yinlar o‘ynab vaqtni maroqli o‘tkazish!',
    definitionRu: 'Весело проводить время, играя с игрушками или друзьями!',
    uzbek: 'O‘ynash',
    russian: 'Играть',
    exampleEn: 'Let’s play a fun vocabulary quiz together!',
    exampleUz: 'Keling, birgalikda quvnoq so‘zlar viktorinasini o‘ynaymiz!',
    exampleRu: 'Давай вместе сыграем в весёлую викторину со словами!'
  },
  {
    id: 'sing',
    word: 'Sing',
    phonetic: '[sɪŋ]',
    category: 'actions',
    emoji: '🎤',
    color: '#EE5253',
    definitionEn: 'To make musical sounds with your voice.',
    definitionUz: 'Ovoz orqali yoqimli ohang va musiqiy so‘zlar taratish!',
    definitionRu: 'Издавать красивые музыкальные звуки звонким голоском!',
    uzbek: 'Ashula aytish',
    russian: 'Петь',
    exampleEn: 'We sing the cheerful English alphabet song in class.',
    exampleUz: 'Darsda quvnoq ingliz alifbosi qo‘shig‘ini kuylaymiz.',
    exampleRu: 'Мы поём весёлую песенку английского алфавита на уроке.'
  },
  {
    id: 'smile_verb',
    word: 'Smile',
    phonetic: '[smaɪl]',
    category: 'actions',
    emoji: '😊',
    color: '#FF9F43',
    definitionEn: 'To look happy by opening your lips.',
    definitionUz: 'Xursand bo‘lganda lablarni ochib tabassum qilish!',
    definitionRu: 'Радостно улыбаться, выражая счастье и доброту!',
    uzbek: 'Jilmayish',
    russian: 'Улыбаться',
    exampleEn: 'Always smile when you greet your friends!',
    exampleUz: 'Do‘stlaringiz bilan ko‘rishganda doimo jilmayib qo‘ying!',
    exampleRu: 'Всегда улыбайся, когда здороваешься с друзьями!'
  },

  // =========================================================================
  // 9. CLOTHES & TOYS (Kiyimlar va O'yinchoqlar / Одежда и Игрушки) - 10 Words
  // =========================================================================
  {
    id: 'ball',
    word: 'Ball',
    phonetic: '[bɔːl]',
    category: 'clothes',
    emoji: '⚽',
    color: '#2ED573',
    definitionEn: 'A round object used in games like football.',
    definitionUz: 'Futbol va o‘yinlarda tepiladigan, dumaloq va sakrovchi o‘yinchoq!',
    definitionRu: 'Круглый упругий предмет для футбола и весёлых игр!',
    uzbek: 'Koptok',
    russian: 'Мяч',
    exampleEn: 'Kick the soccer ball right into the goal!',
    exampleUz: 'To‘pni to‘g‘ri darvozaga qarab teping!',
    exampleRu: 'Пни футбольный мяч прямо в ворота!'
  },
  {
    id: 'doll',
    word: 'Doll',
    phonetic: '[dɒl]',
    category: 'clothes',
    emoji: '🪆',
    color: '#FD79A8',
    definitionEn: 'A toy that looks like a small baby or person.',
    definitionUz: 'Kichik qizaloq yoki odamcha shaklidagi yoqimtoy o‘yinchoq!',
    definitionRu: 'Красивая игрушка в виде маленькой девочки или принцессы!',
    uzbek: 'Qo‘g‘irchoq',
    russian: 'Кукла',
    exampleEn: 'The girl dresses her favorite doll in a pink skirt.',
    exampleUz: 'Qizaloq sevimli qo‘g‘irchog‘iga pushti yubka kiydirdi.',
    exampleRu: 'Девочка наряжает любимую куклу в розовую юбочку.'
  },
  {
    id: 'car',
    word: 'Car',
    phonetic: '[kɑːr]',
    category: 'clothes',
    emoji: '🚗',
    color: '#E74C3C',
    definitionEn: 'A motor vehicle with four wheels.',
    definitionUz: 'To‘rtta g‘ildiragi bor, yo‘llarda yuradigan qulay transport vositasi!',
    definitionRu: 'Транспортное средство на четырёх колёсах, на котором мы ездим!',
    uzbek: 'Mashina',
    russian: 'Машина',
    exampleEn: 'The shiny red toy car zooms across the carpet.',
    exampleUz: 'Yaltiroq qizil o‘yinchoq mashina gilam uzra tez yurib ketdi.',
    exampleRu: 'Блестящая красная машинка мчится по ковру.'
  },
  {
    id: 'hat',
    word: 'Hat',
    phonetic: '[hæt]',
    category: 'clothes',
    emoji: '👒',
    color: '#F39C12',
    definitionEn: 'Something you wear on your head for sun protection.',
    definitionUz: 'Quyoshdan himoyalanish yoki isinish uchun boshga kiyiladigan kiyim!',
    definitionRu: 'Головной убор для защиты от солнца или холода!',
    uzbek: 'Shapka',
    russian: 'Шапка',
    exampleEn: 'Wear a bright sun hat when playing on the beach.',
    exampleUz: 'Plyajda o‘ynaganda yorqin quyosh shapkasini kiying.',
    exampleRu: 'Надевай панамку от солнца, когда играешь на пляже.'
  },
  {
    id: 'shoes',
    word: 'Shoes',
    phonetic: '[ʃuːz]',
    category: 'clothes',
    emoji: '👟',
    color: '#3498DB',
    definitionEn: 'What you wear on your feet to walk outside.',
    definitionUz: 'Ko‘chada qulay va xavfsiz yurish uchun oyoqqa kiyiladigan poyabzal!',
    definitionRu: 'Обувь, которую мы надеваем на ножки для прогулок!',
    uzbek: 'Oyoq kiyim',
    russian: 'Обувь',
    exampleEn: 'Tie your shoelaces before you start running.',
    exampleUz: 'Yugurishni boshlashdan oldin poyabzal bog‘ichlarini bog‘lang.',
    exampleRu: 'Завяжи шнурки на обуви перед тем, как побежать.'
  },
  {
    id: 'shirt',
    word: 'Shirt',
    phonetic: '[ʃɜːt]',
    category: 'clothes',
    emoji: '👕',
    color: '#1ABC9C',
    definitionEn: 'A piece of clothing worn on the upper body.',
    definitionUz: 'Badanning yuqori qismiga kiyiladigan tugmali yoki qulay kiyim!',
    definitionRu: 'Одежда для верхней части тела с воротничком или пуговицами!',
    uzbek: 'Ko‘ylak',
    russian: 'Рубашка',
    exampleEn: 'He wears a neat white shirt on the first day of school.',
    exampleUz: 'U maktabning birinchi kunida oppoq chiroyli ko‘ylak kiyib keldi.',
    exampleRu: 'Он надел чистую белую рубашку в первый день школы.'
  },
  {
    id: 'robot',
    word: 'Robot',
    phonetic: '[ˈrəʊ.bɒt]',
    category: 'clothes',
    emoji: '🤖',
    color: '#00CEC9',
    definitionEn: 'A cool mechanical machine that moves.',
    definitionUz: 'Harakatlanuvchi, ko‘zlari miltillovchi aqlli mexanik apparat!',
    definitionRu: 'Крутая механическая машина, которая умеет двигаться и мигать огоньками!',
    uzbek: 'Robot',
    russian: 'Робот',
    exampleEn: 'AstroBot is our super smart robot buddy!',
    exampleUz: 'AstroBot — bizning o‘ta aqlli robot do‘stimiz!',
    exampleRu: 'АстроБот — наш супер-умный друг-робот!'
  },
  {
    id: 'balloon',
    word: 'Balloon',
    phonetic: '[bəˈluːn]',
    category: 'clothes',
    emoji: '🎈',
    color: '#E84393',
    definitionEn: 'A brightly colored rubber bag filled with air.',
    definitionUz: 'Ichiga havo to‘ldirilgan, havoda yengil uchadigan yorqin rezina shar!',
    definitionRu: 'Яркий резиновый шарик, наполненный воздухом, который легко летает!',
    uzbek: 'Shar',
    russian: 'Шарик',
    exampleEn: 'The red balloon floats gently up to the clouds.',
    exampleUz: 'Qizil shar bulutlar tomon mayin suzib bormoqda.',
    exampleRu: 'Красный воздушный шарик плавно летит к облакам.'
  },
  {
    id: 'bike',
    word: 'Bike',
    phonetic: '[baɪk]',
    category: 'clothes',
    emoji: '🚲',
    color: '#6C5CE7',
    definitionEn: 'A vehicle with two wheels that you pedal.',
    definitionUz: 'Pedallarini aylantirib sayr qilinadigan ikki g‘ildirakli velosiped!',
    definitionRu: 'Двухколёсный транспорт, который едет, когда крутишь педали ногами!',
    uzbek: 'Velosiped',
    russian: 'Велосипед',
    exampleEn: 'I ride my blue bike happily around the park path.',
    exampleUz: 'Park yo‘lkasida ko‘k velosipedimni maroq bilan haydayman.',
    exampleRu: 'Я весело катаюсь на синем велосипеде по дорожке в парке.'
  },
  {
    id: 'kite',
    word: 'Kite',
    phonetic: '[kaɪt]',
    category: 'clothes',
    emoji: '🪁',
    color: '#E17055',
    definitionEn: 'A light toy that flies high in the wind.',
    definitionUz: 'Shamol esganda osmonga uchiriladigan ipli quvnoq varrak!',
    definitionRu: 'Лёгкая игрушка на ниточке, которая высоко летает в ветреную погоду!',
    uzbek: 'Varrak',
    russian: 'Воздушный змей',
    exampleEn: 'The colorful kite dances in the sunny spring wind.',
    exampleUz: 'Rang-barang varrak quyoshli bahor shamolida raqs tushadi.',
    exampleRu: 'Красочный воздушный змей танцует на весеннем ветру.'
  },

  // =========================================================================
  // 10. SPACE & TIME (Koinot va Vaqt / Космос и Время) - 10 Words
  // =========================================================================
  {
    id: 'rocket',
    word: 'Rocket',
    phonetic: '[ˈrɒk.ɪt]',
    category: 'space',
    emoji: '🚀',
    color: '#FF4757',
    definitionEn: 'A fast vehicle that flies high into outer space.',
    definitionUz: 'Olov purkab, yulduzlar va koinot tomon uchadigan tezkor fazo kemasi!',
    definitionRu: 'Быстрый космический корабль, который устремляется высоко к звёздам!',
    uzbek: 'Raketa',
    russian: 'Ракета',
    exampleEn: '3, 2, 1... the rocket blasts off into the starry space!',
    exampleUz: '3, 2, 1... raketa yulduzli koinotga qarab parvoz qildi!',
    exampleRu: '3, 2, 1... ракета взлетает в звёздный космос!'
  },
  {
    id: 'planet',
    word: 'Planet',
    phonetic: '[ˈplæn.ɪt]',
    category: 'space',
    emoji: '🪐',
    color: '#FFA502',
    definitionEn: 'A large round body in space, like Earth.',
    definitionUz: 'Quyosh atrofida aylanuvchi ulkan dumaloq koinot sayyorasi!',
    definitionRu: 'Большое круглое космическое тело, вращающееся вокруг звезды!',
    uzbek: 'Planeta',
    russian: 'Планета',
    exampleEn: 'Saturn is a wonderful planet with glowing dust rings.',
    exampleUz: 'Saturn — aylanma chang halqalari bor ajoyib sayyora.',
    exampleRu: 'Сатурн — удивительная планета со светящимися кольцами.'
  },
  {
    id: 'day',
    word: 'Day',
    phonetic: '[deɪ]',
    category: 'space',
    emoji: '🌅',
    color: '#F1C40F',
    definitionEn: 'The time when the sun is shining outside.',
    definitionUz: 'Quyosh chiqib turgan, o‘ynash va dars qilish uchun yorug‘ vaqt!',
    definitionRu: 'Светлое время суток, когда светит солнышко и можно гулять!',
    uzbek: 'Kun',
    russian: 'День',
    exampleEn: 'Have a bright, sunny, and wonderful day today!',
    exampleUz: 'Bugungi kuningiz yorqin, quyoshli va ajoyib o‘tsin!',
    exampleRu: 'Пусть твой день сегодня будет солнечным и чудесным!'
  },
  {
    id: 'night',
    word: 'Night',
    phonetic: '[naɪt]',
    category: 'space',
    emoji: '🌃',
    color: '#2C3E50',
    definitionEn: 'The dark time of the day when the moon is out.',
    definitionUz: 'Oy va yulduzlar chiqadigan, orom olib uxlaydigan qorong‘u vaqt!',
    definitionRu: 'Тёмное время суток, когда на небе светят луна и звёзды!',
    uzbek: 'Tun',
    russian: 'Ночь',
    exampleEn: 'Millions of stars twinkle in the dark night sky.',
    exampleUz: 'Qorong‘u tungi osmonda millionlab yulduzlar miltillaydi.',
    exampleRu: 'Миллионы звёздочек мерцают на тёмном ночном небе.'
  },
  {
    id: 'clock_time',
    word: 'Clock',
    phonetic: '[klɒk]',
    category: 'space',
    emoji: '⏰',
    color: '#E74C3C',
    definitionEn: 'A device that shows us the exact time.',
    definitionUz: 'Vaqtni ko‘rsatib, daqiqa va soatlarni hisoblab turuvchi asbob!',
    definitionRu: 'Прибор со стрелочками, который показывает точное время!',
    uzbek: 'Soat',
    russian: 'Часы',
    exampleEn: 'The clock on the wall ticks cheerfully: tick-tock!',
    exampleUz: 'Devordagi soat quvnoq ishlamoqda: chipt-chipt!',
    exampleRu: 'Часики на стене весело тикают: тик-так!'
  },
  {
    id: 'space',
    word: 'Space',
    phonetic: '[speɪs]',
    category: 'space',
    emoji: '🌌',
    color: '#341F97',
    definitionEn: 'The vast area beyond the Earth\'s atmosphere.',
    definitionUz: 'Yer sayyorasidan tashqaridagi barcha yulduz va galaktikalar joylashgan cheksiz olam!',
    definitionRu: 'Бескрайнее пространство за пределами Земли с миллионами звёзд!',
    uzbek: 'Koinot',
    russian: 'Космос',
    exampleEn: 'Astronauts float weightlessly in deep space.',
    exampleUz: 'Fazogirlar cheksiz koinotda vaznsizlikda suzishadi.',
    exampleRu: 'Космонавты плавают в невесомости в открытом космосе.'
  },
  {
    id: 'earth',
    word: 'Earth',
    phonetic: '[ɜːθ]',
    category: 'space',
    emoji: '🌍',
    color: '#2ED573',
    definitionEn: 'The green and blue planet we all live on.',
    definitionUz: 'Biz barchamiz yashaydigan, suvlari moviy va o‘rmonlari yashil go‘zal ona sayyora!',
    definitionRu: 'Наш общий зелёно-голубой дом — планета, на которой мы все живём!',
    uzbek: 'Yer',
    russian: 'Земля',
    exampleEn: 'Planet Earth is our precious blue and green home.',
    exampleUz: 'Yer sayyorasi — bizning qadrli moviy va yashil uyimizdir.',
    exampleRu: 'Планета Земля — наш драгоценный зелёно-голубой дом.'
  },
  {
    id: 'sun_space',
    word: 'Sun',
    phonetic: '[sʌn]',
    category: 'space',
    emoji: '☀️',
    color: '#FFA502',
    definitionEn: 'The big hot star that gives light to Earth.',
    definitionUz: 'Yerga yorug‘lik va hayot bag‘ishlovchi koinotdagi ulkan issiq yulduz!',
    definitionRu: 'Огромная горячая звезда в космосе, дарящая жизнь и тепло Земле!',
    uzbek: 'Quyosh',
    russian: 'Солнце',
    exampleEn: 'The bright Sun shines warmly upon the solar system.',
    exampleUz: 'Yorqin Quyosh butun quyosh tizimiga mehr bilan nur sochadi.',
    exampleRu: 'Яркое Солнце тепло согревает всю нашу солнечную систему.'
  },
  {
    id: 'time',
    word: 'Time',
    phonetic: '[taɪm]',
    category: 'space',
    emoji: '⏳',
    color: '#1E90FF',
    definitionEn: 'Measured in hours, minutes, and seconds.',
    definitionUz: 'Soatlar, daqiqalar va soniyalar bilan o‘lchanadigan fursat!',
    definitionRu: 'То, что измеряется часами, минутами и секундами!',
    uzbek: 'Vaqt',
    russian: 'Время',
    exampleEn: 'It is time for our fun English adventure!',
    exampleUz: 'Quvnoq ingliz tili sarguzashtimiz vaqti keldi!',
    exampleRu: 'Пришло время для нашего весёлого урока английского языка!'
  },
  {
    id: 'morning',
    word: 'Morning',
    phonetic: '[ˈmɔː.nɪŋ]',
    category: 'space',
    emoji: '🌅',
    color: '#FF9FF3',
    definitionEn: 'The early part of the day when you wake up.',
    definitionUz: 'Quyosh endi chiqib, uyqudan uyg‘onadigan kunning eng go‘zal boshlanishi!',
    definitionRu: 'Начало нового дня, когда ты просыпаешься с улыбкой!',
    uzbek: 'Ertalab',
    russian: 'Утро',
    exampleEn: 'Good morning! Let us explore new words today!',
    exampleUz: 'Xayrli tong! Keling, bugun yangi so‘zlarni kashf qilamiz!',
    exampleRu: 'Доброе утро! Давай откроем новые интересные слова сегодня!'
  }
];

// --- GRAMMAR LESSONS (Grammatika Saboqlari) ---
const GRAMMAR_LESSONS = [
  {
    id: 'lesson-a-an',
    badge: 'Magic Vowels',
    titleEn: 'Articles: A vs. An',
    titleUz: 'Artikllar: A va An qoidasi',
    titleRu: 'Артикли: Правило A и An',
    summaryEn: 'How to use "A" and "An" before words like a superhero!',
    summaryUz: 'So‘zlar oldidan "A" yoki "An" qo‘yishning sehrli siri!',
    summaryRu: 'Как использовать "A" и "An" перед словами, как настоящий супергерой!',
    icon: '🪄',
    color: '#FF6B8B',
    explanationEn: `
      <div class="rule-box">
        <h4>🌟 The Golden Secret:</h4>
        <p>Use <strong>AN</strong> when the word starts with a <strong>Vowel sound</strong>: <span class="vowel-badge">A</span>, <span class="vowel-badge">E</span>, <span class="vowel-badge">I</span>, <span class="vowel-badge">O</span>, <span class="vowel-badge">U</span>!</p>
        <p>Use <strong>A</strong> with all other letters (Consonants)!</p>
      </div>
    `,
    explanationUz: `
      <div class="rule-box">
        <h4>🌟 Oltin Qoida:</h4>
        <p>Agar so‘z <strong>Unli tovush</strong> bilan boshlansa: <strong>A, E, I, O, U</strong> — oldiga <strong>AN</strong> qo‘yiladi!</p>
        <p>Qolgan barcha undosh harflar bilan boshlangan so‘zlarga esa <strong>A</strong> qo‘yiladi.</p>
      </div>
    `,
    explanationRu: `
      <div class="rule-box">
        <h4>🌟 Золотое правило:</h4>
        <p>Если слово начинается с <strong>Гласного звука</strong>: <span class="vowel-badge">A</span>, <span class="vowel-badge">E</span>, <span class="vowel-badge">I</span>, <span class="vowel-badge">O</span>, <span class="vowel-badge">U</span> — перед ним ставится <strong>AN</strong>!</p>
        <p>Перед всеми остальными согласными буквами ставится <strong>A</strong>.</p>
      </div>
    `,
    examples: [
      { text: 'an Apple', icon: '🍎', rule: 'Starts with vowel "A"' },
      { text: 'an Elephant', icon: '🐘', rule: 'Starts with vowel "E"' },
      { text: 'an Umbrella', icon: '☂️', rule: 'Starts with vowel "U"' },
      { text: 'a Cat', icon: '🐱', rule: 'Starts with consonant "C"' },
      { text: 'a Dog', icon: '🐶', rule: 'Starts with consonant "D"' },
      { text: 'a Book', icon: '📖', rule: 'Starts with consonant "B"' }
    ],
    interactiveTest: {
      question: 'Which article goes before "__ Orange"?',
      options: ['A', 'An'],
      correct: 1,
      explanation: 'Orange starts with the vowel "O", so we say "An Orange"!'
    }
  },
  {
    id: 'lesson-to-be',
    badge: 'Super Friends',
    titleEn: 'Verb "To Be": Am, Is, Are',
    titleUz: '"To Be" fe’li: Am, Is, Are',
    titleRu: 'Глагол "To Be": Am, Is, Are',
    summaryEn: 'Match the pronouns with their best friend verbs!',
    summaryUz: 'Olmoshlarni o‘zining eng yaqin do‘st fe’llari bilan juftlang!',
    summaryRu: 'Подберите местоимения к их лучшим друзьям — глаголам!',
    icon: '🤝',
    color: '#06D6A0',
    explanationEn: `
      <div class="rule-box">
        <h4>🌟 Friendship Formula:</h4>
        <div class="friend-group">
          <span class="bubble"><strong>I</strong> ➜ <strong>AM</strong> (I am happy 😊)</span>
          <span class="bubble"><strong>He / She / It</strong> ➜ <strong>IS</strong> (She is smart 💡)</span>
          <span class="bubble"><strong>You / We / They</strong> ➜ <strong>ARE</strong> (We are friends 🌟)</span>
        </div>
      </div>
    `,
    explanationUz: `
      <div class="rule-box">
        <h4>🌟 Do‘stlik formulasi:</h4>
        <div class="friend-group">
          <span class="bubble"><strong>I</strong> (Men) ➜ <strong>AM</strong> (I am a student)</span>
          <span class="bubble"><strong>He / She / It</strong> (U) ➜ <strong>IS</strong> (He is a doctor)</span>
          <span class="bubble"><strong>You / We / They</strong> (Siz/Biz/Ular) ➜ <strong>ARE</strong> (We are ready)</span>
        </div>
      </div>
    `,
    explanationRu: `
      <div class="rule-box">
        <h4>🌟 Формула дружбы:</h4>
        <div class="friend-group">
          <span class="bubble"><strong>I</strong> (Я) ➜ <strong>AM</strong> (I am happy 😊)</span>
          <span class="bubble"><strong>He / She / It</strong> (Он/Она/Оно) ➜ <strong>IS</strong> (She is smart 💡)</span>
          <span class="bubble"><strong>You / We / They</strong> (Ты/Мы/Они) ➜ <strong>ARE</strong> (We are friends 🌟)</span>
        </div>
      </div>
    `,
    examples: [
      { text: 'I AM happy', icon: '😊', rule: 'I pairs with AM' },
      { text: 'She IS funny', icon: '👧', rule: 'She pairs with IS' },
      { text: 'It IS a sunny day', icon: '☀️', rule: 'It pairs with IS' },
      { text: 'We ARE champions', icon: '🏆', rule: 'We pairs with ARE' }
    ],
    interactiveTest: {
      question: 'Complete the sentence: "We ____ good friends!"',
      options: ['am', 'is', 'are'],
      correct: 2,
      explanation: 'We always pairs with ARE! "We are good friends!"'
    }
  },
  {
    id: 'lesson-plurals',
    badge: 'One & Many',
    titleEn: 'Plural Nouns (-s and -es)',
    titleUz: 'Ko‘plik qo‘shimchalari (-s va -es)',
    titleRu: 'Множественное число (-s и -es)',
    summaryEn: 'Turn one single toy into many magical toys!',
    summaryUz: 'Bitta narsani ko‘p narsaga aylantirish sehrini bilasizmi?',
    summaryRu: 'Превратите одну игрушку во множество волшебных игрушек!',
    icon: '✨',
    color: '#48CAE4',
    explanationEn: `
      <div class="rule-box">
        <h4>🌟 The Magic Wand Rule:</h4>
        <p>To turn <strong>1 thing</strong> into <strong>2 or more things</strong>, simply add an <strong>-s</strong> at the end!</p>
        <p>If the word ends in <em>ch, sh, s, x, z</em>, add <strong>-es</strong>!</p>
      </div>
    `,
    explanationUz: `
      <div class="rule-box">
        <h4>🌟 Sehrli tayoqcha qoidasi:</h4>
        <p>Bitta narsani ko‘p qilish uchun so‘z oxiriga <strong>-s</strong> qo‘shamiz: Cat (1 ta mushuk) ➜ Cats (Ko‘p mushuklar).</p>
        <p>Agar so‘z <em>-sh, -ch, -s, -x</em> bilan tugasa, <strong>-es</strong> qo‘shamiz: Box ➜ Boxes!</p>
      </div>
    `,
    explanationRu: `
      <div class="rule-box">
        <h4>🌟 Правило волшебной палочки:</h4>
        <p>Чтобы сделать из <strong>1 предмета</strong> <strong>много предметов</strong>, просто добавьте в конце <strong>-s</strong>!</p>
        <p>Если слово оканчивается на <em>ch, sh, s, x, z</em>, добавляем <strong>-es</strong>!</p>
      </div>
    `,
    examples: [
      { text: '1 Cat 🐱 ➜ 3 Cats 🐱🐱🐱', icon: '🐾', rule: 'Add -s' },
      { text: '1 Apple 🍎 ➜ 4 Apples 🍎🍎🍎🍎', icon: '🍏', rule: 'Add -s' },
      { text: '1 Box 📦 ➜ 2 Boxes 📦📦', icon: '🎁', rule: 'Ends with X ➜ add -es' },
      { text: '1 Watch ⌚ ➜ 2 Watches ⌚⌚', icon: '⏰', rule: 'Ends with CH ➜ add -es' }
    ],
    interactiveTest: {
      question: 'What is the plural of "Book"?',
      options: ['Bookes', 'Books', 'Bookies'],
      correct: 1,
      explanation: 'Just add -s! 1 Book ➜ 5 Books 📚'
    }
  },
  {
    id: 'lesson-present-simple',
    badge: 'Super Habits',
    titleEn: 'Daily Actions: Present Simple',
    titleUz: 'Har kungi odatlar: Present Simple',
    titleRu: 'Простое настоящее время: Действия',
    summaryEn: 'Talk about what you do every sunny day!',
    summaryUz: 'Har kuni bajaradigan ajoyib ishlar haqida gapiring!',
    summaryRu: 'Расскажите о том, что вы делаете каждый день!',
    icon: '⚽',
    color: '#FFD166',
    explanationEn: `
      <div class="rule-box">
        <h4>🌟 Daily Routine Secret:</h4>
        <p>For <strong>I, You, We, They</strong> ➜ Use the simple action: <em>"I play soccer!"</em></p>
        <p>For <strong>He, She, It</strong> ➜ The action gets an <strong>-s</strong>: <em>"He play<strong>s</strong> soccer!"</em></p>
      </div>
    `,
    explanationUz: `
      <div class="rule-box">
        <h4>🌟 Har kungi ishlar siri:</h4>
        <p><strong>I, You, We, They</strong> uchun fe’l o‘zgarmaydi: <em>"I read books"</em> (Men kitob o‘qiyman).</p>
        <p><strong>He, She, It</strong> bo‘lganda esa fe’l oxiriga <strong>-s</strong> qo‘shiladi: <em>"He read<strong>s</strong> books"</em>!</p>
      </div>
    `,
    explanationRu: `
      <div class="rule-box">
        <h4>🌟 Секрет ежедневных действий:</h4>
        <p>Для <strong>I, You, We, They</strong> ➜ глагол не меняется: <em>"I play soccer!"</em> (Я играю в футбол).</p>
        <p>Для <strong>He, She, It</strong> ➜ к действию прибавляется буква <strong>-s</strong>: <em>"He play<strong>s</strong> soccer!"</em></p>
      </div>
    `,
    examples: [
      { text: 'I eat sweet apples', icon: '😋', rule: 'I eat (no -s)' },
      { text: 'She eats sweet apples', icon: '👧', rule: 'She eats (add -s)' },
      { text: 'They run in the park', icon: '🏃', rule: 'They run' },
      { text: 'He runs very fast', icon: '⚡', rule: 'He runs (add -s)' }
    ],
    interactiveTest: {
      question: 'Choose the correct action: "The lion ____ loudly!"',
      options: ['roars', 'roar', 'roaring'],
      correct: 0,
      explanation: 'The lion is "It", so it takes an -s! "The lion roars loudly!"'
    }
  }
];

// --- INTERACTIVE EXERCISES DATA ---
const QUIZ_QUESTIONS = [
  {
    id: 1,
    questionEn: 'Which animal is the king of the jungle?',
    questionUz: 'Qaysi hayvon o‘rmon qiroli hisoblanadi?',
    questionRu: 'Какое животное является царём зверей?',
    imageEmoji: '👑',
    options: [
      { text: 'Rabbit 🐰', correct: false },
      { text: 'Lion 🦁', correct: true },
      { text: 'Penguin 🐧', correct: false },
      { text: 'Monkey 🐒', correct: false }
    ],
    hint: 'It has a big glorious mane and roars loud!'
  },
  {
    id: 2,
    questionEn: 'What is the English word for "Olma"?',
    questionUz: '"Olma" so‘zining inglizcha tarjimasi nima?',
    questionRu: 'Как переводится на английский слово «Яблоко»?',
    imageEmoji: '🍎',
    options: [
      { text: 'Banana', correct: false },
      { text: 'Orange', correct: false },
      { text: 'Apple', correct: true },
      { text: 'Watermelon', correct: false }
    ],
    hint: 'It sounds like "Ap-ple"!'
  },
  {
    id: 3,
    questionEn: 'Which color is the clear sunny sky?',
    questionUz: 'Musaffo quyoshli osmon qanday rangda bo‘ladi?',
    questionRu: 'Какого цвета ясное небо в солнечный день?',
    imageEmoji: '☀️',
    options: [
      { text: 'Red 🔴', correct: false },
      { text: 'Green 🟢', correct: false },
      { text: 'Blue 🔵', correct: true },
      { text: 'Purple 🟣', correct: false }
    ],
    hint: 'Like the sparkling waves of ocean water!'
  },
  {
    id: 4,
    questionEn: 'Choose the correct word: "An _____ a day keeps the doctor away!"',
    questionUz: 'To‘g‘ri so‘zni tanlang: "An _____ a day keeps the doctor away!"',
    questionRu: 'Выберите правильное слово:',
    imageEmoji: '🩺',
    options: [
      { text: 'Banana', correct: false },
      { text: 'Apple', correct: true },
      { text: 'Milk', correct: false },
      { text: 'Book', correct: false }
    ],
    hint: 'It starts with "An" so it must begin with a vowel sound!'
  },
  {
    id: 5,
    questionEn: 'What do you use to write and draw in your notebook?',
    questionUz: 'Daftarga yozish va chizish uchun nimadan foydalanasiz?',
    questionRu: 'Что мы используем, чтобы писать и рисовать в тетрадке?',
    imageEmoji: '🎨',
    options: [
      { text: 'Bicycle 🚲', correct: false },
      { text: 'Clock ⏰', correct: false },
      { text: 'Pencil ✏️', correct: true },
      { text: 'House 🏠', correct: false }
    ],
    hint: 'It has an eraser on top sometimes!'
  },
  {
    id: 6,
    questionEn: 'Fill in the blank: "I ____ happy today!"',
    questionUz: 'Bo‘sh joyni to‘ldiring: "I ____ happy today!"',
    questionRu: 'Вставьте пропущенное слово: "I ____ happy today!"',
    imageEmoji: '😊',
    options: [
      { text: 'is', correct: false },
      { text: 'am', correct: true },
      { text: 'are', correct: false },
      { text: 'be', correct: false }
    ],
    hint: '"I" is always best friends with "AM"!'
  }
];

const MATCH_PAIRS_DATA = [
  { id: 'm1', en: 'Elephant 🐘', uz: 'Fil', ru: 'Слон' },
  { id: 'm2', en: 'Watermelon 🍉', uz: 'Tarvuz', ru: 'Арбуз' },
  { id: 'm3', en: 'Yellow 🟡', uz: 'Sariq', ru: 'Жёлтый' },
  { id: 'm4', en: 'Book 📖', uz: 'Kitob', ru: 'Книга' },
  { id: 'm5', en: 'Rabbit 🐰', uz: 'Quyon', ru: 'Кролик' },
  { id: 'm6', en: 'Hand ✋', uz: 'Qo‘l', ru: 'Рука' }
];

const FILL_BLANK_DATA = [
  {
    id: 'f1',
    sentenceBefore: 'Look! That is',
    sentenceAfter: 'elephant in the zoo! 🐘',
    options: ['an', 'a', 'two'],
    correct: 'an',
    translationUz: 'Qarang! Bu hayvonot bog‘idagi fil!',
    translationRu: 'Смотри! Это слон в зоопарке!'
  },
  {
    id: 'f2',
    sentenceBefore: 'The little cat loves to drink warm',
    sentenceAfter: 'every morning. 🥛',
    options: ['milk', 'pencil', 'bicycle'],
    correct: 'milk',
    translationUz: 'Kichik mushukcha har kuni ertalab iliq sut ichishni yaxshi ko‘radi.',
    translationRu: 'Маленький котёнок любит пить тёплое молоко каждое утро.'
  },
  {
    id: 'f3',
    sentenceBefore: 'You and I',
    sentenceAfter: 'best friends forever! 🌟',
    options: ['are', 'is', 'am'],
    correct: 'are',
    translationUz: 'Sen va men abadiy eng yaqin do‘stlarmiz!',
    translationRu: 'Ты и я — лучшие друзья навсегда!'
  },
  {
    id: 'f4',
    sentenceBefore: 'Mom gave me three red',
    sentenceAfter: 'for lunch. 🍎',
    options: ['apples', 'apple', 'appling'],
    correct: 'apples',
    translationUz: 'Ona tushlikka menga uchta qizil olma berdi.',
    translationRu: 'Мама дала мне три красных яблока на обед.'
  }
];

// --- BADGES & ACHIEVEMENTS ---
const BADGES_DATA = [
  {
    id: 'first-word',
    icon: '🐣',
    title: 'First Step!',
    desc: 'Listened to your very first English word audio.',
    descUz: 'Birinchi inglizcha so‘z talaffuzini tingladingiz!',
    descRu: 'Ты прослушал произношение своего первого английского слова!',
    unlocked: false
  },
  {
    id: 'vocab-explorer',
    icon: '🧭',
    title: 'Word Explorer',
    desc: 'Explored 5 different vocabulary cards.',
    descUz: '5 ta turli xil so‘z kartochkalarini o‘rgandingiz.',
    descRu: 'Изучил 5 разных карточек со словами!',
    unlocked: false
  },
  {
    id: 'audio-master',
    icon: '🎧',
    title: 'Sound Champion',
    desc: 'Practiced listening with the Turtle Mode slow speed.',
    descUz: 'Toshbaqa rejimidan foydalanib aniq talaffuzni o‘rgandingiz.',
    descRu: 'Использовал режим черепашки для четкого восприятия на слух!',
    unlocked: false
  },
  {
    id: 'quiz-hero',
    icon: '🎯',
    title: 'Quiz Champion',
    desc: 'Answered a quiz question correctly on the first try!',
    descUz: 'Test savoliga birinchi urinishda to‘g‘ri javob berdingiz!',
    descRu: 'Ответил на вопрос викторины правильно с первой попытки!',
    unlocked: false
  },
  {
    id: 'match-maker',
    icon: '🧩',
    title: 'Puzzle Genius',
    desc: 'Completed the Word Match exercise!',
    descUz: 'So‘zlarni juftlash mashqini muvaffaqiyatli yakunladingiz!',
    descRu: 'Успешно соединил все пары слов!',
    unlocked: false
  },
  {
    id: 'balloon-popper',
    icon: '🎈',
    title: 'Balloon Pop Star',
    desc: 'Popped 5 correct balloons in the mini-game!',
    descUz: 'Havo sharlari o‘yinida 5 ta to‘g‘ri sharni portlatdingiz!',
    descRu: 'Лопнул 5 правильных шариков в мини-игре!',
    unlocked: false
  },
  {
    id: 'memory-master',
    icon: '🧠',
    title: 'Memory Wizard',
    desc: 'Matched pairs in the Magic Memory card game!',
    descUz: 'Sehrli xotira o‘yinida barcha juftliklarni topdingiz!',
    descRu: 'Нашел все пары в волшебных карточках памяти!',
    unlocked: false
  },
  {
    id: 'streak-star',
    icon: '🔥',
    title: 'Streak Hero',
    desc: 'Practiced English today to maintain your daily streak!',
    descUz: 'Bugungi mashg‘ulotni bajarib, kunlik olovli seriyani yoqdingiz!',
    descRu: 'Позанимался английским сегодня и сохранил горящую серию!',
    unlocked: false
  }
];

// Expose datasets globally to allow seamless integration with AstroBot and other components
if (typeof window !== 'undefined') {
  window.VOCABULARY_DATA = VOCABULARY_DATA;
  window.GRAMMAR_LESSONS = GRAMMAR_LESSONS;
  window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
  window.MATCH_PAIRS_DATA = MATCH_PAIRS_DATA;
  window.FILL_BLANK_DATA = FILL_BLANK_DATA;
  window.BADGES_DATA = BADGES_DATA;
}
