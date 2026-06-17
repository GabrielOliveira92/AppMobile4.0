param(
  [string]$ServerUrl = 'http://localhost:3000',
  [string]$Text = 'Teste de tradução',
  [string]$ImageUrl = ''
)

Write-Host "Testing Google Translate proxy"
$tUrl = "$ServerUrl/api/google/translate"
$tBody = @{ text = $Text; target = 'en' } | ConvertTo-Json
try {
  $tResp = Invoke-RestMethod -Uri $tUrl -Method Post -Body $tBody -ContentType 'application/json'
  Write-Host "Translated: $($tResp.translatedText)"
} catch {
  Write-Host "Translate call failed: $($_.Exception.Message)" -ForegroundColor Red
}

if ($ImageUrl) {
  Write-Host "Testing Google Vision proxy"
  $vUrl = "$ServerUrl/api/google/vision"
  $vBody = @{ imageUrl = $ImageUrl } | ConvertTo-Json
  try {
    $vResp = Invoke-RestMethod -Uri $vUrl -Method Post -Body $vBody -ContentType 'application/json'
    Write-Host "Vision responses:`n"; $vResp.responses | ConvertTo-Json -Depth 5
  } catch {
    Write-Host "Vision call failed: $($_.Exception.Message)" -ForegroundColor Red
  }
}
