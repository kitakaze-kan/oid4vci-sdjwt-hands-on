## ハンズオン勉強会プラン

_前提：座学（概念・仕様）は済み。_

---

### 全体構成

| 回        | 時間   | ゴール                                                                                                |
| --------- | ------ | ----------------------------------------------------------------------------------------------------- |
| **Day 1** | 90 min | **Issuer〜Gateway** <br>SD-JWT VC 発行フローを分解し、OID4VCI／SD-JWT の内部構造を理解する            |
| **Day 2** | 90 min | **Verifier** <br>PEX v2 + direct_post 検証フローを追体験し、OID4VP / Presentation Exchange を理解する |

---

## セットアップ

```bash
git clone <repo> && cd oid4vci-sdjwt-hands-on
pnpm install
cp .env.example .env               # PUBLIC_HOST を各自 ngrok 等に合わせて編集
pnpm gen:keys
pnpm dev                           # Gateway on :3000
```

動作チェック

- `https://<PUBLIC_HOST>/` で QR が表示される
- Wallet でスキャン → VC が取得できる

---

## Day 1 ― Issuer & SD-JWT

| #   | 内容                                                                                                                                   |     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | --- |
| #1  | **オリエンテーション**                                                                                                                 |     |
| #2  | **コードリーディング**：`packages/issuer/src/routes` をブレイクアウトで読み解く（pre-auth → (retrieve metadata) → token → credential） |     |
| #3  | **Metadata 確認**                                                                                                                      |
| #4  | **ハンズオン：選択的開示 を改造**<br> _タスク_：`credential.ts` を編集し VC 選択的開示範囲を変更                                       |     |
| #5  | **ラップアップ・質疑**                                                                                                                 |     |
| #6  | **次回予告**（Verifier 編）                                                                                                            |     |

---

## Day 2 ― Verifier & PEX + direct_post

| #   | 内容                                                                                                       |
| --- | ---------------------------------------------------------------------------------------------------------- | --- |
| #1  | 前回のおさらい                                                                                             |
| #2  | **コードリーディング**：`routes/*` を確認                                                                  |
| #3  | **Request Object デコード**：\`curl {request_uri}`                                                         |
| #4  | **ハンズオン：Presentation Definition 不一致を再現**<br> _タスク_：`PD.type` を `StudentCredential` に変更 |     |
| #5  | **ラップアップ・質疑**                                                                                     |     |
| #6  | まとめ                                                                                                     |

---

### 追加課題（時間が余れば）

- Status List
- DCQL
- 最新の OID4VCI / OID4VP のキャッチアップ

参加者は 2 回終了時に **「発行 → 提示 → 検証をカスタマイズしながら一周できる」** スキルを獲得します。
