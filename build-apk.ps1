# Script para Build do APK - Projeto Midas
# Uso: .\build-apk.ps1 -release (para APK de produção)
# Uso: .\build-apk.ps1 -debug (para APK de teste)

param(
    [switch]$release = $false,
    [switch]$debug = $false
)

# Cores para output
$successColor = "Green"
$warningColor = "Yellow"
$errorColor = "Red"
$infoColor = "Cyan"

Write-Host "----------------------------------------" -ForegroundColor $infoColor
Write-Host "  Projeto Midas - Build APK Script" -ForegroundColor $infoColor
Write-Host "----------------------------------------" -ForegroundColor $infoColor

# Verificar se Java está instalado
Write-Host "`nVerificando pre-requisitos..." -ForegroundColor $infoColor
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERRO: Java não está instalado ou não está no PATH" -ForegroundColor $errorColor
    Write-Host "   Siga as instruções em APK_BUILD_GUIDE.md" -ForegroundColor $warningColor
    exit 1
}

$javaVersion = java -version 2>&1 | Select-String "version" | Select-Object -First 1
Write-Host "Java encontrado: $javaVersion" -ForegroundColor $successColor

# Verificar se estamos no diretório correto
if (-not (Test-Path "android/build.gradle")) {
    Write-Host "❌ ERRO: Diretório incorreto. Execute do raiz do projeto." -ForegroundColor $errorColor
    exit 1
}

# Build da web app
Write-Host "`nStep 1/3: Build web app..." -ForegroundColor $infoColor
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build web" -ForegroundColor $errorColor
    exit 1
}
Write-Host "Web build completo" -ForegroundColor $successColor

# Sync com Android
Write-Host "`nStep 2/3: Sincronizar com Android..." -ForegroundColor $infoColor
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao sincronizar" -ForegroundColor $errorColor
    exit 1
}
Write-Host "Sincronizacao completa" -ForegroundColor $successColor

# Build do Android
Write-Host "`nStep 3/3: Build Android APK..." -ForegroundColor $infoColor
cd android

if ($release) {
    Write-Host "   Gerando APK de RELEASE (producao)..." -ForegroundColor $warningColor
    .\gradlew.bat assembleRelease
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
} else {
    Write-Host "   Gerando APK de DEBUG (teste)..." -ForegroundColor $infoColor
    .\gradlew.bat assembleDebug
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do Android" -ForegroundColor $errorColor
    exit 1
}

cd ..

# Verificar se APK foi criado
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "`n----------------------------------------" -ForegroundColor $successColor
    Write-Host "  APK GERADO COM SUCESSO!" -ForegroundColor $successColor
    Write-Host "----------------------------------------" -ForegroundColor $successColor
    Write-Host "Localizacao: $apkPath" -ForegroundColor $successColor
    Write-Host "Tamanho: $([Math]::Round($apkSize, 2)) MB" -ForegroundColor $successColor
    
    if ($release) {
        Write-Host "`nProximos passos:" -ForegroundColor $infoColor
        Write-Host "   1. Instale em dispositivo: adb install -r $apkPath" -ForegroundColor $infoColor
        Write-Host "   2. Ou publique na Google Play Store" -ForegroundColor $infoColor
    } else {
        Write-Host "`nPara instalar em dispositivo conectado:" -ForegroundColor $infoColor
        Write-Host "   adb install -r $apkPath" -ForegroundColor $infoColor
    }
} else {
    Write-Host "❌ APK não foi encontrado. Verifique o build log acima." -ForegroundColor $errorColor
    exit 1
}

Write-Host "`nBuild completo!" -ForegroundColor $successColor
