var FishingGame = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var src_exports = {};
  __export(src_exports, {
    createGame: () => createGame,
    default: () => src_default
  });

  // src/prng.js
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function() {
      a |= 0;
      a = a + 1831565813 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(rng, items, weightKey = "w") {
    const total = items.reduce((s, it) => s + (it[weightKey] || 0), 0);
    let r = rng() * total;
    for (const it of items) {
      if ((r -= it[weightKey] || 0) <= 0)
        return it;
    }
    return items[items.length - 1];
  }
  function pickOne(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  // src/data/baits.js
  var BAITS = {
    basic_worm: { id: "basic_worm", name: "\u666E\u901A\u86AF\u8693", price: 5, rareBoost: 0, desc: "\u6700\u57FA\u7840\u7684\u9C7C\u9975" },
    shiny_lure: { id: "shiny_lure", name: "\u95EA\u4EAE\u5047\u9975", price: 30, rareBoost: 1, desc: "\u7A00\u6709\u5EA6\u63D0\u5347" },
    deep_bait: { id: "deep_bait", name: "\u6DF1\u6D77\u8BF1\u9975", price: 80, rareBoost: 2, desc: "\u9AD8\u7A00\u6709\u5EA6\u52A0\u6210" }
  };
  var OXYGEN = { id: "oxygen", name: "\u6C27\u6C14\u74F6", price: 40, desc: "\u6F5C\u6C34\u6D88\u8017\u54C1" };
  var OXYGEN_DISCOUNT = [{ min: 10, rate: 0.7 }, { min: 5, rate: 0.8 }];

  // src/data/fish.js
  var FISH = {
    bluegill: { id: "bluegill", name: "\u84DD\u9CC3\u592A\u9633\u9C7C", rarity: 1, price: 8, locs: ["moon_pond"] },
    carp: { id: "carp", name: "\u9CA4\u9C7C", rarity: 1, price: 10, locs: ["moon_pond", "reed_river"] },
    crucian: { id: "crucian", name: "\u9CAB\u9C7C", rarity: 1, price: 9, locs: ["moon_pond", "reed_river"] },
    silver_carp: { id: "silver_carp", name: "\u94F6\u9CAB", rarity: 2, price: 35, locs: ["moon_pond"] },
    pond_smelt: { id: "pond_smelt", name: "\u6C60\u5858\u94F6\u9C7C", rarity: 2, price: 40, locs: ["moon_pond"] },
    jade_frog: { id: "jade_frog", name: "\u7FE1\u7FE0\u86D9", rarity: 3, price: 95, locs: ["moon_pond"] },
    lotus_koi: { id: "lotus_koi", name: "\u83B2\u7EB9\u9526\u9CA4", rarity: 3, price: 110, locs: ["moon_pond"] },
    moon_koi: { id: "moon_koi", name: "\u6708\u5149\u9526\u9CA4", rarity: 4, price: 400, locs: ["moon_pond"] },
    chub: { id: "chub", name: "\u767D\u6761", rarity: 1, price: 7, locs: ["reed_river"] },
    reed_crab: { id: "reed_crab", name: "\u82A6\u82C7\u87F9", rarity: 2, price: 38, locs: ["reed_river"] },
    catfish: { id: "catfish", name: "\u9CB6\u9C7C", rarity: 2, price: 42, locs: ["reed_river"] },
    spring_smelt: { id: "spring_smelt", name: "\u6625\u6C5B\u94F6\u9C7C", rarity: 3, price: 88, locs: ["reed_river"] },
    river_eel: { id: "river_eel", name: "\u6CB3\u9CD7", rarity: 3, price: 105, locs: ["reed_river"] },
    golden_barb: { id: "golden_barb", name: "\u91D1\u9CCD\u9C83", rarity: 4, price: 390, locs: ["reed_river"] },
    brook_minnow: { id: "brook_minnow", name: "\u6EAA\u6D41\u9CA6", rarity: 1, price: 8, locs: ["dawn_stream"] },
    stone_loach: { id: "stone_loach", name: "\u77F3\u6CE5\u9CC5", rarity: 1, price: 9, locs: ["dawn_stream"] },
    brook_trout: { id: "brook_trout", name: "\u6EAA\u6D41\u9CDF\u9C7C", rarity: 2, price: 45, locs: ["dawn_stream"] },
    crystal_minnow: { id: "crystal_minnow", name: "\u6C34\u6676\u9CA6", rarity: 3, price: 110, locs: ["dawn_stream"] },
    dawn_salmon: { id: "dawn_salmon", name: "\u6668\u5149\u9C91", rarity: 3, price: 125, locs: ["dawn_stream"] },
    prism_fish: { id: "prism_fish", name: "\u68F1\u955C\u9C7C", rarity: 4, price: 420, locs: ["dawn_stream"] },
    lake_smelt: { id: "lake_smelt", name: "\u6E56\u94F6\u9C7C", rarity: 1, price: 8, locs: ["sunset_lake"] },
    yellow_perch: { id: "yellow_perch", name: "\u9EC4\u9C88", rarity: 1, price: 10, locs: ["sunset_lake"] },
    sunset_bass: { id: "sunset_bass", name: "\u843D\u65E5\u9C88\u9C7C", rarity: 2, price: 48, locs: ["sunset_lake"] },
    mirror_carp: { id: "mirror_carp", name: "\u955C\u9CA4", rarity: 3, price: 115, locs: ["sunset_lake"] },
    amber_pike: { id: "amber_pike", name: "\u7425\u73C0\u72D7\u9C7C", rarity: 3, price: 135, locs: ["sunset_lake"] },
    golden_carp: { id: "golden_carp", name: "\u91D1\u9CDE\u9CA4", rarity: 4, price: 380, locs: ["sunset_lake"] },
    autumn_king: { id: "autumn_king", name: "\u79CB\u65E5\u738B\u9C91", rarity: 4, price: 450, locs: ["sunset_lake"] },
    mud_loach: { id: "mud_loach", name: "\u6CE5\u9CC5", rarity: 1, price: 6, locs: ["mist_swamp"] },
    swamp_shrimp: { id: "swamp_shrimp", name: "\u6CBC\u6CFD\u867E", rarity: 1, price: 7, locs: ["mist_swamp"] },
    black_carp: { id: "black_carp", name: "\u4E4C\u9CA4", rarity: 2, price: 50, locs: ["mist_swamp"] },
    swamp_cat: { id: "swamp_cat", name: "\u6CBC\u6CFD\u9CB6", rarity: 2, price: 55, locs: ["mist_swamp"] },
    snakehead: { id: "snakehead", name: "\u9ED1\u9C7C", rarity: 3, price: 120, locs: ["mist_swamp"] },
    bog_turtle: { id: "bog_turtle", name: "\u6CBC\u6CFD\u9F9F", rarity: 3, price: 140, locs: ["mist_swamp"] },
    loach_king: { id: "loach_king", name: "\u6CE5\u9CC5\u738B", rarity: 4, price: 420, locs: ["mist_swamp"] },
    bog_lurker: { id: "bog_lurker", name: "\u6CE5\u6CBC\u6F5C\u4F0F\u8005", rarity: 4, price: 460, locs: ["mist_swamp"] },
    swamp_dragon: { id: "swamp_dragon", name: "\u6CBC\u6CFD\u9F99\u9C7C", rarity: 5, price: 1500, locs: ["mist_swamp"] },
    celestial_koi: { id: "celestial_koi", name: "\u5929\u754C\u9526\u9CA4", rarity: 6, price: 8e3, locs: ["moon_pond", "sunset_lake"] },
    abyss_leviathan: { id: "abyss_leviathan", name: "\u6DF1\u6E0A\u5229\u7EF4\u5766", rarity: 6, price: 12e3, locs: ["mist_swamp"] }
  };
  var JUNK = {
    boot: { id: "boot", name: "\u7834\u9774\u5B50", price: 1 },
    driftwood: { id: "driftwood", name: "\u70C2\u6728\u5934", price: 2 },
    weed: { id: "weed", name: "\u6C34\u8349", price: 1 }
  };

  // src/data/seasons.js
  var SEASONS = ["\u6625", "\u590F", "\u79CB", "\u51AC"];

  // src/engine.js
  var UID = 1;
  var Engine = class {
    constructor(seed = Date.now() >>> 0) {
      this.seed = seed >>> 0;
      this.rng = mulberry32(this.seed);
      this.pts = 200;
      this.loc = "moon_pond";
      this.seasonIdx = 0;
      this.turn = 0;
      this.bait = { basic_worm: 5 };
      this.oxygen = 0;
      this.inventory = [];
      this.encyclopedia = /* @__PURE__ */ new Set();
      this.chests = [];
      this.buffs = {};
      this.fragments = {};
      this.diveUnlocked = {};
      this.diving = null;
    }
    get season() {
      return SEASONS[this.seasonIdx];
    }
    addItem(type, id, price) {
      const it = { uid: UID++, type, id, price };
      this.inventory.push(it);
      return it;
    }
    addChest() {
      const uid = UID++;
      this.chests.push(uid);
      return uid;
    }
    cheapestBait() {
      const owned = Object.keys(this.bait).filter((k) => this.bait[k] > 0);
      if (!owned.length)
        return null;
      return owned.sort((a, b) => BAITS[a].price - BAITS[b].price)[0];
    }
    statusBar() {
      return JSON.stringify({
        pts: this.pts,
        loc: this.loc,
        sea: this.season,
        turn: this.turn,
        enc: this.encyclopedia.size + "/" + Object.keys(FISH).length,
        bait: this.bait,
        hold: this.inventory.filter((i) => i.type === "fish").length,
        chest: this.chests.length,
        oxy: this.oxygen || 0
      });
    }
    save() {
      return JSON.stringify({ seed: this.seed, pts: this.pts, loc: this.loc, seasonIdx: this.seasonIdx, turn: this.turn, bait: this.bait, oxygen: this.oxygen, inventory: this.inventory, encyclopedia: [...this.encyclopedia], chests: this.chests, buffs: this.buffs, fragments: this.fragments, diveUnlocked: this.diveUnlocked });
    }
  };

  // src/data/locations.js
  var LOCATIONS = {
    moon_pond: { id: "moon_pond", name: "\u6708\u5149\u6C60\u5858", unlocked: true, depth: 3, desc: "\u65B0\u624B\u6751", rarityW: { 1: 70, 2: 25, 3: 4, 4: 1 }, junkRate: 0.05, fragNeed: 3 },
    reed_river: { id: "reed_river", name: "\u82A6\u82C7\u6CB3", unlocked: true, depth: 4, desc: "\u521D\u7EA7\u6D41\u6C34", rarityW: { 1: 60, 2: 30, 3: 8, 4: 2 }, junkRate: 0.12, fragNeed: 3 },
    dawn_stream: { id: "dawn_stream", name: "\u6668\u9732\u6EAA", unlocked: true, depth: 4, desc: "\u8FDB\u9636\u6EAA\u6D41", rarityW: { 1: 45, 2: 35, 3: 15, 4: 5 }, junkRate: 0.06, darkCurrent: 0.15, fragNeed: 4 },
    sunset_lake: { id: "sunset_lake", name: "\u843D\u65E5\u6E56", unlocked: true, depth: 5, desc: "\u4E2D\u7EA7\u6E56\u6CCA", rarityW: { 1: 35, 2: 35, 3: 22, 4: 8 }, junkRate: 0.08, autumnEpicBoost: true, fragNeed: 5 },
    mist_swamp: { id: "mist_swamp", name: "\u8FF7\u96FE\u6CBC\u6CFD", unlocked: true, depth: 6, desc: "\u9AD8\u98CE\u9669\u9AD8\u56DE\u62A5", rarityW: { 1: 20, 2: 25, 3: 30, 4: 20, 5: 5 }, junkRate: 0.35, legendChance: 5e-3, fragNeed: 5 }
  };

  // src/data/events.js
  var EVENTS = [
    { id: "bottle", name: "\u6F02\u6D41\u74F6", w: 30, type: "bottle" },
    { id: "chest", name: "\u5B9D\u7BB1", w: 20, type: "chest" },
    { id: "treasure", name: "\u5B9D\u7269", w: 15, type: "treasure" },
    { id: "fragment", name: "\u85CF\u5B9D\u56FE\u788E\u7247", w: 25, type: "fragment" },
    { id: "nothing", name: "\u7A7A\u94A9", w: 10, type: "nothing" }
  ];
  var BOTTLES = [
    { id: "bottle_pts", name: "\u88C5\u6709\u7EB8\u6761\u7684\u74F6", w: 40, effect: "pts", value: 50 },
    { id: "bottle_frag", name: "\u788E\u56FE\u6F02\u6D41\u74F6", w: 30, effect: "fragment" },
    { id: "bottle_oxy", name: "\u5BC6\u5C01\u6C27\u6C14\u74F6", w: 20, effect: "oxygen", value: 1 },
    { id: "bottle_map", name: "\u5B8C\u6574\u85CF\u5B9D\u56FE", w: 10, effect: "fullmap" }
  ];

  // src/modules/buffs.js
  var BUFF_TYPES = {
    splitHook: { id: "splitHook", name: "\u5206\u88C2\u9C7C\u94A9", desc: "\u4E00\u7AFF\u9493\u4E0A3\u6761\u9C7C", duration: 1 },
    goldTouch: { id: "goldTouch", name: "\u70B9\u77F3\u6210\u91D1", desc: "\u672C\u6B21\u9C7C\u4EF7\u503C\xD73", duration: 1 },
    hotStreak: { id: "hotStreak", name: "\u6E14\u83B7\u70ED\u6F6E", desc: "\u63A5\u4E0B\u67653\u6761\u9C7C\u7FFB\u500D", duration: 3 },
    riverGod: { id: "riverGod", name: "\u6CB3\u795E\u7684\u795D\u798F", desc: "\u63A5\u4E0B\u67653\u7AFF\u4E0D\u8017\u9975", duration: 3 },
    greatTide: { id: "greatTide", name: "\u5343\u8F7D\u96BE\u9022\u7684\u6DA8\u6F6E", desc: "\u5FC5\u9493\u7834\u7EAA\u5F55\u5927\u9C7C", duration: 1 },
    pearl: { id: "pearl", name: "\u868C\u4E2D\u751F\u73E0", desc: "\u989D\u5916\u83B7\u5F97\u8D22\u5B9D", duration: 1 }
  };
  var BUFF_CHANCE = 0.08;
  function rollBuff(rng) {
    const r = rng();
    if (r > BUFF_CHANCE)
      return null;
    const keys = Object.keys(BUFF_TYPES);
    return keys[Math.floor(rng() * keys.length)];
  }

  // src/modules/cast.js
  var JUNKS = Object.values(JUNK);
  function doCast(game, baitId, times, stopFlags) {
    const log = [];
    let stopped = false;
    for (let i = 0; i < times && !stopped; i++) {
      const bid = baitId || game.cheapestBait();
      if (!bid || !game.bait[bid]) {
        log.push("\u274C \u6CA1\u6709\u53EF\u7528\u9C7C\u9975\uFF0C\u8BF7\u5148 buy\u3002");
        break;
      }
      if (game.buffs.riverGod > 0)
        game.buffs.riverGod--;
      else {
        game.bait[bid]--;
        if (game.bait[bid] <= 0)
          delete game.bait[bid];
      }
      game.turn++;
      const beforeSeason = game.seasonIdx;
      game.seasonIdx = (game.seasonIdx + 1) % 4;
      const loc = LOCATIONS[game.loc];
      if (loc.darkCurrent && game.rng() < loc.darkCurrent) {
        const b2 = game.cheapestBait();
        if (b2) {
          game.bait[b2] = Math.max(0, (game.bait[b2] || 0) - 1);
          if (!game.bait[b2])
            delete game.bait[b2];
        }
        log.push("\u{1F30A} \u7B2C" + (i + 1) + "\u7AFF\uFF1A\u6C34\u4E0B\u6697\u6D41\uFF01");
      }
      if (game.rng() < 0.1) {
        const ev = pick(game.rng, EVENTS);
        log.push("\u{1F381} \u7B2C" + (i + 1) + "\u7AFF\uFF1A" + handleEvent(game, ev));
        if (stopFlags.includes("event")) {
          stopped = true;
          continue;
        }
        continue;
      }
      const buff = rollBuff(game.rng);
      if (buff) {
        game.buffs[buff] = (game.buffs[buff] || 0) + BUFF_TYPES[buff].duration;
        log.push("\u{1F31F} \u5E78\u8FD0\u65F6\u523B\uFF1A" + BUFF_TYPES[buff].name + "\uFF01");
      }
      const results = rollCatch(game, loc, bid);
      for (const r of results) {
        if (r.tier === "junk" || r.rarity === 1 && !r.isNew)
          log.push("\xB7 \u7B2C" + (i + 1) + "\u7AFF\uFF1A" + r.name + "\uFF08" + r.price + "\u70B9\uFF09");
        else
          log.push("\u2728 \u7B2C" + (i + 1) + "\u7AFF\uFF1A" + r.name + " [\u7A00\u6709\u5EA6" + r.rarity + "]\uFF08" + r.price + "\u70B9\uFF09");
        if (r.isNew)
          log.push("\u{1F195} \u65B0\u79CD\u5165\u5E93\uFF1A" + r.name);
        if (stopFlags.includes("new") && r.isNew)
          stopped = true;
        if (stopFlags.includes("rare") && r.rarity >= 3)
          stopped = true;
      }
      if (beforeSeason !== game.seasonIdx)
        log.push("\u{1F343} \u5B63\u8282\u63A8\u8FDB \u2192 " + game.season);
    }
    return log.join("\n");
  }
  function handleEvent(game, ev) {
    if (ev.type === "bottle") {
      const b = pick(game.rng, BOTTLES);
      if (b.effect === "pts") {
        game.pts += b.value;
        return "\u6F02\u6D41\u74F6\u5F00\u51FA " + b.value + " \u70B9\u6570";
      }
      if (b.effect === "fragment") {
        addFragment(game);
        return "\u6F02\u6D41\u74F6\u5F00\u51FA\u85CF\u5B9D\u56FE\u788E\u7247";
      }
      if (b.effect === "oxygen") {
        game.oxygen = (game.oxygen || 0) + b.value;
        return "\u6F02\u6D41\u74F6\u5F00\u51FA\u6C27\u6C14\u74F6\xD7" + b.value;
      }
      if (b.effect === "fullmap") {
        game.diveUnlocked[game.loc] = true;
        return "\u6F02\u6D41\u74F6\u5F00\u51FA\u5B8C\u6574\u85CF\u5B9D\u56FE\uFF0C\u89E3\u9501\u6F5C\u6C34\uFF01";
      }
    }
    if (ev.type === "chest") {
      const uid = game.addChest();
      return "\u635E\u5230\u5B9D\u7BB1 #" + uid;
    }
    if (ev.type === "treasure") {
      const v = 50 + Math.floor(game.rng() * 200);
      game.addItem("item", "treasure", v);
      return "\u635E\u5230\u5B9D\u7269\uFF08" + v + "\u70B9\uFF09";
    }
    if (ev.type === "fragment") {
      addFragment(game);
      return "\u635E\u5230\u85CF\u5B9D\u56FE\u788E\u7247";
    }
    return "\u7A7A\u94A9\uFF0C\u4EC0\u4E48\u90FD\u6CA1\u635E\u5230";
  }
  function addFragment(game) {
    game.fragments[game.loc] = (game.fragments[game.loc] || 0) + 1;
    if (game.fragments[game.loc] >= LOCATIONS[game.loc].fragNeed)
      game.diveUnlocked[game.loc] = true;
  }
  function rollCatch(game, loc, baitId) {
    const boost = BAITS[baitId] ? BAITS[baitId].rareBoost : 0;
    const out = [];
    const count = game.buffs.splitHook > 0 ? 3 : 1;
    if (game.buffs.splitHook > 0)
      game.buffs.splitHook--;
    for (let k = 0; k < count; k++) {
      if (game.rng() < loc.junkRate) {
        const junk = pickOne(game.rng, JUNKS);
        game.addItem("item", junk.id, junk.price);
        out.push({ tier: "junk", rarity: 0, name: junk.name, price: junk.price, isNew: false });
        continue;
      }
      const weights = Object.entries(loc.rarityW).map((e) => ({ r: +e[0], w: e[1] + (e[0] >= 3 ? boost * 5 : 0) }));
      const rar = pick(game.rng, weights).r;
      let pool = Object.values(FISH).filter((f) => f.locs.includes(loc.id) && f.rarity === rar);
      if (loc.legendChance && game.rng() < loc.legendChance)
        pool = Object.values(FISH).filter((f) => f.locs.includes(loc.id) && f.rarity === 5);
      if (!pool.length)
        pool = Object.values(FISH).filter((f) => f.locs.includes(loc.id));
      if (!pool.length)
        continue;
      const fish = pickOne(game.rng, pool);
      const isNew = !game.encyclopedia.has(fish.id);
      game.encyclopedia.add(fish.id);
      let price = fish.price;
      if (game.buffs.goldTouch > 0) {
        price *= 3;
        game.buffs.goldTouch--;
      }
      if (game.buffs.hotStreak > 0) {
        price *= 2;
        game.buffs.hotStreak--;
      }
      game.addItem("fish", fish.id, price);
      out.push({ tier: "fish", rarity: fish.rarity, name: fish.name, price, isNew });
    }
    return out;
  }

  // src/data/wonders.js
  var WONDERS = [
    { id: "coral_palace", name: "\u73CA\u745A\u5BAB", w: 10, reward: { type: "treasure", value: 200 } },
    { id: "mermaid_hall", name: "\u4EBA\u9C7C\u5BAB\u6BBF", w: 8, reward: { type: "treasure", value: 350 } },
    { id: "ship_graveyard", name: "\u6C89\u8239\u5893\u573A", w: 8, reward: { type: "chest", value: 1 } },
    { id: "sunken_temple", name: "\u6C89\u6CA1\u795E\u5E99", w: 6, reward: { type: "relic", value: 500 } },
    { id: "whale_fall", name: "\u9CB8\u843D", w: 5, reward: { type: "fish", value: "whale_bone_fish" } },
    { id: "giant_clam", name: "\u5DE8\u868C", w: 10, reward: { type: "pearl", value: 180 } },
    { id: "underwater_cave", name: "\u6C34\u4E0B\u6EB6\u6D1E", w: 9, reward: { type: "oxygen", value: 2 } },
    { id: "kelp_forest", name: "\u6D77\u85FB\u68EE\u6797", w: 9, reward: { type: "fish", value: "kelp_dragon" } },
    { id: "volcanic_vent", name: "\u6D77\u5E95\u706B\u5C71\u53E3", w: 4, reward: { type: "relic", value: 800 } },
    { id: "frozen_abyss", name: "\u51B0\u5C01\u6DF1\u6E0A", w: 4, reward: { type: "treasure", value: 600 } },
    { id: "starfall_pool", name: "\u661F\u9668\u6C60", w: 3, reward: { type: "treasure", value: 1200 } },
    { id: "ghost_ship", name: "\u5E7D\u7075\u8239", w: 3, reward: { type: "chest", value: 2 } },
    { id: "ancient_ruins", name: "\u4E0A\u53E4\u9057\u8FF9", w: 5, reward: { type: "relic", value: 1e3 } },
    { id: "dragon_palace", name: "\u9F99\u5BAB", w: 2, reward: { type: "legendary", value: 3e3 } }
  ];

  // src/data/ruins.js
  var RUINS = [
    { id: "sealed_door", name: "\u5C01\u5370\u4E4B\u95E8", desc: "\u4E00\u6247\u523B\u6EE1\u7B26\u6587\u7684\u77F3\u95E8\u6321\u5728\u9762\u524D\u3002", options: [
      { label: "\u63A8\u5F00\u77F3\u95E8", cost: 3, outcome: { type: "fish", value: "ruin_guardian", desc: "\u95E8\u540E\u51B2\u51FA\u4E00\u6761\u5B88\u536B\u9C7C\uFF01" } },
      { label: "\u7ED5\u9053\u800C\u884C", cost: 1, outcome: { type: "treasure", value: 100, desc: "\u6361\u5230\u4E9B\u8BB8\u9057\u7269\u3002" } },
      { label: "\u4ED4\u7EC6\u7814\u7A76\u7B26\u6587", cost: 2, outcome: { type: "relic", value: 400, desc: "\u83B7\u5F97\u53E4\u9057\u7269\u3002" } }
    ] },
    { id: "altar", name: "\u732E\u796D\u796D\u575B", desc: "\u53E4\u8001\u7684\u796D\u575B\u4E0A\u6B8B\u7559\u7740\u65B0\u9C9C\u7684\u8840\u8FF9\u3002", options: [
      { label: "\u732E\u4E0A\u6E14\u83B7", cost: 2, outcome: { type: "buff", value: "riverGod", desc: "\u6CB3\u795E\u795D\u798F\u4F60\u3002" } },
      { label: "\u7838\u6BC1\u796D\u575B", cost: 4, outcome: { type: "chest", value: 1, desc: "\u9732\u51FA\u9690\u85CF\u5B9D\u7BB1\u3002" } },
      { label: "\u65E0\u89C6\u79BB\u5F00", cost: 0, outcome: { type: "nothing", desc: "\u4F60\u9009\u62E9\u5B89\u5168\u79BB\u5F00\u3002" } }
    ] },
    { id: "sunken_ship", name: "\u6C89\u8239\u6838\u5FC3", desc: "\u8239\u8231\u6DF1\u5904\u4E00\u53EA\u9508\u8FF9\u6591\u6591\u7684\u4FDD\u9669\u7BB1\u7D27\u9501\u7740\u3002", options: [
      { label: "\u64AC\u5F00\u4FDD\u9669\u7BB1", cost: 3, outcome: { type: "treasure", value: 500, desc: "\u7BB1\u5185\u662F\u8239\u957F\u7684\u79C1\u85CF\uFF01" } },
      { label: "\u641C\u522E\u8239\u8231", cost: 1, outcome: { type: "fish", value: "ship_rat_fish", desc: "\u60CA\u52A8\u4E86\u602A\u9C7C\u3002" } },
      { label: "\u5E26\u8D70\u6574\u8258\u8239", cost: 5, outcome: { type: "relic", value: 1500, desc: "\u6253\u635E\u8D77\u6574\u8258\u6C89\u8239\u3002" } }
    ] }
  ];

  // src/modules/dive.js
  function startDive(game, n) {
    const loc = game.loc;
    if (!game.diveUnlocked[loc])
      return "\u274C \u8BE5\u5730\u70B9\u5C1A\u672A\u89E3\u9501\u6F5C\u6C34\u3002";
    if (!game.oxygen || game.oxygen < n)
      return "\u274C \u6C27\u6C14\u4E0D\u8DB3\uFF08\u73B0\u6709 " + (game.oxygen || 0) + " \u74F6\uFF09\u3002";
    game.oxygen -= n;
    game.diving = { loc, oxygen: n, maxOxygen: n, loot: [], pendingRuin: null };
    return "\u{1F93F} \u6F5C\u5165 " + loc + "\uFF0C\u643A\u5E26 " + n + " \u74F6\u6C27\u6C14\u3002\n" + exploreStep(game);
  }
  function exploreStep(game) {
    const d = game.diving;
    if (!d)
      return "\u274C \u5F53\u524D\u672A\u5728\u6F5C\u6C34\u4E2D\u3002";
    if (d.oxygen <= 0)
      return surface(game);
    const log = [];
    if (game.rng() < 0.15) {
      const ruin = pickOne(game.rng, RUINS);
      d.pendingRuin = ruin;
      return renderRuin(ruin, d);
    }
    if (game.rng() < 0.2) {
      const w = pick(game.rng, WONDERS);
      d.oxygen -= 1;
      log.push("\u{1F30A} \u5947\u9047\u3010" + w.name + "\u3011\uFF1A" + applyWonder(game, w));
    } else {
      d.oxygen -= 1;
      const pool = Object.values(FISH).filter((f) => f.locs.includes(d.loc));
      if (pool.length) {
        const fish = pickOne(game.rng, pool);
        const isNew = !game.encyclopedia.has(fish.id);
        game.encyclopedia.add(fish.id);
        game.addItem("fish", fish.id, fish.price);
        log.push("\u{1F41F} \u6C34\u4E0B\u6355\u83B7\uFF1A" + fish.name + "\uFF08" + fish.price + "\u70B9\uFF09" + (isNew ? " \u{1F195}" : ""));
      }
    }
    log.push("\u{1F4A8} \u5269\u4F59\u6C27\u6C14\uFF1A" + d.oxygen);
    if (d.pendingRuin)
      return log.join("\n") + "\n" + renderRuin(d.pendingRuin, d);
    if (d.oxygen <= 0)
      return log.join("\n") + "\n" + surface(game);
    return log.join("\n") + "\n\uFF08\u7EE7\u7EED dive \u63A2\u7D22 / surface \u4E0A\u6D6E\uFF09";
  }
  function renderRuin(ruin, d) {
    const opts = ruin.options.map((o, i) => "  [" + (i + 1) + "] " + o.label + "\uFF08\u8017\u6C27" + o.cost + "\uFF09").join("\n");
    return "\u{1F3DB}\uFE0F \u5927\u9057\u8FF9\u3010" + ruin.name + "\u3011\n" + ruin.desc + "\n" + opts + "\n\u7528 choose <\u7F16\u53F7> \u6289\u62E9\u3002";
  }
  function chooseOption(game, idx) {
    const d = game.diving;
    if (!d || !d.pendingRuin)
      return "\u274C \u5F53\u524D\u6CA1\u6709\u9700\u8981\u6289\u62E9\u7684\u9057\u8FF9\u3002";
    const opt = d.pendingRuin.options[idx - 1];
    if (!opt)
      return "\u274C \u65E0\u6548\u9009\u9879\u3002";
    if (d.oxygen < opt.cost)
      return "\u274C \u6C27\u6C14\u4E0D\u8DB3\uFF08\u9700" + opt.cost + "\uFF0C\u5269" + d.oxygen + "\uFF09\u3002";
    d.oxygen -= opt.cost;
    d.pendingRuin = null;
    const o = opt.outcome;
    let msg = "";
    if (o.type === "fish") {
      game.addItem("fish", o.value, 300);
      msg = "\u9493\u4E0A\u9057\u8FF9\u9C7C";
    } else if (o.type === "treasure") {
      game.addItem("item", "treasure", o.value);
      msg = o.desc;
    } else if (o.type === "relic") {
      game.addItem("item", "relic", o.value);
      msg = o.desc;
    } else if (o.type === "chest") {
      for (let i = 0; i < o.value; i++)
        game.addChest();
      msg = "\u83B7\u5F97\u5B9D\u7BB1\xD7" + o.value;
    } else if (o.type === "buff") {
      game.buffs[o.value] = (game.buffs[o.value] || 0) + 3;
      msg = o.desc;
    } else
      msg = o.desc || "\u65E0\u4E8B\u53D1\u751F";
    return "\u2705 " + opt.label + "\uFF1A" + msg + "\n\u{1F4A8} \u5269\u4F59\u6C27\u6C14\uFF1A" + d.oxygen;
  }
  function surface(game) {
    const d = game.diving;
    if (!d)
      return "\u274C \u5F53\u524D\u672A\u5728\u6F5C\u6C34\u4E2D\u3002";
    const r = ["\u{1F4CB} \u8FDC\u5F81\u62A5\u544A \u2014\u2014 " + d.loc, "\u6C27\u6C14\u6D88\u8017\uFF1A" + (d.maxOxygen - d.oxygen) + " / " + d.maxOxygen, "\u6E14\u83B7\uFF1A" + d.loot.length + " \u4EF6"].join("\n");
    game.diving = null;
    return r + "\n\uFF08\u5DF2\u4E0A\u5CB8\uFF09";
  }
  function applyWonder(game, w) {
    const r = w.reward;
    if (r.type === "treasure") {
      game.addItem("item", "treasure", r.value);
      return "\u83B7\u5F97\u5B9D\u7269(" + r.value + "\u70B9)";
    }
    if (r.type === "chest") {
      for (let i = 0; i < r.value; i++)
        game.addChest();
      return "\u83B7\u5F97\u5B9D\u7BB1\xD7" + r.value;
    }
    if (r.type === "relic") {
      game.addItem("item", "relic", r.value);
      return "\u83B7\u5F97\u53E4\u9057\u7269(" + r.value + "\u70B9)";
    }
    if (r.type === "pearl") {
      game.addItem("item", "pearl", r.value);
      return "\u83B7\u5F97\u73CD\u73E0(" + r.value + "\u70B9)";
    }
    if (r.type === "oxygen") {
      game.oxygen += r.value;
      return "\u62FE\u5F97\u6C27\u6C14\u74F6\xD7" + r.value;
    }
    if (r.type === "fish") {
      game.addItem("fish", r.value, 500);
      return "\u6355\u83B7\u5947\u9C7C";
    }
    if (r.type === "legendary") {
      game.addItem("item", "legendary", r.value);
      return "\u4F20\u8BF4\u7EA7\u8D22\u5B9D\uFF01";
    }
    return "\u65E0\u4E8B\u53D1\u751F";
  }

  // src/modules/sell.js
  function doSell(game, args) {
    if (!args.length)
      return "\u274C \u7528\u6CD5\uFF1Asell <uid> | sell all | sell species <id> | sell item <id>";
    if (args[0] === "all") {
      let total = 0, n = 0;
      for (const it2 of game.inventory) {
        total += it2.price;
        n++;
      }
      game.inventory = [];
      game.pts += total;
      return "\u{1F4B0} \u5168\u90E8\u5356\u51FA " + n + " \u4EF6\uFF0C\u83B7\u5F97 " + total + " \u70B9\u3002";
    }
    if (args[0] === "species" && args[1]) {
      let total = 0, n = 0;
      game.inventory = game.inventory.filter((it2) => {
        if (it2.type === "fish" && it2.id === args[1]) {
          total += it2.price;
          n++;
          return false;
        }
        return true;
      });
      game.pts += total;
      return "\u{1F4B0} \u5356\u51FA " + args[1] + " \xD7" + n + "\uFF0C\u83B7\u5F97 " + total + " \u70B9\u3002";
    }
    if (args[0] === "item" && args[1]) {
      let total = 0, n = 0;
      game.inventory = game.inventory.filter((it2) => {
        if (it2.type === "item" && it2.id === args[1]) {
          total += it2.price;
          n++;
          return false;
        }
        return true;
      });
      game.pts += total;
      return "\u{1F4B0} \u5356\u51FA " + args[1] + " \xD7" + n + "\uFF0C\u83B7\u5F97 " + total + " \u70B9\u3002";
    }
    const uid = +args[0];
    const idx = game.inventory.findIndex((it2) => it2.uid === uid);
    if (idx < 0)
      return "\u274C \u672A\u627E\u5230 #" + uid;
    const it = game.inventory.splice(idx, 1)[0];
    game.pts += it.price;
    return "\u{1F4B0} \u5356\u51FA #" + uid + "\uFF08" + it.id + "\uFF09\uFF0C\u83B7\u5F97 " + it.price + " \u70B9\u3002";
  }

  // src/modules/shop.js
  function renderShop() {
    const rows = Object.values(BAITS).map((b) => "  " + b.id.padEnd(12) + " " + b.name + "  " + b.price + "\u70B9  " + b.desc);
    rows.push("  oxygen       \u6C27\u6C14\u74F6    " + OXYGEN.price + "\u70B9  \u6F5C\u6C34\u6D88\u8017\uFF085\u74F68\u6298/10\u74F67\u6298\uFF09");
    return "\u{1F6D2} \u5546\u5E97\n" + rows.join("\n");
  }
  function doBuy(game, args) {
    const [id, nStr] = args;
    const n = Math.max(1, +(nStr || 1));
    if (id === "oxygen") {
      let rate = 1;
      for (const d of OXYGEN_DISCOUNT)
        if (n >= d.min)
          rate = d.rate;
      const cost2 = Math.floor(OXYGEN.price * n * rate);
      if (game.pts < cost2)
        return "\u274C \u70B9\u6570\u4E0D\u8DB3\uFF08\u9700" + cost2 + "\uFF0C\u6709" + game.pts + "\uFF09";
      game.pts -= cost2;
      game.oxygen = (game.oxygen || 0) + n;
      return "\u2705 \u8D2D\u4E70\u6C27\u6C14\u74F6 \xD7" + n + "\uFF0C\u82B1\u8D39 " + cost2 + " \u70B9";
    }
    const bait = BAITS[id];
    if (!bait)
      return "\u274C \u65E0\u6B64\u9C7C\u9975\uFF1A" + id;
    const cost = bait.price * n;
    if (game.pts < cost)
      return "\u274C \u70B9\u6570\u4E0D\u8DB3\uFF08\u9700" + cost + "\uFF0C\u6709" + game.pts + "\uFF09";
    game.pts -= cost;
    game.bait[id] = (game.bait[id] || 0) + n;
    return "\u2705 \u8D2D\u4E70 " + bait.name + " \xD7" + n + "\uFF0C\u82B1\u8D39 " + cost + " \u70B9";
  }

  // src/modules/chest.js
  function doOpen(game, uid) {
    const idx = game.chests.indexOf(+uid);
    if (idx < 0)
      return "\u274C \u672A\u627E\u5230\u5B9D\u7BB1 #" + uid;
    game.chests.splice(idx, 1);
    const r = game.rng();
    if (r < 0.4) {
      const v = 100 + Math.floor(game.rng() * 200);
      game.addItem("item", "treasure", v);
      return "\u{1F4E6} \u5B9D\u7BB1 #" + uid + " \u5F00\u51FA\u5B9D\u7269\uFF08" + v + "\u70B9\uFF09";
    }
    if (r < 0.7) {
      const f = 1 + Math.floor(game.rng() * 2);
      game.fragments[game.loc] = (game.fragments[game.loc] || 0) + f;
      if (game.fragments[game.loc] >= LOCATIONS[game.loc].fragNeed)
        game.diveUnlocked[game.loc] = true;
      return "\u{1F4E6} \u5B9D\u7BB1 #" + uid + " \u5F00\u51FA\u85CF\u5B9D\u56FE\u788E\u7247 \xD7" + f;
    }
    if (r < 0.9) {
      game.oxygen = (game.oxygen || 0) + 2;
      return "\u{1F4E6} \u5B9D\u7BB1 #" + uid + " \u5F00\u51FA\u6C27\u6C14\u74F6 \xD72";
    }
    game.addItem("fish", "golden_carp", 380);
    return "\u{1F4E6} \u5B9D\u7BB1 #" + uid + " \u5F00\u51FA\u7A00\u6709\u9C7C\uFF1A\u91D1\u9CDE\u9CA4\uFF01";
  }

  // src/parser.js
  var Game = class {
    constructor(seed) {
      this.e = new Engine(seed);
    }
    command(input) {
      const lines = input.split(/[;\n]/).map((s) => s.trim()).filter(Boolean).slice(0, 8);
      const out = [];
      for (const line of lines) {
        const [cmd, ...args] = line.split(/\s+/);
        try {
          out.push(this.exec(cmd, args));
        } catch (err) {
          out.push("\u274C [" + cmd + "] \u51FA\u9519\uFF1A" + err.message);
        }
      }
      return out.join("\n") + "\n\n" + this.e.statusBar();
    }
    exec(cmd, args) {
      switch (cmd) {
        case "help":
          return this.help();
        case "status":
          return this.status();
        case "shop":
          return renderShop();
        case "buy":
          return doBuy(this.e, args);
        case "cast":
          return this.cast(args);
        case "dive":
          return this.e.diving ? exploreStep(this.e) : startDive(this.e, +(args[0] || 1));
        case "choose":
          return chooseOption(this.e, +args[0]);
        case "surface":
          return surface(this.e);
        case "goto":
          return this.goto(args);
        case "inventory":
          return this.inventory();
        case "sell":
          return doSell(this.e, args);
        case "open":
          return doOpen(this.e, args[0]);
        case "encyclopedia":
          return this.encyclopedia();
        case "look":
          return this.look(args);
        case "setseed": {
          const s = +args[0];
          this.e = new Engine(s);
          return "\u{1F527} \u5DF2\u91CD\u5F00\uFF0C\u79CD\u5B50=" + s;
        }
        default:
          return "\u274C \u672A\u77E5\u6307\u4EE4\uFF1A" + cmd + "\uFF08help \u67E5\u770B\uFF09";
      }
    }
    help() {
      return "\u6307\u4EE4\uFF1Ahelp/status/shop/buy/cast/dive/choose/surface/goto/inventory/sell/open/encyclopedia/look/setseed";
    }
    status() {
      const e = this.e;
      return "\u{1F4CD}" + LOCATIONS[e.loc].name + " \u{1F343}" + e.season + " \u{1F4B0}" + e.pts + " \u{1F3A3}" + JSON.stringify(e.bait) + " \u{1F9EA}\u6C27" + (e.oxygen || 0) + " \u56FE\u9274" + e.encyclopedia.size + "/" + Object.keys(FISH).length;
    }
    cast(args) {
      let baitId = null, times = 1, stop = [];
      for (const a of args) {
        if (a.startsWith("stop="))
          stop = a.slice(5).split(",");
        else if (/^\d+$/.test(a))
          times = Math.min(20, Math.max(1, +a));
        else if (BAITS[a])
          baitId = a;
      }
      return doCast(this.e, baitId, times, stop);
    }
    goto(args) {
      if (!args.length)
        return Object.values(LOCATIONS).map((l) => "  " + l.id + "  " + l.name + "  " + l.desc).join("\n");
      const loc = LOCATIONS[args[0]];
      if (!loc)
        return "\u274C \u65E0\u6B64\u5730\u70B9\uFF1A" + args[0];
      this.e.loc = loc.id;
      return "\u{1F4CD} \u5DF2\u524D\u5F80 " + loc.name;
    }
    inventory() {
      const e = this.e;
      if (!e.inventory.length && !e.chests.length)
        return "\u{1F392} \u80CC\u5305\u7A7A\u7A7A\u5982\u4E5F\u3002";
      const lines = ["\u{1F392} \u80CC\u5305\uFF1A"];
      for (const it of e.inventory)
        lines.push("  #" + it.uid + " [" + it.type + "] " + it.id + " \u2014\u2014 " + it.price + "\u70B9");
      if (e.chests.length)
        lines.push("\u{1F4E6} \u5F85\u5F00\u5B9D\u7BB1\uFF1A" + e.chests.map((u) => "#" + u).join(", "));
      return lines.join("\n");
    }
    encyclopedia() {
      const e = this.e;
      const total = Object.keys(FISH).length;
      const lines = ["\u{1F4DA} \u56FE\u9274 " + e.encyclopedia.size + "/" + total];
      for (const f of Object.values(FISH)) {
        const got = e.encyclopedia.has(f.id);
        lines.push("  " + (got ? "\u2705 " + f.name : "\u2754 \uFF1F\uFF1F\uFF1F") + " [\u7A00\u6709\u5EA6" + f.rarity + "]");
      }
      return lines.join("\n");
    }
    look(args) {
      const id = args[0];
      if (!id)
        return "\u274C \u7528\u6CD5\uFF1Alook <id>";
      if (FISH[id]) {
        const f = FISH[id];
        const got = this.e.encyclopedia.has(f.id);
        return got ? "\u{1F50D} " + f.name + "\uFF5C\u7A00\u6709\u5EA6" + f.rarity + "\uFF5C\u57FA\u51C6\u4EF7" + f.price + "\uFF5C\u51FA\u6CA1\uFF1A" + f.locs.join(", ") : "\u{1F50D} " + id + "\uFF1A\uFF1F\uFF1F\uFF1F\uFF08\u5C1A\u672A\u9493\u5230\uFF09";
      }
      if (LOCATIONS[id]) {
        const l = LOCATIONS[id];
        return "\u{1F50D} " + l.name + "\uFF5C\u6DF1\u5EA6" + l.depth + "\uFF5C" + l.desc;
      }
      if (BAITS[id]) {
        const b = BAITS[id];
        return "\u{1F50D} " + b.name + "\uFF5C" + b.price + "\u70B9\uFF5C" + b.desc;
      }
      if (SEASONS.includes(id))
        return "\u{1F50D} \u5B63\u8282\uFF1A" + id;
      return "\u274C \u672A\u77E5\u6761\u76EE\uFF1A" + id;
    }
  };

  // src/index.js
  function createGame(seed) {
    const game = new Game(seed);
    return {
      command: (str) => game.command(str),
      save: () => game.e.save(),
      load: (s) => {
        game.e = JSON.parse(s);
      },
      get engine() {
        return game.e;
      }
    };
  }
  var src_default = createGame;
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=game.umd.js.map
