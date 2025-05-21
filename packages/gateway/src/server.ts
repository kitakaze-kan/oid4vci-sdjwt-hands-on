import express from "express";
import { app as issuerApp } from "../../issuer/src/app-export.js";
import { app as verifierApp } from "../../verifier/src/app-export.js";
import { PUBLIC_HOST } from "../../commons/src/load-env.js";
import "../../commons/src/load-env.js";

//ngrok向けにissuer/verifierサーバーのportを統一するためのgateway
const PORT = Number(process.env.GATEWAY_PORT ?? 3000);
const gateway = express();

/* /** → issuer,  /verifier/** → verifier */
gateway.use("", issuerApp);
gateway.use("/verifier", verifierApp);

gateway.listen(PORT, () =>
  console.log(`🌐 Gateway  ${PUBLIC_HOST}  (all-in-one)`)
);
