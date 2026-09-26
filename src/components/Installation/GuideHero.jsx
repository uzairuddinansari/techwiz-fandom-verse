import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

function GuideHero() {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      timeline
        .from(".guide-hero-eyebrow", {
          opacity: 0,
          y: 18,
          duration: 0.6
        })
        .from(
          ".guide-hero-title",
          {
            opacity: 0,
            y: 35,
            duration: 0.8
          },
          "-=0.3"
        )
        .from(
          ".guide-hero-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.6
          },
          "-=0.45"
        )
        .from(
          ".guide-hero-actions",
          {
            opacity: 0,
            y: 18,
            duration: 0.5
          },
          "-=0.35"
        )
        .from(
          ".guide-hero-orbit",
          {
            opacity: 0,
            scale: 0.85,
            duration: 1
          },
          "-=0.6"
        );
    }, heroRef);

    return () => context.revert();
  }, []);

  return (
    <section
      id="introduction"
      ref={heroRef}
      className="guide-hero"
    >
      <div className="guide-hero-content">
        <span className="guide-hero-eyebrow">
          INSTALLATION / DOCUMENTATION
        </span>

        <h2 className="guide-hero-title">
          Get your project
          <br />
          <span>running the right way.</span>
        </h2>

        <p className="guide-hero-description">
          A complete guide to installing, configuring, and running
          the project from your local development environment.
        </p>

        <div className="guide-hero-actions">
          <button
            className="guide-primary-button"
            onClick={() =>
              document.getElementById("requirements")?.scrollIntoView({
                behavior: "smooth"
              })
            }
          >
            Start Installation
            <span>→</span>
          </button>

          <button
            className="guide-secondary-button"
            onClick={() =>
              document.getElementById("requirements")?.scrollIntoView({
                behavior: "smooth"
              })
            }
          >
            View Requirements
          </button>
        </div>
      </div>

      <div className="guide-hero-orbit">
        <div className="guide-orbit-ring guide-orbit-ring-one" />
        <div className="guide-orbit-ring guide-orbit-ring-two" />

        <div className="guide-orbit-core">
          <span>ROBOT</span>
          <strong>01</strong>
        </div>

        <span className="guide-orbit-label guide-orbit-label-one">
          SETUP
        </span>

        <span className="guide-orbit-label guide-orbit-label-two">
          BUILD
        </span>
      </div>
    </section>
  );
}

export default GuideHero;