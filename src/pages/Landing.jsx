import { Link } from "react-router-dom";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { Hero, SiteFooter, LEAD } from "../components/SiteChrome.jsx";
import Section from "../components/Section.jsx";
import { DISCORD_URL } from "../config.js";

export default function Landing() {
  useDocumentTitle("Minecraft Network Setup Guide");
  return (
    <div className="layout solo">
      <main>
        <Hero title="Join the Minecraft server" lead={LEAD} />
        <Section id="choose" title="Choose your system">
          <div className="os-grid">
            <Link to="/windows" className="os-btn">
              <strong>Windows</strong>
              <span>Windows 10 or 11</span>
            </Link>
            <Link to="/macos-linux" className="os-btn">
              <strong>macOS / Linux</strong>
              <span>Mac or Linux computer</span>
            </Link>
          </div>
          <p className="dl-note">
            You will need the Tailscale auth key from the{" "}
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a>.
          </p>
        </Section>
        <SiteFooter />
      </main>
    </div>
  );
}
