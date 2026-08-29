import { useMemo, useState } from 'react';

type Tool={id:string;name:string;job:string;symbol:string};
const tools:Tool[]=[
 {id:'scale',name:'Gram Scale',job:'Measure ingredients by weight',symbol:'⚖️'},
 {id:'therm',name:'Thermometer',job:'Check temperature',symbol:'🌡️'},
 {id:'jar',name:'Glass Jar',job:'Watch bubbles and rise',symbol:'🫙'},
 {id:'whisk',name:'Dough Whisk',job:'Mix thick starter',symbol:'🌀'},
 {id:'spatula',name:'Jar Spatula',job:'Scrape the jar clean',symbol:'🥄'},
 {id:'timer',name:'Timer',job:'Track fermentation time',symbol:'⏲️'}
];
const jobs=tools.map(t=>t.job);
function shuffled<T>(a:T[]){return [...a].sort(()=>Math.random()-.5)}
export default function ToolTrail({onEarn,onExit}:{onEarn:(n:number)=>void;onExit:()=>void}){
 const[started,setStarted]=useState(false),[done,setDone]=useState(false),[claimed,setClaimed]=useState(false);const[round,setRound]=useState(0),[score,setScore]=useState(0),[lives,setLives]=useState(3),[choices,setChoices]=useState<string[]>(()=>shuffled(jobs).slice(0,3));
 const tool=tools[Math.min(round,tools.length-1)];const reward=useMemo(()=>Math.max(2,Math.min(7,2+score)),[score]);
 function nextChoices(nextRound:number){const right=tools[nextRound]?.job;if(!right)return;setChoices(shuffled([right,...shuffled(jobs.filter(j=>j!==right)).slice(0,2)]))}
 function choose(job:string){if(done)return;const good=job===tool.job;if(good)setScore(s=>s+1);else setLives(l=>Math.max(0,l-1));const next=round+1;if(next>=tools.length||(!good&&lives<=1)){setDone(true)}else{setRound(next);nextChoices(next)}}
 function restart(){setStarted(false);setDone(false);setClaimed(false);setRound(0);setScore(0);setLives(3);setChoices(shuffled([tools[0].job,...shuffled(jobs.filter(j=>j!==tools[0].job)).slice(0,2)]))}
 return <section className="tool-trail">{!started&&!done?<div className="tool-start"><div className="tool-shed"><div className="shed-roof"/><div className="shed-door">TOOLS</div><div className="shed-tools">⚖️ 🌡️ 🫙 🌀</div></div><div className="tool-copy"><small>QUEST MEADOW ACTION GAME</small><h2>Tool Trail</h2><p>Bunny rolls a bakery tool down the trail. Run it into the sign that shows the <b>right job</b>.</p><p>Six tools. Three lives. Better scores earn more coins.</p><button onClick={()=>setStarted(true)}>START TOOL TRAIL →</button></div></div>:started&&!done?<><div className="arcade-hud"><span>ROUND {round+1}/6</span><span>⭐ {score}</span><span>❤ {lives}</span></div><div className="tool-field"><div className="tool-clouds">☁️　　　　　☁️</div><div className="tool-hill"/><div className="tool-bunny">🐇</div><div className="rolling-tool"><span>{tool.symbol}</span><b>{tool.name}</b></div><div className="trail-split"><i/><i/><i/></div><div className="job-signs">{choices.map((c,i)=><button key={c} onClick={()=>choose(c)} className={`job-sign j${i}`}><span>{i===0?'←':i===1?'↑':'→'}</span><b>{c}</b></button>)}</div></div></>:<div className="arcade-finish"><div className="finish-bunny">🐇</div><div><small>TOOL TRAIL COMPLETE</small><h2>{score===6?'Perfect tool run!':score>=4?'Great bakery skills!':'Good practice!'}</h2><p>You matched <b>{score} of 6</b> bakery tools to their real jobs.</p><strong>Coin reward: 🪙 {reward}</strong>{!claimed?<button onClick={()=>{onEarn(reward);setClaimed(true)}}>COLLECT {reward} COINS</button>:<div className="finish-actions"><button onClick={restart}>PLAY AGAIN</button><button onClick={onExit}>BACK TO GAME TRAIL</button></div>}</div></div>}</section>
}
