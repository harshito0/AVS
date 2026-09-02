import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const files = fs.readdirSync(publicDir);

async function optimizeImages() {
  console.log('Starting image optimization...');
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(publicDir, file);
    const stats = fs.statSync(filePath);

    if (ext === '.jpg' || ext === '.jpeg') {
      totalOriginal += stats.size;
      const baseName = path.basename(file, ext);
      const webpOutput = path.join(publicDir, `${baseName}.webp`);

      // Convert to high-quality WebP
      await sharp(filePath)
        .webp({ quality: 82, effort: 6 })
        .toFile(webpOutput);

      const webpStats = fs.statSync(webpOutput);
      totalOptimized += webpStats.size;
      console.log(`✓ ${file} (${Math.round(stats.size / 1024)}KB) -> ${baseName}.webp (${Math.round(webpStats.size / 1024)}KB)`);

      // If this is hero_brand_bg, also create responsive sizes
      if (baseName === 'hero_brand_bg') {
        await sharp(filePath)
          .resize({ width: 1000, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(path.join(publicDir, 'hero_brand_bg-1000.webp'));

        await sharp(filePath)
          .resize({ width: 640, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(path.join(publicDir, 'hero_brand_bg-640.webp'));
        console.log('  + Generated responsive sizes for hero_brand_bg');
      }
    } else if (ext === '.png' && file === 'logoavs.png') {
      totalOriginal += stats.size;
      const webpOutput = path.join(publicDir, 'logoavs.webp');
      
      // Convert logo to WebP
      await sharp(filePath)
        .webp({ quality: 90, effort: 6 })
        .toFile(webpOutput);

      // Also optimize the PNG in place
      const tempPng = path.join(publicDir, 'logoavs_temp.png');
      await sharp(filePath)
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(tempPng);
      fs.copyFileSync(tempPng, filePath);
      fs.unlinkSync(tempPng);

      const webpStats = fs.statSync(webpOutput);
      const newPngStats = fs.statSync(filePath);
      console.log(`✓ logoavs.png (${Math.round(stats.size / 1024)}KB) -> logoavs.webp (${Math.round(webpStats.size / 1024)}KB), optimized PNG (${Math.round(newPngStats.size / 1024)}KB)`);
    }
  }

  console.log('---------------------------------------------------');
  console.log(`Original total: ~${Math.round(totalOriginal / (1024 * 1024))}MB`);
  console.log(`Optimized total: ~${Math.round(totalOptimized / (1024 * 1024))}MB`);
  console.log('Image optimization complete!');
}

optimizeImages().catch(console.error);
