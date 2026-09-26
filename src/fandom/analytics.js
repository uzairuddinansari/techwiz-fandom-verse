/*
  Browser-only analytics for the admin dashboard (no server, per the SRS).
  Records page views per route and visits per day in localStorage.
*/
const KEY = "fandomverse_analytics";

const empty = () => ({ pageViews: {}, days: {}, sessions: 0, firstSeen: new Date().toISOString() });

export const readAnalytics = () => {
  try {
    return { ...empty(), ...JSON.parse(localStorage.getItem(KEY)) };
  } catch {
    return empty();
  }
};

const save = (data) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked */
  }
};

const todayKey = () => new Date().toISOString().slice(0, 10);

/* Normalise /detail/anime/character/naruto → /detail/anime/character so the table stays readable. */
const routeKey = (pathname) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "detail") return `/detail/${parts[1]}/${parts[2]}`;
  return `/${parts.join("/")}`.toLowerCase();
};

export const trackPageView = (pathname) => {
  if (pathname.startsWith("/admin")) return;
  const data = readAnalytics();
  const key = routeKey(pathname);
  data.pageViews[key] = (data.pageViews[key] || 0) + 1;
  const day = todayKey();
  data.days[day] = data.days[day] || { views: 0, visits: 0 };
  data.days[day].views += 1;
  try {
    if (!sessionStorage.getItem("fandomverse_session")) {
      sessionStorage.setItem("fandomverse_session", "1");
      data.sessions += 1;
      data.days[day].visits += 1;
    }
  } catch {
    /* sessionStorage blocked */
  }
  save(data);
};

export const resetAnalytics = () => save(empty());

/* Last `count` days, oldest first, with zeroes for days without traffic. */
export const dailySeries = (count = 14) => {
  const { days } = readAnalytics();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - 1 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key, views: days[key]?.views || 0, visits: days[key]?.visits || 0 };
  });
};
