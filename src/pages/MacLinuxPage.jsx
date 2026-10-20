import GuideLayout from "../components/GuideLayout.jsx";
import Section, { Step } from "../components/Section.jsx";
import Console from "../components/Console.jsx";
import Tabs from "../components/Tabs.jsx";
import Key from "../components/Key.jsx";
import { DiscordBox, JoinSection, CreditsSection, ProblemsTable } from "../components/SharedSections.jsx";
import { unixRows } from "../data/problems.jsx";
import { TOC } from "../data/toc.js";
import { DISCORD_URL, MC_HOST, MC_PORT, TAILSCALE_DOWNLOAD_URL } from "../config.js";

const Code = ({ children }) => <code className="i">{children}</code>;

const CMD = {
  cd: "cd ~/Downloads",
  run: "bash join-minecraft-network.sh",
  linuxInstall: "curl -fsSL https://tailscale.com/install.sh | sh",
  macUp: "sudo /Applications/Tailscale.app/Contents/MacOS/Tailscale up --reset --authkey=PASTE_KEY_HERE",
  linuxUp: "sudo tailscale up --reset --authkey=PASTE_KEY_HERE",
  check: `nc -zv ${MC_HOST} ${MC_PORT}`,
  logout: "sudo tailscale logout",
};

function ScriptSteps() {
  return (
    <ol className="steps">
      <Step title="Open Terminal">
        <p>On a Mac, press <strong>Cmd+Space</strong>, type <strong>Terminal</strong>, and press Enter. On Linux, open your terminal app.</p>
      </Step>
      <Step title="Go to the download folder">
        <Console label="Terminal" code={CMD.cd} />
      </Step>
      <Step title="Run the script">
        <p>Starting it with <Code>bash</Code> means you don’t need to change any file permissions. It asks for <Key>your computer password</Key> once, because installing and starting Tailscale needs <Code>sudo</Code>.</p>
        <Console label="Terminal" code={CMD.run} />
      </Step>
      <Step title={<><Key>Paste</Key> your auth key</>}>
        <p>When asked for <strong>Auth key</strong>, paste the key from the Discord server and press Enter. Nothing shows as you paste. That is normal. If Tailscale is already connected to the Minecraft network, the script skips this.</p>
      </Step>
      <Step title={<>Wait for <Key>READY TO PLAY</Key></>}>
        <p>The server address is copied to your clipboard when it finishes. On a Mac without Homebrew, install Tailscale from <a href={TAILSCALE_DOWNLOAD_URL}>tailscale.com/download</a>, open it once, then run the script again.</p>
      </Step>
    </ol>
  );
}

function ManualSteps() {
  return (
    <>
      <p>No scripts needed. You install Tailscale yourself, then connect it with the auth key from the Discord server.</p>
      <ol className="steps">
        <Step title="Install Tailscale">
          <p>Mac: download it from <a href={TAILSCALE_DOWNLOAD_URL}>tailscale.com/download</a> and run the installer. If the app asks you to sign in, <Key>close that window</Key>. You connect with the auth key instead. Linux: run this in a terminal.</p>
          <Console label="Linux terminal" code={CMD.linuxInstall} />
        </Step>
        <Step title="Connect with the auth key">
          <p>Open a terminal and run the command for your system. <Key>Replace</Key> <Code>PASTE_KEY_HERE</Code> with the key from the <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a>.</p>
          <Console label="macOS Terminal" code={CMD.macUp} />
          <Console label="Linux terminal" code={CMD.linuxUp} />
          <p>If this computer is already signed in to a different Tailscale network, add <Code>--force-reauth</Code> to the end of the command. That disconnects you from the other network.</p>
        </Step>
        <Step title="Check the connection">
          <p>A successful check ends with <Code>succeeded</Code> or <Code>open</Code>.</p>
          <Console label="macOS / Linux terminal" code={CMD.check} />
        </Step>
        <Step title="Join in Minecraft">
          <p>Continue with <a href="#join">Join in Minecraft</a> below. Copy the server address from that box, because nothing copies it for you here.</p>
        </Step>
      </ol>
    </>
  );
}

export default function MacLinuxPage() {
  return (
    <GuideLayout
      title="Minecraft setup for macOS and Linux"
      pageTitle="macOS / Linux – Minecraft Network Setup Guide"
      toc={TOC}
    >
      <Section id="before" title="Before you start">
        <ul className="plain">
          <li>A Mac or Linux computer where you can use <Code>sudo</Code>.</li>
          <li>Minecraft Java Edition.</li>
          <li>The setup file: <Code>join-minecraft-network.sh</Code>. Download it in the next section, or use the zip from the host.</li>
          <li>The Tailscale auth key from the <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a>. It starts with <Code>tskey-</Code>. You paste it during setup.</li>
        </ul>
      </Section>

      <Section id="setup" title="Set up the connection">
        <DiscordBox />
        <div className="dl">
          <h3>Download the setup file</h3>
          <p>macOS and Linux need <Key>only</Key> the <Code>.sh</Code>. Then follow the steps below.</p>
          <div className="dl-row">
            <a className="dl-btn main" href="/join-minecraft-network.sh" download>Download .sh script</a>
          </div>
          <p className="dl-note">If your browser warns about this file, choose <strong>Keep</strong>.</p>
        </div>
        <h3>Choose your preferred setup method</h3>
        <p>Pick one of the two tabs below.</p>
        <ul className="plain">
          <li>Choose <strong>macOS / Linux script</strong> if this is your first try. You run one command and follow the prompts.</li>
          <li>Choose <strong>Install it yourself</strong> if you would rather skip the script and connect by hand.</li>
        </ul>
        <Tabs
          label="Setup method"
          tabs={[
            { id: "script", label: "macOS / Linux script", content: <ScriptSteps /> },
            { id: "manual", label: "Install it yourself", content: <ManualSteps /> },
          ]}
        />
      </Section>

      <JoinSection />

      <Section id="output" title="What you’ll see">
        <p>The setup runs in five stages.</p>
        <ul className="stages">
          <li><b>1/5</b><span>Checking system: administrator access with <Code>sudo</Code>. It may ask for your password.</span></li>
          <li><b>2/5</b><span>Installing Tailscale: the official installer on Linux, or Homebrew on a Mac. Skipped if already installed.</span></li>
          <li><b>3/5</b><span>Starting the Tailscale service.</span></li>
          <li><b>4/5</b><span>Joining the private network. Skipped if you are already connected to it. If you are on a different Tailscale account, it asks before switching.</span></li>
          <li><b>5/5</b><span>Testing the Minecraft server, up to five attempts.</span></li>
        </ul>
        <p>If anything fails, the script shows the error in red and stops.</p>
      </Section>

      <Section id="fix" title="Fix problems">
        <ProblemsTable rows={unixRows} />
      </Section>

      <Section id="cleanup" title="Leave the network">
        <p>To disconnect this device, run this in Terminal:</p>
        <Console label="Terminal" code={CMD.logout} />
      </Section>

      <CreditsSection />
    </GuideLayout>
  );
}
