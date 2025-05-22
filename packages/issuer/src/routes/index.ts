import { Router } from "express";
import { v4 as uuid } from "uuid";
import { buildCredentialOfferUri, savePreAuthCode } from "../utils/offer.js";
import { createQR } from "../utils/qr.js";

export const index = Router();

index.get("/", async (_req, res) => {
  const preAuthCode = uuid().replace(/-/g, ""); //preAuthCodeを生成
  savePreAuthCode(preAuthCode);
  console.log("preAuthCode: ", preAuthCode);

  const uri = buildCredentialOfferUri(preAuthCode);
  const qrSvg = await createQR(uri);

  res.render("index", { qrSvg, offerUri: uri });
});
