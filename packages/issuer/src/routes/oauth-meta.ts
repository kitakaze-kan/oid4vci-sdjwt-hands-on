import { Router } from "express";
import { ISSUER_BASE } from "../../../commons/src/load-env.js";

export const oauthMeta = Router();

oauthMeta.get("/.well-known/oauth-authorization-server", (_req, res) => {
  res.json({
    issuer: ISSUER_BASE,
    authorization_endpoint: `${ISSUER_BASE}/authorize`,
    token_endpoint: `${ISSUER_BASE}/token`,
    jwks_uri: `${ISSUER_BASE}/.well-known/jwks.json`,
    registration_endpoint: `${ISSUER_BASE}/register`,
    scopes_supported: ["openid", "profile", "email"],
  });
});
