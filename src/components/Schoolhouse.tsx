import { useMemo, useState } from 'react';
import { starterSupplies } from '../data/game';

type Props={completed:boolean;onComplete:()=>void;onBack:()=>void;onQuest:()=>void};

type Lesson={
 id:string;
 title:string;
 subtitle:string;
 icon:string;
 pages:{heading:string;body:string;points:string[]}[];
 check:{question:string;choices:string[];answer:number;explain:string};
};

const lessons:Lesson[]=[
 {
  id:'starter-basics',title:'What Is a Starter?',subtitle:'Meet the living culture',icon:'🫙',
  pages:[
   {heading:'A living culture',body:'A sourdough starter is flour and water that supports wild yeast and helpful bacteria. Those microorganisms ferment the mixture and eventually help bread rise.',points:['It is alive and changes over time.','It needs regular food and water.','Bubbles, rise, aroma, time, and temperature give us clues about how it is doing.']},
   {heading:'Why we begin with brown rice flour',body:'For this Bunnywood method, the new starter begins with brown rice flour. Once the starter is established, a player who wants to remain gluten-free can continue with rice flour. In our main path, we later transition to organic all-purpose flour.',points:['Brown rice flour starts our culture.','Filtered water is used for hydration.','Later flour choices depend on the baker’s goal.']}
  ],
  check:{question:'Which statement best describes a sourdough starter?',choices:['A living culture we feed and observe','A packet of commercial yeast','Bread dough that is already baked'],answer:0,explain:'Correct. A starter is a living culture that changes as yeast and bacteria ferment flour and water.'}
 },
 {
  id:'shopping',title:'Starter Shopping List',subtitle:'Know what you need before earning coins',icon:'🧺',
  pages:[
   {heading:'Ingredients',body:'Before the player goes to Quest Meadow to earn coins, Bunny teaches exactly what the starter project requires.',points:['Brown rice flour — the starter’s food.','Filtered water — hydrates the flour.']},
   {heading:'Equipment',body:'The tools are not decorations. Each one helps the player measure, mix, observe, and care for the culture.',points:['Clear glass jar — see bubbles and rise.','Digital gram scale — measure accurately.','Mixing bowl — weigh and combine ingredients.','Danish dough whisk — mix thick starter and later dough.','Silicone spatula — scrape the jar clean.','Digital thermometer — understand temperature.','Timer — track observation and feeding windows.','Starter level marker — compare rise to the starting level.']}
  ],
  check:{question:'Why do we use a clear jar?',choices:['So we can see bubbles and rise','Because dark jars make starter sweeter','Only because clear jars cost fewer coins'],answer:0,explain:'Exactly. A clear jar makes the starter easier to observe.'}
 },
 {
  id:'measure',title:'Measure, Don’t Guess',subtitle:'Learn the tools',icon:'⚖️',
  pages:[
   {heading:'Use grams',body:'Sourdough becomes easier to understand when measurements are repeatable. A digital scale lets the player measure flour and water by weight instead of guessing by volume.',points:['Place the container on the scale.','Tare the scale back to zero.','Add the ingredient until the target gram weight is reached.']},
   {heading:'Temperature matters',body:'Fermentation usually moves faster when warmer and slower when cooler. Temperature does not replace observation; it helps explain what the player sees.',points:['Record room or starter temperature.','Compare temperature with time, bubbles, and rise.','Do not judge the starter from a single clue.']}
  ],
  check:{question:'What does “tare” mean on the scale?',choices:['Reset the displayed weight to zero','Heat the flour','Measure the jar temperature'],answer:0,explain:'Right. Taring lets us ignore the container weight and measure only the ingredient.'}
 },
 {
  id:'make',title:'How We Make the Starter',subtitle:'Learn the sequence before going to the cottage',icon:'🥣',
  pages:[
   {heading:'The first mixture',body:'At Starter Cottage, Bunny will guide the player through the real hands-on sequence. Schoolhouse teaches the order first so the player understands what they are doing.',points:['Set up a clean work area.','Weigh the brown rice flour.','Weigh the filtered water.','Mix until no dry flour remains.','Transfer to the clear jar and clean the sides.','Mark the starting level.']},
   {heading:'Then we observe',body:'After mixing, the job changes from making to observing. The starter needs time to begin fermenting.',points:['Watch for bubbles.','Watch for changes in rise.','Notice aroma changes.','Track time and temperature.','Do not panic over one quiet period.']}
  ],
  check:{question:'After the starter is mixed and marked, what should the player do next?',choices:['Observe it over time','Keep adding flour every few minutes','Bake it immediately'],answer:0,explain:'Correct. Once the mixture is set up, observation becomes the next job.'}
 },
 {
  id:'care',title:'How to Read a Starter',subtitle:'Learn the signs of activity',icon:'🔎',
  pages:[
   {heading:'Look at several clues together',body:'A good baker does not make a decision from a single bubble or a single hour on the clock.',points:['Rise — how much has the starter expanded?','Bubbles — where are they and how many are there?','Aroma — how is it changing?','Time — how long since the last feeding?','Temperature — could conditions explain faster or slower activity?']},
   {heading:'Young starters change pace',body:'A new starter may become active, become quieter, and then strengthen again. The player learns to care for the trend instead of assuming one quiet day means failure.',points:['One burst of activity does not prove maturity.','One quiet period does not prove the starter is dead.','Repeated, predictable strength is the goal.']}
  ],
  check:{question:'What is the best way to judge a starter?',choices:['Compare several clues over time','Look only at the clock','Look for exactly one bubble'],answer:0,explain:'Yes. Rise, bubbles, aroma, time, and temperature work together.'}
 }
];

