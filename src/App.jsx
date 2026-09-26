import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import Nav from "./components/Nav";
import AnimeFooter from "./components/Mywebsite/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Anim_hero from "./components/Anim/Anim_hero";
import ComicsHero from "./components/Comics/C_Hero";
import Trailers from "./components/Trailers/Trailers";
import AllTrailers from "./components/Trailers/AllTrailers";
import UpcomingTrailers from "./components/Trailers/UpcomingTrailers";
import RecentTrailers from "./components/Trailers/RecentTrailers";
import Gellery from "./pages/Gellery";
import TechwizJourney from "./pages/TechwizJourney";
import InstallationGuide from "./pages/InstallationGuide";
import HubLayout from "./components/fandom/HubLayout";
import CategoryContent from "./components/fandom/CategoryContent";
import SiteTools, { ScrollToTop } from "./components/fandom/SiteTools";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import BookmarksPage from "./pages/BookmarksPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ReleasesPage from "./pages/ReleasesPage";
import AccountPage from "./pages/AccountPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import TeamPage from "./pages/TeamPage";
import SitemapPage from "./pages/SitemapPage";
import { RequireAuth } from "./components/shop/ShopUI";
import { sections } from "./fandom/catalog";
import "./styles/UXPolish.css";
import "./styles/Fandom.css";

const AdminApp = lazy(() => import("./admin/AdminApp"));

/* The seven category hubs share one layout; Anime and Comics keep their bespoke heroes. */
const hubs = [
  { slug: "anime", path: "/Anime", hero: <Anim_hero /> },
  { slug: "gaming", path: "/Gaming" },
  { slug: "movies", path: "/Movies" },
  { slug: "tv-shows", path: "/TV_Shows" },
  { slug: "k-pop", path: "/K_Pop" },
  { slug: "comics", path: "/Comics", hero: <ComicsHero /> },
  { slug: "manga", path: "/Manga" },
];

export default function App() {
  const { pathname } = useLocation();

  // The admin panel has its own layout, without the public nav, footer and floating tools.
  if (pathname.toLowerCase().startsWith("/admin")) {
    return (
      <Suspense fallback={<div className="adm-loading">Loading admin…</div>}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <ScrollToTop />
      <Nav />
      <PageTransition>
        <div id="main-content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/Collection" element={<Navigate to="/bookmarks" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/team/:slug" element={<TeamPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:category/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
            <Route path="/orders/:orderId" element={<RequireAuth><OrderPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="/releases" element={<ReleasesPage />} />
            <Route path="/detail/:category/:type/:id" element={<DetailPage />} />
            <Route path="/Gellery" element={<Gellery />} />
            <Route path="/installation" element={<InstallationGuide />} />
            <Route path="/TechwizJourney" element={<TechwizJourney />} />

            {hubs.map((hub) => (
              <Route key={hub.slug} path={hub.path} element={<HubLayout slug={hub.slug} hero={hub.hero} />}>
                <Route index element={<CategoryContent key="all" categorySlug={hub.slug} section="all" />} />
                {sections
                  .filter((section) => section.path)
                  .map((section) => (
                    <Route
                      key={section.key}
                      path={section.path}
                      element={<CategoryContent key={section.key} categorySlug={hub.slug} section={section.key} />}
                    />
                  ))}
                <Route path="trailer" element={<Navigate to={`${hub.path}/trailers`} replace />} />
              </Route>
            ))}

            <Route path="/Trailers" element={<Trailers />}>
              <Route index element={<AllTrailers />} />
              <Route path="upcoming" element={<UpcomingTrailers />} />
              <Route path="recently-released" element={<RecentTrailers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </PageTransition>
      <AnimeFooter />
      <SiteTools />
    </>
  );
}
