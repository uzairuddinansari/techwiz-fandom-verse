import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX } from "lucide-react";
import { allContent, categories, sortItems, typeLabels } from "../fandom/catalog";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import ContentCard from "../components/fandom/ContentCard";
import MediaModal from "../components/fandom/MediaModal";
import "../styles/Fandom.css";

const PAGE_SIZE = 24;

const matches = (item, words) => {
  const haystack = [item.title, item.description, item.categoryName, item.franchise, item.location, item.kind, ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return words.every((word) => haystack.includes(word));
};

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const category = params.get("category") || "all";
  const type = params.get("type") || "all";
  const sort = params.get("sort") || "featured";
  const [draft, setDraft] = useState(query);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState(null);

  // Reset the input and paging whenever the URL filters change (derived state, no effect needed).
  const filterKey = `${query}|${category}|${type}`;
  const [lastKey, setLastKey] = useState(filterKey);
  if (lastKey !== filterKey) {
    setLastKey(filterKey);
    setDraft(query);
    setLimit(PAGE_SIZE);
  }

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return sortItems(
      allContent.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          (type === "all" || item.type === type) &&
          matches(item, words),
      ),
      sort,
    );
  }, [query, category, type, sort]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: key !== "q" });
  };

  const shown = results.slice(0, limit);
  const modalItems = shown.filter((item) => ["gallery", "video", "audio", "trailer"].includes(item.type));
  const suggestions = ["naruto", "batman", "trailer", "k-pop", "cosplay", "elden ring", "plushie"];

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Search" }]} />
        <header className="fv-page-hero">
          <span className="fv-eyebrow">Global discovery</span>
          <h1>Search every fandom.</h1>
          <p>Find articles, characters, trailers, events and merchandise across all seven hubs.</p>
        </header>

        <form
          className="fv-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            update("q", draft.trim());
          }}
        >
          <Search size={20} aria-hidden="true" />
          <label className="sr-only" htmlFor="global-search">Search FandomVerse</label>
          <input
            id="global-search"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Try “Naruto”, “trailer” or “Karachi”…"
            autoComplete="off"
          />
          <button type="submit" className="fv-button">Search</button>
        </form>

        <div className="fv-suggestions" aria-label="Popular searches">
          {suggestions.map((word) => (
            <button key={word} type="button" onClick={() => update("q", word)}>{word}</button>
          ))}
        </div>

        <div className="fv-toolbar fv-toolbar-search">
          <label>
            <span>Category</span>
            <select value={category} onChange={(event) => update("category", event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
            </select>
          </label>
          <label>
            <span>Content type</span>
            <select value={type} onChange={(event) => update("type", event.target.value)}>
              <option value="all">All types</option>
              {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            <span>Sort by</span>
            <select value={sort} onChange={(event) => update("sort", event.target.value)}>
              <option value="featured">Featured / popular</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </label>
          <p className="fv-count" aria-live="polite">
            <span className="saved-dot" /> {results.length} results{query && <> for “{query}”</>}
          </p>
        </div>

        {shown.length ? (
          <div className="fv-grid">
            {shown.map((item, index) => (
              <ContentCard
                key={item.uid}
                item={item}
                index={index % PAGE_SIZE}
                onOpen={(value) => setOpenIndex(modalItems.findIndex((entry) => entry.uid === value.uid))}
              />
            ))}
          </div>
        ) : (
          <div className="fv-empty">
            <SearchX size={34} />
            <h2>No results</h2>
            <p>Check the spelling or remove a filter.</p>
          </div>
        )}

        {results.length > limit && (
          <div className="fv-center">
            <button type="button" className="fv-button-outline" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              Show more ({results.length - limit} left)
            </button>
          </div>
        )}
      </div>

      {openIndex !== null && openIndex >= 0 && (
        <MediaModal items={modalItems} index={openIndex} onNavigate={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </main>
  );
}
