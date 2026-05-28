import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const tempDir = path.join(__dirname, 'dist-temp');
const manualDir = path.join(distDir, 'manual');
const rootDir = path.resolve(__dirname, '..');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

function rmdirRecursiveSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        rmdirRecursiveSync(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

try {
  console.log('🏁 Iniciando proceso postbuild: Reorganizando dist...');

  // 1. Mover dist a un directorio temporal
  if (fs.existsSync(tempDir)) {
    rmdirRecursiveSync(tempDir);
  }
  
  if (fs.existsSync(distDir)) {
    fs.renameSync(distDir, tempDir);
  } else {
    console.error('❌ Error: El directorio dist no existe. Asegúrate de ejecutar vite build primero.');
    process.exit(1);
  }

  // 2. Crear un nuevo dist limpio
  fs.mkdirSync(distDir, { recursive: true });

  // 3. Mover el contenido temporal a dist/manual
  console.log('📁 Trasladando SPA de React a dist/manual...');
  copyFolderRecursiveSync(tempDir, manualDir);
  
  // 4. Limpiar temporal
  rmdirRecursiveSync(tempDir);
  console.log('🧹 Limpieza de directorio temporal completada.');

  // 5. Copiar landing page y assets desde la raíz a la raíz de dist/
  const filesToCopy = [
    'index.html',
    'forza_bg.png',
    'gallery_tokyo.png',
    'gallery_fuji.png',
    'gallery_okinawa.png',
    'favicon.svg',
    'icons.svg'
  ];

  console.log('✨ Copiando Landing Page y assets a la raíz de dist...');
  filesToCopy.forEach(file => {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`   ✅ Copiado: ${file}`);
    } else {
      console.log(`   ⚠️  No encontrado (se omite): ${file}`);
    }
  });

  console.log('🚀 Proceso postbuild finalizado con éxito. El build está listo para desplegarse.');
} catch (error) {
  console.error('❌ Error en el script postbuild:', error);
  process.exit(1);
}
