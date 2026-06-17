param(
  [string]$ServerUrl = 'http://localhost:3000',
  [string]$Message = 'Teste: qual a melhor prática para MEI?'
)

# Sends a POST to the local server /api/midas/chat and prints the reply.

$url = "$ServerUrl/api/midas/chat"

Write-Host "POSTing to $url"

$body = @{ message = $Message } | ConvertTo-Json

try {
  $resp = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType 'application/json'
  Write-Host "Resposta do MIDAS:"
  Write-Host $resp.reply
} catch {
  Write-Host "Erro ao contatar $url" -ForegroundColor Red
  Write-Host $_.Exception.Message
}
