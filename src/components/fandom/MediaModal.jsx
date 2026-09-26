import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, ChevronLeft, ChevronRight, ShoppingBag, X } from "lucide-react";
import { formatDate, formatPrice, sectionForType, sectionPath, typeLabels } from "../../fandom/catalog";
import { addToCart, toggleBookmark, useBookmarks } from "../../fandom/store";

function Player({ item }) {
  if (item.youtube) {
    return (
      <div className="fv-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.youtube}?autoplay=1&rel=0`}
          title={item.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="fv-player">
      <video src={item.video} poster={item.image || undefined} controls autoPlay playsInline>
        Your browser does not support embedded video.
      </video>
    </div>
  );
}

function AudioPlayer({ item }) {
  return (
    <div className="fv-audio">
      <img src={item.image} alt="" />
      <div>
        <span className="fv-eyebrow">{item.kind} · {item.duration}</span>
        <audio src={item.audio} controls autoPlay preload="metadata">
          Your browser does not support embedded audio.
        </audio>
      </div>
    </div>
  );
}

function ProductPanel({ item }) {
  const [edition, setEdition] = useState("Standard");
  const [added, setAdded] = useState(false);
  const price = edition === "Deluxe" ? item.priceRange[1] : item.priceRange[0];
  return (
    <div className="fv-product">
      <fieldset>
        <legend>Choose edition</legend>
        {[
          ["Standard", item.priceRange[0]],
          ["Deluxe", item.priceRange[1]],
        ].map(([name, value]) => (
          <label key={name} className={edition === name ? "active" : ""}>
            <input type="radio" name="edition" value={name} checked={edition === name} onChange={() => setEdition(name)} />
            <span>{name}</span>
            <strong>{formatPrice(value)}</strong>
          </label>
        ))}
      </fieldset>
      <button
        type="button"
        className="fv-button"
        onClick={() => {
          addToCart(item, edition);
          setAdded(true);
        }}
      >
        <ShoppingBag size={17} /> Add to cart · {formatPrice(price)}
      </button>
      {added && <p className="fv-note" role="status">Added to your cart.</p>}
      <small className="fv-muted">Demo shop: checkout saves an order to your profile — no payment is taken.</small>
    </div>
  );
}

/*
  One modal for every media type. `items` is the list currently on screen, so
  the gallery lightbox (and videos) can be browsed with the arrows or ← → keys.
*/
export default function MediaModal({ items, index, onClose, onNavigate }) {
  const item = items[index];
  const closeRef = useRef(null);
  const bookmarks = useBookmarks();
  const saved = bookmarks.some((entry) => entry.uid === item.uid);
  const canBrowse = items.length > 1;

  useEffect(() => {
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (!canBrowse) return;
      if (event.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, canBrowse, onClose, onNavigate]);

  const isPlayable = item.type === "video" || item.type === "trailer";

  return (
    <div className="fv-modal-backdrop" onMouseDown={onClose}>
      <div
        className={`fv-modal fv-modal-${item.type}`}
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="fv-modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="fv-modal-stage">
          {isPlayable ? (
            <Player key={item.uid} item={item} />
          ) : item.type === "audio" ? (
            <AudioPlayer key={item.uid} item={item} />
          ) : (
            <img key={item.uid} src={item.image} alt={item.title} className="fv-modal-image" />
          )}

          {canBrowse && (
            <>
              <button type="button" className="fv-modal-nav prev" onClick={() => onNavigate((index - 1 + items.length) % items.length)} aria-label="Previous item">
                <ChevronLeft />
              </button>
              <button type="button" className="fv-modal-nav next" onClick={() => onNavigate((index + 1) % items.length)} aria-label="Next item">
                <ChevronRight />
              </button>
            </>
          )}
        </div>

        <div className="fv-modal-copy">
          <span className="fv-eyebrow">
            {item.categoryName} / {typeLabels[item.type]}
            {canBrowse && ` · ${index + 1} of ${items.length}`}
          </span>
          <h2>{item.title}</h2>
          {item.franchise && <p className="fv-card-subtitle">{item.franchise}</p>}
          {item.date && <p className="fv-muted">{item.status === "upcoming" ? "Releases" : "Published"} {formatDate(item.date)}</p>}
          <p>{item.description}</p>
          {item.type === "merchandise" && <ProductPanel key={item.uid} item={item} />}
          <div className="fv-modal-actions">
            <button type="button" className={`fv-button-outline ${saved ? "active" : ""}`} onClick={() => toggleBookmark(item)} aria-pressed={saved}>
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} /> {saved ? "Bookmarked" : "Bookmark"}
            </button>
            <Link className="fv-button-outline" to={sectionPath(item)} onClick={onClose}>
              All {item.categoryName} {sectionForType(item.type)?.label.toLowerCase()}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
