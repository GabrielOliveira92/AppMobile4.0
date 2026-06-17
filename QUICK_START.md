# 🚀 Instalação Rápida: Java + Gerar APK

## 5 Minutos para Ter o APK Pronto

### Passo 1: Instalar Android Studio (10 min)

1. Acesse: https://developer.android.com/studio
2. Clique em "Download Android Studio"
3. Execute o instalador (next → next → install)
4. Na primeira execução, Android Studio configurará tudo automaticamente

**Alternativa (sem UI):** Instalar apenas JDK
- https://adoptium.net/
- Download Eclipse Adoptium JDK 21 LTS
- Instalar e pronto

### Passo 2: Abrir Projeto no Android Studio

```
Arquivo → Abrir → C:\Users\andre\Downloads\AppMobile3.0\android
```

Aguarde a sincronização do Gradle (pode levar 5 minutos na primeira vez)

### Passo 3: Gerar APK

**Via UI do Android Studio:**
```
Meu → Build → Build Bundle(s) / APK(s) → Build APK(s)
```

**Ou via terminal (após JDK instalado):**
```powershell
cd C:\Users\andre\Downloads\AppMobile3.0

# Para Debug (teste rápido):
.\build-apk.ps1

# Para Release (produção):
.\build-apk.ps1 -release
```

### Passo 4: Encontrar o APK

```
Teste (Debug):  android/app/build/outputs/apk/debug/app-debug.apk
Produção (Release): android/app/build/outputs/apk/release/app-release.apk
```

---

## 📁 Estrutura do Projeto Mobile

```
c:\Users\andre\Downloads\AppMobile3.0\
├── android/                          # Projeto Android nativo
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── assets/
│   │   │   │   │   └── public/       # Arquivos da web (dist/)
│   │   │   │   ├── java/
│   │   │   │   │   └── com/midas/finance/
│   │   │   │   │       └── MainActivity.java
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── ...
│   │   ├── build.gradle              # Configurações do build
│   │   └── ...
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradlew.bat                   # Gradle wrapper (não precisa Java global)
├── dist/                             # Web app compilado
├── capacitor.config.json             # Config do Capacitor
├── APK_BUILD_GUIDE.md                # Guia completo (você está lendo!)
└── build-apk.ps1                     # Script automatizado
```

---

## ✨ O Que Já Foi Feito

✅ React app otimizado para mobile
✅ Capacitor CLI instalado
✅ Projeto Android criado
✅ Web assets sincronizados
✅ Configurações mobile prontas
✅ Script de build automatizado

---

## 🎯 Usando o Script Automatizado

Uma vez com Java instalado, basta:

```powershell
# 1. Entrar no diretório
cd C:\Users\andre\Downloads\AppMobile3.0

# 2. Executar o build (gera APK de debug para teste rápido)
.\build-apk.ps1

# 3. Ou para release (produção)
.\build-apk.ps1 -release
```

O script vai:
- ✅ Fazer build web
- ✅ Sincronizar com Android
- ✅ Compilar APK
- ✅ Mostrar a localização do arquivo

---

## 📱 Instalar no Telefone

### Via USB (Recomendado)

```powershell
# 1. Conecte o telefone via USB
# 2. Ative "Developer Mode" nas configurações
# 3. Execute:

adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### Distribuir/Compartilhar

1. Copie o arquivo `app-release.apk`
2. Envie para alguém ou coloque em um servidor
3. Instale em qualquer Android (permitir "fontes desconhecidas")

---

## 🔐 Assinatura para Play Store

Se quiser publicar na Google Play Store:

```powershell
# 1. Gerar chave de assinatura
cd C:\Users\andre\Downloads\AppMobile3.0
keytool -genkey -v -keystore midas.jks -keyalg RSA -keysize 2048 -validity 10000 -alias midas

# 2. Configurar no android/app/build.gradle (ver APK_BUILD_GUIDE.md)
# 3. Gerar APK assinado
.\build-apk.ps1 -release

# 4. Submeter à Play Store (console.play.google.com)
```

---

## 🆘 Problemas?

- **"Gradle not found"** → Instale Android Studio
- **"Java not found"** → Instale JDK 11+ (Adoptium)
- **"Sync failed"** → Delete `android/.gradle` e tente novamente
- **"APK não gerado"** → Verifique o log e veja APK_BUILD_GUIDE.md

---

## 📞 Próximos Passos Após APK Pronto

1. **Testar em múltiplos dispositivos** (diferentes Android versions)
2. **Publicar na Google Play Store** (opcional)
3. **Monitorar analytics** (via Firebase)
4. **Updates periódicos** (novo build → sync → rebuild)

---

**Tudo pronto para empacotar! 🎉**

Instale Java → execute o script → seu APK estará pronto em minutos!
