import trailers from "../../JSON/trailers/trailers.json";
import TrailerCard from "./TrailerCard";

export default function AllTrailers() {
  return (
    <div className="trailers-grid">
      {trailers.map((trailer) => (
        <TrailerCard
          key={trailer.title}
          trailer={trailer}
          type="Trailer"
        />
      ))}
    </div>
  );
}