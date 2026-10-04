import { pick, pickOne } from '../prng.js';
import { FISH } from '../data/fish.js';
import { WONDERS } from '../data/wonders.js';
import { RUINS } from '../data/ruins.js';
export function startDive(game, n) {
  const loc = game.loc;
  if (!game.diveUnlocked[loc]) return '❌ 该地点尚未解锁潜水。';
  if (!game.oxygen || game.oxygen < n) return '❌ 氧气不足（现有 ' + (game.oxygen||0) + ' 瓶）。';
  game.oxygen -= n;
  game.diving = { loc, oxygen: n, maxOxygen: n, loot: [], pendingRuin: null };
  return '🤿 潜入 ' + loc + '，携带 ' + n + ' 瓶氧气。\n' + exploreStep(game);
}
export function exploreStep(game) {
  const d = game.diving;
  if (!d) return '❌ 当前未在潜水中。';
  if (d.oxygen <= 0) return surface(game);
  const log = [];
  if (game.rng() < 0.15) { const ruin = pickOne(game.rng, RUINS); d.pendingRuin = ruin; return renderRuin(ruin, d); }
  if (game.rng() < 0.2) {
    const w = pick(game.rng, WONDERS); d.oxygen -= 1;
    log.push('🌊 奇遇【' + w.name + '】：' + applyWonder(game, w));
  } else {
    d.oxygen -= 1;
    const pool = Object.values(FISH).filter(f => f.locs.includes(d.loc));
    if (pool.length) {
      const fish = pickOne(game.rng, pool);
      const isNew = !game.encyclopedia.has(fish.id);
      game.encyclopedia.add(fish.id);
      game.addItem('fish', fish.id, fish.price);
      log.push('🐟 水下捕获：' + fish.name + '（' + fish.price + '点）' + (isNew?' 🆕':''));
    }
  }
  log.push('💨 剩余氧气：' + d.oxygen);
  if (d.pendingRuin) return log.join('\n') + '\n' + renderRuin(d.pendingRuin, d);
  if (d.oxygen <= 0) return log.join('\n') + '\n' + surface(game);
  return log.join('\n') + '\n（继续 dive 探索 / surface 上浮）';
}
export function renderRuin(ruin, d) {
  const opts = ruin.options.map((o,i) => '  ['+(i+1)+'] ' + o.label + '（耗氧' + o.cost + '）').join('\n');
  return '🏛️ 大遗迹【' + ruin.name + '】\n' + ruin.desc + '\n' + opts + '\n用 choose <编号> 抉择。';
}
export function chooseOption(game, idx) {
  const d = game.diving;
  if (!d || !d.pendingRuin) return '❌ 当前没有需要抉择的遗迹。';
  const opt = d.pendingRuin.options[idx - 1];
  if (!opt) return '❌ 无效选项。';
  if (d.oxygen < opt.cost) return '❌ 氧气不足（需' + opt.cost + '，剩' + d.oxygen + '）。';
  d.oxygen -= opt.cost; d.pendingRuin = null;
  const o = opt.outcome; let msg = '';
  if (o.type === 'fish') { game.addItem('fish', o.value, 300); msg = '钓上遗迹鱼'; }
  else if (o.type === 'treasure') { game.addItem('item', 'treasure', o.value); msg = o.desc; }
  else if (o.type === 'relic') { game.addItem('item', 'relic', o.value); msg = o.desc; }
  else if (o.type === 'chest') { for (let i=0;i<o.value;i++) game.addChest(); msg = '获得宝箱×' + o.value; }
  else if (o.type === 'buff') { game.buffs[o.value] = (game.buffs[o.value]||0) + 3; msg = o.desc; }
  else msg = o.desc || '无事发生';
  return '✅ ' + opt.label + '：' + msg + '\n💨 剩余氧气：' + d.oxygen;
}
export function surface(game) {
  const d = game.diving;
  if (!d) return '❌ 当前未在潜水中。';
  const r = ['📋 远征报告 —— ' + d.loc, '氧气消耗：' + (d.maxOxygen - d.oxygen) + ' / ' + d.maxOxygen, '渔获：' + d.loot.length + ' 件'].join('\n');
  game.diving = null;
  return r + '\n（已上岸）';
}
function applyWonder(game, w) {
  const r = w.reward;
  if (r.type === 'treasure') { game.addItem('item','treasure',r.value); return '获得宝物(' + r.value + '点)'; }
  if (r.type === 'chest') { for(let i=0;i<r.value;i++) game.addChest(); return '获得宝箱×' + r.value; }
  if (r.type === 'relic') { game.addItem('item','relic',r.value); return '获得古遗物(' + r.value + '点)'; }
  if (r.type === 'pearl') { game.addItem('item','pearl',r.value); return '获得珍珠(' + r.value + '点)'; }
  if (r.type === 'oxygen') { game.oxygen += r.value; return '拾得氧气瓶×' + r.value; }
  if (r.type === 'fish') { game.addItem('fish', r.value, 500); return '捕获奇鱼'; }
  if (r.type === 'legendary') { game.addItem('item','legendary',r.value); return '传说级财宝！'; }
  return '无事发生';
}