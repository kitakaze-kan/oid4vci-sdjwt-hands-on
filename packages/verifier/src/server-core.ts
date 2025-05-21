import express from "express";
import { engine } from "express-handlebars";
import { dirname, join } from "path";

import { request } from "./routes/request.js";
import { reqObj } from "./routes/requestObj.js";
import { callback } from "./routes/callback.js";
import { fileURLToPath } from "url";
import { check } from "./routes/check.js";

export default function createVerifierApp() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const app = express();
  app.use(express.json());

  app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
  app.set("view engine", ".hbs");
  app.set("views", join(__dirname, "..", "views"));

  app.use("/", request); // QR ページ
  app.use("/", reqObj); // request-obj
  app.use("/", callback); // callback
  app.use("/", check); // check-result
  return app;
}
