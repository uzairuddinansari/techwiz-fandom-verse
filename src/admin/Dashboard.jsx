import { Link } from "react-router-dom";
import { Bookmark, CalendarClock, Eye, EyeOff, FilePlus2, Layers, Palette, ShoppingBag, Sparkles, Users } from "lucide-react";
import { formatDate, formatPrice, typeLabels } from "../fandom/catalog";
import { cartTotals, useBookmarks, useCart } from "../fandom/store";
import { dailySeries, readAnalytics } from "../fandom/analytics";
import useAdminCatalog from "./useAdminCatalog";
import { BarList, ColumnChart, PageHeader, Panel, StatCard } from "./AdminUI";

const shortDay = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export default function Dashboard() {
  const { categories, items, adminData } = useAdminCatalog();
  const bookmarks = useBookmarks();
  const cart = useCart();
  const analytics = readAnalytics();
  const series = dailySeries(14);
  const totalViews = Object.values(analytics.pageViews).reduce((sum, value) => sum + value, 0);
  const today = series.at(-1);
  const live = items.filter((item) => !item.hidden);
  const hidden = items.length - live.length;
  const { subtotal } = cartTotals(cart);

  const perHub = categories.map((category) => ({ label: category.name, value: category.items.filter((item) => !item.hidden).length }));
  const perType = Object.entries(typeLabels)
    .map(([type, label]) => ({ label, value: live.filter((item) => item.type === type).length }))
    .sort((a, b) => b.value - a.value);
  const upcoming = live
    .filter((item) => item.status === "upcoming" && item.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  const topPages = Object.entries(analytics.pageViews).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader eyebrow="Overview" title={`${greeting}, admin`} description="Here’s how FandomVerse is doing in this browser today.">
        <Link to="/admin/content/new" className="adm-btn adm-btn-primary"><FilePlus2 size={16} /> Add content</Link>
      </PageHeader>

      <div className="adm-stats">
        <StatCard icon={Layers} label="Live content" value={live.length} hint={`${adminData.items.length} added by admin`} />
        <StatCard icon={Eye} label="Page views" value={totalViews.toLocaleString()} hint={`${today.views} today`} tone="accent" />
        <StatCard icon={Users} label="Visits" value={analytics.sessions.toLocaleString()} hint="Browser sessions" />
        <StatCard icon={Bookmark} label="Bookmarks" value={bookmarks.length} hint="Saved in this browser" />
        <StatCard icon={ShoppingBag} label="Cart value" value={formatPrice(subtotal)} hint={`${cart.length} product lines`} />
        <StatCard icon={EyeOff} label="Hidden items" value={hidden} hint="Not shown on the site" />
      </div>

      <div className="adm-grid adm-grid-2-1">
        <Panel title="Page views — last 14 days" action={<Link to="/admin/analytics" className="adm-link">Full analytics →</Link>}>
          <ColumnChart data={series} valueKey="views" labelKey="date" formatLabel={(date, index) => (index === undefined || index % 2 === 0 ? shortDay(date) : "")} unit=" views" />
        </Panel>
        <Panel title="Content by hub">
          <BarList data={perHub} />
        </Panel>
      </div>

      <div className="adm-grid adm-grid-3">
        <Panel title="Content by type">
          <BarList data={perType} />
        </Panel>

        <Panel title="Coming up" action={<Link to="/releases" className="adm-link">Calendar →</Link>}>
          <ul className="adm-list">
            {upcoming.map((item) => (
              <li key={item.uid}>
                <img src={item.image} alt="" />
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.categoryName} · {typeLabels[item.type]}</small>
                </div>
                <time><CalendarClock size={13} /> {formatDate(item.date, { day: "numeric", month: "short" })}</time>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent admin activity">
          {adminData.activity.length ? (
            <ul className="adm-activity">
              {adminData.activity.slice(0, 7).map((entry, index) => (
                <li key={index}>
                  <span />
                  <div>
                    <p>{entry.message}</p>
                    <small>{new Date(entry.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="adm-muted">No changes yet. Edits, new content and theme changes will appear here.</p>
          )}
        </Panel>
      </div>

      <div className="adm-grid adm-grid-2">
        <Panel title="Most viewed pages">
          {topPages.length ? (
            <table className="adm-table adm-table-compact">
              <thead>
                <tr><th>Page</th><th className="num">Views</th></tr>
              </thead>
              <tbody>
                {topPages.map(([page, views]) => (
                  <tr key={page}><td><code>{page}</code></td><td className="num">{views}</td></tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-muted">Browse the website to collect page views.</p>
          )}
        </Panel>
        <Panel title="Quick actions">
          <div className="adm-quick">
            <Link to="/admin/content/new?type=merchandise"><ShoppingBag size={18} /> Add merchandise</Link>
            <Link to="/admin/content/new?type=event"><CalendarClock size={18} /> Add an event</Link>
            <Link to="/admin/content/new?type=article"><Sparkles size={18} /> Write an article</Link>
            <Link to="/admin/appearance"><Palette size={18} /> Change the theme</Link>
          </div>
        </Panel>
      </div>
    </>
  );
}
