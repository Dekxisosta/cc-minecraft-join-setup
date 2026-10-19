#!/usr/bin/env bash
# join-minecraft-network.sh (macOS and Linux)
# Run with:  bash join-minecraft-network.sh

MC_HOST="100.86.40.47"
MC_PORT=28523
FORCE_REAUTH=0

if [ -t 1 ]; then
  Y=$'\e[33m'; G=$'\e[32m'; R=$'\e[31m'; C=$'\e[36m'; D=$'\e[90m'; W=$'\e[97m'; N=$'\e[0m'
else
  Y=; G=; R=; C=; D=; W=; N=
fi
step_no=0; step_total=5
step() { step_no=$((step_no + 1)); printf '\n%s[%s/%s] %s%s\n' "$Y" "$step_no" "$step_total" "$1" "$N"; }
ok()   { printf '  %s[OK]%s %s\n' "$G" "$N" "$1"; }
info() { printf '  %s%s%s\n' "$D" "$1" "$N"; }
fail() { printf '\n  %s[ERROR]%s %s\n\n' "$R" "$N" "$1"; exit 1; }

case "$(uname -s)" in
  Darwin) PLATFORM=mac ;;
  Linux)  PLATFORM=linux ;;
  *) fail "This script supports macOS and Linux. On Windows, use Join-MinecraftNetwork.bat." ;;
esac

SUDO=""
[ "$(id -u)" -ne 0 ] && SUDO="sudo"
MAC_APP_CLI="/Applications/Tailscale.app/Contents/MacOS/Tailscale"

find_ts() {
  if command -v tailscale >/dev/null 2>&1; then command -v tailscale
  elif [ -x "$MAC_APP_CLI" ]; then echo "$MAC_APP_CLI"
  fi
}
ts() { $SUDO "$TS" "$@"; }
port_open() {
  if command -v nc >/dev/null 2>&1; then
    nc -z -w 3 "$MC_HOST" "$MC_PORT" >/dev/null 2>&1
  else
    (exec 3<>"/dev/tcp/$MC_HOST/$MC_PORT") >/dev/null 2>&1
  fi
}

printf '\n%s  ==========================================\n        MINECRAFT NETWORK SETUP\n  ==========================================%s\n' "$C" "$N"

# ---- 1. Check ----
step "Checking system"
if [ -n "$SUDO" ]; then
  command -v sudo >/dev/null 2>&1 || fail "sudo is needed. Run this script as root instead."
  info "You may be asked for your password."
  sudo -v || fail "Administrator access is needed."
fi
ok "Running on $PLATFORM with administrator access"

# ---- 2. Install ----
step "Installing Tailscale"
TS="$(find_ts)"
if [ -n "$TS" ]; then
  ok "Already installed, skipping"
elif [ "$PLATFORM" = linux ]; then
  command -v curl >/dev/null 2>&1 || fail "curl is needed to download the installer. Install curl, then run again."
  info "Running the official Tailscale installer..."
  curl -fsSL https://tailscale.com/install.sh | $SUDO sh || fail "The Tailscale installer failed."
  TS="$(find_ts)"
  [ -n "$TS" ] || fail "Tailscale was not found after installation."
  ok "Installed"
elif command -v brew >/dev/null 2>&1; then
  info "Installing with Homebrew..."
  brew install tailscale || fail "Homebrew could not install Tailscale."
  TS="$(find_ts)"
  [ -n "$TS" ] || fail "Tailscale was not found after installation."
  ok "Installed"
else
  fail "Install Tailscale from https://tailscale.com/download, open it once, then run this script again."
fi

# ---- 3. Service ----
step "Starting Tailscale service"
if [ "$PLATFORM" = linux ]; then
  $SUDO systemctl enable --now tailscaled >/dev/null 2>&1
elif [ "$TS" = "$MAC_APP_CLI" ]; then
  open -a Tailscale >/dev/null 2>&1
else
  $SUDO brew services start tailscale >/dev/null 2>&1
