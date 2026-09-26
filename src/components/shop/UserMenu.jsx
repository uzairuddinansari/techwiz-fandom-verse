import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Heart, LogOut, Package, ShoppingBag, User, UserRound } from "lucide-react";
import { logOut, useAuth } from "../../fandom/auth";
import { cartTotals, useCart } from "../../fandom/store";
import { toast } from "../ui/feedback";
import { Avatar } from "./ShopUI";

/* "Log in" pill for guests; avatar + dropdown for members. */
export default function UserMenu() {
  const user = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => !ref.current?.contains(event.target) && setOpen(false);
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    const next = ["/", "/account"].includes(pathname) ? "" : `?next=${encodeURIComponent(pathname)}`;
    return (
      <NavLink to={`/account${next}`} className="nav_pill nav_login">
        <UserRound size={16} />
        <span>Log in</span>
      </NavLink>
    );
  }

  const { count } = cartTotals(cart);
  const signOut = () => {
    setOpen(false);
    // Leave the members-only page first, then end the session on the next tick.
    navigate("/");
    setTimeout(() => {
      logOut();
      toast("See you soon!", { type: "info", title: "Logged out" });
    }, 0);
  };

  const links = [
    ["/profile", "My profile", User],
    ["/profile?tab=orders", "My orders", Package],
    ["/profile?tab=wishlist", "Wishlist", Heart],
    ["/cart", `Cart${count ? ` (${count})` : ""}`, ShoppingBag],
  ];

  return (
    <div className="user-menu" ref={ref}>
      <button type="button" className="nav_pill user-menu-trigger" onClick={() => setOpen((value) => !value)} aria-haspopup="menu" aria-expanded={open}>
        <Avatar user={user} size={30} />
        <span>{user.name.split(" ")[0]}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="user-menu-panel" role="menu">
          <div className="user-menu-head">
            <Avatar user={user} size={42} />
            <div>
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          {links.map(([to, label, Icon]) => (
            <Link key={to} to={to} role="menuitem" onClick={() => setOpen(false)}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button type="button" role="menuitem" onClick={signOut}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
