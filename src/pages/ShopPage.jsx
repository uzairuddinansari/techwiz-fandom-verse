import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PackageSearch, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Truck, X } from "lucide-react";
import { categories, formatPrice } from "../fandom/catalog";
import { products, shop } from "../fandom/shop";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { ProductCard } from "../components/shop/ShopUI";
import "../styles/Fandom.css";
import "../styles/Shop.css";

const perkIcons = { truck: Truck, rotate: RotateCcw, shield: ShieldCheck };
const highestPrice = Math.ceil(Math.max(...products.map((item) => item.priceRange[0])) / 10) * 10;

const sorters = {
  featured: (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating,
  "price-asc": (a, b) => a.priceRange[0] - b.priceRange[0],
  "price-desc": (a, b) => b.priceRange[0] - a.priceRange[0],
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  az: (a, b) => a.title.localeCompare(b.title),
};

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") || "";
  const hub = params.get("hub") || "all";
  const kind = params.get("kind") || "all";
  const sort = params.get("sort") || "featured";
  const max = Number(params.get("max")) || highestPrice;
  const inStock = params.get("stock") === "1";

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all" || value === null || value === false || (key === "max" && Number(value) >= highestPrice) || (key === "sort" && value === "featured")) next.delete(key);
    else next.set(key, value === true ? "1" : value);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return products
      .filter((item) => {
        const text = `${item.title} ${item.franchise} ${item.kindLabel} ${item.categoryName}`.toLowerCase();
        return (
          words.every((word) => text.includes(word)) &&
          (hub === "all" || item.category === hub) &&
          (kind === "all" || item.kind === kind) &&
          item.priceRange[0] <= max &&
          (!inStock || item.stock > 0)
        );
      })
      .sort(sorters[sort] || sorters.featured);
  }, [query, hub, kind, sort, max, inStock]);

  const kinds = Object.entries(shop.kindLabels).filter(([value]) => products.some((item) => item.kind === value));
  const activeFilters = [hub !== "all", kind !== "all", max < highestPrice, inStock, Boolean(query)].filter(Boolean).length;

  return (
    <main className="fv-page shop-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Shop" }]} />

        <header className="shop-hero">
          <div>
            <span className="fv-eyebrow">FandomVerse store</span>
            <h1>Merch for every fandom.</h1>
            <p>{products.length} collectibles, figures, apparel and accessories across all seven hubs. Add to cart, then check out when you&rsquo;re ready.</p>
          </div>
          <ul className="shop-perks">
            {shop.perks.map((perk) => {
              const Icon = perkIcons[perk.icon] || ShieldCheck;
              return (
                <li key={perk.title}>
                  <Icon size={20} />
                  <div>
                    <strong>{perk.title}</strong>
                    <span>{perk.text}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </header>

        <div className="shop-toolbar">
          <label className="shop-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search products</span>
            <input type="search" value={query} onChange={(event) => update("q", event.target.value)} placeholder="Search hoodies, figures, Naruto…" />
          </label>
          <button type="button" className="fv-button-outline shop-filter-toggle" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen}>
            <SlidersHorizontal size={16} /> Filters {activeFilters > 0 && <b>{activeFilters}</b>}
          </button>
          <label className="shop-sort">
            <span>Sort</span>
            <select value={sort} onChange={(event) => update("sort", event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="az">Name A–Z</option>
            </select>
          </label>
        </div>

        <div className="shop-layout">
          <aside className={`shop-filters ${filtersOpen ? "is-open" : ""}`} aria-label="Filters">
            <header>
              <h2>Filters</h2>
              <button type="button" className="fv-icon-button shop-filters-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </header>

            <fieldset>
              <legend>Hub</legend>
              <div className="shop-chips">
                {[{ slug: "all", name: "All hubs" }, ...categories].map((entry) => (
                  <button key={entry.slug} type="button" className={hub === entry.slug ? "active" : ""} aria-pressed={hub === entry.slug} onClick={() => update("hub", entry.slug)}>
                    {entry.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Category</legend>
              <div className="shop-chips">
                <button type="button" className={kind === "all" ? "active" : ""} aria-pressed={kind === "all"} onClick={() => update("kind", "all")}>All</button>
                {kinds.map(([value, label]) => (
                  <button key={value} type="button" className={kind === value ? "active" : ""} aria-pressed={kind === value} onClick={() => update("kind", value)}>
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>Max price · {formatPrice(max)}</legend>
              <input type="range" min="10" max={highestPrice} step="5" value={max} onChange={(event) => update("max", event.target.value)} aria-label="Maximum price" />
              <div className="shop-range-labels"><span>$10</span><span>{formatPrice(highestPrice)}</span></div>
            </fieldset>

            <label className="shop-toggle">
              <input type="checkbox" checked={inStock} onChange={(event) => update("stock", event.target.checked)} />
              <span aria-hidden="true" />
              In stock only
            </label>

            <div className="shop-filter-actions">
              {activeFilters > 0 && (
                <button type="button" className="fv-button-outline" onClick={() => setParams({}, { replace: true })}>Clear all</button>
              )}
              <button type="button" className="fv-button shop-filters-apply" onClick={() => setFiltersOpen(false)}>Show {results.length} products</button>
            </div>
          </aside>
          {filtersOpen && <button type="button" className="shop-scrim" onClick={() => setFiltersOpen(false)} aria-label="Close filters" tabIndex={-1} />}

          <section aria-live="polite">
            <p className="shop-count">{results.length} {results.length === 1 ? "product" : "products"}</p>
            {results.length ? (
              <div className="shop-grid">
                {results.map((product, index) => <ProductCard key={product.uid} product={product} index={index} />)}
              </div>
            ) : (
              <div className="fv-empty">
                <PackageSearch size={34} />
                <h2>No products match</h2>
                <p>Try a different search or remove a filter.</p>
                <button type="button" className="fv-button" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
