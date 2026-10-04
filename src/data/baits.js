export const BAITS = {
  basic_worm: { id: 'basic_worm', name: '普通蚯蚓', price: 5,  rareBoost: 0, desc: '最基础的鱼饵' },
  shiny_lure: { id: 'shiny_lure', name: '闪亮假饵', price: 30, rareBoost: 1, desc: '稀有度提升' },
  deep_bait:  { id: 'deep_bait',  name: '深海诱饵', price: 80, rareBoost: 2, desc: '高稀有度加成' },
};
export const OXYGEN = { id: 'oxygen', name: '氧气瓶', price: 40, desc: '潜水消耗品' };
export const OXYGEN_DISCOUNT = [ { min: 10, rate: 0.7 }, { min: 5,  rate: 0.8 } ];