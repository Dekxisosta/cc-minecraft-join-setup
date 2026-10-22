#Requires -Version 5.1
# Join-MinecraftNetwork.ps1

# ==========================================
# CONFIGURATION
# ==========================================

# The auth key is NOT stored in this file. Each person pastes the key they
# were given when the script asks for it.
$AuthKey        = $null
$ForceReauth    = $false   # $true kicks the user off any other tailnet they are on

$MinecraftHost  = "100.86.40.47"
$MinecraftPort  = 28523
$InstallerUrl   = "https://pkgs.tailscale.com/stable/tailscale-setup-latest.exe"
$InstallerPath  = Join-Path $env:TEMP "tailscale-setup.exe"
$LogPath        = Join-Path $env:TEMP "join-minecraft.log"

# ==========================================
# AUTO-ELEVATE
# ==========================================

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()
           ).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    if (-not $PSCommandPath) {
        Write-Host "Save this script as a .ps1 file and run it from disk." -ForegroundColor Red
        Read-Host "Press Enter to close"
        exit 1
    }

    Start-Process powershell.exe -Verb RunAs -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", "`"$PSCommandPath`""
    )
    exit
}

# ==========================================
# UI HELPERS
# ==========================================

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$Host.UI.RawUI.WindowTitle = "Cafe Camellia - Minecraft Network Setup"

$Full  = [string][char]0x2588
$Empty = [string][char]0x2591
$script:StepNo = 0
$StepTotal     = 5

function Show-Bar([int]$Percent, [string]$Text = "") {
    $width   = 30
    $Percent = [Math]::Max(0, [Math]::Min(100, $Percent))
    $filled  = [int]($width * $Percent / 100)
    $bar     = ($Full * $filled) + ($Empty * ($width - $filled))
    $line    = ("  {0} {1,3}%  {2}" -f $bar, $Percent, $Text).PadRight(78)
    Write-Host ("`r" + $line) -NoNewline -ForegroundColor Cyan
}

function Write-Step([string]$Message) {
    $script:StepNo++
    Write-Host ""
    Write-Host "[$($script:StepNo)/$StepTotal] $Message" -ForegroundColor Yellow
}

function Write-Ok([string]$Message)   { Write-Host "  [OK] $Message" -ForegroundColor Green }
function Write-Info([string]$Message) { Write-Host "  $Message" -ForegroundColor Gray }

function Get-FileWithBar([string]$Url, [string]$Path) {
    $req   = [Net.HttpWebRequest]::Create($Url)
    $resp  = $req.GetResponse()
    $total = $resp.ContentLength
    $in    = $resp.GetResponseStream()
    $out   = [IO.File]::Create($Path)
    try {
        $buf  = New-Object byte[] 65536
        $read = 0
        $last = 0
        $sw   = [Diagnostics.Stopwatch]::StartNew()
        while (($n = $in.Read($buf, 0, $buf.Length)) -gt 0) {
            $out.Write($buf, 0, $n)
            $read += $n
            if (($sw.ElapsedMilliseconds - $last) -ge 100) {
                $last = $sw.ElapsedMilliseconds
                $pct  = if ($total -gt 0) { [int](100 * $read / $total) } else { 0 }
                Show-Bar $pct ("{0:N1} / {1:N1} MB" -f ($read / 1MB), ($total / 1MB))
            }
        }
        Show-Bar 100 ("{0:N1} / {0:N1} MB" -f ($read / 1MB))
    }
    finally {
        $out.Dispose(); $in.Dispose(); $resp.Close()
    }
    Write-Host ""
}

function Wait-WithBar([System.Diagnostics.Process]$Process, [string]$Text, [int]$ExpectedSeconds, [int]$TimeoutSeconds) {
    $null = $Process.Handle   # cache the handle so ExitCode is not $null
    $sw = [Diagnostics.Stopwatch]::StartNew()
    while (-not $Process.HasExited) {
        if ($sw.Elapsed.TotalSeconds -gt $TimeoutSeconds) {
            try { $Process.Kill() } catch { Write-Verbose "Could not stop process: $($_.Exception.Message)" }
            throw "Timed out: $Text"
        }
        $pct = [Math]::Min(95, [int](95 * $sw.Elapsed.TotalSeconds / $ExpectedSeconds))
        Show-Bar $pct ("{0} ({1}s)" -f $Text, [int]$sw.Elapsed.TotalSeconds)
        Start-Sleep -Milliseconds 200
    }
    $Process.WaitForExit()   # makes sure ExitCode is final
    Show-Bar 100 $Text
    Write-Host ""
}

