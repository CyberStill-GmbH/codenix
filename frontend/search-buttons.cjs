const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.match(/<button[^>]*className=[\"']([^\"']*)[\"']/g);
      if (matches) {
        matches.forEach(m => {
          // Extract classname
          const cls = m.match(/className=[\"']([^\"']*)[\"']/)[1];
          results.push({ file: file.split('src\\')[1], cls });
        });
      }
    }
  });
  return results;
}

const buttons = walk('src');
console.log(JSON.stringify(buttons, null, 2));
