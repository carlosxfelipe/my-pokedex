#!/bin/bash
# scripts/build-apk.sh
# Gera o APK e renomeia com nome do app e versão

set -e

# Caminho do gradle e saída do APK
ANDROID_DIR="$(dirname "$0")/../android"
APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
OUTPUT_DIR="$(dirname "$0")/../apk-build"

# Executa build
cd "$ANDROID_DIR"
./gradlew assembleRelease
cd - > /dev/null

# Garante pasta de saída
mkdir -p "$OUTPUT_DIR"

# Lê nome e versão do package.json
PACKAGE_JSON="$(dirname "$0")/../package.json"
APP_NAME=$(jq -r .name "$PACKAGE_JSON")
APP_VERSION=$(jq -r .version "$PACKAGE_JSON")

# Nome final do APK
FINAL_APK="$OUTPUT_DIR/${APP_NAME}-${APP_VERSION}.apk"

# Copia e renomeia
cp "$APK_PATH" "$FINAL_APK"
echo "APK gerado em: $FINAL_APK"
