import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SearchX } from "lucide-react";
import { allContent, categories, sortItems, typeLabels } from "../fandom/catalog";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import ContentCard from "../components/fandom/ContentCard";
import MediaModal from "../components/fandom/MediaModal";
import "../styles/Fandom.css";

const PAGE_SIZE = 24;

export const CATEGORY_INFO = {
  anime: {
    slug: "anime",
    name: "Anime",
    searchTerm: "anime",
    aliases: ["anime", "animes", "animation", "otaku", "shonen", "shounen", "seinen", "isekai"],
    keywords: [
      "naruto", "naruto uzumaki", "uzumaki", "sasuke", "kakashi", "itachi", "hidden leaf", "hokage",
      "one piece", "luffy", "straw hat", "straw hats", "zoro", "sanji", "nami",
      "dragon ball", "dragon ball z", "dbz", "goku", "vegeta", "super saiyan",
      "demon slayer", "tanjiro", "nezuko", "zenitsu",
      "attack on titan", "aot", "eren", "eren yeager", "levi", "ackerman", "survey corps",
      "my hero academia", "mha", "deku", "all might", "bakugo", "plus ultra",
      "bleach", "ichigo", "soul reaper", "soul reapers", "bankai",
      "jujutsu kaisen", "jjk", "gojo", "satoru gojo", "itadori", "yuji itadori", "sukuna",
      "death note", "kira", "ryuk", "light yagami", "l lawliet",
      "hunter x hunter", "gon", "killua",
      "fullmetal alchemist", "edward elric",
      "spy x family", "anya"
    ],
  },
  gaming: {
    slug: "gaming",
    name: "Gaming",
    searchTerm: "gaming",
    aliases: ["gaming", "game", "games", "gamer", "gamers", "video game", "video games", "esports", "gameplay", "playstation", "xbox", "nintendo"],
    keywords: [
      "elden ring", "tarnished", "malenia", "fromsoftware", "shadow of the erdtree",
      "the witcher", "witcher", "geralt", "geralt of rivia", "ciri",
      "cyberpunk", "cyberpunk 2077", "night city",
      "black myth", "wukong", "black myth wukong", "sun wukong",
      "valorant", "jett", "riot games",
      "gta", "grand theft auto", "gta v", "gta 6", "gta vi",
      "kof", "king of fighters",
      "minecraft", "steve", "creeper",
      "genshin", "genshin impact",
      "god of war", "kratos",
      "dark souls", "bloodborne",
      "zelda", "mario",
      "final fantasy", "resident evil"
    ],
  },
  movies: {
    slug: "movies",
    name: "Movies",
    searchTerm: "movies",
    aliases: ["movie", "movies", "film", "films", "cinema", "cinemas", "blockbuster", "hollywood"],
    keywords: [
      "dune", "paul atreides", "arrakis",
      "interstellar", "inception", "oppenheimer",
      "top gun", "top gun maverick", "maverick",
      "avatar", "pandora",
      "dark knight", "joker",
      "star wars", "lord of the rings", "matrix",
      "jurassic", "titanic", "gladiator"
    ],
  },
  "tv-shows": {
    slug: "tv-shows",
    name: "TV Shows",
    searchTerm: "tv shows",
    aliases: ["tv shows", "tv show", "tv", "television", "series", "tv series", "shows", "show", "season", "episode", "episodes", "netflix", "hbo"],
    keywords: [
      "stranger things", "eleven", "demogorgon", "hawkins",
      "wednesday", "wednesday addams", "nevermore",
      "the last of us", "tlou", "joel", "ellie",
      "the boys", "homelander", "billy butcher",
      "arcane", "jinx", "vi", "piltover",
      "fallout", "lucy maclean", "vault dweller",
      "house of the dragon", "game of thrones", "targaryen",
      "squid game", "breaking bad", "better call saul",
      "peaky blinders", "severance"
    ],
  },
  "k-pop": {
    slug: "k-pop",
    name: "K-Pop",
    searchTerm: "k-pop",
    aliases: ["k-pop", "kpop", "k pops", "kpops", "k pop", "k-pops", "korean pop", "hallyu", "idol", "idols", "comeback", "lightstick"],
    keywords: [
      "bts", "bangtan", "army", "jungkook", "v", "jimin", "suga", "rm", "jin", "j-hope",
      "blackpink", "blink", "jennie", "lisa", "jisoo", "rose",
      "stray kids", "stay", "felix", "bang chan",
      "twice", "once", "nayeon",
      "seventeen", "carat",
      "newjeans", "bunnies", "hanni", "minji",
      "aespa", "karina", "winter",
      "ive", "wonyoung",
      "exo", "nct", "itzy", "enhypen", "txt",
      "ateez", "red velvet", "le sserafim"
    ],
  },
  comics: {
    slug: "comics",
    name: "Comics",
    searchTerm: "comics",
    aliases: ["comics", "comic", "comic book", "comic books", "graphic novel", "graphic novels", "marvel", "dc", "dc comics", "marvel comics"],
    keywords: [
      "batman", "bruce wayne", "gotham", "gotham city",
      "superman", "clark kent", "man of steel",
      "spider-man", "spiderman", "peter parker", "miles morales",
      "iron man", "tony stark",
      "captain america", "steve rogers",
      "justice league", "avengers",
      "invincible", "omni-man",
      "the walking dead",
      "x-men", "wolverine", "deadpool", "thor", "hulk", "flash", "wonder woman"
    ],
  },
  manga: {
    slug: "manga",
    name: "Manga",
    searchTerm: "manga",
    aliases: ["manga", "mangas", "mangaka", "tankobon", "webtoon", "manhwa"],
    keywords: [
      "chainsaw man", "denji", "makima",
      "berserk", "guts",
      "tokyo ghoul", "kaneki",
      "vagabond", "musashi",
      "vinland saga", "thorfinn",
      "one punch man", "saitama",
      "solo leveling", "sung jinwoo",
      "junji ito", "uzumaki manga"
    ],
  },
};

