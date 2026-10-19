# Minecraft network setup

A setup guide (`index.html`) and scripts that connect a friend's computer to a private Minecraft server over Tailscale.

| File | Purpose |
| --- | --- |
| `index.html` | The setup guide. Its download buttons link to the scripts below. |
| `Join-MinecraftNetwork.bat` | Windows launcher. Needs the `.ps1` in the same folder. |
| `Join-MinecraftNetwork.ps1` | Windows setup script. |
| `join-minecraft-network.sh` | macOS and Linux setup script. |
| `.gitattributes` | Keeps Windows line endings on `.bat`/`.ps1` and Unix endings on `.sh`. |
| `vercel.json` | Makes the script links download instead of opening as text. |

## Auth key

The auth key is **not** stored in any file. Each person pastes the key when the script asks for it. The key is shared in the Discord server: https://discord.gg/8GeHTPErd7
Never commit a key. Share it privately, and use a tagged, ephemeral, short-expiry, limited-use key
whose tag can only reach the Minecraft server port in your Tailscale access rules.

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New > Project** and import the repository.
3. Leave the framework preset as **Other** and the build command empty. Deploy.
4. Share the production URL. Updating a script is a normal commit; Vercel redeploys on push.

## Editing the server address

Change `100.86.40.47` and `28523` in all three scripts, and in `index.html` (the address box and the manual checks).

---

Setup guide and scripts by Dekxisosta. Server hosting setup by KannaLife. Minecraft and its logo belong to Mojang Studios.
