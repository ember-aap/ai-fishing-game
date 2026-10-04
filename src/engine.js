import { mulberry32 } from './prng.js';
import { BAITS } from './data/baits.js';
import { FISH } from './data/fish.js';
import { SEASONS } from './data/seasons.js';
let UID = 1;
export class Engine {
  constructor(seed = Date.now() >>> 0) {
    this.seed = seed >>> 0; this.rng = mulberry32(this.seed);
    this.pts = 200; this.loc = 'moon_pond'; this.seasonIdx = 0; this.turn = 0;
    this.bait = { basic_worm: 5 }; this.oxygen = 0;
    this.inventory = []; this.encyclopedia = new Set();
    this.chests = []; this.buffs = {}; this.fragments = {}; this.diveUnlocked = {};
    this.diving = null;
  }
  get season() { return SEASONS[this.seasonIdx]; }
  addItem(type, id, price) { const it = { uid: UID++, type, id, price }; this.inventory.push(it); return it; }
  addChest() { const uid = UID++; this.chests.push(uid); return uid; }
  cheapestBait() {
    const owned = Object.keys(this.bait).filter(k => this.bait[k] > 0);
    if (!owned.length) return null;
    return owned.sort((a,b) => BAITS[a].price - BAITS[b].price)[0];
  }
  statusBar() {
    return JSON.stringify({
      pts: this.pts, loc: this.loc, sea: this.season, turn: this.turn,
      enc: this.encyclopedia.size + '/' + Object.keys(FISH).length,
      bait: this.bait, hold: this.inventory.filter(i => i.type === 'fish').length,
      chest: this.chests.length, oxy: this.oxygen || 0,
    });
  }
  save() { return JSON.stringify({ seed: this.seed, pts: this.pts, loc: this.loc, seasonIdx: this.seasonIdx, turn: this.turn, bait: this.bait, oxygen: this.oxygen, inventory: this.inventory, encyclopedia: [...this.encyclopedia], chests: this.chests, buffs: this.buffs, fragments: this.fragments, diveUnlocked: this.diveUnlocked }); }
}