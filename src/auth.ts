import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  return verify(hash, password);
}

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  return jwt.sign(userID, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  const jwtPayload = jwt.verify(tokenString, secret);
  console.log("jwtPayload", jwtPayload);
  if (typeof jwtPayload === "string") {
    return jwtPayload;
  }

  const sub = jwtPayload["sub"];

  return sub ?? "NADA";
}
