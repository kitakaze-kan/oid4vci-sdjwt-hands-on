import { Router } from "express";

export const check = Router();

// 結果を保存するための一時的なストレージ
let verificationResult: any = null;

// 結果を保存する関数
export const saveVerificationResult = (result: any) => {
  verificationResult = result;
};

// 結果を取得するエンドポイント
check.get("/check-result", (_req, res) => {
  if (verificationResult) {
    res.json({ hasResult: true, result: verificationResult });
    // 結果を表示したらクリア
    verificationResult = null;
  } else {
    res.json({ hasResult: false });
  }
});
