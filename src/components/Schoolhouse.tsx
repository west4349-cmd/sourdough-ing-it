import { useEffect, useMemo, useState } from 'react';
import { starterSupplies } from '../data/game';

type Props={completed:boolean;onComplete:()=>void;onBack:()=>void;onQuest:()=>void};
type Spot={id:string;x:number;y:number;name:string;fact:string;decoy?:boolean};
const missions=[
 {title:'Meet the Starter',brief:'Find three hidden starter clue cards. Search drawers, shelves, containers, and anything that looks out of place.',spots:[
  {id:'drawer',x:73,y:48,name:'Desk Drawer',fact:'You found the FOOD card. Brown rice flour gives the new starter food.'},
  {id:'rock',x:84,y:76,name:'Loose Rock',fact:'You found the WATER card tucked under the rock. We will use filtered water.'},
  {id:'cabinet',x:42,y:31,name:'Glass Cabinet',fact:'You found the HOME card behind the books. A clear glass jar lets us watch bubbles and rise.'},
  {id:'basket',x:19,y:63,name:'Basket',fact:'Old towels. Nothing useful here.',decoy:true},
  {id:'plant',x:91,y:30,name:'Plant Pot',fact:'Just potting soil. Keep searching.',decoy:true}
 ]},
 {title:'Tools & Measure',brief:'Bunny hid three tool tokens around the room. Find the tools that help a baker measure instead of guess.',spots:[
  {id:'chest',x:23,y:72,name:'Wooden Chest',fact:'GRAM SCALE token! Weight in grams makes feeding repeatable.'},
  {id:'shelf',x:63,y:28,name:'High Shelf',fact:'THERMOMETER token! Temperature helps explain fermentation speed.'},
  {id:'rug',x:57,y:75,name:'Edge of Rug',fact:'LEVEL MARKER token! Marking the starting height lets us measure rise.'},
  {id:'drawer2',x:73,y:48,name:'Desk Drawer',fact:'Pencils and chalk. No tool token.',decoy:true},
  {id:'rock2',x:84,y:76,name:'Loose Rock',fact:'Nothing under the rock this time.',decoy:true}
 ]},
 {title:'Read the Clues',brief:'Now use the classroom like a baker. Find three places that reveal evidence about a starter.',spots:[
  {id:'jar',x:52,y:51,name:'Starter Jar',fact:'BUBBLES: gas pockets are one sign of fermentation.'},
  {id:'mark',x:52,y:59,name:'Jar Rise Mark',fact:'RISE: compare the starter to its starting line to see expansion.'},
  {id:'clock',x:64,y:18,name:'Wall Clock',fact:'TIME + TEMPERATURE: these give context to the bubbles and rise you observe.'},
  {id:'books',x:42,y:31,name:'Books',fact:'Interesting reading, but not one of today’s three evidence clues.',decoy:true},
  {id:'basket2',x:19,y:63,name:'Basket',fact:'No clue here. Try observing the starter and the room conditions.',decoy:true}
 ]}
] as const;

