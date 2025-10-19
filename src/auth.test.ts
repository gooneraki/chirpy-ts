import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("JWT validation", () => {
  const secret = "sdgfhkadhkfdhasodd";
  const user1 = "user1-myfriend";
  const user2 = "user2-myenemy";

  let jws1: string;
  let jws2: string;

  beforeAll(async () => {
    jws1 = await makeJWT(user1, 200, secret);
    jws2 = await makeJWT(user2, 200, secret);
  });

  it("should return true for correct authentication", async () => {
    const result = validateJWT(jws1, secret);
    expect(result === user1).toBe(true);
  });

  it("should return true for correct authentication", async () => {
    const result = validateJWT(jws2, secret);
    expect(result === user2).toBe(true);
  });
});
