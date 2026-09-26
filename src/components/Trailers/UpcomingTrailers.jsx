import trailers from "../../JSON/trailers/trailers.json";
import TrailerCard from "./TrailerCard";

export default function UpcomingTrailers() {
  const upcoming = trailers.filter(
    (trailer) => trailer.status === "upcoming"
  );

  return (
    <div className="trailers-grid">
      {upcoming.map((trailer) => (
        <TrailerCard
          key={trailer.title}
          trailer={trailer}
          type="Upcoming"
        />
      ))}
    </div>
  );
}