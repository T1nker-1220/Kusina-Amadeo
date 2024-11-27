const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

// Create directories if they don't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// List of required images
const requiredImages = [
  'hero-bg.jpg',
  'adobo.jpg',
  'sinigang.jpg',
  'lechon-kawali.jpg',
  'testimonial1.jpg',
  'testimonial2.jpg',
  'testimonial3.jpg'
];

// Check for missing images
const missingImages = requiredImages.filter(img => !fs.existsSync(path.join(imagesDir, img)));

if (missingImages.length > 0) {
  console.log('\x1b[33m%s\x1b[0m', 'Warning: The following images are missing:');
  missingImages.forEach(img => {
    console.log(`- ${img}`);
  });
  console.log('\nPlease add these images to the public/images directory.');
  console.log('You can use placeholder images from https://placeholder.com or add your own images.');
} else {
  console.log('\x1b[32m%s\x1b[0m', 'All required images are present!');
}
