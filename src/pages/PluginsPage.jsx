import GuideLayout from "../components/GuideLayout.jsx";
import Section from "../components/Section.jsx";
import { ADDRESS } from "../config.js";

const TOC_HEAD = [{ id: "overview", label: "Overview" }];

const PLUGINS = [
  {
    id: "authme",
    name: "AuthMe",
    version: "5.7.0",
    tagline: "Password login for an offline-mode server.",
    body: "The network runs with online-mode off, so every account is protected by a password stored on the server. Register the first time you join, then log in on every later session.",
    commands: [
      ["/register <password> <password>", "Create your account (first join only)"],
      ["/login <password>", "Log in after a reconnect"],
      ["/logout", "End your session"],
      ["/changepassword <old> <new>", "Change your password"],
      ["/email add <address>", "Attach an email for recovery"],
    ],
    notes: "You cannot move, chat or use items until you have registered or logged in.",
  },
  {
    id: "skins",
    name: "SkinsRestorer",
    version: "15.12.6",
    tagline: "Custom skins on a server without Mojang authentication.",
    body: "Pick a skin by Minecraft name, or bring your own PNG. A PNG is uploaded through the official web page, which returns a /skin url command you paste in chat.",
    commands: [
      ["/skin set <name>", "Use the skin of a Minecraft account"],
      ["/skin url <url> [classic|slim]", "Use a skin generated from your own PNG"],
      ["/skin menu", "Open the skin browser"],
      ["/skin clear", "Go back to your account skin"],
      ["/skin update", "Refresh a copied skin"],
      ["/skin undo", "Undo the last change"],
    ],
    notes: "Upload your PNG at skinsrestorer.net/upload, copy the generated command, then run it in game.",
    link: { href: "https://skinsrestorer.net/upload", label: "Upload a skin PNG" },
  },
  {
    id: "imageframe",
    name: "ImageFrame",
    version: "2026.1.5",
    tagline: "Put any image or GIF on a map wall.",
    body: "Images are pulled from a direct URL and rendered onto maps. One map is 128x128 pixels; larger images span several maps. Animated GIFs work and play back at up to 20 frames per second.",
    commands: [
      ["/imageframe create <name> <url> <width> <height>", "Create an image map"],
      ["/imageframe create <name> <url> selection", "Create and place straight into selected frames"],
      ["/imageframe create <name> <url> <w> <h> combined", "Create and receive one combined map item"],
      ["/imageframe select", "Select item frames for the placement modes"],
      ["/imageframe list", "List the maps you have created"],
      ["/imageframe get <name>", "Get one of your maps back"],
      ["/imageframe refresh <name>", "Re-download from the source URL"],
      ["/imageframe delete <name>", "Delete one of your maps"],
      ["/imageframe giveinvisibleframe glowing 8", "Invisible item frames"],
    ],
    notes: "A direct link is required: it must open the image itself, not a web page. Hold empty maps when creating a map in survival mode.",
    steps: {
      title: "Getting a direct link",
      intro:
        "The host does not matter, only the link does. What follows is one sequence that has been tested on this server; any other host that gives a direct link works just as well.",
      items: [
        "Upload the picture to an image host. Imgur is the one tested here and needs no setup: open imgur.com, upload, and the picture gets its own page.",
        "Right-click the image itself and choose \"Copy image address\". Do not copy the address bar of the page.",
        "Paste the link somewhere to check it: it should end in .png, .jpg, .webp or .gif and open the bare image with no page around it.",
        "Run /imageframe create <name> <that link> 1 1 with empty maps in hand.",
      ],
    },
  },
  {
    id: "gsit",
    name: "GSit",
    version: "3.7.0",
    tagline: "Sit, lay down, crawl and spin.",
    body: "Right-click a stair, slab or carpet to sit on it. The commands cover the poses that a right-click cannot reach.",
    commands: [
      ["/sit", "Sit on the block you are looking at"],
      ["/lay", "Lie down"],
      ["/bellyflop", "Lie on your front"],
      ["/legsup", "Lie on your back with legs up"],
      ["/crawl", "Crawl along the ground"],
      ["/spin", "Spin in place"],
    ],
    notes: null,
  },
  {
    id: "tpa",
    name: "SimpleTPA",
    version: "1.6",
    tagline: "Teleport requests that both players agree to.",
    body: "Send a request, and the other player gets a clickable message in chat. Nothing moves until they accept.",
    commands: [
      ["/tpa <player>", "Ask to teleport to someone"],
      ["/tpahere <player>", "Ask someone to teleport to you"],
      ["/tpaccept", "Accept a request"],
      ["/tpdeny", "Decline a request"],
      ["/tpacancel", "Withdraw your own request"],
      ["/tpatoggle", "Stop receiving requests"],
    ],
    notes: "There is a short cooldown between requests.",
  },
  {
    id: "sethome",
    name: "SetHome",
    version: "6.3",
    tagline: "Save a spot and teleport back to it later.",
    body: "Every player can keep a number of named homes. The default limit is 15, and the server can give different limits to different ranks.",
    commands: [
      ["/sethome <name>", "Create a home where you stand"],
      ["/home <name>", "Teleport to one of your homes"],
      ["/delhome <name>", "Delete a home"],
      ["/listhomes <player>", "List a player's homes"],
      ["/admindelhome <player> <home>", "Admin: delete someone's home"],
    ],
    notes: "A cooldown applies between teleports. If you move while the teleport is counting down, it is cancelled.",
  },
  {
    id: "rtp",
    name: "justRTP",
    version: "3.8.0",
    tagline: "Random teleport to a safe spot.",
    body: "Sends you somewhere random inside a radius set per world. Landing spots are cached in the background, so most teleports do not have to search live.",
    commands: [
      ["/rtp", "Teleport to a random safe spot"],
      ["/rtp <world>", "Teleport into a specific world"],
      ["/rtp help", "List every subcommand"],
    ],
    notes: "There is a cooldown and a short warm-up. Ask an admin if you need a specific world or a wider radius.",
  },
  {
    id: "tablistping",
    name: "TabListPing",
    version: "2.03",
    tagline: "Everyone's ping, in the tab list.",
    body: "Shows how much latency each player actually has, measured by the plugin itself rather than taken from the server's rough estimate.",
    commands: [
      ["/tlp", "Short alias for the plugin command"],
      ["/tlp reload", "Reload the config (admin)"],
      ["/tlp report", "Print a ping report (admin)"],
    ],
    notes: "No setup needed: it starts working as soon as the server is up. The colour changes with the quality of the connection.",
  },
  {
    id: "speedghast",
    name: "Faster Happy Ghasts",
    version: "1.1.3",
    tagline: "Happy ghasts that actually get somewhere.",
    body: "Raises the flying speed of a ridden happy ghast. Vanilla tops out around 3.6 blocks per second, which is slower than walking; this server runs several times that.",
    commands: [
      ["/happyghast reload", "Reload the speed settings (admin)"],
    ],
    notes: "Speed is set in plugins/FasterHappyGhast/config.yml. Ghasts that nobody is riding keep the vanilla speed.",
  },
  {
    id: "callghast",
    name: "Call Your Happy Ghast",
    short: "Call Your Ghast",
    version: "2.2.0",
    tagline: "Whistle for your ghast with a goat horn.",
    body: "Name a happy ghast, bind it to a goat horn, and the horn will teleport it to you from anywhere — even from chunks that are not loaded.",
    steps: {
      title: "Binding a horn",
      items: [
        "Name the happy ghast. Names cannot contain characters like # or '.",
        "Hold a goat horn and sneak while looking at the ghast.",
        "The horn becomes enchanted and takes the ghast's name.",
        "Use the horn and the ghast teleports to you. Anyone holding that horn can call it.",
        "To unbind: sneak and look straight up.",
      ],
    },
    commands: [
      ["/trigger call_your_happy_ghast.config", "Open the config options"],
    ],
    notes: "Leashed animals travel with the ghast: attach the lead to the ghast first, then to the animal. The server also runs the lib-5555ff library this plugin needs.",
  },
  {
    id: "displays",
    name: "Dream Displays",
    version: "1.10.2",
    tagline: "Video screens inside the world.",
    body: "A display is a wall of black concrete. Select it with a diamond axe, create the display, then point it at a video URL. Playback is synchronised across the server, so everyone watching sees the same frame.",
    steps: {
      title: "Building a screen",
      items: [
        "Build the screen out of black concrete. That block is the display surface; its slabs and stairs can be selected too.",
        "Select the wall with a diamond axe: right-click one corner, then the opposite corner.",
        "Run /display create while looking at the selected blocks.",
        "Run /display video <url> to give the screen something to play.",
      ],
    },
    commands: [
      ["/display create", "Create a display from the selection you are looking at"],
      ["/display video <url>", "Set the video played on your display"],
      ["/display info", "Show details of the display you are looking at"],
      ["/display name this <name>", "Give a display a short alias"],
      ["/display delete", "Delete the display you are looking at"],
      ["/display list", "List every display on the server"],
      ["/display on|off [player]", "Enable or disable displays for a player"],
      ["/display fullscreen start <id|url>", "Broadcast a screen to everyone"],
      ["/display help", "Show every command in game"],
    ],
    notes:
      "Every player needs the Dream Displays client mod installed, otherwise screens stay blank. It is a Fabric mod, separate from this setup guide.",
    link: { href: "https://modrinth.com/plugin/dreamdisplays", label: "Get the client mod" },
  },
  {
    id: "statusbot",
    name: "Statusbot",
    version: "24.0",
    tagline: "A Discord bot that mirrors the server.",
    body: "Keeps a Discord bot's status in step with the server: how many players are online and who they are. It can also post server start, stop, join and leave messages into a channel you pick, and publish a status embed.",
    commands: [
      ["!help", "List the bot's commands"],
      ["!regChannelForMessages", "Register the channel (or DM) that receives events"],
      ["!endRegChannelForMessages", "Stop sending events there"],
      ["!sendEmbed", "Post the server status embed"],
    ],
    notes: "These are typed into Discord, with a leading exclamation mark. Registering a channel in a guild needs the Manage Channel permission there.",
  },
  {
    id: "discordsrv",
    name: "DiscordSRV",
    version: "1.30.5",
    tagline: "Chat bridge between Minecraft and Discord.",
    body: "Messages typed in game appear in the Discord channel, and messages typed in Discord appear in game chat with a [Discord] prefix. The same plugin can also relay the console and post join, leave, death and achievement notices.",
    commands: [
      ["/discord", "Show the Discord invite link"],
      ["/discordsrv link", "Get a code to link your Discord account"],
      ["/discordsrv linked", "Check whether you are linked"],
      ["/discordsrv unlink", "Remove the link"],
      ["!players", "In Discord: list who is online"],
      ["!c <command>", "In Discord: run a console command"],
    ],
    notes: "The bridge uses its own bot, separate from Statusbot. Only the #mc-chat channel is bridged, so keep general chat where it is.",
  },
];

