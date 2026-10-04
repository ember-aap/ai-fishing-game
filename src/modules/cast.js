import { pick, pickOne } from '../prng.js';
import { FISH, JUNK } from '../data/fish.js';
import { BAITS } from '../data/baits.js';
import { LOCATIONS } from '../data/locations.js';
import { EVENTS, BOTTLES } from '../data/events.js';
import { BUFF_TYPES, rollBuff } from './buffs.js';
const JUNKS = Object.values(JUNK);
export function doCast(game, baitId, times, stopFlags) {
  const log = []; let stopped = false;
  for (let i = 0; i < times && !stopped; i++) {
    const bid = baitId || game.cheapestBait();
    if (!bid || !game.bait[bid]) { log.push('❌ 没有可用鱼饵，请先 buy。'); break; }
    if (game.buffs.riverGod > 0) game.buffs.riverGod--;
    else { game.bait[bid]--; if (game.bait[bid] <= 0) delete game.bait[bid]; }
    game.turn++;
    const beforeSeason = game.seasonIdx;
    game.seasonIdx = (game.seasonIdx + 1) % 4;
    const loc = LOCATIONS[game.loc];
    if (loc.darkCurrent && game.rng() < loc.darkCurrent) {
      const b2 = game.cheapestBait();
      if (b2) { game.bait[b2] = Math.max(0, (game.bait[b2]||0) - 1); if (!game.bait[b2]) delete game.bait[b2]; }
      log.push('🌊 第'+(i+1)+'竿：水下暗流！');
    }
    if (game.rng() < 0.1) {
      const ev = pick(game.rng, EVENTS);
      log.push('🎁 第'+(i+1)+'竿：' + handleEvent(game, ev));
      if (stopFlags.includes('event')) { stopped = true; continue; }
      continue;
    }
    const buff = rollBuff(game.rng);
    if (buff) {
      game.buffs[buff] = (game.buffs[buff] || 0) + BUFF_TYPES[buff].duration;
      log.push('🌟 幸运时刻：' + BUFF_TYPES[buff].name + '！');
    }
    const results = rollCatch(game, loc, bid);
    for (const r of results) {
      if (r.tier === 'junk' || (r.rarity === 1 && !r.isNew)) log.push('· 第'+(i+1)+'竿：' + r.name + '（' + r.price + '点）');
      else log.push('✨ 第'+(i+1)+'竿：' + r.name + ' [稀有度' + r.rarity + ']（' + r.price + '点）');
      if (r.isNew) log.push('🆕 新种入库：' + r.name);
      if (stopFlags.includes('new') && r.isNew) stopped = true;
      if (stopFlags.includes('rare') && r.rarity >= 3) stopped = true;
    }
    if (beforeSeason !== game.seasonIdx) log.push('🍃 季节推进 → ' + game.season);
  }
  return log.join('\n');
}
function handleEvent(game, ev) {
  if (ev.type === 'bottle') {
    const b = pick(game.rng, BOTTLES);
    if (b.effect === 'pts') { game.pts += b.value; return '漂流瓶开出 ' + b.value + ' 点数'; }
    if (b.effect === 'fragment') { addFragment(game); return '漂流瓶开出藏宝图碎片'; }
    if (b.effect === 'oxygen') { game.oxygen = (game.oxygen||0)+b.value; return '漂流瓶开出氧气瓶×' + b.value; }
    if (b.effect === 'fullmap') { game.diveUnlocked[game.loc] = true; return '漂流瓶开出完整藏宝图，解锁潜水！'; }
  }
  if (ev.type === 'chest') { const uid = game.addChest(); return '捞到宝箱 #' + uid; }
  if (ev.type === 'treasure') { const v = 50 + Math.floor(game.rng()*200); game.addItem('item', 'treasure', v); return '捞到宝物（' + v + '点）'; }
  if (ev.type === 'fragment') { addFragment(game); return '捞到藏宝图碎片'; }
  return '空钩，什么都没捞到';
}
function addFragment(game) {
  game.fragments[game.loc] = (game.fragments[game.loc] || 0) + 1;
  if (game.fragments[game.loc] >= LOCATIONS[game.loc].fragNeed) game.diveUnlocked[game.loc] = true;
}
function rollCatch(game, loc, baitId) {
  const boost = BAITS[baitId] ? BAITS[baitId].rareBoost : 0;
  const out = [];
  const count = game.buffs.splitHook > 0 ? 3 : 1;
  if (game.buffs.splitHook > 0) game.buffs.splitHook--;
  for (let k = 0; k < count; k++) {
    if (game.rng() < loc.junkRate) {
      const junk = pickOne(game.rng, JUNKS);
      game.addItem('item', junk.id, junk.price);
      out.push({ tier:'junk', rarity:0, name:junk.name, price:junk.price, isNew:false });
      continue;
    }
    const weights = Object.entries(loc.rarityW).map(e => ({ r:+e[0], w: e[1] + (e[0]>=3 ? boost*5 : 0) }));
    const rar = pick(game.rng, weights).r;
    let pool = Object.values(FISH).filter(f => f.locs.includes(loc.id) && f.rarity === rar);
    if (loc.legendChance && game.rng() < loc.legendChance) pool = Object.values(FISH).filter(f => f.locs.includes(loc.id) && f.rarity === 5);
    if (!pool.length) pool = Object.values(FISH).filter(f => f.locs.includes(loc.id));
    if (!pool.length) continue;
    const fish = pickOne(game.rng, pool);
    const isNew = !game.encyclopedia.has(fish.id);
    game.encyclopedia.add(fish.id);
    let price = fish.price;
    if (game.buffs.goldTouch > 0) { price *= 3; game.buffs.goldTouch--; }
    if (game.buffs.hotStreak > 0) { price *= 2; game.buffs.hotStreak--; }
    game.addItem('fish', fish.id, price);
    out.push({ tier:'fish', rarity:fish.rarity, name:fish.name, price:price, isNew:isNew });
  }
  return out;
}