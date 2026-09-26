import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { getCategory } from "../../fandom/catalog";

const titles = {
  gaming: ["Enter the", "Gaming Universe"],
  movies: ["Stories beyond", "the Big Screen"],
  "tv-shows": ["Your next", "Series Awaits"],
  "k-pop": ["Feel the", "K-Pop Universe"],
  manga: ["Ink, panels &", "Legendary Arcs"],
};

/* Shared hero for category hubs that do not have a bespoke animated hero. */
export default function HubHero({ slug }) {
  const category = getCategory(slug);
  const [lead, main] = titles[slug] || ["Explore", category.name];
  const count = (type) => category.items.filter((item) => item.type === type).length;
  const posters = category.items.filter((item) => item.type === "gallery").slice(0, 3);

  const stats = [
    [count("article"), "Articles"],
    [count("character"), "Characters"],
    [count("video") + count("trailer"), "Videos & trailers"],
    [count("event"), "Events"],
  ];

  return (
    <section className={`hub-hero hub-hero-${slug}`} aria-labelledby="hub-hero-title">
      <img className="hub-hero-bg" src={category.heroImage} alt="" fetchPriority="high" />
      <div className="hub-hero-shade" aria-hidden="true" />
      <span className="hub-hero-symbol" aria-hidden="true">{category.icon}</span>

      <div className="hub-hero-inner">
        <div className="hub-hero-copy">
          <span className="hub-hero-eyebrow">
            <i aria-hidden="true" /> FandomVerse / {category.name}
          </span>
          <h1 id="hub-hero-title">
            <span>{lead}</span> {main}
          </h1>
          <p>{category.summary}</p>
          <div className="hub-hero-actions">
            <a className="hub-hero-primary" href="#hub-content">
              Explore {category.name} <ArrowDown size={17} />
            </a>
          
          </div>
          <dl className="hub-hero-stats">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{String(value).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Link to={`${category.path}/gallery`} className="hub-hero-posters" aria-label={`Open the ${category.name} gallery`}>
          {posters.map((poster, index) => (
            <img key={poster.uid} src={poster.image} alt="" style={{ "--i": index }} />
          ))}
          <span>Open gallery →</span>
        </Link>
      </div>
    </section>
  );
}
