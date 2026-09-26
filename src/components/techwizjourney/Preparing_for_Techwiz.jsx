import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/Preparing_for_Techwiz.css";

import image1 from "../../assets/hero_final.png";
import image2 from "../../assets/hero_final.png";
import image3 from "../../assets/hero_final.png";
import image4 from "../../assets/hero_final.png";

gsap.registerPlugin(ScrollTrigger);

const processItems = [
  {
    number: "01",
    title: "PRACTICE",
    text: "Built our skills and improved every day.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "DEVELOPMENT",
    text: "Turned ideas into real solutions.",
    icon: "</>",
  },
  {
    number: "03",
    title: "TEAM MEETINGS",
    text: "Planned, aligned and moved forward together.",
    icon: "♧",
  },
  {
    number: "04",
    title: "IDEAS DISCUSSING",
    text: "Shared thoughts and explored possibilities.",
    icon: "✦",
  },
  {
    number: "05",
    title: "PROBLEM SOLVING",
    text: "Faced challenges and found better ways.",
    icon: "⚙",
  },
  {
    number: "06",
    title: "REVISIONS",
    text: "Refined, improved and made it stronger.",
    icon: "↻",
  },
  {
    number: "07",
    title: "LATE-NIGHT WORK",
    text: "Because great things take time and coffee.",
    icon: "☾",
  },
  {
    number: "08",
    title: "GUIDANCE",
    text: "Learned from our teachers and mentors.",
    icon: "◇",
  },
];

export default function PreparingTechwiz() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".tw-process-heading", {
        scrollTrigger: {
          trigger: ".tw-process",
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".tw-process-description", {
        scrollTrigger: {
          trigger: ".tw-process",
          start: "top 75%",
          once: true,
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.15,
        ease: "power3.out",
      });

      gsap.from(".tw-process-item", {
        scrollTrigger: {
          trigger: ".tw-process-grid",
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        y: 45,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      gsap.from(".tw-gallery-card", {
        scrollTrigger: {
          trigger: ".tw-gallery",
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        scale: 0.9,
        y: 45,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(".tw-behind", {
        scrollTrigger: {
          trigger: ".tw-behind",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        x: 50,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.to(".tw-arrow", {
        x: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      gsap.utils.toArray(".tw-process-item").forEach((item) => {
        const icon = item.querySelector(".tw-process-icon");

        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            y: -7,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.15,
            rotate: 6,
            duration: 0.3,
            ease: "back.out(2)",
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
          });
        });
      });

      gsap.utils.toArray(".tw-gallery-card").forEach((card) => {
        const image = card.querySelector("img");

        card.addEventListener("mouseenter", () => {
          gsap.to(image, {
            scale: 1.08,
            duration: 0.7,
            ease: "power3.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
          });
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="tw-page" ref={pageRef}>
      <div className="tw-container">
        <div className="tw-process">
          <div className="tw-process-content">
            <div className="tw-eyebrow">
              <span></span>
              WHAT WE DID
            </div>

            <h2 className="tw-process-heading">
              THE PROCESS
            </h2>

            <p className="tw-process-description">
              This phase was all about turning our potential into progress.
              We worked hard, supported each other, and made sure every
              step brought us closer to our goal.
            </p>

            <div className="tw-process-grid">
              {processItems.map((item) => (
                <div className="tw-process-item" key={item.number}>
                  <div className="tw-process-icon">
                    {item.icon}
                  </div>

                  <div className="tw-process-label">
                    <span>{item.number}</span>
                    <h3>{item.title}</h3>
                  </div>

                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="tw-gallery">
            <div className="tw-gallery-row">
              <div className="tw-gallery-card">
                <img src={image1} alt="Team collaboration" />
              </div>

              <div className="tw-gallery-card">
                <img src={image2} alt="Techwiz teamwork" />
              </div>
            </div>

            <div className="tw-gallery-row">
              <div className="tw-gallery-card">
                <img src={image3} alt="Techwiz development" />
              </div>

              <div className="tw-gallery-card">
                <img src={image4} alt="Techwiz team meeting" />
              </div>
            </div>

            <div className="tw-behind">
              <div className="tw-camera">
                ◉
              </div>

              <div>
                <span>BEHIND THE SCENES</span>
                <p>
                  Moments, progress and the people who made it happen.
                </p>
              </div>

              <div className="tw-arrow">
                →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}