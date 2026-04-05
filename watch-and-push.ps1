# =====================================================================
# Portfolio Dev Session — Live Reload + Auto Git Push
#
#  - Starts browser-sync (live reload HTTP server on port 3000)
#  - Opens Brave automatically at http://localhost:3000
#  - Watches index.html, style.css, script.js
#  - On any save: debounced git add + commit + push to GitHub
# =====================================================================

$REPO_PATH   = "c:\portfolio_website"
$BRAVE_EXE   = "$env:USERPROFILE\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe"
$PORT        = 3000
$PREVIEW_URL = "http://localhost:$PORT"
$WATCH_FILES = @("index.html", "style.css", "script.js")
$DEBOUNCE_MS = 2000

# ── Banner ────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Portfolio Dev Session  —  Live + AutoPush  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "  Repo    : $REPO_PATH" -ForegroundColor Gray
Write-Host "  Remote  : $(git -C $REPO_PATH remote get-url origin 2>$null)" -ForegroundColor Gray
Write-Host "  Server  : $PREVIEW_URL  (live-reload)" -ForegroundColor Gray
Write-Host "  Watching: $($WATCH_FILES -join ', ')" -ForegroundColor Gray
Write-Host ""

# ── 1. Start browser-sync in background ──────────────────────────────
Write-Host "[SERVER] Starting browser-sync live-reload server..." -ForegroundColor Yellow

$bsArgs = "browser-sync start " +
          "--server `"$REPO_PATH`" " +
          "--port $PORT " +
          "--files `"$REPO_PATH\*.html,$REPO_PATH\*.css,$REPO_PATH\*.js`" " +
          "--no-notify " +
          "--no-open"   # We'll open Brave ourselves

$bsJob = Start-Job -ScriptBlock {
    param($args_str, $repo)
    Set-Location $repo
    Invoke-Expression "npx -y $args_str"
} -ArgumentList $bsArgs, $REPO_PATH

# Wait for server to be ready (poll until port responds)
Write-Host "[SERVER] Waiting for server to be ready..." -ForegroundColor DarkYellow
$maxWait = 30  # seconds
$waited  = 0
$ready   = $false
while ($waited -lt $maxWait) {
    Start-Sleep -Seconds 1
    $waited++
    try {
        $resp = Invoke-WebRequest -Uri $PREVIEW_URL -TimeoutSec 1 -ErrorAction Stop
        $ready = $true
        break
    } catch { }
}

if ($ready) {
    Write-Host "[SERVER] ✓ Live-reload server ready at $PREVIEW_URL" -ForegroundColor Green
} else {
    Write-Host "[SERVER] ✗ Server didn't respond in ${maxWait}s — check for port conflicts." -ForegroundColor Red
}

# ── 2. Open Brave ─────────────────────────────────────────────────────
if (Test-Path $BRAVE_EXE) {
    Write-Host "[BRAVE]  Opening $PREVIEW_URL in Brave..." -ForegroundColor Yellow
    Start-Process $BRAVE_EXE $PREVIEW_URL
} else {
    Write-Host "[BRAVE]  Brave not found at: $BRAVE_EXE" -ForegroundColor Red
    Write-Host "[BRAVE]  Please open $PREVIEW_URL manually." -ForegroundColor DarkYellow
}

# ── 3. Init file snapshots ────────────────────────────────────────────
$snapshots = @{}
foreach ($f in $WATCH_FILES) {
    $full = Join-Path $REPO_PATH $f
    if (Test-Path $full) { $snapshots[$f] = (Get-Item $full).LastWriteTimeUtc }
}

$pendingPush  = $false
$lastChangeAt = $null

# ── Git push function ─────────────────────────────────────────────────
function Invoke-GitPush {
    Write-Host ""
    Write-Host "[GIT] Staging & pushing to GitHub..." -ForegroundColor Green
    Push-Location $REPO_PATH
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git add -A 2>&1 | Out-Null
    $diff = git status --short
    if ($diff) {
        Write-Host "[GIT] Changes:" -ForegroundColor DarkGray
        $diff | ForEach-Object { Write-Host "      $_" -ForegroundColor DarkGray }
        git commit -m "auto: portfolio update @ $ts" 2>&1 | Out-Null
        $push = git push origin HEAD 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[GIT] ✓ Pushed successfully @ $ts" -ForegroundColor Green
        } else {
            Write-Host "[GIT] ✗ Push failed: $push" -ForegroundColor Red
        }
    } else {
        Write-Host "[GIT] Nothing new to commit." -ForegroundColor DarkYellow
    }
    Pop-Location
    $script:pendingPush  = $false
    $script:lastChangeAt = $null
}

# ── 4. Watch loop ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "[WATCH] Watching for changes. Press Ctrl+C to stop..." -ForegroundColor Cyan
Write-Host ""

try {
    while ($true) {
        foreach ($f in $WATCH_FILES) {
            $full = Join-Path $REPO_PATH $f
            if (Test-Path $full) {
                $cur = (Get-Item $full).LastWriteTimeUtc
                if ($snapshots[$f] -ne $cur) {
                    Write-Host "[SAVE]  $f modified — queuing push..." -ForegroundColor Magenta
                    $snapshots[$f]    = $cur
                    $pendingPush      = $true
                    $lastChangeAt     = [DateTime]::UtcNow
                }
            }
        }

        if ($pendingPush -and $lastChangeAt) {
            $elapsed = ([DateTime]::UtcNow - $lastChangeAt).TotalMilliseconds
            if ($elapsed -ge $DEBOUNCE_MS) { Invoke-GitPush }
        }

        Start-Sleep -Milliseconds 500
    }
} finally {
    # ── Cleanup: stop browser-sync job on Ctrl+C ──────────────────────
    Write-Host "`n[SERVER] Stopping browser-sync..." -ForegroundColor Yellow
    Stop-Job  $bsJob -ErrorAction SilentlyContinue
    Remove-Job $bsJob -ErrorAction SilentlyContinue
    Write-Host "[SERVER] Done. Goodbye!" -ForegroundColor Cyan
}
