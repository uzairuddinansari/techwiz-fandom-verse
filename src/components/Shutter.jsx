import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../styles/Shutter.css";
import { Link, useLocation } from "react-router-dom";
import { categories } from "../fandom/catalog";
import animeArt from "../assets/HERO/Anime.jpeg";
import kpopArt from "../assets/HERO/K_pop.jpeg";
import comicsArt from "../assets/Comics_hero/Comics_hero.jpeg";

const projects = [
  {
    title: "Seven Fandom Worlds",
    description: "Explore Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga through one visually rich portal.",
    location: "FANDOMVERSE",
    size: "7 HUBS",
    time: "ALWAYS OPEN",
    image: animeArt
  },
  {
    title: "Stories in Motion",
    description: "Discover original features, trailers, galleries, audio, characters, events, and upcoming releases.",
    location: "MEDIA ARCHIVE",
    size: "150+ ITEMS",
    time: "LOCAL FIRST",
    image: kpopArt
  },
  {
    title: "Your Collection",
    description: "Bookmark discoveries, attach personal notes, export your list, and build a temporary merchandise cart.",
    location: "YOUR BROWSER",
    size: "PRIVATE",
    time: "SESSION READY",
    image: comicsArt
  }
];

const RollingLink = ({ to, children }) => {
  const text = String(children);

  return (
    <Link to={to} className="rolling_link">
      <span className="rolling_mask">
        <span className="rolling_line rolling_current">
          {text.split("").map((char, i) => (
            <span key={i}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>

        <span className="rolling_line rolling_next" aria-hidden="true">
          {text.split("").map((char, i) => (
            <span key={i}>{char === " " ? "\u00A0" : char}</span>
          ))}
        </span>
      </span>
    </Link>
  );
};

const Shutter = ({ open, setOpen }) => {
  const shutterRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const metaRef = useRef(null);
  const imageRef = useRef(null);
  const nextImageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const titleClipRef = useRef(null);
  const tl = useRef(null);

  const [active, setActive] = useState(0);
  const { pathname } = useLocation();

  // Close the menu whenever a link inside it changes the route.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  const project = projects[active];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(shutterRef.current, {
        visibility: "hidden",
        pointerEvents: "none"
      });

      gsap.set(leftRef.current, {
        xPercent: -100,
        opacity: 0,
      });

      gsap.set(rightRef.current, {
        xPercent: 100,
        opacity: 0,
      });

      gsap.set(leftContentRef.current, {
        opacity: 0,
        x: -35
      });

      gsap.set(rightContentRef.current, {
        opacity: 0,
        x: 35
      });

      gsap.set(metaRef.current, {
        opacity: 0,
        y: -30
      });

      gsap.set(titleRef.current, {
        opacity: 0,
        y: 40
      });

      tl.current = gsap.timeline({ paused: true });

      tl.current
        .set(shutterRef.current, {
          visibility: "visible",
          pointerEvents: "auto"
        })
        .to(leftRef.current, {
          xPercent: 0,
          duration: 1.15,
          ease: "power4.inOut"
        }, 0)
        .to(rightRef.current, {
          xPercent: 0,
          duration: 1.15,
          ease: "power4.inOut"
        }, 0)
        .to(leftRef.current, {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out"
        }, 0.72)
        .to(rightRef.current, {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out"
        }, 0.72)
        .to(leftContentRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        }, 0.78)
        .to(rightContentRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out"
        }, 0.78)
        .to(metaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out"
        }, 0.85)
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, 0.8);
    }, shutterRef);

    return () => {
      ctx.revert();
      tl.current?.kill();
    };
  }, []);

  useLayoutEffect(() => {
    if (!tl.current) return;

    if (open) {
      tl.current.play();
    } else {
      tl.current.reverse();

      tl.current.eventCallback("onReverseComplete", () => {
        gsap.set(shutterRef.current, {
          visibility: "hidden",
          pointerEvents: "none"
        });
      });
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      const next = (active + 1) % projects.length;

      gsap.set(nextImageRef.current, {
        src: projects[next].image,
        opacity: 0,
        scale: 1.03
      });

      gsap.timeline()
        .to(imageRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, 0)
        .to(nextImageRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.inOut"
        }, 0)
        .call(() => {
          setActive(next);
          gsap.set(imageRef.current, { opacity: 1 });
          gsap.set(nextImageRef.current, { opacity: 0 });
        });
    }, 5000);

    return () => clearInterval(interval);
  }, [open, active]);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 1,
      ease: "power3.out"
    });

    gsap.to(metaRef.current, {
      y: -55,
      duration: 0.7,
      ease: "power3.out"
    });

    gsap.to(titleRef.current, {
      y: "-30%",
      duration: 0.65,
      ease: "power3.inOut"
    });

    gsap.to(descriptionRef.current, {
      y: "0%",
      duration: 0.7,
      ease: "power3.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 1,
      ease: "power3.out"
    });

    gsap.to(metaRef.current, {
      y: 0,
      duration: 0.7,
      ease: "power3.out"
    });

    gsap.to(titleRef.current, {
      y: "0%",
      duration: 0.65,
      ease: "power3.inOut"
    });

    gsap.set(descriptionRef.current, {
      y: "200%"
    });

    gsap.to(descriptionRef.current, {
      y: "200%",
      duration: 0.6,
      ease: "power3.inOut"
    });
  };

  return (
    <div ref={shutterRef} className="shutter">
      <div ref={leftRef} className="shutter_left">
        <div className="shutter_top">
          <div>
            <div className="brand">
              <span className="brand_mark">///</span>
              <span>FANDOMVERSE</span>
            </div>

            <div className="brand_subtitle">
              PORTAL FOR FANDOM WORLD — EST. 2026
            </div>
          </div>

          <button className="shutter_close" onClick={() => setOpen(false)} aria-label="Close menu">
            ×
          </button>
        </div>

        <div ref={leftContentRef} className="left_content">
          <nav className="shutter_links">
            <RollingLink to="/">Home</RollingLink>
            <RollingLink to="/shop">Shop</RollingLink>
            <RollingLink to="/Trailers">Trailers</RollingLink>
            <RollingLink to="/releases">Releases</RollingLink>
            <RollingLink to="/search">Explore</RollingLink>
            <RollingLink to="/bookmarks">Bookmarks</RollingLink>
            <RollingLink to="/about">About</RollingLink>
            <RollingLink to="/team">Team</RollingLink>
            <RollingLink to="/contact">Contact</RollingLink>
            <RollingLink to="/profile">My account</RollingLink>
            <RollingLink to="/admin">Admin</RollingLink>
          </nav>
        </div>

        <div className="shutter_footer">
          <div>
            <span>[ CONTACT INFO ]</span>
            <p>hello@fandomverse.example</p>
            <p>Karachi, Pakistan</p>
          </div>

          <div className="visit">
            <span>[ VISIT US ]</span>
            <p className="shutter_hubs">
              {categories.map((category) => (
                <Link key={category.slug} to={category.path}>{category.name}</Link>
              ))}
            </p>
          </div>

          <small>© 2026 FANDOMVERSE</small>
        </div>
      </div>

      <div ref={rightRef} className="shutter_right">
        <div ref={rightContentRef} className="right_content">

          <div className="project_meta_clip">
            <div className="project_meta">
              <div ref={metaRef} className="project_meta_inner">
                <span>{project.location}</span>
                <b>/</b>
                <span>{project.size}</span>
                <b>/</b>
                <span>{project.time}</span>
              </div>
            </div>
          </div>

          <div
            className="project_image"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img ref={imageRef} src={project.image} alt={project.title} />
            <img ref={nextImageRef} src={projects[(active + 1) % projects.length].image} alt="" />

            <div className="image_overlay" />
          </div>

          <div className="project_title">
            <div className="project_text">
              <h2 ref={titleRef}>{project.title}</h2>

              <div ref={titleClipRef} className="project_title_clip">
                <p ref={descriptionRef}>{project.description}</p>
              </div>
            </div>

            <span>EXPLORE THE VERSE ↗</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shutter;
