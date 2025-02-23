// scripts/uploadStickers.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper function to convert category name to camelCase
function toCamelCase(str) {
  return str.split('-').map((word, index) => 
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  ).join('');
}

// Helper function to convert category name to display name
function toDisplayName(str) {
  return str.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.VITE_CLOUDINARY_API_SECRET
});

async function uploadSticker(filePath, category) {
  try {
    const fileName = path.basename(filePath, path.extname(filePath));
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `scrapbook/${category}`,
      public_id: fileName,
      tags: ['sticker', category]
    });

    console.log(`✅ Uploaded: ${fileName} to ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error);
    return null;
  }
}

async function uploadCategory(categoryPath, categoryName) {
  if (!fs.existsSync(categoryPath)) {
    console.error(`Directory not found: ${categoryPath}`);
    return;
  }

  const files = fs.readdirSync(categoryPath)
    .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));

  console.log(`📁 Uploading ${files.length} stickers from ${categoryName}...`);

  const results = [];
  for (const file of files) {
    const fullPath = path.join(categoryPath, file);
    const url = await uploadSticker(fullPath, categoryName);
    if (url) {
      results.push({
        id: path.basename(file, path.extname(file)),
        url
      });
    }
  }

  // Make sure the stickerCategories directory exists
  const categoriesDir = path.join(__dirname, '..', 'src', 'config', 'stickerCategories');
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  // Generate category configuration
  const categoryConfig = {
    id: categoryName,
    name: toDisplayName(categoryName),
    stickers: results.map(result => ({
      id: result.id,
      src: result.url,
      alt: `${toDisplayName(categoryName)} sticker ${result.id}`
    }))
  };

  // Save category configuration with proper variable name
  const configPath = path.join(categoriesDir, `${categoryName}.js`);
  const configContent = `export const ${toCamelCase(categoryName)} = ${JSON.stringify(categoryConfig, null, 2)};`;
  
  fs.writeFileSync(configPath, configContent);
  console.log(`✨ Created category configuration: ${configPath}`);
  console.log(`💡 Import using: import { ${toCamelCase(categoryName)} } from './stickerCategories/${categoryName}';`);
}

// Get command line arguments
const categoryName = process.argv[2];
const categoryPath = process.argv[3];

if (!categoryName || !categoryPath) {
  console.log('Usage: node uploadStickers.js categoryName "./path/to/stickers"');
  process.exit(1);
}

uploadCategory(categoryPath, categoryName);