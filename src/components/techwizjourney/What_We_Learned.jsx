import { useEffect } from "react";
import "../../styles/WhatWeLearned.css";
import teamPhoto from "../../assets/hero_final.png";

const lessons = [
  {
    number: "01",
    title: "TEAMWORK",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    text: (
      <>
        <p>
          Teamwork was one of the most important lessons we learned during
          our Ticket to Techwiz journey. Since the project involved different
          tasks, we divided the work among team members according to our
          abilities and responsibilities.
        </p>

        <p>
          Working as a team helped us understand that everyone does not have
          to do the same task. Instead, each person can contribute something
          different to achieve the same goal. We shared ideas, discussed
          problems and helped each other whenever someone faced difficulty.
        </p>

        <p>
          We also learned patience, responsibility and respect for other
          people's ideas. The final project became easier to manage because
          the workload was shared instead of being handled by one person.
        </p>
      </>
    )
  },

  {
    number: "02",
    title: "COMMUNICATION",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    text: (
      <>
        <p>
          Communication played an important role throughout our journey.
          While working on the project, we had to continuously discuss our
          ideas, requirements, designs and progress with one another.
        </p>

        <p>
          We learned how to explain our ideas clearly instead of assuming
          that everyone understood what we meant. When there was a
          disagreement, we discussed the problem and tried to find a solution
          that worked for the whole team.
        </p>

        <p>
          Presenting our project also improved our communication skills.
          We learned how to explain our website features, answer questions
          and speak more confidently in front of others.
        </p>
      </>
    )
  },

  {
    number: "03",
    title: "PROBLEM SOLVING",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    text: (
      <>
        <p>
          During the development of our project, we faced different
          problems. Sometimes the design did not look the way we expected,
          some website features required changes and we also had to fix
          technical errors during development.
        </p>

        <p>
          Instead of leaving a problem unfinished, we learned to identify
          the actual cause first. We checked our code, discussed the issue
          with our teammates and tried different solutions until we found
          an approach that worked.
        </p>

        <p>
          This taught us that problem solving is not about avoiding mistakes.
          It is about understanding the mistake, learning from it and
          improving the final result.
        </p>
      </>
    )
  },

  {
    number: "04",
    title: "TIME MANAGEMENT",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=85",
    text: (
      <>
        <p>
          Managing time was especially important because we had a deadline
          for completing our Ticket to Techwiz project. We could not spend
          all our time on one part of the project while leaving other tasks
          unfinished.
        </p>

        <p>
          To manage our time, we divided the project into smaller tasks and
          distributed those tasks among team members. While one person worked
          on one area, another team member could work on a different part.
        </p>

        <p>
          This division of work helped us use our available time more
          effectively. We also learned to prioritize important tasks first,
          keep track of our progress and leave enough time for testing and
          final improvements.
        </p>
      </>
    )
  },

  {
    number: "05",
    title: "CONFIDENCE",
    image: teamPhoto,
    text: (
      <>
        <p>
          At the beginning of our journey, we were not equally confident
          about every part of the project. As we continued working, solving
          problems and learning new things, our confidence gradually
          increased.
        </p>

        <p>
          Every completed section gave us a feeling of achievement. When
          something that initially seemed difficult finally worked, it
          showed us that we were capable of learning and improving.
        </p>

        <p>
          Preparing and presenting our final project also helped us become
          more comfortable with explaining our work. We learned to trust
          our preparation, communicate our ideas and present our work with
          greater confidence.
        </p>
      </>
    )
  },

  {
    number: "06",
    title: "HANDLING PRESSURE",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    text: (
      <>
        <p>
          Handling pressure was one of the biggest lessons of our Ticket to
          Techwiz journey. As the deadline became closer, there was a lot of
          work to complete, mistakes to fix and details to improve.
        </p>

        <p>
          Instead of allowing the pressure to stop our progress, we focused
          on completing one task at a time. We divided the remaining work,
          communicated with our teammates and concentrated on the most
          important requirements first.
        </p>

        <p>
          This experience taught us that pressure can be managed through
          planning, teamwork and staying focused. We learned to keep working
          even when the deadline was close and the workload felt difficult.
        </p>
      </>
    )
  }
];

