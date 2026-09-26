import { useEffect, useState } from "react";
import GuideHeader from "../components/Installation/GuideHeader";
import GuideHero from "../components/Installation/GuideHero";
import GuideNavigation from "../components/Installation/GuideNavigation";
import { guideSections } from "../components/Installation/guideSectionList";
import GuideSections from "../components/Installation/GuideSections";
import "../styles/InstallationGuide.css";

const HEADER_OFFSET = 120;

function InstallationGuide() {
  const [navOpen, setNavOpen] = useState(() => !window.matchMedia?.("(max-width: 760px)").matches);
  const [active, setActive] = useState(guideSections[0].id);
  const [progress, setProgress] = useState(0);

  // The active section is the last one whose top has scrolled under the header.
  useEffect(() => {
    const onScroll = () => {
      let current = guideSections[0].id;
      guideSections.forEach(({ id }) => {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= HEADER_OFFSET) current = id;
      });
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setActive(current);
      setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (window.matchMedia?.("(max-width: 760px)").matches) setNavOpen(false);
  };

  return (
    <div className={`installation-page ${navOpen ? "guide-nav-open" : "guide-nav-closed"}`}>
      <GuideHeader navOpen={navOpen} onToggleNav={() => setNavOpen((open) => !open)} />

      <div className="installation-layout">
        <GuideNavigation active={active} progress={progress} onSelect={goTo} />
        {navOpen && <button type="button" className="guide-nav-scrim" aria-label="Close guide menu" onClick={() => setNavOpen(false)} />}

        <main className="installation-content">
          <GuideHero />

          <GuideSections />
        </main>
      </div>
    </div>
  );
}

export default InstallationGuide;
