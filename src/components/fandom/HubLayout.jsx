import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getCategory, sections } from "../../fandom/catalog";
import Breadcrumbs from "./Breadcrumbs";
import HubHero from "./HubHero";

/*
  Layout shared by all seven category hubs: hero, sticky section tabs,
  breadcrumb trail and the routed section content.
*/
export default function HubLayout({ slug, hero }) {
  const category = getCategory(slug);
  const { pathname } = useLocation();
  const current = sections.find((section) => section.path && pathname.toLowerCase().endsWith(`/${section.path}`));

  return (
    <>
      {hero || <HubHero slug={slug} />}

      <main className="hub-page" id="hub-content">
        <nav className="hub-tabs" aria-label={`${category.name} sections`}>
          {sections.map((section) => (
            <NavLink key={section.key} to={section.path ? `${category.path}/${section.path}` : category.path} end={!section.path}>
              {section.label}
            </NavLink>
          ))}
        </nav>

        <div className="fv-container hub-crumbs">
          <Breadcrumbs
            trail={
              current
                ? [{ label: category.name, to: category.path }, { label: current.label }]
                : [{ label: category.name }]
            }
          />
        </div>

        <Outlet />
      </main>
    </>
  );
}
