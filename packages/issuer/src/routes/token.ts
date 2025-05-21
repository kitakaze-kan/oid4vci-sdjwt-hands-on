import { Router } from "express";
import { v4 as uuid } from "uuid";
import { redeemPreAuthCode } from "../utils/offer.js";

export const token = Router();

token.post("/token", (req, res) => {
  console.log("req.body", JSON.stringify(req.body, null, 2));
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ error: "invalid_request", detail: "empty body" });
  }
  const { grant_type, "pre-authorized_code": code } = req.body;

  if (grant_type !== "urn:ietf:params:oauth:grant-type:pre-authorized_code")
    return res.status(400).json({ error: "unsupported_grant_type" });

  if (!redeemPreAuthCode(code))
    return res.status(400).json({ error: "invalid_pre_authorized_code" });

  const accessToken = uuid();
  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 600,
    c_nonce_expires_in: 600,
    c_nonce: "1234567890",
  });

  // メモリに保持（超簡易）
  globalThis["ACCESS_TOKEN"] = accessToken;
});
