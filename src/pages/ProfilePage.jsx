import { useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, CalendarDays, Heart, LogOut, Package, Settings, Shield, ShoppingBag, User } from "lucide-react";
import usersData from "../JSON/users.json";
import { categories, formatPrice } from "../fandom/catalog";
import { products, productPath } from "../fandom/shop";
import { cartTotals, useBookmarks, useCart } from "../fandom/store";
import { changePassword, deleteAccount, getOrders, logOut, updateProfile, useAuth } from "../fandom/auth";
import Breadcrumbs from "../components/fandom/Breadcrumbs";
import { Avatar, ProductCard } from "../components/shop/ShopUI";
import { FieldError, FormAlert } from "../components/ui/FormFeedback";
import { fieldA11y, focusFirstError, rules, toast, useConfirm, validateForm } from "../components/ui/feedback";
import "../styles/Fandom.css";
import "../styles/Shop.css";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Profile", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
];

function OrdersList({ orders }) {
  if (!orders.length) {
    return (
      <div className="fv-empty">
        <Package size={32} />
        <h3>No orders yet</h3>
        <p>When you check out, your orders will appear here.</p>
        <Link className="fv-button" to="/shop">Visit the shop</Link>
      </div>
    );
  }
  return (
    <ul className="acc-orders">
      {orders.map((order) => (
        <li key={order.id}>
          <Link to={`/orders/${order.id}`}>
            <span className="acc-order-thumbs">
              {order.items.slice(0, 3).map((line) => <img key={line.lineId} src={line.image} alt="" />)}
            </span>
            <span className="acc-order-info">
              <strong>{order.id}</strong>
              <small>{new Date(order.placedAt).toLocaleDateString("en-GB", { dateStyle: "medium" })} · {order.items.reduce((sum, line) => sum + line.quantity, 0)} items</small>
            </span>
            <span className="adm-badge good">{order.status}</span>
            <b>{formatPrice(order.totals.total)}</b>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ProfileSettings({ user }) {
  const [values, setValues] = useState({ name: user.name, bio: user.bio || "", favorites: user.favorites || [], avatarColor: user.avatarColor });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const errors = submitted ? validateForm(values, { name: [rules.required("Your display name can’t be empty."), rules.minLength(2), rules.maxLength(30)], bio: [rules.maxLength(160, "Keep your bio under 160 characters.")] }) : {};

  const save = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const found = validateForm(values, { name: [rules.required("Your display name can’t be empty."), rules.minLength(2), rules.maxLength(30)], bio: [rules.maxLength(160, "Keep your bio under 160 characters.")] });
    if (Object.keys(found).length) {
      focusFirstError(formRef.current, found);
      return;
    }
    updateProfile(values);
    setSubmitted(false);
    toast("Your profile has been updated.", { title: "Saved" });
  };

  const toggle = (slug) =>
    setValues((current) => ({ ...current, favorites: current.favorites.includes(slug) ? current.favorites.filter((entry) => entry !== slug) : [...current.favorites, slug] }));

  return (
    <form ref={formRef} className="fv-form acc-form" onSubmit={save} noValidate>
      <div className="acc-avatar-row">
        <Avatar user={{ ...user, ...values }} size={64} />
        <fieldset>
          <legend>Avatar colour</legend>
          <div className="acc-swatches">
            {usersData.avatarColors.map((color) => (
              <button key={color} type="button" className={values.avatarColor === color ? "active" : ""} style={{ "--swatch": color }} onClick={() => setValues({ ...values, avatarColor: color })} aria-label={`Use colour ${color}`} aria-pressed={values.avatarColor === color} />
            ))}
          </div>
        </fieldset>
      </div>
      <label htmlFor="pf-name">
        <span>Display name</span>
        <input name="name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} {...fieldA11y("pf-name", errors.name)} />
        <FieldError id="pf-name" message={errors.name} />
      </label>
      <label htmlFor="pf-bio">
        <span>Bio <small className="fv-muted">({values.bio.length}/160)</small></span>
        <textarea name="bio" rows={3} value={values.bio} onChange={(event) => setValues({ ...values, bio: event.target.value })} placeholder="What are you watching, reading or playing?" {...fieldA11y("pf-bio", errors.bio)} />
        <FieldError id="pf-bio" message={errors.bio} />
      </label>
      <fieldset className="acc-favorites">
        <legend>Favourite hubs</legend>
        <div className="shop-chips">
          {categories.map((category) => (
            <button key={category.slug} type="button" className={values.favorites.includes(category.slug) ? "active" : ""} aria-pressed={values.favorites.includes(category.slug)} onClick={() => toggle(category.slug)}>
              {category.name}
            </button>
          ))}
        </div>
      </fieldset>
      <label>
        <span>Email</span>
        <input value={user.email} disabled aria-describedby="pf-email-hint" />
        <small className="fb-field-hint" id="pf-email-hint">Your email is your login and can’t be changed in this demo.</small>
      </label>
      <button type="submit" className="fv-button">Save changes</button>
    </form>
  );
}

function SecuritySettings({ user }) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const formRef = useRef(null);
  const [values, setValues] = useState({ current: "", next: "", repeat: "" });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const schema = {
    current: [rules.required("Enter your current password.")],
    next: [rules.required("Choose a new password."), rules.minLength(8, "Use at least 8 characters."), rules.pattern(/\d/, "Include at least one number."), (value, all) => (value && value === all.current ? "Choose a password you haven’t used here." : "")],
    repeat: [rules.required("Repeat the new password."), (value, all) => (value && value !== all.next ? "Passwords don’t match." : "")],
  };
  const errors = submitted ? { ...validateForm(values, schema), ...(serverError ? { current: serverError } : {}) } : {};

  const submit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");
    const found = validateForm(values, schema);
    if (Object.keys(found).length) {
      focusFirstError(formRef.current, found);
      return;
    }
    const result = await changePassword(values.current, values.next);
    if (!result.ok) {
      setServerError(result.message);
      focusFirstError(formRef.current, { current: true });
      return;
    }
    setValues({ current: "", next: "", repeat: "" });
    setSubmitted(false);
    toast("Use your new password next time you log in.", { title: "Password changed" });
  };

  const signOut = () => {
    // Leave the members-only page first, then end the session on the next tick.
    navigate("/");
    setTimeout(() => {
      logOut();
      toast("See you soon!", { type: "info", title: "Logged out" });
    }, 0);
  };

  const remove = async () => {
    const ok = await confirm({
      tone: "danger",
      title: "Delete your account?",
      message: "Your profile, saved cart and order history on this browser will be permanently removed.",
      confirmLabel: "Delete account",
    });
    if (!ok) return;
    navigate("/");
    setTimeout(() => {
      deleteAccount();
      toast("Your account and its data were removed from this browser.", { type: "info", title: "Account deleted" });
    }, 0);
  };

  const field = (name, label, autoComplete) => (
    <label htmlFor={`sec-${name}`}>
      <span>{label}</span>
      <input name={name} type="password" autoComplete={autoComplete} value={values[name]} onChange={(event) => setValues({ ...values, [name]: event.target.value })} {...fieldA11y(`sec-${name}`, errors[name])} />
      <FieldError id={`sec-${name}`} message={errors[name]} />
    </label>
  );

  return (
    <div className="acc-security">
      <form ref={formRef} className="fv-form acc-form" onSubmit={submit} noValidate>
        <h3>Change password</h3>
        {field("current", "Current password", "current-password")}
        {field("next", "New password", "new-password")}
        {field("repeat", "Repeat new password", "new-password")}
        <button type="submit" className="fv-button">Update password</button>
      </form>
      <div className="acc-danger">
        <h3>Session</h3>
        <p className="fv-muted">Signed in as {user.email}.</p>
        <button type="button" className="fv-button-outline" onClick={signOut}><LogOut size={16} /> Log out</button>
        <h3>Danger zone</h3>
        <FormAlert type="warning" title="Deleting is permanent">Your saved cart and order history are removed along with your profile.</FormAlert>
        <button type="button" className="fv-button-outline danger" onClick={remove}>Delete my account</button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuth();
  const [params, setParams] = useSearchParams();
  const bookmarks = useBookmarks();
  const cart = useCart();
  const tab = tabs.some((entry) => entry.id === params.get("tab")) ? params.get("tab") : "overview";
  const orders = getOrders(user.id);
  const wishlist = products.filter((product) => bookmarks.some((entry) => entry.uid === product.uid));
  const favoriteHubs = categories.filter((category) => user.favorites?.includes(category.slug));
  const recommended = products
    .filter((product) => !favoriteHubs.length || user.favorites.includes(product.category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const spent = orders.reduce((sum, order) => sum + order.totals.total, 0);

  return (
    <main className="fv-page">
      <div className="fv-container">
        <Breadcrumbs trail={[{ label: "My account" }]} />

        <header className="acc-header">
          <Avatar user={user} size={84} />
          <div>
            <span className="fv-eyebrow">Member since {new Date(`${user.joined}T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            <h1>{user.name}</h1>
            <p className="fv-muted">{user.bio || "Add a short bio from the Profile tab."}</p>
            {favoriteHubs.length > 0 && (
              <div className="acc-hub-chips">
                {favoriteHubs.map((category) => <Link key={category.slug} to={category.path}>{category.name}</Link>)}
              </div>
            )}
          </div>
        </header>

        <nav className="acc-tabs" role="tablist" aria-label="Account sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""} onClick={() => setParams(id === "overview" ? {} : { tab: id }, { replace: true })}>
              <Icon size={16} /> {label}
              {id === "orders" && orders.length > 0 && <b>{orders.length}</b>}
              {id === "wishlist" && wishlist.length > 0 && <b>{wishlist.length}</b>}
            </button>
          ))}
        </nav>

        <section className="acc-panel" role="tabpanel">
          {tab === "overview" && (
            <>
              <dl className="fv-stats acc-stats">
                <div><dt><Package size={14} /> Orders</dt><dd>{orders.length}</dd></div>
                <div><dt><ShoppingBag size={14} /> In cart</dt><dd>{cartTotals(cart).count}</dd></div>
                <div><dt><Bookmark size={14} /> Bookmarks</dt><dd>{bookmarks.length}</dd></div>
                <div><dt><CalendarDays size={14} /> Total spent</dt><dd>{formatPrice(spent)}</dd></div>
              </dl>
              {cart.length > 0 && (
                <FormAlert type="info" title={`You have ${cartTotals(cart).count} items waiting in your cart`}>
                  <Link to="/cart">Review your cart and check out →</Link>
                </FormAlert>
              )}
              <div className="acc-overview-grid">
                <div>
                  <h2 className="shop-panel-title">Recent orders</h2>
                  <OrdersList orders={orders.slice(0, 3)} />
                </div>
              </div>
              <h2 className="shop-panel-title">{favoriteHubs.length ? "Picked for your favourite hubs" : "Top-rated merch"}</h2>
              <div className="shop-grid">{recommended.map((product, index) => <ProductCard key={product.uid} product={product} index={index} />)}</div>
            </>
          )}
          {tab === "orders" && <OrdersList orders={orders} />}
          {tab === "wishlist" &&
            (wishlist.length ? (
              <div className="shop-grid">{wishlist.map((product, index) => <ProductCard key={product.uid} product={product} index={index} />)}</div>
            ) : (
              <div className="fv-empty">
                <Heart size={32} />
                <h3>Your wishlist is empty</h3>
                <p>Tap the heart on any product to save it here.</p>
                <Link className="fv-button" to="/shop">Browse merch</Link>
              </div>
            ))}
          {tab === "settings" && <ProfileSettings key={user.id} user={user} />}
          {tab === "security" && <SecuritySettings user={user} />}
        </section>

        <p className="fv-muted acc-foot">
          Looking for something? <Link to={productPath(products[0])}>Shop bestsellers</Link> · <Link to="/bookmarks">All bookmarks</Link>
        </p>
      </div>
    </main>
  );
}
