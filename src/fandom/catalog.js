import catalogData from "../JSON/fandomCatalog.json";
import animeArticles from "../JSON/articleGrid.json";
import gamingArticles from "../JSON/Game/GameArticle.json";
import movieArticles from "../JSON/Movie/Movie_article.json";
import tvArticles from "../JSON/TV_Shows/TV_Shows_article.json";
import kpopArticles from "../JSON/K_pop/K_pop_article.json";
import comicsArticles from "../JSON/Comics/Comics.json";
import mangaArticles from "../JSON/Manga/Manga.json";
import { readAdminData } from "../admin/adminStore";

/*
  Every image, video and audio file in src/assets is bundled here once.
  JSON files refer to media by their path inside src/assets
  (for example "Game_Article/ELDEN RING.png"), and resolveMedia() turns
  that path into the final URL. Remote URLs are passed through unchanged.
*/
const assetFiles = import.meta.glob(
  "../assets/**/*.{png,jpg,jpeg,webp,avif,jfif,gif,mp4}",
  { eager: true, import: "default" },
);

export const resolveMedia = (path) => {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const url = assetFiles[`../assets/${path}`];
  if (!url && import.meta.env.DEV) console.warn(`Missing media file: ${path}`);
  return url || null;
};

/* Every bundled image, for the admin panel's image picker. */
export const assetImages = Object.entries(assetFiles)
  .filter(([key]) => !key.endsWith(".mp4"))
  .map(([key, url]) => ({ path: key.replace("../assets/", ""), url }))
  .sort((a, b) => a.path.localeCompare(b.path));

export const youtubeThumb =(id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* Accepts "2026-09-24", "Sep 24, 2026", "November 19, 2026" and bare years. */
const toIsoDate = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
};

const today = new Date().toISOString().slice(0, 10);

export const typeLabels = {
  article: "Article",
  gallery: "Gallery",
  video: "Video",
  audio: "Audio",
  character: "Character",
  event: "Event",
  merchandise: "Merchandise",
  trailer: "Trailer",
};

export const sections = [
  { key: "all", label: "Overview", path: "" },
  { key: "articles", label: "Articles", path: "articles", type: "article" },
  { key: "gallery", label: "Gallery", path: "gallery", type: "gallery" },
  { key: "videos", label: "Videos", path: "videos", type: "video" },
  { key: "audio", label: "Audio", path: "audio", type: "audio" },
  { key: "characters", label: "Characters", path: "characters", type: "character" },
  { key: "events", label: "Events", path: "events", type: "event" },
  { key: "merchandise", label: "Merch", path: "merch", type: "merchandise" },
  { key: "trailers", label: "Trailers", path: "trailers", type: "trailer" },
];

export const sectionForType = (type) => sections.find((section) => section.type === type);

const legacyArticles = {
  anime: animeArticles,
  gaming: gamingArticles.games,
  movies: movieArticles.movies,
  "tv-shows": tvArticles.tvShows,
  "k-pop": kpopArticles.kpop,
  comics: comicsArticles.comics,
  manga: mangaArticles.manga,
};

/* Category-specific paragraphs used to build the long-form article read view. */
const articleVoice = {
  anime: [
    "Fans often point to the characters first: their flaws, their training arcs and the friendships that carry them through impossible battles. Each rewatch reveals small visual details — a colour choice, a background cameo, a musical cue — that quietly foreshadow what is coming.",
    "The community keeps the story alive between seasons through fan art, theory threads, cosplay and watch parties. If you are new, start with the first arc, avoid spoiler-heavy clips, and let the pacing build the way the creators intended.",
  ],
  gaming: [
    "What makes it memorable is how the mechanics and the world support each other. Exploration, combat and progression are tuned so that every session feels like a small story of its own, whether you play solo or with friends.",
    "Look closely and you will find environmental storytelling everywhere: item descriptions, background characters and hidden areas that reward curiosity. The community has spent years mapping secrets, speedrun routes and challenge builds.",
  ],
  movies: [
    "Beyond the headline moments, the film rewards attention to craft — production design, sound mixing and editing choices that shape how each scene feels. Rewatching with that in mind reveals just how deliberate every frame is.",
    "Fans continue to debate its themes, its ending and its place in the wider genre. Whether you are watching for the first time or the tenth, it is worth pausing on the quieter scenes that set up the big payoffs.",
  ],
  "tv-shows": [
    "Long-form television gives characters room to breathe, and this series uses that space brilliantly. Relationships evolve across episodes, and small moments early on often pay off seasons later.",
    "Much of the fun is shared: weekly theories, reaction videos and watch parties. If you are catching up, try to avoid social feeds until you have finished the latest episode — the twists are worth experiencing fresh.",
  ],
  "k-pop": [
    "The group's success comes from a mix of music, performance and connection with fans. Every comeback is carefully planned, from concept photos and teasers to choreography that is designed to be learned and shared.",
    "Fandom culture plays a huge role too — streaming parties, fan chants, lightstick oceans at concerts and translations that help international fans follow along. It is a global community built one song at a time.",
  ],
  comics: [
    "Decades of storytelling mean there is a version of this hero for every reader. Classic runs established the core mythology, while modern writers and artists keep reinventing the character for new generations.",
    "If you are just starting, pick a self-contained story arc or a collected edition rather than diving into ongoing continuity. Screen adaptations are a great gateway, but the panels still hold the richest details.",
  ],
  manga: [
    "Reading the original manga shows the creator's intent in its purest form: panel layout, inking and pacing that anime adaptations sometimes change. Many fans find that the page-turn reveals hit even harder in print.",
    "Collected volumes include author notes, sketches and bonus chapters that add depth to the world. Supporting official releases helps creators keep telling the stories fans love.",
  ],
};

