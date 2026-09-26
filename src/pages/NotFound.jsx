import { Link } from "react-router-dom";
import { categories } from "../fandom/catalog";
import "../styles/Fandom.css";

export default function NotFound() {
  return (
    <main className="fv-page">
      <div className="fv-container fv-empty fv-not-found">
        <span className="fv-eyebrow">Error 404</span>
        <h1>Page not found</h1>
        <p>This route is not part of FandomVerse — but all seven hubs are still here.</p>
        <div className="fv-suggestions">
          {categories.map((category) => (
            <Link key={category.slug} to={category.path}>{category.name}</Link>
          ))}
        </div>
        <Link className="fv-button" to="/">Back to home</Link>
      </div>
    </main>
  );
}
