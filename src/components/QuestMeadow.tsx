import { useMemo, useState } from 'react';
import BasketDash from './BasketDash';

type Props={coins:number;goalName?:string;goalCost?:number;onEarn:(n:number)=>void;onBack:()=>void;onGoStore:()=>void};
type Game='menu'|'basket'|'bubbles'|'match';
const bubbleFacts=[
 ['🫧','Bubbles','A starter makes gas as wild yeast and bacteria ferment flour.'],
 ['🌡️','Warmth','Warmer rooms usually speed fermentation. Cooler rooms slow it down.'],
 ['👃','Smell','A healthy starter can smell tangy, fruity, yeasty, or pleasantly sour.'],
 ['📈','Rise','Rise tells us fermentation is producing enough gas to lift the mixture.'],
 ['⏱️','Time','We watch the starter itself, not only the clock.']
] as const;
const matches=[
 {thing:'🌾 Brown rice flour',answer:'Feeds the starter',wrong:'Makes the jar colder'},
 {thing:'💧 Pure water',answer:'Hydrates the flour',wrong:'Adds sugar'},
 {thing:'⚖️ Gram scale',answer:'Measures accurately',wrong:'Checks smell'},
 {thing:'🌡️ Thermometer',answer:'Checks temperature',wrong:'Measures flour weight'},
] as const;

