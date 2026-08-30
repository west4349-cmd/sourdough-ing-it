import { useState } from 'react';
import { starterSupplies } from '../data/game';
type Props={completed:boolean;onComplete:()=>void;onBack:()=>void;onQuest:()=>void};
const stations=[
 {title:'Meet the Starter',prompt:'Tap the jar and inspect what makes a starter alive.',icon:'🫙',facts:['Flour provides food','Filtered water hydrates the flour','Wild yeast and helpful bacteria form the culture'],check:'A starter is a living culture we feed and observe.'},
 {title:'Build the Starter Kit',prompt:'Open the cupboard and discover the tools Bunny wants packed.',icon:'🧰',facts:['A gram scale makes measurements repeatable','A clear jar lets us see bubbles and rise','A thermometer helps explain fermentation speed'],check:'Good tools help us measure changes instead of guessing.'},
 {title:'Read the Clues',prompt:'Check Bunny’s observation board before leaving for town.',icon:'🔎',facts:['Rise shows expansion','Bubbles show gas production','Aroma, time, and temperature add context'],check:'Bakers combine several clues before making a decision.'}
];
export default function Schoolhouse({completed,onComplete,onBack,onQuest}:Props){
 const[station,setStation]=useState(0);const[revealed,setRevealed]=useState<number[]>([]);const[openItem,setOpenItem]=useState<string|null>(null);const s=stations[station];
 const reveal=(i:number)=>setRevealed(v=>v.includes(i)?v:[...v,i]);const stationReady=revealed.length===3;
 function next(){if(station<2){setStation(x=>x+1);setRevealed([])}else onComplete()}
 return <section className="school-place redesigned-school">
  <div className="school-world">
   <button className="school-back" onClick={onBack}>← BUNNYWOOD</button>
   <div className="school-title"><small>BUNNYWOOD SCHOOLHOUSE</small><h1>Starter School</h1><p>{completed?'Starter Apprentice · Shopping Mission Unlocked':`Learning Station ${station+1} of 3`}</p></div>
   <div className="classroom-window"><div className="sun">☀</div><div className="hill-one"/><div className="hill-two"/></div>
   <div className="chalkboard"><small>STARTER ADVENTURE</small><b>{completed?'LEARN ✓  →  EARN  →  SHOP  →  MAKE':s.title}</b><p>{completed?'You know what your starter needs. Now gather the supplies.':s.prompt}</p></div>
   <div className="wood-shelf"><span>🌾</span><span>💧</span><span>⚖️</span><span>🌡️</span></div>
   <div className="school-bunny-character"><div className="bunny-ears">◯ ◯</div><div className="bunny-head">• ᴥ •</div><div className="bunny-body">B</div></div>
   {!completed&&<div className="learning-table"><div className="station-object">{s.icon}</div><div className="discovery-buttons">{s.facts.map((f,i)=><button key={f} className={revealed.includes(i)?'discovered':''} onClick={()=>reveal(i)}><span>{revealed.includes(i)?'✓':'?'}</span>{revealed.includes(i)?f:'INSPECT'}</button>)}</div></div>}
   <div className="bunny-speech"><small>BUNNY SAYS</small><h2>{completed?'You’re ready for your first Bunnywood mission!':s.title}</h2><p>{completed?'We need ingredients and equipment before we can make our starter. Quest Meadow is how we earn our first coins.':stationReady?s.check:'Explore all three clues. I’ll explain what you discover, but you do the investigating.'}</p>{!completed&&stationReady&&<button onClick={next}>{station===2?'🏅 COMPLETE STARTER SCHOOL':'NEXT LEARNING STATION →'}</button>}{completed&&<button onClick={onQuest}>🗺️ BEGIN QUEST MEADOW →</button>}</div>
  </div>
  {completed&&<div className="school-mission-board"><div><small>YOUR STARTER KIT</small><h2>Shopping Mission</h2><p>Tap an item to remember why it matters. You’ll buy ingredients at the Grocery Store and equipment at the Supply Shop.</p></div><div className="mission-supplies">{starterSupplies.map(x=><button key={x.id} onClick={()=>setOpenItem(openItem===x.id?null:x.id)} className={openItem===x.id?'open':''}><span>{x.emoji}</span><b>{x.name}</b><small>{openItem===x.id?x.teaching:`🪙 ${x.cost}`}</small></button>)}</div></div>}
 </section>;
}
