import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerRequestCount, handlerReset } from "./api/request-count.js";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerRequestCount);
app.get("/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
