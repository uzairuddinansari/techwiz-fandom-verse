import { createContext, useContext } from "react";

/*
  Shared feedback helpers (styled replacements for alert/confirm and the
  browser's native validation bubbles). UI lives in FeedbackProvider.jsx.
*/
export const FeedbackContext = createContext(null);

/* Show a toast from anywhere — components, stores or plain functions. */
export const toast = (message, { type = "success", title, duration } = {}) =>
  window.dispatchEvent(new CustomEvent("fandomverse:toast", { detail: { message, type, title, duration } }));

/*
  const confirm = useConfirm();
  if (await confirm({ title, message, confirmLabel, tone: "danger" })) { ... }
*/
export const useConfirm = () => {
  const context = useContext(FeedbackContext);
  return context?.confirm ?? ((options) => Promise.resolve(window.confirm(options?.message || options?.title)));
};

/* ---------- Validation ---------- */

const text = (value) => String(value ?? "").trim();

export const rules = {
  required: (message = "This field is required.") => (value) => (typeof value === "boolean" ? (value ? "" : message) : text(value) ? "" : message),
  email: (message = "Enter a valid email address, like name@example.com.") => (value) =>
    !text(value) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text(value)) ? "" : message,
  minLength: (length, message) => (value) =>
    !text(value) || text(value).length >= length ? "" : message || `Use at least ${length} characters.`,
  maxLength: (length, message) => (value) =>
    text(value).length <= length ? "" : message || `Keep it under ${length} characters.`,
  number: (message = "Enter a number.") => (value) => (!text(value) || Number.isFinite(Number(value)) ? "" : message),
  min: (limit, message) => (value) => (!text(value) || Number(value) >= limit ? "" : message || `Must be at least ${limit}.`),
  pattern: (regex, message) => (value) => (!text(value) || regex.test(text(value)) ? "" : message),
};

/* schema = { field: [rule, rule, …] } → { field: "first failing message" } */
export const validateForm = (values, schema) =>
  Object.fromEntries(
    Object.entries(schema)
      .map(([field, fieldRules]) => [field, fieldRules.map((rule) => rule(values[field], values)).find(Boolean) || ""])
      .filter(([, message]) => message),
  );

/* Moves focus to the first invalid field after a failed submit. */
export const focusFirstError = (form, errors) => {
  const first = Object.keys(errors)[0];
  if (!first || !form) return;
  const field = form.querySelector(`[name="${first}"], #f-${first}`);
  field?.focus({ preventScroll: true });
  field?.scrollIntoView({ behavior: "smooth", block: "center" });
};

/* Props that wire an input to its error / hint for screen readers. */
export const fieldA11y = (id, error, hasHint = false) => ({
  id,
  "aria-invalid": Boolean(error) || undefined,
  "aria-describedby": error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
});
