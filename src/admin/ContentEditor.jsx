import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ImageIcon, Save, Search, X } from "lucide-react";
import { assetImages, baseCategories, normalizeCustomItem, resolveMedia, typeLabels } from "../fandom/catalog";
import ContentCard from "../components/fandom/ContentCard";
import { saveCustomItem, saveOverride } from "./adminStore";
import useAdminCatalog from "./useAdminCatalog";
import { PageHeader, Panel } from "./AdminUI";
import { ErrorSummary, FieldError } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, toast } from "../components/ui/feedback";
import "../styles/Fandom.css";

const slugify = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const youtubeId = (value = "") => {
  const match = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : /^[\w-]{11}$/.test(value.trim()) ? value.trim() : "";
};

/* Which extra fields each content type needs. */
const fieldsFor = {
  article: ["franchise", "author", "readTime", "date", "body"],
  character: ["franchise", "traits"],
  event: ["kind", "date", "location"],
  merchandise: ["franchise", "kind", "price", "priceMax"],
  trailer: ["status", "date", "youtube", "video"],
  video: ["kind", "date", "youtube", "video"],
  audio: ["kind", "duration", "date", "audio"],
  gallery: ["tags"],
};

const labels = {
  franchise: "Franchise / series",
  author: "Author",
  readTime: "Read time",
  date: "Date",
  body: "Full article text (blank line between paragraphs)",
  traits: "Traits (comma separated)",
  kind: "Kind (e.g. convention, apparel, podcast)",
  location: "Location / venue",
  price: "Standard price ($)",
  priceMax: "Deluxe price ($)",
  status: "Release status",
  youtube: "YouTube link or video ID",
  video: "Video file URL (optional)",
  audio: "Audio file URL",
  duration: "Duration (e.g. 5:30)",
  tags: "Tags (comma separated)",
};

const required = {
  event: ["date", "location"],
  merchandise: ["price"],
  audio: ["audio"],
};

const emptyDraft = (type = "merchandise", category = "anime") => ({
  type,
  category,
  title: "",
  description: "",
  image: "",
  featured: false,
  hidden: false,
  franchise: "",
  author: "FandomVerse Editorial",
  readTime: "5 min read",
  date: new Date().toISOString().slice(0, 10),
  body: "",
  traits: "",
  kind: "",
  location: "",
  price: "",
  priceMax: "",
  status: "upcoming",
  youtube: "",
  video: "",
  audio: "",
  duration: "",
  tags: "",
});

/* Maps a catalog item back into form values when editing. */
const toDraft = (item) => ({
  ...emptyDraft(item.type, item.category),
  ...Object.fromEntries(Object.entries(item).filter(([, value]) => typeof value === "string" || typeof value === "boolean" || typeof value === "number")),
  traits: (item.traits || []).join(", "),
  tags: (item.tags || []).join(", "),
  body: (item.body || []).join("\n\n"),
  price: item.priceRange?.[0] ?? "",
  priceMax: item.priceRange?.[1] ?? "",
  image: item.image || "",
});

function ImagePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const preview = resolveMedia(value) || value;
  const results = assetImages.filter((asset) => asset.path.toLowerCase().includes(query.toLowerCase())).slice(0, 60);
  return (
    <div className="adm-image-picker">
      <div className="adm-image-current">
        {preview ? <img src={preview} alt="Selected" /> : <span><ImageIcon size={22} /></span>}
        <div>
          <input name="image" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Pick a bundled image or paste an image URL" aria-label="Image path or URL" {...fieldA11y("f-image", error)} />
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setOpen((state) => !state)}>
            <ImageIcon size={15} /> {open ? "Close library" : "Browse image library"}
          </button>
        </div>
      </div>
      {open && (
        <div className="adm-image-library">
          <label className="adm-search">
            <Search size={15} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${assetImages.length} images…`} aria-label="Search images" />
          </label>
          <div className="adm-image-grid">
            {results.map((asset) => (
              <button
                key={asset.path}
                type="button"
                className={value === asset.path ? "active" : ""}
                onClick={() => {
                  onChange(asset.path);
                  setOpen(false);
                }}
                title={asset.path}
              >
                <img src={asset.url} alt="" loading="lazy" />
                {value === asset.path && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentEditor() {
  const { uid } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { items } = useAdminCatalog();
  const existing = uid ? items.find((item) => item.uid === decodeURIComponent(uid)) : null;
  const isBuiltIn = existing && !existing.custom;
  const [draft, setDraft] = useState(() =>
    existing ? toDraft(existing) : emptyDraft(params.get("type") || "merchandise", params.get("hub") || "anime"),
  );
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const [newId] = useState(() => Date.now().toString(36));

  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const extra = fieldsFor[draft.type] || [];

  const buildItem = () => {
    const id = existing?.id || `custom-${slugify(draft.title) || "item"}-${newId}`;
    return {
      uid: existing?.uid || `${draft.category}:${draft.type}:${id}`,
      id,
      type: draft.type,
      category: draft.category,
      title: draft.title.trim(),
      description: draft.description.trim(),
      image: draft.image.trim(),
      featured: draft.featured,
      hidden: draft.hidden,
      franchise: draft.franchise.trim() || undefined,
      author: draft.type === "article" ? draft.author : undefined,
      readTime: draft.type === "article" ? draft.readTime : undefined,
      date: extra.includes("date") ? draft.date : undefined,
      body: draft.type === "article" ? draft.body : undefined,
      traits: draft.type === "character" ? draft.traits.split(",").map((value) => value.trim()).filter(Boolean) : undefined,
      kind: extra.includes("kind") ? draft.kind.trim() || undefined : undefined,
      location: draft.type === "event" ? draft.location.trim() : undefined,
      price: draft.type === "merchandise" ? Number(draft.price) : undefined,
      priceMax: draft.type === "merchandise" ? Number(draft.priceMax) || Number(draft.price) : undefined,
      status: draft.type === "trailer" ? draft.status : undefined,
      youtube: extra.includes("youtube") ? youtubeId(draft.youtube) || undefined : undefined,
      video: extra.includes("video") ? draft.video.trim() || undefined : undefined,
      audio: draft.type === "audio" ? draft.audio.trim() : undefined,
      duration: draft.type === "audio" ? draft.duration : undefined,
      tags: draft.tags ? draft.tags.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean) : [],
    };
  };

  const preview = useMemo(() => {
    const item = buildItem();
    return { ...normalizeCustomItem({ ...item, title: item.title || "Untitled item", description: item.description || "Your description will appear here." }), uid: `preview:${item.uid}` };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const computeErrors = () => {
    const next = {};
    if (!draft.title.trim()) next.title = "Add a title.";
    if (draft.description.trim().length < 10) next.description = "Write at least 10 characters.";
    if (!draft.image.trim()) next.image = "Choose an image.";
    (required[draft.type] || []).forEach((key) => {
      if (!String(draft[key]).trim()) next[key] = `${labels[key]} is required.`;
    });
    if (draft.type === "merchandise" && Number(draft.priceMax) && Number(draft.priceMax) < Number(draft.price)) next.priceMax = "Deluxe price should be at least the standard price.";
    if ((draft.type === "trailer" || draft.type === "video") && !youtubeId(draft.youtube) && !draft.video.trim()) next.youtube = "Add a YouTube link or a video URL.";
    if (draft.youtube.trim() && !youtubeId(draft.youtube)) next.youtube = "That doesn’t look like a YouTube link — paste the full video URL or its 11-character ID.";
    if (draft.image.trim().startsWith("http") && !/^https:\/\/\S+$/.test(draft.image.trim())) next.image = "Image URLs must start with https://.";
    return next;
  };

  // Errors appear after the first submit and then update live as fields are fixed.
  const errors = submitted ? computeErrors() : {};

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = computeErrors();
    if (Object.keys(found).length) {
      focusFirstError(formRef.current, found);
      return;
    }
    const item = buildItem();
    if (isBuiltIn) {
      const patch = {
        title: item.title,
        description: item.description,
        image: resolveMedia(item.image) || item.image,
        featured: item.featured,
        hidden: item.hidden,
      };
      ["franchise", "date", "location", "kind", "status", "duration", "author", "readTime"].forEach((key) => {
        if (item[key] !== undefined) patch[key] = item[key];
      });
      if (item.traits) patch.traits = item.traits;
      if (item.type === "merchandise") {
        patch.price = item.price;
        patch.priceRange = [item.price, Math.max(item.price, item.priceMax)];
      }
      if (item.type === "article" && item.body) patch.body = item.body.split(/\n\s*\n/);
      saveOverride(existing.uid, patch, `Edited “${item.title}”`);
    } else {
      saveCustomItem(item);
    }
    toast("Reload the website to see the change.", { title: existing ? "Changes saved" : `“${item.title}” published` });
    navigate("/admin/content");
  };

  if (uid && !existing) {
    return (
      <PageHeader title="Item not found" description="It may have been deleted.">
        <Link to="/admin/content" className="adm-btn adm-btn-ghost"><ArrowLeft size={15} /> Back to content</Link>
      </PageHeader>
    );
  }

  const field = (key) => {
    const common = { name: key, value: draft[key], onChange: (event) => set(key, event.target.value), ...fieldA11y(`f-${key}`, errors[key]) };
    let control;
    if (key === "body") control = <textarea rows={8} {...common} />;
    else if (key === "status")
      control = (
        <select {...common}>
          <option value="upcoming">Upcoming</option>
          <option value="released">Recently released</option>
        </select>
      );
    else if (key === "date") control = <input type="date" {...common} />;
    else if (key === "price" || key === "priceMax") control = <input type="number" min="0" step="0.5" inputMode="decimal" {...common} />;
    else control = <input {...common} />;
    return (
      <label key={key} className={key === "body" ? "span-2" : ""} htmlFor={`f-${key}`}>
        <span>{labels[key]}{(required[draft.type] || []).includes(key) && " *"}</span>
        {control}
        <FieldError id={`f-${key}`} message={errors[key]} />
      </label>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow={existing ? (isBuiltIn ? "Edit built-in content" : "Edit added content") : "New content"}
        title={existing ? existing.title : "Add content"}
        description={isBuiltIn ? "Your edits are layered over the original JSON data and can be restored at any time." : "New items are stored in this browser and appear on the website after a reload."}
      >
        <Link to="/admin/content" className="adm-btn adm-btn-ghost"><ArrowLeft size={15} /> Back</Link>
      </PageHeader>

      <form ref={formRef} className="adm-editor" onSubmit={submit} noValidate>
        <div className="adm-editor-main">
          {Object.keys(errors).length > 0 && (
            <ErrorSummary
              errors={errors}
              labels={{ ...labels, title: "Title", description: "Description", image: "Image" }}
              onJump={(field) => focusFirstError(formRef.current, { [field]: true })}
            />
          )}
          <Panel title="Basics">
            <div className="adm-form adm-form-grid">
              <label htmlFor="f-type">
                <span>Content type</span>
                <select id="f-type" value={draft.type} onChange={(event) => set("type", event.target.value)} disabled={Boolean(existing)}>
                  {Object.entries(typeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label htmlFor="f-category">
                <span>Hub</span>
                <select id="f-category" value={draft.category} onChange={(event) => set("category", event.target.value)} disabled={Boolean(existing)}>
                  {baseCategories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
                </select>
              </label>
              <label className="span-2" htmlFor="f-title">
                <span>Title *</span>
                <input name="title" value={draft.title} onChange={(event) => set("title", event.target.value)} {...fieldA11y("f-title", errors.title)} />
                <FieldError id="f-title" message={errors.title} />
              </label>
              <label className="span-2" htmlFor="f-description">
                <span>Short description *</span>
                <textarea name="description" rows={3} value={draft.description} onChange={(event) => set("description", event.target.value)} {...fieldA11y("f-description", errors.description)} />
                <FieldError id="f-description" message={errors.description} />
              </label>
            </div>
          </Panel>

          <Panel title="Image *">
            <ImagePicker value={draft.image} onChange={(value) => set("image", value)} error={errors.image} />
            <FieldError id="f-image" message={errors.image} />
          </Panel>

          {extra.length > 0 && (
            <Panel title={`${typeLabels[draft.type]} details`}>
              <div className="adm-form adm-form-grid">{extra.map(field)}</div>
            </Panel>
          )}
        </div>

        <aside className="adm-editor-side">
          <Panel title="Visibility">
            <label className="adm-switch">
              <input type="checkbox" checked={draft.featured} onChange={(event) => set("featured", event.target.checked)} />
              <span />
              <div><strong>Featured</strong><small>Show in “Featured this week” and at the top of lists.</small></div>
            </label>
            <label className="adm-switch">
              <input type="checkbox" checked={draft.hidden} onChange={(event) => set("hidden", event.target.checked)} />
              <span />
              <div><strong>Hidden</strong><small>Keep it in the admin but hide it from visitors.</small></div>
            </label>
          </Panel>
          <Panel title="Live preview" className="adm-preview">
            <ContentCard item={preview} />
          </Panel>
          <div className="adm-editor-actions">
            <button type="submit" className="adm-btn adm-btn-primary"><Save size={16} /> {existing ? "Save changes" : "Publish item"}</button>
            <Link to="/admin/content" className="adm-btn adm-btn-ghost"><X size={16} /> Cancel</Link>
          </div>
        </aside>
      </form>
    </>
  );
}
