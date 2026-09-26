import { Link } from "react-router-dom";
import { Accessibility, Bookmark, Bot, Layers, Search, ShoppingBag } from "lucide-react";
import team from "../fandom/team";
import { allContent, categories } from "../fandom/catalog";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import "../styles/Fandom.css";

const features = [
  [Layers, "Seven hubs", "Anime, Gaming, Movies, TV Shows, K-Pop, Comics and Manga — each with articles, galleries, videos, audio, characters, events, merch and trailers."],
  [Search, "Global search", "Search every item across all hubs and filter by category, type and sort order."],
  [Bookmark, "Bookmarks & notes", "Save anything, add session-only notes and export your list."],
  [ShoppingBag, "Merch showcase", "Browse the store, fill a cart with promo codes and delivery options, and check out with a free fan account."],
  [Bot, "Nova, the chatbot", "A rule-based assistant that answers FAQs and recommends content."],
  [Accessibility, "Accessible by design", "Keyboard navigation, visible focus, strong contrast and reduced-motion support."],
];

export default function AboutPage() {
  const stats = [
    [categories.length, "Fandom hubs"],
    [allContent.length, "Content items"],
    [allContent.filter((item) => item.type === "character").length, "Character profiles"],
    [allContent.filter((item) => item.type === "event").length, "Events"],
  ];

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "About us" }]} />
        <header className="fv-page-hero fv-about-hero">
          <span className="fv-eyebrow">About FandomVerse</span>
          <h1>One portal. Seven passionate worlds.</h1>
          <p>
            Fans usually jump between wikis, streaming sites, shops and social feeds just to follow one fandom. FandomVerse brings
            articles, characters, media, events, merchandise and releases together in one fast, responsive single-page app.
          </p>
          <dl className="fv-stats">
            {stats.map(([value, label]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="fv-feature-grid" aria-label="What you can do">
          {features.map(([Icon, title, text]) => (
            <article key={title} className="fv-panel">
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </section>

        <section className="fv-team" aria-labelledby="team-title">
          <span className="fv-eyebrow">The people behind it</span>
          <h2 id="team-title">Meet the team</h2>
          <div className="fv-team-grid fv-team-grid-large">
            {team.members.map((member) => (
              <article key={member.name} className="fv-panel fv-member fv-member-large">
                <img src={member.image} alt={member.name} loading="lazy" />
                <h3>{member.name}</h3>
                <p className="fv-eyebrow">{member.role}</p>
                <p>{member.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fv-panel fv-about-note">
          <h2>How it is built</h2>
          <p>
            FandomVerse is a front-end only React application. All content is pre-populated from JSON files and nothing is written to a
            server: bookmarks and the cart live in local storage and notes in session storage. The chatbot answers from a local,
            pre-scripted knowledge base rather than a live AI service.
          </p>
          <p className="fv-muted">
            Franchise names and artwork belong to their respective owners and are shown here for educational, non-commercial purposes.
          </p>
          <div className="fv-actions">
            <Link className="fv-button" to="/team">Meet the team</Link>
            <Link className="fv-button-outline" to="/contact">Contact us</Link>
            <Link className="fv-button-outline" to="/sitemap">Site map</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
