# Home PC one-click runbook

This repository is used across laptop and desktop.

## What to ask Cursor Agent at home

Paste this message to Cursor Agent on your home PC:

```text
Open C:\dev\010-cursor-ai-practice.
Go to 11_my-awesome-memoapp and run run-home.ps1 in PowerShell.
If script policy blocks execution, run: Set-ExecutionPolicy -Scope Process Bypass
Then execute: .\run-home.ps1
When server starts, verify app is reachable on http://localhost:3000.
```

## Manual fallback (if you do it yourself)

```powershell
cd C:\dev
git clone https://github.com/ehdcjf2142-kr/010-cursor-ai-practice.git
cd .\010-cursor-ai-practice\11_my-awesome-memoapp
Set-ExecutionPolicy -Scope Process Bypass
.\run-home.ps1
```

## Update flow between devices

```powershell
# Before starting work on a device
git pull

# After finishing work
git add .
git commit -m "your message"
git push
```
