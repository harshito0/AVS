import fs from 'fs';
import path from 'path';

for (const p of ['src/GalleryPage.jsx', 'src/ServicesPage.jsx']) {
  const filePath = path.resolve(p);
  let content = fs.readFileSync(filePath, 'utf8');

  // If an img tag has loading="lazy" twice, remove one
  content = content.replace(/(<img\s+loading="lazy"\s+decoding="async"[^>]*?)\s+loading="lazy"/g, '$1');
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Cleaned duplicate loading attributes.');
