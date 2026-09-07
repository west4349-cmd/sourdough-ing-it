import { useMemo, useState } from 'react';
import './RecipeKitchen.css';

type Stage='formula'|'weigh'|'mix'|'folds'|'bulk'|'shape'|'proof'|'score'|'bake'|'cool'|'done';
type Props={completed:boolean;onComplete:()=>void;onBack:()=>void};
const stages:Stage[]=['formula','weigh','mix','folds','bulk','shape','proof','score','bake','cool','done'];
const pick=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];

const formulas=[
 {flour:500,hydration:70,starterPct:20,saltPct:2},
 {flour:450,hydration:72,starterPct:20,saltPct:2},
 {flour:400,hydration:75,starterPct:25,saltPct:2},
];
const bulkCases=[
 {temp:74,time:'4 hr 30 min',rise:45,bubbles:'many along the sides',feel:'lighter and slightly domed',answer:'READY'},
 {temp:69,time:'3 hr',rise:15,bubbles:'a few small bubbles',feel:'dense and flat',answer:'KEEP FERMENTING'},
 {temp:80,time:'5 hr 45 min',rise:90,bubbles:'very gassy and collapsing',feel:'sticky and weakening',answer:'TOO FAR'},
];
const proofCases=[
 {poke:'springs back immediately',answer:'NEEDS MORE TIME'},
 {poke:'returns slowly and leaves a slight dent',answer:'READY TO BAKE'},
 {poke:'stays deeply dented and feels fragile',answer:'OVER-PROOFED'},
];

