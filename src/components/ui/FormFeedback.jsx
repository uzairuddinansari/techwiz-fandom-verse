import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import "../../styles/Feedback.css";

const icons = { success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info };

/* Inline message under a field. Link it with aria-describedby={`${id}-error`}. */
export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <span className="fb-field-error" id={`${id}-error`} role="alert">
      <AlertCircle size={14} aria-hidden="true" /> {message}
    </span>
  );
}

/* Optional helper text shown when there is no error. */
export function FieldHint({ id, children }) {
  return (
    <span className="fb-field-hint" id={`${id}-hint`}>
      {children}
    </span>
  );
}

/* Banner at the top of a form: error summary, success confirmation, warnings. */
export function FormAlert({ type = "error", title, children, onClose, className = "" }) {
  const Icon = icons[type];
  return (
    <div className={`fb-alert fb-${type} ${className}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={20} className="fb-alert-icon" aria-hidden="true" />
      <div>
        {title && <strong>{title}</strong>}
        {children && <div className="fb-alert-body">{children}</div>}
      </div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss message">
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/* Lists every problem after a failed submit; each item jumps to its field. */
export function ErrorSummary({ errors, labels = {}, onJump }) {
  const entries = Object.entries(errors).filter(([, message]) => message);
  if (!entries.length) return null;
  return (
    <FormAlert type="error" title={entries.length === 1 ? "Please fix 1 problem" : `Please fix ${entries.length} problems`}>
      <ul className="fb-summary">
        {entries.map(([field, message]) => (
          <li key={field}>
            <button type="button" onClick={() => onJump?.(field)}>
              {labels[field] ? <b>{labels[field]}:</b> : null} {message}
            </button>
          </li>
        ))}
      </ul>
    </FormAlert>
  );
}

