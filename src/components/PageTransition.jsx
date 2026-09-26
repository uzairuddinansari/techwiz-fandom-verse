import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/PageTransition.css";

/* Hubs keep one key for all their tabs so the hero doesn't replay when switching sections. */
const HUBS = ["anime", "gaming", "movies", "tv_shows", "k_pop", "comics", "manga", "trailers", "team"];

const transitionKey = (pathname) => {
  const first = pathname.split("/")[1]?.toLowerCase() || "home";
  return HUBS.includes(first) ? first : pathname.toLowerCase();
};

/*
  Smooth route changes: a slim progress bar across the top, and the new page
  fading up into place. Uses only opacity/transform, so it stays on the GPU
  and never blocks scrolling. Honours prefers-reduced-motion via CSS.
*/
function PageTransition({ children }) {
  const { pathname } = useLocation();
  const key = transitionKey(pathname);
  const [progressKey, setProgressKey] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setProgressKey((value) => value + 1);
  }, [pathname]);

  return (
    <>
      {progressKey > 0 && <span key={progressKey} className="route-progress" aria-hidden="true" />}
      <div key={key} className="route-view">
        {children}
      </div>
    </>
  );
}

export default PageTransition;
