import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { SiteFooter } from "../components/SiteChrome.jsx";
import Section from "../components/Section.jsx";

export default function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <div className="layout solo">
      <main>
        <Section id="not-found" title="Page not found">
          <p>This page doesn’t exist. Choose your system to start the setup.</p>
          <div className="dl-row">
            <Link to="/windows" className="dl-btn main">Windows</Link>
            <Link to="/macos-linux" className="dl-btn main">macOS / Linux</Link>
          </div>
        </Section>
        <SiteFooter />
      </main>
    </div>
  );
}
