import { useEffect, useRef, useState } from "react";
import data from "../../JSON/TechwizSelection.json";
import "../../styles/TechwizSelection.css";
import teamPhoto from "../../assets/hero_final.png";
import { resolveMedia } from "../../fandom/catalog";

function TechwizSelection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("tws-visible");
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    const stepsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(Number(entry.target.dataset.index));
          }
        });
      },
      {
        threshold: 0.55,
      }
    );

    const elements = sectionRef.current.querySelectorAll(".tws-reveal");

    elements.forEach((element) => {
      revealObserver.observe(element);
    });

    stepRefs.current.forEach((step) => {
      if (step) stepsObserver.observe(step);
    });

    return () => {
      revealObserver.disconnect();
      stepsObserver.disconnect();
    };
  }, []);

  return (
    <section className="tws-section" ref={sectionRef}>

      <div className="tws-hero tws-reveal">
        <div className="tws-hero-left">

          <div className="tws-eyebrow">
            <span></span>
            <p>{data.eyebrow}</p>
            <strong>{data.year}</strong>
          </div>

          <h1>
            {data.title}
            <span>{data.titleAccent}</span>
          </h1>

          <p className="tws-intro">{data.intro}</p>

          <div className="tws-start">
            <div>
              <span>STARTED WITH</span>
              <strong>TICKET TO TECHWIZ</strong>
            </div>

            <div>
              <span>DESTINATION</span>
              <strong>INTERNATIONAL</strong>
            </div>
          </div>

        </div>

        <div className="tws-hero-right">

          <div className="tws-hero-image-frame">
            <img
              src={teamPhoto}
              alt="Techwiz Team"
            />
            <div className="tws-hero-image-fade"></div>
          </div>

          <div className="tws-hero-number">01</div>

          <div className="tws-hero-label">
            <span>THE TEAM</span>
            <span>THE JOURNEY BEGINS</span>
          </div>

        </div>
      </div>

      <div className="tws-statement tws-reveal">
        <span>THE IDEA</span>

        <h2>
          ONE STEP
          <br />
          <span>CHANGED EVERYTHING.</span>
        </h2>

        <p>
          We did not know exactly where the journey would take us.
          We only knew that we wanted to give it everything we had.
        </p>
      </div>

      <div className="tws-flow">

        <div className="tws-progress">
          <div
            className="tws-progress-fill"
            style={{
              height: `${((activeStep + 1) / data.steps.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="tws-flow-number">
          <span>{String(activeStep + 1).padStart(2, "0")}</span>
          <small>/{String(data.steps.length).padStart(2, "0")}</small>
        </div>

        {data.steps.map((step, index) => (
          <article
            className={`tws-step tws-reveal ${
              activeStep === index ? "tws-active" : ""
            }`}
            key={step.number}
            data-index={index}
            ref={(element) => {
              stepRefs.current[index] = element;
            }}
          >

            <div className="tws-step-side">
              <span>{step.number}</span>
              <div></div>
            </div>

            <div className="tws-step-image-area">
              <div className="tws-step-image">

                <img
                  src={resolveMedia(step.image)}
                  alt={step.title}
                />

                <div className="tws-step-image-overlay"></div>

                <div className="tws-step-caption">
                  <span>{step.caption}</span>
                  <small>{step.smallText}</small>
                </div>

              </div>
            </div>

            <div className="tws-step-content">

              <div className="tws-step-label">
                <span>{step.label}</span>
                <span>TECHWIZ / {data.year}</span>
              </div>

              <h3>
                {step.title}
                <span>{step.accent}</span>
              </h3>

              <p>{step.description}</p>

              <div className="tws-step-bottom">
                <span>0{index + 1}</span>
                <div></div>
                <span>
                  {index === 0
                    ? "BEGIN"
                    : index === data.steps.length - 1
                    ? "NEXT LEVEL"
                    : "CONTINUE"}
                </span>
              </div>

            </div>

          </article>
        ))}
      </div>

      <div className="tws-achievement tws-reveal">

        <div className="tws-achievement-heading">
          <span>THE RESULT</span>

          <h2>
            HARD WORK
            <br />
            <span>LEFT A MARK.</span>
          </h2>
        </div>

        <div className="tws-achievement-grid">
          {data.stats.map((stat) => (
            <div className="tws-achievement-box" key={stat.number}>

              <span>{stat.number}</span>

              <div>
                <small>{stat.title}</small>
                <strong>{stat.text}</strong>
              </div>

            </div>
          ))}
        </div>

      </div>

      <div className="tws-emotion tws-reveal">

        <div className="tws-emotion-copy">

          <span>THE EMOTION</span>

          <h2>
            SURPRISE.
            <br />
            <span>HAPPINESS.</span>
            <br />
            PRIDE.
          </h2>

          <p>
            We had spent so much time working towards this moment that
            when it finally happened, it felt unreal.
          </p>

          <blockquote>
            “For a moment, we forgot everything else.
            We had actually made it.”
          </blockquote>

        </div>

        <div className="tws-emotion-image">

          <img
            src={teamPhoto}
            alt="Team celebration"
          />

          <div className="tws-emotion-overlay"></div>

          <div className="tws-emotion-label">
            OUR EXPRESSIONS
            <span>SAID EVERYTHING</span>
          </div>

        </div>

      </div>

      <div className="tws-final tws-reveal">

        <div className="tws-final-ghost">
          TECHWIZ
        </div>

        <div className="tws-final-inner">

          <span>{data.final.eyebrow}</span>

          <h2>
            {data.final.title}
            <strong>{data.final.accent}</strong>
          </h2>

          <p>{data.final.description}</p>

          <div className="tws-final-rule"></div>

          <h3>{data.final.quote}</h3>

          <div className="tws-final-meta">
            <span>TECHWIZ</span>
            <strong>{data.year}</strong>
            <span>INTERNATIONAL JOURNEY</span>
          </div>

        </div>

      </div>

      <div className="tws-end tws-reveal">

        <span></span>

        <p>THE JOURNEY CONTINUES</p>

        <h4>
          THIS WAS
          <br />
          <strong>ONLY THE BEGINNING.</strong>
        </h4>

        <span></span>

      </div>

    </section>
  );
}

export default TechwizSelection;