import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Home, Lock, Search } from "lucide-react";
import sitemap from "../JSON/sitemap.json";
import { categories, sections } from "../fandom/catalog";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import "../styles/Fandom.css";
import "../styles/Sitemap.css";

const hubSections = sections.filter((section) => section.path);

const matches = (text, query) => !query || text.toLowerCase().includes(query.toLowerCase());

export default function SitemapPage() {
  const [query, setQuery] = useState("");
  const pageCount = 1 + categories.length * (hubSections.length + 1) + sitemap.groups.reduce((sum, group) => sum + group.pages.length, 0);

  const hubs = categories
    .map((category) => ({
      category,
      links: hubSections.filter((section) => matches(`${category.name} ${section.label}`, query)),
      hubMatch: matches(category.name, query),
    }))
    .filter((hub) => hub.hubMatch || hub.links.length);
  const groups = sitemap.groups
    .map((group) => ({ ...group, pages: group.pages.filter((page) => matches(`${group.title} ${page.label} ${page.text}`, query)) }))
    .filter((group) => group.pages.length);

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Site map" }]} />
        <header className="fv-page-hero sitemap-head">
          <span className="fv-eyebrow">Site map</span>
          <h1>Find your way around.</h1>
          <p>{sitemap.intro}</p>
          <div className="sitemap-tools">
            <label className="shop-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Filter pages</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter pages, e.g. “gallery” or “cart”" />
            </label>
            <span className="fv-count"><span className="saved-dot" /> {pageCount} pages</span>
          </div>
        </header>

        <div className="sitemap-tree">
          <Link to="/" className="sitemap-root">
            <Home size={20} />
            <span>
              <strong>Landing page</strong>
              <small>Logo, animated hero, category navigation and featured content</small>
            </span>
          </Link>

          {hubs.length > 0 && (
            <section className="sitemap-branch" aria-labelledby="sm-hubs">
              <h2 id="sm-hubs">Category hubs</h2>
              <p className="fv-muted">Each hub has the same set of sections, loaded from JSON.</p>
              <div className="sitemap-hubs">
                {hubs.map(({ category, links }) => (
                  <article key={category.slug} className="sitemap-hub">
                    <Link to={category.path} className="sitemap-hub-head">
                      <img src={category.heroImage} alt="" loading="lazy" />
                      <span>
                        <strong>{category.name}</strong>
                        <small>{category.path}</small>
                      </span>
                      <ArrowUpRight size={16} />
                    </Link>
                    <ul>
                      {links.map((section) => (
                        <li key={section.key}>
                          <Link to={`${category.path}/${section.path}`}>{section.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          )}

          {groups.map((group) => (
            <section key={group.id} className="sitemap-branch" aria-labelledby={`sm-${group.id}`}>
              <h2 id={`sm-${group.id}`}>{group.title}</h2>
              <p className="fv-muted">{group.description}</p>
              <ul className="sitemap-pages">
                {group.pages.map((page) => (
                  <li key={page.label}>
                    {page.path ? (
                      <Link to={page.path}>
                        <strong>{page.label} {page.members && <Lock size={13} aria-label="Members only" />}</strong>
                        <span>{page.text}</span>
                        <small>{page.path}</small>
                      </Link>
                    ) : (
                      <div>
                        <strong>{page.label}</strong>
                        <span>{page.text}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {!hubs.length && !groups.length && (
            <div className="fv-empty">
              <h2>No pages match “{query}”</h2>
              <button type="button" className="fv-button" onClick={() => setQuery("")}>Show all pages</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
