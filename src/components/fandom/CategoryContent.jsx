import { useMemo, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { getCategory, getSectionItems, sortItems, typeLabels } from "../../fandom/catalog";
import ContentCard from "./ContentCard";
import MediaModal from "./MediaModal";

const sectionCopy = {
  all: ["Everything in one place", "Browse every article, gallery, video, audio clip, character, event, product and trailer in this hub."],
  articles: ["Featured articles", "Long-form stories, explainers and the details fans missed."],
  gallery: ["Image gallery", "Select any image to open the lightbox, then use the arrows or ← → keys to browse."],
  videos: ["Videos", "Trailers, music videos, cinematics and fan content — press play without leaving the page."],
  audio: ["Audio & podcasts", "Podcast-style episodes and soundtracks from the community."],
  characters: ["Character profiles", "Names, series, biographies and traits of the most iconic characters."],
  events: ["Event highlights", "Conventions, watch parties and meetups — upcoming and past."],
  merchandise: ["Merchandise showcase", "Fan collectibles, apparel and accessories. Open any item to choose an edition and size, then add it to your cart."],
  trailers: ["Trailers", "Upcoming and recently released trailers for this hub."],
};

/* The extra filter each section offers, besides sub-tags. */
const facetFor = (section) =>
  ({
    characters: { key: "franchise", label: "Franchise" },
    merchandise: { key: "franchise", label: "Franchise" },
    trailers: { key: "status", label: "Release status" },
    events: { key: "status", label: "Status" },
    videos: { key: "kind", label: "Content type" },
    audio: { key: "kind", label: "Content type" },
  })[section];

const facetLabel = (value) => (value === "released" ? "Recently released" : value);

export default function CategoryContent({ categorySlug, section = "all" }) {
  const category = getCategory(categorySlug);
  const [type, setType] = useState("all");
  const [tag, setTag] = useState("all");
  const [facet, setFacet] = useState("all");
  const [sort, setSort] = useState("featured");
  const [openIndex, setOpenIndex] = useState(null);

  const items = useMemo(() => getSectionItems(category, section), [category, section]);
  const facetConfig = facetFor(section);
  const facetValues = facetConfig ? [...new Set(items.map((item) => item[facetConfig.key]).filter(Boolean))] : [];
  const typesPresent = section === "all" ? [...new Set(items.map((item) => item.type))] : [];

  const byType = type === "all" ? items : items.filter((item) => item.type === type);
  const tags = [...new Set(byType.flatMap((item) => item.tags || []))].sort();

  const visible = sortItems(
    byType.filter(
      (item) =>
        (tag === "all" || item.tags?.includes(tag)) &&
        (facet === "all" || !facetConfig || item[facetConfig.key] === facet),
    ),
    sort,
  );

  // Items that open in the modal can be browsed within the current filtered list.
  const modalItems = visible.filter((item) => ["gallery", "video", "audio", "trailer"].includes(item.type));
  const openItem = (item) => setOpenIndex(modalItems.findIndex((entry) => entry.uid === item.uid));

  if (!category) return null;
  const [title, intro] = sectionCopy[section] || sectionCopy.all;
  const hasFilters = type !== "all" || tag !== "all" || facet !== "all";

  return (
    <section className="fv-section" aria-labelledby="section-title">
      <div className="fv-container">
        <header className="fv-section-head">
          <div>
            <span className="fv-eyebrow">{category.name} / {section === "all" ? "Overview" : title}</span>
            <h2 id="section-title">{title}</h2>
            <p>{intro}</p>
          </div>
          <p className="fv-count" aria-live="polite">
            <span className="saved-dot" /> {visible.length} {visible.length === 1 ? "item" : "items"}
          </p>
        </header>

        {typesPresent.length > 1 && (
          <div className="fv-type-filter" role="group" aria-label="Filter by content type">
            {["all", ...typesPresent].map((value) => (
              <button
                key={value}
                type="button"
                className={type === value ? "active" : ""}
                aria-pressed={type === value}
                onClick={() => {
                  setType(value);
                  setTag("all");
                }}
              >
                {value === "all" ? "All" : typeLabels[value]}
                <small>{value === "all" ? items.length : items.filter((item) => item.type === value).length}</small>
              </button>
            ))}
          </div>
        )}

        <div className="fv-toolbar">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {facetConfig && facetValues.length > 1 && (
            <label>
              <span>{facetConfig.label}</span>
              <select value={facet} onChange={(event) => setFacet(event.target.value)}>
                <option value="all">All</option>
                {facetValues.map((value) => <option key={value} value={value}>{facetLabel(value)}</option>)}
              </select>
            </label>
          )}
          <label>
            <span>Tag</span>
            <select value={tags.includes(tag) ? tag : "all"} onChange={(event) => setTag(event.target.value)}>
              <option value="all">All tags</option>
              {tags.map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <label>
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured / popular</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </label>
          {hasFilters && (
            <button
              type="button"
              className="fv-clear"
              onClick={() => {
                setType("all");
                setTag("all");
                setFacet("all");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {visible.length ? (
          <div className={`fv-grid ${section === "gallery" ? "fv-grid-gallery" : ""}`}>
            {visible.map((item, index) => <ContentCard key={item.uid} item={item} index={index} onOpen={openItem} />)}
          </div>
        ) : (
          <div className="fv-empty">
            <SearchX size={34} />
            <h3>No matches</h3>
            <p>Try a different tag or clear the filters.</p>
          </div>
        )}
      </div>

      {openIndex !== null && openIndex >= 0 && (
        <MediaModal items={modalItems} index={openIndex} onNavigate={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}

