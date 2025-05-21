import { Router } from "express";
import { getRequestObj } from "../utils/state.js";
import { createJWT } from "../../../commons/src/jwk.js";
export const reqObj = Router();

reqObj.get("/request-obj/:id", async (req, res) => {
  const obj = getRequestObj(req.params.id);
  if (!obj) return res.status(404).send("not found");
  const jwt = await createJWT(obj);
  res.setHeader("Cache-Control", "no-store");
  res.type("text/plain").send(jwt); // Wallet expects Base64(JSON)
});
