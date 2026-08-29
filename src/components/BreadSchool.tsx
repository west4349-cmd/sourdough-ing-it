import { useState } from 'react';

type Props={completed:boolean;onComplete:()=>void;onBack:()=>void;onKitchen:()=>void};
const lessons=[
 {title:'Start with an active starter',text:'Bread begins when the starter is active enough to lift dough. We look for repeated rise, bubbles, and a predictable pattern.',art:'jar'},
 {title:'Weigh everything',text:'Bread formulas use grams so we can repeat results. Flour, water, starter, and salt are measured by weight.',art:'scale'},
 {title:'Build dough strength',text:'Mixing and folds organize gluten so the dough can trap gas instead of spreading flat.',art:'fold'},
 {title:'Bulk fermentation',text:'During bulk fermentation, the dough changes because microbes produce gas and acids. We judge the dough by clues, not only by a timer.',art:'bulk'},
 {title:'Shape and proof',text:'Shaping creates surface tension. Proofing gives the shaped loaf time to become ready for the oven.',art:'shape'},
 {title:'Score, bake, cool',text:'Scoring gives expanding dough a planned weak point. Baking sets the structure. Cooling finishes the crumb before slicing.',art:'bake'},
] as const;
const checks=[
 {q:'Why weigh ingredients in grams?',a:'To repeat the same formula accurately',wrong:'Because cups cannot hold flour'},
 {q:'What should decide when bulk fermentation is done?',a:'The dough’s rise, feel, bubbles, temperature, and time together',wrong:'Only the clock'},
 {q:'Why shape the loaf?',a:'To create structure and surface tension',wrong:'Only to make it look round'},
 {q:'Why cool bread before slicing?',a:'The crumb is still setting after baking',wrong:'The crust will disappear if sliced hot'},
] as const;
export default function BreadSchool({completed,onComplete,onBack,onKitchen}:Props){
 const[step,setStep]=useState(completed?lessons.length:0);const[quiz,setQuiz]=useState(0);const[feedback,setFeedback]=useState('');
 const lesson=lessons[Math.min(step,lessons.length-1)];
 function answer(x:string){const right=checks[quiz].a;if(x!==right){setFeedback('Not quite. Use the lesson clues and try again.');return}setFeedback('Correct.');if(quiz<checks.length-1){setTimeout(()=>{setQuiz(q=>q+1);setFeedback('')},300)}else{onComplete()}}
 return <section className="bread-school">
  <div className="bread-classroom"><button className="school-back" onClick={onBack}>← BUNNYWOOD</button><div className="bread-board"><small>FIRST LOAF SCHOOL</small><h1>FROM ACTIVE STARTER TO BAKED LOAF</h1><div className="bread-process">{['Starter','Weigh','Mix','Folds','Bulk','Shape','Proof','Score','Bake','Cool'].map((x,i)=><span key={x}>{i+1}<b>{x}</b></span>)}</div></div><div className="bread-bunny">🐇</div></div>
  {!completed&&step<lessons.length&&<div className="bread-lesson"><div className={`bread-art ${lesson.art}`}><span>{lesson.art==='jar'?'🫙':lesson.art==='scale'?'⚖️':lesson.art==='fold'?'🤲':lesson.art==='bulk'?'🥣':lesson.art==='shape'?'🥖':'🔥'}</span></div><div><small>LESSON {step+1} OF {lessons.length}</small><h2>{lesson.title}</h2><p>{lesson.text}</p><button onClick={()=>setStep(s=>s+1)}>{step===lessons.length-1?'TAKE THE BAKER CHECK →':'CONTINUE →'}</button></div></div>}
  {!completed&&step>=lessons.length&&<div className="bread-check"><small>BAKER CHECK {quiz+1}/{checks.length}</small><h2>{checks[quiz].q}</h2><div><button onClick={()=>answer(checks[quiz].a)}>{checks[quiz].a}</button><button onClick={()=>answer(checks[quiz].wrong)}>{checks[quiz].wrong}</button></div>{feedback&&<p>{feedback}</p>}</div>}
  {completed&&<div className="bread-graduate"><span>🏅</span><div><small>FIRST LOAF SCHOOL COMPLETE</small><h2>You’re ready for the Recipe Kitchen.</h2><p>Bunny will now guide you through an actual first-loaf build. The game will ask you to use the process you just learned instead of simply pressing “bake.”</p><button onClick={onKitchen}>🍞 GO TO RECIPE KITCHEN →</button></div></div>}
 </section>
}
