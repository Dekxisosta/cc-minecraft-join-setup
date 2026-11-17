import GuideLayout from "../components/GuideLayout.jsx";
import Section, { Step } from "../components/Section.jsx";
import Console from "../components/Console.jsx";
import Tabs from "../components/Tabs.jsx";
import Key from "../components/Key.jsx";
import { DiscordBox, JoinSection, CreditsSection, ProblemsTable } from "../components/SharedSections.jsx";
import { windowsRows } from "../data/problems.jsx";
import { TOC } from "../data/toc.js";
import { DISCORD_URL, MC_HOST, MC_PORT, TAILSCALE_DOWNLOAD_URL } from "../config.js";

const Code = ({ children }) => <code className="i">{children}</code>;

const CMD = {
  unblockAll: String.raw`Unblock-File "$env:USERPROFILE\Downloads\Join-MinecraftNetwork.*"`,
  cd: String.raw`cd "C:\Temp"`,
  unblockPs1: String.raw`Unblock-File .\Join-MinecraftNetwork.ps1`,
  runPs1: String.raw`powershell -NoProfile -ExecutionPolicy Bypass -File .\Join-MinecraftNetwork.ps1`,
  tailscaleUp: String.raw`& "$env:ProgramFiles\Tailscale\tailscale.exe" up --reset --authkey=PASTE_KEY_HERE`,
  testPort: `Test-NetConnection ${MC_HOST} -Port ${MC_PORT}`,
  logout: String.raw`& "$env:ProgramFiles\Tailscale\tailscale.exe" logout`,
  check1: String.raw`Get-ChildItem *.ps1*
(Get-Content .\Join-MinecraftNetwork.ps1).Count`,
  check2: String.raw`$e = $null
[System.Management.Automation.Language.Parser]::ParseFile("$PWD\Join-MinecraftNetwork.ps1", [ref]$null, [ref]$e)
$e`,
  check3: String.raw`Set-ExecutionPolicy -Scope Process Bypass -Force
.\Join-MinecraftNetwork.ps1`,
  check4: String.raw`# Is Tailscale connected?
& "$env:ProgramFiles\Tailscale\tailscale.exe" status

# Can you reach the server?
Test-NetConnection ${MC_HOST} -Port ${MC_PORT}`,
};

const PASTE_KEY = (
  <p>When asked for <strong>Auth key</strong>, paste the key from the Discord server (right-click or Ctrl+V) and press Enter. It shows as * characters.</p>
);

function BatSteps() {
  return (
    <ol className="steps">
      <Step title="Open the folder">
        <p>Go to the folder where you extracted the zip.</p>
      </Step>
      <Step title={<><Key>Double-click</Key> <Code>Join-MinecraftNetwork.bat</Code></>}>
        <p>If Windows shows <em>Windows protected your PC</em>, click <strong>More info</strong>, then <strong>Run anyway</strong>.</p>
      </Step>
      <Step title={<><Key>Allow</Key> administrator access</>}>
        <p>Click <strong>Yes</strong> on the prompt. The launcher needs it to install Tailscale.</p>
      </Step>
      <Step title={<><Key>Paste</Key> your auth key</>}>{PASTE_KEY}</Step>
      <Step title={<>Wait for <Key>READY TO PLAY</Key></>}>
        <p>Progress bars show each stage. The server address is copied to your clipboard when it finishes.</p>
      </Step>
    </ol>
  );
}

function PowerShellSteps() {
  return (
    <ol className="steps">
      <Step title={<>Open PowerShell <Key>as administrator</Key></>}>
        <p>Press <strong>Start</strong>, type <strong>PowerShell</strong>, right-click the result, and choose <strong>Run as administrator</strong>. Click <strong>Yes</strong>.</p>
      </Step>
      <Step title="Go to the script’s folder">
        <p>Use the folder where you extracted the zip.</p>
        <Console label="PowerShell" code={CMD.cd} />
      </Step>
      <Step title={<><Key>Unblock</Key> the file (once)</>}>
        <p>Downloaded files are marked as blocked. This clears the mark and prints nothing when it works.</p>
        <Console label="PowerShell" code={CMD.unblockPs1} />
      </Step>
      <Step title="Run the script">
        <p><Code>-ExecutionPolicy Bypass</Code> skips the script-blocking policy for this run only. Nothing on your system changes.</p>
        <Console label="PowerShell" code={CMD.runPs1} />
      </Step>
      <Step title={<><Key>Paste</Key> your auth key</>}>{PASTE_KEY}</Step>
      <Step title={<>Wait for <Key>READY TO PLAY</Key></>}>
        <p>The server address is copied to your clipboard when it finishes.</p>
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
          <p>Download it from <a href={TAILSCALE_DOWNLOAD_URL}>tailscale.com/download</a> and run the installer. If the app asks you to sign in, <Key>close that window</Key>. You connect with the auth key instead.</p>
        </Step>
        <Step title="Connect with the auth key">
          <p>Open PowerShell <Key>as administrator</Key> and run this command. <Key>Replace</Key> <Code>PASTE_KEY_HERE</Code> with the key from the <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a>.</p>
          <Console label="PowerShell (Administrator)" code={CMD.tailscaleUp} />
          <p>If this computer is already signed in to a different Tailscale network, add <Code>--force-reauth</Code> to the end of the command. That disconnects you from the other network.</p>
        </Step>
        <Step title="Check the connection">
          <p>PowerShell should print <Code>TcpTestSucceeded : True</Code>.</p>
          <Console label="PowerShell" code={CMD.testPort} />
        </Step>
        <Step title="Join in Minecraft">
          <p>Continue with <a href="#join">Join in Minecraft</a> below. Copy the server address from that box, because nothing copies it for you here.</p>
        </Step>
      </ol>
    </>
  );
}

