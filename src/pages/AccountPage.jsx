import { useRef, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import usersData from "../JSON/users.json";
import { categories } from "../fandom/catalog";
import { logIn, signUp, useAuth } from "../fandom/auth";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { ErrorSummary, FieldError, FieldHint, FormAlert } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, rules, toast, validateForm } from "../components/ui/feedback";
import "../styles/Fandom.css";
import "../styles/Shop.css";

const empty = { name: "", email: "", password: "", confirm: "", terms: false, remember: true, favorites: [] };
const labels = { name: "Display name", email: "Email", password: "Password", confirm: "Confirm password", terms: "Guidelines" };

const schemaFor = (mode) =>
  mode === "signup"
    ? {
        name: [rules.required("Choose a display name."), rules.minLength(2, "Display name needs at least 2 characters."), rules.maxLength(30)],
        email: [rules.required("Enter your email address."), rules.email()],
        password: [rules.required("Create a password."), rules.minLength(8, "Use at least 8 characters."), rules.pattern(/\d/, "Include at least one number.")],
        confirm: [rules.required("Repeat your password."), (value, values) => (value && value !== values.password ? "Passwords don’t match." : "")],
        terms: [rules.required("Please accept the community guidelines to continue.")],
      }
    : {
        email: [rules.required("Enter your email address."), rules.email()],
        password: [rules.required("Enter your password.")],
      };

const strength = (password) => {
  if (!password) return 0;
  let score = password.length >= 8 ? 1 : 0;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  return Math.max(1, score);
};
const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];

/* Only allow redirects to pages inside the site. */
const safeNext = (value) => (value && value.startsWith("/") && !value.startsWith("//") ? value : "/profile");

