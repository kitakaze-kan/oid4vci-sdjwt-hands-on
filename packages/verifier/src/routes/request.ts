import { Router } from "express";
import { randomUUID } from "crypto";
import { stringify } from "querystring";
import { generateRequestObj, saveAuthRequest } from "../utils/state.js";
import { VERIFIER_BASE } from "../../../commons/src/load-env.js";
import { createQR } from "../utils/qr.js";
import { getPublicJwk } from "../../../commons/src/jwk.js";

export const request = Router();

// 結果を保存するための一時的なストレージ
let verificationResult: any = null;

// 結果を保存する関数
export const saveVerificationResult = (result: any) => {
  verificationResult = result;
};

// 結果を取得するエンドポイント
request.get("/check-result", (_req, res) => {
  if (verificationResult) {
    res.json({ hasResult: true, result: verificationResult });
    // 結果を表示したらクリア
    verificationResult = null;
  } else {
    res.json({ hasResult: false });
  }
});

request.get("/", async (_req, res) => {
  const state = randomUUID();
  const nonce = randomUUID();
  const jwk = await getPublicJwk();

  /* Request Object (JSON) */
  const requestObj = await generateRequestObj(state, nonce, jwk);
  const requestObjId = saveAuthRequest(state, nonce, requestObj); // returns UUID

  const deepLink = stringify({
    request_uri: `${VERIFIER_BASE}/request-obj/${requestObjId}`,
  });

  const uri = "openid4vp://?" + deepLink;

  const qrSvg = await createQR(uri);
  res.render("index", { qrSvg, link: uri });
});
