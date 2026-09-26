import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { formatPrice } from "../fandom/catalog";
import { checkPromo, computeTotals, getShippingChoice, productPath, setShippingChoice, shop } from "../fandom/shop";
import { changeQuantity, clearCart, removeLine, setPromo, useCart, usePromo } from "../fandom/store";
import { useAuth } from "../fandom/auth";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { FieldError, FormAlert } from "../components/ui/FormFeedback";
import { toast, useConfirm } from "../components/ui/feedback";
import "../styles/Fandom.css";
import "../styles/Shop.css";

export function OrderSummary({ totals, children, compact = false }) {
  return (
    <dl className={`shop-summary ${compact ? "compact" : ""}`}>
      <div><dt>Subtotal ({totals.count} {totals.count === 1 ? "item" : "items"})</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div className="discount"><dt>Discount · {totals.promo.code}</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
      <div><dt>{totals.shippingOption.label}</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
      <div><dt>Tax ({Math.round(shop.taxRate * 100)}%)</dt><dd>{formatPrice(totals.tax)}</dd></div>
      <div className="total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
      {children}
    </dl>
  );
}

export default function CartPage() {
  const cart = useCart();
  const user = useAuth();
  const promoCode = usePromo();
  const confirm = useConfirm();
  const [shippingId, setShippingId] = useState(getShippingChoice);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const totals = computeTotals(cart, { promoCode, shippingId, user });

  const applyCode = (event) => {
    event.preventDefault();
    if (!code.trim()) {
      setCodeError("Enter a promo code first.");
      return;
    }
    const result = checkPromo(code, totals.subtotal, user);
    if (!result.ok) {
      setCodeError(result.message);
      return;
    }
    setPromo(result.promo.code);
    setCode("");
    setCodeError("");
    toast(result.promo.label, { title: `${result.promo.code} applied` });
  };

  const chooseShipping = (id) => {
    setShippingId(id);
    setShippingChoice(id);
  };

  const remove = (line) => {
    removeLine(line.lineId);
    toast(`${line.title} was removed from your cart.`, { type: "info", title: "Item removed" });
  };

  const empty = async () => {
    if (!(await confirm({ tone: "danger", title: "Empty your cart?", message: `All ${totals.count} items will be removed.`, confirmLabel: "Empty cart" }))) return;
    clearCart();
    setPromo(null);
    toast("Your cart is empty.", { type: "info", title: "Cart cleared" });
  };

  if (!cart.length) {
    return (
      <main className="fv-page shop-page">
        <div className="fv-container">
          <Breadcrumbs trail={[{ label: "Shop", to: "/shop" }, { label: "Cart" }]} />
          <div className="fv-empty shop-empty-cart">
            <ShoppingBag size={40} />
            <h1>Your cart is empty</h1>
            <p>Find figures, apparel and collectibles from every fandom.</p>
            <Link className="fv-button" to="/shop">Browse the shop <ArrowRight size={16} /></Link>
          </div>
        </div>
      </main>
    );
  }

  const freeShippingProgress = Math.min(100, (totals.subtotal / shop.freeShippingThreshold) * 100);

  return (
    <main className="fv-page shop-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Shop", to: "/shop" }, { label: "Cart" }]} />
        <header className="fv-page-hero shop-cart-head">
          <span className="fv-eyebrow">Your cart</span>
          <h1>Ready when you are.</h1>
        </header>

        <div className="shop-cart-layout">
          <section aria-label="Cart items">
            <div className={`shop-freeship ${totals.toFreeShipping === 0 ? "done" : ""}`}>
              <Truck size={18} />
              <p>
                {totals.toFreeShipping === 0 ? (
                  <><b>You’ve unlocked free standard delivery.</b></>
                ) : (
                  <>Add <b>{formatPrice(totals.toFreeShipping)}</b> more for free standard delivery.</>
                )}
              </p>
              <span className="shop-freeship-bar"><i style={{ width: `${freeShippingProgress}%` }} /></span>
            </div>

            <ul className="shop-lines">
              {cart.map((line) => (
                <li key={line.lineId}>
                  <Link to={productPath(line)} className="shop-line-image"><img src={line.image} alt="" /></Link>
                  <div className="shop-line-info">
                    <Link to={productPath(line)}><strong>{line.title}</strong></Link>
                    <small>{line.categoryName} · {line.edition}{line.size ? ` · Size ${line.size}` : ""}</small>
                    <span>{formatPrice(line.price)} each</span>
                  </div>
                  <div className="shop-qty" role="group" aria-label={`Quantity of ${line.title}`}>
                    <button type="button" onClick={() => changeQuantity(line.lineId, -1)} aria-label="Decrease quantity">−</button>
                    <output>{line.quantity}</output>
                    <button type="button" onClick={() => changeQuantity(line.lineId, 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <b className="shop-line-total">{formatPrice(line.price * line.quantity)}</b>
                  <button type="button" className="fv-icon-button" onClick={() => remove(line)} aria-label={`Remove ${line.title}`}>
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="shop-cart-actions">
              <Link to="/shop" className="fv-button-outline">Continue shopping</Link>
              <button type="button" className="fv-button-outline danger" onClick={empty}><Trash2 size={15} /> Empty cart</button>
            </div>
          </section>

          <aside className="fv-panel shop-cart-side">
            <h2>Order summary</h2>

            <form className="shop-promo" onSubmit={applyCode} noValidate>
              <label htmlFor="promo-code">Promo code</label>
              {totals.promo ? (
                <div className="shop-promo-applied">
                  <Tag size={15} /> <b>{totals.promo.code}</b> <span>{totals.promo.label}</span>
                  <button type="button" onClick={() => setPromo(null)} aria-label="Remove promo code"><X size={15} /></button>
                </div>
              ) : (
                <div className="shop-promo-row">
                  <input
                    id="promo-code"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value.toUpperCase());
                      setCodeError("");
                    }}
                    placeholder="e.g. FANDOM10"
                    aria-invalid={Boolean(codeError) || undefined}
                    aria-describedby={codeError ? "promo-code-error" : undefined}
                    autoComplete="off"
                  />
                  <button type="submit" className="fv-button-outline">Apply</button>
                </div>
              )}
              <FieldError id="promo-code" message={codeError} />
              {totals.promoError && <FormAlert type="warning">{totals.promoError}</FormAlert>}
            </form>

            <fieldset className="shop-shipping">
              <legend>Delivery</legend>
              {shop.shippingOptions.map((option) => {
                const free = option.id === "standard" && totals.subtotal >= shop.freeShippingThreshold;
                return (
                  <label key={option.id} className={shippingId === option.id ? "active" : ""}>
                    <input type="radio" name="shipping" checked={shippingId === option.id} onChange={() => chooseShipping(option.id)} />
                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.detail}</small>
                    </span>
                    <b>{option.price === 0 || free || totals.promo?.type === "shipping" ? "Free" : formatPrice(option.price)}</b>
                  </label>
                );
              })}
            </fieldset>

            <OrderSummary totals={totals} />

            {user ? (
              <Link to="/checkout" className="fv-button shop-checkout"><Lock size={16} /> Checkout · {formatPrice(totals.total)}</Link>
            ) : (
              <>
                <Link to="/account?next=/checkout" className="fv-button shop-checkout"><Lock size={16} /> Log in to check out</Link>
                <p className="fv-muted">New here? <Link to="/account?mode=signup&next=/checkout">Create a free account</Link> — your cart comes with you.</p>
              </>
            )}
            <small className="fv-muted">Demo store: no payment is taken and nothing is shipped.</small>
          </aside>
        </div>
      </div>
    </main>
  );
}
