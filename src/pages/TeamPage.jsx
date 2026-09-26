import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Mail, MapPin, Sparkles, Wrench } from "lucide-react";
import team from "../fandom/team";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import "../styles/Fandom.css";
import "../styles/Team.css";

const { members, tools, process: steps } = team;

// Photos are hosted externally, so show the member's initials if one fails to load.
function MemberPhoto({ member, alt = "", lazy = false }) {
  const [failed, setFailed] = useState(false);
  if (failed || !member.image) {
    const initials = member.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
    return <span className="team-photo-fallback" role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>{initials}</span>;
  }
  return <img src={member.image} alt={alt} loading={lazy ? "lazy" : undefined} onError={() => setFailed(true)} />;
}

function MemberCard({ member, index }) {
  return (
    <article className="team-card" style={{ "--card-delay": `${index * 90}ms` }}>
      <Link to={`/team/${member.slug}`} className="team-card-photo" aria-label={`${member.name}’s portfolio`}>
        <MemberPhoto member={member} lazy />
        <span className="team-card-index">0{index + 1}</span>
      </Link>
      <div className="team-card-body">
        <span className="fv-eyebrow">{member.role}</span>
        <h3><Link to={`/team/${member.slug}`}>{member.name}</Link></h3>
        <p>{member.tagline}</p>
        <ul className="team-skill-chips">
          {member.skills.slice(0, 3).map((skill) => <li key={skill.name}>{skill.name}</li>)}
        </ul>
        <Link to={`/team/${member.slug}`} className="fv-link-button">View portfolio <ArrowRight size={15} /></Link>
      </div>
    </article>
  );
}

function TeamOverview() {
  return (
    <>
      <header className="team-hero">
        <div>
          <span className="fv-eyebrow">The people behind FandomVerse</span>
          <h1>Meet the team.</h1>
          <p>Four fans who designed, researched, built and tested a portal for seven fandoms — each with their own craft. Open a profile to see their work.</p>
        </div>
        <dl className="team-hero-stats">
          <div><dt>Team members</dt><dd>{members.length}</dd></div>
          <div><dt>Fandom hubs</dt><dd>7</dd></div>
          <div><dt>Project phases</dt><dd>{steps.length}</dd></div>
        </dl>
      </header>

      <section className="team-grid" aria-label="Team members">
        {members.map((member, index) => <MemberCard key={member.slug} member={member} index={index} />)}
      </section>

      <section className="team-section" aria-labelledby="process-title">
        <span className="fv-eyebrow">How we worked</span>
        <h2 id="process-title">Our process</h2>
        <ol className="team-process">
          {steps.map((step, index) => (
            <li key={step.phase}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.phase}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="team-section" aria-labelledby="tools-title">
        <span className="fv-eyebrow">Tools & acknowledgements</span>
        <h2 id="tools-title">What we used</h2>
        <div className="team-tools">
          {Object.entries(tools).map(([group, list]) => (
            <article key={group} className="fv-panel">
              <h3>{group === "AI tools used" ? <Sparkles size={18} /> : <Wrench size={18} />} {group}</h3>
              <ul>{list.map((tool) => <li key={tool}>{tool}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="fv-muted team-ai-note">
          AI tools supported our work as assistants; every design decision and line of code was reviewed and understood by the team.
        </p>
      </section>
    </>
  );
}

function MemberProfile({ member }) {
  const index = members.indexOf(member);
  const next = members[(index + 1) % members.length];
  return (
    <>
      <article className="team-profile">
        <figure className="team-profile-photo">
          <MemberPhoto member={member} alt={member.name} />
        </figure>
        <div className="team-profile-copy">
          <span className="fv-eyebrow">{member.role}</span>
          <h1>{member.name}</h1>
          <p className="team-profile-tagline">{member.tagline}</p>
          <p>{member.bio}</p>
          <ul className="team-profile-meta">
            <li><MapPin size={15} /> {member.location}</li>
            <li><Mail size={15} /> <a href={`mailto:${member.email}`}>{member.email}</a></li>
            {member.links.map((link) => (
              <li key={link.url}><ExternalLink size={15} /> <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a></li>
            ))}
          </ul>

          <h2>Skills</h2>
          <ul className="team-skills">
            {member.skills.map((skill, skillIndex) => (
              <li key={skill.name} style={{ "--level": `${skill.level}%`, "--delay": `${skillIndex * 90}ms` }}>
                <span>{skill.name}</span>
                <b>{skill.level}%</b>
                <i aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </article>

      <section className="team-section" aria-labelledby="contrib-title">
        <h2 id="contrib-title">Contributions to FandomVerse</h2>
        <ul className="team-contributions">
          {member.contributions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="team-section" aria-labelledby="work-title">
        <h2 id="work-title">Featured work</h2>
        <div className="team-work">
          {member.work.map((work) => (
            <Link key={work.title} to={work.path} className="team-work-card">
              <strong>{work.title}</strong>
              <span>{work.text}</span>
              <em>Open page <ArrowRight size={14} /></em>
            </Link>
          ))}
        </div>
      </section>

      <nav className="team-pager" aria-label="Team navigation">
        <Link to="/team" className="fv-button-outline"><ArrowLeft size={15} /> All members</Link>
        <Link to={`/team/${next.slug}`} className="fv-button">Next: {next.name} <ArrowRight size={15} /></Link>
      </nav>
    </>
  );
}

export default function TeamPage() {
  const { slug } = useParams();
  const member = slug ? members.find((entry) => entry.slug === slug) : null;

  return (
    <main className="fv-page team-page">
      <div className="fv-container">
        <Breadcrumbs trail={member ? [{ label: "Team", to: "/team" }, { label: member.name }] : [{ label: "Team" }]} />
        {slug && !member ? (
          <div className="fv-empty">
            <h1>Team member not found</h1>
            <Link className="fv-button" to="/team">See the whole team</Link>
          </div>
        ) : member ? (
          <MemberProfile key={member.slug} member={member} />
        ) : (
          <TeamOverview />
        )}
      </div>
    </main>
  );
}
