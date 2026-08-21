const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const devicons = [
  'photoshop/photoshop-plain.svg',
  'illustrator/illustrator-plain.svg',
  'figma/figma-original.svg',
  'xd/xd-plain.svg',
  'canva/canva-original.svg',
  'premierepro/premierepro-plain.svg',
];

const outDir = path.join(__dirname, '../client/public/images');

const generateTextIcon = async (text, color, filename) => {
  // SVG with white background, smaller colored rounded rect, text inside
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#ffffff" />
    <rect x="128" y="128" width="256" height="256" fill="${color}" rx="32" />
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" alignment-baseline="middle">${text}</text>
  </svg>`;
  
  const outPath = path.join(outDir, `${filename}.webp`);
  await sharp(Buffer.from(svg))
    .webp({ quality: 90 })
    .toFile(outPath);
  console.log(`Saved ${filename}.webp`);
};

async function create() {
  for (const iconPath of devicons) {
    try {
      const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${iconPath}`;
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const name = iconPath.split('/')[0];
      const outPath = path.join(outDir, `${name}.webp`);
      
      // Use extend to add padding, then flatten with white background to remove alpha
      await sharp(response.data)
        .resize(300, 300, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .extend({
          top: 106,
          bottom: 106,
          left: 106,
          right: 106,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .webp({ quality: 90 })
        .toFile(outPath);
        
      console.log(`Saved ${name}.webp`);
    } catch (err) {
      console.error(`Failed to download ${iconPath}:`, err.message);
    }
  }

  await generateTextIcon('Id', '#FF3366', 'indesign'); // Adobe InDesign
  await generateTextIcon('Pro', '#1A1A1A', 'procreate'); // Procreate
  await generateTextIcon('Fr', '#FF6600', 'fresco'); // Adobe Fresco
}

create();
