const { execSync } = require("child_process");

const DEVICE = "emulator-5554";
const PACKAGE = "com.mypokedex";
const SQLITE_PATH = "files/SQLite/pokedex_v3.db";
const OUTPUT_FILE = "pokedex_v3.db";

function run(command) {
  try {
    console.log(`▶ ${command}`);
    execSync(command, { stdio: "inherit", shell: true });
  } catch (err) {
    console.error("❌ Erro ao executar comando");
    process.exit(1);
  }
}

// 1. Validar arquivos
run(`adb -s ${DEVICE} shell run-as ${PACKAGE} ls files/SQLite`);

// 2. Copiar SQLite (e WAL/SHM se existirem)
const files = [
  { path: SQLITE_PATH, output: OUTPUT_FILE },
  { path: `${SQLITE_PATH}-wal`, output: `${OUTPUT_FILE}-wal` },
  { path: `${SQLITE_PATH}-shm`, output: `${OUTPUT_FILE}-shm` },
];

for (const f of files) {
  try {
    run(`adb -s ${DEVICE} shell run-as ${PACKAGE} cat ${f.path} > ${f.output}`);
  } catch (err) {
    console.log(`ℹ️ Arquivo ${f.path} não encontrado ou opcional.`);
  }
}

console.log(`✅ ${OUTPUT_FILE} (e auxiliares) copiados com sucesso`);
