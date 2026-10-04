import { BAITS, OXYGEN, OXYGEN_DISCOUNT } from '../data/baits.js';
export function renderShop() {
  const rows = Object.values(BAITS).map(b => '  ' + b.id.padEnd(12) + ' ' + b.name + '  ' + b.price + '点  ' + b.desc);
  rows.push('  oxygen       氧气瓶    ' + OXYGEN.price + '点  潜水消耗（5瓶8折/10瓶7折）');
  return '🛒 商店\n' + rows.join('\n');
}
export function doBuy(game, args) {
  const [id, nStr] = args;
  const n = Math.max(1, +(nStr || 1));
  if (id === 'oxygen') {
    let rate = 1;
    for (const d of OXYGEN_DISCOUNT) if (n >= d.min) rate = d.rate;
    const cost = Math.floor(OXYGEN.price * n * rate);
    if (game.pts < cost) return '❌ 点数不足（需' + cost + '，有' + game.pts + '）';
    game.pts -= cost; game.oxygen = (game.oxygen || 0) + n;
    return '✅ 购买氧气瓶 ×' + n + '，花费 ' + cost + ' 点';
  }
  const bait = BAITS[id];
  if (!bait) return '❌ 无此鱼饵：' + id;
  const cost = bait.price * n;
  if (game.pts < cost) return '❌ 点数不足（需' + cost + '，有' + game.pts + '）';
  game.pts -= cost; game.bait[id] = (game.bait[id] || 0) + n;
  return '✅ 购买 ' + bait.name + ' ×' + n + '，花费 ' + cost + ' 点';
}