import { useSyncExternalStore } from "react";
import { toast } from "../components/ui/feedback";
import shop from "../JSON/shop.json";

/*
  Tiny browser-storage store shared by every page.
  - Bookmarks and the cart persist in localStorage.
  - Personal notes live in sessionStorage, so they vanish with the tab (SRS).
  Components subscribe with the hooks below and re-render on every change,
  including changes made in another tab.
*/
const KEYS = {
  bookmarks: "fandomverse_bookmarks",
  cart: "fandomverse_cart",
  notes: "fandomverse_notes",
  promo: "fandomverse_promo",
};

const listeners = new Set();
const cache = new Map();

const storageFor = (key) => (key === KEYS.notes || key === KEYS.promo ? sessionStorage : localStorage);

const read = (key, fallback) => {
  if (!cache.has(key)) {
    try {
      cache.set(key, JSON.parse(storageFor(key).getItem(key)) ?? fallback);
    } catch {
      cache.set(key, fallback);
    }
  }
  return cache.get(key);
};

const write = (key, value) => {
  cache.set(key, value);
  try {
    storageFor(key).setItem(key, JSON.stringify(value));
  } catch {
    /* Storage can be full or blocked; the in-memory copy still works. */
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  const onStorage = (event) => {
    if (event.key && (Object.values(KEYS).includes(event.key) || event.key.startsWith(KEYS.cart))) {
      cache.delete(event.key);
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const EMPTY_LIST = [];
const EMPTY_NOTES = {};

/* Only the fields needed to render a saved card are stored. */
const snapshot = (item) => ({
  uid: item.uid,
  id: item.id,
  type: item.type,
  title: item.title,
  description: item.description,
  image: item.image,
  category: item.category,
  categoryName: item.categoryName,
  categoryPath: item.categoryPath,
  date: item.date || null,
  savedAt: new Date().toISOString(),
});

export const useBookmarks = () =>
  useSyncExternalStore(subscribe, () => read(KEYS.bookmarks, EMPTY_LIST));

export const isBookmarked = (uid) => read(KEYS.bookmarks, EMPTY_LIST).some((entry) => entry.uid === uid);

export const toggleBookmark = (item) => {
  const current = read(KEYS.bookmarks, EMPTY_LIST);
  const exists = current.some((entry) => entry.uid === item.uid);
  write(KEYS.bookmarks, exists ? current.filter((entry) => entry.uid !== item.uid) : [...current, snapshot(item)]);
  toast(exists ? `Removed “${item.title}” from bookmarks` : `Saved “${item.title}” to bookmarks`, {
    type: exists ? "info" : "success",
    duration: 2600,
  });
  return !exists;
};

export const clearBookmarks = () => write(KEYS.bookmarks, []);

export const useNotes = () => useSyncExternalStore(subscribe, () => read(KEYS.notes, EMPTY_NOTES));

export const setNote = (uid, text) => write(KEYS.notes, { ...read(KEYS.notes, EMPTY_NOTES), [uid]: text });

/* ---------- Cart ----------
   Guests share one browser cart; each logged-in account has its own cart.
   On login the guest cart is merged into the account's cart. */

const sessionUserId = () => {
  for (const storage of [localStorage, sessionStorage]) {
    try {
      const session = JSON.parse(storage.getItem("fandomverse_session"));
      if (session?.userId) return session.userId;
    } catch {
      /* ignore */
    }
  }
  return null;
};

const cartKey = () => {
  const userId = sessionUserId();
  return userId ? `${KEYS.cart}:${userId}` : KEYS.cart;
};

const stockFor = (uid) => shop.products[uid]?.stock ?? shop.maxQuantityPerItem;
const maxFor = (uid) => Math.min(shop.maxQuantityPerItem, stockFor(uid));

const mergeLines = (target, incoming) =>
  incoming.reduce((lines, line) => {
    const existing = lines.find((entry) => entry.lineId === line.lineId);
    if (!existing) return [...lines, line];
    return lines.map((entry) => (entry.lineId === line.lineId ? { ...entry, quantity: Math.min(maxFor(entry.uid), entry.quantity + line.quantity) } : entry));
  }, target);

window.addEventListener("fandomverse:auth", () => {
  const key = cartKey();
  cache.delete(key);
  if (key !== KEYS.cart) {
    const guest = read(KEYS.cart, EMPTY_LIST);
    if (guest.length) {
      write(key, mergeLines(read(key, EMPTY_LIST), guest));
      write(KEYS.cart, []);
      toast("Items you added as a guest are now in your cart.", { type: "info", title: "Cart saved to your account" });
      return;
    }
  }
  listeners.forEach((listener) => listener());
});

export const useCart = () => useSyncExternalStore(subscribe, () => read(cartKey(), EMPTY_LIST));
export const getCart = () => read(cartKey(), EMPTY_LIST);

export const cartQuantityOf = (uid) => getCart().filter((line) => line.uid === uid).reduce((sum, line) => sum + line.quantity, 0);

/* Returns { ok, message }. Options: { size, quantity, silent, openDrawer }. */
export const addToCart = (item, edition = "Standard", { size, quantity = 1, openDrawer = true } = {}) => {
  const price = edition === "Deluxe" ? item.priceRange?.[1] ?? item.price : item.price;
  const lineId = [item.uid, edition, size].filter(Boolean).join(":");
  const current = getCart();
  const inCart = cartQuantityOf(item.uid);
  const allowed = Math.max(0, maxFor(item.uid) - inCart);
  if (allowed === 0) {
    toast(`You already have the maximum of ${maxFor(item.uid)} in your cart.`, { type: "warning", title: "Can’t add more" });
    return { ok: false };
  }
  const added = Math.min(quantity, allowed);
  const existing = current.find((line) => line.lineId === lineId);
  write(
    cartKey(),
    existing
      ? current.map((line) => (line.lineId === lineId ? { ...line, quantity: line.quantity + added } : line))
      : [...current, { lineId, uid: item.uid, id: item.id, category: item.category, title: item.title, image: item.image, categoryName: item.categoryName, edition, size: size || null, price, quantity: added }],
  );
  toast(
    added < quantity ? `Only ${added} more could be added — that’s all the stock we have.` : `${added} × ${item.title}${size ? ` (${size})` : ""} · ${edition}`,
    { type: added < quantity ? "warning" : "success", title: "Added to cart" },
  );
  if (openDrawer) window.dispatchEvent(new CustomEvent("fandomverse:cart-open"));
  return { ok: true };
};

export const changeQuantity = (lineId, amount) => {
  const lines = getCart();
  const line = lines.find((entry) => entry.lineId === lineId);
  if (!line) return;
  if (amount > 0 && cartQuantityOf(line.uid) >= maxFor(line.uid)) {
    toast(`Only ${maxFor(line.uid)} of “${line.title}” can be ordered at once.`, { type: "warning", title: "Stock limit reached" });
    return;
  }
  write(
    cartKey(),
    lines.map((entry) => (entry.lineId === lineId ? { ...entry, quantity: entry.quantity + amount } : entry)).filter((entry) => entry.quantity > 0),
  );
};

export const removeLine = (lineId) => write(cartKey(), getCart().filter((line) => line.lineId !== lineId));

export const clearCart = () => write(cartKey(), []);

/* Promo code for the current cart (session only). */
export const usePromo = () => useSyncExternalStore(subscribe, () => read(KEYS.promo, null));
export const setPromo = (code) => write(KEYS.promo, code);

export const cartTotals = (cart) => ({
  count: cart.reduce((sum, line) => sum + line.quantity, 0),
  subtotal: cart.reduce((sum, line) => sum + line.price * line.quantity, 0),
});
