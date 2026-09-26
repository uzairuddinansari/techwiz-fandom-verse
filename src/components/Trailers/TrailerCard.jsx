import { useEffect, useState } from "react";
import { categories } from "../../fandom/catalog";
import { toggleBookmark, useBookmarks } from "../../fandom/store";

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Shape a trailers.json entry like a catalog item so it can live in the shared bookmarks. */
const asBookmark = (trailer) => {
  const category = categories.find((entry) => entry.name.toLowerCase() === trailer.category.toLowerCase());
  return {
    uid: `trailers:trailer:${slugify(trailer.title)}`,
    id: slugify(trailer.title),
    type: "trailer",
    title: `${trailer.title} — ${trailer.subtitle}`,
    description: trailer.description,
    image: trailer.poster,
    category: category?.slug || "trailers",
    categoryName: category?.name || trailer.category,
    categoryPath: category ? `${category.path}` : "/Trailers",
  };
};

export default function TrailerCard({ trailer, type = "Trailer" }) {
  const [isOpen, setIsOpen] = useState(false);
  const bookmark = asBookmark(trailer);
  const saved = useBookmarks().some((entry) => entry.uid === bookmark.uid);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSaveTrailer = () => toggleBookmark(bookmark);

  return (
    <>
      <article className="trailer-card">
        <div className="trailer-media">
          <img
            src={trailer.poster}
            alt={trailer.title}
            loading="lazy"
          />

          <span className="trailer-type">
            {type}
          </span>

          <button
            className="trailer-play"
            onClick={() => setIsOpen(true)}
            aria-label={`Play ${trailer.title}`}
          >
            ▶
          </button>

          <button
            className={`trailer-favorite ${
              saved ? "saved" : ""
            }`}
            onClick={handleSaveTrailer}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${trailer.title} from bookmarks` : `Bookmark ${trailer.title}`}
          >
            {saved ? "Saved" : "☆"}
          </button>
        </div>

        <div className="trailer-content">
          <h2>{trailer.title} — Trailer</h2>

          <p>{trailer.description}</p>

          <div className="trailer-tags">
            <span>{trailer.category}</span>
            <span>{type}</span>
          </div>
        </div>
      </article>

      {isOpen && (
        <div className="trailer-drawer">
          <div
            className="trailer-drawer-backdrop"
            onClick={() => setIsOpen(false)}
          />

          <div className="trailer-video-panel">
            <button
              className="trailer-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close video"
            >
              ×
            </button>

            <div className="trailer-video-wrapper">
              <video
                src={trailer.videoSrc}
                controls
                autoPlay
                playsInline
              />
            </div>

            <div className="trailer-video-info">
              <span>{trailer.category}</span>

              <h2>{trailer.title}</h2>

              <p>{trailer.subtitle}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}