export default function BunnyGuide({ eyebrow, title, text, button, onClick, secondary, onSecondary }: {
  eyebrow: string;
  title: string;
  text: string;
  button?: string;
  onClick?: () => void;
  secondary?: string;
  onSecondary?: () => void;
}) {
  return (
    <section className="bunny-guide">
      <div className="bunny-face bunny-face-girl"><img src="./resources/bunny-explorer.png" alt="Bunny" /></div>
      <div className="bunny-copy">
        <small>{eyebrow}</small>
        <h2>{title}</h2>
        <p>“{text}”</p>
        <div className="bunny-actions">
          {button && onClick && <button className="primary" onClick={onClick}>{button}</button>}
          {secondary && onSecondary && <button className="secondary" onClick={onSecondary}>{secondary}</button>}
        </div>
      </div>
    </section>
  );
}
