import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(
  'postgresql://neondb_owner:npg_lmzo32GCNadJ@ep-spring-bonus-am3k77ym-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS join_submissions (
      id         SERIAL PRIMARY KEY,
      name         TEXT        NOT NULL,
      phone        TEXT        NOT NULL,
      email        TEXT        NOT NULL,
      idea_brief   TEXT,
      project_idea TEXT,
      why_join     TEXT,
      portfolio    TEXT,
      linkedin     TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS idea_brief TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS project_idea TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS why_join TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS portfolio TEXT`;
  await sql`ALTER TABLE join_submissions ADD COLUMN IF NOT EXISTS linkedin TEXT`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: {
    name?: string;
    phone?: string;
    email?: string;
    ideaBrief?: string;
    projectIdea?: string;
    whyJoin?: string;
    portfolio?: string;
    linkedin?: string;
  };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, phone, email, ideaBrief, projectIdea, whyJoin, portfolio, linkedin } = body;

  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'name, phone and email are required' }),
    };
  }

  try {
    await ensureTable();

    await sql`
      INSERT INTO join_submissions (
        name,
        phone,
        email,
        idea_brief,
        project_idea,
        why_join,
        portfolio,
        linkedin
      )
      VALUES (
        ${name.trim()},
        ${phone.trim()},
        ${email.trim()},
        ${ideaBrief?.trim() || null},
        ${projectIdea?.trim() || null},
        ${whyJoin?.trim() || null},
        ${portfolio?.trim() || null},
        ${linkedin?.trim() || null}
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
