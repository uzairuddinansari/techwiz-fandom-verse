import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/TheTeam.css";
import member01 from "../../assets/team/member-01.png";
import member02 from "../../assets/team/member-02.png";
import member03 from "../../assets/team/member-03.png";
import member04 from "../../assets/team/member-04.png";

gsap.registerPlugin(ScrollTrigger);

const members = [
  {
    image: member01,
    name: "Uzair Ansari",
    role: "Frontend Developer",
    description:
      "Worked on the interface, interactions and overall visual experience of the project.",
  },
  {
    image: member02,
    name: "Team Member 02",
    role: "UI / UX Designer",
    description:
      "Focused on visual direction, layouts and creating a clear experience for users.",
  },
  {
    image: member03,
    name: "Team Member 03",
    role: "Research & Planning",
    description:
      "Handled research, planning and helped turn our ideas into a practical direction.",
  },
  {
    image: member04,
    name: "Team Member 04",
    role: "Presentation",
    description:
      "Worked on presenting our project and making sure our idea was communicated clearly.",
  },
];

const TheTeam = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);

      gsap.set(cards, {
        yPercent: 115,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });
      ScrollTrigger.refresh();

      cards.forEach((card, index) => {
        const start = index * 0.9;

        tl.to(
          card,
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
          start
        );

        if (index > 0) {
          tl.to(
            cards[index - 1],
            {
              scale: 0.94,
              y: -18,
              duration: 0.8,
              ease: "power2.out",
            },
            start
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="team_section" ref={sectionRef}>
      <div className="team_left">
        <div className="team_title">
          <span>OUR JOURNEY · 03</span>
          <h2>
            WE ARE
            <em>NK WARRIORS.</em>
          </h2>
        </div>

        <div className="team_video_wrap">
          <video
            className="team_video"
            src="/videos/team-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <div className="team_left_bottom">
          <span>THE TEAM</span>
          <p>
            Four people. Different strengths. One shared goal.
          </p>
        </div>
      </div>

      <div className="team_right">
        <div className="team_cards">
          {members.map((member, index) => (
            <article
              className="team_card"
              key={member.name}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="team_member_image">
                <img src={member.image} alt={member.name} />
                <span>0{index + 1}</span>
              </div>

              <div className="team_member_info">
                <div className="team_member_top">
                  <span>NK WARRIORS</span>
                  <span>0{index + 1} / 04</span>
                </div>

                <div className="team_member_content">
                  <h3>{member.name}</h3>

                  <h4>{member.role}</h4>

                  <p>{member.description}</p>
                </div>

                <div className="team_member_line"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheTeam;