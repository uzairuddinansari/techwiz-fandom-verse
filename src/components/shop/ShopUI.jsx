import { Link, Navigate, useLocation } from "react-router-dom";
import { Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { formatPrice } from "../../fandom/catalog";
import { productPath, stockLabel } from "../../fandom/shop";
import { addToCart, toggleBookmark, useBookmarks } from "../../fandom/store";
import { initials, justLoggedOut, useAuth } from "../../fandom/auth";
import "../../styles/Shop.css";

export function Stars({ rating, reviews, size = 14 }) {
  return (
    <span className="shop-stars" aria-label={`Rated ${rating} out of 5${reviews ? ` from ${reviews} reviews` : ""}`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} size={size} fill={rating >= value - 0.25 ? "currentColor" : "none"} className={rating >= value - 0.25 ? "on" : ""} aria-hidden="true" />
      ))}
      <b>{rating.toFixed(1)}</b>
      {reviews !== undefined && <small>({reviews})</small>}
    </span>
  );
}

export function QuantityStepper({ value, onChange, min = 1, max = 10, label = "Quantity" }) {
  return (
    <div className="shop-qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus size={15} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus size={15} />
      </button>
    </div>
  );
}

export function ProductCard({ product, index = 0 }) {
  const bookmarks = useBookmarks();
  const saved = bookmarks.some((entry) => entry.uid === product.uid);
  const stock = stockLabel(product.stock);
  // Apparel needs a size, so quick-add sends the shopper to the product page instead.
  const needsChoice = Boolean(product.sizes);

  return (
    <article className="shop-card" style={{ "--card-delay": `${Math.min(index, 12) * 50}ms` }}>
      <Link to={productPath(product)} className="shop-card-media" aria-label={product.title}>
        <img src={product.image} alt="" loading="lazy" />
        {product.badge && <span className="shop-badge">{product.badge}</span>}
        {stock.tone !== "in" && <span className={`shop-stock shop-stock-${stock.tone}`}>{stock.text}</span>}
      </Link>
      <button
        type="button"
        className={`shop-wish ${saved ? "saved" : ""}`}
        onClick={() => toggleBookmark(product)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
      >
        <Heart size={17} fill={saved ? "currentColor" : "none"} />
      </button>
      <div className="shop-card-body">
        <small>{product.categoryName} · {product.kindLabel}</small>
        <h3><Link to={productPath(product)}>{product.title}</Link></h3>
        <p>{product.franchise}</p>
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="shop-card-foot">
          <span className="shop-price">
            {formatPrice(product.priceRange[0])}
            {product.priceRange[1] > product.priceRange[0] && <small> – {formatPrice(product.priceRange[1])}</small>}
          </span>
          {needsChoice ? (
            <Link to={productPath(product)} className="shop-add">Choose size</Link>
          ) : (
            <button type="button" className="shop-add" disabled={product.stock <= 0} onClick={() => addToCart(product, "Standard")}>
              <ShoppingBag size={15} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Avatar({ user, size = 40 }) {
  return (
    <span className="shop-avatar" style={{ "--avatar": user?.avatarColor || "#111", width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">
      {initials(user?.name)}
    </span>
  );
}

/* Sends visitors who aren't logged in to /account and brings them back afterwards. */
export function RequireAuth({ children }) {
  const user = useAuth();
  const location = useLocation();
  if (!user) {
    // After an intentional log-out, go home instead of asking to log in again.
    if (justLoggedOut()) return <Navigate to="/" replace />;
    return <Navigate to={`/account?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  return children;
}
