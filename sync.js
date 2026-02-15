const fs = require('fs');

console.log('Syncing public/index.html to root...');

// Read public index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// Update paths for root location
html = html
  .replace(/\.\/css\//g, 'public/css/')
  .replace(/\.\/js\//g, 'public/js/')
  .replace(/\.\/images\//g, 'public/images/');

// Write to root
fs.writeFileSync('index.html', html);

console.log('Root index.html updated successfully!');
console.log('Files ready:');
console.log('- public/index.html (with relative paths)');
console.log('- index.html (points to public folder)');
