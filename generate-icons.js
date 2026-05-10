import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const svgPath = path.join(process.cwd(), 'apps/phone-pwa/public/favicon.svg');
  
  const destDesktop512 = path.join(process.cwd(), 'apps/desktop/public/icon-512.png');
  const destDesktop192 = path.join(process.cwd(), 'apps/desktop/public/icon-192.png');
  const destPhone512 = path.join(process.cwd(), 'apps/phone-pwa/public/icon-512.png');
  const destPhone192 = path.join(process.cwd(), 'apps/phone-pwa/public/icon-192.png');
  const destPhoneApple = path.join(process.cwd(), 'apps/phone-pwa/public/apple-touch-icon.png');

  console.log('Generating icons...');

  try {
    // Generate 512x512
    const img512 = await sharp(svgPath).resize(512, 512).png().toBuffer();
    fs.writeFileSync(destDesktop512, img512);
    fs.writeFileSync(destPhone512, img512);

    // Generate 192x192
    const img192 = await sharp(svgPath).resize(192, 192).png().toBuffer();
    fs.writeFileSync(destDesktop192, img192);
    fs.writeFileSync(destPhone192, img192);

    // Generate Apple Touch Icon (usually 180x180, needs opaque background ideally, but we'll just use the transparent one or composite it)
    const imgApple = await sharp(svgPath)
      .resize(180, 180)
      .flatten({ background: '#EEF0F8' }) // Light background matching our theme
      .png()
      .toBuffer();
    fs.writeFileSync(destPhoneApple, imgApple);

    console.log('All icons successfully generated!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
