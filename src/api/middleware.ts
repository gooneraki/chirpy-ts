import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}
class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function middlewareLogResponse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    const statusCode = res.statusCode;

    if (statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });

  next();
}

export function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction
) {
  config.fileServerHits++;
  next();
}

export function errorMiddleWare(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
) {
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
    return;
  }

  let statusCode = 500;
  let message = "Something went wrong on our end";

  console.log(err.message);

  respondWithError(res, statusCode, message);
}
