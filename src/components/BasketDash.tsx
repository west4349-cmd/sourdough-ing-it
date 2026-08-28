import { useState } from 'react';

const items = [
  ['🌾', 'Brown rice flour', true, 'Starter food. Put it in the basket!'],
  ['🥤', 'Orange soda', false, 'Starter needs clean water, not sugary soda.'],
  ['💧', 'Pure water', true, 'Yes. Clean drinking water belongs in our starter kit.'],
  ['🍬', 'Candy sprinkles', false, 'Fun for treats, but not for a starter.'],
  ['⚖️', 'Digital gram scale', true, 'Yes. We measure sourdough by weight.'],
  ['🍟', 'Potato chips', false, 'Nope. Bunny can eat those later.'],
  ['🫙', 'Clear glass jar', true, 'Yes. We need to see bubbles and rise.'],
  ['🌡️', 'Thermometer', true, 'Yes. Temperature changes fermentation speed.'],
] as const;

export default function BasketDash({ onEarn, onExit }: { onEarn: (coins: number) => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [claimed, setClaimed] = useState(false);
  const done = index >= items.length || hearts <= 0;
  const current = items[Math.min(index, items.length - 1)];
  const reward = Math.max(2, score + (score === items.length ? 3 : 1));
  const correct = choice === current?.[2];

  function choose(keep: boolean) {
    if (choice !== null || done) return;
    setChoice(keep);
    if (keep === current[2]) setScore((s) => s + 1);
    else setHearts((h) => Math.max(0, h - 1));
  }

  function next() {
    setChoice(null);
    setIndex((i) => i + 1);
  }

  return (
    <section className="game-card">
      <header className="game-header">
        <div><small>QUEST MEADOW GAME</small><h2>🧺 Basket Dash</h2></div>
        <div className="hud"><span>❤️ {hearts}</span><span>🪙 {score}</span></div>
      </header>
      {!done ? (
        <>
          <div className="meadow-lane">
            <div className="moving-item"><span>{current[0]}</span><b>{current[1]}</b></div>
            <div className="basket">🧺<small>STARTER KIT</small></div>
          </div>
          <p className="game-instruction">Does this belong in Bunny’s starter kit?</p>
          <div className="game-actions">
            <button onClick={() => choose(true)} disabled={choice !== null}>🧺 IN THE BASKET</button>
            <button onClick={() => choose(false)} disabled={choice !== null}>👋 PASS IT BY</button>
          </div>
          {choice !== null && (
            <div className={`feedback ${correct ? 'good' : 'watch'}`}>
              <b>{correct ? '⭐ Great sort!' : '🐇 Good thing we checked!'}</b>
              <p>{current[3]}</p>
              <button onClick={next}>NEXT ITEM →</button>
            </div>
          )}
        </>
      ) : (
        <div className="game-finish">
          <span>🎉</span>
          <h2>Dash complete!</h2>
          <p>You sorted {score} items correctly.</p>
          <strong>Reward: 🪙 {reward}</strong>
          {!claimed ? (
            <button onClick={() => { onEarn(reward); setClaimed(true); }}>COLLECT {reward} COINS</button>
          ) : (
            <button onClick={onExit}>BACK TO BUNNY →</button>
          )}
        </div>
      )}
    </section>
  );
}
