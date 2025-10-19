import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getTokenByToken(token: string) {
  const rows = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}

export async function revokeToken(token: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();

  return result;
}
