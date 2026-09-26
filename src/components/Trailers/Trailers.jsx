import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import "../../styles/Trailers.css";

export default function Trailers() {
  const location = useLocation();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".trailers-header",
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out"
        }
      );

      gsap.fromTo(
        ".trailers-tabs",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.1,
          ease: "power3.out"
        }
      );

      gsap.fromTo(
        ".trailer-card",
        {
          y: 70,
          opacity: 0,
          scale: 0.96
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.15,
          stagger: 0.08,
          ease: "power4.out"
        }
      );
    });

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
    <section className="trailers-page">
      <div className="trailers-header">
        <h1>Trailers</h1>
        <p>Every category's trailers in one aggregated feed.</p>
      </div>

      <nav className="trailers-tabs">
        <NavLink
          to="/Trailers"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          All
        </NavLink>

        <NavLink
          to="/Trailers/upcoming"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Upcoming
        </NavLink>

        <NavLink
          to="/Trailers/recently-released"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Recently Released
        </NavLink>
      </nav>

      <Outlet />
    </section>
    </>
  );
}