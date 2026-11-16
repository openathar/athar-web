import { Pool } from "pg";

import type { Locale } from "~/lib/i18n";

/**
 * Read-only access to the reflections live pool (Postgres, homelab-pg).
 * The n8n workflow writes validated drafts (status='draft'); a human promotes
 * them to 'live'. This module only ever reads 'live' rows.
 *
 * Connection comes from env (PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD)
 * injected by the deployment from the `athar-pg` secret. If the DB is not
 * reachable or has no live rows, callers fall back to the static
 * `data/reflections.json` seed.
 */

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!process.env.PGHOST || !process.env.PGDATABASE) return null;
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT ?? 5432),
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      connectionTimeoutMillis: 2500,
      idleTimeoutMillis: 30000,
      max: 5,
    });
  }
  return pool;
}

export type LiveReflection = {
  id: number;
  verse: string;
  field: Record<Locale, string>;
  observation: Record<Locale, string>;
};

export async function randomLiveReflection(excludeId?: number): Promise<LiveReflection | null> {
  const p = getPool();
  if (!p) return null;
  try {
    const { rows } = await p.query(
      `SELECT id, verse, field_de, field_en, field_ar,
              observation_de, observation_en, observation_ar
         FROM reflections
        WHERE status = 'live' AND ($1::bigint IS NULL OR id <> $1)
        ORDER BY random()
        LIMIT 1`,
      [excludeId ?? null]
    );
    const r = rows[0];
    if (!r) return null;
    return {
      id: r.id,
      verse: r.verse,
      field: { de: r.field_de, en: r.field_en, ar: r.field_ar },
      observation: { de: r.observation_de, en: r.observation_en, ar: r.observation_ar },
    };
  } catch {
    return null;
  }
}
