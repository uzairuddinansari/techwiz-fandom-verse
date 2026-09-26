import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, CalendarDays, Map as MapIcon, ShoppingBag, UserRound, UsersRound, Clapperboard, Compass, Film, Gamepad2, Info, LayoutDashboard, Mail, Music2, Search, Tv, BookOpen, Sparkles, Wrench } from "lucide-react";
import "../../styles/Footer.css";
import luffy from "../../assets/Footer/Monkey_D_luffey.jpeg";
import naruto from "../../assets/Footer/Naruto_uzumaki.jpeg";
import goku from "../../assets/Footer/Goku.png";

const animeCharacters = [
  { id: "luffy", name: "Monkey D. Luffy", jp: "モンキー・D・ルフィ", img: luffy, link: "/detail/anime/character/monkey-d-luffy" },
  { id: "naruto", name: "Naruto Uzumaki", jp: "うずまきナルト", img: naruto, link: "/detail/anime/character/naruto-uzumaki" },
  { id: "goku", name: "Son Goku", jp: "孫悟空", img: goku, link: "/detail/anime/character/son-goku" },
];

const hubs = [
  ["/Anime", "Anime", "アニメ", Sparkles],
  ["/Gaming", "Gaming", "ゲーム", Gamepad2],
  ["/Movies", "Movies", "映画", Film],
  ["/TV_Shows", "TV Shows", "テレビ", Tv],
  ["/K_Pop", "K-Pop", "K-POP", Music2],
  ["/Comics", "Comics", "コミック", BookOpen],
  ["/Manga", "Manga", "漫画", BookOpen],
];

const discover = [
  ["/shop", "Shop merch", "ショップ", ShoppingBag],
  ["/search", "Search", "検索", Search],
  ["/Trailers", "Trailers", "予告編", Clapperboard],
  ["/releases", "Release calendar", "カレンダー", CalendarDays],
  ["/bookmarks", "Bookmarks", "ブックマーク", Bookmark],
];

const help = [
  ["/profile", "My account", "マイページ", UserRound],
  ["/about", "About us", "私たちについて", Info],
  ["/team", "Our team", "チーム", UsersRound],
  ["/sitemap", "Site map", "サイトマップ", MapIcon],
  ["/contact", "Contact", "お問い合わせ", Mail],
  ["/installation", "Installation guide", "インストール", Wrench],
  ["/admin", "Admin panel", "管理", LayoutDashboard],
];

function LinkColumn({ title, titleJp, links, jp }) {
  return (
    <div className="footer-column">
      <h4 className="footer-heading">{jp ? titleJp : title}</h4>
      <ul className="footer-links">
        {links.map(([to, label, labelJp, Icon]) => (
          <li key={to}>
            <Link to={to}>
              <Icon size={15} aria-hidden="true" />
              {jp ? labelJp : label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const AnimeFooter = () => {
  const [japanese, setJapanese] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % animeCharacters.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const current = animeCharacters[currentIndex];

  return (
    <footer className="anime-footer">
      <div className="footer-topbar">
        <div className="footer-toggle-area">
          <label className="footer-toggle-label">
            <input type="checkbox" checked={japanese} onChange={() => setJapanese(!japanese)} aria-label="Show Japanese labels" />
            <span className="footer-toggle"></span>
          </label>
          <span className="footer-toggle-text">EN / JP Labels</span>
        </div>

        <div className="footer-server">
          <span className="server-dot"></span>
          <span>{japanese ? "すべてのコンテンツ準備完了" : "All content available offline-first"}</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-text">
              Fandom<span>Verse</span>
            </span>
          </div>

          <p className="footer-description">
            {japanese ? "7つのファンダムを、ひとつのポータルで。" : "One portal for seven vibrant fandom communities — articles, characters, trailers, events and merch."}
          </p>

          <Link to="/search" className="footer-cta">
            <Compass size={16} /> {japanese ? "探索を始める" : "Start exploring"}
          </Link>

          <p className="footer-disclaimer">
            © 2026 FandomVerse. An educational project — bookmarks and cart data stay in your browser and no purchases are processed.
            Franchise names and artwork belong to their respective owners.
          </p>
        </div>

        <div className="footer-navigation">
          <LinkColumn title="Hubs" titleJp="ハブ" links={hubs} jp={japanese} />
          <LinkColumn title="Discover" titleJp="発見" links={discover} jp={japanese} />
          <LinkColumn title="Help" titleJp="ヘルプ" links={help} jp={japanese} />
        </div>

        <Link to={current.link} className="footer-characters" aria-label={`View ${current.name}'s profile`}>
          <div className="footer-glow"></div>

          <div className="footer-character-wrapper">
            {animeCharacters.map((char, index) => (
              <img
                key={char.id}
                src={char.img}
                alt={index === currentIndex ? char.name : ""}
                loading="lazy"
                className={`footer-character ${index === currentIndex ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="footer-character-name">
            <span className="character-status"></span>
            <span>{japanese ? current.jp : current.name}</span>
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default AnimeFooter;