export default function RecipeKitchen({completed,onComplete,onBack}:Props){
 const[stage,setStage]=useState<Stage>(completed?'done':'formula');
 const[formula]=useState(()=>pick(formulas));
 const[bulk]=useState(()=>pick(bulkCases));
 const[proof]=useState(()=>pick(proofCases));
 const[feedback,setFeedback]=useState('');
 const[mistakes,setMistakes]=useState(0);
 const[folds,setFolds]=useState(0);
 const water=Math.round(formula.flour*formula.hydration/100);
 const starter=Math.round(formula.flour*formula.starterPct/100);
 const salt=Math.round(formula.flour*formula.saltPct/100);
 const total=formula.flour+water+starter+salt;
 const progress=Math.round((Math.max(0,stages.indexOf(stage))/(stages.length-1))*100);
 const grade=useMemo(()=>mistakes===0?'MASTER BAKER':mistakes<=2?'STRONG FIRST LOAF':'BAKER IN TRAINING',[mistakes]);
 function wrong(msg:string){setMistakes(m=>m+1);setFeedback(msg)}
 function advance(next:Stage,msg='Correct.'){setFeedback(msg);window.setTimeout(()=>{setFeedback('');setStage(next)},350)}
 function numberAnswer(value:number,right:number,next:Stage,why:string){if(value===right)advance(next,why);else wrong(`Not quite. Recheck the percentage: ${formula.flour} g flour × the formula percentage.`)}
 return <section className="recipe-kitchen">
  <header className="rk-header"><button onClick={onBack}>← BUNNYWOOD</button><div><small>RECIPE KITCHEN · FIRST LOAF LAB</small><h1>Build the loaf. Read the dough.</h1><p>This is not a “press bake” game. Use math, timing, observation, and judgment.</p></div><div className="rk-score"><b>{progress}%</b><span>{mistakes} mistakes</span></div></header>
  <div className="rk-progress"><i style={{width:`${progress}%`}}/></div>

  {stage==='formula'&&<div className="rk-card"><small>STAGE 1 · BAKER'S MATH</small><h2>Calculate the water</h2><p>Your formula uses <b>{formula.flour} g flour</b> at <b>{formula.hydration}% hydration</b>. How much water belongs in the dough?</p><div className="rk-choices">{[water,water-20,water+25,Math.round(formula.flour*(formula.hydration-10)/100)].sort(()=>Math.random()-.5).map(x=><button key={x} onClick={()=>numberAnswer(x,water,'weigh',`${formula.hydration}% of ${formula.flour} g is ${water} g water.`)}>{x} g</button>)}</div></div>}

  {stage==='weigh'&&<div className="rk-card"><small>STAGE 2 · SCALE CHALLENGE</small><h2>Build the full formula</h2><p>Flour is {formula.flour} g. Starter is {formula.starterPct}% of flour and salt is {formula.saltPct}% of flour. Which tray is correct?</p><div className="rk-trays">
   <button onClick={()=>advance('mix',`Correct formula: ${formula.flour} g flour + ${water} g water + ${starter} g starter + ${salt} g salt = ${total} g total dough.`)}><b>TRAY A</b><span>{formula.flour} g flour</span><span>{water} g water</span><span>{starter} g starter</span><span>{salt} g salt</span></button>
   <button onClick={()=>wrong('Check the starter and salt percentages again.')}><b>TRAY B</b><span>{formula.flour} g flour</span><span>{water+30} g water</span><span>{starter-20} g starter</span><span>{salt+8} g salt</span></button>
   <button onClick={()=>wrong('One ingredient amount is doubled. Look carefully.')}><b>TRAY C</b><span>{formula.flour} g flour</span><span>{water} g water</span><span>{starter*2} g starter</span><span>{salt} g salt</span></button>
  </div></div>}

  {stage==='mix'&&<div className="rk-card"><small>STAGE 3 · MIXING DECISION</small><h2>The dough looks shaggy and dry in spots.</h2><p>You have just combined the ingredients. What should you do first?</p><div className="rk-choices vertical"><button onClick={()=>advance('folds','Yes. Mix until no dry flour remains, then allow the dough time to hydrate before strengthening it.')}>Finish combining all dry flour, then rest the dough</button><button onClick={()=>wrong('Adding extra water immediately changes the formula before you know whether the dough simply needs time to hydrate.')}>Pour in 100 g extra water</button><button onClick={()=>wrong('Fermentation cannot be judged properly while dry flour remains unmixed.')}>Start bulk fermentation immediately</button><button onClick={()=>wrong('Flour does not need to be added just because the dough is sticky at first.')}>Add flour until the dough stops sticking</button></div></div>}

  {stage==='folds'&&<div className="rk-card folds-card"><small>STAGE 4 · STRENGTH BUILDING</small><h2>Complete four fold sets</h2><p>Each set strengthens the dough. Space them out rather than doing all four at once.</p><div className="fold-meter">{[1,2,3,4].map(n=><span key={n} className={folds>=n?'done':''}>{folds>=n?'✓':n}</span>)}</div><button className="rk-main" onClick={()=>{if(folds<3){setFolds(f=>f+1);setFeedback(`Fold set ${folds+1} complete. Rest the dough before the next set.`)}else{setFolds(4);advance('bulk','Four fold sets complete. The dough is smoother and stronger.')}}}>{folds<3?'COMPLETE NEXT FOLD SET':'COMPLETE FINAL FOLD SET'}</button></div>}

  {stage==='bulk'&&<div className="rk-card"><small>STAGE 5 · BULK FERMENTATION</small><h2>Read the dough, not just the clock</h2><div className="evidence-grid"><span><b>Temperature</b>{bulk.temp}°F</span><span><b>Time</b>{bulk.time}</span><span><b>Rise</b>{bulk.rise}%</span><span><b>Bubbles</b>{bulk.bubbles}</span><span><b>Feel</b>{bulk.feel}</span></div><p>What is the best call?</p><div className="rk-choices">{['KEEP FERMENTING','READY','TOO FAR'].map(x=><button key={x} onClick={()=>x===bulk.answer?advance('shape',`Good judgment. The clues together point to: ${bulk.answer}.`):wrong('That choice does not fit all the evidence. Use temperature, rise, bubbles, feel, and time together.')}>{x}</button>)}</div></div>}

  {stage==='shape'&&<div className="rk-card"><small>STAGE 6 · SHAPING</small><h2>The dough is airy. What are you trying to create?</h2><div className="rk-choices vertical"><button onClick={()=>advance('proof','Correct. Shaping organizes the dough and creates enough surface tension to help it hold form.')}>Surface tension without crushing out all the gas</button><button onClick={()=>wrong('A tight, compressed ball can destroy too much of the gas you worked to create.')}>The tightest possible ball, squeezing out every bubble</button><button onClick={()=>wrong('Shaping is not only cosmetic. It affects structure and expansion.')}>Only a prettier outside shape</button></div></div>}

  {stage==='proof'&&<div className="rk-card"><small>STAGE 7 · PROOF TEST</small><h2>You press the dough lightly with one finger.</h2><p>The indentation <b>{proof.poke}</b>.</p><p>What does that suggest?</p><div className="rk-choices">{['NEEDS MORE TIME','READY TO BAKE','OVER-PROOFED'].map(x=><button key={x} onClick={()=>x===proof.answer?advance('score',`Right. A poke that ${proof.poke} suggests: ${proof.answer}.`):wrong('Use the speed and amount of spring-back as your clue.')}>{x}</button>)}</div></div>}

  {stage==='score'&&<div className="rk-card"><small>STAGE 8 · SCORING</small><h2>Why score the loaf?</h2><div className="rk-choices vertical"><button onClick={()=>advance('bake','Exactly. A deliberate score gives expanding dough a planned place to open.')}>To create a controlled weak point for oven expansion</button><button onClick={()=>wrong('Scoring is functional, not just decoration.')}>Only to make a design on the crust</button><button onClick={()=>wrong('Scoring does not stop fermentation.')}>To stop the yeast instantly</button></div></div>}

  {stage==='bake'&&<div className="rk-card"><small>STAGE 9 · OVEN PLAN</small><h2>Choose the better bake strategy</h2><p>The loaf is proofed and scored. Which plan best supports oven spring and crust development?</p><div className="rk-choices vertical"><button onClick={()=>advance('cool','Correct. Early steam or a covered vessel delays crust setting so the loaf can expand, then uncovered heat develops the crust.')}>Bake hot with steam/covered first, then uncover to finish the crust</button><button onClick={()=>wrong('A cool oven reduces oven spring and changes the bake dramatically.')}>Start in a cold oven and slowly warm it for an hour</button><button onClick={()=>wrong('Keeping the loaf covered the entire bake can leave the crust pale and soft.')}>Keep it tightly covered for the entire bake</button></div></div>}

  {stage==='cool'&&<div className="rk-card"><small>STAGE 10 · THE HARDEST PART</small><h2>The loaf smells amazing. Can you cut it now?</h2><p>It just came out of the oven.</p><div className="rk-choices"><button onClick={()=>wrong('The crumb is still setting. Cutting immediately can make it gummy and compress the interior.')}>YES — SLICE IT HOT</button><button onClick={()=>{onComplete();advance('done','Correct. Cooling is part of baking, not dead time.')}}>NO — LET IT COOL</button></div></div>}

  {stage==='done'&&<div className="rk-finish"><div className="loaf-art">🥖</div><div><small>FIRST LOAF COMPLETE</small><h2>{grade}</h2><p>You worked through baker's math, weighing, mixing, strengthening, fermentation, shaping, proofing, scoring, baking, and cooling.</p><p><b>{mistakes}</b> decision mistakes this run.</p><button onClick={onBack}>RETURN TO BUNNYWOOD →</button></div></div>}
  {feedback&&stage!=='done'&&<div className="rk-feedback">{feedback}</div>}
 </section>
}
