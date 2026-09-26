import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Package, PartyPopper } from "lucide-react";
import { formatPrice } from "../fandom/catalog";
import { productPath } from "../fandom/shop";
import { findOrder } from "../fandom/auth";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import "../styles/Fandom.css";
import "../styles/Shop.css";

const timeline = ["Order confirmed", "Packed", "Shipped", "Delivered"];

export default function OrderPage() {
  const { orderId } = useParams();
  const order = findOrder(orderId);

  if (!order) {
    return (
      <main className="fv-page">
        <div className="fv-container fv-empty">
          <Package size={34} />
          <h1>Order not found</h1>
          <p>It may belong to another account on this browser.</p>
          <Link className="fv-button" to="/profile?tab=orders">View my orders</Link>
        </div>
      </main>
    );
  }

  const { totals, delivery } = order;
  return (
    <main className="fv-page shop-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "My account", to: "/profile" }, { label: "Orders", to: "/profile?tab=orders" }, { label: order.id }]} />

        <section className="shop-confirm">
          <span className="shop-confirm-icon"><PartyPopper size={30} /></span>
          <span className="fv-eyebrow">Order {order.id}</span>
          <h1>Thank you, {delivery.fullName.split(" ")[0]}!</h1>
          <p>
            Your order was placed on {new Date(order.placedAt).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}. This is a demo, so no payment was
            taken and nothing will be shipped.
          </p>
          <ol className="shop-timeline">
            {timeline.map((step, index) => (
              <li key={step} className={index === 0 ? "done" : ""}>
                {index === 0 ? <CheckCircle2 size={18} /> : <Circle size={18} />} {step}
              </li>
            ))}
          </ol>
        </section>

        <div className="shop-cart-layout">
          <section className="fv-panel">
            <h2 className="shop-panel-title">Items</h2>
            <ul className="shop-mini-lines">
              {order.items.map((line) => (
                <li key={line.lineId}>
                  <span className="shop-mini-image"><img src={line.image} alt="" /><b>{line.quantity}</b></span>
                  <span>
                    <Link to={productPath(line)}><strong>{line.title}</strong></Link>
                    <small>{line.edition}{line.size ? ` · ${line.size}` : ""} · {formatPrice(line.price)} each</small>
                  </span>
                  <b>{formatPrice(line.price * line.quantity)}</b>
                </li>
              ))}
            </ul>
          </section>

          <aside className="fv-panel shop-cart-side">
            <h2>Summary</h2>
            <dl className="shop-summary compact">
              <div><dt>Subtotal</dt><dd>{formatPrice(totals.subtotal)}</dd></div>
              {totals.discount > 0 && <div className="discount"><dt>Discount · {totals.promo}</dt><dd>−{formatPrice(totals.discount)}</dd></div>}
              <div><dt>{totals.shippingOption.label}</dt><dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd></div>
              <div><dt>Tax</dt><dd>{formatPrice(totals.tax)}</dd></div>
              <div className="total"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
            </dl>
            <h3 className="shop-panel-title">{delivery.method}</h3>
            <p className="fv-muted">
              {delivery.fullName} · {delivery.phone}
              {delivery.address && <><br />{delivery.address}, {delivery.city}</>}
            </p>
            <div className="fv-actions">
              <Link to="/shop" className="fv-button">Continue shopping</Link>
              <Link to="/profile?tab=orders" className="fv-button-outline">All orders</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