export default function AccountPage() {
  const user = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "signup" ? "signup" : "login";
  const next = safeNext(params.get("next"));
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const formRef = useRef(null);

  // Already logged in and arriving here? Go straight on.
  if (user && !busy) return <Navigate to={next} replace />;

  const errors = { ...validateForm(values, schemaFor(mode)), ...(serverError ? { [serverError.field]: serverError.message } : {}) };
  const visible = Object.fromEntries(Object.entries(errors).filter(([field]) => submitted || touched[field] || serverError?.field === field));

  const switchMode = (target) => {
    setSubmitted(false);
    setTouched({});
    setServerError(null);
    setForgot(false);
    const nextParams = new URLSearchParams(params);
    if (target === "signup") nextParams.set("mode", "signup");
    else nextParams.delete("mode");
    setParams(nextParams, { replace: true });
  };

  const update = (field) => (event) => {
    if (serverError?.field === field) setServerError(null);
    setValues((current) => ({ ...current, [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  };
  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));
  const toggleFavorite = (slug) =>
    setValues((current) => ({
      ...current,
      favorites: current.favorites.includes(slug) ? current.favorites.filter((entry) => entry !== slug) : [...current.favorites, slug],
    }));

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    const clientErrors = validateForm(values, schemaFor(mode));
    if (Object.keys(clientErrors).length) {
      focusFirstError(formRef.current, clientErrors);
      return;
    }
    setBusy(true);
    const result = mode === "signup" ? await signUp(values) : await logIn(values);
    if (!result.ok) {
      setBusy(false);
      setServerError({ field: result.field, message: result.message });
      focusFirstError(formRef.current, { [result.field]: true });
      return;
    }
    toast(mode === "signup" ? "Your fan profile is ready." : "Good to see you again.", {
      title: mode === "signup" ? `Welcome to the Verse, ${result.user.name.split(" ")[0]}!` : `Welcome back, ${result.user.name.split(" ")[0]}`,
    });
    navigate(next, { replace: true });
  };

  const fillDemo = (account) => {
    setServerError(null);
    setSubmitted(false);
    setValues((current) => ({ ...current, email: account.email, password: account.demoPassword }));
  };

  const score = strength(values.password);
  const demoAccounts = [
    { ...usersData.users[0], demoPassword: "Fandom@123" },
    { ...usersData.users[1], demoPassword: "Otaku#2026" },
  ];

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: mode === "login" ? "Log in" : "Sign up" }]} />
        <div className="acc-layout">
          <section className="fv-panel fv-account">
            <div className="fv-account-tabs" role="tablist" aria-label="Account">
              <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Log in</button>
              <button type="button" role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "active" : ""} onClick={() => switchMode("signup")}>Sign up</button>
            </div>

            <h1>{mode === "login" ? "Welcome back." : "Join the Verse."}</h1>
            <p className="fv-muted">
              {mode === "login" ? "Log in to see your profile, orders and saved cart." : "Create a free fan profile — it takes less than a minute."}
            </p>
            {next !== "/profile" && (
              <FormAlert type="info" title="Log in to continue">
                {next.startsWith("/checkout") ? "You need an account to check out. Your cart will be saved to it." : "That page is for members only."}
              </FormAlert>
            )}

            <form ref={formRef} className="fv-form" onSubmit={submit} noValidate>
              {submitted && !serverError && <ErrorSummary errors={errors} labels={labels} onJump={(field) => focusFirstError(formRef.current, { [field]: true })} />}

              {mode === "signup" && (
                <label htmlFor="acc-name">
                  <span>Display name</span>
                  <input name="name" value={values.name} onChange={update("name")} onBlur={blur("name")} autoComplete="nickname" {...fieldA11y("acc-name", visible.name)} />
                  <FieldError id="acc-name" message={visible.name} />
                </label>
              )}

              <label htmlFor="acc-email">
                <span>Email</span>
                <input name="email" type="email" inputMode="email" value={values.email} onChange={update("email")} onBlur={blur("email")} autoComplete="email" placeholder="name@example.com" {...fieldA11y("acc-email", visible.email)} />
                <FieldError id="acc-email" message={visible.email} />
                {serverError?.field === "email" && mode === "signup" && (
                  <button type="button" className="acc-inline-link" onClick={() => switchMode("login")}>Log in with this email instead →</button>
                )}
              </label>

              <label htmlFor="acc-password">
                <span className="acc-label-row">
                  Password
                  {mode === "login" && <button type="button" className="acc-inline-link" onClick={() => setForgot((value) => !value)}>Forgot password?</button>}
                </span>
                <div className="fv-password">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={update("password")}
                    onBlur={blur("password")}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    {...fieldA11y("acc-password", visible.password, mode === "signup")}
                  />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {mode === "signup" && values.password && (
                  <div className="fb-strength" data-score={score} aria-hidden="true"><i /><i /><i /><i /><span>{strengthLabel[score]}</span></div>
                )}
                {visible.password ? (
                  <FieldError id="acc-password" message={visible.password} />
                ) : (
                  mode === "signup" && <FieldHint id="acc-password">8+ characters with at least one number.</FieldHint>
                )}
              </label>

              {forgot && mode === "login" && (
                <FormAlert type="info" title="Resetting a password needs a server" onClose={() => setForgot(false)}>
                  This demo has no email service. Use one of the demo accounts, or create a new account.
                </FormAlert>
              )}

              {mode === "signup" ? (
                <>
                  <label htmlFor="acc-confirm">
                    <span>Confirm password</span>
                    <input name="confirm" type={showPassword ? "text" : "password"} value={values.confirm} onChange={update("confirm")} onBlur={blur("confirm")} autoComplete="new-password" {...fieldA11y("acc-confirm", visible.confirm)} />
                    <FieldError id="acc-confirm" message={visible.confirm} />
                  </label>
                  <fieldset className="acc-favorites">
                    <legend>Favourite hubs <small>(optional)</small></legend>
                    <div className="shop-chips">
                      {categories.map((category) => (
                        <button key={category.slug} type="button" className={values.favorites.includes(category.slug) ? "active" : ""} aria-pressed={values.favorites.includes(category.slug)} onClick={() => toggleFavorite(category.slug)}>
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <label className="fv-check" htmlFor="acc-terms">
                      <input name="terms" type="checkbox" checked={values.terms} onChange={update("terms")} onBlur={blur("terms")} {...fieldA11y("acc-terms", visible.terms)} />
                      <span>I agree to the community guidelines.</span>
                    </label>
                    <FieldError id="acc-terms" message={visible.terms} />
                  </div>
                </>
              ) : (
                <label className="fv-check" htmlFor="acc-remember">
                  <input id="acc-remember" name="remember" type="checkbox" checked={values.remember} onChange={update("remember")} />
                  <span>Keep me logged in on this device</span>
                </label>
              )}

              <button type="submit" className="fv-button" disabled={busy}>
                {busy ? <><Loader2 size={16} className="acc-spin" /> Please wait…</> : mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>

            <p className="fv-muted acc-switch">
              {mode === "login" ? <>New to FandomVerse? <button type="button" className="acc-inline-link" onClick={() => switchMode("signup")}>Create an account</button></> : <>Already a member? <button type="button" className="acc-inline-link" onClick={() => switchMode("login")}>Log in</button></>}
            </p>
          </section>

          <aside className="fv-panel acc-demo">
            <span className="fv-eyebrow"><KeyRound size={12} /> Demo accounts</span>
            <h2>Try it instantly</h2>
            <p className="fv-muted">These accounts come from <code>src/JSON/users.json</code>. New sign-ups are saved in this browser.</p>
            <ul>
              {demoAccounts.map((account) => (
                <li key={account.id}>
                  <span className="shop-avatar" style={{ "--avatar": account.avatarColor }} aria-hidden="true">{account.name[0]}</span>
                  <div>
                    <strong>{account.name}</strong>
                    <small>{account.email}</small>
                    <small>Password: <code>{account.demoPassword}</code></small>
                  </div>
                  <button type="button" className="fv-button-outline" onClick={() => { if (mode !== "login") switchMode("login"); fillDemo(account); }}>
                    Use
                  </button>
                </li>
              ))}
            </ul>
            <small className="fv-muted">Front-end demo: accounts live in the browser, so this is not real security.</small>
            <Link to="/shop" className="fv-link-button">Browse the shop first →</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
