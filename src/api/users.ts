import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";

import { NewUser } from "../db/schema.js";
import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "./errors.js";

export async function handlerUserCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;

  if (!params.email) {
    throw new BadRequestError("Missing required fields");
  }

  const newUser = await createUser({ email: params.email });

  if (!newUser) {
    throw new Error("Could not create user");
  }

  respondWithJSON(res, 201, {
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  } as NewUser);
}
