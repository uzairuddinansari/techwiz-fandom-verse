import { useRef, useState } from "react";
import { Database, Download, KeyRound, Trash2, Upload } from "lucide-react";
import { clearBookmarks, clearCart } from "../fandom/store";
import { resetAnalytics } from "../fandom/analytics";
import { DEMO_CREDENTIALS, exportAdminData, importAdminData, logActivity, resetAdminData, useAdminData } from "./adminStore";
import { PageHeader, Panel } from "./AdminUI";
import { toast, useConfirm } from "../components/ui/feedback";

const storageUsage = () => {
  try {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("fandomverse") || key === "lunaAppearanceSettings")
      .map((key) => ({ key, size: (localStorage.getItem(key) || "").length }))
      .sort((a, b) => b.size - a.size);
  } catch {
    return [];
  }
};

export default function SettingsPage() {
  const data = useAdminData();
  const fileRef = useRef(null);
  const confirm = useConfirm();
  const [, refresh] = useState(0);
  const usage = storageUsage();
  const totalKb = (usage.reduce((sum, entry) => sum + entry.size, 0) / 1024).toFixed(1);

  const download = () => {
    const name = `fandomverse-admin-${new Date().toISOString().slice(0, 10)}.json`;
    const url = URL.createObjectURL(new Blob([exportAdminData()], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
    toast(`Saved as ${name}`, { title: "Backup downloaded" });
  };

  const upload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      toast("Choose a .json file exported from this admin panel.", { type: "error", title: "Wrong file type" });
      return;
    }
    try {
      importAdminData(await file.text());
      refresh((value) => value + 1);
      toast("Reload the website to see the imported content.", { title: "Admin data imported" });
    } catch {
      toast("That file isn’t a valid FandomVerse export, so nothing was changed.", { type: "error", title: "Import failed" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const danger = async ({ title, message, confirmLabel }, action, done) => {
    if (!(await confirm({ tone: "danger", title, message, confirmLabel }))) return;
    action();
    logActivity(done);
    refresh((value) => value + 1);
    toast(done, { type: "info", title: "Done" });
  };

  return (
    <>
      <PageHeader eyebrow="Settings" title="Data & access" description="Everything the admin panel changes lives in this browser. Back it up or move it to another browser with an export." />

      <div className="adm-grid adm-grid-2">
        <Panel title="Backup">
          <p className="adm-muted">
            {data.items.length} added items · {Object.keys(data.overrides).length} edited items · {data.faqs.length} chatbot answers
          </p>
          <div className="adm-actions">
            <button type="button" className="adm-btn adm-btn-primary" onClick={download}><Download size={16} /> Export JSON</button>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => fileRef.current?.click()}><Upload size={16} /> Import JSON</button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(event) => upload(event.target.files[0])} />
          </div>
        </Panel>

        <Panel title="Admin access">
          <p className="adm-muted"><KeyRound size={14} /> Demo sign-in: <code>{DEMO_CREDENTIALS.username}</code> / <code>{DEMO_CREDENTIALS.password}</code></p>
          <p className="adm-muted">
            The SRS forbids a backend, so this gate is a front-end demonstration only. Sessions end when the browser tab closes.
          </p>
        </Panel>

        <Panel title={`Browser storage · ${totalKb} KB`}>
          <table className="adm-table adm-table-compact">
            <thead>
              <tr><th><Database size={14} /> Key</th><th className="num">Size</th></tr>
            </thead>
            <tbody>
              {usage.map((entry) => (
                <tr key={entry.key}><td><code>{entry.key}</code></td><td className="num">{(entry.size / 1024).toFixed(1)} KB</td></tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Danger zone" className="adm-danger">
          <div className="adm-danger-list">
            <button type="button" className="adm-btn adm-btn-danger" onClick={() => danger({ title: "Reset all admin content?", message: "Every added item, edit and chatbot answer will be removed. Export a backup first if you might need them.", confirmLabel: "Reset content" }, resetAdminData, "Reset all admin content changes")}>
              <Trash2 size={15} /> Reset admin content
            </button>
            <button type="button" className="adm-btn adm-btn-danger" onClick={() => danger({ title: "Reset visitor statistics?", message: "Page views and visit counts for this browser will start again from zero.", confirmLabel: "Reset analytics" }, resetAnalytics, "Reset visitor statistics")}>
              <Trash2 size={15} /> Reset analytics
            </button>
            <button type="button" className="adm-btn adm-btn-danger" onClick={() => danger({ title: "Clear all bookmarks?", message: "All bookmarks saved in this browser will be removed.", confirmLabel: "Clear bookmarks" }, clearBookmarks, "Cleared bookmarks")}>
              <Trash2 size={15} /> Clear bookmarks
            </button>
            <button type="button" className="adm-btn adm-btn-danger" onClick={() => danger({ title: "Empty the shopping cart?", message: "Every product in this browser’s guest cart will be removed.", confirmLabel: "Empty cart" }, clearCart, "Emptied the cart")}>
              <Trash2 size={15} /> Empty cart
            </button>
          </div>
        </Panel>
      </div>
    </>
  );
}
