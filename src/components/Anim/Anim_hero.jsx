import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../../styles/Anim_hero.css";
import Hero_img from "../../assets/Anim_hero/Anim_hero_img.jpeg"
import Hero_video from "../../assets/Anim_hero/Anim_hero_vid.mp4"

const Anim_hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      videoRef.current,
      {
        xPercent: -100,
        opacity: 0
      },
      {
        xPercent: 0,
        opacity: 1,
        duration: 1.4,
        ease: "power4.out"
      }
    );
  }, []);

  return (
    <section className="anim-hero">
      <div className="anim-hero-left">
        <img
          src={Hero_img}
          alt="Anime"
        />

        <div className="anim-hero-overlay"></div>

        <div className="anim-hero-content">
          <span className="anim-hero-tag">FANDOMVERSE / ANIME</span>

          <h1>
            ENTER THE
            <span>ANIME WORLD</span>
          </h1>

          <p>
            Discover legendary stories, unforgettable characters,
            latest news and everything from the world of anime.
          </p>

          <button className="anim-hero-btn">
            EXPLORE ANIME
            <span>→</span>
          </button>
        </div>
      </div>

      <div ref={videoRef} className="anim-hero-right">
        <video
          src={Hero_video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </section>
  );
};

export default Anim_hero;