const normalizeForMatch = (text) =>
  String(text || "")
    .toLowerCase()
    .trim();

const cleanString = (text) =>
  normalizeForMatch(text)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const compactString = (text) =>
  normalizeForMatch(text)
    .replace(/[^a-z0-9]/g, "");

export const detectCategory = (input) => {
  if (!input) return null;
  const clean = cleanString(input);
  const compact = compactString(input);
  if (!compact) return null;

  // 1. Exact match against category names and aliases (including kpop / k-pop / k pops)
  for (const [slug, info] of Object.entries(CATEGORY_INFO)) {
    for (const alias of info.aliases) {
      const aliasClean = cleanString(alias);
      const aliasCompact = compactString(alias);
      if (clean === aliasClean || compact === aliasCompact) {
        return slug;
      }
      if (compact.replace(/s$/, "") === aliasCompact.replace(/s$/, "")) {
        return slug;
      }
    }
  }

  // 2. Phrase match within input for category alias
  for (const [slug, info] of Object.entries(CATEGORY_INFO)) {
    for (const alias of info.aliases) {
      const aliasClean = cleanString(alias);
      const regex = new RegExp(`(^|\\s)${aliasClean}(\\s|$)`, "i");
      if (regex.test(clean)) {
        return slug;
      }
      const aliasCompact = compactString(alias);
      if (aliasCompact.length >= 4 && compact.includes(aliasCompact)) {
        return slug;
      }
    }
  }

  // 3. Predefined franchise & character keywords (e.g. naruto -> anime, batman -> comics, bts -> k-pop)
  for (const [slug, info] of Object.entries(CATEGORY_INFO)) {
    for (const kw of info.keywords) {
      const kwClean = cleanString(kw);
      const kwCompact = compactString(kw);
      if (clean === kwClean || compact === kwCompact) {
        return slug;
      }
      if (kwClean.length <= 4) {
        const wordRegex = new RegExp(`(^|\\s)${kwClean}(\\s|$)`, "i");
        if (wordRegex.test(clean)) {
          return slug;
        }
      } else {
        if (clean.includes(kwClean) || (kwCompact.length >= 5 && compact.includes(kwCompact))) {
          return slug;
        }
      }
    }
  }

  // 4. Dynamic catalog match against allContent (franchise, title, tags)
  if (clean.length >= 3) {
    const counts = {};
    for (const item of allContent) {
      if (!item.category) continue;
      const itemHaystack = [item.title, item.franchise, ...(item.tags || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const itemClean = cleanString(itemHaystack);
      if (itemClean.includes(clean)) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    }
    let bestSlug = null;
    let maxCount = 0;
    for (const [catSlug, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        bestSlug = catSlug;
      }
    }
    if (bestSlug && maxCount >= 1) {
      return bestSlug;
    }
  }

  return null;
};

const isCategorySearchTerm = (text, catSlug) => {
  if (!catSlug || catSlug === "all" || !text) return false;
  const info = CATEGORY_INFO[catSlug];
  if (!info) return false;

  const clean = cleanString(text);
  const compact = compactString(text);

  return (
    clean === cleanString(info.searchTerm) ||
    compact === compactString(info.slug) ||
    info.aliases.some(
      (a) =>
        clean === cleanString(a) ||
        compact === compactString(a) ||
        compact.replace(/s$/, "") === compactString(a).replace(/s$/, ""),
    )
  );
};

const matches = (item, words, activeCategory) => {
  if (!words.length) return true;

  // If query is the category name or alias itself, show all items of that category
  const queryPhrase = words.join(" ");
  if (isCategorySearchTerm(queryPhrase, activeCategory) && item.category === activeCategory) {
    return true;
  }

  const rawHaystack = [
    item.title,
    item.description,
    item.categoryName,
    item.franchise,
    item.location,
    item.kind,
    ...(item.tags || []),
    ...(item.traits || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const cleanHaystack = cleanString(rawHaystack);
  const compactHaystack = compactString(rawHaystack);

  return words.every((word) => {
    const wRaw = word.toLowerCase();
    const wClean = cleanString(word);
    const wCompact = compactString(word);

    if (rawHaystack.includes(wRaw)) return true;
    if (wClean && cleanHaystack.includes(wClean)) return true;
    if (wCompact && compactHaystack.includes(wCompact)) return true;

    return false;
  });
};

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const paramCategory = params.get("category");
  const type = params.get("type") || "all";
  const sort = params.get("sort") || "featured";

  // Derive initial effective category:
  // Explicit ?category param has priority if set, otherwise detect from ?q, fallback to "all"
  const initialCategory = useMemo(() => {
    if (paramCategory && paramCategory !== "all") {
      return paramCategory;
    }
    if (query) {
      return detectCategory(query) || "all";
    }
    return "all";
  }, [paramCategory, query]);

  const [draft, setDraft] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState(null);

  // Synchronize draft, category and paging whenever URL params change (e.g. Back/Forward navigation)
  const filterKey = `${query}|${paramCategory || ""}|${type}|${sort}`;
  const [lastKey, setLastKey] = useState(filterKey);
  if (lastKey !== filterKey) {
    setLastKey(filterKey);
    setDraft(query);
    setSelectedCategory(initialCategory);
    setLimit(PAGE_SIZE);
  }

  // Base filtered items matching the current search query and category (before content type filter is applied)
  const baseFiltered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return allContent.filter(
      (item) =>
        (selectedCategory === "all" || item.category === selectedCategory) &&
        matches(item, words, selectedCategory),
    );
  }, [query, selectedCategory]);

  // Set of content types actually present in the current filtered results
  const availableTypes = useMemo(() => {
    return new Set(baseFiltered.map((item) => item.type).filter(Boolean));
  }, [baseFiltered]);

  // Dynamic dropdown options: only show content types present in the current results
  const availableTypeOptions = useMemo(() => {
    return Object.entries(typeLabels).filter(([val]) => availableTypes.has(val));
  }, [availableTypes]);

  // If the active type is no longer valid for the current filtered results, fallback to "all"
  const effectiveType = type !== "all" && availableTypes.has(type) ? type : "all";

  // Automatically clean up invalid type from URL params when filtered results change
  useEffect(() => {
    if (type !== "all" && !availableTypes.has(type)) {
      const next = new URLSearchParams(params);
      next.delete("type");
      setParams(next, { replace: true });
    }
  }, [type, availableTypes, params, setParams]);

  // Combined filtering: category, effective content type, and search words
  const results = useMemo(() => {
    return sortItems(
      baseFiltered.filter((item) => effectiveType === "all" || item.type === effectiveType),
      sort,
    );
  }, [baseFiltered, effectiveType, sort]);

  // Execute a synchronized search (updates q, detected category, and URL)
  const commitSearch = (textToSearch, explicitCategory = null) => {
    const trimmed = textToSearch.trim();
    const detected = explicitCategory || detectCategory(trimmed);
    const catToUse = detected || (trimmed ? (selectedCategory !== "all" ? selectedCategory : "all") : "all");

    setSelectedCategory(catToUse);

    const next = new URLSearchParams(params);

    if (trimmed) {
      next.set("q", trimmed);
    } else {
      next.delete("q");
    }

    if (catToUse && catToUse !== "all") {
      next.set("category", catToUse);
    } else {
      next.delete("category");
    }

    setParams(next, { replace: false });
  };

  // Live input handler: detects category as user types
  const handleInputChange = (event) => {
    const value = event.target.value;
    setDraft(value);

    const detected = detectCategory(value);
    if (detected) {
      setSelectedCategory(detected);
    } else if (!value.trim()) {
      setSelectedCategory("all");
    }
  };

  // Form submit handler
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    commitSearch(draft);
  };

  // Category dropdown handler (Category -> Search synchronization)
  const handleCategoryChange = (newCatSlug) => {
    setSelectedCategory(newCatSlug);

    const next = new URLSearchParams(params);

    if (newCatSlug === "all") {
      next.delete("category");

      // If draft was a category name/alias, clear the search input as well
      const isCatTerm = Object.values(CATEGORY_INFO).some((info) =>
        isCategorySearchTerm(draft, info.slug),
      );

      if (isCatTerm || detectCategory(draft)) {
        setDraft("");
        next.delete("q");
      }
    } else {
      const info = CATEGORY_INFO[newCatSlug];
      const newQuery = info ? info.searchTerm : newCatSlug;
      setDraft(newQuery);
      next.set("category", newCatSlug);
      next.set("q", newQuery);
    }

    setParams(next, { replace: false });
  };

  // Suggestion click handler
  const handleSuggestionClick = (word) => {
    setDraft(word);
    commitSearch(word);
  };

  // Generic filter update for type and sort
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
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
          onSubmit={handleSearchSubmit}
        >
          <Search size={20} aria-hidden="true" />
          <label className="sr-only" htmlFor="global-search">Search FandomVerse</label>
          <input
            id="global-search"
            type="search"
            value={draft}
            onChange={handleInputChange}
            placeholder="Try “Naruto”, “trailer” or “Karachi”…"
            autoComplete="off"
          />
          <button type="submit" className="fv-button">Search</button>
        </form>

        <div className="fv-suggestions" aria-label="Popular searches">
          {suggestions.map((word) => (
            <button key={word} type="button" onClick={() => handleSuggestionClick(word)}>{word}</button>
          ))}
        </div>

        <div className="fv-toolbar fv-toolbar-search">
          <label>
            <span>Category</span>
            <select value={selectedCategory} onChange={(event) => handleCategoryChange(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.name}</option>)}
            </select>
          </label>
          <label>
            <span>Content type</span>
            <select value={effectiveType} onChange={(event) => update("type", event.target.value)}>
              <option value="all">All types</option>
              {availableTypeOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
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
