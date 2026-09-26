import { useState } from "react";
import { Check, Copy } from "lucide-react";

function Code({ children }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="guide-code">
      <pre><code>{children}</code></pre>
      <button type="button" onClick={copy} aria-label="Copy command">
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function Section({ id, number, title, children }) {
  return (
    <section id={id} className="guide-section">
      <span className="guide-section-number">{number}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

const structure = `src/
├── JSON/              content data (catalog, articles, chatbot, team)
├── assets/            images, videos and the logo
├── admin/             admin panel (dashboard, content, analytics …)
├── components/
│   ├── fandom/        shared UI: cards, hubs, modal, chatbot, cart
│   ├── Anim/ Comics/  bespoke hero sections
│   └── Mywebsite/     home sections and footer
├── fandom/            catalog, store (bookmarks/cart), analytics
├── pages/             search, detail, bookmarks, contact, about …
└── styles/            plain CSS files (no CSS framework)`;

export default function GuideSections() {
  return (
    <>
      <Section id="requirements" number="01" title="Requirements">
        <ul className="guide-list">
          <li><strong>Node.js 20 or newer</strong> (includes npm). Check with <code>node -v</code>.</li>
          <li>A modern browser — Chrome, Edge, Firefox or Safari (latest versions).</li>
          <li>Any code editor, such as Visual Studio Code.</li>
          <li>An internet connection for fonts, YouTube embeds and the Google Map (everything else is bundled).</li>
        </ul>
      </Section>

      <Section id="installation" number="02" title="Installation">
        <p>Unzip the source code (or clone the repository), open a terminal in the project folder and install the dependencies:</p>
        <Code>npm install</Code>
      </Section>

      <Section id="environment" number="03" title="Environment">
        <p>
          No environment variables, API keys or databases are required. FandomVerse is front-end only: content is read from JSON files
          and visitor data (bookmarks, cart, notes, theme) is stored in the browser.
        </p>
      </Section>

      <Section id="admin" number="04" title="Admin Panel">
        <p>Open <code>/admin</code> and sign in with the demo account:</p>
        <Code>{"Username: admin\nPassword: fandom2026"}</Code>
        <p>
          From the admin panel you can add or edit content, hide or feature items, manage chatbot answers, change the site theme and
          view analytics. Changes are kept in the browser and can be exported or imported as JSON from <strong>Settings</strong>.
        </p>
      </Section>

      <Section id="structure" number="05" title="Project Structure">
        <Code>{structure}</Code>
      </Section>

      <Section id="run" number="06" title="Run Project">
        <p>Start the development server, then open the address it prints (normally http://localhost:5173):</p>
        <Code>npm run dev</Code>
      </Section>

      <Section id="production" number="07" title="Production">
        <p>Create an optimised build and preview it locally:</p>
        <Code>{"npm run build\nnpm run preview"}</Code>
        <p>
          Upload the <code>dist/</code> folder to any static host (Netlify, Vercel, GitHub Pages). Configure the host to serve
          <code> index.html</code> for unknown paths so routes such as <code>/Anime/gallery</code> work on refresh.
        </p>
      </Section>

      <Section id="troubleshooting" number="08" title="Troubleshooting">
        <dl className="guide-faq">
          <dt>“npm is not recognised”</dt>
          <dd>Install Node.js from nodejs.org and reopen the terminal.</dd>
          <dt>Port already in use</dt>
          <dd>Run <code>npm run dev -- --port 5174</code> to use another port.</dd>
          <dt>A page shows 404 after refreshing on a host</dt>
          <dd>Add a rewrite of all paths to <code>/index.html</code> (see Production).</dd>
          <dt>Admin changes are not visible on the site</dt>
          <dd>Reload the website — the catalog reads admin data when the page loads.</dd>
          <dt>Videos or the map do not load</dt>
          <dd>They are embedded from YouTube and Google Maps, so an internet connection is required.</dd>
        </dl>
      </Section>
    </>
  );
}
