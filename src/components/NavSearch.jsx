import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const COMPACT = "(max-width: 700px)";

/*
  Navbar search.
  - Wide screens: the input is always there — click the pill and type.
  - Phones: the icon opens the field already focused (one tap to type).
  Enter searches; an empty search opens the search page. "/" focuses it from anywhere, Esc clears it.
*/
export default function NavSearch() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const formRef = useRef(null);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(() => window.matchMedia?.(COMPACT).matches ?? false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.(COMPACT);
    if (!media) return undefined;
    const onChange = (event) => {
      setCompact(event.matches);
      setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // "/" jumps into the search box unless the visitor is already typing somewhere.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target.closest?.("input, textarea, select, [contenteditable='true']")) return;
      event.preventDefault();
      if (compact) setOpen(true);
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact]);

  // Focus the field as soon as it opens on phones.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (event) => {
    if (event.key !== "Escape") return;
    if (query) setQuery("");
    else {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showField = !compact || open;

  return (
    <form
      ref={formRef}
      className={`nav_search ${showField ? "search_ready" : ""} ${compact && open ? "search_open" : ""}`}
      onSubmit={submit}
      role="search"
      onMouseDown={(event) => {
        // Clicking anywhere on the pill (not just the icon) puts the cursor in the field.
        if (showField && event.target === formRef.current) {
          event.preventDefault();
          inputRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (compact && open && !query && !formRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      {showField && (
        <>
          <label htmlFor="nav-search-input" className="sr-only">Search every fandom</label>
          <input
            id="nav-search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search every fandom"
            autoComplete="off"
            enterKeyHint="search"
          />
          {!query && !compact && <kbd className="nav_search_hint" aria-hidden="true">/</kbd>}
          {query && (
            <button type="button" className="nav_search_clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </>
      )}
      {/* Two separate buttons (distinct keys) so opening on phones can never trigger a submit
          in the same click — React would otherwise flip the button's type mid-click. */}
      {showField ? (
        <button key="submit" type="submit" aria-label="Search">
          <Search size={16} />
        </button>
      ) : (
        <button key="open" type="button" onClick={() => setOpen(true)} aria-label="Open search" aria-expanded={false}>
          <Search size={16} />
        </button>
      )}
    </form>
  );
}
