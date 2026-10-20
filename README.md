# Minecraft network setup

A React setup guide and scripts that connect a friend's computer to a private Minecraft server over Tailscale.

| Route | Page |
| --- | --- |
| `/` | Landing page with two buttons: Windows, and macOS / Linux |
| `/windows` | Windows guide. Tabs: launcher (.bat), PowerShell, install it yourself |
| `/macos-linux` | macOS and Linux guide. Tabs: script (.sh), install it yourself |

## Project layout

| Path | Purpose |
| --- | --- |
| `src/pages/` | The four pages (`Landing`, `WindowsPage`, `MacLinuxPage`, `NotFound`). |
| `src/components/` | Shared pieces: `Tabs`, `Console` (command box with Copy), `GuideLayout`, shared sections. |
| `src/data/problems.jsx` | The "Fix problems" tables, one list per platform. |
| `src/config.js` | Server address, Discord link, Tailscale download link. |
| `src/styles.css` | All styles. |
| `public/` | The three setup scripts. Files here are served from the site root, so the download links stay `/Join-MinecraftNetwork.bat` and so on. |
| `vercel.json` | Sends every other path to the app, and makes the script links download instead of opening as text. |
| `.gitattributes` | Keeps Windows line endings on `.bat`/`.ps1` and Unix endings on `.sh`. |

## Develop

```
npm install
npm run dev
```

`npm run build` writes the site to `dist/`. `npm run preview` serves that build locally.

## Auth key

The auth key is **not** stored in any file. Each person pastes the key when the script asks for it. The key is shared in the Discord server: https://discord.gg/8GeHTPErd7
Never commit a key. Share it privately, and use a tagged, ephemeral, short-expiry, limited-use key
whose tag can only reach the Minecraft server port in your Tailscale access rules.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New > Project** and import the repository.
3. Vercel detects **Vite**. Leave the build command (`npm run build`) and output directory (`dist`) as they are. Deploy.
4. Share the production URL. Updating a page or script is a normal commit; Vercel redeploys on push.

## Editing the server address

Change `100.86.40.47` and `28523` in `src/config.js`, and in all three scripts in `public/`.
The guide pages read the address from `src/config.js`.

---

Setup guide and scripts by Dekxisosta. Server hosting setup by KannaLife. Minecraft and its logo belong to Mojang Studios.
