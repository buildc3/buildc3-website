import type { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS join_submissions (
      id         SERIAL PRIMARY KEY,
      name       TEXT        NOT NULL,
      phone      TEXT        NOT NULL,
      email      TEXT        NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body: { name?: string; phone?: string; email?: string };
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
      INSERT INTO join_submissions (name, phone, email)
      VALUES (${name.trim()}, ${phone.trim()}, ${email.trim()})
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