const articleFacts = (article) =>
  [
    ["Genre", article.genre || article.category],
    ["Release", article.releaseDate],
    ["Rating", article.rating],
    ["Seasons", article.seasons],
    ["Volumes", article.volumes],
    ["Duration", article.duration],
    ["Version", article.currentVersion],
    ["Read time", article.readTime],
  ].filter(([, value]) => value);

const buildArticles = (category) =>
  (legacyArticles[category.slug] || []).map((article, index) => {
    const title = article.articleTitle || article.title;
    const franchise = article.animeName || article.title;
    const genreTags = String(article.genre || article.category || "")
      .split(/[/,]/)
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag && tag !== category.name.toLowerCase());
    return {
      id: String(article.id),
      type: "article",
      title,
      franchise,
      description: article.description,
      image: resolveMedia(article.image),
      date: toIsoDate(article.date) || toIsoDate(article.releaseDate),
      author: article.author || "FandomVerse Editorial",
      readTime: article.readTime || `${5 + (index % 4)} min read`,
      facts: articleFacts(article),
      body: [article.description, ...(articleVoice[category.slug] || [])],
      tags: [...new Set([franchise.toLowerCase(), ...genreTags])],
      popularity: 100 - index * 4,
      featured: index < 2,
    };
  });

const buildSection = (category, key) => {
  const list = category[key] || [];
  switch (key) {
    case "gallery":
      return list.map((item, index) => ({
        id: slugify(item.title),
        type: "gallery",
        title: item.title,
        description: `${item.title} — from the ${category.name} image gallery.`,
        image: resolveMedia(item.image),
        tags: item.tags,
        popularity: 80 - index * 2,
      }));
    case "videos":
      return list.map((item, index) => ({
        id: slugify(item.title),
        type: "video",
        kind: item.kind,
        title: item.title,
        description: item.description,
        image: resolveMedia(item.poster) || (item.youtube && youtubeThumb(item.youtube)),
        youtube: item.youtube,
        video: resolveMedia(item.video),
        date: item.date,
        tags: [item.kind],
        popularity: 88 - index * 3,
      }));
    case "audio":
      return list.map((item, index) => ({
        id: slugify(item.title),
        type: "audio",
        kind: item.kind,
        title: item.title,
        description: item.description,
        image: resolveMedia(item.cover),
        audio: resolveMedia(item.src),
        duration: item.duration,
        date: item.date,
        tags: [item.kind],
        popularity: 76 - index * 3,
      }));
    case "characters":
      return list.map((item, index) => ({
        id: slugify(item.name),
        type: "character",
        title: item.name,
        franchise: item.franchise,
        description: item.bio,
        image: resolveMedia(item.image),
        traits: item.traits,
        tags: [item.franchise.toLowerCase(), ...item.traits],
        popularity: 90 - index * 2,
      }));
    case "events":
      return list.map((item, index) => ({
        id: slugify(item.title),
        type: "event",
        kind: item.kind,
        title: item.title,
        description: item.description,
        image: resolveMedia(item.image),
        date: item.date,
        location: item.location,
        status: item.date >= today ? "upcoming" : "past",
        tags: [item.kind, item.date >= today ? "upcoming" : "past"],
        popularity: 86 - index * 3,
        featured: index === 0,
      }));
    case "merchandise":
      return list.map((item, index) => ({
        id: slugify(item.name),
        type: "merchandise",
        kind: item.kind,
        title: item.name,
        franchise: item.franchise,
        description: item.description,
        image: resolveMedia(item.image),
        price: item.price[0],
        priceRange: item.price,
        tags: [item.kind, item.franchise.toLowerCase()],
        popularity: 82 - index * 3,
      }));
    case "trailers":
      return list.map((item, index) => ({
        id: slugify(item.title),
        type: "trailer",
        title: item.title,
        description: item.description,
        image: resolveMedia(item.poster) || (item.youtube && youtubeThumb(item.youtube)),
        youtube: item.youtube,
        video: resolveMedia(item.video),
        date: item.date,
        status: item.status,
        tags: [item.status === "upcoming" ? "upcoming" : "recently released"],
        popularity: 94 - index * 3,
        featured: index === 0,
      }));
    default:
      return [];
  }
};

const sectionKeys = ["gallery", "videos", "audio", "characters", "events", "merchandise", "trailers"];