function WhatWeLearned() {
  useEffect(() => {
    const sections = document.querySelectorAll(".learn-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="what-learned-page">

      {/* HERO */}
      <section className="wl-hero">

        <div className="hero-label">
          <span></span>
          THE JOURNEY
        </div>

        <div className="hero-layout">

          <div className="hero-copy">

            <h1>
              WHAT WE
              <br />
              <span>LEARNED</span>
            </h1>

            <p>
              Our Ticket to Techwiz journey was about more than
              creating a project. It gave us the opportunity to
              develop our skills, work together, solve problems
              and grow as a team.
            </p>

            <div className="hero-details">

              <div>
                <small>STARTED WITH</small>
                <strong>TICKET TO TECHWIZ</strong>
              </div>

              <div>
                <small>YEAR</small>
                <strong>2026</strong>
              </div>

            </div>

          </div>

          <div className="hero-team-image">

            <img
              src={teamPhoto}
              alt="Ticket to Techwiz team"
            />

            <div className="hero-image-label">
              OUR TEAM · 2026
            </div>

          </div>

        </div>

        <div className="scroll-indicator">
          SCROLL TO EXPLORE
          <span>↓</span>
        </div>

      </section>


      {/* INTRO */}
      <section className="wl-intro learn-reveal">

        <div className="hero-label">
          <span></span>
          OUR EXPERIENCE
        </div>

        <div className="intro-layout">

          <h2>
            MORE THAN
            <br />
            <span>TECHNICAL SKILLS.</span>
          </h2>

          <div className="intro-description">

            <p>
              During our journey, we discovered that a successful
              project is not only about writing code or designing
              a website.
            </p>

            <p>
              It is also about knowing how to work with people,
              communicate ideas, solve unexpected problems,
              manage limited time and stay focused when things
              become difficult.
            </p>

          </div>

        </div>

      </section>


      {/* LESSONS */}
      <section className="lessons-wrapper">

        <div className="lessons-title learn-reveal">

          <div className="hero-label">
            <span></span>
            WHAT WE TAKE WITH US
          </div>

          <h2>
            SIX LESSONS.
            <br />
            <span>ONE JOURNEY.</span>
          </h2>

        </div>


        <div className="lesson-list">

          {lessons.map((lesson, index) => (

            <article
              key={lesson.number}
              className={`learning-block learn-reveal ${
                index % 2 === 0 ? "image-left" : "image-right"
              }`}
            >

              {/* IMAGE */}
              <div className="learning-image">

                <img
                  src={lesson.image}
                  alt={lesson.title}
                />

                <div className="image-number">
                  {lesson.number}
                </div>

              </div>


              {/* TEXT */}
              <div className="learning-content">

                <div className="topic-number">
                  {lesson.number} / 06
                </div>

                <h3>
                  {lesson.title}
                </h3>

                <div className="topic-line"></div>

                <div className="topic-text">
                  {lesson.text}
                </div>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* FINAL */}
      <section className="wl-final learn-reveal">

        <div className="final-year">
          2026
        </div>

        <div className="final-content">

          <div className="hero-label">
            <span></span>
            LOOKING BACK
          </div>

          <h2>
            EVERY CHALLENGE
            <br />
            <span>BECAME A LESSON.</span>
          </h2>

          <p>
            Ticket to Techwiz gave us an experience that went
            beyond the final project. We learned how to work
            together, communicate, manage our time, solve
            problems and continue moving forward even when
            the pressure was high.
          </p>

          <div className="final-divider"></div>

          <strong>
            THE JOURNEY CONTINUES.
          </strong>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="wl-footer">

        <strong>
          TICKET TO TECHWIZ
        </strong>

        <span>
          WHAT WE LEARNED · 2026
        </span>

        <span>
          OUR JOURNEY CONTINUES ↓
        </span>

      </footer>

    </main>
  );
}

export default WhatWeLearned;
