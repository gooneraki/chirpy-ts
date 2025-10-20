import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import {
  BadRequestError,
  NotFoundError,
  UserForbiddenError,
  UserNotAuthenticatedError,
} from "./errors.js";
import { NewChirp } from "../db/schema.js";
import {
  createChirp,
  deleteChirpById,
  getAllChirps,
  getChirpById,
} from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const token = getBearerToken(req);

  const userId = validateJWT(token, config.jwt.secret);

  const cleaned = validateChirp(params.body);
  const chirp = await createChirp({ body: cleaned, userId: userId });

  respondWithJSON(res, 201, chirp);
}

export async function handlerChirpsList(req: Request, res: Response) {
  try {
    const chirps = await getAllChirps();

    respondWithJSON(res, 200, chirps);
  } catch (err) {
    throw new Error("could not create chirp");
  }
}

export async function handlerChirpsGet(req: Request, res: Response) {
  const { chirpID } = req.params;
  if (!chirpID) {
    throw new BadRequestError("no chirpID found in params");
  }

  const chirp = await getChirpById(chirpID);

  if (!chirp) {
    throw new NotFoundError(`hirp with id ${chirpID} not found`);
  }

  respondWithJSON(res, 200, chirp);
}
export async function handlerChirpsDelete(req: Request, res: Response) {
  const { chirpID } = req.params;
  if (!chirpID) {
    throw new BadRequestError("no chirpID found in params");
  }

  const chirp = await getChirpById(chirpID);

  if (!chirp) {
    throw new NotFoundError(`chirp with id ${chirpID} not found`);
  }

  const token = getBearerToken(req);
  const sub = validateJWT(token, config.jwt.secret);

  if (sub !== chirp.userId) {
    throw new UserForbiddenError("user cannot delete this chirp");
  }

  await deleteChirpById(chirpID);

  respondWithJSON(res, 204, {});
}

function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new BadRequestError(
      `Chirp is too long. Max length is ${maxChirpLength}`
    );
  }

  const words = body.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  return words.join(" ");
}
