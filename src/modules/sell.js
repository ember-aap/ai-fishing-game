export function doSell(game, args) {
  if (!args.length) return '❌ 用法：sell <uid> | sell all | sell species <id> | sell item <id>';
  if (args[0] === 'all') {
    let total = 0, n = 0;
    for (const it of game.inventory) { total += it.price; n++; }
    game.inventory = []; game.pts += total;
    return '💰 全部卖出 ' + n + ' 件，获得 ' + total + ' 点。';
  }
  if (args[0] === 'species' && args[1]) {
    let total = 0, n = 0;
    game.inventory = game.inventory.filter(it => {
      if (it.type === 'fish' && it.id === args[1]) { total += it.price; n++; return false; }
      return true;
    });
    game.pts += total;
    return '💰 卖出 ' + args[1] + ' ×' + n + '，获得 ' + total + ' 点。';
  }
  if (args[0] === 'item' && args[1]) {
    let total = 0, n = 0;
    game.inventory = game.inventory.filter(it => {
      if (it.type === 'item' && it.id === args[1]) { total += it.price; n++; return false; }
      return true;
    });
    game.pts += total;
    return '💰 卖出 ' + args[1] + ' ×' + n + '，获得 ' + total + ' 点。';
  }
  const uid = +args[0];
  const idx = game.inventory.findIndex(it => it.uid === uid);
  if (idx < 0) return '❌ 未找到 #' + uid;
  const it = game.inventory.splice(idx, 1)[0];
  game.pts += it.price;
  return '💰 卖出 #' + uid + '（' + it.id + '），获得 ' + it.price + ' 点。';
}