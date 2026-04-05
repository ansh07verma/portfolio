---
description: Start portfolio dev session — opens Brave, watches files, live-reload + auto-pushes on save
---

# Portfolio Dev Session Workflow

Use this workflow at the start of any portfolio editing session.

## What it does
- Starts a **browser-sync live-reload server** at `http://localhost:3000`
- Opens **Brave Browser** automatically at that URL
- Watches `index.html`, `style.css`, `script.js` for changes
- On every file save → **Brave auto-refreshes** (no manual reload needed)
- After 2 seconds of no further saves → **auto git commit + push** to GitHub

## Prerequisites
- Node.js / npm installed (for `npx browser-sync`)
- Git remote already configured (`origin` → GitHub)
- Brave installed at: `$env:USERPROFILE\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe`

## Steps

### 1. Start the full dev session (live-reload + auto-push)
Run the watcher script:

```powershell
pwsh -ExecutionPolicy Bypass -File "c:\portfolio_website\watch-and-push.ps1"
```

This single command handles everything — server, Brave, watching, and pushing.

### 2. Make edits
Save any file and:
- Brave **instantly refreshes** the page (live reload via browser-sync)
- After 2 seconds of quiet, changes are **auto-committed and pushed** to GitHub

### 3. Stop the session
Press **Ctrl+C** in the watcher terminal. The server is shut down cleanly.

---

## Browser Rule
**ALWAYS use Brave, never Chrome.**

Brave executable path on this system:
```
$env:USERPROFILE\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe
```

When opening any URL in automation, use:
```powershell
Start-Process "$env:USERPROFILE\AppData\Local\BraveSoftware\Brave-Browser\Application\brave.exe" "<URL>"
```
