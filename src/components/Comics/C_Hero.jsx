import { Link } from "react-router-dom";
import "../../styles/MarvelHero.css";
import bg from "../../assets/Comics_hero/Comics_hero.jpeg"
import spiderMan from "../../assets/Comics_hero/Comics_hero1.jpeg"
import tomAndJerry from "../../assets/Comics_hero/Comics_hero2.jpeg"
import batman from "../../assets/Movie_Article_img/the-batman.png"
import ironMan from "../../assets/Movie_Article_img/avengers-endgame.png"
import bg_main from "../../assets/Comics_hero/Comics_main.gif"

const comicCards = [
  {
    title: "SPIDER-MAN",
    category: "WEB SLINGER",
    image: spiderMan,
    link: "/detail/comics/character/spider-man",
  },
  {
    title: "BATMAN",
    category: "DARK KNIGHT",
    image: batman,
    link: "/detail/comics/character/batman",
  },
  {
    title: "IRON MAN",
    category: "ARMORED AVENGER",
    image: ironMan,
    link: "/detail/comics/character/iron-man",
  },
  {
    title: "TOM & JERRY",
    category: "CLASSIC COMICS",
    image: tomAndJerry,
    link: "/detail/comics/character/tom-jerry",
  },
];

export default function Comecs_Hero() {
  return (
    <section className="marvel-hero" aria-labelledby="comics-hero-title">
      <h1 id="comics-hero-title" className="sr-only">Comics — enter the world of heroes</h1>

      {/* Background Artwork */}
      <div className="marvel-background">
        <img
          src={bg}
          alt=""
          className="background-image"
        />

        <div className="background-overlay"></div>
      </div>

      {/* Decorative comic lines */}
      <div className="hero-lines hero-lines-left"></div>
      <div className="hero-lines hero-lines-right"></div>

      {/* Main Hero Content */}
      <div className="marvel-hero-content">

        {/* Comic Cards */}
        <div className="comic-cards">

          {comicCards.map((comic, index) => (
            <Link
              to={comic.link}
              className={`comic-card comic-card-${index + 1}`}
              key={comic.title}
            >

              <div className="comic-card-image">
                <img
                  src={comic.image}
                  alt={comic.title}
                />

                <div className="comic-card-overlay"></div>

                <span className="comic-number">
                  0{index + 1}
                </span>
              </div>

              <div className="comic-card-content">
                <span className="comic-category">
                  {comic.category}
                </span>

                <h3>{comic.title}</h3>

                <span className="comic-arrow">
                  →
                </span>
              </div>

            </Link>
          ))}

        </div>

        {/* Central Hero */}
        <div className="hero-character">

          <div className="character-glow"></div>

          <img
            src={bg_main}
            alt="Marvel superhero"
            className="hero-gif"
          />

        </div>

        {/* Bottom text */}
        <div className="hero-bottom">

          <div className="hero-bottom-line"></div>

          <p>
            ENTER THE WORLD OF
            <strong> HEROES</strong>
          </p>

          <div className="hero-bottom-line"></div>

        </div>

      </div>

    </section>
  );
}