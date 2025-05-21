import createIssuerApp from "./server-core.js";
import { ISSUER_BASE } from "../../commons/src/load-env.js";
import "../../commons/src/load-env.js";

createIssuerApp().listen(Number(process.env.ISSUER_PORT ?? 3000), () =>
  console.log(`▶ Issuer ${ISSUER_BASE}`)
);
