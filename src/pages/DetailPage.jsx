import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, CalendarDays, Clock3, MapPin, Share2 } from "lucide-react";
import { findContent, formatDate, relatedContent, sectionForType, sectionPath, typeLabels } from "../fandom/catalog";
import { toggleBookmark, useBookmarks } from "../fandom/store";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import ContentCard from "../components/fandom/ContentCard";
import MediaModal from "../components/fandom/MediaModal";
import "../styles/Fandom.css";

function Facts({ item }) {
  const rows = [
    ...(item.facts || []),
    item.franchise && item.type !== "article" && [item.type === "character" && item.category === "k-pop" ? "Agency" : "Series", item.franchise],
    item.type === "event" && ["Date", formatDate(item.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })],
    item.location && ["Location", item.location],
    item.kind && ["Type", item.kind],
    item.status && ["Status", item.status],
  ].filter(Boolean);
  if (!rows.length) return null;
  return (
    <dl className="fv-facts">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DetailPage() {
  const { category, type, id } = useParams();
  const item = findContent(category, type, id);
  const bookmarks = useBookmarks();
  const [openIndex, setOpenIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!item) {
    return (
      <main className="fv-page">
        <div className="fv-container fv-empty">
          <h1>Content not found</h1>
          <p>The item may have moved. Try searching for it instead.</p>
          <Link className="fv-button" to="/search">Search FandomVerse</Link>
        </div>
      </main>
    );
  }

  const saved = bookmarks.some((entry) => entry.uid === item.uid);
  const related = relatedContent(item, 4);
  const modalItems = related.filter((entry) => ["gallery", "video", "audio", "trailer"].includes(entry.type));
  const section = sectionForType(item.type);
  const body = item.body || [item.description];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="fv-page fv-detail-page">
      <div className="fv-container">
        <Breadcrumbs
          trail={[
            { label: item.categoryName, to: item.categoryPath },
            { label: section.label, to: sectionPath(item) },
            { label: item.title },
          ]}
        />

        <article className={`fv-detail fv-detail-${item.type}`}>
          <figure className="fv-detail-media">
            <img src={item.image} alt={item.title} />
          </figure>

          <div className="fv-detail-copy">
            <span className="fv-eyebrow">{item.categoryName} / {typeLabels[item.type]}</span>
            <h1>{item.title}</h1>
            <div className="fv-detail-meta">
              {item.author && <span>By {item.author}</span>}
              {item.readTime && <span><Clock3 size={14} /> {item.readTime}</span>}
              {item.date && item.type !== "event" && <span><CalendarDays size={14} /> {formatDate(item.date)}</span>}
              {item.location && <span><MapPin size={14} /> {item.location}</span>}
            </div>

            {item.traits && (
              <ul className="fv-tags fv-tags-large" aria-label="Traits">
                {item.traits.map((trait) => <li key={trait}>{trait}</li>)}
              </ul>
            )}

            <div className="fv-prose">
              {body.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "lead" : ""}>{paragraph}</p>
              ))}
              {item.type === "character" && (
                <p>
                  {item.title} remains one of the most recognisable faces of {item.franchise}. Explore the {item.categoryName} hub for
                  more characters, fan art and merchandise inspired by this {item.category === "k-pop" ? "group" : "character"}.
                </p>
              )}
              {item.type === "event" && (
                <p>
                  Entry is free for FandomVerse members. Arrive early for the best spots, and check the event page on the day for any
                  schedule updates. All ages are welcome unless stated otherwise.
                </p>
              )}
            </div>

            <Facts item={item} />

            {item.type === "event" && (
              <a
                className="fv-map-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin size={16} /> View venue on Google Maps
              </a>
            )}

            <div className="fv-detail-actions">
              <button type="button" className={`fv-button ${saved ? "is-active" : ""}`} onClick={() => toggleBookmark(item)} aria-pressed={saved}>
                <Bookmark size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Bookmarked" : "Bookmark"}
              </button>
              <button type="button" className="fv-button-outline" onClick={share}>
                <Share2 size={16} /> {copied ? "Link copied" : "Copy link"}
              </button>
              <Link className="fv-button-outline" to={sectionPath(item)}>
                <ArrowLeft size={16} /> Back to {section.label.toLowerCase()}
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="fv-related" aria-labelledby="related-title">
            <div className="fv-section-head">
              <div>
                <span className="fv-eyebrow">Keep exploring</span>
                <h2 id="related-title">Related content</h2>
              </div>
            </div>
            <div className="fv-grid">
              {related.map((entry, index) => (
                <ContentCard
                  key={entry.uid}
                  item={entry}
                  index={index}
                  onOpen={(value) => setOpenIndex(modalItems.findIndex((candidate) => candidate.uid === value.uid))}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {openIndex !== null && openIndex >= 0 && (
        <MediaModal items={modalItems} index={openIndex} onNavigate={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </main>
  );
}
