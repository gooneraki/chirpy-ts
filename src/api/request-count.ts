import type { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerRequestCount(_: Request, res: Response) {
  res.send(`Hits: ${config.fileserverHits}`);
}

export async function handlerReset(_: Request, res: Response) {
  config.fileserverHits = 0;
  res.send("OK");
}
