import { Link } from "react-router-dom";
import useActiveSection from "../hooks/useActiveSection.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { Hero, SiteFooter, LEAD } from "./SiteChrome.jsx";

// Shared frame for the /windows and /macos-linux pages.
// toc: [{ id, label }]. Every id must match a <Section id>.
export default function GuideLayout({ title, pageTitle, toc, children }) {
  useDocumentTitle(pageTitle);
  const active = useActiveSection(toc.map((t) => t.id));

  return (
    <div className="layout">
      <nav className="toc" aria-label="On this page">
        <p>On this page</p>
        <ul>
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className={active === t.id ? "active" : undefined}>
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <Link to="/" className="dl-btn back">Choose a different system</Link>
        <Hero title={title} lead={LEAD} />
        {children}
        <SiteFooter />
      </main>
    </div>
  );
}
