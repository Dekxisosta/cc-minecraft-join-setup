import { Link, useLocation } from "react-router-dom";

// Every page ends with the same navigation, so the plugins list can be reached
// from anywhere and the guide is never a dead end.
const LINKS = [
  { to: "/", label: "Setup guide home", note: "Start at the beginning" },
  { to: "/windows", label: "Windows setup", note: "Windows 10 or 11" },
  { to: "/macos-linux", label: "macOS and Linux setup", note: "Mac or Linux computer" },
  {
    to: "/plugins",
    label: "Plugins on the server",
    note: "What is installed, and every command",
    highlight: true,
  },
];

export default function SiteNav() {
  const { pathname } = useLocation();

  return (
    <nav className="site-nav" aria-label="Site navigation">
      <p className="sn-title">More on this site</p>
      <ul>
        {LINKS.map((l) => {
          const here = pathname === l.to;
          const cls = ["sn-link", l.highlight ? "sn-hot" : "", here ? "sn-here" : ""]
            .filter(Boolean)
            .join(" ");
          return (
            <li key={l.to}>
              {here ? (
                <span className={cls} aria-current="page">
                  <strong>{l.label}</strong>
                  <small>You are here</small>
                </span>
              ) : (
                <Link className={cls} to={l.to}>
                  <strong>{l.label}</strong>
                  <small>{l.note}</small>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
