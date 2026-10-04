import { Engine } from './engine.js';
import { doCast } from './modules/cast.js';
import { startDive, exploreStep, chooseOption, surface } from './modules/dive.js';
import { doSell } from './modules/sell.js';
import { doBuy, renderShop } from './modules/shop.js';
import { doOpen } from './modules/chest.js';
import { LOCATIONS } from './data/locations.js';
import { FISH } from './data/fish.js';
import { BAITS } from './data/baits.js';
import { SEASONS } from './data/seasons.js';
export class Game {
  constructor(seed) { this.e = new Engine(seed); }
  command(input) {
    const lines = input.split(/[;\n]/).map(s => s.trim()).filter(Boolean).slice(0, 8);
    const out = [];
    for (const line of lines) {
      const [cmd, ...args] = line.split(/\s+/);
      try { out.push(this.exec(cmd, args)); } catch (err) { out.push('❌ [' + cmd + '] 出错：' + err.message); }
    }
    return out.join('\n') + '\n\n' + this.e.statusBar();
  }
  exec(cmd, args) {
    switch (cmd) {
      case 'help': return this.help();
      case 'status': return this.status();
      case 'shop': return renderShop();
      case 'buy': return doBuy(this.e, args);
      case 'cast': return this.cast(args);
      case 'dive': return this.e.diving ? exploreStep(this.e) : startDive(this.e, +(args[0] || 1));
      case 'choose': return chooseOption(this.e, +args[0]);
      case 'surface': return surface(this.e);
      case 'goto': return this.goto(args);
      case 'inventory': return this.inventory();
      case 'sell': return doSell(this.e, args);
      case 'open': return doOpen(this.e, args[0]);
      case 'encyclopedia': return this.encyclopedia();
      case 'look': return this.look(args);
      case 'setseed': { const s = +args[0]; this.e = new Engine(s); return '🔧 已重开，种子=' + s; }
      default: return '❌ 未知指令：' + cmd + '（help 查看）';
    }
  }
  help() { return '指令：help/status/shop/buy/cast/dive/choose/surface/goto/inventory/sell/open/encyclopedia/look/setseed'; }
  status() {
    const e = this.e;
    return '📍' + LOCATIONS[e.loc].name + ' 🍃' + e.season + ' 💰' + e.pts + ' 🎣' + JSON.stringify(e.bait) + ' 🧪氧' + (e.oxygen||0) + ' 图鉴' + e.encyclopedia.size + '/' + Object.keys(FISH).length;
  }
  cast(args) {
    let baitId = null, times = 1, stop = [];
    for (const a of args) {
      if (a.startsWith('stop=')) stop = a.slice(5).split(',');
      else if (/^\d+$/.test(a)) times = Math.min(20, Math.max(1, +a));
      else if (BAITS[a]) baitId = a;
    }
    return doCast(this.e, baitId, times, stop);
  }
  goto(args) {
    if (!args.length) return Object.values(LOCATIONS).map(l => '  ' + l.id + '  ' + l.name + '  ' + l.desc).join('\n');
    const loc = LOCATIONS[args[0]];
    if (!loc) return '❌ 无此地点：' + args[0];
    this.e.loc = loc.id; return '📍 已前往 ' + loc.name;
  }
  inventory() {
    const e = this.e;
    if (!e.inventory.length && !e.chests.length) return '🎒 背包空空如也。';
    const lines = ['🎒 背包：'];
    for (const it of e.inventory) lines.push('  #' + it.uid + ' [' + it.type + '] ' + it.id + ' —— ' + it.price + '点');
    if (e.chests.length) lines.push('📦 待开宝箱：' + e.chests.map(u => '#' + u).join(', '));
    return lines.join('\n');
  }
  encyclopedia() {
    const e = this.e;
    const total = Object.keys(FISH).length;
    const lines = ['📚 图鉴 ' + e.encyclopedia.size + '/' + total];
    for (const f of Object.values(FISH)) {
      const got = e.encyclopedia.has(f.id);
      lines.push('  ' + (got ? '✅ ' + f.name : '❔ ？？？') + ' [稀有度' + f.rarity + ']');
    }
    return lines.join('\n');
  }
  look(args) {
    const id = args[0];
    if (!id) return '❌ 用法：look <id>';
    if (FISH[id]) { const f = FISH[id]; const got = this.e.encyclopedia.has(f.id); return got ? '🔍 ' + f.name + '｜稀有度' + f.rarity + '｜基准价' + f.price + '｜出没：' + f.locs.join(', ') : '🔍 ' + id + '：？？？（尚未钓到）'; }
    if (LOCATIONS[id]) { const l = LOCATIONS[id]; return '🔍 ' + l.name + '｜深度' + l.depth + '｜' + l.desc; }
    if (BAITS[id]) { const b = BAITS[id]; return '🔍 ' + b.name + '｜' + b.price + '点｜' + b.desc; }
    if (SEASONS.includes(id)) return '🔍 季节：' + id;
    return '❌ 未知条目：' + id;
  }
}