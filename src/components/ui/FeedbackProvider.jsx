import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { FeedbackContext } from "./feedback";
import "../../styles/Feedback.css";

const icons = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };

function ConfirmDialog({ options, onClose }) {
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const danger = options.tone === "danger";
  const Icon = danger ? AlertTriangle : Info;

  useEffect(() => {
    const previous = document.activeElement;
    // Destructive actions start on Cancel so Enter does not delete by accident.
    (danger ? cancelRef : confirmRef).current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose(false);
      if (event.key === "Tab") {
        const buttons = [cancelRef.current, confirmRef.current];
        const index = buttons.indexOf(document.activeElement);
        event.preventDefault();
        buttons[(index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [danger, onClose]);

  return (
    <div className="fb-backdrop" onMouseDown={() => onClose(false)}>
      <div
        className={`fb-dialog ${danger ? "is-danger" : ""}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="fb-dialog-title"
        aria-describedby="fb-dialog-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="fb-dialog-icon"><Icon size={24} /></span>
        <h2 id="fb-dialog-title">{options.title || "Are you sure?"}</h2>
        {options.message && <p id="fb-dialog-message">{options.message}</p>}
        <div className="fb-dialog-actions">
          <button ref={cancelRef} type="button" className="fb-btn fb-btn-ghost" onClick={() => onClose(false)}>
            {options.cancelLabel || "Cancel"}
          </button>
          <button ref={confirmRef} type="button" className={`fb-btn ${danger ? "fb-btn-danger" : "fb-btn-primary"}`} onClick={() => onClose(true)}>
            {options.confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const Icon = icons[toast.type] || Info;
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || (toast.type === "error" ? 6000 : 3500));
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);
  return (
    <li className={`fb-toast fb-${toast.type}`} role={toast.type === "error" ? "alert" : "status"}>
      <Icon size={19} className="fb-toast-icon" />
      <div>
        {toast.title && <strong>{toast.title}</strong>}
        <p>{toast.message}</p>
      </div>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification">
        <X size={15} />
      </button>
      <span className="fb-toast-timer" style={{ animationDuration: `${toast.duration || (toast.type === "error" ? 6000 : 3500)}ms` }} />
    </li>
  );
}

/* Mount once around the app: renders toasts and the confirm dialog. */
export default function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((entry) => entry.id !== id)), []);

  useEffect(() => {
    const onToast = (event) =>
      setToasts((current) => [...current.slice(-3), { id: `${Date.now()}-${Math.random()}`, type: "success", ...event.detail }]);
    window.addEventListener("fandomverse:toast", onToast);
    return () => window.removeEventListener("fandomverse:toast", onToast);
  }, []);

  const confirm = useCallback((options = {}) => new Promise((resolve) => setDialog({ options, resolve })), []);

  const closeDialog = useCallback(
    (result) => {
      dialog?.resolve(result);
      setDialog(null);
    },
    [dialog],
  );

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ol className="fb-toasts" aria-live="polite">
        {toasts.map((entry) => <ToastItem key={entry.id} toast={entry} onDismiss={dismiss} />)}
      </ol>
      {dialog && <ConfirmDialog options={dialog.options} onClose={closeDialog} />}
    </FeedbackContext.Provider>
  );
}