export default function QuestMeadow({coins,goalName,goalCost,onEarn,onBack,onGoStore}:Props){
 const[game,setGame]=useState<Game>('menu');
 const[claimed,setClaimed]=useState(false);
 const[pop,setPop]=useState<number[]>([]);
 const[matchStep,setMatchStep]=useState(0);
 const[matchScore,setMatchScore]=useState(0);
 const[feedback,setFeedback]=useState('');
 const missing=Math.max(0,(goalCost||0)-coins);
 const goalReady=!!goalName&&!!goalCost&&missing===0;
 const poppedAll=pop.length===bubbleFacts.length;
 const bubbleReward=3;
 const matchDone=matchStep>=matches.length;
 const matchReward=matchScore>=4?4:Math.max(2,matchScore);
 const meadowMessage=useMemo(()=>goalReady?`We have enough for ${goalName}!`:goalName?`We need ${missing} more coin${missing===1?'':'s'} for ${goalName}. Pick a game and earn them.`:'Pick a game, learn something useful, and earn a few coins.',[goalReady,goalName,missing]);
 function reset(){setGame('menu');setClaimed(false);setPop([]);setMatchStep(0);setMatchScore(0);setFeedback('')}
 function chooseMatch(choice:string){if(matchDone||feedback)return;const right=matches[matchStep].answer;const good=choice===right;if(good)setMatchScore(s=>s+1);setFeedback(good?'⭐ Correct! Bunny says that is exactly right.':'🐇 Not quite. Read what each tool or ingredient actually does.')}
 function nextMatch(){setFeedback('');setMatchStep(s=>s+1)}
 return <section className="quest-place">
  <div className="quest-hero">
   <div className="quest-sky"><span className="cloud c1">☁️</span><span className="cloud c2">☁️</span><span className="sun">☀️</span></div>
   <div className="quest-hills"/><div className="quest-grass"><i>🌼</i><i>🌸</i><i>🌻</i><i>🌷</i><i>🌼</i></div>
   <div className="quest-sign">QUEST<br/>MEADOW</div>
   <div className="quest-bunny">🐇</div>
   <div className="quest-speech"><small>BUNNY'S COIN QUEST</small><h1>{meadowMessage}</h1><p>Every game teaches a real sourdough skill. Rewards stay small so we earn our supplies one step at a time.</p><div className="quest-wallet"><span>🪙 {coins}</span>{goalName&&goalCost&&<span>{goalReady?'✓ READY TO BUY':`🎯 ${goalName}: ${goalCost}`}</span>}</div></div>
   <button className="quest-back" onClick={onBack}>← TOWN</button>
  </div>

  {game==='menu'&&<div className="quest-games">
   <button className="quest-game basket-game" onClick={()=>setGame('basket')}><div className="game-art"><span>🧺</span><i>🌾</i><b>💧</b></div><div><small>FAST SORTING GAME</small><h2>Basket Dash</h2><p>Catch the things a starter really needs and pass the silly stuff.</p><strong>Earn 2–12 coins</strong></div><em>PLAY →</em></button>
   <button className="quest-game bubble-game" onClick={()=>setGame('bubbles')}><div className="game-art"><span>🫧</span><i>🫧</i><b>🫧</b></div><div><small>STARTER SCIENCE GAME</small><h2>Bubble Pop</h2><p>Pop the fermentation clues and learn what each one tells a baker.</p><strong>Earn 3 coins</strong></div><em>PLAY →</em></button>
   <button className="quest-game match-game" onClick={()=>setGame('match')}><div className="game-art"><span>⚖️</span><i>🌡️</i><b>🫙</b></div><div><small>TOOL MATCHING GAME</small><h2>Baker Match</h2><p>Match real sourdough ingredients and tools with the job they do.</p><strong>Earn 2–4 coins</strong></div><em>PLAY →</em></button>
   {goalReady&&<button className="quest-ready" onClick={onGoStore}>🛒 We earned enough! Go buy {goalName} →</button>}
  </div>}

  {game==='basket'&&<div className="quest-stage"><div className="quest-stage-bar"><button onClick={reset}>← GAME TRAIL</button><b>🧺 Basket Dash</b><span>🪙 {coins}</span></div><BasketDash onEarn={onEarn} onExit={reset}/></div>}

  {game==='bubbles'&&<div className="quest-stage"><div className="quest-stage-bar"><button onClick={reset}>← GAME TRAIL</button><b>🫧 Bubble Pop</b><span>🪙 {coins}</span></div><div className="bubble-field"><div className="bubble-bunny">🐇</div><div className="bubble-board"><small>BUNNY SAYS</small><h2>Pop every starter clue!</h2><p>Each bubble reveals something a real baker watches.</p></div>{bubbleFacts.map((f,i)=><button key={f[1]} className={`fact-bubble b${i} ${pop.includes(i)?'popped':''}`} onClick={()=>!pop.includes(i)&&setPop(p=>[...p,i])}><span>{pop.includes(i)?f[0]:'🫧'}</span>{pop.includes(i)&&<div><b>{f[1]}</b><small>{f[2]}</small></div>}</button>)}</div>{poppedAll&&<div className="quest-win"><span>🎉</span><div><h2>All clues found!</h2><p>You learned five signs that help us understand fermentation.</p>{!claimed?<button onClick={()=>{onEarn(bubbleReward);setClaimed(true)}}>COLLECT 🪙 {bubbleReward}</button>:<button onClick={reset}>PLAY ANOTHER GAME →</button>}</div></div>}</div>}

  {game==='match'&&<div className="quest-stage"><div className="quest-stage-bar"><button onClick={reset}>← GAME TRAIL</button><b>🧠 Baker Match</b><span>🪙 {coins}</span></div>{!matchDone?<div className="match-scene"><div className="match-bunny">🐇</div><div className="match-card"><small>MATCH {matchStep+1} OF {matches.length}</small><h2>{matches[matchStep].thing}</h2><p>What job does this do?</p><button onClick={()=>chooseMatch(matches[matchStep].answer)} disabled={!!feedback}>{matches[matchStep].answer}</button><button onClick={()=>chooseMatch(matches[matchStep].wrong)} disabled={!!feedback}>{matches[matchStep].wrong}</button>{feedback&&<div className="match-feedback"><b>{feedback}</b><button onClick={nextMatch}>NEXT →</button></div>}</div></div>:<div className="quest-win"><span>🏅</span><div><h2>{matchScore}/4 correct!</h2><p>Bunny says you are learning what real bakers actually use.</p>{!claimed?<button onClick={()=>{onEarn(matchReward);setClaimed(true)}}>COLLECT 🪙 {matchReward}</button>:<button onClick={reset}>BACK TO GAME TRAIL →</button>}</div></div>}</div>}
 </section>
}