export default function Schoolhouse({completed,onComplete,onBack,onQuest}:Props){
 const[mission,setMission]=useState(0);const[found,setFound]=useState<string[]>([]);const[pos,setPos]=useState({x:15,y:78});const[message,setMessage]=useState('Use the arrow keys or controls to move Bunny. When SEARCH appears, investigate.');const[openItem,setOpenItem]=useState<string|null>(null);const m=missions[mission];
 const near=useMemo(()=>m.spots.find(s=>Math.hypot(pos.x-s.x,pos.y-s.y)<10),[m.spots,pos]);
 const realFound=m.spots.filter(s=>!s.decoy&&found.includes(s.id)).length;const ready=realFound===3;
 function move(dx:number,dy:number){setPos(p=>({x:Math.max(8,Math.min(92,p.x+dx)),y:Math.max(18,Math.min(82,p.y+dy))}))}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(['ArrowLeft','a','A'].includes(e.key))move(-4,0);if(['ArrowRight','d','D'].includes(e.key))move(4,0);if(['ArrowUp','w','W'].includes(e.key))move(0,-4);if(['ArrowDown','s','S'].includes(e.key))move(0,4);if((e.key==='Enter'||e.key===' ')&&near)search()};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)});
 function search(){if(!near){setMessage('Nothing close enough to search. Move Bunny nearer to an object.');return}setMessage(near.fact);if(!near.decoy)setFound(v=>v.includes(near.id)?v:[...v,near.id])}
 function next(){if(!ready)return;if(mission<2){setMission(x=>x+1);setFound([]);setPos({x:15,y:78});setMessage('New challenge! Move around and search for three new clues.')}else onComplete()}
 return <section className="school-game"><header className="school-game-hud"><button onClick={onBack}>← BUNNYWOOD</button><div><small>BUNNYWOOD SCHOOLHOUSE</small><b>STARTER SCHOOL · {completed?'MISSION COMPLETE':`DISCOVERY ${mission+1}/3`}</b></div><span>🔎 {completed?'✓':`${realFound}/3`}</span></header>
  {!completed?<><div className="school-game-world"><div className="room-window"><i/></div><div className="room-board"><small>{m.title.toUpperCase()}</small><b>{m.brief}</b></div><div className="room-shelf"><i/><i/><i/><i/></div><div className="room-cabinet"><span>BOOKS</span></div><div className="room-desk"><div className="desk-drawer">▰</div></div><div className="room-rug"/><div className="room-rock">●</div><div className="room-basket">▥</div><div className="room-plant">♣</div><div className="room-clock">◷</div><div className="room-table"><div className="room-jar"><i/><span>START</span></div><div className="room-bowl">◡</div><div className="room-scale">⚖</div></div>
   <div className="player-bunny" style={{left:`${pos.x}%`,top:`${pos.y}%`}}><div className="pb-ear l"><i/></div><div className="pb-ear r"><i/></div><div className="pb-head"><i className="pb-eye e1"/><i className="pb-eye e2"/><i className="pb-nose"/></div><div className="pb-body"><b>B</b></div></div>
   {found.map(id=>{const s=m.spots.find(x=>x.id===id)!;return <div key={id} className="found-spark" style={{left:`${s.x}%`,top:`${s.y}%`}}>✓</div>})}
   <div className="search-zone"><small>BUNNY SAYS</small><p>{message}</p>{near&&<button onClick={search}>🔎 SEARCH {near.name.toUpperCase()}</button>}{ready&&<button className="next-discovery" onClick={next}>{mission===2?'🏅 COMPLETE STARTER SCHOOL':'NEXT DISCOVERY →'}</button>}</div>
   <div className="move-controls"><button onClick={()=>move(0,-5)}>▲</button><div><button onClick={()=>move(-5,0)}>◀</button><button onClick={()=>move(0,5)}>▼</button><button onClick={()=>move(5,0)}>▶</button></div><small>ARROWS / WASD</small></div>
   <div className="mission-counter"><b>{realFound}/3</b><span>{m.spots.filter(s=>!s.decoy).map(s=><i key={s.id} className={found.includes(s.id)?'done':''}/>)}</span></div>
  </div></>:<div className="school-complete-world"><div className="graduate-bunny">🐇</div><div><small>STARTER APPRENTICE</small><h1>You completed Starter School.</h1><p>Now the knowledge has a purpose: earn coins in Quest Meadow, buy the starter kit, then return to Starter Cottage and make the culture yourself.</p><button onClick={onQuest}>🗺️ BEGIN THE LOST SUPPLY WAGON QUEST →</button></div></div>}
  {completed&&<div className="school-mission-board"><div><small>MISSION INVENTORY</small><h2>Your Starter Kit</h2><p>Tap an item for Bunny’s reminder while you earn and shop.</p></div><div className="mission-supplies">{starterSupplies.map(x=><button key={x.id} onClick={()=>setOpenItem(openItem===x.id?null:x.id)} className={openItem===x.id?'open':''}><span>{x.emoji}</span><b>{x.name}</b><small>{openItem===x.id?x.teaching:`🪙 ${x.cost} · ${x.shop==='grocery'?'GROCERY':'SUPPLY SHOP'}`}</small></button>)}</div></div>}
 </section>;
}
