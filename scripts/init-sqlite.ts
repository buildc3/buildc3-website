/**
 * Initialize SQLite database with schema and seed data
 * Run: npx tsx scripts/init-sqlite.ts
 */
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'buildc3.db');
const SEED_PATH = path.join(__dirname, '..', 'data', 'seed-data.json');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

// Remove existing database
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Removed existing database');
}

const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Creating schema...');

// Create tables
db.exec(`
  -- Categories table
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Projects table
  CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    thumbnail_url TEXT DEFAULT '',
    external_link TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Project-Category junction table
  CREATE TABLE project_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(project_id, category_id)
  );

  -- Community members table
  CREATE TABLE community_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    cover_image_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Create indexes for better performance
  CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
  CREATE INDEX idx_categories_display_order ON categories(display_order);
  CREATE INDEX idx_project_categories_project ON project_categories(project_id);
  CREATE INDEX idx_project_categories_category ON project_categories(category_id);
  CREATE INDEX idx_community_display_order ON community_members(display_order);
`);

console.log('Schema created successfully');

// Load seed data
if (fs.existsSync(SEED_PATH)) {
  console.log('Loading seed data...');
  const seedData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));

  // Insert categories
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, display_order, created_at)
    VALUES (?, ?, ?, ?)
  `);

  for (const cat of seedData.categories) {
    insertCategory.run(cat.id, cat.name, cat.display_order, cat.created_at);
  }
  console.log(`Inserted ${seedData.categories.length} categories`);

  // Insert projects
  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, description, thumbnail_url, external_link, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const proj of seedData.projects) {
    insertProject.run(
      proj.id,
      proj.title,
      proj.description || '',
      proj.thumbnail_url || '',
      proj.external_link || '',
      proj.created_at
    );
  }
  console.log(`Inserted ${seedData.projects.length} projects`);

  // Insert project-category links
  const insertProjectCategory = db.prepare(`
    INSERT INTO project_categories (id, project_id, category_id, created_at)
    VALUES (?, ?, ?, ?)
  `);

  for (const pc of seedData.projectCategories) {
    insertProjectCategory.run(pc.id, pc.project_id, pc.category_id, pc.created_at);
  }
  console.log(`Inserted ${seedData.projectCategories.length} project-category links`);

  // Insert community members
  if (seedData.communityMembers && seedData.communityMembers.length > 0) {
    const insertMember = db.prepare(`
      INSERT INTO community_members (id, name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const member of seedData.communityMembers) {
      insertMember.run(
        member.id,
        member.name,
        member.role || '',
        member.image_url || '',
        member.cover_image_url || '',
        member.linkedin_url || '',
        member.portfolio_url || '',
        member.display_order || 0,
        member.created_at
      );
    }
    console.log(`Inserted ${seedData.communityMembers.length} community members`);
  }
} else {
  console.log('No seed data found, database created with empty tables');
}

db.close();
console.log(`\nDatabase created at: ${DB_PATH}`);
