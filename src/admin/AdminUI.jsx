import { useState } from "react";

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="adm-page-head">
      <div>
        {eyebrow && <span className="adm-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="adm-head-actions">{children}</div>}
    </header>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "default" }) {
  return (
    <article className={`adm-stat adm-stat-${tone}`}>
      <div className="adm-stat-top">
        <span>{label}</span>
        {Icon && <i><Icon size={17} /></i>}
      </div>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  );
}

export function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`adm-panel ${className}`}>
      {(title || action) && (
        <header>
          {title && <h2>{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/*
  Single-series vertical bar chart (one hue, so no legend — the panel title names it).
  Bars are anchored to the baseline with rounded tops; hovering shows the exact value.
*/
export function ColumnChart({ data, valueKey, labelKey, formatLabel = (value) => value, height = 200, unit = "" }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...data.map((entry) => entry[valueKey]));
  const ticks = [max, Math.round(max / 2), 0];
  return (
    <div className="adm-columns" style={{ "--chart-h": `${height}px` }}>
      <div className="adm-columns-axis" aria-hidden="true">
        {ticks.map((tick, index) => <span key={index}>{tick}</span>)}
      </div>
      <div className="adm-columns-plot" role="list">
        {data.map((entry, index) => {
          const value = entry[valueKey];
          return (
            <div
              key={entry[labelKey]}
              role="listitem"
              className={`adm-column ${hover === index ? "is-hover" : ""}`}
              onMouseEnter={() => setHover(index)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(index)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${formatLabel(entry[labelKey])}: ${value}${unit}`}
            >
              <span className="adm-column-bar" style={{ height: `${Math.max(value ? 3 : 0, (value / max) * 100)}%` }} />
              {hover === index && (
                <span className="adm-tooltip">
                  <b>{value}{unit}</b> {formatLabel(entry[labelKey])}
                </span>
              )}
              <small>{formatLabel(entry[labelKey], index)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Horizontal bars for ranked categories; the value is printed beside each bar. */
export function BarList({ data, max: fixedMax }) {
  const max = fixedMax || Math.max(1, ...data.map((entry) => entry.value));
  return (
    <ul className="adm-barlist">
      {data.map((entry) => (
        <li key={entry.label} title={`${entry.label}: ${entry.value}`}>
          <div className="adm-barlist-label">
            <span>{entry.label}</span>
            <b>{entry.value}</b>
          </div>
          <div className="adm-barlist-track">
            <span style={{ width: `${(entry.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="adm-empty">
      {Icon && <Icon size={30} />}
      <h3>{title}</h3>
      {children}
    </div>
  );
}