fi
running=0
for i in $(seq 1 30); do
  if ts status --json >/dev/null 2>&1; then running=1; break; fi
  printf '\r  Waiting for service... %ss ' "$i"
  sleep 1
done
printf '\r%-40s\r' ""
[ "$running" -eq 1 ] || fail "The Tailscale service did not start. Restart the computer and run again."
ok "Service running"

# ---- 4. Join ----
step "Joining private network"
NEED_JOIN=1
if ts status --json 2>/dev/null | grep -Eq '"BackendState": *"Running"'; then
  if port_open; then
    ok "Already connected to the Minecraft network, skipping"
    NEED_JOIN=0
  else
    printf "  %sThis computer is already on a Tailscale network, but the server can't be reached.%s\n" "$Y" "$N"
    info "It may be a different Tailscale account, or the server may be offline."
    read -r -p "  Switch to the Minecraft network? (y/N) " ans </dev/tty
    case "$ans" in
      [Yy]*) FORCE_REAUTH=1 ;;
      *) NEED_JOIN=0; info "No changes made." ;;
    esac
  fi
fi

if [ "$NEED_JOIN" -eq 1 ]; then
  printf '\n  %sPaste the Tailscale auth key from the Discord server, then press Enter.%s\n' "$W" "$N"
  info "Nothing shows as you paste. That is normal."
  AUTH_KEY=""
  for try in 1 2 3; do
    read -rsp "  Auth key: " key </dev/tty; echo
    key="$(printf '%s' "$key" | tr -d '[:space:]')"
    if [[ "$key" =~ ^tskey-[A-Za-z0-9_-]+$ ]]; then AUTH_KEY="$key"; break; fi
    [ "$try" -lt 3 ] && printf '  %sThat does not look like an auth key. It should start with tskey-%s\n' "$Y" "$N"
  done
  key=""
  [ -n "$AUTH_KEY" ] || fail "No valid auth key entered. Run the setup again and paste the key from the host."
  ok "Auth key entered"

  args=(up "--authkey=$AUTH_KEY" --reset)
  [ "$FORCE_REAUTH" -eq 1 ] && args+=(--force-reauth)
  info "Connecting..."
  if ! out="$(ts "${args[@]}" 2>&1)"; then
    AUTH_KEY=""
    fail "Tailscale failed to connect. $out"
  fi
  AUTH_KEY=""
fi

IP="$(ts ip -4 2>/dev/null | head -n 1)"
ok "Connected${IP:+ as $IP}"

# ---- 5. Test ----
step "Testing Minecraft server"
reachable=0
for i in 1 2 3 4 5; do
  info "Attempt $i of 5"
  if port_open; then reachable=1; break; fi
  sleep 2
done

ADDRESS="$MC_HOST:$MC_PORT"
copied=0
if   command -v pbcopy   >/dev/null 2>&1; then printf '%s' "$ADDRESS" | pbcopy && copied=1
elif command -v wl-copy  >/dev/null 2>&1; then printf '%s' "$ADDRESS" | wl-copy && copied=1
elif command -v xclip    >/dev/null 2>&1; then printf '%s' "$ADDRESS" | xclip -selection clipboard && copied=1
elif command -v xsel     >/dev/null 2>&1; then printf '%s' "$ADDRESS" | xsel --clipboard --input && copied=1
fi

printf '\n%s  ==========================================%s\n' "$C" "$N"
if [ "$reachable" -eq 1 ]; then
  printf '   %sREADY TO PLAY%s\n\n   Server address:\n     %s%s%s\n\n' "$G" "$N" "$G" "$ADDRESS" "$N"
  if [ "$copied" -eq 1 ]; then echo "   Copied to your clipboard. Just paste it."; else echo "   Copy the address above."; fi
  echo "   In Minecraft: Multiplayer > Add Server (or Direct"
  echo "   Connection) > paste into 'Server Address' > Done."
else
  printf '   %sCONNECTED, BUT SERVER NOT REACHABLE%s\n' "$Y" "$N"
  echo "   Check the server is online and your Tailscale access is allowed."
fi
printf '%s  ==========================================%s\n\n' "$C" "$N"
