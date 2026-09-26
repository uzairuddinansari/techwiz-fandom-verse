import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, PackageCheck, RotateCcw, ShoppingBag, Truck, Zap } from "lucide-react";
import { formatPrice } from "../fandom/catalog";
import { findProduct, priceFor, relatedProducts, shop, stockLabel } from "../fandom/shop";
import { addToCart, cartQuantityOf, toggleBookmark, useBookmarks, useCart } from "../fandom/store";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { FieldError } from "../components/ui/FormFeedback";
import { ProductCard, QuantityStepper, Stars } from "../components/shop/ShopUI";
import "../styles/Fandom.css";
import "../styles/Shop.css";

function ProductDetails({ category, id }) {
  const navigate = useNavigate();
  const product = findProduct(category, id);
  const bookmarks = useBookmarks();
  useCart(); // re-render when the cart changes so the "in your cart" count stays accurate
  const [edition, setEdition] = useState("Standard");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState("");

  if (!product) {
    return (
      <main className="fv-page">
        <div className="fv-container fv-empty">
          <h1>Product not found</h1>
          <p>It may have sold out or moved.</p>
          <Link className="fv-button" to="/shop">Back to the shop</Link>
        </div>
      </main>
    );
  }

  const saved = bookmarks.some((entry) => entry.uid === product.uid);
  const stock = stockLabel(product.stock);
  const inCart = cartQuantityOf(product.uid);
  const maxQuantity = Math.max(0, Math.min(shop.maxQuantityPerItem, product.stock) - inCart);
  const price = priceFor(product, edition);

  const add = (goToCart = false) => {
    if (product.sizes && !size) {
      setSizeError("Choose a size before adding this to your cart.");
      document.getElementById("size-picker")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const result = addToCart(product, edition, { size, quantity, openDrawer: !goToCart });
    if (result.ok) {
      setQuantity(1);
      if (goToCart) navigate("/cart");
    }
  };

  return (
    <main className="fv-page shop-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Shop", to: "/shop" }, { label: product.categoryName, to: `/shop?hub=${product.category}` }, { label: product.title }]} />

        <article className="shop-product">
          <figure className="shop-product-media">
            <img src={product.image} alt={product.title} />
            {product.badge && <span className="shop-badge">{product.badge}</span>}
          </figure>

          <div className="shop-product-info">
            <span className="fv-eyebrow">{product.categoryName} · {product.kindLabel}</span>
            <h1>{product.title}</h1>
            <p className="shop-product-franchise">{product.franchise}</p>
            <Stars rating={product.rating} reviews={product.reviews} size={16} />

            <p className="shop-product-price">
              {formatPrice(price)}
              <small>{edition} edition · tax calculated at checkout</small>
            </p>
            <p className="shop-product-desc">{product.description}</p>

            <fieldset className="shop-option">
              <legend>Edition</legend>
              <div className="shop-editions">
                {shop.editions.map((option) => (
                  <label key={option.id} className={edition === option.id ? "active" : ""}>
                    <input type="radio" name="edition" value={option.id} checked={edition === option.id} onChange={() => setEdition(option.id)} />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                    <b>{formatPrice(priceFor(product, option.id))}</b>
                  </label>
                ))}
              </div>
            </fieldset>

            {product.sizes && (
              <fieldset className="shop-option" id="size-picker" aria-describedby={sizeError ? "size-error" : undefined}>
                <legend>Size</legend>
                <div className={`shop-sizes ${sizeError ? "is-invalid" : ""}`}>
                  {product.sizes.map((value) => (
                    <label key={value} className={size === value ? "active" : ""}>
                      <input
                        type="radio"
                        name="size"
                        value={value}
                        checked={size === value}
                        onChange={() => {
                          setSize(value);
                          setSizeError("");
                        }}
                      />
                      {value}
                    </label>
                  ))}
                </div>
                <FieldError id="size" message={sizeError} />
              </fieldset>
            )}

            <div className="shop-buy">
              <QuantityStepper value={Math.min(quantity, Math.max(1, maxQuantity))} onChange={setQuantity} max={Math.max(1, maxQuantity)} />
              <button type="button" className="fv-button shop-buy-add" onClick={() => add(false)} disabled={maxQuantity === 0}>
                <ShoppingBag size={17} /> {maxQuantity === 0 ? (product.stock <= 0 ? "Out of stock" : "Limit reached") : `Add to cart · ${formatPrice(price * quantity)}`}
              </button>
              <button type="button" className="fv-button-outline" onClick={() => add(true)} disabled={maxQuantity === 0}>
                <Zap size={16} /> Buy now
              </button>
              <button type="button" className={`fv-icon-button shop-buy-wish ${saved ? "saved" : ""}`} onClick={() => toggleBookmark(product)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
              </button>
            </div>

            <p className={`shop-stock-line shop-stock-${stock.tone}`}>
              <PackageCheck size={16} /> {stock.text}
              {inCart > 0 && <> · <Link to="/cart">{inCart} in your cart</Link></>}
            </p>

            <ul className="shop-assurance">
              <li><Truck size={17} /> Free standard delivery over {formatPrice(shop.freeShippingThreshold)}</li>
              <li><RotateCcw size={17} /> 30-day returns</li>
              <li><PackageCheck size={17} /> SKU {product.sku}</li>
            </ul>

            <Link to="/shop" className="fv-link-button"><ArrowLeft size={15} /> Continue shopping</Link>
          </div>
        </article>

        <section className="fv-related" aria-labelledby="related-products">
          <div className="fv-section-head">
            <div>
              <span className="fv-eyebrow">You may also like</span>
              <h2 id="related-products">Related merch</h2>
            </div>
          </div>
          <div className="shop-grid">
            {relatedProducts(product).map((item, index) => <ProductCard key={item.uid} product={item} index={index} />)}
          </div>
        </section>
      </div>
    </main>
  );
}

/* Keyed by product so edition, size and quantity reset when moving to a related item. */
export default function ProductPage() {
  const { category, id } = useParams();
  return <ProductDetails key={`${category}/${id}`} category={category} id={id} />;
}
