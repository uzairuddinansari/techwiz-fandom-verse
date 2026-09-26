import { useSyncExternalStore } from "react";
import usersData from "../JSON/users.json";

/*
  Client-side user accounts (no backend, per the SRS).
  - Demo accounts come from src/JSON/users.json.
  - New sign-ups and profile edits are kept in localStorage.
  - The session lives in localStorage ("remember me") or sessionStorage.
  Passwords are only ever stored as SHA-256 hashes.
*/
const USERS_KEY = "fandomverse_users";
const SESSION_KEY = "fandomverse_session";
const ORDERS_KEY = (userId) => `fandomverse_orders:${userId}`;

const listeners = new Set();
const emit = () => {
  cachedUser = undefined;
  listeners.forEach((listener) => listener());
  window.dispatchEvent(new CustomEvent("fandomverse:auth"));
};

const safeRead = (storage, key, fallback) => {
  try {
    return JSON.parse(storage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const safeWrite = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked */
  }
};

export const hashPassword = async (email, password) => {
  const data = new TextEncoder().encode(`fandomverse:${email.trim().toLowerCase()}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

/* Local records override seed users with the same id (profile edits) and add new accounts. */
const localUsers = () => safeRead(localStorage, USERS_KEY, []);
export const allUsers = () => {
  const local = localUsers();
  const deleted = new Set(local.filter((user) => user.deleted).map((user) => user.id));
  const merged = usersData.users
    .filter((user) => !deleted.has(user.id))
    .map((user) => ({ ...user, source: "json", ...local.find((entry) => entry.id === user.id) }));
  return [...merged, ...local.filter((user) => !user.deleted && !usersData.users.some((seed) => seed.id === user.id)).map((user) => ({ ...user, source: "browser" }))];
};

const saveLocalUser = (user) => {
  const local = localUsers();
  const index = local.findIndex((entry) => entry.id === user.id);
  if (index >= 0) local[index] = { ...local[index], ...user };
  else local.push(user);
  safeWrite(localStorage, USERS_KEY, local);
};

const findByEmail = (email) => allUsers().find((user) => user.email.toLowerCase() === email.trim().toLowerCase());

const readSession = () => safeRead(localStorage, SESSION_KEY, null) || safeRead(sessionStorage, SESSION_KEY, null);

let cachedUser;
export const getCurrentUser = () => {
  if (cachedUser === undefined) {
    const session = readSession();
    const user = session && allUsers().find((entry) => entry.id === session.userId);
    // Never expose the password hash to components.
    if (user) {
      const safe = { ...user };
      delete safe.passwordHash;
      cachedUser = safe;
    } else {
      cachedUser = null;
    }
  }
  return cachedUser;
};

const subscribe = (listener) => {
  listeners.add(listener);
  const onStorage = (event) => [SESSION_KEY, USERS_KEY].includes(event.key) && emit();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const useAuth = () => useSyncExternalStore(subscribe, getCurrentUser);

const startSession = (userId, remember) => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  safeWrite(remember ? localStorage : sessionStorage, SESSION_KEY, { userId, since: new Date().toISOString() });
  emit();
};

/* Each function returns { ok: true, user } or { ok: false, field, message } for the forms. */
export async function signUp({ name, email, password, favorites = [] }) {
  if (findByEmail(email)) {
    return { ok: false, field: "email", message: "An account with this email already exists. Try logging in instead." };
  }
  const colors = usersData.avatarColors;
  const user = {
    id: `u-${Date.now().toString(36)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(email, password),
    avatarColor: colors[Math.floor(Math.random() * colors.length)],
    favorites,
    bio: "",
    joined: new Date().toISOString().slice(0, 10),
  };
  saveLocalUser(user);
  startSession(user.id, true);
  return { ok: true, user: getCurrentUser() };
}

export async function logIn({ email, password, remember = true }) {
  const user = findByEmail(email);
  if (!user) return { ok: false, field: "email", message: "We couldn’t find an account with that email." };
  if ((await hashPassword(user.email, password)) !== user.passwordHash) {
    return { ok: false, field: "password", message: "That password isn’t right. Check it and try again." };
  }
  startSession(user.id, remember);
  return { ok: true, user: getCurrentUser() };
}

/* Lets route guards tell "just logged out" (go home) from "never logged in" (go to login). */
let lastLogoutAt = 0;
export const justLoggedOut = () => Date.now() - lastLogoutAt < 3000;

export function logOut() {
  lastLogoutAt = Date.now();
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  emit();
}

export function updateProfile(patch) {
  const current = getCurrentUser();
  if (!current) return { ok: false, message: "You’re not logged in." };
  const clean = { name: patch.name?.trim(), bio: patch.bio?.trim(), favorites: patch.favorites, avatarColor: patch.avatarColor };
  Object.keys(clean).forEach((key) => clean[key] === undefined && delete clean[key]);
  saveLocalUser({ id: current.id, ...clean });
  emit();
  return { ok: true };
}

export async function changePassword(currentPassword, newPassword) {
  const session = getCurrentUser();
  const user = session && allUsers().find((entry) => entry.id === session.id);
  if (!user) return { ok: false, field: "current", message: "You’re not logged in." };
  if ((await hashPassword(user.email, currentPassword)) !== user.passwordHash) {
    return { ok: false, field: "current", message: "Your current password isn’t right." };
  }
  saveLocalUser({ id: user.id, passwordHash: await hashPassword(user.email, newPassword) });
  emit();
  return { ok: true };
}

export function deleteAccount() {
  const user = getCurrentUser();
  if (!user) return;
  const seed = usersData.users.some((entry) => entry.id === user.id);
  if (seed) saveLocalUser({ id: user.id, deleted: true });
  else safeWrite(localStorage, USERS_KEY, localUsers().filter((entry) => entry.id !== user.id));
  localStorage.removeItem(ORDERS_KEY(user.id));
  localStorage.removeItem(`fandomverse_cart:${user.id}`);
  logOut();
}

/* ---------- Orders (demo — no payment is taken) ---------- */

export const getOrders = (userId = getCurrentUser()?.id) => (userId ? safeRead(localStorage, ORDERS_KEY(userId), []) : []);

export function saveOrder(order) {
  const user = getCurrentUser();
  if (!user) return null;
  const orders = getOrders(user.id);
  const id = `FV-${new Date().getFullYear()}-${String(orders.length + 1001).padStart(4, "0")}`;
  const record = { ...order, id, userId: user.id, placedAt: new Date().toISOString(), status: "Confirmed" };
  safeWrite(localStorage, ORDERS_KEY(user.id), [record, ...orders]);
  emit();
  return record;
}

export const findOrder = (orderId) => getOrders().find((order) => order.id === orderId);

/* Admin view: every order saved in this browser, newest first. */
export const getAllOrders = () =>
  allUsers()
    .flatMap((user) => getOrders(user.id).map((order) => ({ ...order, customer: { id: user.id, name: user.name, email: user.email } })))
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";
