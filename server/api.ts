/**
 * Local Express API server using SQLite
 * Run: npx tsx server/api.ts
 */
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'buildc3.db');

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ─── Projects ───────────────────────────────────────────────
app.get('/api/projects', (_req, res) => {
  try {
    const projects = db.prepare(`
      SELECT * FROM projects ORDER BY created_at DESC
    `).all();

    // Get categories for each project
    const getCategories = db.prepare(`
      SELECT c.* FROM categories c
      JOIN project_categories pc ON pc.category_id = c.id
      WHERE pc.project_id = ?
      ORDER BY c.display_order
    `);

    const result = projects.map((p: any) => ({
      ...p,
      categories: getCategories.all(p.id),
    }));

    res.json(result);
  } catch (err) {
    console.error('[GET /api/projects]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const { title, description, thumbnail_url, external_link, category_ids } = req.body;

    const result = db.prepare(`
      INSERT INTO projects (title, description, thumbnail_url, external_link)
      VALUES (?, ?, ?, ?)
    `).run(title, description || '', thumbnail_url || '', external_link || '');

    const projectId = result.lastInsertRowid;

    // Insert category links
    const insertLink = db.prepare(`
      INSERT OR IGNORE INTO project_categories (project_id, category_id)
      VALUES (?, ?)
    `);

    for (const cid of category_ids || []) {
      insertLink.run(projectId, cid);
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
    res.status(201).json(project);
  } catch (err) {
    console.error('[POST /api/projects]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, thumbnail_url, external_link, category_ids } = req.body;

    db.prepare(`
      UPDATE projects
      SET title = ?, description = ?, thumbnail_url = ?, external_link = ?
      WHERE id = ?
    `).run(title, description || '', thumbnail_url || '', external_link || '', id);

    // Update category links
    db.prepare('DELETE FROM project_categories WHERE project_id = ?').run(id);

    const insertLink = db.prepare(`
      INSERT OR IGNORE INTO project_categories (project_id, category_id)
      VALUES (?, ?)
    `);

    for (const cid of category_ids || []) {
      insertLink.run(id, cid);
    }

    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json(project);
  } catch (err) {
    console.error('[PUT /api/projects/:id]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/projects/:id]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Categories ─────────────────────────────────────────────
app.get('/api/categories', (_req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY display_order ASC').all();
    res.json(categories);
  } catch (err) {
    console.error('[GET /api/categories]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const { name, display_order } = req.body;
    const result = db.prepare(`
      INSERT INTO categories (name, display_order)
      VALUES (?, ?)
    `).run(name, display_order ?? 0);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(category);
  } catch (err) {
    console.error('[POST /api/categories]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/categories/:id]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Community Members ──────────────────────────────────────
app.get('/api/community', (_req, res) => {
  try {
    const members = db.prepare('SELECT * FROM community_members ORDER BY display_order ASC').all();
    res.json(members);
  } catch (err) {
    console.error('[GET /api/community]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post('/api/community', (req, res) => {
  try {
    const { name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order } = req.body;
    const result = db.prepare(`
      INSERT INTO community_members (name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, role || '', image_url || '', cover_image_url || '', linkedin_url || '', portfolio_url || '', display_order ?? 0);

    const member = db.prepare('SELECT * FROM community_members WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(member);
  } catch (err) {
    console.error('[POST /api/community]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.put('/api/community/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order } = req.body;

    db.prepare(`
      UPDATE community_members
      SET name = ?, role = ?, image_url = ?, cover_image_url = ?, linkedin_url = ?, portfolio_url = ?, display_order = ?
      WHERE id = ?
    `).run(name, role || '', image_url || '', cover_image_url || '', linkedin_url || '', portfolio_url || '', display_order ?? 0, id);

    const member = db.prepare('SELECT * FROM community_members WHERE id = ?').get(id);
    res.json(member);
  } catch (err) {
    console.error('[PUT /api/community/:id]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.delete('/api/community/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.prepare('DELETE FROM community_members WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/community/:id]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ─── Join submissions (proxied from /.netlify/functions/submit-join in dev) ──
app.post('/api/submit-join', async (req, res) => {
  const { name, phone, email } = req.body ?? {};

  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'name, phone and email are required' });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(500).json({ error: 'DATABASE_URL is not configured on this server.' });
  }

  try {
    const sql = neon(dbUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS join_submissions (
        id           SERIAL PRIMARY KEY,
        name         TEXT        NOT NULL,
        phone        TEXT        NOT NULL,
        email        TEXT        NOT NULL,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO join_submissions (name, phone, email)
      VALUES (${name.trim()}, ${phone.trim()}, ${email.trim()})
    `;
    res.json({ success: true });
  } catch (err) {
    console.error('[POST /api/submit-join]', err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`SQLite API server running at http://localhost:${PORT}`);
  console.log(`Database: ${DB_PATH}`);
});
