import shop from "../JSON/shop.json";
import { allContent } from "./catalog";

/* Shop data = merchandise from fandomCatalog.json + extras (stock, rating, sizes) from shop.json. */
export { shop };

export const products = allContent
  .filter((item) => item.type === "merchandise")
  .map((item) => ({
    ...item,
    ...(shop.products[item.uid] || {}),
    kindLabel: shop.kindLabels[item.kind] || item.kind,
  }));

export const productPath = (item) => `/shop/${item.category}/${item.id}`;

export const findProduct = (category, id) => products.find((item) => item.category === category && item.id === id);

export const relatedProducts = (product, limit = 4) =>
  products
    .filter((item) => item.uid !== product.uid)
    .map((item) => ({ item, score: (item.franchise === product.franchise ? 3 : 0) + (item.category === product.category ? 2 : 0) + (item.kind === product.kind ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || b.item.rating - a.item.rating)
    .slice(0, limit)
    .map(({ item }) => item);

export const priceFor = (product, edition) => (edition === "Deluxe" ? product.priceRange[1] : product.priceRange[0]);

export const stockLabel = (stock) =>
  stock <= 0 ? { tone: "out", text: "Out of stock" } : stock <= 3 ? { tone: "low", text: `Only ${stock} left` } : { tone: "in", text: "In stock" };

/* Validates a promo code against shop.json. Returns { ok, promo } or { ok: false, message }. */
export function checkPromo(code, subtotal, user) {
  const promo = shop.promoCodes.find((entry) => entry.code === String(code || "").trim().toUpperCase());
  if (!promo) return { ok: false, message: "That code isn’t valid. Check the spelling and try again." };
  if (promo.membersOnly && !user) return { ok: false, message: `${promo.code} is for members — log in or create a free account to use it.` };
  if (subtotal < promo.minSubtotal) return { ok: false, message: `Spend $${promo.minSubtotal.toFixed(2)} or more to use ${promo.code}.` };
  return { ok: true, promo };
}

/* All totals for a cart. Shipping is free above the threshold or with a shipping promo. */
export function computeTotals(cart, { promoCode, shippingId = "standard", user } = {}) {
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const promoCheck = promoCode ? checkPromo(promoCode, subtotal, user) : null;
  const promo = promoCheck?.ok ? promoCheck.promo : null;
  const discount = promo?.type === "percent" ? (subtotal * promo.value) / 100 : promo?.type === "fixed" ? Math.min(promo.value, subtotal) : 0;
  const option = shop.shippingOptions.find((entry) => entry.id === shippingId) || shop.shippingOptions[0];
  const freeShipping = promo?.type === "shipping" || (option.id === "standard" && subtotal >= shop.freeShippingThreshold);
  const shipping = count === 0 || freeShipping ? 0 : option.price;
  const tax = (subtotal - discount) * shop.taxRate;
  return {
    count,
    subtotal,
    discount,
    promo,
    promoError: promoCheck && !promoCheck.ok ? promoCheck.message : "",
    shipping,
    shippingOption: option,
    tax,
    total: Math.max(0, subtotal - discount + shipping + tax),
    toFreeShipping: Math.max(0, shop.freeShippingThreshold - subtotal),
  };
}

/* Chosen delivery option, remembered for this tab between the cart and checkout. */
export const getShippingChoice = () => {
  try {
    return sessionStorage.getItem("fandomverse_shipping") || "standard";
  } catch {
    return "standard";
  }
};

export const setShippingChoice = (id) => {
  try {
    sessionStorage.setItem("fandomverse_shipping", id);
  } catch {
    /* ignore */
  }
};