// A-Z by plugin name; ties fall through to the next letter.
const sortedPlugins = [...PLUGINS].sort((a, b) =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" })
);

const TOC = [
  ...TOC_HEAD,
  ...sortedPlugins.map((p) => ({ id: p.id, label: p.short || p.name })),
];

function Plugin({ plugin }) {
  return (
    <Section id={plugin.id} title={plugin.name}>
      <p className="pg-tagline">
        <span className="pg-version">{plugin.version}</span> {plugin.tagline}
      </p>
      <p>{plugin.body}</p>
      {plugin.steps && (
        <div className="pg-steps">
          <h3>{plugin.steps.title}</h3>
          {plugin.steps.intro && <p className="pg-steps-intro">{plugin.steps.intro}</p>}
          <ol>
            {plugin.steps.items.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      )}
      {plugin.commands.length > 0 && (
        <ul className="pg-cmds">
          {plugin.commands.map(([cmd, what]) => (
            <li key={cmd}>
              <code>{cmd}</code>
              <span>{what}</span>
            </li>
          ))}
        </ul>
      )}
      {plugin.notes && <p className="pg-note">{plugin.notes}</p>}
      {plugin.link && (
        <p className="pg-link">
          <a href={plugin.link.href} target="_blank" rel="noopener noreferrer">
            {plugin.link.label}
          </a>
        </p>
      )}
    </Section>
  );
}

export default function PluginsPage() {
  return (
    <GuideLayout
      title="Plugins on the server"
      pageTitle="Plugins · Cafe Camellia"
      toc={TOC}
    >
      <Section id="overview" title="Overview">
        <p>
          Thirteen plugins are installed and running on <code>{ADDRESS}</code>.
          Everything below is already set up, so there is nothing for you to
          install. Two of them need something on your side: Dream Displays only
          works if you install its client mod, and SkinsRestorer wants you to
          upload a PNG on its website before you run the command it gives you.
        </p>
        <p className="pg-note">
          Commands are typed into the chat box with the leading slash, except
          the Statusbot and DiscordSRV ones, which are typed into Discord with a
          leading exclamation mark. Anything in angle brackets is an argument you
          replace.
        </p>
      </Section>

      {sortedPlugins.map((p) => (
        <Plugin key={p.id} plugin={p} />
      ))}
    </GuideLayout>
  );
}
