#!/usr/bin/env node
import { readdir, writeFile, readFile } from 'fs/promises';
import { join, extname } from 'path';

const DIST_DIR = 'dist/public';
const SW_PATH = 'dist/public/sw.js';

async function getAssetFiles(dir, files = []) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await getAssetFiles(fullPath, files);
      } else {
        const ext = extname(entry.name).toLowerCase();
        if (['.js', '.css', '.html', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.woff', '.woff2'].includes(ext)) {
          const relativePath = '/' + fullPath.replace(DIST_DIR + '/', '');
          files.push(relativePath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  
  return files;
}

async function updateServiceWorker() {
  try {
    const assets = await getAssetFiles(DIST_DIR);
    
    const coreAssets = [
      '/',
      '/index.html',
      ...assets.filter(a => a.endsWith('.js') || a.endsWith('.css'))
    ];
    
    const uniqueAssets = [...new Set(coreAssets)];
    
    let swContent = await readFile(SW_PATH, 'utf-8');
    
    const precacheArray = `const PRECACHE_URLS = ${JSON.stringify(uniqueAssets, null, 2)};`;
    
    swContent = swContent.replace(
      /const PRECACHE_URLS = \[[\s\S]*?\];/,
      precacheArray
    );
    
    const versionMatch = swContent.match(/CACHE_VERSION = (\d+)/);
    if (versionMatch) {
      const newVersion = parseInt(versionMatch[1]) + 1;
      swContent = swContent.replace(
        /CACHE_VERSION = \d+/,
        `CACHE_VERSION = ${newVersion}`
      );
      console.log(`[Precache] Updated cache version to ${newVersion}`);
    }
    
    await writeFile(SW_PATH, swContent);
    
    console.log(`[Precache] Updated service worker with ${uniqueAssets.length} assets:`);
    uniqueAssets.slice(0, 10).forEach(a => console.log(`  - ${a}`));
    if (uniqueAssets.length > 10) {
      console.log(`  ... and ${uniqueAssets.length - 10} more`);
    }
    
  } catch (err) {
    console.error('[Precache] Error:', err.message);
    process.exit(1);
  }
}

updateServiceWorker();
