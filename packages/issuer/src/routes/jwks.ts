import { Router } from "express";
import { getPublicJwk } from "../../../commons/src/jwk.js";

export const jwks = Router();

jwks.get("/.well-known/jwks.json", async (_req, res) => {
  const jwk = await getPublicJwk();
  res.json({ keys: [jwk] });
});
