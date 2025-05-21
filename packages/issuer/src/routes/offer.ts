import { Router } from "express";
import { isValidPreAuthCode } from "../utils/offer.js";
import { ISSUER_BASE } from "../../../commons/src/load-env.js";
export const offer = Router();

offer.get("/credential-offer/:code", (_req, res) => {
  const { code } = _req.params;
  if (!isValidPreAuthCode(code)) {
    return res.status(404).json({ error: "invalid_code" });
  }

  res.json({
    credential_issuer: ISSUER_BASE,
    credential_configuration_ids: ["PersonCredential"],
    grants: {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {
        "pre-authorized_code": code,
        user_pin_required: false,
      },
    },
  });
});
