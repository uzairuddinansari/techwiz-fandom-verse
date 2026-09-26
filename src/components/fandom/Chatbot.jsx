import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bot, MessageCircle, RotateCcw, Send, X } from "lucide-react";
import { hrefFor, knowledge, respond } from "../../fandom/chatbotEngine";

const initialMessages = () => [{ from: "bot", text: knowledge.greeting, quickReplies: knowledge.quickReplies }];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = (value) => {
    if (!value.trim() || typing) return;
    setMessages((current) => [...current, { from: "user", text: value.trim() }]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { from: "bot", ...respond(value) }]);
      setTyping(false);
    }, 450);
  };

  const last = messages[messages.length - 1];

  return (
    <>
      {open && (
        <aside className="fv-chat" role="dialog" aria-label="Nova chat assistant">
          <header>
            <span className="fv-chat-avatar"><Bot size={20} /></span>
            <div>
              <strong>Nova</strong>
              <small><i /> FandomVerse guide · replies instantly</small>
            </div>
            <button type="button" onClick={() => setMessages(initialMessages())} aria-label="Restart conversation">
              <RotateCcw size={16} />
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </header>

          <div className="fv-chat-log" ref={logRef} aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className={`fv-chat-message ${message.from}`}>
                <p>{message.text}</p>
                {message.items?.length > 0 && (
                  <ul className="fv-chat-items">
                    {message.items.map((item) => (
                      <li key={item.uid}>
                        <Link to={hrefFor(item)} onClick={() => setOpen(false)}>
                          <img src={item.image} alt="" />
                          <span>
                            <strong>{item.title}</strong>
                            <small>{item.categoryName}</small>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {message.links?.length > 0 && (
                  <div className="fv-chat-links">
                    {message.links.map((link) => (
                      <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>{link.label} →</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="fv-chat-message bot fv-typing" aria-label="Nova is typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          {!typing && last.from === "bot" && (
            <div className="fv-chat-quick" aria-label="Suggested questions">
              {(last.quickReplies || knowledge.quickReplies.slice(0, 3)).map((reply) => (
                <button key={reply} type="button" onClick={() => send(reply)}>{reply}</button>
              ))}
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor="nova-input">Ask Nova</label>
            <input id="nova-input" ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a fandom…" autoComplete="off" />
            <button type="submit" aria-label="Send" disabled={!input.trim()}>
              <Send size={17} />
            </button>
          </form>
        </aside>
      )}

      <button type="button" className={`fv-chat-launch ${open ? "is-open" : ""}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close chat" : "Chat with Nova"}>
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span>{open ? "Close" : "Ask Nova"}</span>
      </button>
    </>
  );
}
