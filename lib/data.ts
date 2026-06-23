import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioData } from "./types";
import { defaultData } from "./default-data";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

// ─── PostgreSQL (Neon) ────────────────────────────────────────────────────────

async function getDb() {
  const { default: postgres } = await import("postgres");
  const sql = postgres(process.env.DATABASE_URL!, { ssl: "require", max: 1 });
  await sql`
    CREATE TABLE IF NOT EXISTS portfolio (
      id   INT PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `;
  return sql;
}

async function getFromDb(): Promise<PortfolioData> {
  const sql = await getDb();
  try {
    const rows = await sql`SELECT data FROM portfolio WHERE id = 1`;
    if (rows.length === 0) {
      await sql`INSERT INTO portfolio (id, data) VALUES (1, ${JSON.stringify(defaultData)})`;
      return defaultData;
    }
    return { ...defaultData, ...(rows[0].data as PortfolioData) };
  } finally {
    await sql.end();
  }
}

async function saveToDb(data: PortfolioData): Promise<void> {
  const sql = await getDb();
  try {
    await sql`
      INSERT INTO portfolio (id, data) VALUES (1, ${JSON.stringify(data)})
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
    `;
  } finally {
    await sql.end();
  }
}

// ─── JSON store (dev lokal) ───────────────────────────────────────────────────

async function getFromJson(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return { ...defaultData, ...(JSON.parse(raw) as PortfolioData) };
  } catch {
    return defaultData;
  }
}

async function saveToJson(data: PortfolioData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getData(): Promise<PortfolioData> {
  return process.env.DATABASE_URL ? getFromDb() : getFromJson();
}

export async function saveData(data: PortfolioData): Promise<void> {
  return process.env.DATABASE_URL ? saveToDb(data) : saveToJson(data);
}
