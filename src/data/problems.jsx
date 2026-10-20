import { DISCORD_URL, TAILSCALE_DOWNLOAD_URL } from "../config.js";

const Code = ({ children }) => <code className="i">{children}</code>;

// ---- rows used on both pages ----
const noValidKey = {
  problem: "“No valid auth key entered”",
  fix: <>The key was missing or mistyped. Run the setup again and paste the full key from the host. It starts with <Code>tskey-</Code>.</>,
};
const failedToConnect = {
  problem: "“Tailscale failed to connect”",
  fix: <>The key may be expired, used up, or revoked. Ask in the <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord server</a> for a new one. If you use Tailscale with another account, sign out of it first.</>,
};
const notReachable = {
  problem: "Connected, but “server not reachable”",
  fix: "The server may be offline. Ask the host, wait a minute, and run again.",
};
const switchPrompt = (prompt) => ({
  problem: `“${prompt}”`,
  fix: <>This computer is already signed in to a different Tailscale account, or the server is offline. Answer <strong>Y</strong> to switch (you will be signed out of the other network and paste the key from the Discord server). Answer <strong>N</strong> to change nothing.</>,
});
const upFlags = {
  problem: "“changing settings via ‘tailscale up’ requires mentioning all non-default flags”",
  fix: <>Add <Code>--reset</Code> to the command. The setup scripts already do this.</>,
};

// ---- Windows ----
export const windowsRows = [
  {
    problem: "Window closes immediately",
    fix: "Extract the zip and keep both files in one local folder. If it still closes, use the PowerShell method.",
  },
  {
    problem: "“These files can’t be opened” or “Your Internet security settings prevented…”",
    fix: <>Windows marked the downloaded files as blocked. Run the <Code>Unblock-File</Code> command in the download box, or right-click each file, choose <strong>Properties</strong>, tick <strong>Unblock</strong>, and click <strong>OK</strong>. Then try again.</>,
  },
  {
    problem: "Windows or antivirus blocks the file",
    fix: <>Click <strong>More info</strong>, then <strong>Run anyway</strong>, or allow the file in your antivirus.</>,
  },
  {
    problem: "“Running scripts is disabled on this system”",
    fix: <>Use the PowerShell method with the <Code>-ExecutionPolicy Bypass</Code> command.</>,
  },
  {
    problem: "“The file is not digitally signed”",
    fix: <>Run <Code>Unblock-File .\Join-MinecraftNetwork.ps1</Code>, then try again.</>,
  },
  noValidKey,
  {
    problem: "“Installer signature invalid”",
    fix: "The download was corrupted or intercepted. Run again. If it repeats, tell the host.",
  },
  {
    problem: "“Tailscale service did not start”",
    fix: <>Restart your PC and run again, or run <Code>Start-Service Tailscale</Code> in an administrator PowerShell.</>,
  },
  failedToConnect,
  notReachable,
  switchPrompt("Switch this PC to the Minecraft network?"),
  {
    problem: "Tailscale is already on this PC, but under a different account or Windows user",
    fix: (
      <ul className="plain">
        <li><strong>Different Tailscale account:</strong> run the setup again and answer <strong>Y</strong> at <em>Switch this PC to the Minecraft network?</em> It signs the other account out and joins with your auth key. Tailscale keeps one account signed in at a time, so you will have to sign back in to the other network later.</li>
        <li><strong>Different Windows user on this PC:</strong> sign in to that Windows user, log out of Tailscale with the command in <a href="#cleanup">Leave the network</a>, then run the setup again from your own user.</li>
      </ul>
    ),
  },
  {
    problem: "“tailscale is not recognized”",
    fix: <>Open a new PowerShell window after installing, or use the full path shown in the “Install it yourself” tab.</>,
  },
  upFlags,
  {
    problem: "Anything else",
    fix: <>Send the host <Code>%TEMP%\join-minecraft.log</Code>. Paste that path into File Explorer to open it.</>,
  },
];

// ---- macOS and Linux ----
export const unixRows = [
  {
    problem: "“Permission denied”",
    fix: <>Run it with <Code>bash join-minecraft-network.sh</Code> instead of opening it directly.</>,
  },
  {
    problem: "macOS: “Install Tailscale from…”",
    fix: <>Homebrew isn’t installed. Install Tailscale from <a href={TAILSCALE_DOWNLOAD_URL}>tailscale.com/download</a>, open it once, then run the script again.</>,
  },
  {
    problem: "“sudo is needed” or “Administrator access is needed”",
    fix: <>Your account can’t use <Code>sudo</Code>. Run the script as an administrator account, or as root.</>,
  },
  {
    problem: "Linux: “curl is needed to download the installer”",
    fix: <>Install <Code>curl</Code> with your package manager, then run the script again.</>,
  },
  noValidKey,
  {
    problem: "“Tailscale service did not start”",
    fix: "Restart the computer and run again.",
  },
  failedToConnect,
  notReachable,
  switchPrompt("Switch to the Minecraft network?"),
  {
    problem: "Tailscale is already on this computer, but under a different account or user",
    fix: (
      <ul className="plain">
        <li><strong>Different Tailscale account:</strong> run the script again and answer <strong>Y</strong> at <em>Switch to the Minecraft network?</em> It signs the other account out and joins with your auth key. Tailscale keeps one account signed in at a time, so you will have to sign back in to the other network later.</li>
        <li><strong>Different user on a Mac:</strong> if macOS says Tailscale can’t open because someone else is using it, switch to that user, quit Tailscale, then run the script again from your own user.</li>
        <li><strong>Linux:</strong> Tailscale is shared by every user on the computer, so switching accounts affects all of them.</li>
      </ul>
    ),
  },
  {
    problem: "“command not found”",
    fix: <>Open a new terminal window after installing, or use the full path shown in the “Install it yourself” tab.</>,
  },
  upFlags,
  {
    problem: "Anything else",
    fix: "Copy the red error message from the terminal and send it to the host.",
  },
];
