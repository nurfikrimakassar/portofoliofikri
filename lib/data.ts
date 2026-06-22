import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { PortfolioData } from "./types";
import { defaultData } from "./default-data";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

async function ensureStore(): Promise<void> {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

/**
 * Reads the portfolio content store. In this starter, the "database" is a
 * single JSON file on disk (data/store.json) seeded from default-data.ts.
 * Swap this function for a real DB call (Prisma/Postgres) in production —
 * everything else in the app reads through this one function.
 */
export async function getData(): Promise<PortfolioData> {
  await ensureStore();
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    // Shallow-merge over defaults so partially-edited stores never crash a render.
    return { ...defaultData, ...parsed };
  } catch {
    return defaultData;
  }
}

export async function saveData(data: PortfolioData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}
