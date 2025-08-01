import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';
import { fileURLToPath } from 'url';

// Define the icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  try {
    // Load the SVG icon
    const svgPath = path.join(__dirname, 'app-icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Create a data URL from the SVG
    const svgDataUrl = `data:image/svg+xml;base64,${svgBuffer.toString('base64')}`;
    
    // Load the image
    const image = await loadImage(svgDataUrl);
    
    // Generate each size
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw the image to the canvas at the specified size
      ctx.drawImage(image, 0, 0, size, size);
      
      // Save the canvas as a PNG file
      const outputPath = path.join(__dirname, `icon-${size}x${size}.png`);
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      
      out.on('finish', () => {
        console.log(`Created ${outputPath}`);
      });
    }
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

// Execute the function
generateIcons();