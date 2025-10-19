import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";

import { checkPasswordHash, hashPassword, makeJWT } from "../auth.js";

import { NewUser } from "../db/schema.js";
import { createUser, getUser } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";

import { config } from "../config.js";

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
    email: string;
    password: string;
    expiresInSeconds?: number;
  };

  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required email field");
  }
  if (!params.password) {
    throw new BadRequestError("Missing required password field");
  }

  const user = await getUser(params.email);

  if (!user) {
    throw new Error(`Could not find user with email ${params.email}`);
  }

  const verifyPass = await checkPasswordHash(
    params.password,
    user.hashedPassword
  );

  if (!verifyPass) {
    throw new UserNotAuthenticatedError("wrong password");
  }

  const token = makeJWT(
    user.id,
    params.expiresInSeconds ?? 60 * 60,
    config.jwtSecret
  );

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token,
  });
}
