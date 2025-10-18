import { hash, verify } from "argon2";

export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return verify(hash, password);
}
