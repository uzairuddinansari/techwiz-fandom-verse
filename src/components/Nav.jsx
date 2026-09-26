import { useEffect, useState } from "react";
import Shutter from "./Shutter";
import "../styles/Nav.css";
import logo from "../assets/Nav/Nav_logo.png"
import { Link, NavLink } from "react-router-dom";
import NavSearch from "./NavSearch";
import { Bookmark, ShoppingBag } from "lucide-react";
import UserMenu from "./shop/UserMenu";
import { useBookmarks } from "../fandom/store";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bookmarks = useBookmarks();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav_parent ${scrolled ? "is-scrolled" : ""}`}>
        <nav className="nav" aria-label="Main">
         <Link to="/" className="nav_logo" aria-label="FandomVerse home">
            <img src={logo} alt="FandomVerse" />
          </Link>

          <div className="nav_right">
            <NavSearch />

            <NavLink to="/bookmarks" className="nav_pill nav_bookmarks" aria-label={`Bookmarks (${bookmarks.length})`}>
              <Bookmark size={16} />
              {bookmarks.length > 0 && <span>{bookmarks.length}</span>}
            </NavLink>

            <NavLink to="/shop" className="nav_pill nav_shop">
              <ShoppingBag size={16} />
              <span>Shop</span>
            </NavLink>

            <UserMenu />

            <button className="nav_menu" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
              <span>Menu</span>
              <span className="menu_icon" aria-hidden="true">
                <i></i>
                <i></i>
              </span>
            </button>
          </div>
        </nav>
      </header>

      <Shutter open={open} setOpen={setOpen} />
    </>
  );
};

export default Nav;
