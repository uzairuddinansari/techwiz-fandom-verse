import { guideSections } from "./guideSectionList";

function GuideNavigation({ active, progress, onSelect }) {
  return (
    <aside id="guide-navigation" className="guide-navigation">
      <div className="guide-navigation-heading">
        <span>ON THIS PAGE</span>
        <strong>Guide</strong>
      </div>

      <nav aria-label="Guide sections">
        {guideSections.map(section => (
          <button
            type="button"
            key={section.id}
            className={`guide-nav-item ${section.id === active ? "active" : ""}`}
            aria-current={section.id === active ? "true" : undefined}
            onClick={() => onSelect(section.id)}
          >
            <span>{section.number}</span>
            <strong>{section.title}</strong>
          </button>
        ))}
      </nav>

      <div className="guide-progress">
        <div className="guide-progress-heading">
          <span>SETUP PROGRESS</span>
          <strong>{progress}%</strong>
        </div>

        <div className="guide-progress-track" role="progressbar" aria-label="Setup progress" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>

        <p>{progress >= 100 ? "You're all set — happy building!" : "Follow the guide to complete your setup."}</p>
      </div>
    </aside>
  );
}

export default GuideNavigation;
