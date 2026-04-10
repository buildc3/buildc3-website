import type { Handler, HandlerEvent } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const getDb = () => neon(process.env.DATABASE_URL!);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  try {
    const sql = getDb();
    // Strip both the Netlify path and the /api prefix
    const path = (event.path ?? '/')
      .replace(/^\/.netlify\/functions\/api/, '')
      .replace(/^\/api/, '');
    const method = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // ─── Projects ───────────────────────────────────────────────
    if (path === '/projects' && method === 'GET') {
      const rows = await sql`
        SELECT
          p.*,
          COALESCE(
            json_agg(c.* ORDER BY c.display_order) FILTER (WHERE c.id IS NOT NULL),
            '[]'
          ) AS categories
        FROM projects p
        LEFT JOIN project_categories pc ON pc.project_id = p.id
        LEFT JOIN categories c ON c.id = pc.category_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
      `;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(rows) };
    }

    if (path === '/projects' && method === 'POST') {
      const { title, description, thumbnail_url, external_link, category_ids } = body;
      const [project] = await sql`
        INSERT INTO projects (title, description, thumbnail_url, external_link)
        VALUES (${title}, ${description ?? ''}, ${thumbnail_url ?? ''}, ${external_link ?? ''})
        RETURNING *
      `;
      for (const cid of category_ids ?? []) {
        await sql`INSERT INTO project_categories (project_id, category_id) VALUES (${project.id}, ${cid}) ON CONFLICT DO NOTHING`;
      }
      return { statusCode: 201, headers: CORS, body: JSON.stringify(project) };
    }

    const projectMatch = path.match(/^\/projects\/(\d+)$/);
    if (projectMatch && method === 'PUT') {
      const id = parseInt(projectMatch[1]);
      const { title, description, thumbnail_url, external_link, category_ids } = body;
      const [project] = await sql`
        UPDATE projects
        SET title=${title}, description=${description ?? ''}, thumbnail_url=${thumbnail_url ?? ''}, external_link=${external_link ?? ''}
        WHERE id=${id} RETURNING *
      `;
      await sql`DELETE FROM project_categories WHERE project_id=${id}`;
      for (const cid of category_ids ?? []) {
        await sql`INSERT INTO project_categories (project_id, category_id) VALUES (${id}, ${cid}) ON CONFLICT DO NOTHING`;
      }
      return { statusCode: 200, headers: CORS, body: JSON.stringify(project) };
    }

    if (projectMatch && method === 'DELETE') {
      await sql`DELETE FROM projects WHERE id=${parseInt(projectMatch[1])}`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // ─── Categories ─────────────────────────────────────────────
    if (path === '/categories' && method === 'GET') {
      const rows = await sql`SELECT * FROM categories ORDER BY display_order ASC`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(rows) };
    }

    if (path === '/categories' && method === 'POST') {
      const { name, display_order } = body;
      const [cat] = await sql`
        INSERT INTO categories (name, display_order) VALUES (${name}, ${display_order ?? 0}) RETURNING *
      `;
      return { statusCode: 201, headers: CORS, body: JSON.stringify(cat) };
    }

    const categoryMatch = path.match(/^\/categories\/(\d+)$/);
    if (categoryMatch && method === 'DELETE') {
      await sql`DELETE FROM categories WHERE id=${parseInt(categoryMatch[1])}`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    // ─── Community Members ──────────────────────────────────────
    if (path === '/community' && method === 'GET') {
      const rows = await sql`SELECT * FROM community_members ORDER BY display_order ASC`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(rows) };
    }

    if (path === '/community' && method === 'POST') {
      const { name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order } = body;
      const [member] = await sql`
        INSERT INTO community_members (name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order)
        VALUES (${name}, ${role ?? ''}, ${image_url ?? ''}, ${cover_image_url ?? ''}, ${linkedin_url ?? ''}, ${portfolio_url ?? ''}, ${display_order ?? 0})
        RETURNING *
      `;
      return { statusCode: 201, headers: CORS, body: JSON.stringify(member) };
    }

    const communityMatch = path.match(/^\/community\/(\d+)$/);
    if (communityMatch && method === 'PUT') {
      const id = parseInt(communityMatch[1]);
      const { name, role, image_url, cover_image_url, linkedin_url, portfolio_url, display_order } = body;
      const [member] = await sql`
        UPDATE community_members
        SET name=${name}, role=${role ?? ''}, image_url=${image_url ?? ''}, cover_image_url=${cover_image_url ?? ''},
            linkedin_url=${linkedin_url ?? ''}, portfolio_url=${portfolio_url ?? ''}, display_order=${display_order ?? 0}
        WHERE id=${id} RETURNING *
      `;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(member) };
    }

    if (communityMatch && method === 'DELETE') {
      await sql`DELETE FROM community_members WHERE id=${parseInt(communityMatch[1])}`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Route not found' }) };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api]', message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};
