import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bookmark, CalendarDays, Expand, Headphones, MapPin, Play, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { detailPath, formatDate, formatPrice, typeLabels } from "../../fandom/catalog";
import { toggleBookmark, useBookmarks } from "../../fandom/store";

const opensInModal = ["gallery", "video", "audio", "trailer"];

const actionLabel = {
  article: "Read article",
  character: "View profile",
  event: "Event details",
  gallery: "View image",
  video: "Watch video",
  audio: "Listen now",
  trailer: "Watch trailer",
  merchandise: "View product",
};

export function parseEditorialTitle(rawTitle) {
  if (!rawTitle) return { title: "", subtitle: "" };
  let str = String(rawTitle).trim();
  // Strip trailing artifacts like "Is —", "is -", "—", "-"
  str = str.replace(/\s*(?:is\s*)?[—–-]+\s*$/i, "").trim();

  // Check for separator like " — ", " – ", " - "
  const match = str.match(/^(.+?)\s+(?:[—–]|-)\s+(.+)$/);
  if (match) {
    const title = match[1].replace(/\s*(?:is\s*)?[—–-]+\s*$/i, "").trim();
    const subtitle = match[2].replace(/\s*(?:is\s*)?[—–-]+\s*$/i, "").trim();
    return { title, subtitle };
  }
  return { title: str, subtitle: "" };
}

function CardMeta({ item }) {
  const parts = [item.categoryName];
  if (item.type === "event") parts.push(formatDate(item.date));
  else if (item.duration) parts.push(item.duration);
  else if (item.readTime) parts.push(item.readTime);
  else if (item.date) parts.push(formatDate(item.date));
  if (item.kind && item.type !== "event") parts.push(item.kind);
  return (
    <div className="fv-card-meta">
      {parts.filter(Boolean).map((part, index) => (
        <span key={part + index}>
          {index > 0 && <i aria-hidden="true">•</i>}
          {part}
        </span>
      ))}
    </div>
  );
}

export default function ContentCard({ item, onOpen, index = 0 }) {
  const bookmarks = useBookmarks();
  const saved = bookmarks.some((entry) => entry.uid === item.uid);
  const inModal = opensInModal.includes(item.type);
  const open = () => onOpen?.(item);
  const mediaRef = useRef(null);

  const parsedTitle = parseEditorialTitle(item.title);

  // GSAP smooth hover interaction for card media
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    // Only apply on fine-pointer devices with true hover support, respecting reduced motion
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || prefersReducedMotion) return;

    const img = el.querySelector(".fv-card-image");
    const play = el.querySelector(".fv-card-play");

    const onEnter = () => {
      if (img) {
        gsap.to(img, {
          scale: 1.05,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
      }
      if (play) {
        gsap.to(play, {
          scale: 1.08,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
      }
    };

    const onLeave = () => {
      if (img) {
        gsap.to(img, {
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
      }
      if (play) {
        gsap.to(play, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
          force3D: true,
        });
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (img) gsap.killTweensOf(img);
      if (play) gsap.killTweensOf(play);
    };
  }, []);

  const MediaIcon = item.type === "audio" ? Headphones : item.type === "gallery" ? Expand : item.type === "merchandise" ? ShoppingBag : Play;

  const media = (
    <>
      {item.image ? (
        <img src={item.image} alt="" loading="lazy" className="fv-card-image" />
      ) : (
        <div className="fv-card-image fv-card-image-empty" />
      )}
      {["video", "trailer", "audio", "gallery"].includes(item.type) && (
        <span className="fv-card-play" aria-hidden="true">
          <MediaIcon size={20} fill={item.type === "gallery" ? "none" : "currentColor"} />
        </span>
      )}
    </>
  );

  return (
    <article className={`fv-card fv-card-${item.type} ${saved ? "is-saved" : ""}`} style={{ "--card-delay": `${Math.min(index, 12) * 60}ms` }}>
      <div className="fv-card-media" ref={mediaRef}>
        {inModal ? (
          <button type="button" className="fv-card-media-button" onClick={open} aria-label={`${actionLabel[item.type]}: ${item.title}`}>
            {media}
          </button>
        ) : (
          <Link to={detailPath(item)} className="fv-card-media-button" aria-label={`${actionLabel[item.type]}: ${item.title}`} tabIndex={-1}>
            {media}
          </Link>
        )}

        <span className="fv-chip">{typeLabels[item.type]}</span>
        {item.status && (
          <span className={`fv-status fv-status-${item.status.replace(/\s+/g, "-")}`}>
            {item.status === "released" ? "Recently released" : item.status}
          </span>
        )}

        <button
          type="button"
          className={`fv-save ${saved ? "saved" : ""}`}
          onClick={() => toggleBookmark(item)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${item.title} from bookmarks` : `Bookmark ${item.title}`}
        >
          <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
          <span>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <div className="fv-card-body">
        <CardMeta item={item} />
        <h3 className="fv-card-title">
          {inModal ? (
            <button type="button" onClick={open}>
              <span className="fv-card-title-main">{parsedTitle.title}</span>
              {parsedTitle.subtitle && <span className="fv-card-title-sub">{parsedTitle.subtitle}</span>}
            </button>
          ) : (
            <Link to={detailPath(item)}>
              <span className="fv-card-title-main">{parsedTitle.title}</span>
              {parsedTitle.subtitle && <span className="fv-card-title-sub">{parsedTitle.subtitle}</span>}
            </Link>
          )}
        </h3>
        {item.franchise && item.type !== "article" && item.franchise !== parsedTitle.title && (
          <p className="fv-card-subtitle">{item.franchise}</p>
        )}
        {item.type === "event" && (
          <p className="fv-card-subtitle fv-card-location">
            <MapPin size={13} /> {item.location}
          </p>
        )}
        <p className="fv-card-text">{item.description}</p>

        {item.traits && (
          <ul className="fv-tags" aria-label="Traits">
            {item.traits.map((trait) => <li key={trait}>{trait}</li>)}
          </ul>
        )}

        <div className="fv-card-footer">
          {item.type === "merchandise" ? (
            <>
              <span className="fv-price">
                {formatPrice(item.priceRange[0])} – {formatPrice(item.priceRange[1])}
              </span>
              <Link className="fv-link-button" to={detailPath(item)}>
                View &amp; buy <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : inModal ? (
            <button type="button" className="fv-link-button" onClick={open}>
              {actionLabel[item.type]} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <Link className="fv-link-button" to={detailPath(item)}>
              {actionLabel[item.type]} <span aria-hidden="true">→</span>
            </Link>
          )}
          {item.type === "event" && (
            <span className="fv-card-date">
              <CalendarDays size={13} /> {item.status}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
