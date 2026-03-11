const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ICON_SOURCE = path.resolve(__dirname, "../assets/icon_source.svg");
const ADAPTIVE_ICON_SOURCE = path.resolve(
  __dirname,
  "../assets/adaptive-icon-source.svg",
);
const ASSETS_DIR = path.resolve(__dirname, "../assets");

async function generateAssets() {
  if (!fs.existsSync(ICON_SOURCE)) {
    console.error("❌ icon_source.svg not found in assets folder!");
    process.exit(1);
  }

  console.log("🔄 Generating assets from icon_source.svg...");

  try {
    // 1. App Icon (1024x1024)
    console.log("   Generating icon.png...");
    await sharp(ICON_SOURCE)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(ASSETS_DIR, "icon.png"));

    // 2. Adaptive App Icon (1024x1024)
    console.log("   Generating adaptive-icon.png...");
    await sharp(ADAPTIVE_ICON_SOURCE)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(ASSETS_DIR, "adaptive-icon.png"));

    // 3. Splash Screen (1024x1024)
    // Could alternatively just copy the icon.png if it's the exact same shape
    console.log("   Generating splash-icon.png...");
    await sharp(ICON_SOURCE)
      .resize(1024, 1024)
      .png()
      .toFile(path.join(ASSETS_DIR, "splash-icon.png"));

    // 4. Favicon (48x48)
    console.log("   Generating favicon.png...");
    await sharp(ICON_SOURCE)
      .resize(48, 48)
      .png()
      .toFile(path.join(ASSETS_DIR, "favicon.png"));

    console.log('✅ Assets generated successfully in the "assets/" folder!');
    console.log(
      '📝 Reminder: Since you have the "android" and "ios" folders generated (Ejected / Prebuild workflow), to actually update these native icons in your app builds, you will need to run:',
    );
    console.log("   npx expo prebuild --clean");
  } catch (error) {
    console.error("❌ Error generating assets:", error);
  }
}

// IMPORTANTE:
// Pelo fato do projeto estar ejetado com as pastas "android" e "ios",
// após rodar a geração dessas imagens puras na pasta assets, você deve
// obrigatoriamente forçar o Expo a processá-las nas pastas nativas rodando o comando:
// npx expo prebuild --clean

generateAssets();
