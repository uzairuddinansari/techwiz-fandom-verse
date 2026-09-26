import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Search } from "lucide-react";
import "../styles/HomeHero.css";
import Anime from "../assets/HERO/Anime.jpeg";
import Games from "../assets/HERO/Games.jpeg";
import K_pop from "../assets/HERO/K_pop.jpeg";
import Comics from "../assets/Comics_hero/Comics_hero.jpeg";
import Manga from "../assets/Comics_hero/Comics_hero4.jpeg";

const AUTOPLAY_MS = 6500;

const slides = [
  {
    name: "Anime",
    eyebrow: "Explore · Anime",
    title: "Inside the World of Anime",
    description: "Legendary shonen battles, unforgettable heroes and the stories that continue to shape the fandom.",
    image: Anime,
    link: "/Anime",
    symbol: "ア",
  },
  {
    name: "Gaming",
    eyebrow: "Discover · Gaming",
    title: "Enter the Gaming Universe",
    description: "Open worlds, fighting legends, competitive arenas and everything happening in games right now.",
    image: Games,
    link: "/Gaming",
    symbol: "遊",
  },
  {
    name: "Movies",
    eyebrow: "Featured · Movies",
    title: "Stories Beyond the Screen",
    description: "Cinematic universes, iconic characters and the hidden details you missed on the big screen.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    link: "/Movies",
    symbol: "映",
  },
  {
    name: "TV Shows",
    eyebrow: "Popular · TV Shows",
    title: "Your Next Series Awaits",
    description: "Binge-worthy shows, cliffhangers and the characters that keep fans pressing “next episode”.",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1600&q=80",
    link: "/TV_Shows",
    symbol: "視",
  },
  {
    name: "K-Pop",
    eyebrow: "Trending · K-Pop",
    title: "Feel the K-Pop Universe",
    description: "Chart-topping groups, iconic music videos, comebacks and the fandoms that power them.",
    image: K_pop,
    link: "/K_Pop",
    symbol: "音",
  },
  {
    name: "Comics",
    eyebrow: "Explore · Comics",
    title: "Stories Told in Panels",
    description: "Marvel and DC legends, classic strips and original heroes — decades of stories in one place.",
    image: Comics,
    link: "/Comics",
    symbol: "漫",
  },
  {
    name: "Manga",
    eyebrow: "Discover · Manga",
    title: "Turn the Next Page",
    description: "Ink, panels and legendary arcs from the creators that inspired generations of fans.",
    image: Manga,
    link: "/Manga",
    symbol: "書",
  },
];

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/*
  Home hero: blurred full-bleed backdrop + crisp poster card (the local art is
  small, so it is never stretched full-screen), a hub rail that doubles as the
  slide picker, autoplay driven by the rail's CSS progress animation, swipe on
  touch screens and arrow keys while the hero has focus.
*/
export default function FandomHero() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(prefersReducedMotion);
  const touchX = useRef(null);
  const railRef = useRef(null);
  const paused = hovered || stopped;
  const slide = slides[active];

  const go = (index) => {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    // Keep the active hub visible in the rail without scrolling the page itself.
    const rail = railRef.current;
    const item = rail?.children[next];
    if (rail && item && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2, behavior: "smooth" });
    }
  };

  const onKeyDown = (event) => {
    if (event.target.closest("input, textarea, select")) return;
    if (event.key === "ArrowRight") go(active + 1);
    if (event.key === "ArrowLeft") go(active - 1);
  };

  return (
    <section
      className={`hh ${paused ? "is-paused" : ""}`}
      aria-roledescription="carousel"
      aria-label="Featured fandom hubs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const delta = event.changedTouches[0].clientX - touchX.current;
        if (Math.abs(delta) > 50) go(active + (delta < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      <div className="hh-backdrop" aria-hidden="true">
        {slides.map((entry, index) => (
          <img key={entry.name} src={entry.image} alt="" className={index === active ? "is-active" : ""} />
        ))}
      </div>
      <div className="hh-shade" aria-hidden="true" />
      <span className="hh-symbol" aria-hidden="true" key={`symbol-${active}`}>{slide.symbol}</span>

      <div className="hh-inner">
        <div className="hh-copy" key={active} aria-live="polite">
          <span className="hh-eyebrow">
            <i aria-hidden="true" /> {slide.eyebrow}
          </span>
          <h1>{slide.title}</h1>
          <p>{slide.description}</p>
          <div className="hh-actions">
            <Link to={slide.link} className="hh-btn hh-btn-primary">
              Explore {slide.name} <ArrowRight size={18} />
            </Link>
            <Link to="/search" className="hh-btn hh-btn-ghost">
              <Search size={17} /> Search all fandoms
            </Link>
          </div>
        </div>

        <figure className="hh-poster" key={`poster-${active}`}>
          <img src={slide.image} alt={`${slide.name} artwork`} />
          <figcaption>
            <span>{String(active + 1).padStart(2, "0")}</span> / {String(slides.length).padStart(2, "0")} · {slide.name}
          </figcaption>
        </figure>
      </div>

      <div className="hh-bottom">
        <div className="hh-controls">
          <button type="button" onClick={() => go(active - 1)} aria-label="Previous hub">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => setStopped((value) => !value)} aria-label={stopped ? "Play slideshow" : "Pause slideshow"}>
            {stopped ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button type="button" onClick={() => go(active + 1)} aria-label="Next hub">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="hh-rail" ref={railRef} role="tablist" aria-label="Choose a hub">
          {slides.map((entry, index) => (
            <button
              key={entry.name}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show ${entry.name}`}
              className={index === active ? "is-active" : ""}
              onClick={() => go(index)}
            >
              <img src={entry.image} alt="" loading="lazy" />
              <span>
                <small>{String(index + 1).padStart(2, "0")}</small>
                {entry.name}
              </span>
              {index === active && (
                <i
                  className="hh-progress"
                  style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  onAnimationEnd={() => go(active + 1)}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
