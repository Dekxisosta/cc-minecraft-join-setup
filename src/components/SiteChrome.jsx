import minecraftLogo from "../assets/minecraft-logo.png";
import scene from "../assets/scene.jpg";
import camellia from "../assets/camellia-logo.png";

export function Hero({ title, lead }) {
  return (
    <header className="hero">
      <div className="hero-art">
        <img className="scene" src={scene} alt="Alex and Steve swimming underwater past coral, turtles and dolphins" />
        <img className="mc" src={minecraftLogo} alt="Minecraft" />
      </div>
      <div className="hero-text">
        <div>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
        </div>
        <div className="badge">
          <img src={camellia} alt="Café Camellia logo" />
          Café Camellia
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <img src={camellia} alt="" />
      Café Camellia Minecraft Network Setup Guide
    </footer>
  );
}

export const LEAD =
  "Run the setup once, and the server address is copied to your clipboard. Takes about two minutes.";
