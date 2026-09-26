import { useState } from "react";
import { Bookmark, Eye, MousePointerClick, RotateCcw, Users } from "lucide-react";
import { baseCategories, typeLabels } from "../fandom/catalog";
import { useBookmarks } from "../fandom/store";
import { dailySeries, readAnalytics, resetAnalytics } from "../fandom/analytics";
import { logActivity } from "./adminStore";
import { BarList, ColumnChart, PageHeader, Panel, StatCard } from "./AdminUI";
import { toast, useConfirm } from "../components/ui/feedback";

const shortDay = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const hubForRoute = (route) => {
  const parts = route.split("/").filter(Boolean);
  const segment = parts[0] === "detail" ? parts[1] : parts[0];
  return baseCategories.find((category) => category.slug === segment || category.path.slice(1).toLowerCase() === segment);
};

export default function AnalyticsPage() {
  const [range, setRange] = useState(14);
  const [, setVersion] = useState(0);
  const analytics = readAnalytics();
  const bookmarks = useBookmarks();
  const series = dailySeries(range);
  const pages = Object.entries(analytics.pageViews).sort((a, b) => b[1] - a[1]);
  const totalViews = pages.reduce((sum, [, views]) => sum + views, 0);
  const rangeViews = series.reduce((sum, day) => sum + day.views, 0);
  const rangeVisits = series.reduce((sum, day) => sum + day.visits, 0);

  const hubViews = baseCategories
    .map((category) => ({
      label: category.name,
      value: pages.filter(([route]) => hubForRoute(route)?.slug === category.slug).reduce((sum, [, views]) => sum + views, 0),
    }))
    .sort((a, b) => b.value - a.value);

  const savedByType = Object.entries(typeLabels)
    .map(([type, label]) => ({ label, value: bookmarks.filter((item) => item.type === type).length }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);

  const confirm = useConfirm();
  const reset = async () => {
    const ok = await confirm({ tone: "danger", title: "Reset visitor statistics?", message: "Page views and visit counts for this browser will start again from zero.", confirmLabel: "Reset" });
    if (!ok) return;
    resetAnalytics();
    logActivity("Reset visitor statistics");
    setVersion((value) => value + 1);
    toast("Statistics will start collecting again as people browse.", { type: "info", title: "Analytics reset" });
  };

  return (
    <>
      <PageHeader eyebrow="Analytics" title="Visitors & engagement" description="Collected privately in this browser’s local storage — no tracking service or server is used.">
        <div className="adm-segment" role="group" aria-label="Date range">
          {[7, 14, 30].map((days) => (
            <button key={days} type="button" className={range === days ? "active" : ""} aria-pressed={range === days} onClick={() => setRange(days)}>
              {days} days
            </button>
          ))}
        </div>
        <button type="button" className="adm-btn adm-btn-ghost" onClick={reset}><RotateCcw size={15} /> Reset</button>
      </PageHeader>

      <div className="adm-stats adm-stats-4">
        <StatCard icon={Eye} label={`Views · ${range} days`} value={rangeViews.toLocaleString()} tone="accent" />
        <StatCard icon={Users} label={`Visits · ${range} days`} value={rangeVisits.toLocaleString()} />
        <StatCard icon={MousePointerClick} label="Views per visit" value={rangeVisits ? (rangeViews / rangeVisits).toFixed(1) : "0"} />
        <StatCard icon={Bookmark} label="Bookmarks" value={bookmarks.length} />
      </div>

      <Panel title={`Page views per day — last ${range} days`}>
        <ColumnChart
          data={series}
          valueKey="views"
          labelKey="date"
          unit=" views"
          height={240}
          formatLabel={(date, index) => {
            if (index === undefined) return shortDay(date);
            const every = range > 14 ? 5 : range > 7 ? 2 : 1;
            return index % every === 0 ? shortDay(date) : "";
          }}
        />
      </Panel>

      <div className="adm-grid adm-grid-2">
        <Panel title="Views by hub">
          <BarList data={hubViews} />
        </Panel>
        <Panel title="Bookmarks by content type">
          {savedByType.length ? <BarList data={savedByType} /> : <p className="adm-muted">No bookmarks yet.</p>}
        </Panel>
      </div>

      <Panel title={`All pages (${pages.length})`}>
        {pages.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table adm-table-compact">
              <thead>
                <tr><th>Page</th><th>Hub</th><th className="num">Views</th><th className="num">Share</th></tr>
              </thead>
              <tbody>
                {pages.map(([route, views]) => (
                  <tr key={route}>
                    <td><code>{route}</code></td>
                    <td>{hubForRoute(route)?.name || "—"}</td>
                    <td className="num">{views}</td>
                    <td className="num">{((views / totalViews) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-muted">No page views recorded yet — browse the website and come back.</p>
        )}
      </Panel>
    </>
  );
}
