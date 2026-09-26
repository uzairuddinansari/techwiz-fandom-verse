import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "../../styles/Journey_hero.css";
import HeroIMG from "../../assets/hero_final.png";

const Journey_hero = () => {
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out"
        }
      });

      tl.from(".journey_eyebrow", {
        y: 25,
        opacity: 0,
        duration: 0.8
      })
      .from(".journey_title span", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.12
      }, "-=0.4")
      .from(".journey_description", {
        y: 30,
        opacity: 0,
        duration: 0.8
      }, "-=0.5")
      .from(".journey_meta", {
        y: 25,
        opacity: 0,
        duration: 0.7
      }, "-=0.5")
      .from(".journey_scroll", {
        y: 20,
        opacity: 0,
        duration: 0.6
      }, "-=0.3")
      .from(".journey_image", {
        scale: 1.08,
        opacity: 0,
        duration: 1.5
      }, "-=1");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  

  return (
    <div id="Journey_hero" ref={heroRef}>
      <div className="Journey_hero_sec">
        <div className="journey_content">
          <div className="journey_eyebrow">
            <span></span>
            THE JOURNEY
          </div>
          <h1 className="journey_title">
            <span>OUR TECHWIZ</span>
            <span>JOURNEY</span>
          </h1>
          <p className="journey_description">
            From taking our first step in Ticket to Techwiz
            to becoming part of the Techwiz journey.
            This is the story of our team, our challenges,
            our ideas and everything we experienced along the way.
          </p>
          <div className="journey_meta">
            <div>
              <small>STARTED WITH</small>
              <strong>TICKET TO TECHWIZ</strong>
            </div>
            <div>
              <small>YEAR</small>
              <strong>2026</strong>
            </div>
          </div>
          <div className="journey_scroll">
            <span>SCROLL TO EXPLORE</span>
            <i></i>
          </div>
        </div>
      </div>

      <div className="Journey_hero_sec journey_visual">
        <img
          className="journey_image"
          src={HeroIMG}
          alt="Techwiz Journey"
        />
      </div>
    </div>
  );
};

export default Journey_hero;