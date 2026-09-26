import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bookmark, Bot, CalendarDays, Clock3, MapPin, Pause, Play, Search, ShoppingBag, UserPlus } from "lucide-react";
import { allContent, categories, detailPath, featuredContent, formatDate, sectionPath, upcomingReleases } from "../../fandom/catalog";
import MediaModal from "./MediaModal";
import "../../styles/Fandom.css";
import "../../styles/Home.css";

export function CategoryShowcase() {
  return (
    <section className="home-categories" aria-labelledby="home-categories-title">
      <div className="fv-container">
        <header className="fv-section-head">
          <div>
            <span className="fv-eyebrow">Seven worlds</span>
            <h2 id="home-categories-title">Explore Categories</h2>
            <p>Pick a hub to dive into its articles, galleries, videos, characters, events, merch and trailers.</p>
          </div>
          <Link className="fv-button-outline" to="/search">Search everything <ArrowRight size={16} /></Link>
        </header>

        <div className="home-category-grid">
          {categories.map((category, index) => (
            <Link key={category.slug} to={category.path} className={`home-category home-category-${index}`}>
              <img src={category.heroImage} alt="" loading="lazy" />
              <span className="home-category-symbol" aria-hidden="true">{category.icon}</span>
              <span className="home-category-copy">
                <small>{String(index + 1).padStart(2, "0")} · {category.items.length} items</small>
                <strong>{category.name}</strong>
                <em>{category.summary}</em>
              </span>
              <span className="home-category-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const featuredTabs = [
  { key: "article", label: "Articles" },
  { key: "trailer", label: "Trailers" },
  { key: "event", label: "Events" },
];

const ROTATE_MS = 6000;

export function FeaturedShowcase() {
  const [tab, setTab] = useState("article");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [playing, setPlaying] = useState(null);
  const items = featuredContent.filter((item) => item.type === tab).slice(0, 7);
  const spotlight = items[active] || items[0];

  useEffect(() => {
    if (paused || items.length < 2) return undefined;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % items.length), ROTATE_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, items.length, tab]);

  const selectTab = (key) => {
    setTab(key);
    setActive(0);
  };

  const open = (item) => (item.type === "trailer" ? setPlaying(item) : null);

  return (
    <section className="home-featured" aria-labelledby="home-featured-title">
      <div className="fv-container">
        <header className="fv-section-head">
          <div>
            <span className="fv-eyebrow">Across every hub</span>
            <h2 id="home-featured-title">Featured this week</h2>
          </div>
          <div className="fv-segmented" role="tablist" aria-label="Featured content type">
            {featuredTabs.map((entry) => (
              <button key={entry.key} type="button" role="tab" aria-selected={tab === entry.key} className={tab === entry.key ? "active" : ""} onClick={() => selectTab(entry.key)}>
                {entry.label}
              </button>
            ))}
          </div>
        </header>

        {spotlight && (
          <div className="home-featured-layout" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <article key={spotlight.uid} className="home-spotlight">
              <img src={spotlight.image} alt="" />
              <div className="home-spotlight-copy">
                <span className="fv-chip">{spotlight.categoryName}</span>
                <h3>{spotlight.title}</h3>
                <p>{spotlight.description}</p>
                <div className="home-spotlight-meta">
                  {spotlight.date && <span><CalendarDays size={14} /> {formatDate(spotlight.date)}</span>}
                  {spotlight.location && <span>{spotlight.location}</span>}
                </div>
                {spotlight.type === "trailer" ? (
                  <button type="button" className="hub-hero-primary" onClick={() => open(spotlight)}>
                    <Play size={16} fill="currentColor" /> Watch trailer
                  </button>
                ) : (
                  <Link className="hub-hero-primary" to={detailPath(spotlight)}>
                    {spotlight.type === "event" ? "Event details" : "Read article"} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
              {!paused && <span className="home-spotlight-progress" key={`${tab}-${active}`} style={{ animationDuration: `${ROTATE_MS}ms` }} />}
            </article>

            <ol className="home-featured-list">
              {items.map((item, index) => (
                <li key={item.uid}>
                  <button type="button" className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-current={index === active}>
                    <img src={item.image} alt="" loading="lazy" />
                    <span>
                      <small>{item.categoryName}</small>
                      <strong>{item.title}</strong>
                    </span>
                  </button>
                </li>
              ))}
              <li className="home-featured-controls">
                <button type="button" className="fv-icon-button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume rotation" : "Pause rotation"}>
                  {paused ? <Play size={15} /> : <Pause size={15} />}
                </button>
                <Link className="fv-link-button" to={spotlight.type === "article" ? "/search?type=article" : spotlight.type === "trailer" ? "/Trailers" : "/releases"}>
                  View all {featuredTabs.find((entry) => entry.key === tab).label.toLowerCase()} →
                </Link>
              </li>
            </ol>
          </div>
        )}
      </div>

      {playing && <MediaModal items={[playing]} index={0} onNavigate={() => {}} onClose={() => setPlaying(null)} />}
    </section>
  );
}

export function HubStrip() {
  const trailers = upcomingReleases.filter((item) => item.type === "trailer").slice(0, 4);
  if (!trailers.length) return null;
  return (
    <section className="home-strip" aria-label="Coming soon">
      <div className="fv-container home-strip-inner">
        <strong>Coming soon</strong>
        {trailers.map((item) => (
          <Link key={item.uid} to={sectionPath(item)}>
            {item.title} <small>{formatDate(item.date)}</small>
          </Link>
        ))}
        <Link to="/releases" className="home-strip-all">Release calendar →</Link>
      </div>
    </section>
  );
}

/* Agenda-style list of the next events across all hubs. */
export function HomeEvents() {
  const events = upcomingReleases.filter((item) => item.type === "event").slice(0, 5);
  if (!events.length) return null;
  return (
    <section className="home-events" aria-labelledby="home-events-title">
      <div className="fv-container home-events-layout">
        <header className="home-events-intro">
          <span className="fv-eyebrow">Meet the community</span>
          <h2 id="home-events-title">Upcoming events</h2>
          <p>Conventions, watch parties, workshops and meetups from every fandom — all in one calendar.</p>
          <div className="fv-actions">
            <Link className="fv-button" to="/releases"><CalendarDays size={16} /> Open calendar</Link>
            <Link className="fv-button-outline" to="/search?type=event&sort=newest">All events</Link>
          </div>
        </header>

        <ol className="home-agenda">
          {events.map((event) => (
            <li key={event.uid}>
              <Link to={detailPath(event)} className="home-agenda-item">
                <time dateTime={event.date}>
                  <strong>{event.date.slice(8, 10)}</strong>
                  <span>{formatDate(event.date, { month: "short" })}</span>
                </time>
                <img src={event.image} alt="" loading="lazy" />
                <span className="home-agenda-copy">
                  <small>{event.categoryName} · {event.kind}</small>
                  <strong>{event.title}</strong>
                  <em><MapPin size={13} /> {event.location}</em>
                </span>
                <span className="home-agenda-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* One lead story plus a list of the latest reads from different hubs. */
export function HomeNews() {
  const picks = categories
    .map((category) => category.items.filter((item) => item.type === "article")[1] || category.items.find((item) => item.type === "article"))
    .filter(Boolean);
  const [lead, ...rest] = picks;
  if (!lead) return null;
  return (
    <section className="home-news" aria-labelledby="home-news-title">
      <div className="fv-container">
        <header className="fv-section-head">
          <div>
            <span className="fv-eyebrow">Fandom pulse</span>
            <h2 id="home-news-title">Latest reads</h2>
            <p>Deep dives, hidden details and explainers from all seven hubs.</p>
          </div>
          <Link className="fv-button-outline" to="/search?type=article">All articles <ArrowRight size={16} /></Link>
        </header>

        <div className="home-news-layout">
          <Link to={detailPath(lead)} className="home-news-lead">
            <img src={lead.image} alt="" loading="lazy" />
            <span className="home-news-lead-copy">
              <span className="fv-chip">{lead.categoryName}</span>
              <strong>{lead.title}</strong>
              <em>{lead.description}</em>
              <small><Clock3 size={13} /> {lead.readTime}</small>
            </span>
          </Link>

          <ul className="home-news-list">
            {rest.slice(0, 5).map((item) => (
              <li key={item.uid}>
                <Link to={detailPath(item)}>
                  <img src={item.image} alt="" loading="lazy" />
                  <span>
                    <small>{item.categoryName} · {item.readTime}</small>
                    <strong>{item.title}</strong>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const perks = [
  [Search, "Search everything", "One search across all hubs and content types.", "/search"],
  [Bookmark, "Save & export", "Bookmark anything, add notes, export your list.", "/bookmarks"],
  [Bot, "Ask Nova", "Our chatbot recommends what to watch, read or play.", null],
  [ShoppingBag, "Fan merch", "Browse collectibles and build a cart.", "/search?type=merchandise"],
];

export function HomeCTA() {
  const total = allContent.length;
  return (
    <section className="home-cta" aria-labelledby="home-cta-title">
      <div className="fv-container home-cta-inner">
        <div className="home-cta-copy">
          <span className="fv-eyebrow">Join the Verse</span>
          <h2 id="home-cta-title">{total}+ stories, characters and collectibles. One home for every fan.</h2>
          <div className="fv-actions">
            <Link className="hh-btn hh-btn-primary" to="/account?mode=signup"><UserPlus size={18} /> Create free profile</Link>
            <Link className="hh-btn hh-btn-ghost" to="/about">About FandomVerse</Link>
          </div>
        </div>
        <ul className="home-perks">
          {perks.map(([Icon, title, text, to]) => (
            <li key={title}>
              <Icon size={20} />
              <strong>{to ? <Link to={to}>{title}</Link> : title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
