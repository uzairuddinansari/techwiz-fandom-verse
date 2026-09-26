import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Play } from "lucide-react";
import { categories, detailPath, formatDate, sectionPath, typeLabels, upcomingReleases } from "../fandom/catalog";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import MediaModal from "../components/fandom/MediaModal";
import "../styles/Fandom.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthKey = (iso) => iso.slice(0, 7);

export default function ReleasesPage() {
  const [category, setCategory] = useState("all");
  const [openItem, setOpenItem] = useState(null);
  const releases = useMemo(
    () => upcomingReleases.filter((item) => category === "all" || item.category === category),
    [category],
  );
  // Months come from the filtered list, so changing the category never lands on an empty month.
  const months = [...new Set(releases.map((item) => monthKey(item.date)))];
  const [chosenMonth, setMonth] = useState(null);
  const month = months.includes(chosenMonth) ? chosenMonth : months[0] || new Date().toISOString().slice(0, 7);
  const monthIndex = months.indexOf(month);

  const [year, monthNumber] = month.split("-").map(Number);
  const first = new Date(year, monthNumber - 1, 1);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const leading = (first.getDay() + 6) % 7;
  const inMonth = releases.filter((item) => monthKey(item.date) === month);
  const byDay = inMonth.reduce((map, item) => {
    const day = Number(item.date.slice(8, 10));
    (map[day] ||= []).push(item);
    return map;
  }, {});

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Upcoming releases" }]} />
        <header className="fv-page-hero">
          <span className="fv-eyebrow">Upcoming releases</span>
          <h1>Mark your calendar.</h1>
          <p>Upcoming trailers, premieres and fandom events across all seven hubs.</p>
        </header>

        <div className="fv-toolbar">
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
            </select>
          </label>
          <p className="fv-count"><span className="saved-dot" /> {releases.length} upcoming</p>
        </div>

        <div className="fv-calendar-layout">
          <section className="fv-panel fv-calendar" aria-label="Release calendar">
            <header>
              <button type="button" className="fv-icon-button" disabled={monthIndex <= 0} onClick={() => setMonth(months[monthIndex - 1])} aria-label="Previous month">
                <ChevronLeft size={18} />
              </button>
              <h2>{first.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</h2>
              <button type="button" className="fv-icon-button" disabled={monthIndex >= months.length - 1} onClick={() => setMonth(months[monthIndex + 1])} aria-label="Next month">
                <ChevronRight size={18} />
              </button>
            </header>
            <div className="fv-calendar-grid" role="grid">
              {WEEKDAYS.map((day) => <span key={day} className="fv-weekday" role="columnheader">{day}</span>)}
              {Array.from({ length: leading }, (_, index) => <span key={`blank-${index}`} />)}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const entries = byDay[day];
                return (
                  <span key={day} className={`fv-day ${entries ? "has-release" : ""}`} role="gridcell" aria-label={entries ? `${day}: ${entries.map((entry) => entry.title).join(", ")}` : undefined}>
                    {day}
                    {entries && <i>{entries.length}</i>}
                  </span>
                );
              })}
            </div>
          </section>

          <section className="fv-release-list" aria-label="Releases this month">
            {inMonth.length === 0 && <p className="fv-empty">Nothing scheduled this month for this category.</p>}
            {inMonth.map((item) => (
              <article key={item.uid} className="fv-release">
                <time dateTime={item.date}>
                  <strong>{item.date.slice(8, 10)}</strong>
                  <span>{formatDate(item.date, { month: "short" })}</span>
                </time>
                <img src={item.image} alt="" loading="lazy" />
                <div>
                  <span className="fv-eyebrow">{item.categoryName} · {typeLabels[item.type]}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.location && <p className="fv-muted"><MapPin size={13} /> {item.location}</p>}
                </div>
                {item.type === "trailer" ? (
                  <button type="button" className="fv-button-outline" onClick={() => setOpenItem(item)}>
                    <Play size={15} fill="currentColor" /> Watch
                  </button>
                ) : (
                  <Link className="fv-button-outline" to={detailPath(item)}>Details</Link>
                )}
              </article>
            ))}
            {inMonth.length > 0 && (
              <Link className="fv-link-button" to={sectionPath(inMonth[0])}>Browse more from {inMonth[0].categoryName} →</Link>
            )}
          </section>
        </div>
      </div>

      {openItem && <MediaModal items={[openItem]} index={0} onNavigate={() => {}} onClose={() => setOpenItem(null)} />}
    </main>
  );
}
