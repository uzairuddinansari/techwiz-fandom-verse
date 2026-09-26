import knowledge from "../JSON/chatbot.json";
import { allContent, categories, detailPath, sectionPath, sortItems } from "./catalog";
import { readAdminData } from "../admin/adminStore";

export { knowledge };

const categoryWords = {
  anime: ["anime"],
  gaming: ["gaming", "game", "games", "gamer", "esports"],
  movies: ["movie", "movies", "film", "films", "cinema"],
  "tv-shows": ["tv", "tv show", "tv shows", "series", "netflix"],
  "k-pop": ["k-pop", "kpop", "k pop", "idol", "korean"],
  comics: ["comic", "comics", "marvel", "dc"],
  manga: ["manga"],
};

export const hrefFor = (item) => (["article", "character", "event", "merchandise"].includes(item.type) ? detailPath(item) : sectionPath(item));

const pick = (filter, limit = 3) => sortItems(allContent.filter(filter), "featured").slice(0, limit);

const hasWord = (text, word) => new RegExp(`(^|[^a-z])${word.replace(/[-\s]/g, "[-\\s]?")}([^a-z]|$)`).test(text);

/* Rule-based responder: admin answers → categories → interests → FAQ intents → catalog search → fallback. */
export function respond(input) {
  const text = input.toLowerCase().trim();

  // Answers added in the admin panel take priority over everything else.
  const adminAnswer = readAdminData().faqs.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)));
  if (adminAnswer) return { text: adminAnswer.answer, links: adminAnswer.links, source: "Admin answer" };

  const interest = Object.entries(knowledge.interests).find(([name]) => hasWord(text, name));
  const categorySlug = Object.keys(categoryWords).find((slug) => categoryWords[slug].some((word) => hasWord(text, word)));

  if (categorySlug) {
    const category = categories.find((entry) => entry.slug === categorySlug);
    const tags = interest?.[1];
    const items = pick((item) => item.category === categorySlug && item.type !== "gallery" && (!tags || item.tags?.some((tag) => tags.includes(tag))));
    return {
      text: `${category.name}: ${category.summary} Here are a few picks to start with:`,
      items: items.length ? items : pick((item) => item.category === categorySlug),
      links: [{ label: `Open the ${category.name} hub`, to: category.path }],
      source: "Category match",
    };
  }

  if (interest) {
    const [name, tags] = interest;
    return {
      text: `Love ${name}? You might enjoy these:`,
      items: pick((item) => item.type !== "gallery" && item.tags?.some((tag) => tags.includes(tag))),
      links: [{ label: `Search “${name}”`, to: `/search?q=${encodeURIComponent(tags[0])}` }],
      source: "Interest recommendation",
    };
  }

  const intent = knowledge.intents.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)));
  if (intent) {
    const items = intent.show
      ? pick((item) => item.type === intent.show.type && (!intent.show.status || item.status === intent.show.status))
      : [];
    return { text: intent.answer, links: intent.links, items, quickReplies: intent.quickReplies, source: `FAQ: ${intent.id}` };
  }

  const words = text.split(/\s+/).filter((word) => word.length > 2);
  const found = words.length
    ? pick((item) => words.every((word) => `${item.title} ${item.franchise || ""} ${(item.tags || []).join(" ")}`.toLowerCase().includes(word)))
    : [];
  if (found.length) {
    return {
      text: `Here’s what I found for “${input.trim()}”:`,
      items: found,
      links: [{ label: "See all results", to: `/search?q=${encodeURIComponent(input.trim())}` }],
      source: "Catalog search",
    };
  }

  return { text: knowledge.fallback, quickReplies: knowledge.quickReplies.slice(0, 4), source: "Fallback" };
}
