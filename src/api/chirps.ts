import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { NewChirp } from "../db/schema.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;

  if (!params.userId) {
    throw new BadRequestError(`missing userId: ${JSON.stringify(params)}`);
  }
  if (!params.body) {
    throw new BadRequestError(`missing body: ${JSON.stringify(params)}`);
  }

  const newChirp: NewChirp = await createChirp({
    body: chirpsValidate(params.body),
    userId: params.userId,
  });

  if (!newChirp) {
    throw new Error("could not create chirp");
  }

  respondWithJSON(res, 201, newChirp);
}

function chirpsValidate(body: string) {
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
