import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure icons directory exists
const iconsDir = join(__dirname, '../public/icons');
await mkdir(iconsDir, { recursive: true }).catch(() => {});

// Create SVG with background
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64">
  <!-- Background shape -->
  <rect x="0" y="0" width="64" height="64" rx="12" fill="#4F46E5" />
  
  <!-- Dropshipping box icon -->
  <rect x="16" y="22" width="24" height="24" rx="2" stroke="#FFFFFF" stroke-width="3" fill="none" />
  
  <!-- AI circuit pattern -->
  <path d="M16 30 H40 M16 38 H40 M24 22 V46 M32 22 V46" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="2,2" />
  
  <!-- AI circuit nodes -->
  <circle cx="24" cy="30" r="2" fill="#FFFFFF" />
  <circle cx="32" cy="38" r="2" fill="#FFFFFF" />
  
  <!-- Drop symbol -->
  <path d="M44 22 C44 30 52 38 52 44 A8 8 0 0 1 36 44 C36 38 44 30 44 22Z" fill="#FFFFFF" />
</svg>`;

// Generate icons in different sizes
async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error); 