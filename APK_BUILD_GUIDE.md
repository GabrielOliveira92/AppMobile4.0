# 📱 Guia Completo: Gerar APK do Projeto Midas

## ✅ Status Atual

Seu projeto está **pronto para gerar o APK**! A estrutura do Capacitor já foi criada com:

- ✅ Capacitor CLI instalado
- ✅ Plataforma Android adicionada  
- ✅ Web assets sincronizados
- ✅ Configurações otimizadas para mobile

**Próximo passo:** Configurar o ambiente Java/Android SDK e gerar o APK.

---

## 🔧 Pré-requisitos Obrigatórios

### 1. Java Development Kit (JDK) 11+

**Opção A: Usar Android Studio (Recomendado)**
- Download: https://developer.android.com/studio
- Android Studio instala JDK automaticamente
- Mais fácil para iniciantes

**Opção B: Instalar JDK Separadamente**
- Download OpenJDK 11+: https://jdk.java.net/21/
- Ou: https://adoptium.net/ (Eclipse Adoptium)
- Instalar e configurar JAVA_HOME no Windows

### 2. Android SDK (incluído no Android Studio)

Se usar Android Studio:
- Você ganha: SDK, Build Tools, Emulador Android
- Tudo gerenciado automaticamente

---

## 🚀 Como Gerar o APK

### Método 1: Usar Android Studio (RECOMENDADO)

**Passo 1:** Abrir Android Studio
```
Android Studio → Open → C:\Users\andre\Downloads\AppMobile3.0\android
```

**Passo 2:** Aguardar sincronização do Gradle
- Gradle fará download de dependências automaticamente
- Pode levar 5-10 minutos na primeira vez

**Passo 3:** Build → Build Bundle(s) / APK(s) → Build APK(s)
- Menu superior: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- Android Studio gerará: `android/app/build/outputs/apk/release/app-release.apk`

**Passo 4:** O APK estará pronto em:
```
C:\Users\andre\Downloads\AppMobile3.0\android\app\build\outputs\apk\release\app-release.apk
```

---

### Método 2: Linha de Comando (após instalar JDK)

**Passo 1:** Configurar JAVA_HOME
```powershell
# Adicionar ao seu caminho (em variáveis de ambiente do Windows)
# Ou execute em PowerShell:
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"  # Ajuste conforme sua versão
```

**Passo 2:** Executar build de debug (teste rápido)
```bash
cd "c:\Users\andre\Downloads\AppMobile3.0\android"
.\gradlew.bat assembleDebug
```

**Passo 3:** Executar build de release (APK para produção)
```bash
cd "c:\Users\andre\Downloads\AppMobile3.0\android"
.\gradlew.bat assembleRelease
```

**Passo 4:** Encontrar o APK
```
Debug:   android\app\build\outputs\apk\debug\app-debug.apk
Release: android\app\build\outputs\apk\release\app-release.apk
```

---

## 📋 Configuração de Assinatura (Release APK)

Para criar um APK de produção (release), você precisa assiná-lo com uma chave privada.

### Gerar Chave de Assinatura

```bash
cd "c:\Users\andre\Downloads\AppMobile3.0"

# Windows (PowerShell ou CMD)
keytool -genkey -v -keystore midas.jks -keyalg RSA -keysize 2048 -validity 10000 -alias midas

# Preencher com seus dados:
# Keystore password: [criar senha forte]
# First/Last Name: Seu Nome
# Organization: Midas Finance
# City: [sua cidade]
# State: [seu estado]
# Country Code: BR
```

### Configurar Assinatura no Gradle

**Arquivo:** `android/app/build.gradle`

Adicione antes de `buildTypes`:

```gradle
signingConfigs {
    release {
        storeFile file('../midas.jks')
        storePassword 'SUA_SENHA_AQUI'
        keyAlias 'midas'
        keyPassword 'SUA_SENHA_AQUI'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

---

## 📦 Instalar APK em Dispositivo Android

### Pré-requisitos
- Android device (telefone/tablet)
- USB cable
- "Developer Mode" ativado no dispositivo
- ADB (Android Debug Bridge) - incluído no Android Studio

### Instalação

```bash
# 1. Conectar dispositivo e ativar Debug Mode
# 2. Executar:
cd "c:\Users\andre\Downloads\AppMobile3.0"

adb install android\app\build\outputs\apk\release\app-release.apk
```

Ou para usuários Android Studio:
```
Menu: Run → Select Device → Run (ou pressionar Shift+F10)
```

---

## 🎯 Próximos Passos

1. **Instale Android Studio**: https://developer.android.com/studio
2. **Abra o projeto Android**:
   - File → Open → `C:\Users\andre\Downloads\AppMobile3.0\android`
3. **Aguarde Gradle sincronizar** (pode levar alguns minutos)
4. **Gere o APK**: Build → Build APK(s)
5. **Teste em seu dispositivo**: Run → Select Device

---

## 🐛 Troubleshooting

### Erro: "JAVA_HOME is not set"
- Instale JDK: https://adoptium.net/
- Configure JAVA_HOME nas variáveis de ambiente do Windows

### Erro: "Failed to apply plugin"
- Execute: `.\gradlew.bat clean`
- Depois tente novamente o build

### Erro: "SDK Platform not installed"
- Abra Android Studio
- Tools → SDK Manager → Instale a API level do seu dispositivo

### App não conecta com API Azure
- Verificar `.env` está configurado corretamente
- Arquivo `capacitor.config.json` já permite HTTPS

---

## 📱 Specs da Build Atual

- **App Name:** Projeto Midas
- **Package ID:** com.midas.finance
- **Min SDK:** Android 5.0 (API 21)
- **Target SDK:** Android 14 (API 34)
- **Web Assets:** `dist/` (otimizado para produção)
- **Backend:** Azure API (https://danielhernanrpgapi.azurewebsites.net)

---

## ✨ Dicas Importantes

1. **Sempre buildar para Release** antes de distribuir
   - Debug APK é muito maior e mais lento
   
2. **Testar em múltiplos dispositivos** antes de publicar
   - Diferentes versões Android podem ter comportamentos diferentes

3. **Publicar na Google Play Store** (opcional)
   - Após gerar APK assinado, você pode submeter à Play Store
   - Requer conta Google Play Developer ($25 uma vez)

4. **Monitorar performance**
   - Bundle JavaScript está em 1MB+ (considerado grande)
   - Próximo passo: implementar code-splitting se necessário

---

## 📞 Suporte

Para dúvidas sobre Capacitor: https://capacitorjs.com/docs/
Para dúvidas sobre Android: https://developer.android.com/docs
