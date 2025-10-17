import type { Request, Response } from "express";
import { config } from "../config.js";
import { UserForbiddenError } from "./errors.js";

import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    throw new UserForbiddenError(
      `Only allowed to delete all users in 'dev' (${config.api.platform})`
    );
  }

  config.api.fileServerHits = 0;
  await deleteUsers();
  res.write("Hits reset to 0 and all users deleted");
  res.end();
}
