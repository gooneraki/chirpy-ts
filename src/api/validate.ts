import type { Request, Response } from "express";

type AppError = {
  error: string;
};
type AppResponse = {
  body: string;
};

export async function handlerValidate(req: Request, res: Response) {
  let body = "";
  let parseBody: AppResponse = { body: "" };

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      parseBody = JSON.parse(body);
      console.log("dasdas", parseBody);
      if (parseBody.body.length > 140) {
        res.status(400).send({
          error: "Chirp is too long",
        } as AppError);
        return;
      }
      if (parseBody.body.length == 0) {
        res.status(400).send({
          error: "Chirp is empty",
        } as AppError);
        return;
      }

      res.send({
        valid: true,
      });
    } catch (error) {
      res.status(500).send({
        error: "could not parse body",
      } as AppError);
      return;
    }
  });
}
