import { Link } from "react-router-dom";
import { Bookmark, Download, Printer, Trash2 } from "lucide-react";
import { detailPath, formatDate, sectionPath, typeLabels } from "../fandom/catalog";
import { clearBookmarks, setNote, toggleBookmark, useBookmarks, useNotes } from "../fandom/store";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { toast, useConfirm } from "../components/ui/feedback";
import "../styles/Fandom.css";

const linkFor = (item) => (["article", "character", "event", "merchandise"].includes(item.type) ? detailPath(item) : sectionPath(item));

const download = (filename, text, mime) => {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function BookmarksPage() {
  const bookmarks = useBookmarks();
  const notes = useNotes();
  const confirm = useConfirm();

  const clearAll = async () => {
    const ok = await confirm({
      tone: "danger",
      title: "Remove all bookmarks?",
      message: `This deletes ${bookmarks.length === 1 ? "your saved item and its note" : `all ${bookmarks.length} saved items and their notes`} from this browser. You can’t undo this.`,
      confirmLabel: "Remove all",
    });
    if (!ok) return;
    clearBookmarks();
    toast("Your bookmark list is now empty.", { title: "Bookmarks cleared", type: "info" });
  };

  const grouped = bookmarks.reduce((groups, item) => {
    (groups[item.categoryName] ||= []).push(item);
    return groups;
  }, {});

  const exportText = () => {
    const lines = [`FANDOMVERSE BOOKMARKS`, `Exported ${new Date().toLocaleString()}`, ""];
    Object.entries(grouped).forEach(([category, items]) => {
      lines.push(`== ${category.toUpperCase()} ==`);
      items.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.title} [${typeLabels[item.type]}]`);
        lines.push(`   ${window.location.origin}${linkFor(item)}`);
        if (notes[item.uid]) lines.push(`   Note: ${notes[item.uid]}`);
      });
      lines.push("");
    });
    download("fandomverse-bookmarks.txt", lines.join("\n"), "text/plain");
    toast(`${bookmarks.length} bookmarks saved as fandomverse-bookmarks.txt`, { title: "Export downloaded" });
  };

  const exportCsv = () => {
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [["Title", "Category", "Type", "Link", "Note", "Saved"]].concat(
      bookmarks.map((item) => [item.title, item.categoryName, typeLabels[item.type], `${window.location.origin}${linkFor(item)}`, notes[item.uid] || "", item.savedAt?.slice(0, 10)]),
    );
    download("fandomverse-bookmarks.csv", rows.map((row) => row.map(escape).join(",")).join("\n"), "text/csv");
    toast(`${bookmarks.length} bookmarks saved as fandomverse-bookmarks.csv`, { title: "Export downloaded" });
  };

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Bookmarks" }]} />
        <header className="fv-page-hero fv-page-hero-split">
          <div>
            <span className="fv-eyebrow">Your collection</span>
            <h1>Saved discoveries.</h1>
            <p>
              Bookmarks are kept in this browser&rsquo;s local storage. Personal notes are session-only and clear when you close the tab.
            </p>
          </div>
          {bookmarks.length > 0 && (
            <div className="fv-actions">
              <button type="button" className="fv-button" onClick={exportText}><Download size={16} /> Export list (.txt)</button>
              <button type="button" className="fv-button-outline" onClick={exportCsv}><Download size={16} /> CSV</button>
              <button type="button" className="fv-button-outline" onClick={() => window.print()}><Printer size={16} /> Print</button>
              <button
                type="button"
                className="fv-button-outline danger"
                onClick={clearAll}
              >
                <Trash2 size={16} /> Clear all
              </button>
            </div>
          )}
        </header>

        {bookmarks.length === 0 ? (
          <div className="fv-empty">
            <Bookmark size={34} />
            <h2>No bookmarks yet</h2>
            <p>Use the Save button on any article, character, video, event or product.</p>
            <Link className="fv-button" to="/search">Explore content</Link>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="fv-bookmark-group" aria-label={category}>
              <h2>{category} <small>{items.length}</small></h2>
              <div className="fv-bookmarks">
                {items.map((item) => (
                  <article key={item.uid} className="fv-bookmark">
                    <Link to={linkFor(item)} className="fv-bookmark-image">
                      <img src={item.image} alt="" loading="lazy" />
                    </Link>
                    <div className="fv-bookmark-copy">
                      <span className="fv-eyebrow">{typeLabels[item.type]}{item.date && ` · ${formatDate(item.date)}`}</span>
                      <h3><Link to={linkFor(item)}>{item.title}</Link></h3>
                      <p>{item.description}</p>
                      <label>
                        <span>Personal note (this session only)</span>
                        <textarea
                          rows={2}
                          value={notes[item.uid] || ""}
                          onChange={(event) => setNote(item.uid, event.target.value)}
                          placeholder="Why did you save this?"
                        />
                      </label>
                    </div>
                    <button type="button" className="fv-icon-button" onClick={() => toggleBookmark(item)} aria-label={`Remove ${item.title}`}>
                      <Trash2 size={17} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
