import Section, { Step } from "./Section.jsx";
import Console from "./Console.jsx";
import Key from "./Key.jsx";
import creditArt from "../assets/credit-art.jpg";
import { ADDRESS, DISCORD_URL } from "../config.js";

export function DiscordBox() {
  return (
    <div className="dl">
      <h3>Get your auth key first</h3>
      <p>The auth key is in the Discord server. Copy it before you start, because the setup asks you to paste it.</p>
      <div className="dl-row">
        <a className="dl-btn main" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Open the Discord server</a>
      </div>
    </div>
  );
}

export function JoinSection() {
  return (
    <Section id="join" title="Join in Minecraft">
      <Console label="Server address" code={ADDRESS} variant="address" />
      <ol className="steps">
        <Step title="Open Multiplayer">
          <p>Start Minecraft Java Edition and click <strong>Multiplayer</strong>.</p>
        </Step>
        <Step title="Add the server">
          <p>Click <strong>Add Server</strong> (or <strong>Direct Connection</strong>) and <Key>paste</Key> the address into <strong>Server Address</strong> with Ctrl+V.</p>
        </Step>
        <Step title="Join">
          <p>Click <strong>Done</strong>, then <Key>double-click</Key> the server.</p>
        </Step>
      </ol>
      <p>You only run the setup once. Running it again is safe: it skips anything already done. Tailscale reconnects on its own afterward. If you can’t connect later, run the setup again.</p>
    </Section>
  );
}

export function CreditsSection() {
  return (
    <Section id="credits" title="Credits">
      <div className="credit">
        <img src={creditArt} alt="Artwork of a chibi girl with red hair and a flower hat, holding a teddy bear" />
        <div>
          <p className="role">Server hosting setup</p>
          <p className="who">KannaLife</p>
        </div>
      </div>
      <p className="credit-small">Setup guide and scripts by <strong>Dekxisosta</strong>.</p>
      <p className="credit-small">Minecraft and its logo belong to Mojang Studios.</p>
    </Section>
  );
}

export function ProblemsTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Problem</th><th>Fix</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.problem}>
              <td>{r.problem}</td>
              <td>{r.fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