function Downloads() {
  return (
    <div className="dl">
      <h3>Download the setup files</h3>
      <p>You need <Key>both</Key> the <Code>.bat</Code> and the <Code>.ps1</Code> in the <Key>same folder</Key> on a <Key>local drive</Key>, such as <Code>C:\Temp</Code>. Then follow the steps below.</p>
      <div className="dl-row">
        <a className="dl-btn main" href="/Join-MinecraftNetwork.bat" download>Download .bat launcher</a>
        <a className="dl-btn main" href="/Join-MinecraftNetwork.ps1" download>Download .ps1 script</a>
      </div>
      <p className="dl-note">If your browser warns about these files, choose <strong>Keep</strong>.</p>
      <h3 style={{ marginTop: "1.1rem" }}><span className="tag-important">Important</span>Unblock the files (once)</h3>
      <p>Windows blocks files downloaded from the internet and shows <em>These files can’t be opened</em>. Open <strong>PowerShell</strong> and run this to clear the block. It prints nothing when it works. If you saved the files somewhere other than Downloads, change the path.</p>
      <Console label="PowerShell" code={CMD.unblockAll} />
      <p className="dl-note">No PowerShell? Right-click each file, choose <strong>Properties</strong>, tick <strong>Unblock</strong> at the bottom, then click <strong>OK</strong>.</p>
    </div>
  );
}

export default function WindowsPage() {
  return (
    <GuideLayout
      title="Minecraft setup for Windows"
      pageTitle="Windows – Minecraft Network Setup Guide"
      toc={TOC}
    >
      <Section id="before" title="Before you start">
        <ul className="plain">
          <li>A Windows 10 or 11 PC with <Key>administrator access</Key>.</li>
          <li>Minecraft Java Edition.</li>
          <li>The setup files: <Code>Join-MinecraftNetwork.bat</Code> and <Code>.ps1</Code>. Download them in the next section, or use the zip from the host.</li>
          <li>The Tailscale auth key from the <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a>. It starts with <Code>tskey-</Code>. You paste it during setup.</li>
          <li>The zip extracted to a <Key>local drive</Key> such as <Code>C:\Temp</Code>, with <Key>both</Key> files in the <Key>same folder</Key>. Running from inside the zip or from a mapped or network drive fails.</li>
        </ul>
      </Section>

      <Section id="setup" title="Set up the connection">
        <DiscordBox />
        <Downloads />
        <h3>Choose your preferred setup method</h3>
        <p>Pick one of the three tabs below.</p>
        <ul className="plain">
          <li>Choose <strong>Windows launcher (.bat)</strong> if this is your first try. You double-click one file and follow the prompts.</li>
          <li>Choose <strong>Windows PowerShell</strong> if the launcher does nothing or the window closes instantly. It shows every error.</li>
          <li>Choose <strong>Install it yourself</strong> if you would rather skip the scripts and connect by hand.</li>
        </ul>
        <Tabs
          label="Setup method"
          tabs={[
            { id: "bat", label: "Windows launcher (.bat)", content: <BatSteps /> },
            { id: "powershell", label: "Windows PowerShell", content: <PowerShellSteps /> },
            { id: "manual", label: "Install it yourself", content: <ManualSteps /> },
          ]}
        />
      </Section>

      <JoinSection />

      <Section id="output" title="What you’ll see">
        <p>The setup runs in five stages and shows a progress bar for each wait.</p>
        <ul className="stages">
          <li><b>1/5</b><span>Checking system: administrator rights.</span></li>
          <li><b>2/5</b><span>Installing Tailscale: download, signature check, silent install. Skipped if already installed.</span></li>
          <li><b>3/5</b><span>Starting the Tailscale service.</span></li>
          <li><b>4/5</b><span>Joining the private network. Skipped if you are already connected to it. If you are on a different Tailscale account, it asks before switching.</span></li>
          <li><b>5/5</b><span>Testing the Minecraft server, up to five attempts.</span></li>
        </ul>
        <p>If anything fails, the window stays open, shows the error in red, and saves it to <Code>%TEMP%\join-minecraft.log</Code>.</p>
      </Section>

      <Section id="fix" title="Fix problems">
        <ProblemsTable rows={windowsRows} />
        <details>
          <summary>Still nothing happens? Run these checks</summary>
          <p>Run them in order in an administrator PowerShell, in the script’s folder.</p>

          <h3>1. Confirm the file and its name</h3>
          <p>If you see <Code>Join-MinecraftNetwork.ps1.txt</Code>, rename it to remove <Code>.txt</Code>. Windows often hides extensions. The line count should be about 310.</p>
          <Console label="PowerShell" code={CMD.check1} />

          <h3>2. Check for syntax errors</h3>
          <p>This prints nothing if the file is valid.</p>
          <Console label="PowerShell" code={CMD.check2} />

          <h3>3. Run it in the current window</h3>
          <p>Nothing can close this window, so every message stays visible.</p>
          <Console label="PowerShell" code={CMD.check3} />

          <h3>4. Check the connection by hand</h3>
          <Console label="PowerShell" code={CMD.check4} />
        </details>
      </Section>

      <Section id="cleanup" title="Leave the network">
        <p>To disconnect this device, run this in an administrator PowerShell:</p>
        <Console label="PowerShell (Administrator)" code={CMD.logout} />
        <p>To remove Tailscale completely, go to <strong>Settings</strong>, <strong>Apps</strong>, <strong>Installed apps</strong>, <strong>Tailscale</strong>, <strong>Uninstall</strong>.</p>
      </Section>

      <CreditsSection />
    </GuideLayout>
  );
}
