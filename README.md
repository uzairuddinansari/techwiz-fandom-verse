# FandomVerse — Portal for Fandom World

FandomVerse is a single-page web app that brings seven fandom hubs — **Anime, Gaming, Movies, TV Shows, K-Pop, Comics and Manga** — into one place. Each hub has articles, image galleries, videos, audio, character profiles, events, merchandise and trailers.

It is built with **React 19 + Vite**, styled with **plain CSS** (no CSS framework), and has **no backend**: all content comes from JSON files, and user data stays in the browser.

## Installation (mandatory)

Requirements: **Node.js 20 or newer** and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

The `dist/` folder is a static site and can be hosted on any static host (Netlify, Vercel, GitHub Pages). For client-side routes, configure the host to serve `index.html` for unknown paths.

## Features and where they live

| SRS requirement | Implementation |
| --- | --- |
| Home: logo, animated heading, intro | `components/Hero.jsx` (auto-rotating slider) |
| Category navigation | Image grid `CategoryShowcase` in `components/fandom/HomeSections.jsx`, plus the Menu |
| Featured content (rotating) | `FeaturedShowcase` — articles, trailers and events that rotate automatically |
| Category hubs with type / tag filters and sorting | `components/fandom/HubLayout.jsx` + `CategoryContent.jsx` |
| Global search, filtered by category and type | `pages/SearchPage.jsx` (search bar in the nav on every page) |
| Image galleries with lightbox | Gallery tab → `components/fandom/MediaModal.jsx` (arrows and ← → keys) |
| Videos and audio clips | YouTube / hosted video embeds and an HTML5 audio player in the same modal |
| Featured articles with a detail view and related content | `pages/DetailPage.jsx` |
| Character profiles (5+ per hub) | Characters tab, filterable by franchise |
| Events (3+ per hub) | Events tab plus a release calendar at `/releases` |
| Trailers filtered by release status | Trailers tab in every hub plus the `/Trailers` page |
| Merchandise and a cart with totals | `/shop` store → product page (edition, size, quantity) → `/cart` (promo codes, delivery, tax, total) |
| AI chatbot (rule-based) | `components/fandom/Chatbot.jsx`, answers from `JSON/chatbot.json` |
| Bookmarks, session-only notes, export | `pages/BookmarksPage.jsx` (localStorage + sessionStorage, .txt/.csv export) |
| Contact with Google Map and GPS | `pages/ContactPage.jsx` |
| About us | `pages/AboutPage.jsx` |
| Team portfolio (extra) | `/team` and `/team/:member` — skills, contributions, featured work and tools used, from `JSON/team.json` |
| Site map | `/sitemap` — every page, generated from `JSON/sitemap.json` and the hub catalog |
| Visitor counter and real-time clock | Bottom-left status bar (`components/fandom/SiteTools.jsx`) |
| Breadcrumbs | Every hub, section and detail page |
| Login / signup | `/account` — working client-side accounts from `JSON/users.json` (see below) |
| Admin panel (extra) | `/admin` — see below |

## User accounts and shop

**Demo accounts** (from `src/JSON/users.json`, passwords stored as SHA-256 hashes):

| Name | Email | Password |
| --- | --- | --- |
| Demo Fan | demo@fandomverse.example | Fandom@123 |
| Aiko Tanaka | aiko@fandomverse.example | Otaku#2026 |

The user journey:

1. **Browse** `/shop` — search, filter by hub, category, price and stock, and sort by price, rating or name.
2. **Product page** — choose an edition (Standard/Deluxe) and a size for apparel; quantity is capped by the stock in `shop.json`.
3. **Cart** `/cart` — change quantities, apply promo codes (`FANDOM10`, `FREESHIP`, and members-only `WELCOME5`), pick delivery and see subtotal, discount, delivery, tax and total.
4. **Log in or sign up** — checkout requires an account; the guest cart moves into the account on login and you return to checkout.
5. **Checkout** `/checkout` — delivery details only (no payment is collected), then an order confirmation at `/orders/:id`.
6. **Profile** `/profile` — overview, order history, wishlist, profile settings (name, bio, avatar colour, favourite hubs) and security (change password, log out, delete account).

Shop rules — shipping options, free-delivery threshold, tax rate, promo codes, sizes, stock, ratings and badges — all live in `src/JSON/shop.json`. New accounts, orders and carts are stored in the browser (`localStorage`), because the site cannot write to its JSON files.

## Admin panel

Open `/admin` and sign in with the demo account **admin / fandom2026** (a front-end demo gate — the SRS has no backend, so it is not real security).

- **Dashboard** — live content counts, page views for the last 14 days, visits, bookmarks, cart value, upcoming releases and recent admin activity.
- **Content** — search and filter all 300+ items by hub, type and state; feature, hide, edit or restore any item.
- **Add content** — create articles, characters, events, merchandise, trailers, videos, audio or gallery images, with an image picker for every bundled asset and a live card preview.
- **Customers** — every account (from `users.json` and browser sign-ups) with orders and spend, plus a recent-orders table.
- **Analytics** — page views and visits per day (7/14/30 days), views by hub, bookmarks by type and a full page table.
- **Chatbot** — add answers that take priority over the built-in knowledge base, and test how Nova replies.
- **Appearance** — six accessible theme presets, custom colours and fonts; applied to the whole site instantly.
- **Settings** — export/import all admin data as JSON, view browser storage, and reset data.

Admin changes are stored in `localStorage` and layered over the JSON files when the site loads (the JSON files are never modified). Reload the website to see content changes.

## Data

- `src/JSON/fandomCatalog.json` — galleries, videos, audio, characters, events, merchandise and trailers for every hub.
- `src/JSON/<Category>/*.json` — the articles for each hub.
- `src/JSON/chatbot.json` — the chatbot's FAQ answers, quick replies and recommendation rules.
- `src/JSON/shop.json` — shop rules, promo codes, shipping, and per-product stock, ratings and sizes.
- `src/JSON/users.json` — demo user accounts.
- `src/JSON/sitemap.json` — site map groups and pages.
- `src/JSON/team.json` — team members and studio contact details (replace the placeholders with your own).

Images are referenced by their path inside `src/assets` (for example `"Game_Article/ELDEN RING.png"`). `src/fandom/catalog.js` resolves every path to a bundled file, so adding content only means editing JSON.

## Assumptions

- There is no backend or database. The site never writes to its JSON files; bookmarks and the cart persist in `localStorage`, and notes are kept in `sessionStorage` only.
- Checkout, payment and real authentication are intentionally not included.
- The chatbot is pre-scripted and does not call any external AI service.
- The visitor counter is simulated per browser.
- Franchise names, artwork and trailers belong to their respective owners and are used for an educational, non-commercial project. Replace them with licensed or original media before any public or commercial use.

## AI tools used

AI assistants (such as Claude) helped with code suggestions, content drafting and debugging. All output was reviewed and adapted by the team.
