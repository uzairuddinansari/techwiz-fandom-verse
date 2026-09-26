import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Play } from "lucide-react";
import { searchPhotos, searchVideos } from "../API/GalleryAPI";
import { setQuery } from "../Redux/feature/SearchSlide";
import { toggleBookmark, useBookmarks } from "../fandom/store";
import MediaModal from "./fandom/MediaModal";
import "../styles/Result.css";
import "../styles/GallerySearch.css";

/* Photo / video results from the local JSON catalog. */
const ResultGrid = () => {
  const dispatch = useDispatch();
  const { query, activetab } = useSelector((store) => store.search);
  const bookmarks = useBookmarks();
  const [openIndex, setOpenIndex] = useState(null);

  const results = activetab === "videos" ? searchVideos(query) : searchPhotos(query);
  const modalItems = results.map((result) => result.item);

  return (
    <>
      <div className="btn_parrent">
        <p className="gallery-count">
          {results.length} {activetab === "videos" ? "video" : "photo"}{results.length === 1 ? "" : "s"}
          {query && <> for “{query}”</>}
        </p>
        {query && (
          <button onClick={() => dispatch(setQuery(""))} id="clear">
            Clear search
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="gallery-status">
          <p className="gallery-error">Nothing matches “{query}”. Try another word, like “naruto” or “trailer”.</p>
        </div>
      ) : (
        <div className="gallery-results">
          {results.map((result, index) => {
            const saved = bookmarks.some((entry) => entry.uid === result.uid);
            return (
              <figure key={result.id} className="gallery-result">
                <button type="button" className="gallery-open" onClick={() => setOpenIndex(index)} aria-label={`Open ${result.title}`}>
                  <img src={result.thumbnail} alt={result.title} className="gallery-media" loading="lazy" />
                  {result.type === "video" && (
                    <span className="gallery-play" aria-hidden="true">
                      <Play size={20} fill="currentColor" />
                    </span>
                  )}
                </button>
                <figcaption>
                  <div>
                    <strong className="des">{result.title}</strong>
                    <small>{result.category}</small>
                  </div>
                  <button
                    type="button"
                    className={`gallery-save ${saved ? "saved" : ""}`}
                    onClick={() => toggleBookmark(result.item)}
                    aria-pressed={saved}
                    aria-label={saved ? `Remove ${result.title} from bookmarks` : `Bookmark ${result.title}`}
                  >
                    <Bookmark size={14} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save"}
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {openIndex !== null && (
        <MediaModal items={modalItems} index={openIndex} onNavigate={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
};

export default ResultGrid;
