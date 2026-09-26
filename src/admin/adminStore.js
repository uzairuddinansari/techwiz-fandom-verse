import { useSyncExternalStore } from "react";

/*
  Admin data is kept in localStorage and layered on top of the JSON catalog
  when the site loads (the JSON files themselves are never written — SRS 1.5).
  - overrides: edits to existing items, keyed by uid ({ title, description, featured, hidden, ... })
  - items:     new items created in the admin panel
  - faqs:      extra chatbot intents
*/
const KEY = "fandomverse_admin";
const AUTH_KEY = "fandomverse_admin_session";

export const DEMO_CREDENTIALS = { username: "admin", password: "fandom2026" };

const empty = { overrides: {}, items: [], faqs: [], activity: [] };

let cache = null;
const listeners = new Set();

export const readAdminData = () => {
  if (!cache) {
    try {
      cache = { ...empty, ...JSON.parse(localStorage.getItem(KEY)) };
    } catch {
      cache = { ...empty };
    }
  }
  return cache;
};

const write = (next, message) => {
  const activity = message
    ? [{ message, at: new Date().toISOString() }, ...(next.activity || [])].slice(0, 30)
    : next.activity;
  cache = { ...next, activity };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage full or blocked */
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useAdminData = () => useSyncExternalStore(subscribe, readAdminData);

export const saveOverride = (uid, patch, message) => {
  const data = readAdminData();
  write({ ...data, overrides: { ...data.overrides, [uid]: { ...data.overrides[uid], ...patch } } }, message);
};

export const clearOverride = (uid) => {
  const data = readAdminData();
  const overrides = { ...data.overrides };
  delete overrides[uid];
  write({ ...data, overrides }, "Restored an item to its original content");
};

export const saveCustomItem = (item) => {
  const data = readAdminData();
  const exists = data.items.some((entry) => entry.uid === item.uid);
  write(
    { ...data, items: exists ? data.items.map((entry) => (entry.uid === item.uid ? item : entry)) : [...data.items, item] },
    `${exists ? "Updated" : "Added"} “${item.title}”`,
  );
};

export const deleteCustomItem = (uid) => {
  const data = readAdminData();
  const item = data.items.find((entry) => entry.uid === uid);
  write({ ...data, items: data.items.filter((entry) => entry.uid !== uid) }, `Deleted “${item?.title || "item"}”`);
};

export const saveFaq = (faq) => {
  const data = readAdminData();
  const exists = data.faqs.some((entry) => entry.id === faq.id);
  write(
    { ...data, faqs: exists ? data.faqs.map((entry) => (entry.id === faq.id ? faq : entry)) : [...data.faqs, faq] },
    `${exists ? "Updated" : "Added"} chatbot answer “${faq.keywords[0]}”`,
  );
};

export const deleteFaq = (id) => {
  const data = readAdminData();
  write({ ...data, faqs: data.faqs.filter((entry) => entry.id !== id) }, "Removed a chatbot answer");
};

export const logActivity = (message) => write(readAdminData(), message);

export const exportAdminData = () => JSON.stringify(readAdminData(), null, 2);

export const importAdminData = (text) => {
  const parsed = JSON.parse(text);
  if (typeof parsed !== "object" || !parsed) throw new Error("Invalid file");
  write({ ...empty, ...parsed }, "Imported admin data");
};

export const resetAdminData = () => write({ ...empty }, "Reset all admin changes");

/* Demo-only gate: the SRS has no backend, so this is not real security. */
export const isAdminSignedIn = () => {
  try {
    return sessionStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
};

export const signInAdmin = (username, password) => {
  const ok = username.trim().toLowerCase() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;
  if (ok) sessionStorage.setItem(AUTH_KEY, "1");
  return ok;
};

export const signOutAdmin = () => sessionStorage.removeItem(AUTH_KEY);
