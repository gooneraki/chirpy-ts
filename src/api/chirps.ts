import type { NextFunction, Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpsValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    const err = new Error("Chirp is too long");
    // respondWithError(res, 400, "Chirp is too long");
    next(err);
    return;
  }

  const words = params.body.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");

  respondWithJSON(res, 200, {
    cleanedBody: cleaned,
  });
}