export default function Schoolhouse({completed,onComplete,onBack,onQuest}:Props){
 const[lessonIndex,setLessonIndex]=useState(0);
 const[page,setPage]=useState(0);
 const[passed,setPassed]=useState<string[]>(completed?lessons.map(l=>l.id):[]);
 const[selected,setSelected]=useState<number|null>(null);
 const[feedback,setFeedback]=useState('');
 const[openItem,setOpenItem]=useState<string|null>(null);
 const lesson=lessons[lessonIndex];
 const allPassed=passed.length===lessons.length;
 const progress=useMemo(()=>Math.round((passed.length/lessons.length)*100),[passed.length]);
 function choose(i:number){setSelected(i);if(i===lesson.check.answer){setFeedback(lesson.check.explain);setPassed(v=>v.includes(lesson.id)?v:[...v,lesson.id])}else setFeedback('Not quite. Review the lesson and try again.')}
 function changeLesson(i:number){setLessonIndex(i);setPage(0);setSelected(null);setFeedback('')}
 function finishCourse(){if(!allPassed)return;onComplete()}
 return <section className="redesigned-school">
  <div className="school-world">
   <button className="school-back" onClick={onBack}>← BUNNYWOOD</button>
   <div className="school-title"><small>BUNNYWOOD SCHOOLHOUSE</small><h1>Sourdough School</h1><p>{completed?'STARTER COURSE COMPLETE':`STARTER COURSE · ${progress}%`}</p></div>
   <div className="classroom-window"><span className="sun">☀</span><i className="hill-one"/><i className="hill-two"/></div>
   <div className="chalkboard"><small>{lesson.subtitle.toUpperCase()}</small><b>{lesson.title}</b><p>The Schoolhouse is where Bunny teaches the facts, methods, vocabulary, and reasons behind each step before the player uses them elsewhere in Bunnywood.</p></div>
   <div className="wood-shelf"><span>🌾</span><span>💧</span><span>⚖️</span><span>🌡️</span></div>
   <div className="school-bunny-character"><div className="ear left"><i/></div><div className="ear right"><i/></div><div className="bunny-head"><span className="eye e1"/><span className="eye e2"/><span className="nose"/><span className="mouth"/></div><div className="bunny-body"><span className="overall-pocket">B</span></div></div>
   <div className="learning-table" style={{gridTemplateColumns:'1fr',overflow:'auto'}}>
    <div style={{background:'#fff2cd',border:'5px solid #704a31',borderRadius:16,padding:14,minHeight:235}}>
     <small>PAGE {page+1} OF {lesson.pages.length}</small>
     <h2 style={{margin:'5px 0 8px'}}>{lesson.pages[page].heading}</h2>
     <p style={{fontSize:13,lineHeight:1.4}}>{lesson.pages[page].body}</p>
     <ul style={{fontSize:12,lineHeight:1.45,paddingLeft:20}}>{lesson.pages[page].points.map(x=><li key={x}>{x}</li>)}</ul>
     <div style={{display:'flex',gap:8}}>{page>0&&<button onClick={()=>setPage(p=>p-1)}>← BACK</button>}{page<lesson.pages.length-1&&<button onClick={()=>setPage(p=>p+1)}>NEXT PAGE →</button>}</div>
    </div>
   </div>
   <div className="bunny-speech"><small>BUNNY TEACHES</small><h2>{passed.includes(lesson.id)?'Lesson Passed ✓':'Knowledge Check'}</h2><p>{lesson.check.question}</p>{lesson.check.choices.map((x,i)=><button key={x} style={{marginBottom:6,background:selected===i?(i===lesson.check.answer?'#397846':'#9b4d3c'):'#6d4c32'}} onClick={()=>choose(i)}>{x}</button>)}{feedback&&<p><b>{feedback}</b></p>}</div>
  </div>
  <div className="school-mission-board"><div><small>SOURDOUGH SCHOOL · STARTER COURSE</small><h2>Choose a lesson</h2><p>Players can return here anytime to review what they have learned.</p></div><div className="mission-supplies">{lessons.map((l,i)=><button key={l.id} className={lessonIndex===i?'open':''} onClick={()=>changeLesson(i)}><span>{l.icon}</span><b>{l.title}</b><small>{passed.includes(l.id)?'✓ LESSON PASSED':l.subtitle}</small></button>)}</div>{allPassed&&!completed&&<button className="mission-launch" onClick={finishCourse}>🏅 COMPLETE STARTER COURSE & UNLOCK SHOPPING MISSION</button>}{completed&&<><h3>Your Starter Shopping List</h3><div className="mission-supplies">{starterSupplies.map(x=><button key={x.id} onClick={()=>setOpenItem(openItem===x.id?null:x.id)} className={openItem===x.id?'open':''}><span>{x.emoji}</span><b>{x.name}</b><small>{openItem===x.id?x.teaching:`🪙 ${x.cost} · ${x.shop==='grocery'?'GROCERY':'SUPPLY SHOP'}`}</small></button>)}</div><button className="mission-launch" onClick={onQuest}>🗺️ GO TO QUEST MEADOW TO EARN COINS →</button></>}
  </div>
 </section>;
}
