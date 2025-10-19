import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { refreshTokens } from "../schema.js";
import { config } from "../../config.js";

export async function saveRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshTokens)
    .values({
      userId: userID,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      revokedAt: null,
    })
    .returning();

  return rows.length > 0;
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
