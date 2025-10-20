import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  return result;
}

export async function getUserByEmail(email: string) {
  const rows = await db.select().from(users).where(eq(users.email, email));
  if (rows.length === 0) {
    return;
  }
  return rows[0];
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function updateUserCredentials(
  userId: string,
  email: string,
  hashedPassword: string
) {
  const rows = await db
    .update(users)
    .set({ email, hashedPassword })
    .where(eq(users.id, userId))
    .returning();

  if (rows.length === 0) {
    return;
  }
  return rows[0];
}
