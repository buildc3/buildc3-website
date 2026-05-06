/**
 * Generate static JSON files from SQLite database for production
 * Run: pnpm run db:export-static
 */
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'buildc3.db');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'api');

// Ensure output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const db = new Database(DB_PATH, { readonly: true });

console.log('Generating static API files from SQLite...');

// Export projects with categories
const projects = db.prepare(`SELECT * FROM projects ORDER BY created_at DESC`).all();
const getCategories = db.prepare(`
  SELECT c.* FROM categories c
  JOIN project_categories pc ON pc.category_id = c.id
  WHERE pc.project_id = ?
  ORDER BY c.display_order
`);

const projectsWithCategories = projects.map((p: any) => ({
  ...p,
  categories: getCategories.all(p.id),
}));

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'projects.json'),
  JSON.stringify(projectsWithCategories, null, 2)
);
console.log(`Exported ${projects.length} projects`);

// Export categories
const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'categories.json'),
  JSON.stringify(categories, null, 2)
);
console.log(`Exported ${categories.length} categories`);

// Export community members
const community = db.prepare('SELECT * FROM community_members ORDER BY display_order ASC').all();
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'community.json'),
  JSON.stringify(community, null, 2)
);
console.log(`Exported ${community.length} community members`);

db.close();
console.log(`\nStatic API files generated in: ${OUTPUT_DIR}`);
