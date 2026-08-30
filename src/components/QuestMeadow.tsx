import { useEffect, useMemo, useState } from 'react';
import './QuestMeadow.css';

type Props={coins:number;goalName?:string;goalCost?:number;onEarn:(n:number)=>void;onBack:()=>void;onGoStore:()=>void};
type ItemId='cog'|'rope'|'planks'|'key'|'pin';
type Spot={id:string;x:number;y:number;name:string;item?:ItemId;message:string;requires?:ItemId[];danger?:boolean};

const spots:Spot[]=[
 {id:'mill',x:20,y:24,name:'Old Windmill',item:'cog',message:'Behind the loose gear housing you recover the GATE COG.'},
 {id:'marsh-crate',x:18,y:66,name:'Half-Sunken Crate',item:'rope',message:'Inside the muddy crate is a coil of BRIDGE ROPE.'},
 {id:'woods-stack',x:39,y:76,name:'Fallen Timber',item:'planks',message:'Three straight boards can be salvaged as BRIDGE PLANKS.'},
 {id:'bridge',x:50,y:58,name:'Broken Bridge',message:'You repair the bridge with your rope and planks. The far side is now reachable.',requires:['rope','planks']},
 {id:'crow-tree',x:70,y:38,name:'Crow Tree',item:'key',message:'The crow hid the WAGON KEY in a hollow branch.',requires:['cog']},
 {id:'cave',x:68,y:72,name:'Echo Cave',item:'pin',message:'You search the echoing tunnel and recover the missing WHEEL PIN.',requires:['rope','planks']},
 {id:'berries',x:31,y:43,name:'Berry Patch',message:'Just berries. Bunny loses time checking the wrong place.',danger:true},
 {id:'stump',x:57,y:31,name:'Old Stump',message:'Nothing but beetles under this stump.',danger:true},
 {id:'pond',x:39,y:57,name:'Deep Pond Edge',message:'Too deep. Bunny backs away before getting soaked.',danger:true},
 {id:'wagon',x:88,y:25,name:'Lost Supply Wagon',message:'You unlock and repair the wagon. The expedition is complete!',requires:['cog','rope','planks','key','pin']},
];
const itemNames:Record<ItemId,string>={cog:'Gate Cog',rope:'Bridge Rope',planks:'Bridge Planks',key:'Wagon Key',pin:'Wheel Pin'};

