import trailers from "../../JSON/trailers/trailers.json";
import TrailerCard from "./TrailerCard";

export default function RecentTrailers() {
  const recent = trailers.filter(
    (trailer) => trailer.status === "recentlyReleased"
  );

  return (
    <div className="trailers-grid">
      {recent.map((trailer) => (
        <TrailerCard
          key={trailer.title}
          trailer={trailer}
          type="Recently Released"
        />
      ))}
    </div>
  );
}