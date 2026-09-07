import { useMemo, useState } from 'react';
import './HomeBakery.css';

type Props={coins:number;completed:boolean;onEarn:(n:number)=>void;onComplete:()=>void;onBack:()=>void};
type Order={name:string;loaves:number;price:number;flour:number;starter:number;salt:number;packaging:number;difficulty:number};
type Upgrade='basket'|'bowl'|'scale'|'rack';
const orders:Order[]=[
 {name:'Neighbor Dinner Order',loaves:2,price:24,flour:5,starter:2,salt:1,packaging:2,difficulty:1},
 {name:'Saturday Family Pickup',loaves:3,price:39,flour:8,starter:3,salt:1,packaging:3,difficulty:2},
 {name:'Teacher Appreciation Order',loaves:4,price:48,flour:10,starter:4,salt:2,packaging:4,difficulty:3},
 {name:'Small Birthday Gathering',loaves:5,price:65,flour:13,starter:5,salt:2,packaging:5,difficulty:4},
 {name:'Neighborhood Brunch',loaves:6,price:72,flour:16,starter:6,salt:3,packaging:6,difficulty:5},
];
const upgrades:{id:Upgrade;name:string;cost:number;effect:string}[]=[
 {id:'basket',name:'Delivery Basket',cost:18,effect:'+2 coins on every completed order'},
 {id:'bowl',name:'Large Mixing Bowl',cost:24,effect:'Raises daily capacity by 2 loaves'},
 {id:'scale',name:'Bakery Scale',cost:30,effect:'Reduces ingredient waste by 2 coins per order'},
 {id:'rack',name:'Cooling Rack Set',cost:36,effect:'Raises daily capacity by 3 loaves'},
];
const random=<T,>(a:T[])=>a[Math.floor(Math.random()*a.length)];
export default function HomeBakery({coins,completed,onEarn,onComplete,onBack}:Props){
 const[day,setDay]=useState(1);const[reputation,setReputation]=useState(0);const[ordersDone,setOrdersDone]=useState(0);const[owned,setOwned]=useState<Upgrade[]>([]);const[current,setCurrent]=useState<Order>(()=>random(orders));const[accepted,setAccepted]=useState(false);const[feedback,setFeedback]=useState('');const[profit,setProfit]=useState(0);const[pricing,setPricing]=useState<number|null>(null);const[claimedMilestone,setClaimedMilestone]=useState(false);
 const capacity=useMemo(()=>4+(owned.includes('bowl')?2:0)+(owned.includes('rack')?3:0),[owned]);
 const rawCost=current.flour+current.starter+current.salt+current.packaging;const trueCost=Math.max(1,rawCost-(owned.includes('scale')?2:0));
 const deliveryBonus=owned.includes('basket')?2:0;const suggestedPrice=trueCost+Math.max(8,current.loaves*5);const canTake=current.loaves<=capacity;
 function nextOrder(){setCurrent(random(orders));setAccepted(false);setPricing(null);setFeedback('')}
 function buy(id:Upgrade){const u=upgrades.find(x=>x.id===id)!;if(owned.includes(id)||coins<u.cost)return;onEarn(-u.cost);setOwned(v=>[...v,id]);setFeedback(`${u.name} purchased. ${u.effect}.`)}
 function choosePrice(p:number){setPricing(p);if(p<trueCost){setFeedback('That price loses money before your work is even counted. Recalculate.');return}if(p>trueCost+25){setFeedback('That price may be too high for this small home-bakery order. Try a more defensible margin.');return}setFeedback(`Price selected: ${p} coins. Estimated profit before bonuses: ${p-trueCost}.`)}
 function completeOrder(){if(pricing===null||pricing<trueCost||pricing>trueCost+25)return;const earned=pricing-trueCost+deliveryBonus;onEarn(earned);setProfit(p=>p+earned);setOrdersDone(n=>n+1);setReputation(r=>r+(pricing<=suggestedPrice+5?2:1));setDay(d=>d+1);setFeedback(`Order complete! Profit: +${earned} coins. Costs were ${trueCost}; customer paid ${pricing}.`);setAccepted(false);setPricing(null);window.setTimeout(()=>nextOrder(),1200)}
 const milestone=ordersDone>=5&&profit>=45&&reputation>=7;
 function claimMilestone(){if(!milestone||claimedMilestone)return;onEarn(15);setClaimedMilestone(true);onComplete()}
 return <section className="home-bakery">
  <header className="hb-header"><button onClick={onBack}>← BUNNYWOOD</button><div><small>HOME BAKERY · CHAPTER 3</small><h1>Turn good bread into a tiny business.</h1><p>Take orders you can actually handle, price them above cost, protect quality, and reinvest carefully.</p></div><div className="hb-stats"><span>DAY <b>{day}</b></span><span>COINS <b>{coins}</b></span><span>REP <b>{reputation}</b></span><span>PROFIT <b>{profit}</b></span></div></header>
  <div className="hb-grid">
   <article className="hb-order"><small>ORDER BOARD</small><h2>{current.name}</h2><div className="hb-order-stats"><span><b>{current.loaves}</b> loaves</span><span><b>{current.price}</b> customer budget</span><span><b>{capacity}</b> loaf capacity</span></div><h3>Estimated direct costs</h3><div className="hb-costs"><span>Flour <b>{current.flour}</b></span><span>Starter feed <b>{current.starter}</b></span><span>Salt <b>{current.salt}</b></span><span>Packaging <b>{current.packaging}</b></span><span className="total">TOTAL <b>{trueCost}</b></span></div>{!accepted?<div className="hb-actions"><button disabled={!canTake} onClick={()=>{setAccepted(true);setFeedback('Order accepted. Now price it so the bakery earns a reasonable profit.')}}>{canTake?'ACCEPT ORDER':'OVER CAPACITY'}</button><button onClick={nextOrder}>DECLINE & CHECK NEXT</button></div>:<div className="hb-pricing"><h3>Choose your selling price</h3><p>Cost: <b>{trueCost}</b> · Customer budget: <b>{current.price}</b> · Suggested target around <b>{suggestedPrice}</b></p><div>{[trueCost-2,trueCost+5,trueCost+10,trueCost+15,trueCost+22].filter(x=>x>0).map(x=><button key={x} className={pricing===x?'selected':''} onClick={()=>choosePrice(x)}>{x} coins</button>)}</div><button className="complete" disabled={pricing===null||pricing<trueCost||pricing>trueCost+25} onClick={completeOrder}>BAKE, PACK & COMPLETE ORDER</button></div>}</article>
   <aside className="hb-upgrades"><small>REINVESTMENT SHELF</small><h2>Grow carefully</h2>{upgrades.map(u=><div key={u.id} className={owned.includes(u.id)?'owned':''}><h3>{owned.includes(u.id)?'✓ ':''}{u.name}</h3><p>{u.effect}</p><button disabled={owned.includes(u.id)||coins<u.cost} onClick={()=>buy(u.id)}>{owned.includes(u.id)?'OWNED':coins>=u.cost?`BUY · ${u.cost}`:`NEED ${u.cost}`}</button></div>)}</aside>
  </div>
  <div className="hb-goal"><div><small>HOME BAKERY MILESTONE</small><h2>Prove the bakery can sustain itself.</h2><p>Complete at least <b>5 orders</b>, earn <b>45 total profit</b>, and reach <b>7 reputation</b>.</p></div><div className="hb-goal-bars"><span className={ordersDone>=5?'done':''}>Orders {ordersDone}/5</span><span className={profit>=45?'done':''}>Profit {profit}/45</span><span className={reputation>=7?'done':''}>Reputation {reputation}/7</span></div>{milestone&&!claimedMilestone&&<button onClick={claimMilestone}>CLAIM HOME BAKERY MILESTONE · +15 COINS</button>}{claimedMilestone&&<strong>✓ HOME BAKERY ESTABLISHED</strong>}</div>
  {feedback&&<div className="hb-feedback">{feedback}</div>}
  {completed&&<div className="hb-complete"><b>CHAPTER COMPLETE</b><span>Your home bakery is established. Bunnywood Bakery is the next expansion.</span></div>}
 </section>
}
