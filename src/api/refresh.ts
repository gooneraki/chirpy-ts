import type { Request, Response } from "express";
import { getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { getTokenByToken, revokeToken } from "../db/queries/refreshTokens.js";
import { NotFoundError, UserNotAuthenticatedError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { config } from "../config.js";

export async function handlerRefresh(req: Request, res: Response) {
  const token = getBearerToken(req);

  const tokenDb = await getTokenByToken(token);
  if (!tokenDb) {
    throw new UserNotAuthenticatedError("Token does not exist");
  }

  if (tokenDb.revokedAt) {
    throw new UserNotAuthenticatedError("Token already revoked");
  }

  if (tokenDb.expiresAt < new Date()) {
    throw new UserNotAuthenticatedError("Token expired");
  }

  // Create new access token
  const newAccessToken = makeJWT(tokenDb.userId, 3600, config.jwt.secret);

  respondWithJSON(res, 200, {
    token: newAccessToken,
  });
}

export async function handlerRevoke(req: Request, res: Response) {
  const token = getBearerToken(req);

  const tokenDb = await revokeToken(token);
  if (!tokenDb) {
    throw new NotFoundError(`couldn't revoke token ${token}`);
  }

  respondWithJSON(res, 204, "");
}
