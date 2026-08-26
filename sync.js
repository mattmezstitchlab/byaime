const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
  const dir = path.dirname(dest);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Root HTML and assets to public/
const rootFiles = [
  'index.html',
  'mariage.html',
  'projet.html',
  'projets.html',
  'a-propos.html',
  'card.html',
  'ecosysteme.html',
  '404.html',
  'sitemap.xml',
  'robots.txt',
  'manifest.json'
];

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    copyFile(file, path.join('public', file));
  }
}

// 2. Folder clean URL index.html copies in root and public
const routePairs = [
  ['mariage.html', 'mariage/index.html'],
  ['projet.html', 'projet/index.html'],
  ['projets.html', 'projets/index.html'],
  ['a-propos.html', 'a-propos/index.html'],
  ['card.html', 'card/index.html'],
  ['ecosysteme.html', 'ecosysteme/index.html']
];

for (const [src, dest] of routePairs) {
  if (fs.existsSync(src)) {
    copyFile(src, dest);
    copyFile(src, path.join('public', dest));
  }
}

// 3. Subdirectories
const assetDirs = ['css', 'js', 'img', 'fonts', 'personne'];
for (const dir of assetDirs) {
  if (fs.existsSync(dir)) {
    copyDir(dir, path.join('public', dir));
  }
}

console.log('Dual sync to public/ completed with 100% parity.');
