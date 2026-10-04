export const BUFF_TYPES = {
  splitHook: { id:'splitHook', name:'分裂鱼钩',     desc:'一竿钓上3条鱼',   duration:1 },
  goldTouch: { id:'goldTouch', name:'点石成金',     desc:'本次鱼价值×3',    duration:1 },
  hotStreak: { id:'hotStreak', name:'渔获热潮',     desc:'接下来3条鱼翻倍', duration:3 },
  riverGod:  { id:'riverGod',  name:'河神的祝福',   desc:'接下来3竿不耗饵', duration:3 },
  greatTide: { id:'greatTide', name:'千载难逢的涨潮',desc:'必钓破纪录大鱼',  duration:1 },
  pearl:     { id:'pearl',     name:'蚌中生珠',     desc:'额外获得财宝',    duration:1 },
};
export const BUFF_CHANCE = 0.08;
export function rollBuff(rng) {
  const r = rng();
  if (r > BUFF_CHANCE) return null;
  const keys = Object.keys(BUFF_TYPES);
  return keys[Math.floor(rng() * keys.length)];
}