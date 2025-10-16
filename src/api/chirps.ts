import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };
  type responseType = {
    cleanedBody: string;
  };

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    respondWithError(res, 400, "Chirp is too long");
    return;
  }

  const badwords = ["kerfuffle", "sharbert", "fornax"];
  const adjustedBody = params.body
    .split(" ")
    .map((w) => (badwords.includes(w.toLowerCase()) ? "****" : w))
    .join(" ");

  req.body = JSON.stringify({ body: adjustedBody } as parameters);

  respondWithJSON(res, 200, {
    cleanedBody: adjustedBody,
  } as responseType);
}
