import { useState } from 'react';
import { starterSupplies } from '../data/game';

type Props={completed:boolean;onComplete:()=>void;onBack:()=>void;onQuest:()=>void};
const lessons=[
 {title:'What is a starter?',text:'A sourdough starter is a living culture of flour, water, wild yeast, and helpful bacteria. We feed it and watch how it changes.',icon:'🫙'},
 {title:'What do we need?',text:'A good setup makes learning easier. We need ingredients for the starter and tools that help us measure, mix, observe, and care for it.',icon:'⚖️'},
 {title:'Why these supplies?',text:'Every item has a job. Learning those jobs now will help you make better decisions later when your starter begins changing.',icon:'🌡️'},
] as const;
export default function Schoolhouse({completed,onComplete,onBack,onQuest}:Props){
 const [step,setStep]=useState(completed?3:0);
 const [openItem,setOpenItem]=useState<string|null>(null);
 const lesson=lessons[Math.min(step,2)];
 return <section className="school-place">
  <div className="school-scene">
   <div className="school-room-art simple-classroom">
    <div className="class-window">☀️</div>
    <div className="class-board"><small>STARTER SCHOOL</small><b>LEARN → EARN → SHOP → MAKE</b></div>
    <div className="class-desks"><i/><i/><i/><i/></div>
    <div className="class-bunny">🐇</div>
   </div>
   <button className="school-back" onClick={onBack}>← BUNNYWOOD</button>
   <div className="school-dialogue"><small>BUNNY'S LESSON</small><h1>{completed?'Starter School: Shopping List':lesson.title}</h1><p>{completed?'You passed the first lesson. Your starter shopping list is unlocked. Tap any item to review why we need it.':lesson.text}</p></div>
  </div>
  {!completed&&step<3&&<div className="lesson-path">
   <div className="lesson-progress"><span style={{width:`${((step+1)/3)*100}%`}}/></div>
   <div className="lesson-visual"><div className="lesson-object"><span style={{fontSize:90}}>{lesson.icon}</span></div><div className="lesson-copy"><small>LESSON {step+1} OF 3</small><h2>{lesson.title}</h2><p>{lesson.text}</p><button onClick={()=>setStep(s=>s+1)}>{step===2?'SHOW MY SHOPPING LIST →':'CONTINUE →'}</button></div></div>
  </div>}
  {!completed&&step>=3&&<div className="shopping-lesson"><div className="shopping-title"><small>STARTER SCHOOL · FINAL ACTIVITY</small><h2>Meet Your Starter Shopping List</h2><p>Tap every item and learn its job. When you are ready, unlock the list and begin earning coins.</p></div><div className="school-supply-grid">{starterSupplies.map(s=><button key={s.id} className={openItem===s.id?'open':''} onClick={()=>setOpenItem(openItem===s.id?null:s.id)}><span>{s.emoji}</span><b>{s.name}</b><small>{openItem===s.id?s.teaching:`Costs ${s.cost} coins`}</small></button>)}</div><button className="unlock-list" onClick={onComplete}>🏅 COMPLETE STARTER SCHOOL & UNLOCK SHOPPING LIST</button></div>}
  {completed&&<div className="shopping-lesson"><div className="shopping-title"><small>STARTER APPRENTICE</small><h2>Your Shopping Mission</h2><p>You know what the starter needs. Now earn coins in Quest Meadow and buy the supplies from the Grocery Store and Supply Shop.</p></div><div className="school-supply-grid compact">{starterSupplies.map(s=><button key={s.id} className={openItem===s.id?'open':''} onClick={()=>setOpenItem(openItem===s.id?null:s.id)}><span>{s.emoji}</span><b>{s.name}</b><small>{openItem===s.id?s.teaching:`🪙 ${s.cost}`}</small></button>)}</div><button className="unlock-list" onClick={onQuest}>🗺️ GO TO QUEST MEADOW →</button></div>}
 </section>;
}
