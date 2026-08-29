export type ChapterId = 'starter' | 'loaf' | 'home' | 'town' | 'company';
export type ShopId = 'grocery' | 'supply';
export type Supply = { id:string; name:string; emoji:string; cost:number; shop:ShopId; teaching:string; };
export const chapters=[
 {id:'starter' as ChapterId,icon:'🌱',title:'Raise Your Starter',summary:'Learn the setup, earn the coins, buy the supplies, make a starter, feed it, and prove it is mature.'},
 {id:'loaf' as ChapterId,icon:'🥖',title:'Bake Your First Loaf',summary:'Learn the real sourdough bread process from active starter to cooled loaf.'},
 {id:'home' as ChapterId,icon:'🏠',title:'Start a Home Bakery',summary:'Take small orders, learn costs, and reinvest carefully.'},
 {id:'town' as ChapterId,icon:'🏪',title:'Open Bunnywood Bakery',summary:'Move into town and run a growing bakery.'},
 {id:'company' as ChapterId,icon:'🏢',title:'Build the Bakery Company',summary:'Scale production and grow beyond Bunnywood.'},
];
export const starterSupplies:Supply[]=[
 {id:'flour',name:'Brown Rice Flour',emoji:'🌾',cost:8,shop:'grocery',teaching:'Brown rice flour is the food we use to get the new starter established.'},
 {id:'water',name:'Filtered Water',emoji:'💧',cost:6,shop:'grocery',teaching:'Filtered drinking water gives the starter water without relying on strongly chlorinated tap water.'},
 {id:'jar',name:'Clear Glass Jar',emoji:'🫙',cost:10,shop:'supply',teaching:'A clear jar lets us see bubbles, texture, and exactly how high the starter rises.'},
 {id:'scale',name:'Digital Gram Scale',emoji:'⚖️',cost:14,shop:'supply',teaching:'A gram scale lets us feed the starter accurately and repeat the same ratio.'},
 {id:'bowl',name:'Mixing Bowl',emoji:'🥣',cost:7,shop:'supply',teaching:'A mixing bowl gives us room to weigh and combine ingredients cleanly.'},
 {id:'whisk',name:'Danish Dough Whisk',emoji:'🌀',cost:11,shop:'supply',teaching:'A dough whisk moves through thick starter and later bread dough efficiently.'},
 {id:'spatula',name:'Silicone Jar Spatula',emoji:'🥄',cost:8,shop:'supply',teaching:'A flexible spatula scrapes sticky starter from the jar walls so we can keep the jar tidy.'},
 {id:'timer',name:'Timer',emoji:'⏲️',cost:7,shop:'supply',teaching:'A timer helps us track checks and feeding windows while still learning to observe the starter itself.'},
 {id:'thermometer',name:'Digital Thermometer',emoji:'🌡️',cost:12,shop:'supply',teaching:'Temperature changes fermentation speed. A thermometer lets us use evidence instead of guessing.'},
 {id:'marker',name:'Starter Level Marker',emoji:'📏',cost:5,shop:'supply',teaching:'A reusable band or marker shows the starter’s beginning height so we can measure its rise.'},
];
