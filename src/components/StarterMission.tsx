type Props={school:boolean;coins:number;owned:number;total:number;starterMade:boolean;feeds:number;mature:boolean;onSchool:()=>void;onQuest:()=>void;onShop:()=>void;onCottage:()=>void};
export default function StarterMission({school,coins,owned,total,starterMade,feeds,mature,onSchool,onQuest,onShop,onCottage}:Props){
 let title='Go to Sourdough School';let text='Bunny needs to teach you what a starter is and what supplies you need before the adventure begins.';let action=onSchool;let button='ENTER SCHOOLHOUSE →';let step=1;
 if(school&&owned<total){step=2;title='Build Your Starter Kit';text=`You have ${owned} of ${total} supplies and ${coins} coins. Play Quest Meadow to earn coins, then visit the correct Bunnywood shops.`;action=coins>2?onShop:onQuest;button=coins>2?'GO SHOPPING →':'GO TO QUEST MEADOW →'}
 if(school&&owned===total&&!starterMade){step=3;title='Make Your Starter';text='Your starter kit is complete. Take everything to Starter Cottage and build the culture Bunny taught you about.';action=onCottage;button='ENTER STARTER COTTAGE →'}
 if(starterMade&&!mature){step=4;title=`Raise Your Starter · Day ${Math.min(feeds+1,6)}`;text='Your starter is alive. Observe its clues, make care decisions, and help it become predictably strong.';action=onCottage;button='CHECK ON MY STARTER →'}
 if(mature){step=5;title='Starter Graduation!';text='Your starter has shown repeated strength. Return to Schoolhouse for the First Loaf course.';action=onSchool;button='RETURN TO SCHOOLHOUSE →'}
 return <aside className="starter-mission-card"><div className="mission-ribbon">STARTER ADVENTURE · STEP {step}/5</div><div className="mission-bunny">🐇</div><div><small>BUNNY'S NEXT MISSION</small><h2>{title}</h2><p>{text}</p><button onClick={action}>{button}</button></div></aside>
}
