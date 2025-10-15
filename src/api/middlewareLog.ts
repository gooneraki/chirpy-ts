import type { NextFunction, Request, Response } from "express";

export async function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    const status_code = res.statusCode;
    const url = req.url;
    const http_method = req.method;
    if (status_code != 200) {
      console.log(`[NON-OK] ${http_method} ${url} - Status: ${status_code}`);
    }
  });
  next();
}
