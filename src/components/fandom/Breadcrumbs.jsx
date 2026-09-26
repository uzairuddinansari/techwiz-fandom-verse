import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/* trail: [{ label, to? }] — the last entry is the current page. */
export default function Breadcrumbs({ trail, className = "" }) {
  return (
    <nav className={`fv-breadcrumbs ${className}`} aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`}>
              <ChevronRight size={13} aria-hidden="true" />
              {last || !crumb.to ? (
                <span aria-current={last ? "page" : undefined}>{crumb.label}</span>
              ) : (
                <Link to={crumb.to}>{crumb.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
