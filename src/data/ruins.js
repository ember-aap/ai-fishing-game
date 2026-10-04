export const RUINS = [
  { id:'sealed_door', name:'封印之门', desc:'一扇刻满符文的石门挡在面前。', options:[
    { label:'推开石门', cost:3, outcome:{type:'fish', value:'ruin_guardian', desc:'门后冲出一条守卫鱼！'} },
    { label:'绕道而行', cost:1, outcome:{type:'treasure', value:100, desc:'捡到些许遗物。'} },
    { label:'仔细研究符文', cost:2, outcome:{type:'relic', value:400, desc:'获得古遗物。'} },
  ]},
  { id:'altar', name:'献祭祭坛', desc:'古老的祭坛上残留着新鲜的血迹。', options:[
    { label:'献上渔获', cost:2, outcome:{type:'buff', value:'riverGod', desc:'河神祝福你。'} },
    { label:'砸毁祭坛', cost:4, outcome:{type:'chest', value:1, desc:'露出隐藏宝箱。'} },
    { label:'无视离开', cost:0, outcome:{type:'nothing', desc:'你选择安全离开。'} },
  ]},
  { id:'sunken_ship', name:'沉船核心', desc:'船舱深处一只锈迹斑斑的保险箱紧锁着。', options:[
    { label:'撬开保险箱', cost:3, outcome:{type:'treasure', value:500, desc:'箱内是船长的私藏！'} },
    { label:'搜刮船舱', cost:1, outcome:{type:'fish', value:'ship_rat_fish', desc:'惊动了怪鱼。'} },
    { label:'带走整艘船', cost:5, outcome:{type:'relic', value:1500, desc:'打捞起整艘沉船。'} },
  ]},
];