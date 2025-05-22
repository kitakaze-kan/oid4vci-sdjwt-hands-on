import { Router } from "express";
import { issuePersonVc, Person, PersonType } from "../utils/sdjwt.js";
import { DisclosureFrame } from "@sd-jwt/types";
import { ISSUER_BASE } from "../../../commons/src/load-env.js";
import { jwtVerify, importJWK, JWK } from "jose";
import { didToJwk } from "../../../commons/src/didToJwk.js";
import { getSdJwtInstance } from "../../../commons/src/sdjwt.js";

export const credential = Router();

credential.post("/credential", async (req, res) => {
  console.log("credential req.body", JSON.stringify(req.body, null, 2));

  //本来はアクセストークンの検証も実施する
  if (req.headers.authorization !== `Bearer ${globalThis["ACCESS_TOKEN"]}`)
    return res.status(401).json({ error: "invalid_token" });

  /* ① PoP JWT が来ているか判定 */
  const proof = req.body?.proof;
  if (!proof || proof.proof_type !== "jwt") {
    return res.status(400).json({ error: "proof_required" });
  }

  /* ② JWT 署名を検証 */
  let holderJwk: JWK | undefined;
  try {
    /* issuer が期待する aud */
    const expectedAud = ISSUER_BASE;
    const { payload } = await jwtVerify(
      proof.jwt,
      async (header, jwt) => {
        /* --- ① 取得優先順 ─ jwk in header → cnf.jwk → did:key.kid --- */
        if (header.jwk) holderJwk = header.jwk as JWK;
        else if ((jwt.payload.cnf as any)?.jwk)
          holderJwk = (jwt.payload.cnf as any).jwk;
        else if (
          typeof header.kid === "string" &&
          header.kid.startsWith("did:")
        ) {
          holderJwk = await didToJwk(header.kid);
        } else {
          throw new Error("no holder key");
        }
        if (!holderJwk) throw new Error("no holder key");
        return importJWK(holderJwk, header.alg);
      },
      { audience: expectedAud }
    );
    console.log("[issuer] PoP verified from", payload.iss);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "invalid_proof" });
  }

  if (!holderJwk) {
    return res.status(400).json({ error: "no holder key" });
  }

  //本来はVCの内容をデータベース等から取得する
  const claims = Person.parse({
    given_name: "Alice",
    family_name: "Smith",
    birthDate: "1990-05-01",
    address: "Wonderland 1-2-3",
  });

  //選択的開示を可能にするプロパティを指定
  const disclosureFrame = {
    _sd: ["given_name", "family_name", "address", "birthDate"],
  } as DisclosureFrame<typeof claims>;

  /* ③ SD-JWT VC 発行時に cnf を埋め込む */
  const vc = await issuePersonVc<PersonType>(
    claims,
    disclosureFrame,
    proof.iss,
    holderJwk
  );

  console.log("vc", vc);

  /* ④ VC の検証(テスト用) */
  try {
    const sdjwt = await getSdJwtInstance();
    const { payload } = await sdjwt.verify(vc);
    console.log("payload", payload);
  } catch (error) {
    console.error(error);
  }

  res.json({
    format: "vc+sd-jwt",
    credential: vc,
  });
});
