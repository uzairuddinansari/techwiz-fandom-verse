import { allContent } from "../fandom/catalog";

/*
  Local media search for the /Gellery page.
  Everything comes from the pre-populated JSON catalog — no external APIs,
  API keys or databases (SRS: data is read from JSON files only).
*/
const matches = (item, query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const text = [item.title, item.description, item.franchise, item.categoryName, ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return words.every((word) => text.includes(word));
};

export function searchPhotos(query = "") {
  const seen = new Set();
  return allContent
    .filter((item) => item.image && ["gallery", "character", "article"].includes(item.type) && matches(item, query))
    .filter((item) => (seen.has(item.image) ? false : seen.add(item.image)))
    .map((item) => ({
      id: item.uid,
      uid: item.uid,
      type: "photo",
      title: item.title,
      category: item.categoryName,
      src: item.image,
      thumbnail: item.image,
      item,
    }));
}

export function searchVideos(query = "") {
  return allContent
    .filter((item) => (item.video || item.youtube) && ["video", "trailer"].includes(item.type) && matches(item, query))
    .map((item) => ({
      id: item.uid,
      uid: item.uid,
      type: "video",
      title: item.title,
      category: item.categoryName,
      src: item.video || null,
      youtube: item.youtube || null,
      thumbnail: item.image,
      item,
    }));
}
