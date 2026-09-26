import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Lock, MapPin } from "lucide-react";
import { formatPrice } from "../fandom/catalog";
import { computeTotals, getShippingChoice } from "../fandom/shop";
import { clearCart, setPromo, useCart, usePromo } from "../fandom/store";
import { saveOrder, useAuth } from "../fandom/auth";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { ErrorSummary, FieldError, FieldHint, FormAlert } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, rules, toast, validateForm } from "../components/ui/feedback";
import { OrderSummary } from "./CartPage";
import "../styles/Fandom.css";
import "../styles/Shop.css";

const labels = { fullName: "Full name", phone: "Phone", address: "Address", city: "City" };
const schema = {
  fullName: [rules.required("Enter the name for the delivery."), rules.minLength(2)],
  phone: [rules.required("Add a phone number so the courier can reach you."), rules.pattern(/^\+?[\d\s-]{7,15}$/, "Use digits only, e.g. +92 300 1234567.")],
  address: [rules.required("Enter your street address."), rules.minLength(6, "Add a little more detail, like house number and street.")],
  city: [rules.required("Enter your city.")],
};

export default function CheckoutPage() {
  const user = useAuth();
  const cart = useCart();
  const promoCode = usePromo();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const shippingId = getShippingChoice();
  const isPickup = shippingId === "pickup";
  const [values, setValues] = useState({ fullName: user?.name || "", phone: "", address: "", city: "Karachi", notes: "" });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);

  if (!cart.length && !placing) return <Navigate to="/cart" replace />;

  const totals = computeTotals(cart, { promoCode, shippingId, user });
  const activeSchema = isPickup ? { fullName: schema.fullName, phone: schema.phone } : schema;
  const errors = validateForm(values, activeSchema);
  const visible = Object.fromEntries(Object.entries(errors).filter(([field]) => submitted || touched[field]));
  const update = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const placeOrder = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current, errors);
      return;
    }
    setPlacing(true);
    const order = saveOrder({
      items: cart,
      totals: { ...totals, promo: totals.promo?.code || null, shippingOption: totals.shippingOption },
      delivery: { ...values, method: totals.shippingOption.label },
    });
    clearCart();
    setPromo(null);
    toast(`Order ${order.id} is confirmed. No payment was taken.`, { title: "Order placed" });
    navigate(`/orders/${order.id}`, { replace: true });
  };

  return (
    <main className="fv-page shop-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Shop", to: "/shop" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
        <header className="fv-page-hero shop-cart-head">
          <span className="fv-eyebrow"><Lock size={12} /> Secure demo checkout</span>
          <h1>Almost there, {user.name.split(" ")[0]}.</h1>
        </header>

        <ol className="shop-steps" aria-label="Checkout progress">
          <li className="done"><CheckCircle2 size={16} /> Cart</li>
          <li className="current"><MapPin size={16} /> Delivery details</li>
          <li><CheckCircle2 size={16} /> Confirmation</li>
        </ol>

        <div className="shop-cart-layout">
          <form ref={formRef} className="fv-panel fv-form" onSubmit={placeOrder} noValidate>
            <h2>{isPickup ? "Who’s collecting?" : "Where should we deliver?"}</h2>
            <FormAlert type="info" title={totals.shippingOption.label}>
              {totals.shippingOption.detail}. <Link to="/cart">Change delivery option</Link>
            </FormAlert>
            {submitted && <ErrorSummary errors={errors} labels={labels} onJump={(field) => focusFirstError(formRef.current, { [field]: true })} />}

            <div className="shop-form-grid">
              <label htmlFor="co-fullName">
                <span>Full name</span>
                <input name="fullName" value={values.fullName} onChange={update("fullName")} onBlur={blur("fullName")} autoComplete="name" {...fieldA11y("co-fullName", visible.fullName)} />
                <FieldError id="co-fullName" message={visible.fullName} />
              </label>
              <label htmlFor="co-phone">
                <span>Phone</span>
                <input name="phone" type="tel" inputMode="tel" value={values.phone} onChange={update("phone")} onBlur={blur("phone")} autoComplete="tel" placeholder="+92 300 1234567" {...fieldA11y("co-phone", visible.phone)} />
                <FieldError id="co-phone" message={visible.phone} />
              </label>
              {!isPickup && (
                <>
                  <label htmlFor="co-address" className="span-2">
                    <span>Street address</span>
                    <input name="address" value={values.address} onChange={update("address")} onBlur={blur("address")} autoComplete="street-address" {...fieldA11y("co-address", visible.address)} />
                    <FieldError id="co-address" message={visible.address} />
                  </label>
                  <label htmlFor="co-city">
                    <span>City</span>
                    <input name="city" value={values.city} onChange={update("city")} onBlur={blur("city")} autoComplete="address-level2" {...fieldA11y("co-city", visible.city)} />
                    <FieldError id="co-city" message={visible.city} />
                  </label>
                </>
              )}
              <label htmlFor="co-notes" className="span-2">
                <span>Notes (optional)</span>
                <textarea id="co-notes" name="notes" rows={3} value={values.notes} onChange={update("notes")} aria-describedby="co-notes-hint" />
                <FieldHint id="co-notes">Gift message, delivery instructions…</FieldHint>
              </label>
            </div>

            <FormAlert type="warning" title="Demo checkout">
              This is a student project — no payment details are collected and nothing will be shipped.
            </FormAlert>

            <div className="shop-cart-actions">
              <Link to="/cart" className="fv-button-outline"><ArrowLeft size={15} /> Back to cart</Link>
              <button type="submit" className="fv-button" disabled={placing}><Lock size={16} /> Place order · {formatPrice(totals.total)}</button>
            </div>
          </form>

          <aside className="fv-panel shop-cart-side">
            <h2>Your order</h2>
            <ul className="shop-mini-lines">
              {cart.map((line) => (
                <li key={line.lineId}>
                  <span className="shop-mini-image"><img src={line.image} alt="" /><b>{line.quantity}</b></span>
                  <span>
                    <strong>{line.title}</strong>
                    <small>{line.edition}{line.size ? ` · ${line.size}` : ""}</small>
                  </span>
                  <b>{formatPrice(line.price * line.quantity)}</b>
                </li>
              ))}
            </ul>
            <OrderSummary totals={totals} compact />
          </aside>
        </div>
      </div>
    </main>
  );
}