function Test-Port([string]$HostName, [int]$Port, [int]$TimeoutMs = 3000) {
    $client = New-Object Net.Sockets.TcpClient
    try {
        $ar = $client.BeginConnect($HostName, $Port, $null, $null)
        if ($ar.AsyncWaitHandle.WaitOne($TimeoutMs) -and $client.Connected) {
            $client.EndConnect($ar)
            return $true
        }
        return $false
    }
    catch { return $false }
    finally { $client.Close() }
}

function Read-AuthKey {
    Write-Host ""
    Write-Host "  Paste the Tailscale auth key from the Discord server, then press Enter." -ForegroundColor White
    Write-Host "  It shows as * characters. Right-click or Ctrl+V pastes it." -ForegroundColor Gray
    Write-Host ""

    for ($try = 1; $try -le 3; $try++) {
        $secure = Read-Host "  Auth key" -AsSecureString
        $bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
        try     { $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr).Trim() }
        finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr) }

        if ($plain -match '^tskey-[A-Za-z0-9_-]+$') { return $plain }

        if ($try -lt 3) {
            Write-Host "  That does not look like an auth key. It should start with tskey-" -ForegroundColor Yellow
        }
    }
    throw "No valid auth key entered. Run the setup again and paste the key from the host."
}

# ==========================================
# MAIN
# ==========================================

$exitCode = 0
Clear-Host
Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Cyan
Write-Host "    CAFE CAMELLIA MINECRAFT NETWORK SETUP"    -ForegroundColor White
Write-Host "  ==========================================" -ForegroundColor Cyan

