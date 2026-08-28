import { chapters, type ChapterId } from '../data/game';

export default function ChapterPath({ current }: { current: ChapterId }) {
  const currentIndex = chapters.findIndex((c) => c.id === current);
  return (
    <div className="chapter-path" aria-label="Main adventure progress">
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className={`chapter-dot ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`}>
          <span>{index < currentIndex ? '✓' : chapter.icon}</span>
          <small>{index + 1}</small>
        </div>
      ))}
    </div>
  );
}
