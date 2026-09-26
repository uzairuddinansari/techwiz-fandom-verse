import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, EyeOff, FilePlus2, Pencil, RotateCcw, Search, Star, Trash2 } from "lucide-react";
import { formatDate, typeLabels } from "../fandom/catalog";
import { clearOverride, deleteCustomItem, saveOverride } from "./adminStore";
import useAdminCatalog from "./useAdminCatalog";
import { EmptyState, PageHeader } from "./AdminUI";
import { toast, useConfirm } from "../components/ui/feedback";

const PAGE_SIZE = 12;

export default function ContentManager() {
  const { categories, items, adminData } = useAdminCatalog();
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const confirm = useConfirm();

  const remove = async (item) => {
    const ok = await confirm({ tone: "danger", title: `Delete “${item.title}”?`, message: "This item was added in the admin panel. Deleting it removes it from the website for good.", confirmLabel: "Delete item" });
    if (!ok) return;
    deleteCustomItem(item.uid);
    toast(`“${item.title}” was deleted.`, { type: "info", title: "Item deleted" });
  };

  const restore = (item) => {
    clearOverride(item.uid);
    toast(`“${item.title}” is back to its original content.`, { title: "Restored" });
  };
  const query = params.get("q") || "";
  const hub = params.get("hub") || "all";
  const type = params.get("type") || "all";
  const state = params.get("state") || "all";

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
    setPage(0);
  };

  const filtered = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      const text = `${item.title} ${item.franchise || ""} ${item.description || ""}`.toLowerCase();
      const edited = Boolean(adminData.overrides[item.uid]);
      return (
        words.every((word) => text.includes(word)) &&
        (hub === "all" || item.category === hub) &&
        (type === "all" || item.type === type) &&
        (state === "all" ||
          (state === "live" && !item.hidden) ||
          (state === "hidden" && item.hidden) ||
          (state === "featured" && item.featured) ||
          (state === "custom" && item.custom) ||
          (state === "edited" && edited))
      );
    });
  }, [items, query, hub, type, state, adminData.overrides]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  const toggle = (item, key) => {
    const on = !item[key];
    const verb = key === "hidden" ? (on ? "Hidden from the website" : "Visible on the website again") : on ? "Added to featured" : "Removed from featured";
    saveOverride(item.uid, { [key]: on }, `${on ? (key === "hidden" ? "Hid" : "Featured") : key === "hidden" ? "Showed" : "Unfeatured"} “${item.title}”`);
    toast(`“${item.title}”`, { title: verb, type: key === "hidden" && on ? "info" : "success", duration: 2600 });
  };

  return (
    <>
      <PageHeader eyebrow="Content" title="Content library" description={`${items.length} items across ${categories.length} hubs. Changes are saved instantly and appear on the website after a page reload.`}>
        <Link to="/admin/content/new" className="adm-btn adm-btn-primary"><FilePlus2 size={16} /> Add content</Link>
      </PageHeader>

      <div className="adm-filters">
        <label className="adm-search">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search content</span>
          <input type="search" value={query} onChange={(event) => update("q", event.target.value)} placeholder="Search titles, franchises…" />
        </label>
        <select value={hub} onChange={(event) => update("hub", event.target.value)} aria-label="Filter by hub">
          <option value="all">All hubs</option>
          {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
        </select>
        <select value={type} onChange={(event) => update("type", event.target.value)} aria-label="Filter by type">
          <option value="all">All types</option>
          {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <div className="adm-segment" role="group" aria-label="Filter by state">
          {["all", "live", "featured", "hidden", "edited", "custom"].map((value) => (
            <button key={value} type="button" className={state === value ? "active" : ""} aria-pressed={state === value} onClick={() => update("state", value)}>
              {value === "custom" ? "Added" : value}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={Search} title="No content matches">
          <p>Try another search or clear the filters.</p>
        </EmptyState>
      ) : (
        <div className="adm-panel adm-table-wrap">
          <table className="adm-table adm-table-content">
            <thead>
              <tr>
                <th>Item</th>
                <th>Hub</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const edited = Boolean(adminData.overrides[item.uid]);
                return (
                  <tr key={item.uid} className={item.hidden ? "is-hidden" : ""}>
                    <td data-label="Item">
                      <div className="adm-item">
                        {item.image ? <img src={item.image} alt="" loading="lazy" /> : <span className="adm-item-ph" />}
                        <div>
                          <strong>{item.title}</strong>
                          {item.franchise && <small>{item.franchise}</small>}
                        </div>
                      </div>
                    </td>
                    <td data-label="Hub">{item.categoryName}</td>
                    <td data-label="Type"><span className="adm-chip">{typeLabels[item.type]}</span></td>
                    <td data-label="Date">{item.date ? formatDate(item.date) : "—"}</td>
                    <td data-label="Status">
                      <div className="adm-badges">
                        <span className={`adm-badge ${item.hidden ? "muted" : "good"}`}>{item.hidden ? "Hidden" : "Live"}</span>
                        {item.featured && <span className="adm-badge accent">Featured</span>}
                        {item.custom && <span className="adm-badge info">Added</span>}
                        {edited && !item.custom && <span className="adm-badge warn">Edited</span>}
                      </div>
                    </td>
                    <td data-label="Actions" className="actions">
                      <div className="adm-row-actions">
                        <button type="button" className={`adm-icon-btn ${item.featured ? "is-on" : ""}`} onClick={() => toggle(item, "featured")} aria-pressed={Boolean(item.featured)} aria-label={item.featured ? `Unfeature ${item.title}` : `Feature ${item.title}`} title="Featured">
                          <Star size={16} fill={item.featured ? "currentColor" : "none"} />
                        </button>
                        <button type="button" className="adm-icon-btn" onClick={() => toggle(item, "hidden")} aria-label={item.hidden ? `Show ${item.title}` : `Hide ${item.title}`} title={item.hidden ? "Show on site" : "Hide from site"}>
                          {item.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <Link className="adm-icon-btn" to={`/admin/content/edit/${encodeURIComponent(item.uid)}`} aria-label={`Edit ${item.title}`} title="Edit">
                          <Pencil size={16} />
                        </Link>
                        {item.custom ? (
                          <button type="button" className="adm-icon-btn danger" onClick={() => remove(item)} aria-label={`Delete ${item.title}`} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          edited && (
                            <button type="button" className="adm-icon-btn" onClick={() => restore(item)} aria-label={`Restore ${item.title}`} title="Restore original">
                              <RotateCcw size={16} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <footer className="adm-pager">
            <span>
              {current * PAGE_SIZE + 1}–{Math.min(filtered.length, (current + 1) * PAGE_SIZE)} of {filtered.length}
            </span>
            <div>
              <button type="button" className="adm-icon-btn" disabled={current === 0} onClick={() => setPage(current - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
              <span>Page {current + 1} / {pages}</span>
              <button type="button" className="adm-icon-btn" disabled={current >= pages - 1} onClick={() => setPage(current + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
