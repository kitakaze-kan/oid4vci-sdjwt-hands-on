import { Router } from "express";
import { getSdJwtInstance } from "../../../commons/src/sdjwt.js";
import { saveVerificationResult } from "./request.js";
import { getAuthRequest, requiredFields } from "../utils/state.js";

export const callback = Router();

callback.post("/callback", async (req, res) => {
  try {
    const vp = req.body;
    if (!vp.vp_token || !vp.presentation_submission || !vp.state)
      return res
        .status(400)
        .send("missing vp_token/presentation_submission/state");

    console.log("vp", JSON.stringify(vp, null, 2));

    /** ───────────────────────────────────────
     *  1) state / nonce の照合
     * ─────────────────────────────────────── */
    const auth = getAuthRequest(vp.state);
    if (!auth) return res.status(400).send("state mismatch");

    /** ───────────────────────────────────────
     *  2) Presentation Exchange v2 検証: ただしこれはVCの検証ではなく、VCのフォーマットが正しいかどうかを検証するもの
     * ─────────────────────────────────────── */
    // const pex = new PEX();
    // const { value, errors } = pex.evaluatePresentation(auth.pd, vp as any);
    // console.log("value", JSON.stringify(value, null, 2));
    // console.log("errors", JSON.stringify(errors, null, 2));

    // if (errors && errors?.length > 0) {
    //   return res.status(400).json({
    //     ok: false,
    //     error: "presentation_definition_mismatch",
    //     detail: errors,
    //   });
    // }

    /** ───────────────────────────────────────
     *  3) SD-JWT VC + KB-JWT 検証
     * ─────────────────────────────────────── */
    const sdjwt = await getSdJwtInstance();
    // Presentation Exchange から取得した VC を抽出
    const sdJwtVcs: string[] = Array.isArray(vp.vp_token)
      ? vp.vp_token
      : [vp.vp_token];
    const results: any[] = [];
    console.log("sdJwtVcs", JSON.stringify(sdJwtVcs, null, 2));
    // すべての VC を SD-JWT ライブラリで検証
    for (const vc of sdJwtVcs) {
      const isValid = await sdjwt.verify(vc, requiredFields, true); // throws on error
      console.log("isValid", isValid);
      if (!isValid) {
        return res.status(400).json({
          ok: false,
          error: "invalid_vc",
        });
      } else {
        results.push(isValid);
      }
    }

    const result = {
      verified: true,
      results,
    };

    saveVerificationResult(result);

    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).send("verification failed");
  }
});
