$ErrorActionPreference = "Stop"

# Run this script from any location. It resolves the app folder by script path.
$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $appDir

Write-Host "[1/5] Installing dependencies..."
npm install

if (-not (Test-Path ".env")) {
  Write-Host "[2/5] Creating .env from known dev values..."
  @'
DATABASE_URL="file:./prisma/dev.db"
SESSION_SECRET="dev-change-me-secret"
'@ | Set-Content -Encoding UTF8 ".env"
} else {
  Write-Host "[2/5] .env already exists. Keeping existing file."
}

Write-Host "[3/5] Running Prisma migration..."
npx prisma migrate dev

Write-Host "[4/5] Starting app server..."
Write-Host "Open http://localhost:3000 after server starts."

Write-Host "[5/5] Running npm start"
npm start
