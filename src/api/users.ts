import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";

import {
  checkPasswordHash,
  hashPassword,
  makeJWT,
  makeRefreshToken,
} from "../auth.js";

import { NewUser } from "../db/schema.js";
import { createUser, getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";

import { config } from "../config.js";

import { saveRefreshToken } from "../db/queries/refreshTokens.js";

type UserResponse = Omit<NewUser, "hashedPassword">;
type LoginResponse = UserResponse & { token: string; refreshToken: string };

export async function handlerUserCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const newUser = await createUser({
    email: params.email,
    hashedPassword: await hashPassword(params.password),
  });

  if (!newUser) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } as Omit<NewUser, "hashedPassword">);
}

export async function handlerUserLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new UserNotAuthenticatedError("invalid username or password");
  }

  const matching = await checkPasswordHash(
    params.password,
    user.hashedPassword
  );
  if (!matching) {
    throw new UserNotAuthenticatedError("invalid username or password");
  }

  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  );
  const refreshToken = makeRefreshToken();

  const saved = await saveRefreshToken(user.id, refreshToken);
  if (!saved) {
    throw new UserNotAuthenticatedError("could not save refresh token");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: accessToken,
    refreshToken: refreshToken,
  } satisfies LoginResponse);
}
