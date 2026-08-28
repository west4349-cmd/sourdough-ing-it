import { useEffect, useMemo, useState } from 'react';
import ChapterPath from './components/ChapterPath';
import BunnyGuide from './components/BunnyGuide';
import BasketDash from './components/BasketDash';
import { chapters, starterSupplies, type ChapterId } from './data/game';

type View = 'town' | 'quest' | 'store' | 'kitchen' | 'starter' | 'loaf' | 'bakery';
type Save = {
  chapter: ChapterId;
  coins: number;
  owned: string[];
  starterMade: boolean;
  starterFeeds: number;
  starterMature: boolean;
};

const SAVE_KEY = 'sourdough-ing-it-v2';
const initial: Save = { chapter: 'starter', coins: 3, owned: [], starterMade: false, starterFeeds: 0, starterMature: false };

function load(): Save {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    return initial;
  }
}

export default function App() {
  const [game, setGame] = useState<Save>(load);
  const [view, setView] = useState<View>('town');
  useEffect(() => localStorage.setItem(SAVE_KEY, JSON.stringify(game)), [game]);

  const nextSupply = starterSupplies.find((s) => !game.owned.includes(s.id));
  const allSupplies = !nextSupply;
  const currentChapter = chapters.find((c) => c.id === game.chapter)!;
  const starterProgress = useMemo(() => {
    let n = 0;
    if (allSupplies) n++;
    if (game.starterMade) n++;
    if (game.starterFeeds >= 1) n++;
    if (game.starterFeeds >= 4) n++;
    if (game.starterMature) n++;
    return n;
  }, [allSupplies, game]);

  function earn(n: number) { setGame((g) => ({ ...g, coins: g.coins + n })); }
  function buyNext() {
    if (!nextSupply || game.coins < nextSupply.cost) return;
    setGame((g) => ({ ...g, coins: g.coins - nextSupply.cost, owned: [...g.owned, nextSupply.id] }));
  }

  function mainAction() {
    if (game.chapter === 'starter') {
      if (!allSupplies) setView(game.coins >= (nextSupply?.cost ?? 0) ? 'store' : 'quest');
      else if (!game.starterMade) setView('kitchen');
      else setView('starter');
      return;
    }
    if (game.chapter === 'loaf') setView('loaf');
    else setView('bakery');
  }

  function chapterGoal() {
    if (game.chapter === 'starter') {
      if (!allSupplies && nextSupply) return game.coins >= nextSupply.cost
        ? `We have enough coins. Buy the ${nextSupply.name}.`
        : `Earn ${nextSupply.cost - game.coins} more coin${nextSupply.cost - game.coins === 1 ? '' : 's'} for the ${nextSupply.name}.`;
      if (!game.starterMade) return 'Take the supplies home and make the starter with Bunny.';
      if (!game.starterMature) return 'Feed and observe the starter until it becomes strong and mature.';
    }
    if (game.chapter === 'loaf') return 'Learn the full real-life loaf process and complete your first loaf.';
    if (game.chapter === 'home') return 'Serve neighbors and grow a small home bakery.';
    if (game.chapter === 'town') return 'Open and grow Bunnywood Bakery.';
    return 'Scale the bakery into a company.';
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div><span>🐇</span><div><b>SOURDOUGH-ING IT!</b><small>ADVENTURES WITH BUNNY</small></div></div>
        <strong>🪙 {game.coins}</strong>
      </header>
      <main>
        <section className="adventure-header">
          <ChapterPath current={game.chapter} />
          <div className="chapter-title">
            <small>MAIN ADVENTURE</small>
            <h1>{currentChapter.icon} {currentChapter.title}</h1>
            <p>{currentChapter.summary}</p>
          </div>
        </section>

        {view === 'town' && (
          <>
            <BunnyGuide eyebrow="BUNNY SAYS · DO THIS NEXT" title={chapterGoal()} text="You never have to guess where to go. I’ll show you one step at a time." button="DO THIS NEXT →" onClick={mainAction} />
            <section className="town-map">
              <img src="./resources/bunnywood-town-master.png" alt="Bunnywood town" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div className="town-fallback">
                <h2>🌳 Bunnywood</h2>
                <p>The approved Bunnywood artwork drops into <code>public/resources/bunnywood-town-master.png</code>.</p>
                <div className="building-grid">
                  <button onClick={() => setView('starter')}>🫙 Starter Cottage</button>
                  <button onClick={() => setView('bakery')}>🏪 Bakery</button>
                  <button onClick={() => setView('kitchen')}>🥣 Recipe Kitchen</button>
                  <button onClick={() => setView('store')}>🛒 Grocery Store</button>
                  <button onClick={() => setView('quest')}>🎯 Quest Meadow</button>
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'quest' && (
          <>
            <BunnyGuide eyebrow="QUEST MEADOW" title="Earn coins for the next starter supply." text={nextSupply ? `${nextSupply.name} costs ${nextSupply.cost} coins. You have ${game.coins}. Let’s play until we can afford it.` : 'Our starter shopping is complete, but you can still practice and earn.'} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
            <BasketDash onEarn={earn} onExit={() => setView(nextSupply && game.coins >= nextSupply.cost ? 'store' : 'quest')} />
          </>
        )}

        {view === 'store' && nextSupply && (
          <>
            <BunnyGuide eyebrow="GROCERY MISSION" title={`Next: ${nextSupply.name}`} text={nextSupply.teaching} button={game.coins >= nextSupply.cost ? `BUY FOR ${nextSupply.cost} COINS` : 'EARN MORE COINS →'} onClick={game.coins >= nextSupply.cost ? buyNext : () => setView('quest')} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
            <section className="supply-shelf">
              <div className="big-item"><span>{nextSupply.emoji}</span><h2>{nextSupply.name}</h2><strong>🪙 {nextSupply.cost}</strong></div>
              <div className="shopping-progress">
                <small>STARTER SHOPPING LIST</small>
                {starterSupplies.map((s) => <span key={s.id} className={game.owned.includes(s.id) ? 'done' : s.id === nextSupply.id ? 'current' : ''}>{game.owned.includes(s.id) ? '✓' : s.emoji} {s.name}</span>)}
              </div>
            </section>
          </>
        )}

        {view === 'store' && !nextSupply && (
          <BunnyGuide eyebrow="SHOPPING COMPLETE" title="We have everything!" text="Now we go home and make the starter." button="🏡 GO TO THE KITCHEN →" onClick={() => setView('kitchen')} />
        )}

        {view === 'kitchen' && (
          <section className="room-card kitchen-room">
            <div className="room-scene">☀️　🥣　⚖️　🌀<span>🐇</span></div>
            <BunnyGuide eyebrow="STARTER COTTAGE · KITCHEN" title={game.starterMade ? 'Our starter is already made.' : 'Let’s make our starter.'} text={game.starterMade ? 'Now our job is to care for it like a little kitchen pet.' : 'Real-life lesson: weigh 50g brown rice flour and 50g pure water. Mix until no dry flour remains, scrape the jar clean, mark the starting height, and cover loosely.'} button={game.starterMade ? 'CHECK MY STARTER →' : 'MAKE THE STARTER →'} onClick={() => { if (!game.starterMade) setGame((g) => ({ ...g, starterMade: true })); setView('starter'); }} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
          </section>
        )}

        {view === 'starter' && (
          <section className="starter-room">
            <div className="pet-scene"><span>🐇</span><div className="starter-jar">🫙<i>{game.starterMature ? '🫧🫧🫧' : game.starterFeeds ? '🫧🫧' : '·'}</i></div></div>
            <BunnyGuide eyebrow={`STARTER CARE · ${starterProgress}/5`} title={game.starterMature ? 'Your starter is mature!' : game.starterFeeds === 0 ? 'Let it rest before the first feeding.' : 'Keep feeding and watching the clues.'} text={game.starterMature ? 'We did it. Our starter is strong enough to move into the bread chapter.' : 'Watch bubbles, rise, smell, temperature, and time. Real sourdough is learned by observing the starter, not by blindly following a clock.'} button={game.starterMature ? '🥖 UNLOCK FIRST LOAF →' : '🥣 COMPLETE A CARE CYCLE'} onClick={() => {
              if (game.starterMature) { setGame((g) => ({ ...g, chapter: 'loaf' })); setView('town'); return; }
              setGame((g) => {
                const feeds = g.starterFeeds + 1;
                return { ...g, starterFeeds: feeds, starterMature: feeds >= 4 };
              });
            }} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
            <div className="real-life-box"><b>🏠 TRY THIS WITH YOUR REAL STARTER</b><p>Use the same observation skills at home. The game does not replace food-safety judgment or an adult’s help with kitchen equipment.</p></div>
          </section>
        )}

        {view === 'loaf' && (
          <section className="loaf-school">
            <BunnyGuide eyebrow="CHAPTER 2 · FIRST LOAF" title="Starter becomes bread." text="We will learn this in the same order a real baker does it: active starter → weigh → mix → rest → folds → bulk fermentation → shape → proof → score → bake → cool." button="COMPLETE FIRST LOAF LESSON →" onClick={() => { setGame((g) => ({ ...g, chapter: 'home' })); setView('town'); }} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
            <div className="process-strip">{['Active starter','Weigh','Mix','Rest','Folds','Bulk','Shape','Proof','Score','Bake','Cool'].map((x, i) => <span key={x}><i>{i + 1}</i>{x}</span>)}</div>
            <div className="real-life-box"><b>📘 REAL-LIFE SOURDOUGH</b><p>Chapter 2 will be expanded into interactive practice for every real bread-making step before we build the Home Bakery economy.</p></div>
          </section>
        )}

        {view === 'bakery' && (
          <section className="bakery-stage">
            <BunnyGuide eyebrow={`${currentChapter.icon} ${currentChapter.title.toUpperCase()}`} title={game.chapter === 'home' ? 'Start small from home.' : game.chapter === 'town' ? 'The Bunnywood Bakery is open.' : 'Grow beyond Bunnywood.'} text={game.chapter === 'home' ? 'One customer at a time. We learn pricing, costs, consistency, and how much we can safely make.' : game.chapter === 'town' ? 'Now we handle more customers and larger batches while protecting quality.' : 'A corporate bakery needs systems, production planning, people, delivery, and consistent bread.'} button={game.chapter === 'home' ? 'COMPLETE HOME BAKERY CHAPTER →' : game.chapter === 'town' ? 'COMPLETE TOWN BAKERY CHAPTER →' : undefined} onClick={game.chapter === 'home' ? () => setGame((g) => ({ ...g, chapter: 'town' })) : game.chapter === 'town' ? () => setGame((g) => ({ ...g, chapter: 'company' })) : undefined} secondary="← BACK TO TOWN" onSecondary={() => setView('town')} />
            <div className="business-cards">
              <article><span>🧾</span><b>Real costs</b><p>Ingredients, packaging, equipment, and time matter.</p></article>
              <article><span>🥖</span><b>Consistent product</b><p>Customers return when the bread is dependable.</p></article>
              <article><span>📦</span><b>Production planning</b><p>Make what you can handle without sacrificing quality.</p></article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
