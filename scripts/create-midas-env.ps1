param(
  [Parameter(Mandatory=$true)][string]$MidasApiUrl,
  [Parameter(Mandatory=$false)][string]$MidasApiKey
)

# This script creates a local .env file with MIDAS configuration.
# Usage: .\scripts\create-midas-env.ps1 -MidasApiUrl https://api... -MidasApiKey "KEY"

$envFile = Join-Path -Path (Get-Location) -ChildPath ".env"

Write-Host "Creating .env at $envFile"

$content = @()
$content += "MIDAS_API_URL=$MidasApiUrl"
if ($MidasApiKey) { $content += "MIDAS_API_KEY=$MidasApiKey" }

Set-Content -Path $envFile -Value $content -Encoding UTF8

Write-Host ".env created. Restart your Node server to pick up the new vars." -ForegroundColor Green
