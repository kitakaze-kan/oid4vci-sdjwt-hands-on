import express from "express";
import { engine } from "express-handlebars";
import { dirname, join } from "path";

import { index } from "./routes/index.js";
import { metadata } from "./routes/metadata.js";
import { offer } from "./routes/offer.js";
import { token } from "./routes/token.js";
import { credential } from "./routes/credential.js";
import { oauthMeta } from "./routes/oauth-meta.js";
import { jwks } from "./routes/jwks.js";
import { fileURLToPath } from "url";
/**
 * Issuer アプリを生成して返すだけの関数。
 * Gateway 経由でも個別起動でも再利用できる。
 */
export default function createIssuerApp() {
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /* view engine */
  app.engine(".hbs", engine({ extname: ".hbs", defaultLayout: false }));
  app.set("view engine", ".hbs");
  app.set("views", join(__dirname, "..", "views"));

  /* routes */
  app.use("/", index);
  app.use("/", metadata);
  app.use("/", offer);
  app.use("/", oauthMeta);
  app.use("/", jwks);
  app.use("/", token);
  app.use("/", credential);

  return app;
}
