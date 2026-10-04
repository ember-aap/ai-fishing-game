export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function pick(rng, items, weightKey = 'w') {
  const total = items.reduce((s, it) => s + (it[weightKey] || 0), 0);
  let r = rng() * total;
  for (const it of items) { if ((r -= it[weightKey] || 0) <= 0) return it; }
  return items[items.length - 1];
}
export function pickOne(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }