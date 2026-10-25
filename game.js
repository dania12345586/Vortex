"use strict";
(() => {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => document.querySelectorAll(s);
  const canvas = $("#game"),
    ctx = canvas.getContext("2d"),
    sprites = window.VectorSprites,
    audio = window.VectorAudio;
  let W = 896,
    H = 560;
  const C = 56,
    TAU = Math.PI * 2;
  const TYPES = {
    basic: {
      name: "Базовая",
      price: 70,
      damage: 7,
      range: 142,
      interval: 0.56,
      rotation: 270,
      projectile: 530,
      color: "#41b6aa",
      effect: { normal: 150, fast: 100, tank: 75, sound: 100, fighter: 50, minion: 100, boss: 100 },
    },
    sniper: {
      name: "Снайпер",
      price: 90,
      damage: 30,
      range: 255,
      interval: 1.75,
      rotation: 165,
      projectile: 0,
      color: "#76ba60",
      effect: {
        normal: 100,
        fast: 25,
        tank: 150,
        sound: 125,
        fighter: 125,
        minion: 100,
        boss: 100,
      },
    },
    splash: {
      name: "Сплэш",
      price: 100,
      damage: 17,
      range: 156,
      interval: 1.4,
      rotation: 180,
      projectile: 310,
      color: "#ee6256",
      effect: { normal: 75, fast: 150, tank: 75, sound: 150, fighter: 50, minion: 100, boss: 100 },
    },
    laser: {
      name: "Лазер",
      price: 140,
      damage: 10,
      range: 174,
      interval: 2.4,
      rotation: 250,
      projectile: 820,
      color: "#b58ce8",
      effect: { normal: 50, fast: 50, tank: 100, sound: 100, fighter: 150, minion: 100, boss: 100 },
    },
  };
  TYPES.pyro = {
    name: "Пиротехник",
    price: 160,
    damage: 11,
    range: 178,
    interval: 2.3,
    rotation: 190,
    projectile: 285,
    color: "#f6ad50",
    effect: { normal: 75, fast: 75, tank: 25, fighter: 150, sound: 75, minion: 100, boss: 100 },
  };
  Object.assign(TYPES, {
    vortex: {
      name: "Вортекс",
      price: 180,
      damage: 9,
      range: 168,
      interval: 2.6,
      rotation: 230,
      projectile: 300,
      color: "#344b99",
      effect: {
        normal: 100,
        fast: 125,
        tank: 75,
        sound: 100,
        fighter: 150,
        minion: 100,
        boss: 100,
      },
    },
    cut: {
      name: "Разрез",
      price: 220,
      damage: 22,
      range: 98,
      interval: 0.34,
      rotation: 410,
      projectile: 0,
      color: "#b4b8bc",
      effect: { normal: 125, fast: 75, tank: 125, sound: 100, fighter: 50, minion: 100, boss: 100 },
    },
    boomerang: {
      name: "Бумеранг",
      price: 190,
      damage: 14,
      range: 180,
      interval: 1.6,
      rotation: 240,
      projectile: 330,
      color: "#d2bc96",
      effect: { normal: 125, fast: 150, tank: 50, sound: 100, fighter: 75, minion: 100, boss: 100 },
    },
    freeze: {
      name: "Фриз",
      price: 150,
      damage: 5,
      range: 160,
      interval: 0.8,
      rotation: 260,
      projectile: 390,
      color: "#5198ec",
      effect: { normal: 100, fast: 150, tank: 75, sound: 125, fighter: 75, minion: 100, boss: 100 },
    },
    machine: {
      name: "Пулемёт",
      price: 800,
      damage: 5,
      range: 184,
      interval: 0.32,
      rotation: 310,
      projectile: 760,
      color: "#6b7077",
      effect: { normal: 125, fast: 100, tank: 75, sound: 150, fighter: 50, minion: 100, boss: 100 },
    },
  });
  Object.assign(TYPES, {
    tesla: {
      name: "Тесла",
      price: 240,
      damage: 24,
      range: 164,
      interval: 1.25,
      rotation: 260,
      projectile: 0,
      color: "#edc653",
    },
    acid: {
      name: "Кислотник",
      price: 210,
      damage: 9,
      range: 164,
      interval: 1.3,
      rotation: 235,
      projectile: 340,
      color: "#a9cc51",
    },
    mortar: {
      name: "Мортира",
      price: 300,
      damage: 62,
      range: 300,
      interval: 3.6,
      rotation: 145,
      projectile: 220,
      color: "#8d9c70",
    },
    prism: {
      name: "Призма",
      price: 280,
      damage: 33,
      range: 214,
      interval: 1.9,
      rotation: 190,
      projectile: 0,
      color: "#e79cce",
    },
    pulse: {
      name: "Импульс",
      price: 260,
      damage: 26,
      range: 125,
      interval: 1.9,
      rotation: 360,
      projectile: 0,
      color: "#bf76c8",
    },
  });
  TYPES.summon = {
    name: "Призыв",
    price: 200,
    damage: 8,
    range: 160,
    interval: 0.9,
    rotation: 280,
    projectile: 0,
    color: "#d55263",
  };
  const extendedEffects = {
    summon: [125, 75, 75, 125, 100],
    basic: [100, 75, 125, 100, 75],
    sniper: [150, 125, 75, 100, 150],
    splash: [75, 75, 100, 150, 125],
    laser: [100, 125, 75, 100, 150],
    pyro: [75, 50, 100, 150, 100],
    vortex: [75, 100, 150, 100, 100],
    cut: [125, 100, 75, 125, 100],
    boomerang: [100, 75, 150, 150, 100],
    freeze: [100, 75, 150, 100, 125],
    machine: [100, 50, 125, 125, 100],
    tesla: [150, 75, 100, 150, 125],
    acid: [75, 150, 75, 125, 100],
    mortar: [100, 125, 50, 150, 125],
    prism: [150, 125, 75, 100, 100],
    pulse: [100, 75, 150, 150, 125],
  };
  const newEffects = {
    summon: [100, 75, 125, 100, 100],
    tesla: [100, 125, 50, 150, 75],
    acid: [100, 75, 150, 75, 150],
    mortar: [100, 50, 150, 75, 125],
    prism: [100, 75, 125, 150, 100],
    pulse: [125, 150, 50, 100, 75],
  };
  for (const [k, t] of Object.entries(TYPES)) {
    if (!t.effect)
      t.effect = Object.fromEntries(
        ["normal", "fast", "tank", "sound", "fighter"].map((e, i) => [e, newEffects[k][i]]),
      );
    ["medic", "guardian", "sprinter", "splitter", "jammer"].forEach(
      (e, i) => (t.effect[e] = extendedEffects[k][i]),
    );
    t.effect.boss = t.effect.minion = 100;
  }
  const TOWER_ORDER = Object.keys(TYPES),
    FINAL_WAVE = 40;
  const REGULAR = [
    "normal",
    "fast",
    "tank",
    "sound",
    "fighter",
    "medic",
    "guardian",
    "sprinter",
    "splitter",
    "jammer",
  ];
  const coin = `<svg class="coin-icon" viewBox="0 0 32 32" aria-hidden="true"><path d="m8 3 17 2 5 15-12 11L3 22 2 10z" fill="#f3ce55"/><path d="m10 8 11 1 4 10-8 7-10-6-1-8z" fill="#c8a239"/></svg>`;
  const ET = {
    normal: { name: "Обычный", hp: 40, speed: 58, reward: 7, defense: 5, color: "#77bf62", r: 9 },
    fast: { name: "Быстрый", hp: 25, speed: 98, reward: 8, defense: 0, color: "#f3d266", r: 9 },
    tank: { name: "Танк", hp: 125, speed: 34, reward: 16, defense: 25, color: "#ef645a", r: 12 },
    sound: { name: "Саунд", hp: 85, speed: 52, reward: 14, defense: 12, color: "#55a8eb", r: 12 },
    fighter: { name: "Боец", hp: 110, speed: 40, reward: 19, defense: 70, color: "#e98649", r: 12 },
    minion: {
      name: "Кристальный миньон",
      hp: 1200,
      speed: 88,
      reward: 12,
      defense: 22,
      color: "#7cdbe4",
      r: 12,
    },
    boss: {
      name: "Кристалликс",
      hp: 22000,
      shield: 16000,
      speed: 16,
      reward: 500,
      defense: 30,
      shieldDefense: 60,
      color: "#a38bed",
      r: 29,
    },
  };
  Object.assign(ET, {
    medic: { name: "Медик", hp: 100, speed: 48, reward: 17, defense: 10, color: "#6dd3aa", r: 12 },
    guardian: {
      name: "Страж",
      hp: 190,
      speed: 32,
      reward: 24,
      defense: 40,
      color: "#7897d5",
      r: 14,
    },
    sprinter: {
      name: "Спринтер",
      hp: 64,
      speed: 76,
      reward: 15,
      defense: 5,
      color: "#f2ab6b",
      r: 10,
    },
    splitter: {
      name: "Делитель",
      hp: 155,
      speed: 44,
      reward: 23,
      defense: 16,
      color: "#ca8bdd",
      r: 13,
    },
    jammer: {
      name: "Глушитель",
      hp: 130,
      speed: 43,
      reward: 22,
      defense: 22,
      color: "#a78ba0",
      r: 12,
    },
  });
  Object.assign(ET, {
    magma: {
      name: "Магма",
      hp: 32000,
      speed: 15,
      reward: 600,
      defense: 38,
      shieldDefense: 38,
      color: "#f18a43",
      r: 33,
      boss: true,
    },
    magmaMinion: {
      name: "Магмовый миньон",
      hp: 6500,
      speed: 23,
      reward: 24,
      defense: 35,
      color: "#d5743d",
      r: 17,
    },
    asterix: {
      name: "Астерикс",
      hp: 18000,
      speed: 17,
      reward: 650,
      defense: 28,
      shieldDefense: 28,
      color: "#8adbb0",
      r: 24,
      boss: true,
    },
    asterPart: {
      name: "Сегмент Астерикса",
      hp: 2400,
      speed: 17,
      reward: 24,
      defense: 18,
      color: "#6dbd95",
      r: 20,
    },
    cosmo: {
      name: "Космо",
      hp: 18000,
      speed: 19,
      reward: 800,
      defense: 35,
      shieldDefense: 35,
      color: "#b58bed",
      r: 35,
      boss: true,
    },
    cosmicMinion: {
      name: "Странник разлома",
      hp: 1800,
      speed: 70,
      reward: 18,
      defense: 20,
      color: "#b29be5",
      r: 13,
    },
  });
  const isBoss = (e) => !!e && (e.type === "boss" || !!ET[e.type]?.boss);
  const isElite = (e) =>
    isBoss(e) || ["minion", "magmaMinion", "asterPart", "cosmicMinion"].includes(e.type);
  for (const t of Object.values(TYPES))
    for (const k of ["magma", "magmaMinion", "asterix", "asterPart", "cosmo", "cosmicMinion"])
      t.effect[k] = 100;
  // Every tower has its own three module choices and two mutually exclusive ultimates.
  const A = (name, desc, mods) => ({ name, desc, mods });
  const MODULES = {
    summon: [
      A("Кровавый обряд", "Шанс призыва +15 п.п.", { summonChance: 0.15 }),
      A("Плоть титана", "HP союзника ×1,5", { allyHP: 1.5 }),
      A("Рваные раны", "Кровотечение ×1,4; темп ×1,15", { bleed: 1.4, rate: 1.15 }),
      A("Легион", "При успешном призыве выходят 2 союзника", { legion: 1 }),
      A("Авангард", "HP союзника ×2; темп ×1,3", { allyHP: 2, rate: 1.3 }),
    ],
    basic: [
      A("Калибр", "Урон ×1,3; темп ×0,9", { damage: 1.3, rate: 0.9 }),
      A("Двойной затвор", "Темп ×1,3", { rate: 1.3 }),
      A("Ствол", "Радиус ×1,18; пули ×1,4", { range: 1.18, projectile: 1.4 }),
      A("Рикошет", "Пуля поражает ещё 2 цели за 65% урона", { ricochet: 1 }),
      A("Опорная точка", "Урон ×1,6; радиус ×1,2", { damage: 1.6, range: 1.2 }),
    ],
    sniper: [
      A("Оптика", "Радиус ×1,22; прицел ×0,8", { range: 1.22, aim: 0.8 }),
      A("Патрон", "Урон ×1,35", { damage: 1.35 }),
      A("Фокус", "Крит. шанс +15 п.п.; прицел ×0,65", { crit: 0.15, aim: 0.65 }),
      A("Палач", "Урон ×1,6 по целям ниже 35% HP", { execute: 1 }),
      A("Рельсотрон", "Урон ×1,8; темп ×1,15", { damage: 1.8, rate: 1.15 }),
    ],
    splash: [
      A("Осколки", "Взрыв ×1,35", { area: 1.35 }),
      A("Порох", "Урон ×1,35", { damage: 1.35 }),
      A("Зарядник", "Темп ×1,3; полёт ×1,2", { rate: 1.3, projectile: 1.2 }),
      A("Кратер", "Взрыв замедляет на 35% на 3 с", { crater: 1 }),
      A("Большой калибр", "Урон ×1,65; взрыв ×1,3", { damage: 1.65, area: 1.3 }),
    ],
    laser: [
      A("Конденсатор", "+1 пуля в очереди", { burst: 1 }),
      A("Оптоволокно", "Урон ×1,3; полёт ×1,2", { damage: 1.3, projectile: 1.2 }),
      A("Линза", "Радиус ×1,2; снятие защиты ×1,5", { range: 1.2, strip: 1.5 }),
      A("Ионизация", "Снятие защиты ×3; урон ×1,2", { strip: 3, damage: 1.2 }),
      A("Реактор", "+3 пули; темп ×1,25", { burst: 3, rate: 1.25 }),
    ],
    pyro: [
      A("Кассета", "+1 ракета в залпе", { burst: 1 }),
      A("Магний", "Урон ×1,35; урон от HP ×1,2", { damage: 1.35, percent: 1.2 }),
      A("Фитиль", "Темп ×1,3; полёт ×1,3", { rate: 1.3, projectile: 1.3 }),
      A("Фестиваль", "+3 ракеты; радиус салюта ×1,25", { burst: 3, area: 1.25 }),
      A("Белый фосфор", "Урон ×1,7; замедление ×1,4", { damage: 1.7, slow: 1.4 }),
    ],
    vortex: [
      A("Око бури", "Радиус вихря ×1,3", { area: 1.3 }),
      A("Долгий шторм", "Время жизни вихря ×1,4", { life: 1.4 }),
      A("Тяга", "Скорость уноса ×1,4; урон ×1,1", { pull: 1.4, damage: 1.1 }),
      A("Суперячейка", "Вихрь уносит цели ниже 45% HP", { threshold: 0.45 }),
      A("Ураган", "Урон ×1,6; время жизни ×1,5", { damage: 1.6, life: 1.5 }),
    ],
    cut: [
      A("Заточка", "Урон ×1,3", { damage: 1.3 }),
      A("Серия", "Темп ×1,3", { rate: 1.3 }),
      A("Длинное лезвие", "Радиус ×1,2; усиление ран ×1,3", { range: 1.2, wound: 1.3 }),
      A("Глубокая рана", "Предел усиления порезов ×5", { woundCap: 4 }),
      A("Хирург", "Урон ×1,55; темп ×1,3", { damage: 1.55, rate: 1.3 }),
    ],
    boomerang: [
      A("Кромка", "Урон ×1,3", { damage: 1.3 }),
      A("Баланс", "Скорость полёта ×1,4; темп ×1,2", { projectile: 1.4, rate: 1.2 }),
      A("Широкая дуга", "Радиус ×1,2; бонус возврата ×1,4", { range: 1.2, returnBonus: 1.4 }),
      A("Возмездие", "Предел бонуса возврата +360%", { returnCap: 3.6 }),
      A("Охотник", "Урон ×1,6; скорость полёта ×1,5", { damage: 1.6, projectile: 1.5 }),
    ],
    freeze: [
      A("Колючий лёд", "Шанс сосульки +12 п.п.", { icicle: 0.12 }),
      A("Сугробы", "Накопление холода ×1,4", { chill: 1.4 }),
      A("Вечная мерзлота", "Длительность заморозки ×1,4", { freezeDuration: 1.4 }),
      A("Абсолютный ноль", "Заморозка ×1,6; радиус ×1,2", { freezeDuration: 1.6, range: 1.2 }),
      A("Ледяной град", "Темп ×1,7; урон ×1,4", { rate: 1.7, damage: 1.4 }),
    ],
    machine: [
      A("Маховик", "Разгон ×1,5", { spinup: 1.5 }),
      A("Лента", "Темп ×1,2", { rate: 1.2 }),
      A("Тяжёлая пуля", "Урон ×1,3; полёт ×1,15", { damage: 1.3, projectile: 1.15 }),
      A("Напалм", "Урон горения ×3; шанс остаётся 4%", { burn: 3 }),
      A("Овердрайв", "Темп ×1,55; разгон ×2", { rate: 1.55, spinup: 2 }),
    ],
    tesla: [
      A("Разветвитель", "+2 цели цепи", { chains: 2 }),
      A("Катушка", "Урон ×1,3", { damage: 1.3 }),
      A("Проводник", "Длина скачка ×1,5", { jump: 1.5 }),
      A("Шаровая молния", "+4 цели цепи; затухание 10%", { chains: 4, decay: 0.9 }),
      A("Сверхток", "Урон ×1,7; темп ×1,2", { damage: 1.7, rate: 1.2 }),
    ],
    acid: [
      A("Растворитель", "Снижение защиты ×1,6", { corrosion: 1.6 }),
      A("Токсин", "Урон кислоты ×1,5", { poison: 1.5 }),
      A("Распылитель", "Темп ×1,25; радиус ×1,1", { rate: 1.25, range: 1.1 }),
      A("Разъедание", "Снижение защиты ×2,5; кислота ×1,4", { corrosion: 2.5, poison: 1.4 }),
      A("Едкая смесь", "Прямой урон ×2; кислота ×2", { damage: 2, poison: 2 }),
    ],
    mortar: [
      A("Фугас", "Взрыв ×1,35", { area: 1.35 }),
      A("Тяжёлый снаряд", "Урон ×1,4", { damage: 1.4 }),
      A("Расчёт", "Темп ×1,3; полёт ×1,3", { rate: 1.3, projectile: 1.3 }),
      A("Сейсмика", "Взрыв оглушает на 0,6 с", { quake: 1 }),
      A("Осада", "Урон ×1,8; радиус ×1,15", { damage: 1.8, range: 1.15 }),
    ],
    prism: [
      A("Огранка", "Ширина луча ×1,6", { width: 1.6 }),
      A("Фокусировка", "Урон ×1,35", { damage: 1.35 }),
      A("Рефрактор", "Темп ×1,2; радиус ×1,15", { rate: 1.2, range: 1.15 }),
      A("Спектр", "Ширина ×2; урон ×1,4", { width: 2, damage: 1.4 }),
      A("Белый луч", "Урон ×1,85; темп ×1,15", { damage: 1.85, rate: 1.15 }),
    ],
    pulse: [
      A("Резонатор", "Радиус ×1,2", { range: 1.2 }),
      A("Амплитуда", "Урон ×1,35", { damage: 1.35 }),
      A("Осциллятор", "Темп ×1,3", { rate: 1.3 }),
      A("Ударная волна", "Каждая волна оглушает на 0,45 с", { shock: 1 }),
      A("Каскад", "Темп ×1,65; урон ×1,25", { rate: 1.65, damage: 1.25 }),
    ],
  };
  function mods(t) {
    const out = {};
    for (const id of t.abilities || []) {
      const a = MODULES[t.type][+id];
      if (a)
        for (const [k, v] of Object.entries(a.mods))
          out[k] = ["burst", "crit", "icicle", "chains", "summonChance"].includes(k)
            ? (out[k] || 0) + v
            : (out[k] || 1) * v;
    }
    return out;
  }
  const LEVELS = [
    {
      id: "crystal",
      name: "Кристальный контур",
      subtitle: "Проверенный рубеж. Узкие повороты и кристаллическая осада.",
      boss: "boss",
      color: "#93cdd8",
      bg: "#191919",
      road: "#393939",
      track: "HARD CIRCUIT",
      style: "Industrial breakbeat · 156 BPM",
      w: 896,
      h: 560,
      route: [
        [0, 3],
        [3, 3],
        [3, 7],
        [7, 7],
        [7, 2],
        [12, 2],
        [12, 7],
        [15, 7],
      ],
    },
    {
      id: "magma",
      name: "Пепельный разлом",
      subtitle: "Раскалённые петли. Лава меняет темп наступления.",
      boss: "magma",
      color: "#f3a15d",
      bg: "#211a1a",
      road: "#493831",
      track: "FURNACE HEART",
      style: "Volcanic techno · 138 BPM",
      w: 1008,
      h: 616,
      route: [
        [0, 2],
        [5, 2],
        [5, 5],
        [2, 5],
        [2, 8],
        [9, 8],
        [9, 3],
        [14, 3],
        [14, 8],
        [17, 8],
      ],
    },
    {
      id: "asterix",
      name: "Изумрудная спираль",
      subtitle: "Длинные изгибы. Живой хвост защищает древнего стража.",
      boss: "asterix",
      color: "#8bd8ae",
      bg: "#16201e",
      road: "#344941",
      track: "VERDANT COIL",
      style: "Melodic broken beat · 126 BPM",
      w: 1008,
      h: 672,
      route: [
        [0, 5],
        [3, 5],
        [3, 2],
        [8, 2],
        [8, 6],
        [5, 6],
        [5, 10],
        [12, 10],
        [12, 3],
        [16, 3],
        [16, 8],
        [17, 8],
      ],
    },
    {
      id: "cosmo",
      name: "Горизонт событий",
      subtitle: "Огромный сектор. Разломы пространства и исчезающие опоры.",
      boss: "cosmo",
      color: "#c49af5",
      bg: "#181723",
      road: "#39344f",
      track: "EVENT HORIZON",
      style: "Cosmic drum & bass · 172 BPM",
      w: 1344,
      h: 840,
      route: [
        [0, 3],
        [5, 3],
        [5, 10],
        [2, 10],
        [2, 13],
        [10, 13],
        [10, 6],
        [8, 6],
        [8, 1],
        [16, 1],
        [16, 5],
        [13, 5],
        [13, 11],
        [20, 11],
        [20, 4],
        [23, 4],
        [23, 12],
      ],
    },
  ];
  let levelIndex = 0,
    currentLevel = LEVELS[0],
    levelChosen = false;
  const points = [],
    segments = [],
    platformCoords = [],
    platforms = [];
  let pathLength = 0;
  const FIRST_PLATFORMS = [
    [1, 2],
    [2, 2],
    [1, 4],
    [2, 4],
    [2, 5],
    [4, 4],
    [4, 5],
    [2, 6],
    [2, 8],
    [3, 8],
    [4, 8],
    [5, 6],
    [5, 8],
    [6, 6],
    [6, 8],
    [6, 4],
    [6, 5],
    [8, 5],
    [8, 6],
    [8, 7],
    [7, 8],
    [8, 1],
    [8, 3],
    [9, 1],
    [10, 1],
    [10, 3],
    [11, 1],
    [11, 3],
    [11, 4],
    [13, 3],
    [13, 4],
    [11, 5],
    [13, 6],
    [11, 6],
    [12, 8],
    [13, 8],
    [14, 6],
    [14, 8],
  ];
  function configureMap() {
    currentLevel = LEVELS[levelIndex];
    W = currentLevel.w;
    H = currentLevel.h;
    points.length = segments.length = platformCoords.length = platforms.length = 0;
    pathLength = 0;
    points.push(...currentLevel.route.map(([x, y]) => ({ x: x * C + C / 2, y: y * C + C / 2 })));
    const road = new Set();
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1],
        b = points[i],
        len = Math.hypot(b.x - a.x, b.y - a.y);
      segments.push({ a, b, len, offset: pathLength });
      pathLength += len;
      for (let j = 0; j <= len / C; j++)
        road.add(
          `${Math.round((a.x + ((b.x - a.x) * j) / (len / C) - C / 2) / C)},${Math.round((a.y + ((b.y - a.y) * j) / (len / C) - C / 2) / C)}`,
        );
    }
    if (levelIndex === 0) platformCoords.push(...FIRST_PLATFORMS.map((x) => [...x]));
    else {
      const set = new Set();
      for (const k of road) {
        const [c, r] = k.split(",").map(Number);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const x = c + dx,
            y = r + dy,
            key = `${x},${y}`;
          if (x > 0 && x < W / C - 1 && y > 0 && y < H / C - 1 && !road.has(key)) set.add(key);
        }
      }
      platformCoords.push(
        ...[...set].map((k) => k.split(",").map(Number)).sort((a, b) => a[1] - b[1] || a[0] - b[0]),
      );
    }
    platforms.push(
      ...platformCoords.map(([c, r]) => ({
        c,
        r,
        x: c * C + C / 2,
        y: r * C + C / 2,
        destroyed: false,
      })),
    );
  }
  configureMap();
  function waveSpec(n) {
    const mult = 1 + (n - 1) * 0.22 + (n - 1) ** 2 * 0.012,
      counts = {
        normal: 7 + n * 2,
        fast: n >= 2 ? 3 + Math.floor(n * 1.1) : 0,
        tank: n >= 3 ? 1 + Math.floor(n / 3) : 0,
        sound: n >= 5 ? 1 + Math.floor((n - 5) / 4) : 0,
        fighter: n >= 8 ? 1 + Math.floor((n - 8) / 3) : 0,
      };
    for (const [type, start] of [
      ["medic", 6],
      ["guardian", 10],
      ["sprinter", 13],
      ["splitter", 17],
      ["jammer", 22],
    ]) {
      counts[type] = n >= start ? 1 + Math.floor((n - start) / 5) : 0;
      counts.normal -= counts[type];
    }
    if (n % 5 === 0) {
      counts.normal += 4;
      counts.tank += 3;
    }
    // Final wave is a boss encounter, not a full late-wave swarm plus a boss.
    if (n === FINAL_WAVE)
      Object.assign(counts, { normal: 24, fast: 12, tank: 5, sound: 3, fighter: 3 });
    let queue = [],
      remain = { ...counts };
    while (Object.values(remain).some((v) => v > 0))
      for (const type of REGULAR) if (remain[type]-- > 0) queue.push(type);
    if (n === FINAL_WAVE) queue.unshift(currentLevel.boss);
    return {
      n,
      counts,
      queue,
      gap: Math.max(0.36, 0.94 - n * 0.023),
      hp: {
        ...Object.fromEntries(REGULAR.map((k) => [k, Math.round(ET[k].hp * mult)])),
        ...Object.fromEntries(["boss", "magma", "asterix", "cosmo"].map((k) => [k, ET[k].hp])),
      },
      bonus: 25 + n * 3,
    };
  }
  const WAVES = Array.from({ length: FINAL_WAVE }, (_, i) => waveSpec(i + 1));
  let state,
    selected = null,
    buildType = null,
    hover = null,
    speed = 1,
    paused = false,
    clock = 0,
    last = 0,
    uiTime = 0,
    autoTimer = 0,
    towerID = 0,
    enemyID = 0,
    toastTimer,
    effOpen = false;
  const camera = {
    x: W / 2,
    y: H / 2,
    tx: W / 2,
    ty: H / 2,
    zoom: 1,
    targetZoom: 1,
    fit: 1,
    width: 0,
    height: 0,
    dpr: 1,
  };
  let drag = null;
  const cameraKeys = new Set();
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  function fitCanvas() {
    const r = $("#playfield").getBoundingClientRect();
    camera.width = r.width;
    camera.height = r.height;
    camera.dpr = Math.min(2, devicePixelRatio || 1);
    camera.fit = Math.min(r.width / W, r.height / H) * 0.94;
    canvas.width = Math.round(r.width * camera.dpr);
    canvas.height = Math.round(r.height * camera.dpr);
  }
  function resetCamera() {
    camera.tx = W / 2;
    camera.ty = H / 2;
    camera.targetZoom = 1;
  }
  function screenToWorld(clientX, clientY, target = false) {
    const r = canvas.getBoundingClientRect(),
      s = camera.fit * (target ? camera.targetZoom : camera.zoom);
    return {
      x: (clientX - r.left - camera.width / 2) / s + (target ? camera.tx : camera.x),
      y: (clientY - r.top - camera.height / 2) / s + (target ? camera.ty : camera.y),
    };
  }
  function zoomAt(factor, cx, cy) {
    const r = canvas.getBoundingClientRect(),
      x = cx ?? r.left + camera.width / 2,
      y = cy ?? r.top + camera.height / 2,
      p = screenToWorld(x, y, true),
      z = clamp(camera.targetZoom * factor, 0.4, 3.5);
    camera.tx = p.x - (x - r.left - camera.width / 2) / (camera.fit * z);
    camera.ty = p.y - (y - r.top - camera.height / 2) / (camera.fit * z);
    camera.targetZoom = z;
  }
  function updateCamera(dt) {
    const step = (420 * dt) / (camera.fit * camera.zoom);
    if (cameraKeys.has("ArrowLeft") || cameraKeys.has("KeyA")) camera.tx -= step;
    if (cameraKeys.has("ArrowRight") || cameraKeys.has("KeyD")) camera.tx += step;
    if (cameraKeys.has("ArrowUp") || cameraKeys.has("KeyW")) camera.ty -= step;
    if (cameraKeys.has("ArrowDown") || cameraKeys.has("KeyS")) camera.ty += step;
    const k = 1 - Math.exp(-22 * dt);
    camera.x += (camera.tx - camera.x) * k;
    camera.y += (camera.ty - camera.y) * k;
    camera.zoom += (camera.targetZoom - camera.zoom) * k;
    $("#zoomValue").textContent = Math.round(camera.zoom * 100) + "%";
  }
  function reset() {
    configureMap();
    WAVES.splice(0, WAVES.length, ...Array.from({ length: FINAL_WAVE }, (_, i) => waveSpec(i + 1)));
    audio.setMap(levelIndex);
    clearTimeout(toastTimer);
    $("#toast").classList.remove("show");
    audio.setBoss(false);
    effOpen = false;
    state = {
      hp: 20,
      money: 130,
      wave: 0,
      kills: 0,
      towers: [],
      enemies: [],
      shots: [],
      fx: [],
      active: false,
      spawn: [],
      spawnTimer: 0,
      ended: false,
      cleared: 0,
      boss: null,
      bossDefeated: false,
      crystallized: 0,
      summoned: 0,
      allies: [],
      lava: [],
      portals: [],
      hazards: [],
      adminUsed: false,
    };
    selected = null;
    buildType = null;
    hover = null;
    paused = false;
    speed = 1;
    $$("[data-speed]").forEach((b) => b.classList.toggle("active", +b.dataset.speed === 1));
    $("#testBadge").classList.add("hidden");
    autoTimer = 0;
    clock = 0;
    towerID = 0;
    enemyID = 0;
    resetCamera();
    camera.x = camera.tx;
    camera.y = camera.ty;
    camera.zoom = 1;
    setPauseIcon();
    renderPanel();
    updateHUD();
  }
  function toast(text) {
    $("#toast").textContent = text;
    $("#toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2400);
  }
  function selectedTower() {
    return selected?.kind === "tower" ? state.towers.find((t) => t.id === selected.id) : null;
  }
  function selectedEnemy() {
    return selected?.kind === "enemy"
      ? state.enemies.find((e) => e.id === selected.id && !e.dead)
      : null;
  }
  function towerAt(p) {
    return state.towers.find((t) => t.c === p.c && t.r === p.r);
  }
  function stat(t, next = false) {
    const b = TYPES[t.type],
      L = Math.min(10, t.level + (next ? 1 : 0)),
      m = mods(t),
      pwr = 1 + Math.max(0, t.rank - 10) * 0.01;
    const at = (k) => m[k] || 1;
    return {
      damage: b.damage * 1.31 ** L * pwr * at("damage") * (t.magmaTime > 0 ? 0.7 : 1),
      range: b.range * (1 + 0.044 * L) * at("range"),
      interval: b.interval / (1.11 ** L * pwr * at("rate") * (t.magmaTime > 0 ? 0.55 : 1)),
      rotation: (b.rotation * (1 + 0.07 * L) * Math.PI) / 180,
      projectile: b.projectile * (1 + 0.045 * L) * at("projectile"),
      burst: (t.type === "pyro" ? 3 + Math.floor(L / 4) : 3 + Math.floor(L / 3)) + (m.burst || 0),
      icicle: Math.min(0.65, 0.15 + (t.rank - 1) * 0.007 + L * 0.006 + (m.icicle || 0)),
      freezeDuration: (1.4 + L * 0.05) * at("freezeDuration"),
      knockback: 70 + L * 3,
      spin: t.spin || 0,
      percent: (0.012 + Math.min(0.006, (t.rank - 1) * 0.0004)) * at("percent"),
      slow: Math.min(0.65, (0.25 + Math.min(0.1, (t.rank - 1) * 0.006)) * at("slow")),
      strip: (3 + Math.min(2, (t.rank - 1) * 0.12)) * at("strip"),
      area: (t.type === "mortar" ? 85 : 68 + (t.rank - 1) * 0.7) * at("area"),
      crit: 0.08 + t.rank * 0.004 + (m.crit || 0),
      critMult: 2,
      aim: (0.38 / (1 + 0.12 * L)) * at("aim"),
      life: 2.4 * at("life"),
      pull: 24 * at("pull"),
      threshold: m.threshold || 0.3,
      chains: 3 + (m.chains || 0),
      jump: 90 * at("jump"),
      decay: m.decay || 0.72,
      corrosion: 8 * at("corrosion"),
      poison: at("poison"),
      width: 12 * at("width"),
      pwr,
      allyHP: 160 * (1 + 0.24 * L) * pwr * at("allyHP"),
      summonChance: Math.min(0.65, 0.25 + (t.rank - 1) * 0.004 + (m.summonChance || 0)),
    };
  }

  function upCost(t) {
    return Math.round(TYPES[t.type].price * (t.type === "machine" ? 0.6 : 0.42) * 1.48 ** t.level);
  }
  function xpNeed(t) {
    return Math.round(22 + (t.rank - 1) * 12 + (t.rank - 1) ** 2);
  }
  function addXP(t, value) {
    if (t.rank >= 20) return;
    t.xp += value;
    while (t.rank < 20 && t.xp >= xpNeed(t)) {
      t.xp -= xpNeed(t);
      t.rank++;
      state.fx.push({
        type: "build",
        x: t.x,
        y: t.y,
        color: TYPES[t.type].color,
        life: 0.6,
        max: 0.6,
      });
    }
  }
  function abilityChoices(t) {
    return (
      Math.max(
        0,
        (t.rank >= 4 ? 1 : 0) + (t.rank >= 7 ? 1 : 0) - t.abilities.filter((id) => +id < 3).length,
      ) + (t.rank >= 20 && !t.abilities.some((id) => +id >= 3) ? 1 : 0)
    );
  }
  function canAbility(t, id) {
    const n = +id;
    if (t.frozen || state.ended || t.abilities.includes(String(id))) return false;
    return n < 3
      ? t.abilities.filter((a) => +a < 3).length < (t.rank >= 4 ? 1 : 0) + (t.rank >= 7 ? 1 : 0)
      : t.rank >= 20 && !t.abilities.some((a) => +a >= 3);
  }

  function effectiveness(type) {
    return `<div class="effect-label">ЭФФЕКТИВНОСТЬ</div><div class="efficiency">${REGULAR.map(
      (enemy) => {
        const value = TYPES[type].effect[enemy];
        return `<div class="eff-item ${value > 100 ? "good" : value < 100 ? "weak" : ""}" data-eff="${enemy}" title="${ET[enemy].name}">${sprites.enemyIcon(enemy)}<span>${ET[enemy].name}</span><b>${value}</b></div>`;
      },
    ).join("")}</div>`;
  }
  function syncEffectPanel() {
    const t = selectedTower(),
      panel = $("#effectPanel");
    const show = !!t && effOpen;
    panel.classList.toggle("open", show);
    panel.setAttribute("aria-hidden", String(!show));
    panel.inert = !show;
    if (t) panel.innerHTML = effectiveness(t.type);
    const toggle = $("#effectToggle");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(show));
      toggle.classList.toggle("active", show);
    }
  }
  function shotInterval(t, v = stat(t)) {
    return t.type === "machine"
      ? Math.max(0.025, v.interval * (1 - 0.84 * (t.spin || 0)))
      : v.interval;
  }
  function cycleInterval(t, v) {
    return (
      v.interval +
      (t.type === "laser" ? 0.24 * (v.burst - 1) : t.type === "pyro" ? 0.17 * (v.burst - 1) : 0)
    );
  }
  function towerNote(t) {
    const v = stat(t);
    return (
      {
        pyro: `Залп ${v.burst} ракет · 0,17 с между ними. Салют: −${Math.round(v.slow * 100)}% скорости на 2,5 с; +${(v.percent * 100).toFixed(1)}% HP. Босс не получает урон от HP.`,
        laser: `0,24 с между пулями · перезарядка ${v.interval.toFixed(2)} с. −${v.strip.toFixed(1)} п.п. защиты на 2 с · не суммируется`,
        summon: `Порезы оставляют кровотечение на 3 с. При убийстве: ${Math.round(v.summonChance * 100)}% призвать союзника из ядра, HP ${Math.round(v.allyHP)}. Идёт к порталу и таранит первого врага; таран равен HP и игнорирует броню.`,
        vortex: `Ураган живёт ${v.life.toFixed(1)} с, движется к порталу и наносит ${v.damage.toFixed(1)} урона/с. Замедление 18%. Цели ниже ${Math.round(v.threshold * 100)}% HP уносит до 0,65 с, затем иммунитет 3 с. Босса не уносит. Урон вихрей не складывается.`,
        tesla: `Цепь до ${v.chains} врагов, скачок ${(v.jump / C).toFixed(1)} клетки. Каждый скачок сохраняет ${Math.round(v.decay * 100)} урона из 100.`,
        acid: `Кислота: ${v.corrosion.toFixed(0)} п.п. защиты на 4 с и ${(v.damage * 0.65 * v.poison).toFixed(1)} урона/с. Сильнейший эффект обновляется, не складывается.`,
        mortar: `Дальняя навесная атака по прогнозу движения. Взрыв радиусом ${(v.area / C).toFixed(1)} клетки. Площадь отмечена до попадания.`,
        prism: `Мгновенный луч пробивает всех врагов по прямой, ширина ${v.width.toFixed(0)}.`,
        pulse: `Круговая волна поражает всех в радиусе и замедляет на 20% на 1 с.`,
        cut: `Каждый Разрез запоминает свой урон по цели. Последующие порезы усиливаются до ×${1 + (mods(t).woundCap || 2)}. Короткий радиус — высокая частота атак.`,
        boomerang: `Пробивает врагов на вылете и возврате. За каждую уникальную цель на вылете: +${Math.round(18 * (mods(t).returnBonus || 1))}% урона обратного пути, максимум +${Math.round((mods(t).returnCap || 1.8) * 100)}%.`,
        freeze: `Сосулька: ${(v.icicle * 100).toFixed(1)}% шанс, заморозка ${v.freezeDuration.toFixed(2)} с. Снежки накапливают холод: при 60% — заморозка. После неё защита от повторной заморозки на 1,8 с.`,
        machine: `Разгон: ${Math.round((t.spin || 0) * 100)}%. Полный разгон за ${(4 / (mods(t).spinup || 1)).toFixed(1)} с непрерывной атаки; без цели остывает. Огненная пуля: строго 4%, поджог на 4 с. Улучшения стоят дороже.`,
      }[t.type] || ""
    );
  }
  function statsMarkup(t) {
    const v = stat(t),
      n = stat(t, true);
    const extra = {
      summon: [
        "Шанс призыва",
        Math.round(v.summonChance * 100) + "%",
        Math.round(n.summonChance * 100) + "%",
      ],
      pyro: ["Ракет в залпе", v.burst, n.burst],
      laser: ["Пуль в очереди", v.burst, n.burst],
      sniper: ["Крит. урон", "×2", "×2"],
      splash: ["Радиус взрыва", (v.area / C).toFixed(2), (n.area / C).toFixed(2)],
      vortex: ["Жизнь урагана", v.life.toFixed(1) + "с", n.life.toFixed(1) + "с"],
      tesla: ["Целей цепи", v.chains, n.chains],
      acid: ["Снятие защиты", v.corrosion.toFixed(0), n.corrosion.toFixed(0)],
      mortar: ["Радиус взрыва", (v.area / C).toFixed(2), (n.area / C).toFixed(2)],
      prism: ["Ширина луча", v.width.toFixed(0), n.width.toFixed(0)],
      pulse: ["Волна", "360°", "360°"],
      cut: [
        "Усиление порезов",
        `до ×${1 + (mods(t).woundCap || 2)}`,
        `до ×${1 + (mods(t).woundCap || 2)}`,
      ],
      boomerang: [
        "Бонус возврата",
        `до +${Math.round((mods(t).returnCap || 1.8) * 100)}%`,
        `до +${Math.round((mods(t).returnCap || 1.8) * 100)}%`,
      ],
      freeze: [
        "Шанс сосульки",
        (v.icicle * 100).toFixed(1) + "%",
        (n.icicle * 100).toFixed(1) + "%",
      ],
      machine: ["Огненная пуля", "4%", "4%"],
    }[t.type] || [
      "Урон / с",
      (v.damage / v.interval).toFixed(1),
      (n.damage / n.interval).toFixed(1),
    ];
    const rate = (x) =>
      1 /
      ((t.type === "machine" ? shotInterval(t, x) : cycleInterval(t, x)) * (t.jammed ? 1.45 : 1));
    return `<div class="stat-grid">${[
      ["Радиус", (v.range / C).toFixed(2), (n.range / C).toFixed(2), "range"],
      [
        t.type === "vortex" ? "Урон / с" : "Урон",
        v.damage.toFixed(1),
        n.damage.toFixed(1),
        "damage",
      ],
      [
        t.type === "laser" ? "Очередей / с" : t.type === "pyro" ? "Залпов / с" : "Атак / с",
        rate(v).toFixed(2),
        rate(n).toFixed(2),
        "rate",
      ],
      [
        "Поворот",
        ((v.rotation * 180) / Math.PI).toFixed(0) + "°",
        ((n.rotation * 180) / Math.PI).toFixed(0) + "°",
        "rotation",
      ],
      [
        t.type === "summon"
          ? "HP союзника"
          : t.type === "sniper"
            ? "Прицеливание"
            : ["cut", "tesla", "prism", "pulse"].includes(t.type)
              ? "Тип атаки"
              : t.type === "vortex"
                ? "Ход к порталу"
                : "Скорость снаряда",
        t.type === "summon"
          ? Math.round(v.allyHP)
          : t.type === "sniper"
            ? v.aim.toFixed(2) + "с"
            : {
                cut: "Порез",
                tesla: "Молния",
                prism: "Луч",
                pulse: "Волна",
                vortex: (22 / C).toFixed(2),
              }[t.type] || (v.projectile / C).toFixed(1),
        t.type === "summon"
          ? Math.round(n.allyHP)
          : t.type === "sniper"
            ? n.aim.toFixed(2) + "с"
            : {
                cut: "Порез",
                tesla: "Молния",
                prism: "Луч",
                pulse: "Волна",
                vortex: (22 / C).toFixed(2),
              }[t.type] || (n.projectile / C).toFixed(1),
        "projectile",
      ],
      [...extra, "unique"],
    ]
      .map(
        ([label, value, next, key]) =>
          `<div class="stat-cell ${key}" title="${label}; после улучшения: ${next}"><small>${label}</small><b data-stat="${key}">${value}</b><span class="stat-next">→ ${next}</span></div>`,
      )
      .join("")}</div>`;
  }
  function abilityMarkup(t) {
    const row = (start, end) =>
      MODULES[t.type]
        .slice(start, end)
        .map((a, i) => {
          const id = String(start + i);
          return `<button class="ability ${t.abilities.includes(id) ? "chosen" : ""}" data-ability="${id}" ${canAbility(t, id) ? "" : "disabled"} title="${a.desc}"><span>${sprites.abilityIcon(t.type, start + i)}</span><b>${a.name}</b><small>${a.desc}</small></button>`;
        })
        .join("");
    return `<div class="ability-title">МОДУЛИ <span>XP 4 / 7 · две из трёх</span></div><div class="ability-list">${row(0, 3)}</div><div class="ability-title ultimate-title">ПРЕДЕЛЬНАЯ СПОСОБНОСТЬ <span>XP 20 · одна из двух</span></div><div class="ability-list ultimate-list">${row(3, 5)}</div>`;
  }

  function renderPanel() {
    const panel = $("#panel"),
      t = selectedTower(),
      e = selectedEnemy(),
      show = !!t || !!e || selected?.kind === "platform";
    panel.classList.toggle("open", show);
    panel.setAttribute("aria-hidden", String(!show));
    panel.inert = !show;
    if (!show) {
      effOpen = false;
      syncEffectPanel();
      return;
    }
    let content = "";
    if (t) {
      const b = TYPES[t.type],
        cost = upCost(t);
      panel.style.setProperty("--tower-color", b.color);
      content = `<div class="panel-header"><h2>${b.name}</h2><button class="close" id="closePanel" aria-label="Закрыть">×</button></div><div class="tower-heading">${sprites.icon(t.type)}<span class="xp-level" id="rankText">L${t.rank}</span><span class="rank-kills" id="killsText">${t.kills} убийств</span></div><div class="progress"><i id="xpProgress" style="width:${t.rank >= 20 ? 100 : (t.xp / xpNeed(t)) * 100}%"></i></div><div class="xp-caption"><span id="xpText">XP ${Math.floor(t.xp)} / ${xpNeed(t)}</span><span id="powerText">PWR +${Math.round((stat(t).pwr - 1) * 100)}%</span></div><div class="frozen-banner ${t.frozen ? "" : "hidden"}" id="frozenBanner">Кристаллизована<br><small>Не стреляет. Нельзя улучшить или продать.<br>Освободится после гибели босса.</small></div><button class="effect-toggle" id="effectToggle" aria-controls="effectPanel" aria-expanded="false">Эффективность <span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 5 5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></span></button>${statsMarkup(t)}${towerNote(t) ? `<div class="laser-note" id="towerNote">${towerNote(t)}</div>` : ""}<button class="target-button" id="targetMode">Приоритет: ${targetLabel(t.targetMode)}</button><div id="abilityBlock">${abilityMarkup(t)}</div><div class="upgrade-label">УРОВЕНЬ УЛУЧШЕНИЯ <b>${t.level} / 10</b></div><div class="upgrade-strip">${Array.from({ length: 10 }, (_, i) => `<i class="${i < t.level ? "filled" : ""}"></i>`).join("")}</div><button class="upgrade-main" id="upgrade" ${state.ended || t.frozen || t.level >= 10 || state.money < cost ? "disabled" : ""}><span>↑ Улучшить</span><b>${t.level >= 10 ? "MAX" : cost + " " + coin}</b></button><button class="sell" id="sell" ${t.frozen || state.ended ? "disabled" : ""}><span>Продать</span><span>${Math.floor(t.spent * 0.7)} ${coin}</span></button>`;
    } else if (e) {
      panel.style.setProperty("--tower-color", ET[e.type].color);
      content = `<div class="panel-header"><h2>${ET[e.type].name}</h2><button class="close" id="closePanel" aria-label="Закрыть">×</button></div><div class="enemy-profile">${sprites.enemyIcon(e.type)}<div><b id="enemyHP"></b><small>ЗДОРОВЬЕ</small></div></div><div class="enemy-detail" id="enemyDetail"></div>`;
    } else {
      panel.style.setProperty("--tower-color", "#888");
      content = `<div class="panel-header"><h2>Построить</h2><button class="close" id="closePanel" aria-label="Закрыть">×</button></div><div class="tower-list" aria-label="Башни для строительства">${Object.entries(
        TYPES,
      )
        .map(
          ([type, b]) =>
            `<button class="tower-card" data-build="${type}" title="${b.name} · ${b.price} монет" aria-label="${b.name}, ${b.price} монет" ${state.money < b.price || state.ended ? "disabled" : ""}>${sprites.icon(type)}<span class="price">${b.price}</span></button>`,
        )
        .join(
          "",
        )}</div><p class="build-help">Выберите башню · название при наведении<br>Перетаскивание — камера · колесо — масштаб</p>`;
    }
    if (t) {
      const cut = content.indexOf('<div class="upgrade-label">');
      const headerEnd = content.indexOf("</div>") + 6;
      content =
        content.slice(0, headerEnd) +
        '<div class="panel-scroll">' +
        content.slice(headerEnd, cut) +
        '</div><div class="panel-actions">' +
        content.slice(cut) +
        "</div>";
    }
    panel.innerHTML = `<div class="panel-content">${content}</div>`;
    $("#closePanel").onclick = () => {
      selected = null;
      buildType = null;
      renderPanel();
    };
    $$("[data-build]").forEach((b) => (b.onclick = () => chooseBuild(b.dataset.build)));
    syncEffectPanel();
    if (t) {
      $("#effectToggle").onclick = () => {
        effOpen = !effOpen;
        syncEffectPanel();
      };
      $("#upgrade").onclick = () => {
        const c = upCost(t);
        if (t.frozen || t.level >= 10 || state.money < c || state.ended) return;
        state.money -= c;
        t.spent += c;
        t.level++;
        audio.effect("ui");
        renderPanel();
        updateHUD();
      };
      $("#sell").onclick = () => {
        if (t.frozen || state.ended) return;
        state.money += Math.floor(t.spent * 0.7);
        state.towers = state.towers.filter((v) => v !== t);
        selected = null;
        audio.effect("ui");
        renderPanel();
        updateHUD();
      };
      $("#targetMode").onclick = () => {
        t.targetMode = (t.targetMode + 1) % 4;
        t.target = null;
        $("#targetMode").textContent = "Приоритет: " + targetLabel(t.targetMode);
      };
      bindAbilities(t);
    }
    refreshPanel();
  }
  function targetLabel(mode) {
    return ["Первый", "Сильнейший", "Слабейший", "Быстрый"][mode];
  }
  function bindAbilities(t) {
    $$("[data-ability]").forEach(
      (b) =>
        (b.onclick = () => {
          if (!canAbility(t, b.dataset.ability)) return;

          t.abilities.push(b.dataset.ability);
          audio.effect("ui");
          renderPanel();
        }),
    );
  }
  function defense(e) {
    const base = Math.min(
      95,
      (e.shield > 0 ? (e.shieldDefense ?? ET[e.type].shieldDefense) : e.defense) + (e.guard || 0),
    );
    const reduction = (e.debuffTime > 0 ? e.debuff : 0) + (e.acidTime > 0 ? e.corrosion || 0 : 0);
    // Crystal armor can be weakened, but cannot be fully stripped by stacked debuffs.
    return Math.max(0, base - (isBoss(e) ? Math.min(12, reduction) : reduction));
  }
  function enemyNote(e) {
    if (isElite(e) && e.type !== "boss" && e.type !== "minion")
      return `<p>${{ magma: "Магма понижает урон и темп башен. Лавовый след ускоряет врагов на 35%.", magmaMinion: "Медленный тяжёлый миньон. Лава ускоряет его, как и остальных врагов.", asterix: "Голова получает лишь 8% урона, пока жив хотя бы один сегмент хвоста. Лечит союзников каждые 6 с.", asterPart: "Самостоятельная часть хвоста. Уничтожьте все девять сегментов, чтобы открыть голову.", cosmo: "Три полосы HP. Открывает удалённые от ядра порталы и стирает платформы с предупреждением 2,4 с.", cosmicMinion: "Выходит из пространственного разлома Космо." }[e.type]}</p>`;
    return `<p>${{ medic: "Каждые 4 с лечит на 5% максимального HP себя и союзников в радиусе 2 клеток (кроме босса).", guardian: "Прикрывает союзников рядом: +12 п.п. защиты. Ауры не складываются.", sprinter: "Каждые 5 с рывок на 1 с: скорость ×1,9.", splitter: "При гибели распадается на двух быстрых осколков с 18% его HP. Награда за осколок — 2 монеты.", jammer: "В радиусе 2,7 клетки замедляет перезарядку башен в 1,45 раза. Поля не складываются." }[e.type] || ""}</p>`;
  }
  function refreshPanel() {
    $$("[data-build]").forEach(
      (b) => (b.disabled = state.money < TYPES[b.dataset.build].price || state.ended),
    );
    const t = selectedTower(),
      e = selectedEnemy();
    if (t && $("#rankText")) {
      const v = stat(t);
      $("#rankText").textContent = "L" + t.rank;
      $("#killsText").textContent = t.kills + " убийств";
      $("#xpText").textContent = t.rank >= 20 ? "MAX XP" : `XP ${Math.floor(t.xp)} / ${xpNeed(t)}`;
      $("#xpProgress").style.width = (t.rank >= 20 ? 100 : (t.xp / xpNeed(t)) * 100) + "%";
      $("#powerText").textContent = "PWR +" + Math.round((v.pwr - 1) * 100) + "%";
      const area = $(".stat-grid");
      area.innerHTML = statsMarkup(t).replace(/^<div class="stat-grid">|<\/div>$/g, "");
      $("#frozenBanner").classList.toggle(
        "hidden",
        !t.frozen && !(t.stun > 0) && !t.jammed && !(t.magmaTime > 0),
      );
      $("#frozenBanner").innerHTML = t.frozen
        ? "Кристаллизована<br><small>Не стреляет. Нельзя улучшить или продать.<br>Освободится после гибели босса.</small>"
        : t.stun > 0
          ? `Оглушена · ${(t.stun || 0).toFixed(1)} с<small>Звуковая волна Саунда временно блокирует стрельбу.</small>`
          : t.magmaTime > 0
            ? `Магма · ${t.magmaTime.toFixed(1)} с<small>Урон −30%, скорость атаки −45%. Можно улучшать и продавать.</small>`
            : "Помехи · перезарядка ×1,45<small>Поле Глушителя замедляет работу башни. Улучшение и продажа доступны.</small>";
      $("#upgrade").disabled = t.frozen || state.ended || t.level >= 10 || state.money < upCost(t);
      $("#sell").disabled = t.frozen || state.ended;
      const key = t.rank + ":" + t.abilities.join(",") + ":" + t.frozen;
      if ($("#abilityBlock").dataset.key !== key) {
        $("#abilityBlock").innerHTML = abilityMarkup(t);
        $("#abilityBlock").dataset.key = key;
        bindAbilities(t);
      }
      if ($("#towerNote")) $("#towerNote").textContent = towerNote(t);
    }
    if (e && $("#enemyHP")) {
      $("#enemyHP").textContent = `${Math.ceil(e.hp)} / ${e.maxHp}`;
      $("#enemyDetail").innerHTML =
        `${enemyNote(e)}<div><span>Защита</span><b>${defense(e).toFixed(1)}%</b></div><div><span>Скорость</span><b>${enemySpeed(e).toFixed(0)}</b></div>${e.debuffTime > 0 ? `<p class="debuff-note">Лазер: −${e.debuff.toFixed(1)} п.п. · ${e.debuffTime.toFixed(1)} с</p>` : ""}${e.type === "fighter" ? `<p>Ярость: +${Math.round((e.rage || 0) * 100)} к скорости. Полученный урон ускоряет бойца; ярость постепенно спадает.</p>` : ""}${e.type === "sound" ? `<p>Раз в 5 с оглушает ближайшую башню на 1,1 с в радиусе 3,2 клетки.</p>` : ""}${e.slowTime > 0 ? `<p>Замедление: ${Math.round(e.slow * 100)}% · ${e.slowTime.toFixed(1)} с</p>` : ""}${e.freezeTime > 0 ? `<p>Заморожен · ${e.freezeTime.toFixed(1)} с</p>` : ""}${e.burnTime > 0 ? `<p>Горит · ${e.burnTime.toFixed(1)} с</p>` : ""}${e.chill > 0 ? `<p>Накопленный холод: ${Math.round(e.chill * 100)}</p>` : ""}${e.type === "boss" ? `<div><span>Кристаллическая сетка</span><b>${Math.ceil(e.shield)} / ${e.maxShield}</b></div><p>Кристаллизует 2 башни в радиусе 5,7 клетки: опаснейшую и ближайшую из остальных. Луч раз в 10 с, после разрушения сетки — в 8 с. Призывает 3 миньонов раз в 10 с, во второй фазе — 4 раз в 8 с. Замедление не выше 25%, заморозка до 0,5 с с иммунитетом 6 с; снижение защиты не выше 12 п.п.</p>` : ""}`;
    }
  }
  function chooseBuild(type) {
    if (state.ended) return;
    if (state.money < TYPES[type].price) {
      toast("Недостаточно монет");
      return;
    }
    if (selected?.kind !== "platform" || selected.p.destroyed) {
      toast("Сначала выберите свободную платформу");
      return;
    }
    build(selected.p, type);
  }

  function build(p, type) {
    p = platforms.find((a) => a.c === p?.c && a.r === p?.r);
    if (!p || p.destroyed || towerAt(p) || state.money < TYPES[type].price || state.ended) return;
    if (state.ended || towerAt(p) || state.money < TYPES[type].price) return;
    state.money -= TYPES[type].price;
    const t = {
      id: ++towerID,
      type,
      x: p.x,
      y: p.y,
      c: p.c,
      r: p.r,
      angle: -Math.PI / 2,
      cool: 0.15,
      level: 0,
      rank: 1,
      xp: 0,
      kills: 0,
      spent: TYPES[type].price,
      abilities: [],
      targetMode: 0,
      target: null,
      aim: 0,
      burstLeft: 0,
      spin: 0,
      stun: 0,
      frozen: false,
      marked: 0,
      damageDone: 0,
    };
    state.towers.push(t);
    buildType = null;
    selected = { kind: "tower", id: t.id };
    state.fx.push({ type: "build", x: t.x, y: t.y, color: TYPES[type].color, life: 0.6, max: 0.6 });
    audio.effect("build");
    renderPanel();
    updateHUD();
  }
  function updateHUD() {
    $("#hp").textContent = state.hp;
    $("#money").textContent = Math.floor(state.money);
    $("#wave").textContent = state.wave;
    $("#start").classList.toggle("hidden", state.wave > 0 && !state.ended);
    $("#waveInfo").classList.toggle("hidden", state.wave === 0 || state.ended);
    $("#start").innerHTML = state.ended
      ? "Заново"
      : '<svg viewBox="0 0 24 24"><path d="M5 2v20l17-10z"/></svg>Начать';
    $("#boardState").textContent = paused
      ? "Пауза"
      : state.active
        ? `Волна ${state.wave} / ${FINAL_WAVE}`
        : `Следующая через ${Math.max(0, Math.ceil(autoTimer))}`;
    $("#status").textContent = state.active
      ? `Осталось ${state.enemies.filter((e) => !e.dead).length + state.spawn.length} врагов`
      : `Бонус +${state.wave ? WAVES[state.wave - 1].bonus : 0} · подготовка`;
    $("#waveProgress").style.width =
      clamp(
        state.active
          ? 100 *
              (1 - (state.enemies.length + state.spawn.length) / WAVES[state.wave - 1].queue.length)
          : (autoTimer / 5) * 100,
        0,
        100,
      ) + "%";
    updateBossHUD();
  }
  function updateBossHUD() {
    let b = state.boss;
    if (b?.dead) {
      const next = state.enemies.find((e) => !e.dead && isBoss(e));
      if (next) state.boss = b = next;
    }
    const visible = b && (!b.dead || clock - (b.diedAt || 0) < 1.8);
    $("#bossBar").classList.toggle("visible", !!visible);
    if (!b) return;
    $("#bossName").textContent = ET[b.type].name.toUpperCase();
    $("#bossBar").classList.toggle("cosmo", b.type === "cosmo");
    $("#bossThird").classList.toggle("hidden", b.type !== "cosmo");
    $("#bossShieldFill").parentElement.classList.toggle(
      "hidden",
      !["boss", "asterix", "cosmo"].includes(b.type),
    );
    $("#bossHPFill").style.width = Math.max(0, (b.hp / b.maxHp) * 100) + "%";
    $("#bossHPText").textContent = `${Math.max(0, Math.ceil(b.hp))} / ${Math.round(b.maxHp)}`;
    if (b.type === "boss") {
      $("#bossShieldFill").style.width = Math.max(0, (b.shield / b.maxShield) * 100) + "%";
      $("#bossShieldText").textContent =
        b.shield > 0 ? `СЕТКА ${Math.ceil(b.shield)} / ${b.maxShield}` : "СЕТКА РАЗРУШЕНА";
      $("#bossPhase").textContent = b.dead
        ? "ПОБЕЖДЁН"
        : b.shield > 0
          ? "КРИСТАЛЛИЧЕСКАЯ СЕТКА"
          : "ЯРОСТЬ ЯДРА";
    } else if (b.type === "cosmo") {
      const percent = Math.max(0, (b.hp / b.maxHp) * 100),
        layers = b.dead ? 0 : b.layersLeft;
      $("#bossShieldFill").style.width = (layers === 3 ? percent : 0) + "%";
      $("#bossHPFill").style.width = (layers > 2 ? 100 : layers === 2 ? percent : 0) + "%";
      $("#bossThirdFill").style.width = (layers > 1 ? 100 : layers === 1 ? percent : 0) + "%";
      $("#bossShieldText").textContent = `ОБОЛОЧКИ ${layers} / 3`;
      $("#bossPhase").textContent = b.dead
        ? "ПОБЕЖДЁН"
        : layers === 1
          ? "РАЗРЫВ ПРОСТРАНСТВА"
          : "ПРОСТРАНСТВЕННЫЙ ШТОРМ";
    } else if (b.type === "asterix") {
      const parts = b.parts || [],
        alive = parts.filter((p) => !p.dead),
        sum = parts.reduce((s, p) => s + Math.max(0, p.hp), 0),
        max = parts.reduce((s, p) => s + p.maxHp, 0);
      $("#bossShieldFill").style.width = (max ? (sum / max) * 100 : 0) + "%";
      $("#bossShieldText").textContent = `ХВОСТ ${alive.length} / 9`;
      $("#bossPhase").textContent = b.dead
        ? "ПОБЕЖДЁН"
        : alive.length
          ? "ГОЛОВА ЗАЩИЩЕНА · УРОН 8 / 100"
          : "ГОЛОВА УЯЗВИМА";
    } else {
      $("#bossShieldText").textContent = "МАГМОВЫЙ СЛЕД · УСКОРЕНИЕ ВРАГОВ";
      $("#bossPhase").textContent = b.dead
        ? "ПОБЕЖДЁН"
        : b.hp < b.maxHp * 0.5
          ? "ВУЛКАНИЧЕСКИЙ ВЫБРОС"
          : "СЕРДЦЕ РАЗЛОМА";
    }
  }
  function startWave() {
    if (state.active || state.ended || state.wave >= FINAL_WAVE) return;
    const w = WAVES[state.wave++];
    state.active = true;
    state.spawn = [...w.queue];
    state.spawnTimer = 0.25;
    autoTimer = 0;
    audio.startMusic();
    updateHUD();
  }
  function finishWave() {
    state.active = false;
    state.cleared = state.wave;
    state.money += WAVES[state.wave - 1].bonus;
    if (state.wave === FINAL_WAVE) {
      end(true);
      return;
    }
    autoTimer = 5;
    refreshPanel();
    updateHUD();
  }
  function openDialog(id) {
    const d = $("#" + id);
    d.classList.remove("closing");
    if (!d.open) d.showModal();
  }
  function closeDialog(d) {
    if (d.classList.contains("closing")) return;
    d.classList.add("closing");
    setTimeout(() => {
      d.close();
      d.classList.remove("closing");
    }, 160);
  }
  function end(win, message) {
    if (state.ended) return;
    state.ended = true;
    state.active = false;
    state.spawn = [];
    autoTimer = 0;
    $("#endLabel").textContent = win ? "КОНТУР ЗАЩИЩЁН" : "СИГНАЛ ПОТЕРЯН";
    $("#endTitle").textContent = win
      ? `${ET[currentLevel.boss].name} повержен.`
      : "Оборона прорвана.";
    $("#endText").textContent =
      message ||
      (win
        ? "Все 40 волн отражены. Сектор защищён."
        : "Усильте башни и используйте эффективность против разных врагов.");
    $("#endWaves").textContent = state.cleared;
    $("#endKills").textContent = state.kills;
    $("#endHP").textContent = state.hp;
    updateHUD();
    refreshPanel();
    openDialog("endModal");
  }
  function posAt(d) {
    d = clamp(d, 0, pathLength);
    for (const s of segments)
      if (d <= s.offset + s.len) {
        const f = (d - s.offset) / s.len;
        return {
          x: s.a.x + (s.b.x - s.a.x) * f,
          y: s.a.y + (s.b.y - s.a.y) * f,
          angle: Math.atan2(s.b.y - s.a.y, s.b.x - s.a.x),
        };
      }
    return { ...points.at(-1), angle: 0 };
  }
  function spawnEnemy(type, dist = 0) {
    const p = posAt(dist),
      hp = WAVES[Math.max(0, state.wave - 1)].hp[type] ?? ET[type].hp,
      e = {
        id: ++enemyID,
        type,
        dist,
        x: p.x,
        y: p.y,
        angle: p.angle,
        hp,
        maxHp: hp,
        defense: ET[type].defense,
        debuff: 0,
        debuffTime: 0,
        shield: type === "boss" ? ET.boss.shield : 0,
        maxShield: type === "boss" ? ET.boss.shield : 0,
        dead: false,
        hit: 0,
        volley: 6,
        pulse: 3,
        rage: 0,
        slow: 0,
        slowTime: 0,
        chill: 0,
        chillTime: 0,
        freezeTime: 0,
        freezeLock: 0,
        pushLock: 0,
        burnTime: 0,
        burnDps: 0,
        burnOwner: null,
        cuts: {},
        summon: 7,
        speed: ET[type].speed,
        reward: ET[type].reward,
        abilityTimer: 5,
        trailTimer: 0,
        portalTimer: 8,
        eraseTimer: 11,
        healTimer: 5,
        layersLeft: type === "cosmo" ? 3 : 1,
      };
    state.enemies.push(e);
    if (isBoss(e)) {
      state.boss = e;
      for (const t of state.towers) t.bossDamage = 0;
      audio.setBoss(true);
      toast(`${ET[type].name.toUpperCase()} · босс сектора`);
      if (type === "asterix") {
        e.parts = [];
        for (let i = 1; i < 10; i++) {
          const part = spawnEnemy("asterPart", Math.max(0, dist - i * 38));
          part.head = e;
          part.segment = i;
          e.parts.push(part);
        }
      }
    }
    return e;
  }
  function damage(e, raw, t, laser = false, allyHit = false) {
    if (e.dead) return 0;
    const efficacy = isElite(e) || allyHit ? 100 : TYPES[t.type].effect[e.type];
    const m = mods(t);
    const cutBoost =
      t.type === "cut"
        ? 1 + Math.min(m.woundCap || 2, ((e.cuts?.[t.id] || 0) / e.maxHp) * 4 * (m.wound || 1))
        : 1;
    const headGuard = e.type === "asterix" && e.parts?.some((p) => !p.dead) ? 0.08 : 1;
    const scaled =
      headGuard *
      ((raw * cutBoost * efficacy * (m.execute && e.hp / e.maxHp < 0.35 ? 1.6 : 1)) / 100) *
      (allyHit ? 1 : 1 - defense(e) / 100);
    let actual = 0;
    if (e.shield > 0) {
      const absorbed = Math.min(e.shield, scaled);
      e.shield -= absorbed;
      actual += absorbed;
      const rest = scaled - absorbed;
      if (e.shield <= 0) {
        state.fx.push({
          type: "blast",
          x: e.x,
          y: e.y,
          r: 95,
          color: "#8cebf0",
          life: 0.9,
          max: 0.9,
        });
        e.volley = Math.min(e.volley, 3);
        e.summon = Math.min(e.summon, 3);
        toast(
          e.type === "boss" ? "Сетка разрушена · Кристалликс впадает в ярость" : "Щит разрушен",
        );
      }
      if (rest > 0) {
        const taken = Math.min(e.hp, rest);
        e.hp -= taken;
        actual += taken;
      }
    } else {
      actual = Math.min(e.hp, scaled);
      e.hp -= actual;
    }
    if (t.type === "cut") {
      e.cuts ??= {};
      e.cuts[t.id] = (e.cuts[t.id] || 0) + actual;
    }
    if (e.type === "fighter") e.rage = Math.min(1.8, (e.rage || 0) + (actual / e.maxHp) * 4);
    if (raw >= 2 && !["cut", "summon"].includes(t.type)) e.hit = 0.07;
    t.damageDone += actual;
    if (isBoss(e)) t.bossDamage = (t.bossDamage || 0) + actual;
    addXP(t, Math.min(actual / 90, (actual / e.maxHp) * 12));
    if (laser && !e.dead) {
      e.debuff = Math.max(e.debuff, stat(t).strip);
      e.debuffTime = 2;
    }
    if (e.hp <= 0 && e.type === "cosmo" && e.layersLeft > 1) {
      e.layersLeft--;
      e.hp = e.maxHp;
      e.portalTimer = Math.min(e.portalTimer, 2);
      e.eraseTimer = Math.min(e.eraseTimer, 3);
      toast(`Космо · оболочка разрушена · осталось ${e.layersLeft}`);
      state.fx.push({
        type: "blast",
        x: e.x,
        y: e.y,
        r: 100,
        color: "#c898ff",
        life: 0.8,
        max: 0.8,
      });
      return actual;
    }
    if (e.hp <= 0) {
      e.hp = 0;
      e.dead = true;
      e.diedAt = clock;
      state.kills++;
      state.money += e.fragment ? 2 : (e.reward ?? ET[e.type].reward);
      t.kills++;
      addXP(t, 2);
      state.fx.push({
        type: "death",
        x: e.x,
        y: e.y,
        color: ET[e.type].color,
        life: isBoss(e) ? 1.4 : 0.35,
        max: isBoss(e) ? 1.4 : 0.35,
        r: isBoss(e) ? 85 : 22,
      });
      if (t.type === "summon" && Math.random() < stat(t).summonChance) summonAlly(t);
      if (e.type === "splitter" && !e.fragment) {
        for (let j = 0; j < 2; j++) {
          const child = spawnEnemy("fast", Math.max(0, e.dist - j * 18));
          child.hp = child.maxHp = e.maxHp * 0.18;
          child.fragment = true;
          child.defense = 0;
        }
      }
      if (isBoss(e)) {
        if (e.parts) for (const p of e.parts) p.dead = true;
        state.portals = state.portals.filter((p) => p.owner !== e);
        state.hazards = state.hazards.filter((p) => p.owner !== e);
        state.bossDefeated = true;
        audio.setBoss(state.enemies.some((b) => b !== e && !b.dead && isBoss(b)));
        for (const v of state.towers) {
          v.frozen = false;
          v.marked = 0;
        }
        state.shots = state.shots.filter((p) => p.type !== "crystalBeam");
        toast(`${ET[e.type].name} повержен · башни освобождены`);
        renderPanel();
      }
    }
    return actual;
  }
  function pickTarget(t) {
    const s = stat(t),
      list = state.enemies.filter((e) => !e.dead && Math.hypot(e.x - t.x, e.y - t.y) <= s.range);
    if (!list.length) return null;
    list.sort((a, b) =>
      t.targetMode === 1
        ? b.hp + b.shield - (a.hp + a.shield)
        : t.targetMode === 2
          ? a.hp + a.shield - (b.hp + b.shield)
          : t.targetMode === 3
            ? enemySpeed(b) - enemySpeed(a)
            : b.dist - a.dist,
    );
    return list[0];
  }
  function fire(t, e) {
    const v = stat(t);
    t.cool = shotInterval(t, v);
    const m = { x: t.x + Math.cos(t.angle) * 24, y: t.y + Math.sin(t.angle) * 24 };
    if (!["cut", "summon", "pulse", "vortex"].includes(t.type))
      state.fx.push({
        type: "muzzle",
        x: m.x,
        y: m.y,
        color: TYPES[t.type].color,
        life: 0.08,
        max: 0.08,
      });
    if (t.type === "summon") {
      damage(e, v.damage * 0.35, t);
      e.bleedTime = 3;
      if (!e.bleedOwner || v.damage * 0.8 * (mods(t).bleed || 1) >= e.bleedDps) {
        e.bleedDps = v.damage * 0.8 * (mods(t).bleed || 1);
        e.bleedOwner = t;
      }
      state.fx.push({
        type: "slash",
        x: e.x,
        y: e.y,
        color: "#ff9ba8",
        r: 23,
        life: 0.22,
        max: 0.22,
        angle: Math.random() * Math.PI,
      });
      audio.effect("slice", t.x / W);
    } else if (t.type === "vortex") {
      state.shots.push({
        type: "hurricane",
        tower: t,
        dist: e.dist,
        ...posAt(e.dist),
        life: v.life,
        max: v.life,
        damage: v.damage,
        r: 34 * (mods(t).area || 1),
      });
      audio.effect("vortex", t.x / W);
    } else if (t.type === "tesla") {
      const hit = new Set();
      let from = t,
        target = e,
        power = 1;
      for (let i = 0; i < v.chains && target; i++) {
        hit.add(target.id);
        damage(target, v.damage * power, t);
        state.fx.push({
          type: "lightning",
          x: from.x,
          y: from.y,
          tx: target.x,
          ty: target.y,
          color: TYPES.tesla.color,
          life: 0.24,
          max: 0.24,
        });
        from = target;
        power *= v.decay;
        target = state.enemies
          .filter(
            (a) => !a.dead && !hit.has(a.id) && Math.hypot(a.x - from.x, a.y - from.y) <= v.jump,
          )
          .sort(
            (a, b) =>
              Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y),
          )[0];
      }
      audio.effect("laser", t.x / W);
    } else if (t.type === "prism") {
      const tx = t.x + Math.cos(t.angle) * v.range,
        ty = t.y + Math.sin(t.angle) * v.range;
      for (const a of state.enemies)
        if (!a.dead && segmentDistance(a.x, a.y, t.x, t.y, tx, ty) <= ET[a.type].r + v.width / 2)
          damage(a, v.damage, t);
      state.fx.push({
        type: "prismBeam",
        x: t.x,
        y: t.y,
        tx,
        ty,
        width: v.width,
        color: TYPES.prism.color,
        life: 0.3,
        max: 0.3,
      });
      audio.effect("laser", t.x / W);
    } else if (t.type === "pulse") {
      for (const a of state.enemies)
        if (!a.dead && Math.hypot(a.x - t.x, a.y - t.y) <= v.range) {
          damage(a, v.damage, t);
          applySlow(a, 0.2, 1);
          if (mods(t).shock) freezeEnemy(a, 0.45);
        }
      state.fx.push({
        type: "sonic",
        x: t.x,
        y: t.y,
        r: v.range,
        color: TYPES.pulse.color,
        life: 0.5,
        max: 0.5,
      });
      audio.effect("sonic", t.x / W);
    } else if (t.type === "cut") {
      damage(e, v.damage, t);
      state.fx.push({
        type: "slash",
        x: e.x,
        y: e.y,
        angle: t.angle + Math.PI / 4,
        r: 24,
        color: "#ffffff",
        life: 0.18,
        max: 0.18,
      });
      audio.effect("slice", t.x / W);
    } else if (t.type === "boomerang") {
      t.boomAway = true;
      state.shots.push({
        type: "boomerang",
        x: m.x,
        y: m.y,
        angle: t.angle,
        dx: Math.cos(t.angle),
        dy: Math.sin(t.angle),
        travel: 0,
        reach: v.range,
        speed: v.projectile,
        returning: false,
        hitsOut: new Set(),
        hitsBack: new Set(),
        damage: v.damage,
        tower: t,
        life: 5,
        rotation: 0,
      });
      audio.effect("boomerang", t.x / W);
    } else if (t.type === "sniper") {
      const crit = Math.random() < v.crit;
      damage(e, v.damage * (crit ? 2 : 1), t);
      state.fx.push({
        type: "beam",
        x: m.x,
        y: m.y,
        tx: e.x,
        ty: e.y,
        color: crit ? "#fff" : TYPES.sniper.color,
        life: 0.14,
        max: 0.14,
      });
      audio.effect("sniper", t.x / W);
    } else if (t.type === "splash" || t.type === "pyro" || t.type === "mortar") {
      if (t.type === "pyro" && t.burstLeft <= 0) t.burstLeft = v.burst;
      const duration = Math.hypot(e.x - t.x, e.y - t.y) / v.projectile,
        p = posAt(e.dist + enemySpeed(e) * duration);
      state.shots.push({
        type: t.type === "pyro" ? "firework" : t.type === "mortar" ? "shell" : "bomb",
        x: m.x,
        y: m.y,
        sx: m.x,
        sy: m.y,
        tx: p.x,
        ty: p.y,
        t: 0,
        duration: clamp(duration, 0.18, t.type === "mortar" ? 1.8 : 0.9),
        damage: v.damage,
        area: t.type === "pyro" ? 72 * (mods(t).area || 1) : v.area,
        percent: v.percent,
        slow: v.slow,
        tower: t,
        trail: [],
        hue: (t.burstLeft * 67 + t.id * 31) % 360,
      });
      if (t.type === "pyro") {
        t.burstLeft--;
        t.cool = t.burstLeft > 0 ? 0.17 : v.interval;
      }
      audio.effect(t.type === "pyro" ? "firework" : "cannon", t.x / W);
    } else {
      const laser = t.type === "laser";
      if (laser && t.burstLeft <= 0) t.burstLeft = v.burst;
      const icy = t.type === "freeze" && Math.random() < v.icicle;
      const incendiary = t.type === "machine" && Math.random() < 0.04;
      state.shots.push({
        type:
          t.type === "acid"
            ? "acid"
            : laser
              ? "laser"
              : t.type === "vortex"
                ? "vortex"
                : t.type === "freeze"
                  ? icy
                    ? "icicle"
                    : "snowball"
                  : incendiary
                    ? "incendiary"
                    : "bullet",
        x: m.x,
        y: m.y,
        target: e,
        damage: v.damage * (icy ? 1.6 : 1),
        tower: t,
        speed: v.projectile,
        life: 2,
      });
      if (laser) {
        t.burstLeft--;
        t.cool = t.burstLeft > 0 ? 0.24 : v.interval;
      }
      audio.effect(
        laser
          ? "laser"
          : t.type === "vortex"
            ? "vortex"
            : t.type === "freeze"
              ? "ice"
              : t.type === "machine"
                ? "machine"
                : "basic",
        t.x / W,
      );
    }
  }
  function bossAction(b, dt) {
    b.volley -= dt;
    b.summon -= dt;
    if (b.volley <= 0) {
      b.volley = b.shield > 0 ? 10 : 8;
      const candidates = state.towers.filter(
        (t) => !t.frozen && Math.hypot(t.x - b.x, t.y - b.y) < 320,
      );
      const threat = (t) => (t.bossDamage || 0) + (stat(t).damage / stat(t).interval) * 2;
      candidates.sort((a, c) => threat(c) - threat(a));
      const targets = candidates.length ? [candidates[0]] : [];
      const nearest = candidates
        .slice(1)
        .sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
      if (nearest) targets.push(nearest);
      for (const t of targets) {
        t.marked = clock + 1.3;
        state.shots.push({
          type: "crystalBeam",
          x: b.x,
          y: b.y,
          target: t,
          age: 0,
          duration: 1.3,
          life: 1.5,
          boss: b,
        });
      }
      if (targets.length) audio.effect("crystal", b.x / W);
    }
    if (b.summon <= 0) {
      b.summon = b.shield > 0 ? 10 : 8;
      const count = state.enemies.filter((e) => e.type === "minion" && !e.dead).length;
      for (let i = 0; i < Math.min(b.shield > 0 ? 3 : 4, 16 - count); i++) {
        spawnEnemy("minion", Math.max(0, b.dist - 24 - i * 18));
        state.summoned++;
      }
      state.fx.push({
        type: "blast",
        x: b.x,
        y: b.y,
        r: 55,
        color: "#a38bed",
        life: 0.6,
        max: 0.6,
      });
    }
  }
  function enemySpeed(e) {
    if (e.freezeTime > 0) return 0;
    const slow = Math.max(e.slowTime > 0 ? e.slow : 0, e.chill || 0);
    return (
      (e.speed ?? ET[e.type].speed) *
      (1 + (e.rage || 0)) *
      (state.lava.some((l) => Math.abs(l.dist - e.dist) < 65) && !isBoss(e) ? 1.35 : 1) *
      (e.type === "sprinter" && (e.dashCycle || 0) < 1 ? 1.9 : 1) *
      (1 - (isBoss(e) ? Math.min(0.25, slow) : slow))
    );
  }
  function applySlow(e, amount, duration) {
    if (e.dead) return;
    e.slow = Math.max(e.slowTime > 0 ? e.slow : 0, amount);
    e.slowTime = Math.max(e.slowTime || 0, duration);
  }
  function freezeEnemy(e, duration) {
    if (e.dead || e.freezeLock > 0) return false;
    const d = isBoss(e) ? Math.min(0.5, duration * 0.25) : duration;
    e.freezeTime = d;
    e.freezeLock = d + (isBoss(e) ? 6 : 1.8);
    e.chill = 0.15;
    state.fx.push({ type: "frost", x: e.x, y: e.y, r: 30, color: "#b4edff", life: 0.4, max: 0.4 });
    return true;
  }
  function projectileHit(p, e) {
    damage(e, p.damage, p.tower, p.type === "laser");
    if (e.dead) return;
    if (p.type === "acid") {
      const v = stat(p.tower);
      e.acidTime = 4;
      e.corrosion = Math.max(e.corrosion || 0, v.corrosion);
      if (!e.acidOwner || p.damage * 0.65 * v.poison >= e.acidDps) {
        e.acidDps = p.damage * 0.65 * v.poison;
        e.acidOwner = p.tower;
      }
    }
    if (p.type === "bullet" && mods(p.tower).ricochet) {
      const near = state.enemies
        .filter((a) => a !== e && !a.dead && Math.hypot(a.x - e.x, a.y - e.y) < 100)
        .slice(0, 2);
      for (const a of near) {
        damage(a, p.damage * 0.65, p.tower);
        state.fx.push({
          type: "beam",
          x: e.x,
          y: e.y,
          tx: a.x,
          ty: a.y,
          color: TYPES.basic.color,
          life: 0.12,
          max: 0.12,
        });
      }
    }
    if (p.type === "incendiary") {
      e.burnTime = 4;
      if (p.damage * 0.35 * (mods(p.tower).burn || 1) >= e.burnDps || !e.burnOwner) {
        e.burnDps = p.damage * 0.35 * (mods(p.tower).burn || 1);
        e.burnOwner = p.tower;
      }
    }
    if (p.type === "icicle") freezeEnemy(e, stat(p.tower).freezeDuration);
    if (p.type === "snowball") {
      e.chill = Math.min(0.6, (e.chill || 0) + 0.2 * (mods(p.tower).chill || 1));
      e.chillTime = 2.8;
      if (e.chill >= 0.6 - 1e-6) freezeEnemy(e, 1.2 * (mods(p.tower).freezeDuration || 1));
    }
  }
  function segmentDistance(px, py, ax, ay, bx, by) {
    const dx = bx - ax,
      dy = by - ay,
      den = dx * dx + dy * dy;
    const u = den ? clamp(((px - ax) * dx + (py - ay) * dy) / den, 0, 1) : 0;
    return Math.hypot(px - ax - dx * u, py - ay - dy * u);
  }
  function moveBoomerang(p, dt) {
    const ax = p.x,
      ay = p.y;
    let step = p.speed * dt;
    if (!p.returning) {
      step = Math.min(step, p.reach - p.travel);
      p.x += p.dx * step;
      p.y += p.dy * step;
      p.travel += step;
    } else {
      const dx = p.tower.x - p.x,
        dy = p.tower.y - p.y,
        d = Math.hypot(dx, dy);
      step = Math.min(step, d);
      p.x += (dx / Math.max(d, 0.001)) * step;
      p.y += (dy / Math.max(d, 0.001)) * step;
      if (d <= step + 0.01) p.dead = true;
    }
    const hits = p.returning ? p.hitsBack : p.hitsOut;
    const m = mods(p.tower);
    const bonus = p.returning
      ? 1 + Math.min(m.returnCap || 1.8, p.hitsOut.size * 0.18 * (m.returnBonus || 1))
      : 1;
    for (const e of state.enemies)
      if (
        !e.dead &&
        !hits.has(e.id) &&
        segmentDistance(e.x, e.y, ax, ay, p.x, p.y) <= ET[e.type].r + 7
      ) {
        hits.add(e.id);
        damage(e, p.damage * bonus, p.tower);
        state.fx.push({ type: "muzzle", x: e.x, y: e.y, color: "#e9d5b4", life: 0.12, max: 0.12 });
      }
    if (p.travel >= p.reach) p.returning = true;
    p.rotation += dt * 18;
    p.life -= dt;
    if (p.dead || p.life <= 0) p.tower.boomAway = false;
  }
  function soundAction(e, dt) {
    e.pulse -= dt;
    if (e.pulse > 0) return;
    e.pulse = 5;
    const target = state.towers
      .filter((t) => !t.frozen && Math.hypot(t.x - e.x, t.y - e.y) <= 180)
      .sort((a, b) => Math.hypot(a.x - e.x, a.y - e.y) - Math.hypot(b.x - e.x, b.y - e.y))[0];
    if (target) {
      target.stun = Math.max(target.stun || 0, 1.1);
      audio.effect("sonic", e.x / W);
    }
    state.fx.push({
      type: "sonic",
      x: e.x,
      y: e.y,
      r: 180,
      color: ET.sound.color,
      life: 0.7,
      max: 0.7,
    });
  }
  function tick(dt) {
    clock += dt;
    for (const f of state.fx) f.life -= dt;
    state.fx = state.fx.filter((f) => f.life > 0);
    if (state.ended) return;
    if (state.active) {
      state.spawnTimer -= dt;
      while (state.spawn.length && state.spawnTimer <= 0) {
        spawnEnemy(state.spawn.shift());
        state.spawnTimer += WAVES[state.wave - 1].gap;
      }
    }
    for (const t of state.towers)
      t.jammed = state.enemies.some(
        (e) =>
          !e.dead && e.type === "jammer" && !e.freezeTime && Math.hypot(e.x - t.x, e.y - t.y) < 150,
      );
    for (const e of state.enemies)
      e.guard = state.enemies.some(
        (g) =>
          g !== e &&
          !g.dead &&
          g.type === "guardian" &&
          !g.freezeTime &&
          Math.hypot(e.x - g.x, e.y - g.y) < 100,
      )
        ? 12
        : 0;
    updateWorld(dt);
    for (const e of state.enemies) {
      if (e.dead) continue;
      if (e.type === "asterPart" && e.head) {
        if (e.head.dead) {
          e.dead = true;
          continue;
        }
        e.dist = Math.max(0, e.head.dist - e.segment * 38);
        Object.assign(e, posAt(e.dist));
        continue;
      }
      if (e.bleedTime > 0 && e.bleedOwner) {
        const time = Math.min(dt, e.bleedTime);
        e.bleedTime -= time;
        damage(e, e.bleedDps * time, e.bleedOwner);
        if (e.dead) continue;
      }
      e.windImmunity = Math.max(0, (e.windImmunity || 0) - dt);
      if (e.acidTime > 0 && e.acidOwner) {
        const d = Math.min(dt, e.acidTime);
        e.acidTime -= d;
        damage(e, e.acidDps * d, e.acidOwner);
        if (e.dead) continue;
        if (e.acidTime <= 0) {
          e.corrosion = 0;
          e.acidOwner = null;
          e.acidDps = 0;
        }
      }
      if (e.type === "medic" && !e.freezeTime) {
        e.pulse -= dt;
        if (e.pulse <= 0) {
          e.pulse = 4;
          for (const a of state.enemies)
            if (!a.dead && !isBoss(a) && Math.hypot(a.x - e.x, a.y - e.y) <= 110)
              a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.05);
          state.fx.push({
            type: "sonic",
            x: e.x,
            y: e.y,
            r: 110,
            color: ET.medic.color,
            life: 0.6,
            max: 0.6,
          });
        }
      }
      if (e.type === "sprinter") {
        e.dashCycle = (e.dashCycle || 0) + dt;
        if (e.dashCycle >= 5) e.dashCycle -= 5;
      }

      e.debuffTime = Math.max(0, e.debuffTime - dt);
      if (!e.debuffTime) e.debuff = 0;
      e.hit = Math.max(0, e.hit - dt);
      e.freezeTime = Math.max(0, (e.freezeTime || 0) - dt);
      e.freezeLock = Math.max(0, (e.freezeLock || 0) - dt);
      e.pushLock = Math.max(0, (e.pushLock || 0) - dt);
      e.chillTime = Math.max(0, (e.chillTime || 0) - dt);
      if (!e.chillTime) e.chill = Math.max(0, (e.chill || 0) - dt * 0.12);
      if (e.burnTime > 0 && e.burnOwner) {
        const burnDt = Math.min(dt, e.burnTime);
        e.burnTime -= burnDt;
        damage(e, e.burnDps * burnDt, e.burnOwner);
        if (e.burnTime <= 0) {
          e.burnOwner = null;
          e.burnDps = 0;
        }
        if (e.dead) continue;
      }
      e.slowTime = Math.max(0, (e.slowTime || 0) - dt);
      if (!e.slowTime) e.slow = 0;
      e.rage = Math.max(0, (e.rage || 0) - dt * 0.06);
      e.moveStep = enemySpeed(e) * dt;
      e.dist += e.moveStep;
      Object.assign(e, posAt(e.dist));
      if (e.type === "boss") bossAction(e, dt);
      else if (isBoss(e)) sectorBossAction(e, dt);
      if (e.type === "sound" && !e.freezeTime) soundAction(e, dt);
      if (e.dist >= pathLength) {
        e.dead = true;
        state.hp = Math.max(0, state.hp - 1);
        audio.effect("impact", e.x / W);
        if (isBoss(e)) {
          end(false, `${ET[e.type].name} достиг ядра. Для победы босса нужно уничтожить.`);
          return;
        }
        if (state.hp <= 0) {
          end(false);
          return;
        }
      }
    }
    for (const t of state.towers) {
      t.stun = Math.max(0, (t.stun || 0) - dt);
      t.magmaTime = Math.max(0, (t.magmaTime || 0) - dt);
      if (t.frozen || t.stun > 0) {
        t.spin = Math.max(0, (t.spin || 0) - dt * 0.2);
        continue;
      }
      t.cool -= dt / (t.jammed ? 1.45 : 1);
      if (t.type === "boomerang" && t.boomAway) continue;
      const e = pickTarget(t);
      if (!e) {
        t.spin = Math.max(0, (t.spin || 0) - dt * 0.2);
        t.target = null;
        t.aim = 0;
        t.cool = Math.max(t.cool, -0.15);
        continue;
      }
      if (t.target !== e.id) {
        t.target = e.id;
        t.aim = 0;
      }
      const desired = Math.atan2(e.y - t.y, e.x - t.x),
        delta = Math.atan2(Math.sin(desired - t.angle), Math.cos(desired - t.angle)),
        v = stat(t);
      t.angle += clamp(delta, -v.rotation * dt, v.rotation * dt);
      const aligned = ["cut", "summon", "pulse"].includes(t.type) || Math.abs(delta) < 0.14;
      if (t.type === "machine")
        t.spin = clamp(
          (t.spin || 0) + (aligned ? dt * 0.25 * (mods(t).spinup || 1) : -dt * 0.2),
          0,
          1,
        );
      if (aligned) t.aim += dt;
      else t.aim = 0;
      if (t.cool <= 0 && aligned && (t.type !== "sniper" || t.aim >= v.aim)) {
        const carry = Math.max(-dt, t.cool);
        fire(t, e);
        t.cool += carry;
        if (t.type === "sniper") t.aim = 0;
      }
    }
    // Overlapping hurricanes use only the strongest damage source, never additive DPS.
    const windHits = new Map();
    for (const p of state.shots) {
      if (p.type === "hurricane") {
        p.life -= dt;
        p.dist = Math.max(0, p.dist - 22 * dt);
        Object.assign(p, posAt(p.dist));
        if (p.life <= 0) continue;
        for (const a of state.enemies)
          if (!a.dead && Math.hypot(a.x - p.x, a.y - p.y) <= p.r + ET[a.type].r) {
            const previous = windHits.get(a);
            if (
              !previous ||
              p.damage * (TYPES[p.tower.type].effect[a.type] || 100) >
                previous.damage * (TYPES[previous.tower.type].effect[a.type] || 100)
            )
              windHits.set(a, p);
          }
      } else if (p.type === "boomerang") {
        moveBoomerang(p, dt);
      } else if (p.type === "magmaOrb") {
        p.life -= dt;
        p.age += dt;
        const k = Math.min(1, p.age / p.duration);
        p.x = p.sx + (p.tx - p.sx) * k;
        p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * 65;
        if (k >= 1) {
          for (const t of state.towers)
            if (Math.hypot(t.x - p.tx, t.y - p.ty) < 65)
              t.magmaTime = Math.max(t.magmaTime || 0, 6);
          state.fx.push({
            type: "blast",
            x: p.tx,
            y: p.ty,
            r: 65,
            color: "#ff904c",
            life: 0.6,
            max: 0.6,
          });
          p.dead = true;
          audio.effect("explosion", p.tx / W);
        }
      } else if (p.type === "crystalBeam") {
        if (p.boss.dead || p.target.frozen || !state.towers.includes(p.target)) {
          p.dead = true;
          continue;
        }
        p.age += dt;
        p.life -= dt;
        if (p.age >= p.duration) {
          p.target.frozen = true;
          p.target.burstLeft = 0;
          state.crystallized++;
          p.dead = true;
          state.fx.push({
            type: "blast",
            x: p.target.x,
            y: p.target.y,
            r: 44,
            color: "#8edfe9",
            life: 0.55,
            max: 0.55,
          });
          if (selectedTower() === p.target) renderPanel();
        }
      } else if (p.type === "bomb" || p.type === "firework" || p.type === "shell") {
        if (p.trail) {
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 12) p.trail.shift();
        }
        p.t += dt;
        const k = Math.min(1, p.t / p.duration);
        p.x = p.sx + (p.tx - p.sx) * k;
        p.y = p.sy + (p.ty - p.sy) * k - Math.sin(k * Math.PI) * 30;
        if (k >= 1) {
          for (const e of state.enemies) {
            if (!e.dead && Math.hypot(e.x - p.tx, e.y - p.ty) <= p.area) {
              const extra = p.type === "firework" && !isBoss(e) ? e.maxHp * p.percent : 0;
              damage(e, p.damage + extra, p.tower);
              if (p.type === "firework") applySlow(e, p.slow, 2.5);
              if (p.type === "bomb" && mods(p.tower).crater) applySlow(e, 0.35, 3);
              if (p.type === "shell" && mods(p.tower).quake) freezeEnemy(e, 0.6);
            }
          }
          state.fx.push({
            type: p.type === "firework" ? "firework" : "blast",
            x: p.tx,
            y: p.ty,
            r: p.area,
            color: TYPES[p.tower.type].color,
            life: p.type === "firework" ? 0.85 : 0.4,
            max: p.type === "firework" ? 0.85 : 0.4,
            hue: p.hue || 0,
          });
          audio.effect("explosion", p.tx / W);
          p.dead = true;
        }
      } else {
        p.life -= dt;
        if (p.target.dead) {
          p.dead = true;
          continue;
        }
        const dx = p.target.x - p.x,
          dy = p.target.y - p.y,
          d = Math.hypot(dx, dy);
        p.angle = Math.atan2(dy, dx);
        if (d <= p.speed * dt) {
          projectileHit(p, p.target);
          p.dead = true;
        } else {
          p.x += (dx / d) * p.speed * dt;
          p.y += (dy / d) * p.speed * dt;
        }
      }
    }
    for (const [a, p] of windHits) {
      if (a.dead) continue;
      const v = stat(p.tower);
      damage(a, p.damage * dt, p.tower);
      if (a.dead) continue;
      applySlow(a, 0.18, 0.3);
      // A shared resistance window prevents chains of towers from permanently pinning targets.
      if (!isBoss(a) && a.hp / a.maxHp < v.threshold && !a.windImmunity) {
        const duration = Math.min(dt, Math.max(0, 0.65 - (a.windExposure || 0)));
        a.dist = Math.max(0, a.dist - (a.moveStep || 0) * (duration / dt) - v.pull * duration);
        Object.assign(a, posAt(a.dist));
        a.windExposure = (a.windExposure || 0) + duration;
        if (a.windExposure >= 0.65 - 1e-8) {
          a.windExposure = 0;
          a.windImmunity = 3;
        }
      }
    }
    state.shots = state.shots.filter((p) => !p.dead && (p.life === undefined || p.life > 0));
    updateAllies(dt);
    state.enemies = state.enemies.filter((e) => !e.dead);
    if (selected?.kind === "enemy" && !selectedEnemy()) {
      selected = null;
      renderPanel();
    }
    if (state.active && !state.spawn.length && !state.enemies.length) finishWave();
    else if (!state.active && autoTimer > 0) {
      autoTimer -= dt;
      if (autoTimer <= 0) startWave();
    }
  }
  function polygon(x, y, n, r, rot = 0) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * TAU;
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  function crystal(x, y, r, rotation = 0, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha *= alpha;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.62, -r * 0.2);
    ctx.lineTo(r * 0.5, r * 0.55);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.5, r * 0.55);
    ctx.lineTo(-r * 0.62, -r * 0.2);
    ctx.closePath();
    ctx.fillStyle = "#7464bd";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(-r * 0.62, -r * 0.2);
    ctx.lineTo(0, r);
    ctx.closePath();
    ctx.fillStyle = "#79dbe5";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.62, -r * 0.2);
    ctx.lineTo(0, r);
    ctx.closePath();
    ctx.fillStyle = "#a78ceb";
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(0, r);
    ctx.strokeStyle = "#c2f9fa";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  function drawTower(t, ghost = false) {
    ctx.save();
    if (ghost) ctx.globalAlpha = 0.5;
    if (t.stun > 0 && !t.frozen) {
      ctx.strokeStyle = "#7fc7ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 29, clock * 6, clock * 6 + Math.PI * 1.5);
      ctx.stroke();
    }
    if (t.frozen) {
      crystal(t.x, t.y, 31, -0.1);
      ctx.strokeStyle = "#beabef";
      ctx.lineWidth = 1;
      polygon(t.x, t.y, 6, 28, 0);
      ctx.stroke();
    } else {
      const v = stat(t),
        kick = t.cool > v.interval - 0.06 ? 2 : 0;
      ctx.fillStyle = "#151515";
      ctx.fillRect(t.x - 22, t.y - 22, 44, 44);
      sprites.draw(
        ctx,
        { ...t, x: t.x - Math.cos(t.angle) * kick, y: t.y - Math.sin(t.angle) * kick },
        46,
      );
      if (t.magmaTime > 0) {
        ctx.strokeStyle = "#f69651";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 25, 0, TAU * Math.min(1, t.magmaTime / 6));
        ctx.stroke();
      }
      if (t.jammed) {
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = "#d69bb9";
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(t.x - 25, t.y - 25, 50, 50);
        ctx.setLineDash([]);
      }
      if (t.marked > clock) {
        ctx.strokeStyle = "#c5a4ff";
        ctx.lineWidth = 2;
        polygon(t.x, t.y, 6, 27, clock);
        ctx.stroke();
      }
      if (t.type === "machine" && t.spin > 0) {
        ctx.fillStyle = "#52575e";
        ctx.fillRect(t.x - 19, t.y + 20, 38, 2);
        ctx.fillStyle = "#f2c16a";
        ctx.fillRect(t.x - 19, t.y + 20, 38 * t.spin, 2);
      }
      if (!ghost) {
        ctx.fillStyle = "#eee";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(t.level, t.x, t.y + 28);
        if (abilityChoices(t) > 0) {
          ctx.fillStyle = "#f7d171";
          ctx.fillRect(t.x + 17, t.y - 24, 5, 5);
        }
      }
    }
    ctx.restore();
  }
  function drawEnemy(e) {
    const b = ET[e.type];
    if (e.type !== "boss" && isElite(e) && e.type !== "minion") {
      drawSectorEnemy(e);
      return;
    }
    if (e.type === "boss") {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(Math.sin(clock) * 0.035);
      crystal(0, 0, 38, 0);
      crystal(-21, 4, 19, -0.45);
      crystal(21, 4, 19, 0.45);
      if (e.shield <= 0) {
        ctx.strokeStyle = "#f4a0e5";
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.35 + 0.2 * Math.sin(clock * 5);
        polygon(0, 0, 6, 45 + 3 * Math.sin(clock * 5), -clock * 0.4);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (e.shield > 0) {
        ctx.strokeStyle = e.hit > 0 ? "#fff" : "#78dbe5";
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.65;
        polygon(0, 0, 6, 43, clock * 0.11);
        ctx.stroke();
        const r = 43;
        for (let i = 0; i < 6; i++) {
          const a = clock * 0.11 + (i / 6) * TAU;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          ctx.lineTo(Math.cos(a + TAU / 3) * r, Math.sin(a + TAU / 3) * r);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      return;
    }
    if (e.type === "minion") crystal(e.x, e.y, 15, e.angle + Math.PI / 2);
    else {
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.type === "fast") ctx.rotate(e.angle);
      function shape(r) {
        if (e.type === "normal") {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, TAU);
        } else if (e.type === "fast") polygon(0, 0, 3, r + 2);
        else if (e.type === "sound") polygon(0, 0, 6, r + 1, Math.PI / 6);
        else if (e.type === "fighter") polygon(0, 0, 5, r + 2, -Math.PI / 2);
        else if (REGULAR.indexOf(e.type) >= 5)
          polygon(
            0,
            0,
            { medic: 8, guardian: 6, sprinter: 3, splitter: 4, jammer: 6 }[e.type],
            r + 1,
            -Math.PI / 2,
          );
        else {
          ctx.beginPath();
          ctx.rect(-r, -r, r * 2, r * 2);
        }
      }
      shape(b.r + 1.5);
      ctx.fillStyle =
        e.hit > 0
          ? "#fff"
          : {
              normal: "#b0df9e",
              fast: "#fff0a0",
              tank: "#ffada0",
              sound: "#a9ddff",
              fighter: "#ffd2a2",
            }[e.type] || "#ddd";
      ctx.fill();
      shape(b.r - 1);
      ctx.fillStyle = e.hit > 0 ? "#fff" : b.color;
      ctx.fill();
      if (REGULAR.indexOf(e.type) >= 5) {
        ctx.strokeStyle = "#f5edf6";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (e.type === "medic") {
          ctx.moveTo(-6, 0);
          ctx.lineTo(6, 0);
          ctx.moveTo(0, -6);
          ctx.lineTo(0, 6);
        }
        if (e.type === "guardian") {
          ctx.moveTo(-6, -6);
          ctx.lineTo(6, -6);
          ctx.lineTo(5, 3);
          ctx.lineTo(0, 8);
          ctx.lineTo(-5, 3);
          ctx.closePath();
        }
        if (e.type === "sprinter") {
          ctx.moveTo(-4, -4);
          ctx.lineTo(2, 0);
          ctx.lineTo(-4, 4);
        }
        if (e.type === "splitter") {
          ctx.moveTo(0, -8);
          ctx.lineTo(-3, -1);
          ctx.lineTo(3, 2);
          ctx.lineTo(0, 8);
        }
        if (e.type === "jammer") {
          for (let i = -1; i <= 1; i++) {
            ctx.moveTo(i * 5, -4);
            ctx.lineTo(i * 5, 4);
          }
          ctx.moveTo(-7, 7);
          ctx.lineTo(7, -7);
        }
        ctx.stroke();
      }
      if (e.type === "sound") {
        ctx.strokeStyle = "#d5f3ff";
        ctx.lineWidth = 1.7;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-5 + i * 5, -3 - i * 2);
          ctx.lineTo(-5 + i * 5, 3 + i * 2);
          ctx.stroke();
        }
      }
      if (e.type === "fighter") {
        ctx.fillStyle = "#632f23";
        ctx.fillRect(-6, -3, 12, 5);
        ctx.fillStyle = "#fff1bb";
        ctx.fillRect(-4, -2, 3, 2);
        ctx.fillRect(2, -2, 3, 2);
      }
      ctx.restore();
    }
    if (e.guard || e.acidTime > 0) {
      ctx.strokeStyle = e.acidTime > 0 ? "#b6da57" : "#8eaef1";
      ctx.lineWidth = 1.5;
      polygon(e.x, e.y, 6, b.r + 4, clock * 0.2);
      ctx.stroke();
    }
    if (e.slowTime > 0) {
      ctx.strokeStyle = "#f6ad50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(e.x, e.y, b.r + 5, 0, TAU);
      ctx.stroke();
    }
    if (e.hp < e.maxHp) {
      ctx.fillStyle = "#101010";
      ctx.fillRect(e.x - 14, e.y - b.r - 8, 28, 3);
      ctx.fillStyle = b.color;
      ctx.fillRect(e.x - 14, e.y - b.r - 8, (28 * e.hp) / e.maxHp, 3);
    }
    if (e.debuffTime > 0) {
      ctx.strokeStyle = "#b89cf2";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, b.r + 4, -Math.PI / 2, -Math.PI / 2 + (TAU * e.debuffTime) / 2);
      ctx.stroke();
    }
  }
  function drawStatus(e) {
    const r = ET[e.type].r + 5;
    if (e.freezeTime > 0) {
      ctx.save();
      polygon(e.x, e.y, 6, r + 4, Math.PI / 6);
      ctx.fillStyle = "#9ee7ff35";
      ctx.fill();
      ctx.strokeStyle = "#b8efff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    } else if (e.chill > 0) {
      ctx.strokeStyle = "#75baff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, r, -Math.PI / 2, -Math.PI / 2 + (TAU * e.chill) / 0.6);
      ctx.stroke();
    }
    if (e.burnTime > 0) {
      for (let i = 0; i < 3; i++) {
        const x = e.x + (i - 1) * 8,
          y = e.y + r * 0.6,
          sz = 4 + Math.sin(clock * 17 + i * 3) * 1.5;
        ctx.fillStyle = i % 2 ? "#ffdb76" : "#ff8345";
        ctx.beginPath();
        ctx.moveTo(x - sz, y);
        ctx.lineTo(x + Math.sin(clock * 13 + i) * 2, y - 12 - sz);
        ctx.lineTo(x + sz, y);
        ctx.fill();
      }
    }
  }

  function drawNewProjectile(p) {
    if (
      ![
        "magmaOrb",
        "hurricane",
        "acid",
        "vortex",
        "boomerang",
        "snowball",
        "icicle",
        "incendiary",
      ].includes(p.type)
    )
      return false;
    ctx.save();
    ctx.translate(p.x, p.y);
    if (p.type === "acid") {
      ctx.lineWidth = 1.2;
      ctx.fillStyle = "#b4d75a";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#daf7a0";
      ctx.stroke();
    } else if (p.type === "hurricane") {
      const fade = Math.min(1, p.life / 0.4, (p.max - p.life) / 0.2);
      ctx.globalAlpha = fade;
      ctx.rotate(clock * 4);
      ctx.fillStyle = "#263d6d33";
      ctx.beginPath();
      ctx.arc(0, 0, p.r, 0, TAU);
      ctx.fill();
      for (let i = 0; i < 7; i++) {
        ctx.rotate(TAU / 7);
        ctx.strokeStyle = ["#9aabd9", "#617ac7", "#385591"][i % 3];
        ctx.lineWidth = 1 + (i % 3);
        ctx.beginPath();
        ctx.ellipse(
          i * 0.7,
          0,
          p.r * (0.25 + i * 0.1),
          p.r * (0.14 + i * 0.07),
          0,
          0,
          Math.PI * 1.55,
        );
        ctx.stroke();
      }
    } else if (p.type === "boomerang") {
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.moveTo(-17, -9);
      ctx.lineTo(-1, -5);
      ctx.lineTo(16, 10);
      ctx.lineTo(9, 15);
      ctx.lineTo(-4, 4);
      ctx.lineTo(-19, 0);
      ctx.closePath();
      ctx.fillStyle = p.returning ? "#ffe4ac" : "#d2bc96";
      ctx.fill();
      ctx.strokeStyle = "#faf0d4";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    } else if (p.type === "vortex") {
      ctx.rotate(clock * 8);
      ctx.fillStyle = "#14204d99";
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, TAU);
      ctx.fill();
      for (let i = 0; i < 3; i++) {
        ctx.rotate(TAU / 3);
        ctx.strokeStyle = ["#5369b9", "#8a9add", "#263b83"][i];
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(3, 0, 9 + i * 2, 0, Math.PI * 1.4);
        ctx.stroke();
      }
    } else if (p.type === "magmaOrb") {
      ctx.fillStyle = "#ff6d36";
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#ffe0a1";
      ctx.beginPath();
      ctx.arc(-3, -3, 6, 0, TAU);
      ctx.fill();
    } else if (p.type === "snowball") {
      ctx.fillStyle = "#d9f4ff";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, TAU);
      ctx.fill();
      ctx.fillStyle = "#75b7e8";
      ctx.beginPath();
      ctx.arc(1, 2, 3, 0, TAU);
      ctx.fill();
    } else if (p.type === "icicle") {
      ctx.rotate((p.angle || 0) + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(6, 7);
      ctx.lineTo(0, 12);
      ctx.lineTo(-6, 7);
      ctx.closePath();
      ctx.fillStyle = "#b9f4ff";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(0, 12);
      ctx.lineTo(6, 7);
      ctx.closePath();
      ctx.fillStyle = "#519be4";
      ctx.fill();
    } else {
      ctx.rotate(p.angle || 0);
      ctx.strokeStyle = "#ff743e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      ctx.lineTo(3, 0);
      ctx.stroke();
      ctx.fillStyle = "#ffe5a4";
      ctx.fillRect(-2, -1, 7, 2);
    }
    ctx.restore();
    return true;
  }
  function draw() {
    const D = camera.dpr,
      s = camera.fit * camera.zoom;
    ctx.setTransform(D, 0, 0, D, 0, 0);
    ctx.fillStyle = currentLevel.bg;
    ctx.fillRect(0, 0, camera.width, camera.height);
    ctx.setTransform(
      D * s,
      0,
      0,
      D * s,
      D * (camera.width / 2 - camera.x * s),
      D * (camera.height / 2 - camera.y * s),
    );
    drawSectorBackdrop();
    ctx.lineCap = "square";
    ctx.lineJoin = "miter";
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = currentLevel.road;
    ctx.lineWidth = 51;
    ctx.stroke();
    ctx.fillStyle = "#535350";
    for (const seg of segments) {
      const n = Math.round(seg.len / C);
      for (let j = 0; j < n; j++) {
        const x = seg.a.x + ((seg.b.x - seg.a.x) * (j + 0.5)) / n,
          y = seg.a.y + ((seg.b.y - seg.a.y) * (j + 0.5)) / n;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
    const st = selectedTower();
    drawSectorWorld();
    for (const p of platforms) {
      if (p.destroyed) continue;
      const sel =
        (selected?.kind === "platform" && selected.p === p) || (st?.c === p.c && st?.r === p.r);
      ctx.fillStyle = "#101010";
      ctx.fillRect(p.x - 26, p.y - 25, 52, 53);
      ctx.fillStyle = sel ? "#4b544d" : hover === p ? "#474747" : "#333";
      ctx.fillRect(p.x - 24, p.y - 24, 48, 48);
      ctx.fillStyle = "#414141";
      ctx.beginPath();
      ctx.moveTo(p.x - 24, p.y - 24);
      ctx.lineTo(p.x + 24, p.y - 24);
      ctx.lineTo(p.x + 20, p.y - 20);
      ctx.lineTo(p.x - 20, p.y - 20);
      ctx.lineTo(p.x - 20, p.y + 20);
      ctx.lineTo(p.x - 24, p.y + 24);
      ctx.fill();
      if (sel) {
        ctx.strokeStyle = "#eee";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(p.x - 26, p.y - 26, 52, 52);
      }
    }
    let rt = st;
    if (!rt && buildType) {
      const p =
        hover && !towerAt(hover) ? hover : selected?.kind === "platform" ? selected.p : null;
      if (p)
        rt = {
          ...p,
          type: buildType,
          angle: -Math.PI / 2,
          level: 0,
          rank: 1,
          abilities: [],
          cool: 0,
        };
    }
    if (rt && !rt.frozen) {
      ctx.beginPath();
      ctx.arc(rt.x, rt.y, stat(rt).range, 0, TAU);
      ctx.fillStyle = TYPES[rt.type].color + "0c";
      ctx.fill();
      ctx.strokeStyle = TYPES[rt.type].color + "80";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
      if (!st) drawTower(rt, true);
    }
    // Portal and core preserve the previous version's geometry and colours.
    const p = points[0],
      q = points.at(-1);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(clock * 0.25);
    polygon(0, 0, 6, 24);
    ctx.strokeStyle = "#bdadff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.rotate(-clock * 0.6);
    polygon(0, 0, 4, 12);
    ctx.fillStyle = "#bdadff25";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#bdadff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, TAU);
    ctx.fill();
    ctx.textAlign = "left";
    ctx.font = "10px Arial";
    ctx.fillStyle = "#b3a5e7";
    ctx.fillText("ПОРТАЛ", p.x - 21, p.y - 36);
    ctx.save();
    ctx.translate(q.x, q.y);
    polygon(0, 0, 6, 25, Math.PI / 6);
    ctx.fillStyle = "#80e6fa12";
    ctx.fill();
    ctx.strokeStyle = state.hp <= 5 ? "#ff818a" : "#80e6fa";
    ctx.lineWidth = 2;
    ctx.stroke();
    polygon(0, 0, 6, 13, Math.PI / 6);
    ctx.fillStyle = state.hp <= 5 ? "#ff818a" : "#80e6fa";
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#80e6fa";
    ctx.textAlign = "right";
    ctx.fillText("ЯДРО", q.x + 21, q.y + 43);
    for (const t of state.towers) drawTower(t);
    drawAllies();
    for (const e of state.enemies) {
      drawEnemy(e);
      drawStatus(e);
    }
    for (const p of state.shots) {
      if (p.type === "crystalBeam") {
        const a = p.boss,
          b = p.target,
          k = Math.min(1, p.age / p.duration),
          pulse = 1 + Math.sin(clock * 35) * 0.15;
        ctx.save();
        ctx.lineCap = "round";
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, "#a188ef");
        g.addColorStop(0.5, "#75e4eb");
        g.addColorStop(1, "#d3a5ff");
        for (const [width, alpha] of [
          [18, 0.12],
          [8, 0.45],
          [2.5, 0.95],
        ]) {
          ctx.strokeStyle = g;
          ctx.lineWidth = width * pulse * (0.45 + k * 0.55);
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 0.9;
        for (let i = 0; i < 8; i++) {
          const u = (clock * 1.5 + i / 8) % 1;
          crystal(a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, 3 + k * 2, clock + i);
        }
        ctx.strokeStyle = "#bfefff";
        ctx.lineWidth = 1.4;
        polygon(b.x, b.y, 6, 12 + 24 * k, clock);
        ctx.stroke();
        crystal(b.x, b.y, 10 + 20 * k, -0.1, k * 0.65);
        ctx.restore();
        continue;
      }
      if (drawNewProjectile(p)) continue;
      if (p.type === "laser") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle || 0);
        ctx.fillStyle = "#bd8de9";
        ctx.fillRect(-14, -2.5, 22, 5);
        ctx.fillStyle = "#daffff";
        ctx.fillRect(-6, -1, 14, 2);
        ctx.restore();
      } else if (p.type === "shell") {
        ctx.strokeStyle = "#c3d49b";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(p.tx, p.ty, p.area, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#d3d7ab";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "#66734c";
        ctx.beginPath();
        ctx.arc(p.x + 2, p.y + 2, 4, 0, TAU);
        ctx.fill();
      } else if (p.type === "firework") {
        if (p.trail?.length > 1) {
          for (let i = 1; i < p.trail.length; i++) {
            ctx.strokeStyle = `hsla(${p.hue},95%,72%,${(i / p.trail.length) * 0.65})`;
            ctx.lineWidth = 1 + (i / p.trail.length) * 2;
            ctx.beginPath();
            ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.stroke();
          }
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.atan2(p.ty - p.sy, p.tx - p.sx) + Math.PI / 2);
        ctx.fillStyle = "#fff2c4";
        ctx.fillRect(-3, -8, 6, 15);
        ctx.fillStyle = `hsl(${p.hue},80%,60%)`;
        ctx.fillRect(-3, -3, 6, 3);
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(5, -7);
        ctx.lineTo(-5, -7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#de9f52";
        ctx.beginPath();
        ctx.moveTo(-3, 3);
        ctx.lineTo(-6, 10);
        ctx.lineTo(0, 7);
        ctx.lineTo(6, 10);
        ctx.lineTo(3, 3);
        ctx.fill();
        ctx.fillStyle = "#ffe6a0";
        ctx.beginPath();
        ctx.moveTo(-2, 8);
        ctx.lineTo(0, 19 + Math.sin(clock * 40) * 4);
        ctx.lineTo(2, 8);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type === "bomb" ? 5 : 2.3, 0, TAU);
        ctx.fillStyle = p.type === "bomb" ? "#ffc38c" : "#d8f1bf";
        ctx.fill();
      }
    }
    for (const f of state.fx) {
      const k = f.life / f.max;
      ctx.globalAlpha = k;
      ctx.fillStyle = f.color;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 2;
      if (f.type === "beam") {
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.tx, f.ty);
        ctx.stroke();
      } else if (f.type === "firework") {
        const age = 1 - k;
        if (k > 0.78) {
          ctx.fillStyle = "#fff7d6";
          ctx.beginPath();
          ctx.arc(f.x, f.y, 12 * k, 0, TAU);
          ctx.fill();
        }
        for (let i = 0; i < 40; i++) {
          const a = (i / 40) * TAU + (i % 3) * 0.07,
            spread = 0.62 + (i % 7) * 0.065;
          const r = f.r * age * spread,
            tail = 12 * k;
          const x = f.x + Math.cos(a) * r,
            y = f.y + Math.sin(a) * r + age * age * 25;
          ctx.strokeStyle = `hsl(${(f.hue + (i % 4) * 42) % 360},88%,${65 + (i % 3) * 8}%)`;
          ctx.lineWidth = i % 3 ? 1.35 : 2.1;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(a) * tail, y - Math.sin(a) * tail);
          ctx.lineTo(x, y);
          ctx.stroke();
          if (i % 4 === 0) {
            ctx.fillStyle = "#fff3c9";
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
      } else if (f.type === "lightning" || f.type === "prismBeam") {
        ctx.strokeStyle = f.type === "lightning" ? "#fff2ad" : "#fff0fa";
        ctx.lineWidth = f.type === "lightning" ? 2 : f.width * k;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        for (let i = 1; i <= 8; i++) {
          const u = i / 8,
            j = f.type === "lightning" && i < 8 ? Math.sin(i * 13.4 + clock * 9) * 9 : 0;
          ctx.lineTo(f.x + (f.tx - f.x) * u + j, f.y + (f.ty - f.y) * u - j);
        }
        ctx.stroke();
        ctx.strokeStyle = f.color;
        ctx.lineWidth = f.type === "lightning" ? 5 : f.width * 1.7 * k;
        ctx.globalAlpha = k * 0.3;
        ctx.stroke();
      } else if (f.type === "slash") {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        const length = f.r * Math.sin(Math.PI * (1 - k));
        ctx.fillStyle = f.color || "#fff";
        ctx.beginPath();
        ctx.moveTo(-length, -2);
        ctx.quadraticCurveTo(0, -7, length, 1);
        ctx.quadraticCurveTo(0, 3, -length, -2);
        ctx.fill();

        ctx.restore();
      } else if (f.type === "vortex") {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(clock * 5);
        for (let i = 0; i < 3; i++) {
          ctx.rotate(TAU / 3);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(4, 0, f.r * (0.2 + 0.8 * (1 - k)), 0, Math.PI * 1.5);
          ctx.stroke();
        }
        ctx.restore();
      } else if (f.type === "frost") {
        polygon(f.x, f.y, 6, f.r * (1 - k), Math.PI / 6);
        ctx.stroke();
      } else if (f.type === "sonic") {
        for (let i = 0; i < 3; i++) {
          const r = f.r * ((1 - k + i * 0.18) % 1);
          ctx.globalAlpha = k * 0.55;
          ctx.beginPath();
          ctx.arc(f.x, f.y, r, 0, TAU);
          ctx.stroke();
        }
      } else if (f.type === "blast") {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * (1 - k), 0, TAU);
        ctx.globalAlpha = k * 0.12;
        ctx.fill();
        ctx.globalAlpha = k;
        ctx.stroke();
      } else if (f.type === "build") {
        polygon(f.x, f.y, 6, 23 + (1 - k) * 15);
        ctx.stroke();
      } else if (f.type === "muzzle") {
        polygon(f.x, f.y, 4, 5 * k);
        ctx.fill();
      } else {
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * TAU,
            r = (f.r || 22) * (1 - k);
          ctx.fillRect(f.x + Math.cos(a) * r - 2, f.y + Math.sin(a) * r - 2, 4, 4);
        }
      }
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(D, 0, 0, D, 0, 0);
    if (paused) {
      ctx.fillStyle = "#171717cc";
      ctx.fillRect(camera.width / 2 - 85, camera.height / 2 - 24, 170, 48);
      ctx.fillStyle = "#eee";
      ctx.textAlign = "center";
      ctx.font = "18px Arial";
      ctx.fillText("П А У З А", camera.width / 2, camera.height / 2 + 6);
    }
  }
  function loop(ts) {
    const real = Math.min((ts - last) / 1000 || 0, 0.06);
    last = ts;
    updateCamera(real);
    if (!paused && !document.querySelector("dialog[open]")) {
      let remain = real * speed;
      while (remain > 0) {
        const step = Math.min(remain, 1 / 60);
        tick(step);
        remain -= step;
      }
    }
    draw();
    uiTime += real;
    if (uiTime > 0.12) {
      uiTime = 0;
      updateHUD();
      refreshPanel();
    }
    requestAnimationFrame(loop);
  }
  function selectAt(x, y) {
    audio.unlock();
    const p = screenToWorld(x, y);
    if (Math.hypot(p.x - points[0].x, p.y - points[0].y) < 30) {
      openPortal();
      return;
    }
    if (Math.hypot(p.x - points.at(-1).x, p.y - points.at(-1).y) < 28) {
      toast(`Ядро: ${state.hp} / 20 HP`);
      return;
    }
    const e = state.enemies.find(
      (e) => !e.dead && Math.hypot(e.x - p.x, e.y - p.y) < ET[e.type].r + 6,
    );
    if (e) {
      selected = { kind: "enemy", id: e.id };
      buildType = null;
      renderPanel();
      return;
    }
    const plat = platforms.find(
      (a) => !a.destroyed && Math.abs(p.x - a.x) < 25 && Math.abs(p.y - a.y) < 25,
    );
    if (!plat) {
      selected = null;
      buildType = null;
      renderPanel();
      return;
    }
    const t = towerAt(plat);
    if (t) {
      selected = { kind: "tower", id: t.id };
      buildType = null;
    } else {
      buildType = null;
      selected = { kind: "platform", p: plat };
    }
    renderPanel();
  }
  canvas.addEventListener("mousedown", (e) => {
    if (e.button > 2) return;
    drag = {
      button: e.button,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    if (e.button !== 0) e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      drag.moved ||= Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 5;
      if (drag.moved) {
        camera.tx -= dx / (camera.fit * camera.targetZoom);
        camera.ty -= dy / (camera.fit * camera.targetZoom);
        canvas.classList.add("dragging");
      }
      drag.x = e.clientX;
      drag.y = e.clientY;
    } else if (e.target === canvas) {
      const p = screenToWorld(e.clientX, e.clientY);
      hover =
        platforms.find(
          (a) => !a.destroyed && Math.abs(p.x - a.x) < 25 && Math.abs(p.y - a.y) < 25,
        ) || null;
    }
  });
  document.addEventListener("mouseup", (e) => {
    if (!drag) return;
    const d = drag;
    drag = null;
    canvas.classList.remove("dragging");
    if (!d.moved && d.button === 0 && e.target === canvas) selectAt(e.clientX, e.clientY);
  });
  canvas.addEventListener("mouseleave", () => (hover = null));
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      zoomAt(Math.exp(-e.deltaY * 0.0013), e.clientX, e.clientY);
    },
    { passive: false },
  );
  $("#zoomIn").onclick = () => zoomAt(1.2);
  $("#zoomOut").onclick = () => zoomAt(1 / 1.2);
  $("#cameraReset").onclick = resetCamera;
  function openPortal() {
    $("#portalModal thead tr").innerHTML =
      `<th>Волна</th>${REGULAR.map((k) => `<th>${ET[k].name}</th>`).join("")}<th>Бонус</th>`;
    $("#waveRows").innerHTML = WAVES.map(
      (w) =>
        `<tr class="${w.n === state.wave ? "current" : ""}"><td>${String(w.n).padStart(2, "0")}</td>${REGULAR.map((k) => `<td>${w.counts[k] ? w.counts[k] + " × " + w.hp[k] : "—"}</td>`).join("")}<td>${w.n === FINAL_WAVE ? ET[currentLevel.boss].name : "+" + w.bonus}</td></tr>`,
    ).join("");

    $(".boss-brief").innerHTML = bossBrief();
    openDialog("portalModal");
  }
  $("#start").onclick = () => {
    if (state.ended) reset();
    else if (state.wave === 0) startWave();
  };
  function setPauseIcon() {
    $("#pause").innerHTML = paused
      ? '<svg viewBox="0 0 32 32"><path d="M7 3v26l22-13z"/></svg>'
      : '<svg viewBox="0 0 32 32"><path d="M6 4h7v24H6zm13 0h7v24h-7z"/></svg>';
    $("#pause").setAttribute("aria-label", paused ? "Продолжить" : "Пауза");
  }
  $("#pause").onclick = () => {
    if (state.ended) return;
    paused = !paused;
    setPauseIcon();
    updateHUD();
  };
  $$("[data-speed]").forEach(
    (b) =>
      (b.onclick = () => {
        speed = +b.dataset.speed;
        $$("[data-speed]").forEach((x) => x.classList.toggle("active", x === b));
      }),
  );

  $$("[data-close]").forEach((b) => (b.onclick = () => closeDialog($("#" + b.dataset.close))));
  $$("dialog").forEach((d) => {
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      if (d.id !== "levelModal" || levelChosen) closeDialog(d);
    });
    d.addEventListener("click", (e) => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        if (d.id !== "levelModal" || levelChosen) closeDialog(d);
    });
  });
  $("#restart").onclick = () => {
    const d = $("#endModal");
    d.close();
    reset();
  };
  document.addEventListener("keydown", (e) => {
    if (document.querySelector("dialog[open]") || e.target.tagName === "INPUT") return;
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyW", "KeyA", "KeyS", "KeyD"].includes(
        e.code,
      )
    ) {
      cameraKeys.add(e.code);
      e.preventDefault();
    }
    if (e.code === "Space" && !e.repeat) {
      e.preventDefault();
      $("#pause").click();
    } else if (e.code === "KeyN" && state.wave === 0) startWave();
    else if (e.code === "KeyF") resetCamera();
    else if (e.code === "Equal" || e.code === "NumpadAdd") zoomAt(1.2);
    else if (e.code === "Minus" || e.code === "NumpadSubtract") zoomAt(1 / 1.2);
    else if (e.code === "Escape") {
      selected = null;
      buildType = null;
      renderPanel();
    }
  });
  document.addEventListener("keyup", (e) => cameraKeys.delete(e.code));
  window.addEventListener("blur", () => {
    cameraKeys.clear();
    drag = null;
  });
  $("#music").onclick = () => {
    audio.toggleMusic();
    $("#music").classList.toggle("active", audio.musicEnabled);
    $("#music").setAttribute("aria-pressed", audio.musicEnabled);
  };
  $("#sfx").onclick = () => {
    audio.toggleSfx();
    $("#sfx").classList.toggle("active", audio.sfxEnabled);
    $("#sfx").setAttribute("aria-pressed", audio.sfxEnabled);
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (state.wave > 0 && !paused && !state.ended) $("#pause").click();
      audio.ctx?.suspend();
    } else if (audio.ctx) {
      audio.ctx.resume();
      audio.next = audio.ctx.currentTime + 0.05;
    }
  });
  function summonAlly(t) {
    const v = stat(t),
      count = mods(t).legion ? 2 : 1;
    for (let i = 0; i < count && state.allies.length < 20; i++) {
      const dist = pathLength - i * 20,
        p = posAt(dist);
      state.allies.push({
        ...p,
        dist,
        hp: v.allyHP,
        maxHp: v.allyHP,
        owner: t,
        life: 70,
        speed: 82,
      });
      state.fx.push({
        type: "blast",
        x: p.x,
        y: p.y,
        r: 28,
        color: "#f06a83",
        life: 0.35,
        max: 0.35,
      });
    }
    audio.effect("crystal", points.at(-1).x / W);
  }
  function updateAllies(dt) {
    for (const a of state.allies) {
      a.life -= dt;
      const old = a.dist;
      a.dist = Math.max(0, a.dist - a.speed * dt);
      Object.assign(a, posAt(a.dist));
      const targets = state.enemies
        .filter(
          (e) =>
            !e.dead && e.dist >= a.dist - ET[e.type].r - 10 && e.dist <= old + ET[e.type].r + 10,
        )
        .sort((a, b) => b.dist - a.dist);
      if (targets.length) {
        damage(targets[0], a.hp, a.owner, false, true);
        a.life = 0;
        state.fx.push({
          type: "blast",
          x: a.x,
          y: a.y,
          r: 30,
          color: "#ef8395",
          life: 0.35,
          max: 0.35,
        });
      }
      if (a.dist <= 0) a.life = 0;
    }
    state.allies = state.allies.filter((a) => a.life > 0);
  }
  function erasePlatform(p, owner) {
    if (p.destroyed) return;
    p.destroyed = true;
    for (const t of state.towers.filter((t) => t.c === p.c && t.r === p.r)) t.destroyed = true;
    state.towers = state.towers.filter((t) => !t.destroyed);
    if (
      (selected?.kind === "platform" && selected.p === p) ||
      (selected?.kind === "tower" && !selectedTower())
    ) {
      selected = null;
      renderPanel();
    }
    state.fx.push({ type: "blast", x: p.x, y: p.y, r: 62, color: "#c79bff", life: 1, max: 1 });
    audio.effect("explosion", p.x / W);
    toast("Космо стёр платформу · восстановление только в новом забеге");
  }
  function sectorBossAction(b, dt) {
    if (b.type === "magma") {
      b.trailTimer -= dt;
      b.abilityTimer -= dt;
      b.summon -= dt;
      if (b.trailTimer <= 0) {
        b.trailTimer = 0.7;
        state.lava.push({ dist: b.dist, x: b.x, y: b.y, life: 10, max: 10 });
      }
      if (b.abilityTimer <= 0) {
        b.abilityTimer = 7;
        const targets = state.towers
          .filter((t) => !t.frozen && Math.hypot(t.x - b.x, t.y - b.y) < 330)
          .sort((a, c) => (c.bossDamage || 0) - (a.bossDamage || 0));
        for (const t of targets.slice(0, b.hp < b.maxHp * 0.5 ? 2 : 1))
          state.shots.push({
            type: "magmaOrb",
            x: b.x,
            y: b.y,
            sx: b.x,
            sy: b.y,
            tx: t.x,
            ty: t.y,
            target: t,
            age: 0,
            duration: 1.1,
            life: 1.2,
            owner: b,
          });
        if (targets.length) audio.effect("cannon", b.x / W);
      }
      if (b.summon <= 0) {
        b.summon = 13;
        const alive = state.enemies.filter((e) => !e.dead && e.type === "magmaMinion").length;
        for (let i = 0; i < Math.min(2, 8 - alive); i++) {
          spawnEnemy("magmaMinion", Math.max(0, b.dist - 28 - i * 32));
          state.summoned++;
        }
      }
    } else if (b.type === "asterix") {
      b.healTimer -= dt;
      if (b.healTimer <= 0) {
        b.healTimer = 6;
        for (const e of state.enemies)
          if (!e.dead && Math.hypot(e.x - b.x, e.y - b.y) < 260)
            e.hp = Math.min(e.maxHp, e.hp + e.maxHp * (e === b ? 0.02 : 0.05));
        state.fx.push({ type: "sonic", x: b.x, y: b.y, r: 260, color: "#94e6bd", life: 1, max: 1 });
        audio.effect("sonic", b.x / W);
      }
    } else if (b.type === "cosmo") {
      b.portalTimer -= dt;
      b.eraseTimer -= dt;
      if (b.portalTimer <= 0) {
        b.portalTimer = b.layersLeft === 1 ? 13 : 18;
        const owned = state.portals.filter((p) => p.owner === b),
          core = points.at(-1),
          choices = [];
        for (let d = pathLength * 0.15; d < pathLength - C * 7; d += C * 2) {
          const p = posAt(d);
          if (
            Math.hypot(p.x - core.x, p.y - core.y) >= C * 5 &&
            !owned.some((o) => Math.abs(o.dist - d) < C * 3)
          )
            choices.push({ dist: d, ...p });
        }
        if (choices.length && owned.length < 3) {
          const p = choices[Math.floor(Math.random() * choices.length)];
          state.portals.push({ ...p, owner: b, life: 22, spawn: 1 });
          state.fx.push({
            type: "blast",
            x: p.x,
            y: p.y,
            r: 50,
            color: "#b99af4",
            life: 0.8,
            max: 0.8,
          });
          audio.effect("crystal", p.x / W);
          toast("Космо открыл пространственный разлом");
        }
      }
      if (b.eraseTimer <= 0) {
        b.eraseTimer = b.layersLeft === 1 ? 10 : 14;
        let choices = platforms.filter(
          (p) =>
            !p.destroyed &&
            !state.hazards.some((h) => h.p === p) &&
            Math.hypot(p.x - b.x, p.y - b.y) < 420,
        );
        choices.sort(
          (a, c) =>
            (towerAt(c)?.bossDamage || 0) +
            (towerAt(c) ? 100 : 0) -
            ((towerAt(a)?.bossDamage || 0) + (towerAt(a) ? 100 : 0)),
        );
        if (choices.length) state.hazards.push({ p: choices[0], owner: b, life: 2.4, max: 2.4 });
      }
    }
  }
  function updateWorld(dt) {
    for (const l of state.lava) l.life -= dt;
    state.lava = state.lava.filter((l) => l.life > 0);
    for (const p of state.portals) {
      p.life -= dt;
      p.spawn -= dt;
      if (p.life > 0 && p.spawn <= 0 && !p.owner.dead && state.enemies.length < 240) {
        p.spawn = 3;
        const e = spawnEnemy("cosmicMinion", p.dist);
        state.summoned++;
      }
    }
    state.portals = state.portals.filter((p) => p.life > 0 && !p.owner.dead);
    for (const h of state.hazards) {
      h.life -= dt;
      if (h.life <= 0 && !h.owner.dead) erasePlatform(h.p, h.owner);
    }
    state.hazards = state.hazards.filter((h) => h.life > 0 && !h.owner.dead);
  }
  function drawAllies() {
    for (const a of state.allies) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle + Math.PI);
      ctx.fillStyle = "#200f17";
      ctx.strokeStyle = "#f2859a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(-9, -11);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-9, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#e75270";
      polygon(0, 0, 4, 7, 0);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#f59caf";
      ctx.fillRect(a.x - 11, a.y - 19, (22 * a.hp) / a.maxHp, 2);
    }
  }
  function drawSectorBackdrop() {
    if (levelIndex === 0) return;
    ctx.save();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = currentLevel.color + "09";
    for (let x = 0; x < W; x += C) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += C) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    if (levelIndex === 3) {
      for (let i = 0; i < 110; i++) {
        const x = (i * 173 + 71) % W,
          y = (i * i * 37 + 59) % H;
        ctx.fillStyle = i % 5 ? "#b5a9d737" : "#e7d4ff80";
        ctx.fillRect(x, y, i % 5 ? 1 : 2, i % 5 ? 1 : 2);
      }
    } else
      for (let i = 0; i < 30; i++) {
        const x = (i * 191 + 30) % W,
          y = (i * i * 73 + 30) % H;
        ctx.fillStyle = currentLevel.color + "08";
        polygon(x, y, levelIndex === 1 ? 5 : 6, 14 + (i % 18), i * 0.6);
        ctx.fill();
      }
    ctx.restore();
  }
  function drawSectorWorld() {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = 1;
    for (const p of platforms.filter((p) => p.destroyed)) {
      ctx.strokeStyle = "#b28bde55";
      ctx.setLineDash([3, 5]);
      ctx.strokeRect(p.x - 22, p.y - 22, 44, 44);
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(p.x - 9, p.y - 9);
      ctx.lineTo(p.x + 9, p.y + 9);
      ctx.moveTo(p.x + 9, p.y - 9);
      ctx.lineTo(p.x - 9, p.y + 9);
      ctx.stroke();
    }
    for (const l of state.lava) {
      ctx.globalAlpha = Math.min(0.65, l.life / 3);
      ctx.fillStyle = "#a53e24";
      ctx.beginPath();
      ctx.ellipse(l.x, l.y, 30, 22, l.angle || 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "#ffb368";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l.x - 18, l.y + 3);
      ctx.lineTo(l.x - 4, l.y - 7);
      ctx.lineTo(l.x + 10, l.y + 5);
      ctx.lineTo(l.x + 18, l.y - 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of state.portals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(clock * 0.7);
      polygon(0, 0, 6, 27);
      ctx.fillStyle = "#4c2d6ed0";
      ctx.fill();
      ctx.strokeStyle = "#d0abff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.rotate(-clock * 1.8);
      polygon(0, 0, 4, 16);
      ctx.stroke();
      ctx.fillStyle = "#e9ccff";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    for (const h of state.hazards) {
      const p = h.p;
      ctx.strokeStyle = "#f7c3ff";
      ctx.fillStyle =
        "#c477ff" +
        Math.round((0.15 + 0.12 * Math.sin(clock * 13)) * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.lineWidth = 2;
      ctx.fillRect(p.x - 28, p.y - 28, 56, 56);
      ctx.strokeRect(p.x - 28, p.y - 28, 56, 56);
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(h.owner.x, h.owner.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#ffe3ff";
      ctx.textAlign = "center";
      ctx.font = "bold 12px Arial";
      ctx.fillText(h.life.toFixed(1), p.x, p.y - 34);
    }
    ctx.restore();
  }
  function drawSectorEnemy(e) {
    const b = ET[e.type];
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.lineWidth = 1.6;
    if (e.type === "magma" || e.type === "magmaMinion") {
      const r = b.r;
      ctx.rotate(e.angle * 0.15 + Math.sin(clock * 0.8) * 0.04);
      polygon(0, 0, 7, r, 0);
      ctx.fillStyle = "#482b29";
      ctx.fill();
      ctx.strokeStyle = "#e68d56";
      ctx.stroke();
      polygon(0, 0, 5, r * 0.69, 0.3);
      ctx.fillStyle = "#d96838";
      ctx.fill();
      polygon(-r * 0.12, -r * 0.14, 4, r * 0.38, 0.6);
      ctx.fillStyle = "#ffc17a";
      ctx.fill();
      ctx.strokeStyle = "#ffb763";
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 5; i++) {
        const a = (i * TAU) / 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.35, Math.sin(a) * r * 0.35);
        ctx.lineTo(Math.cos(a + 0.2) * r * 0.76, Math.sin(a + 0.2) * r * 0.76);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
      if (e.type === "magma") {
        ctx.fillStyle = "#ffdea1";
        ctx.fillRect(-13, -6, 8, 4);
        ctx.fillRect(5, -6, 8, 4);
      }
    } else if (e.type === "asterix" || e.type === "asterPart") {
      ctx.rotate(e.angle);
      const tail = e.segment === 9,
        r = tail ? 16 : b.r;
      polygon(0, 0, 6, r, Math.PI / 6);
      ctx.fillStyle = tail ? "#537e61" : e.type === "asterix" ? "#527964" : "#375f50";
      ctx.fill();
      ctx.strokeStyle = "#b3e7b6";
      ctx.stroke();
      polygon(-2, 0, 4, r * 0.7, 0);
      ctx.fillStyle = e.type === "asterix" ? "#b5dc8c" : "#6dac80";
      ctx.fill();
      ctx.strokeStyle = "#cceab5";
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.45);
      ctx.lineTo(0, 0);
      ctx.lineTo(-r * 0.8, r * 0.45);
      ctx.stroke();
      if (e.type === "asterix") {
        ctx.fillStyle = "#f7ffe1";
        ctx.beginPath();
        ctx.arc(8, -9, 3, 0, TAU);
        ctx.arc(8, 9, 3, 0, TAU);
        ctx.fill();
      }
    } else {
      const r = b.r;
      ctx.rotate(clock * 0.25);
      polygon(0, 0, 6, r, Math.PI / 6);
      ctx.fillStyle = e.type === "cosmo" ? "#553478" : "#72618f";
      ctx.fill();
      ctx.strokeStyle = "#d4b1ff";
      ctx.stroke();
      polygon(0, 0, 4, r * 0.78, 0);
      ctx.fillStyle = "#9670ce";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.78);
      ctx.lineTo(0, r * 0.78);
      ctx.lineTo(r * 0.78, 0);
      ctx.fillStyle = "#c49cef";
      ctx.fill();
      if (e.type === "cosmo")
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = ["#9870e5", "#bf93f5", "#e2baff"][i];
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.ellipse(
            0,
            0,
            r + 9 + i * 7,
            (r + 9 + i * 7) * 0.5,
            clock * (i % 2 ? -0.35 : 0.3) + i,
            0,
            TAU,
          );
          ctx.stroke();
        }
    }
    ctx.restore();
    if (e.hp < e.maxHp) {
      ctx.fillStyle = "#101010";
      ctx.fillRect(e.x - 18, e.y - b.r - 12, 36, 3);
      ctx.fillStyle = b.color;
      ctx.fillRect(e.x - 18, e.y - b.r - 12, (36 * e.hp) / e.maxHp, 3);
    }
  }
  function bossBrief() {
    const desc = {
      boss: "Сетка: 16000 HP, защита 60%. Здоровье: 22000 HP, защита 30%. Луч выбирает опаснейшую и ближайшую башни. После разрушения сетки — ярость ядра: луч и призыв каждые 8 с. Миньоны: 1200 HP.",
      magma:
        "32000 HP, защита 38%. Метает магму в башни: 6 с урона −30% и скорости атаки −45%. След лавы живёт 10 с и ускоряет врагов на 35%. Каждые 13 с призывает двух миньонов: 6500 HP, скорость 23, защита 35%.",
      asterix:
        "10 частей: голова 18000 HP и 9 сегментов по 2400 HP. Пока жив хотя бы один сегмент хвоста, голова получает только 8% урона. Части — самостоятельные цели. Каждые 6 с лечит союзников в радиусе 4,6 клетки: 5% HP; себе восстанавливает 2%.",
      cosmo:
        "Три последовательные оболочки по 18000 HP, защита 35%. Открывает порталы на дороге: не ближе 5 клеток к ядру и с запасом пути не меньше 7 клеток. Разломы живут 22 с и выпускают врагов раз в 3 с. Стирание платформы отмечается за 2,4 с: башня на ней тоже исчезает, без возврата монет. На последней оболочке способности ускоряются.",
    };
    return `<b>40-я волна · ${ET[currentLevel.boss].name}</b><p>${desc[currentLevel.boss]}</p><p>Пропуск босса означает поражение. По боссам и миньонам эффективность всегда 100; процентный урон Пиротехника по боссам отключён. Замедление босса не выше 25%, заморозка до 0,5 с с иммунитетом 6 с; снятие защиты не выше 12 п.п.</p>`;
  }
  function renderLevelCards() {
    $("#closeLevels").style.visibility = levelChosen ? "visible" : "hidden";
    $("#levelCards").innerHTML = LEVELS.map(
      (l, i) =>
        `<button class="level-card" data-level="${i}" style="--sector:${l.color}"><span class="sector-number">СЕКТОР 0${i + 1}</span><canvas width="248" height="152" aria-label="Карта ${l.name}"></canvas><h2>${l.name}</h2><p>${l.subtitle}</p><div class="sector-boss">${sprites.enemyIcon(l.boss)}<div><b>${ET[l.boss].name}</b><small>Финальный босс · волна 40</small></div></div><span class="sector-enter">${l.track}<span>→</span></span><small class="track-style">${l.style}</small></button>`,
    ).join("");
    $$(".level-card").forEach((button, i) => {
      const l = LEVELS[i],
        c = button.querySelector("canvas"),
        g = c.getContext("2d"),
        scale = Math.min(220 / l.w, 124 / l.h),
        ox = (248 - l.w * scale) / 2,
        oy = (152 - l.h * scale) / 2;
      g.fillStyle = l.bg;
      g.fillRect(0, 0, 248, 152);
      g.lineJoin = "miter";
      g.lineWidth = 6;
      g.strokeStyle = l.road;
      g.beginPath();
      l.route.forEach(([x, y], j) => {
        const X = ox + (x * C + C / 2) * scale,
          Y = oy + (y * C + C / 2) * scale;
        j ? g.lineTo(X, Y) : g.moveTo(X, Y);
      });
      g.stroke();
      for (const [[x, y], color] of [
        [l.route[0], "#b5a1f0"],
        [l.route.at(-1), "#87e5ee"],
      ]) {
        g.fillStyle = color;
        g.beginPath();
        g.arc(ox + (x * C + C / 2) * scale, oy + (y * C + C / 2) * scale, 4, 0, TAU);
        g.fill();
      }
      button.onclick = () => {
        levelIndex = i;
        levelChosen = true;
        $("#levelModal").close();
        reset();
        fitCanvas();
        audio.startMusic();
        toast(`${l.name} · выберите платформу для строительства`);
      };
    });
  }
  function markTest(message) {
    state.adminUsed = true;
    $("#testBadge").classList.remove("hidden");
    $("#adminMessage").textContent = message;
    updateHUD();
    refreshPanel();
  }
  function numberInput(id, min, max) {
    const value = Number($("#" + id).value);
    return clamp(Number.isFinite(value) ? value : min, min, max);
  }
  function clearBattle() {
    state.enemies = [];
    state.allies = [];
    state.spawn = [];
    state.shots = [];
    state.fx = [];
    state.portals = [];
    state.lava = [];
    state.hazards = [];
    state.boss = null;
    state.bossDefeated = false;
    state.active = false;
    state.ended = false;
    autoTimer = 0;
    for (const t of state.towers) {
      t.frozen = false;
      t.marked = 0;
      t.boomAway = false;
      t.magmaTime = 0;
      t.stun = 0;
    }
    $("#endModal").close();
    selected = null;
    renderPanel();
    audio.setBoss(false);
  }
  function adminTypeDefaults() {
    const k = $("#spawnType").value,
      b = ET[k];
    $("#spawnHP").value = b.hp;
    $("#spawnSpeed").value = b.speed;
    $("#spawnArmor").value = b.defense;
    $("#spawnShield").value = b.shield || 0;
    $("#spawnReward").value = b.reward;
  }
  $("#chooseLevel").onclick = () => {
    renderLevelCards();
    openDialog("levelModal");
  };
  $("#closeLevels").onclick = () => {
    if (levelChosen) closeDialog($("#levelModal"));
  };
  $("#endMaps").onclick = () => {
    $("#endModal").close();
    renderLevelCards();
    openDialog("levelModal");
  };
  $("#admin").onclick = () => openDialog("adminModal");
  $("#spawnType").innerHTML = Object.keys(ET)
    .map(
      (k) => `<option value="${k}">${ET[k].name}${isBoss({ type: k }) ? " · БОСС" : ""}</option>`,
    )
    .join("");
  $("#spawnType").onchange = adminTypeDefaults;
  adminTypeDefaults();
  $("#giveGold").onclick = () => {
    state.money = Math.min(1e9, state.money + numberInput("adminGold", 0, 1e7));
    markTest("Золото добавлено");
  };
  $("#giveLives").onclick = () => {
    state.hp = Math.min(1e6, state.hp + numberInput("adminLives", 1, 1e5));
    markTest("Жизни добавлены");
  };
  $("#goWave").onclick = () => {
    const n = Math.floor(numberInput("adminWave", 1, 40));
    clearBattle();
    state.wave = n - 1;
    state.cleared = n - 1;
    startWave();
    markTest(`Волна ${n} запущена`);
  };
  $("#clearEnemies").onclick = () => {
    clearBattle();
    markTest("Противники очищены");
  };
  $("#spawnCustom").onclick = () => {
    state.ended = false;
    state.wave = Math.max(1, state.wave);
    state.active = true;
    autoTimer = 0;
    const k = $("#spawnType").value,
      n = Math.floor(numberInput("spawnCount", 1, isBoss({ type: k }) ? 4 : 30));
    for (let i = 0; i < n; i++) {
      const e = spawnEnemy(
        k,
        Math.max(0, (pathLength * numberInput("spawnPosition", 0, 90)) / 100 - i * 25),
      );
      e.hp = e.maxHp = numberInput("spawnHP", 1, 1e7);
      e.speed = numberInput("spawnSpeed", 0, 1000);
      e.defense = numberInput("spawnArmor", 0, 95);
      e.reward = numberInput("spawnReward", 0, 1e6);
      e.shield = e.maxShield = numberInput("spawnShield", 0, 1e7);
      e.shieldDefense = e.defense;
      if (e.parts)
        for (const p of e.parts) {
          p.hp = p.maxHp = Math.max(1, e.maxHp / 7.5);
          p.speed = e.speed;
        }
    }
    audio.startMusic();
    markTest(`Создано: ${ET[k].name} × ${n}`);
  };

  // Read-only inspection surface for reproducible browser tests. No game cheats.
  window.vectorDefense = {
    snapshot: () => ({
      level: currentLevel.id,
      mapSize: { width: W, height: H },
      bossType: currentLevel.boss,
      adminUsed: state.adminUsed,
      allies: state.allies.map((a) => ({ hp: a.hp, dist: a.dist, x: a.x, y: a.y })),
      portals: state.portals.map((p) => ({ dist: p.dist, life: p.life, x: p.x, y: p.y })),
      destroyedPlatforms: platforms.filter((p) => p.destroyed).map((p) => ({ c: p.c, r: p.r })),
      hp: state.hp,
      money: state.money,
      wave: state.wave,
      kills: state.kills,
      active: state.active,
      ended: state.ended,
      cleared: state.cleared,
      autoTimer,
      paused,
      speed,
      enemies: state.enemies.map((e) => ({
        id: e.id,
        type: e.type,
        hp: e.hp,
        maxHp: e.maxHp,
        shield: e.shield,
        layersLeft: e.layersLeft,
        segment: e.segment,
        defense: defense(e),
        speed: enemySpeed(e),
        rage: e.rage,
        slow: e.slow,
        slowTime: e.slowTime,
        chill: e.chill,
        freezeTime: e.freezeTime,
        freezeLock: e.freezeLock,
        pushLock: e.pushLock,
        burnTime: e.burnTime,
        cuts: { ...e.cuts },
        debuff: e.debuff,
        debuffTime: e.debuffTime,
        dist: e.dist,
        x: e.x,
        y: e.y,
      })),
      pending: state.spawn.length,
      towers: state.towers.map((t) => ({
        id: t.id,
        type: t.type,
        c: t.c,
        r: t.r,
        level: t.level,
        rank: t.rank,
        xp: t.xp,
        abilities: [...t.abilities],
        frozen: t.frozen,
        stun: t.stun,
        burstLeft: t.burstLeft,
        spin: t.spin,
        damageDone: t.damageDone,
        stats: stat(t),
        spent: t.spent,
      })),
      boss: state.boss
        ? {
            type: state.boss.type,
            maxHp: state.boss.maxHp,
            layersLeft: state.boss.layersLeft,
            hp: state.boss.hp,
            shield: state.boss.shield,
            dead: state.boss.dead,
            dist: state.boss.dist,
          }
        : null,
      bossDefeated: state.bossDefeated,
      crystallized: state.crystallized,
      summoned: state.summoned,
      camera: {
        x: camera.x,
        y: camera.y,
        zoom: camera.zoom,
        tx: camera.tx,
        ty: camera.ty,
        targetZoom: camera.targetZoom,
        fit: camera.fit,
      },
      platforms: platformCoords,
      towerOrder: [...TOWER_ORDER],
      prices: Object.fromEntries(TOWER_ORDER.map((type) => [type, TYPES[type].price])),
      waves: WAVES.map((w) => ({ n: w.n, counts: w.counts, hp: w.hp, total: w.queue.length })),
      effectiveness: Object.fromEntries(Object.entries(TYPES).map(([k, t]) => [k, t.effect])),
    }),
    worldToScreen: (x, y) => {
      const r = canvas.getBoundingClientRect(),
        s = camera.fit * camera.zoom;
      return {
        x: r.left + camera.width / 2 + (x - camera.x) * s,
        y: r.top + camera.height / 2 + (y - camera.y) * s,
      };
    },
    audioStatus: () => audio.status(),
  };
  window.addEventListener("resize", fitCanvas);
  fitCanvas();
  reset();
  renderLevelCards();
  openDialog("levelModal");
  requestAnimationFrame(loop);
})();
