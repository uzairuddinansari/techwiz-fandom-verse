import { useRef, useState } from "react";
import { Clock3, LocateFixed, Mail, MapPin, Navigation, Phone, Send } from "lucide-react";
import team from "../fandom/team";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { ErrorSummary, FieldError, FieldHint, FormAlert } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, rules, toast, validateForm } from "../components/ui/feedback";
import "../styles/Fandom.css";

const { studio, members } = team;

/* Great-circle distance in kilometres. */
const distanceKm = (a, b) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const embedFor = (query) => `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;

const MESSAGE_MAX = 800;
const empty = { name: "", email: "", topic: "General question", message: "" };
const labels = { name: "Name", email: "Email", message: "Message" };
const schema = {
  name: [rules.required("Please tell us your name."), rules.minLength(2, "Your name needs at least 2 characters.")],
  email: [rules.required("We need your email to reply."), rules.email()],
  message: [
    rules.required("Write a message for the team."),
    rules.minLength(10, "Your message should be at least 10 characters."),
    rules.maxLength(MESSAGE_MAX, `Please keep your message under ${MESSAGE_MAX} characters.`),
  ],
};

const gpsMessages = {
  denied: ["warning", "Location access is off", "Allow location in your browser settings, then try again — or use “Open in Google Maps”."],
  unsupported: ["warning", "GPS isn’t available", "This browser can’t share your location. You can still open the map in Google Maps."],
  timeout: ["error", "We couldn’t find you in time", "Move somewhere with a better signal and try again."],
};

export default function ContactPage() {
  const [position, setPosition] = useState(null);
  const [gpsState, setGpsState] = useState("idle");
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const formRef = useRef(null);

  const errors = validateForm(values, schema);
  const visible = Object.fromEntries(Object.entries(errors).filter(([field]) => submitted || touched[field]));

  const update = (field) => (event) => {
    setSentTo("");
    setValues((current) => ({ ...current, [field]: event.target.value }));
  };
  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const locate = () => {
    if (!navigator.geolocation) {
      setGpsState("unsupported");
      return;
    }
    setGpsState("loading");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ latitude: coords.latitude, longitude: coords.longitude });
        setGpsState("found");
      },
      (error) => setGpsState(error.code === error.TIMEOUT ? "timeout" : "denied"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) {
      focusFirstError(formRef.current, errors);
      return;
    }
    setSentTo(values.email);
    toast("We’ll get back to you soon (demo — nothing was sent).", { title: "Message received" });
    setValues(empty);
    setTouched({});
    setSubmitted(false);
  };

  const mapSrc = position ? embedFor(`${position.latitude},${position.longitude}`) : embedFor(studio.mapQuery);
  const directions = position
    ? `https://www.google.com/maps/dir/?api=1&origin=${position.latitude},${position.longitude}&destination=${encodeURIComponent(studio.mapQuery)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.mapQuery)}`;
  const remaining = MESSAGE_MAX - values.message.length;

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "Contact us" }]} />
        <header className="fv-page-hero">
          <span className="fv-eyebrow">Contact us</span>
          <h1>Talk to the team.</h1>
          <p>Questions, feedback, accessibility needs or ideas for the next fandom — we&rsquo;d love to hear from you.</p>
        </header>

        <div className="fv-contact">
          <form ref={formRef} className="fv-panel fv-form" onSubmit={submit} noValidate>
            <h2>Send a message</h2>
            {sentTo && (
              <FormAlert type="success" title="Thanks — your message was received!" onClose={() => setSentTo("")}>
                We&rsquo;ll reply to <b>{sentTo}</b>. This is a demo, so nothing was actually sent to a server.
              </FormAlert>
            )}
            {submitted && <ErrorSummary errors={errors} labels={labels} onJump={(field) => focusFirstError(formRef.current, { [field]: true })} />}

            <label htmlFor="c-name">
              <span>Name</span>
              <input name="name" value={values.name} onChange={update("name")} onBlur={blur("name")} autoComplete="name" {...fieldA11y("c-name", visible.name)} />
              <FieldError id="c-name" message={visible.name} />
            </label>
            <label htmlFor="c-email">
              <span>Email</span>
              <input name="email" type="email" inputMode="email" value={values.email} onChange={update("email")} onBlur={blur("email")} autoComplete="email" placeholder="name@example.com" {...fieldA11y("c-email", visible.email)} />
              <FieldError id="c-email" message={visible.email} />
            </label>
            <label htmlFor="c-topic">
              <span>Topic</span>
              <select id="c-topic" name="topic" value={values.topic} onChange={update("topic")}>
                <option>General question</option>
                <option>Content suggestion</option>
                <option>Accessibility feedback</option>
                <option>Event partnership</option>
              </select>
            </label>
            <label htmlFor="c-message">
              <span>Message</span>
              <textarea name="message" rows={5} value={values.message} onChange={update("message")} onBlur={blur("message")} {...fieldA11y("c-message", visible.message, true)} />
              {visible.message ? (
                <FieldError id="c-message" message={visible.message} />
              ) : (
                <FieldHint id="c-message">{remaining >= 0 ? `${remaining} characters left` : `${-remaining} characters over the limit`}</FieldHint>
              )}
            </label>
            <button type="submit" className="fv-button"><Send size={16} /> Send message</button>
          </form>

          <aside className="fv-panel fv-location">
            <div className="fv-map">
              <iframe title={position ? "Map of your current location" : `Map of ${studio.name}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <h2>{studio.name}</h2>
            <ul className="fv-contact-list">
              <li><MapPin size={16} /> {studio.address}</li>
              <li><Mail size={16} /> <a href={`mailto:${studio.email}`}>{studio.email}</a></li>
              <li><Phone size={16} /> <a href={`tel:${studio.phone.replace(/\s/g, "")}`}>{studio.phone}</a></li>
              <li><Clock3 size={16} /> {studio.hours}</li>
            </ul>
            <div className="fv-actions">
              <button type="button" className="fv-button" onClick={locate} disabled={gpsState === "loading"}>
                <LocateFixed size={16} /> {gpsState === "loading" ? "Locating…" : "Use my GPS location"}
              </button>
              <a className="fv-button-outline" href={directions} target="_blank" rel="noreferrer">
                <Navigation size={16} /> {position ? "Get directions" : "Open in Google Maps"}
              </a>
            </div>
            {gpsState === "found" && (
              <FormAlert type="success" title="Location found" onClose={() => setGpsState("idle")}>
                You are about {distanceKm(position, studio).toFixed(1)} km from our studio. The map now shows your location.
              </FormAlert>
            )}
            {gpsMessages[gpsState] && (
              <FormAlert type={gpsMessages[gpsState][0]} title={gpsMessages[gpsState][1]} onClose={() => setGpsState("idle")}>
                {gpsMessages[gpsState][2]}
              </FormAlert>
            )}
            {gpsState === "idle" && <p className="fv-muted">Your location is used only in this browser and never stored.</p>}
          </aside>
        </div>

        <section className="fv-team" aria-labelledby="team-contact-title">
          <h2 id="team-contact-title">Team contacts</h2>
          <div className="fv-team-grid">
            {members.map((member) => (
              <article key={member.name} className="fv-panel fv-member">
                <img src={member.image} alt={member.name} loading="lazy" />
                <div>
                  <h3>{member.name}</h3>
                  <p className="fv-muted">{member.role}</p>
                  <a href={`mailto:${member.email}`}><Mail size={14} /> {member.email}</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
