import createVerifierApp from "./server-core.js";
import { VERIFIER_BASE } from "../../commons/src/load-env.js";
import "../../commons/src/load-env.js";

createVerifierApp().listen(Number(process.env.VERIFIER_PORT ?? 3001), () =>
  console.log(`▶ Verifier ${VERIFIER_BASE}`)
);
