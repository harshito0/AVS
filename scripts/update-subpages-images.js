import fs from 'fs';
import path from 'path';

const pages = [
  'src/GalleryPage.jsx',
  'src/ServicesPage.jsx',
  'src/AboutPage.jsx',
  'src/SalonPage.jsx',
  'src/RMTPage.jsx',
  'src/PackagesPage.jsx'
];

for (const p of pages) {
  const fullPath = path.resolve(p);
  if (!fs.existsSync(fullPath)) continue;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace image: '/some_image.jpg' with .webp
  content = content.replace(/(['"]\/[a-zA-Z0-9_\-]+)\.jpg(['"])/g, '$1.webp$2');

  // Replace src="/some_image.jpg" with .webp
  content = content.replace(/(src=['"]\/[a-zA-Z0-9_\-]+)\.jpg(['"])/g, '$1.webp$2');

  // Replace style url('/some_image.jpg') with .webp
  content = content.replace(/(url\(['"]?\/[a-zA-Z0-9_\-]+)\.jpg(['"]?\))/g, '$1.webp$2');

  // Ensure below-the-fold img tags have loading="lazy" decoding="async" if not already present
  content = content.replace(/<img\s+(?!.*?loading=)([^>]*?)(\/?>)/gi, '<img loading="lazy" decoding="async" $1$2');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated images in ${p}`);
}
