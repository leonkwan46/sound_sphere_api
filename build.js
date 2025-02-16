// build.js
import { build } from 'esbuild';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs';

// Get all TypeScript files
const entryPoints = await glob('src/**/*.ts');

// Build with esbuild (fast!)
await build({
  entryPoints,
  outdir: 'dist',
  bundle: false,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  splitting: false,
});

// Now fix the imports in all JS files
const jsFiles = await glob('dist/**/*.js');

for (const file of jsFiles) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace relative imports without extensions
  content = content.replace(
    /from\s+['"](\.[^'"]+)['"]/g,
    (match, importPath) => {
      // If import already has an extension, leave it alone
      if (path.extname(importPath)) {
        return match;
      }
      
      // Add .js extension
      return `from '${importPath}.js'`;
    }
  );
  
  fs.writeFileSync(file, content);
}

console.log('Build completed successfully with fixed imports!');