/* Items as they ship in the JSON files, before any admin changes. */
export const baseCategories = catalogData.categories.map((category) => ({
  ...category,
  heroImage: resolveMedia(category.heroImage),
  items: [
    ...buildArticles(category),
    ...sectionKeys.flatMap((key) => buildSection(category, key)),
  ].map((item) => ({
    ...item,
    uid: `${category.slug}:${item.type}:${item.id}`,
    category: category.slug,
    categoryName: category.name,
    categoryPath: category.path,
  })),
}));

/* Turns an item created in the admin panel into the same shape as catalog items. */
export const normalizeCustomItem = (item) => {
  const category = baseCategories.find((entry) => entry.slug === item.category);
  const price = Number(item.price) || 0;
  const deluxe = Number(item.priceMax) || price;
  const status =
    item.type === "event" ? (item.date >= today ? "upcoming" : "past") : item.type === "trailer" ? item.status || "upcoming" : undefined;
  return {
    ...item,
    image: resolveMedia(item.image) || item.image || null,
    video: resolveMedia(item.video) || item.video || undefined,
    audio: resolveMedia(item.audio) || item.audio || undefined,
    categoryName: category?.name || item.category,
    categoryPath: category?.path || "/",
    traits: item.traits?.length ? item.traits : undefined,
    status,
    price: item.type === "merchandise" ? price : undefined,
    priceRange: item.type === "merchandise" ? [price, Math.max(price, deluxe)] : undefined,
    body: item.type === "article" ? String(item.body || item.description).split(/\n\s*\n/) : undefined,
    tags: [...new Set([...(item.tags || []), item.franchise?.toLowerCase(), item.kind, status].filter(Boolean))],
    popularity: Number(item.popularity) || 95,
    custom: true,
  };
};

/* Applies admin overrides and custom items. Hidden items stay in the list, flagged, for the admin views. */
export const applyAdminData = (categoryList, adminData) =>
  categoryList.map((category) => ({
    ...category,
    items: [
      ...adminData.items.filter((item) => item.category === category.slug).map(normalizeCustomItem),
      ...category.items,
    ].map((item) => (adminData.overrides[item.uid] ? { ...item, ...adminData.overrides[item.uid] } : item)),
  }));

export const categories = applyAdminData(baseCategories, readAdminData()).map((category) => ({
  ...category,
  items: category.items.filter((item) => !item.hidden),
}));

export const getCategory = (slug) => categories.find((category) => category.slug === slug);

export const allContent = categories.flatMap((category) => category.items);

export const getSectionItems = (category, sectionKey) => {
  if (!category) return [];
  const section = sections.find((entry) => entry.key === sectionKey);
  if (!section || !section.type) return category.items;
  return category.items.filter((item) => item.type === section.type);
};

export const findContent = (categorySlug, type, id) =>
  getCategory(categorySlug)?.items.find((item) => item.type === type && item.id === id);

/* Items that share a franchise or tag with `item`, most relevant first. */
export const relatedContent = (item, limit = 4) => {
  const itemTags = new Set(item.tags || []);
  return allContent
    .filter((entry) => entry.uid !== item.uid)
    .map((entry) => {
      let score = 0;
      if (entry.category === item.category) score += 1;
      if (item.franchise && entry.franchise === item.franchise) score += 4;
      if (entry.title.toLowerCase().includes((item.franchise || item.title).toLowerCase())) score += 3;
      score += (entry.tags || []).filter((tag) => itemTags.has(tag)).length * 2;
      return { entry, score };
    })
    .filter(({ score }) => score > 1)
    .sort((a, b) => b.score - a.score || b.entry.popularity - a.entry.popularity)
    .slice(0, limit)
    .map(({ entry }) => entry);
};

// Merchandise has its own product pages in the shop.
export const detailPath = (item) =>
  item.type === "merchandise" ? `/shop/${item.category}/${item.id}` : `/detail/${item.category}/${item.type}/${item.id}`;

export const sectionPath = (item) => {
  if (item.category === "trailers") return "/Trailers";
  const section = sectionForType(item.type);
  return `${item.categoryPath}${section?.path ? `/${section.path}` : ""}`;
};

export const upcomingReleases = allContent
  .filter((item) => (item.type === "trailer" && item.status === "upcoming") || (item.type === "event" && item.status === "upcoming"))
  .sort((a, b) => a.date.localeCompare(b.date));

export const featuredContent = allContent
  .filter((item) => item.featured)
  .sort((a, b) => b.popularity - a.popularity);

export const sortItems = (items, sort) =>
  [...items].sort((a, b) => {
    if (sort === "az") return a.title.localeCompare(b.title);
    if (sort === "za") return b.title.localeCompare(a.title);
    if (sort === "newest") return (b.date || "").localeCompare(a.date || "");
    if (sort === "oldest") return (a.date || "9999").localeCompare(b.date || "9999");
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.popularity - a.popularity;
  });

export const formatDate = (iso, options = { day: "numeric", month: "short", year: "numeric" }) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", options) : "";

export const formatPrice = (value) => `$${Number(value).toFixed(2)}`;
