import { useRef, useState } from "react";
import { Bot, MessageSquarePlus, Pencil, Send, Trash2 } from "lucide-react";
import { knowledge, respond } from "../fandom/chatbotEngine";
import { deleteFaq, saveFaq, useAdminData } from "./adminStore";
import { EmptyState, PageHeader, Panel } from "./AdminUI";
import { FieldError, FieldHint } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, rules, toast, useConfirm, validateForm } from "../components/ui/feedback";

const newFaqId = () => `faq-${Date.now().toString(36)}`;

const blank = { id: "", keywords: "", answer: "", linkLabel: "", linkTo: "" };

export default function ChatbotManager() {
  const { faqs } = useAdminData();
  const [form, setForm] = useState(blank);
  const [submitted, setSubmitted] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState(null);
  const formRef = useRef(null);
  const confirm = useConfirm();

  const keywords = form.keywords.split(",").map((word) => word.trim().toLowerCase()).filter(Boolean);
  const taken = keywords.filter((word) => faqs.some((faq) => faq.id !== form.id && faq.keywords.includes(word)));
  const found = validateForm(form, {
    keywords: [rules.required("Add at least one keyword, e.g. “tickets”."), () => (taken.length ? `Already used by another answer: ${taken.join(", ")}.` : "")],
    answer: [rules.required("Write what Nova should reply."), rules.minLength(5, "Make the answer at least 5 characters.")],
    linkTo: [rules.pattern(/^\//, "Links must be site paths that start with “/”, like /Anime or /contact.")],
    linkLabel: [(value, values) => (value.trim() && !values.linkTo.trim() ? "Add a link path for this label, or clear the label." : "")],
  });
  const errors = submitted ? found : {};

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const edit = (faq) => {
    setSubmitted(false);
    setForm({ id: faq.id, keywords: faq.keywords.join(", "), answer: faq.answer, linkLabel: faq.links?.[0]?.label || "", linkTo: faq.links?.[0]?.to || "" });
  };

  const remove = async (faq) => {
    const ok = await confirm({ tone: "danger", title: "Delete this answer?", message: `Nova will stop answering “${faq.keywords[0]}” with it.`, confirmLabel: "Delete" });
    if (!ok) return;
    deleteFaq(faq.id);
    toast("Nova will fall back to the built-in answers.", { type: "info", title: "Answer deleted" });
  };

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(found).length) {
      focusFirstError(formRef.current, found);
      return;
    }
    saveFaq({
      id: form.id || newFaqId(),
      keywords,
      answer: form.answer.trim(),
      links: form.linkTo ? [{ label: form.linkLabel || "Open page", to: form.linkTo }] : undefined,
    });
    toast(`Nova now answers “${keywords[0]}”. Try it in the test box.`, { title: form.id ? "Answer updated" : "Answer added" });
    setForm(blank);
    setSubmitted(false);
  };

  return (
    <>
      <PageHeader eyebrow="Chatbot" title="Nova’s answers" description="Nova is rule-based: it matches keywords against a pre-scripted knowledge base. Answers you add here take priority over the built-in ones." />

      <div className="adm-grid adm-grid-2">
        <Panel title={form.id ? "Edit answer" : "Add an answer"}>
          <form ref={formRef} className="adm-form" onSubmit={submit} noValidate>
            <label htmlFor="faq-keywords">
              <span>Keywords that trigger it (comma separated)</span>
              <input name="keywords" value={form.keywords} onChange={set("keywords")} placeholder="tickets, entry fee, price of events" {...fieldA11y("faq-keywords", errors.keywords, true)} />
              {errors.keywords ? <FieldError id="faq-keywords" message={errors.keywords} /> : <FieldHint id="faq-keywords">Nova replies when a visitor’s message contains any of these.</FieldHint>}
            </label>
            <label htmlFor="faq-answer">
              <span>Nova’s answer</span>
              <textarea name="answer" rows={4} value={form.answer} onChange={set("answer")} placeholder="Most FandomVerse meetups are free to attend…" {...fieldA11y("faq-answer", errors.answer)} />
              <FieldError id="faq-answer" message={errors.answer} />
            </label>
            <div className="adm-form-grid">
              <label htmlFor="faq-linkLabel">
                <span>Link label (optional)</span>
                <input name="linkLabel" value={form.linkLabel} onChange={set("linkLabel")} placeholder="See events" {...fieldA11y("faq-linkLabel", errors.linkLabel)} />
                <FieldError id="faq-linkLabel" message={errors.linkLabel} />
              </label>
              <label htmlFor="faq-linkTo">
                <span>Link path (optional)</span>
                <input name="linkTo" value={form.linkTo} onChange={set("linkTo")} placeholder="/search?type=event" {...fieldA11y("faq-linkTo", errors.linkTo)} />
                <FieldError id="faq-linkTo" message={errors.linkTo} />
              </label>
            </div>
            <div className="adm-actions">
              <button type="submit" className="adm-btn adm-btn-primary"><MessageSquarePlus size={16} /> {form.id ? "Save answer" : "Add answer"}</button>
              {form.id && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => { setForm(blank); setSubmitted(false); }}>Cancel</button>}
            </div>
          </form>
        </Panel>

        <Panel title="Test Nova">
          <form
            className="adm-chat-test"
            onSubmit={(event) => {
              event.preventDefault();
              if (question.trim()) setReply(respond(question));
            }}
          >
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question as a visitor would…" aria-label="Test question" />
            <button type="submit" className="adm-btn adm-btn-primary" aria-label="Ask"><Send size={16} /></button>
          </form>
          {reply ? (
            <div className="adm-chat-reply">
              <span className="adm-badge info">{reply.source}</span>
              <p><Bot size={16} /> {reply.text}</p>
              {reply.items?.length > 0 && <small>Suggests: {reply.items.map((item) => item.title).join(", ")}</small>}
              {reply.links?.length > 0 && <small>Links: {reply.links.map((link) => `${link.label} (${link.to})`).join(", ")}</small>}
            </div>
          ) : (
            <p className="adm-muted">Type a question to see which rule answers it.</p>
          )}
        </Panel>
      </div>

      <Panel title={`Your answers (${faqs.length})`}>
        {faqs.length ? (
          <ul className="adm-faqs">
            {faqs.map((faq) => (
              <li key={faq.id}>
                <div>
                  <div className="adm-badges">{faq.keywords.map((word) => <span key={word} className="adm-chip">{word}</span>)}</div>
                  <p>{faq.answer}</p>
                  {faq.links && <small>→ {faq.links[0].label} ({faq.links[0].to})</small>}
                </div>
                <div className="adm-row-actions">
                  <button type="button" className="adm-icon-btn" onClick={() => edit(faq)} aria-label="Edit answer"><Pencil size={16} /></button>
                  <button type="button" className="adm-icon-btn danger" onClick={() => remove(faq)} aria-label="Delete answer"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Bot} title="No custom answers yet">
            <p>Add one above — it will be used by the chatbot on every page.</p>
          </EmptyState>
        )}
      </Panel>

      <Panel title={`Built-in knowledge base (${knowledge.intents.length} topics)`}>
        <ul className="adm-faqs adm-faqs-readonly">
          {knowledge.intents.map((intent) => (
            <li key={intent.id}>
              <div>
                <div className="adm-badges">{intent.keywords.slice(0, 5).map((word) => <span key={word} className="adm-chip">{word}</span>)}</div>
                <p>{intent.answer}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
