import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/WhereStarted.css";
import teamPhoto from "../../assets/hero_final.png";
import whereStarted from "../../assets/team/where-started.jpg";
import challengePhoto from "../../assets/HERO/Anime.jpeg";

gsap.registerPlugin(ScrollTrigger);

const story = [
  {
    type: "image",
    image: whereStarted,
    number: "01",
    title: "TICKET TO TECHWIZ",
  },
  {
    type: "text",
    number: "02",
    title: "WHY WE PARTICIPATED",
    text: "We wanted to step outside the classroom, challenge ourselves and experience what it really feels like to build something under pressure.",
  },
  {
    type: "image",
    image: teamPhoto,
    number: "03",
    title: "OUR TEAM",
  },
  {
    type: "text",
    number: "04",
    title: "BUILDING THE TEAM",
    text: "Different skills, different ideas and one common goal brought us together as a team.",
  },
  {
    type: "image",
    image: challengePhoto,
    number: "05",
    title: "THE CHALLENGE",
  },
  {
    type: "text",
    number: "06",
    title: "THE EXPERIENCE",
    text: "What started as a competition became a journey filled with learning, teamwork and unforgettable moments.",
  },
];

const WhereStarted = () => {
  const sectionRef = useRef(null);
  const panelsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean);

      gsap.from(".story_heading", {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story_heading",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(panels, {
        y: 90,
        opacity: 0,
        scale: 0.96,
        stagger: 0.15,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".story_track",
          start: "top 45%",
          toggleActions: "play none none reverse",
          // markers:true,
        },
      });

      panels.forEach((panel) => {
        const image = panel.querySelector(".story_image");

        panel.addEventListener("mouseenter", () => {
          panels.forEach((item) => {
            gsap.to(item, {
              flexGrow: item === panel ? 2.8 : 0.62,
              duration: 0.65,
              ease: "power3.out",
              overwrite: "auto",
            });
          });

          gsap.to(panel, {
            y: -18,
            zIndex: 20,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });

          if (image) {
            gsap.to(image, {
              scale: 1.06,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        });

        panel.addEventListener("mouseleave", () => {
          panels.forEach((item) => {
            gsap.to(item, {
              flexGrow: 1,
              y: 0,
              zIndex: 1,
              duration: 0.6,
              ease: "power3.out",
              overwrite: "auto",
            });
          });

          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="where_started" ref={sectionRef}>
      <div className="story_heading">
        <span className="story_eyebrow">
          <i></i>
          WHERE IT STARTED
        </span>

        <h2>
          THE FIRST
          <span>STEP.</span>
        </h2>

        <p>
          Every journey has a beginning. Ours started with a ticket,
          an idea and a team ready to see what we could achieve.
        </p>
      </div>

      <div className="story_track">
        {story.map((item, index) => (
          <article
            key={item.number}
            ref={(el) => (panelsRef.current[index] = el)}
            className={`story_panel ${item.type}`}
          >
            {item.type === "image" ? (
              <>
                <img
                  src={item.image}
                  alt={item.title}
                  className="story_image"
                />

                <div className="story_image_content">
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                </div>
              </>
            ) : (
              <div className="story_text">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default WhereStarted;