export default function QuestMeadow({coins,goalName,goalCost,onEarn,onBack,onGoStore}:Props){
 const[pos,setPos]=useState({x:10,y:82});
 const[inventory,setInventory]=useState<ItemId[]>([]);
 const[searched,setSearched]=useState<string[]>([]);
 const[hearts,setHearts]=useState(4);
 const[message,setMessage]=useState('Bunny entered Quest Meadow. Explore the field, search suspicious places, and recover everything needed to reach the wagon.');
 const[complete,setComplete]=useState(false);
 const[rewarded,setRewarded]=useState(false);
 const missing=Math.max(0,(goalCost||0)-coins);
 const goalReady=!!goalName&&!!goalCost&&missing===0;
 const near=useMemo(()=>spots.find(s=>Math.hypot(pos.x-s.x,pos.y-s.y)<8),[pos]);
 const bridgeOpen=inventory.includes('rope')&&inventory.includes('planks');
 const gateOpen=inventory.includes('cog');
 const reward=Math.max(6,Math.min(12,missing||8));

 function blocked(nx:number,ny:number){
  if(!bridgeOpen&&nx>52&&ny>48)return 'The river blocks this route. Find what you need to repair the bridge.';
  if(!gateOpen&&nx>60&&ny<48)return 'The old trail gate is locked. The windmill mechanism may hold the answer.';
  return '';
 }
 function move(dx:number,dy:number){
  if(complete)return;
  setPos(p=>{const nx=Math.max(6,Math.min(94,p.x+dx));const ny=Math.max(14,Math.min(86,p.y+dy));const stop=blocked(nx,ny);if(stop){setMessage(stop);return p}return{x:nx,y:ny}})
 }
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(['ArrowLeft','a','A'].includes(e.key))move(-3,0);else if(['ArrowRight','d','D'].includes(e.key))move(3,0);else if(['ArrowUp','w','W'].includes(e.key))move(0,-3);else if(['ArrowDown','s','S'].includes(e.key))move(0,3);else if((e.key==='Enter'||e.key===' ')&&near)search(near)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)});
 function search(s:Spot){
  if(searched.includes(s.id)){setMessage(`You already searched ${s.name}.`);return}
  if(s.requires&&!s.requires.every(x=>inventory.includes(x))){setMessage(`${s.name} is not ready yet. You are missing: ${s.requires.filter(x=>!inventory.includes(x)).map(x=>itemNames[x]).join(', ')}.`);return}
  setSearched(v=>[...v,s.id]);
  if(s.danger){setHearts(h=>Math.max(1,h-1));setMessage(`${s.message} ❤️ -1`);return}
  if(s.item&&!inventory.includes(s.item))setInventory(v=>[...v,s.item!]);
  if(s.id==='bridge'){setMessage(s.message);return}
  if(s.id==='wagon'){setComplete(true);setMessage(s.message);return}
  setMessage(s.message)
 }
 function claim(){if(rewarded)return;onEarn(reward);setRewarded(true)}
 function restart(){setPos({x:10,y:82});setInventory([]);setSearched([]);setHearts(4);setMessage('A new expedition begins. Item locations stay familiar, but the challenge is reaching them in the right order.');setComplete(false);setRewarded(false)}
 return <section className="qm-shell">
  <header className="qm-hud"><button onClick={onBack}>← BUNNYWOOD</button><div><small>QUEST MEADOW · STARTER CAMPAIGN</small><b>THE LOST SUPPLY WAGON</b></div><span>🪙 {coins}</span><span>❤️ {hearts}</span></header>
  <div className="qm-mission"><div><small>CURRENT COIN GOAL</small><h1>{goalReady?`You can afford ${goalName}.`:`Earn ${missing||'more'} coins for ${goalName||'your next starter supply'}.`}</h1><p>Recover the wagon by exploring the meadow. You cannot reach it by taking a shortcut: the river and locked upper trail force you to recover the necessary equipment first.</p></div><div className="qm-progress"><b>{inventory.length}/5</b><span>QUEST ITEMS</span></div></div>
  <div className="qm-layout">
   <div className="qm-world">
    <div className="qm-mountains">▲　▲　▲</div><div className="qm-river"/><div className={`qm-bridge ${bridgeOpen?'open':''}`}>{bridgeOpen?'════':'╳ ╳ ╳'}</div><div className={`qm-gate ${gateOpen?'open':''}`}>{gateOpen?'OPEN GATE':'LOCKED GATE'}</div>
    <div className="qm-path p1"/><div className="qm-path p2"/><div className="qm-path p3"/>
    <button className="qm-object windmill" onClick={()=>setMessage('Move Bunny close to the windmill and search it.')}>⚙<small>WINDMILL</small></button>
    <button className="qm-object marsh" onClick={()=>setMessage('Something is sticking out of the marsh.')}>▤<small>MARSH</small></button>
    <button className="qm-object woods" onClick={()=>setMessage('The woods contain several places worth searching.')}>♣<small>WOODS</small></button>
    <button className="qm-object cave" onClick={()=>setMessage('Echo Cave is across the river.')}>◒<small>CAVE</small></button>
    <button className="qm-object crow" onClick={()=>setMessage('A crow is guarding something in the tree.')}>♠<small>CROW TREE</small></button>
    <button className="qm-object wagon" onClick={()=>setMessage('The wagon is your final destination.')}>▣<small>LOST WAGON</small></button>
    {spots.filter(s=>!['bridge','wagon'].includes(s.id)).map(s=><div key={s.id} className={`qm-hotspot ${searched.includes(s.id)?'searched':''}`} style={{left:`${s.x}%`,top:`${s.y}%`}} aria-hidden="true"/>) }
    <div className="qm-player" style={{left:`${pos.x}%`,top:`${pos.y}%`}}><div className="qe l"><i/></div><div className="qe r"><i/></div><div className="qh"><i/><i/><b/></div><div className="qb">B</div></div>
    <div className="qm-start">BUNNYWOOD TRAIL</div>
   </div>
   <aside className="qm-journal"><small>EXPEDITION JOURNAL</small><h2>Repair the Wagon</h2>{(['cog','rope','planks','key','pin'] as ItemId[]).map(i=><div key={i} className={inventory.includes(i)?'done':''}><span>{inventory.includes(i)?'✓':'□'}</span><b>{itemNames[i]}</b></div>)}<hr/><p><b>Search nearby objects.</b> Not every search helps. Wrong places cost a heart.</p><p>The bridge requires <b>rope + planks</b>. The upper trail requires the <b>gate cog</b>. The wagon needs all five quest items.</p></aside>
  </div>
  <div className="qm-console"><div><small>BUNNY SAYS</small><p>{message}</p>{near&&!complete&&<button onClick={()=>search(near)}>🔎 SEARCH {near.name.toUpperCase()}</button>}</div><div className="qm-controls"><button onClick={()=>move(0,-4)}>▲</button><div><button onClick={()=>move(-4,0)}>◀</button><button onClick={()=>move(0,4)}>▼</button><button onClick={()=>move(4,0)}>▶</button></div><small>ARROWS / WASD</small></div></div>
  {complete&&<div className="qm-win"><span>🏅</span><div><small>EXPEDITION COMPLETE</small><h2>The Lost Supply Wagon is recovered.</h2><p>You earned expedition pay because you solved the route, recovered the required equipment, repaired the crossings, and reached the wagon.</p>{!rewarded?<button onClick={claim}>🪙 CLAIM {reward} COINS</button>:goalReady?<button onClick={onGoStore}>🛒 GO BUY {goalName?.toUpperCase()} →</button>:<button onClick={restart}>🧭 START ANOTHER EXPEDITION</button>}</div></div>}
 </section>
}
