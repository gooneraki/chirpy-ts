import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getAllChirps() {
  return await db.select().from(chirps).orderBy(chirps.createdAt);
}

export async function getChirpById(chirpId: string) {
  const rows = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}

export async function deleteChirpById(chirpId: string) {
  const rows = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning();
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}