try {
    # ---- 1. Check ----
    Write-Step "Checking system"
    Write-Ok "Running as Administrator"

    $cmd = Get-Command tailscale.exe -ErrorAction SilentlyContinue
    $TailscaleExe = if ($cmd) { $cmd.Source } else { Join-Path $env:ProgramFiles "Tailscale\tailscale.exe" }

    # ---- 2. Install ----
    Write-Step "Installing Tailscale"
    if (Test-Path $TailscaleExe) {
        Write-Ok "Already installed, skipping"
    }
    else {
        Write-Info "Downloading installer..."
        Get-FileWithBar $InstallerUrl $InstallerPath

        $sig = Get-AuthenticodeSignature -FilePath $InstallerPath
        if ($sig.Status -ne "Valid" -or $sig.SignerCertificate.Subject -notmatch "Tailscale") {
            throw "Installer signature invalid. Aborting."
        }
        Write-Ok "Signature verified"

        Write-Info "Installing..."
        $proc = Start-Process -FilePath $InstallerPath -ArgumentList "/quiet" -PassThru
        Wait-WithBar -Process $proc -Text "Installing" -ExpectedSeconds 30 -TimeoutSeconds 180
        if ($proc.ExitCode -ne 0) {
            throw "Installer failed with exit code $($proc.ExitCode)."
        }

        $TailscaleExe = Join-Path $env:ProgramFiles "Tailscale\tailscale.exe"
        if (-not (Test-Path $TailscaleExe)) {
            throw "Tailscale executable not found after installation."
        }
        Write-Ok "Installed"
    }

    # ---- 3. Service ----
    Write-Step "Starting Tailscale service"
    $svc = $null
    $maxTries = 30
    for ($i = 1; $i -le $maxTries; $i++) {
        $svc = Get-Service -Name Tailscale -ErrorAction SilentlyContinue
        if ($svc -and $svc.Status -eq "Running") { break }
        if ($svc -and $svc.Status -eq "Stopped") { Start-Service Tailscale -ErrorAction SilentlyContinue }
        Show-Bar ([int](100 * $i / $maxTries)) "Waiting for service"
        Start-Sleep -Seconds 1
    }
    if (-not $svc -or $svc.Status -ne "Running") {
        Write-Host ""
        throw "Tailscale service did not start."
    }
    Show-Bar 100 "Service running"
    Write-Host ""

    # ---- 4. Join ----
    Write-Step "Joining private network"
    $needJoin = $true
    $status   = $null
    try { $status = (& $TailscaleExe status --json 2>$null | Out-String | ConvertFrom-Json) } catch { Write-Verbose "Could not read Tailscale status: $($_.Exception.Message)" }

    if ($status -and $status.BackendState -eq "Running") {
        if (Test-Port $MinecraftHost $MinecraftPort) {
            Write-Ok "Already connected to the Minecraft network, skipping"
            $needJoin = $false
        }
        else {
            Write-Host "  This PC is already on a Tailscale network, but the server can't be reached." -ForegroundColor Yellow
            Write-Info "It may be a different Tailscale account, or the server may be offline."
            $answer = Read-Host "  Switch this PC to the Minecraft network? (Y/N)"
            if ($answer -match '^[Yy]') { $ForceReauth = $true }
            else { $needJoin = $false; Write-Info "No changes made." }
        }
    }

    if ($needJoin) {
        $AuthKey = Read-AuthKey
        Write-Ok "Auth key entered"

        $upArgs = @("up", "--authkey=$AuthKey", "--reset", "--unattended")
        if ($ForceReauth) { $upArgs += "--force-reauth" }

        $outFile = Join-Path $env:TEMP "ts-out.txt"
        $errFile = Join-Path $env:TEMP "ts-err.txt"
        $proc = Start-Process -FilePath $TailscaleExe -ArgumentList $upArgs -NoNewWindow -PassThru `
            -RedirectStandardOutput $outFile -RedirectStandardError $errFile
        Wait-WithBar -Process $proc -Text "Connecting" -ExpectedSeconds 15 -TimeoutSeconds 90

        # Trust the real Tailscale state, not just the exit code
        $state = $null
        try { $state = (& $TailscaleExe status --json 2>$null | Out-String | ConvertFrom-Json).BackendState } catch { Write-Verbose "Could not read Tailscale state: $($_.Exception.Message)" }
        if ($proc.ExitCode -ne 0 -and $state -ne "Running") {
            $detail = (Get-Content $errFile -Raw -ErrorAction SilentlyContinue)
            throw "Tailscale failed to connect (exit code $($proc.ExitCode), state $state). $detail"
        }
        Remove-Item $outFile, $errFile -Force -ErrorAction SilentlyContinue
    }

    $ip = (& $TailscaleExe ip -4 2>$null | Select-Object -First 1)
    Write-Ok "Connected$(if ($ip) { ' as ' + $ip })"

    # ---- 5. Test ----
    Write-Step "Testing Minecraft server"
    $reachable = $false
    $attempts  = 5
    for ($i = 1; $i -le $attempts; $i++) {
        Show-Bar ([int](100 * ($i - 1) / $attempts)) "Attempt $i of $attempts"
        if (Test-Port $MinecraftHost $MinecraftPort) { $reachable = $true; break }
        Start-Sleep -Seconds 2
    }
    Show-Bar 100 $(if ($reachable) { "Reachable" } else { "No response" })
    Write-Host ""

    $ServerAddress = "${MinecraftHost}:${MinecraftPort}"
    $copied = $false
    try { Set-Clipboard -Value $ServerAddress; $copied = $true } catch { Write-Verbose "Clipboard unavailable: $($_.Exception.Message)" }

    Write-Host ""
    Write-Host "  ==========================================" -ForegroundColor Cyan
    if ($reachable) {
        Write-Host "   READY TO PLAY"                         -ForegroundColor Green
        Write-Host ""
        Write-Host "   Server address:" -ForegroundColor Gray
        Write-Host "     $ServerAddress" -ForegroundColor Black -BackgroundColor Green
        Write-Host ""
        if ($copied) {
            Write-Host "   Copied to your clipboard. Just paste it (Ctrl+V)." -ForegroundColor White
        }
        else {
            Write-Host "   Copy the address above." -ForegroundColor White
        }
        Write-Host "   In Minecraft: Multiplayer > Add Server (or Direct" -ForegroundColor Gray
        Write-Host "   Connection) > paste into 'Server Address' > Done." -ForegroundColor Gray
    }
    else {
        Write-Host "   CONNECTED, BUT SERVER NOT REACHABLE"   -ForegroundColor Yellow
        Write-Host "   Check the server is online and your Tailscale access is allowed." -ForegroundColor Gray
    }
    Write-Host "  ==========================================" -ForegroundColor Cyan
}
catch {
    Write-Host ""
    Write-Host ""
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Log: $LogPath" -ForegroundColor DarkGray
    try { Add-Content -Path $LogPath -Value ("{0}  {1}`n{2}" -f (Get-Date), $_.Exception.Message, $_.ScriptStackTrace) } catch { Write-Verbose "Could not write log: $($_.Exception.Message)" }
    $exitCode = 1
}
finally {
    $AuthKey = $null
    Remove-Item $InstallerPath -Force -ErrorAction SilentlyContinue
    Write-Host ""
    Read-Host "  Press Enter to close"
}

exit $exitCode