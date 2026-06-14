import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS join_submissions (
      id           SERIAL PRIMARY KEY,
      name         TEXT        NOT NULL,
      phone        TEXT        NOT NULL,
      email        TEXT        NOT NULL,
      idea         TEXT,
      project_idea TEXT,
      why_join     TEXT,
      portfolio    TEXT,
      linkedin     TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  // Backfill columns for tables created by an older version of this function.
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS idea TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS project_idea TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS why_join TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS portfolio TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS linkedin TEXT`;
}

interface JoinBody {
  name?: string;
  phone?: string;
  email?: string;
  idea?: string;
  projectIdea?: string;
  whyJoin?: string;
  portfolio?: string;
  linkedin?: string;
}

const clean = (v?: string) => {
  const t = v?.trim();
  return t ? t : null;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: JoinBody;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, phone, email } = body;

  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'name, phone and email are required' }),
    };
  }

  try {
    await ensureTable();

    await sql`
      INSERT INTO join_submissions
        (name, phone, email, idea, project_idea, why_join, portfolio, linkedin)
      VALUES (
        ${name.trim()},
        ${phone.trim()},
        ${email.trim()},
        ${clean(body.idea)},
        ${clean(body.projectIdea)},
        ${clean(body.whyJoin)},
        ${clean(body.portfolio)},
        ${clean(body.linkedin)}
      )
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('[submit-join]', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save submission. Please try again.' }),
    };
  }
};
