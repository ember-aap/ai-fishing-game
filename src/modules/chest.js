import { LOCATIONS } from '../data/locations.js';
export function doOpen(game, uid) {
  const idx = game.chests.indexOf(+uid);
  if (idx < 0) return '❌ 未找到宝箱 #' + uid;
  game.chests.splice(idx, 1);
  const r = game.rng();
  if (r < 0.4) { const v = 100 + Math.floor(game.rng() * 200); game.addItem('item', 'treasure', v); return '📦 宝箱 #' + uid + ' 开出宝物（' + v + '点）'; }
  if (r < 0.7) { const f = 1 + Math.floor(game.rng()*2); game.fragments[game.loc] = (game.fragments[game.loc]||0) + f; if (game.fragments[game.loc] >= LOCATIONS[game.loc].fragNeed) game.diveUnlocked[game.loc] = true; return '📦 宝箱 #' + uid + ' 开出藏宝图碎片 ×' + f; }
  if (r < 0.9) { game.oxygen = (game.oxygen||0) + 2; return '📦 宝箱 #' + uid + ' 开出氧气瓶 ×2'; }
  game.addItem('fish', 'golden_carp', 380);
  return '📦 宝箱 #' + uid + ' 开出稀有鱼：金鳞鲤！';
}