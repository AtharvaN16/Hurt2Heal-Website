import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = process.cwd();

const productPath = join(projectRoot, 'PRODUCT.md');
const designPath = join(projectRoot, 'DESIGN.md');

const productMd = existsSync(productPath) ? readFileSync(productPath, 'utf8') : null;
const designMd = existsSync(designPath) ? readFileSync(designPath, 'utf8') : null;

if (!productMd && !designMd) {
  console.log('NO_PRODUCT_MD');
  process.exit(0);
}

console.log('PRODUCT.md:');
console.log(productMd || '(not found)');
console.log('\n--- DESIGN.md ---\n');
console.log(designMd || '(not found)');