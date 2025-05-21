# OID4VCI + OID4VP Hands‑On (SD‑JWT / Key‑Binding)

---

## 1. 前提ソフトウェア

| tool          | 最低バージョン | 確認コマンド    |
| ------------- | -------------- | --------------- |
| Node.js (LTS) | ≥ 20           | `node -v`       |
| pnpm          | ≥ 8            | `pnpm -v`       |
| git           | any            | `git --version` |
| ngrok         | (任意)         | `ngrok version` |

> **Mac** は `brew install node pnpm ngrok` で揃います。Windows／Linux は各公式手順を参照。

---

## 2. クローン & インストール

```bash
# 1️⃣ レポを取得
$ git clone https://github.com/your‑org/oid4vci-sdjwt-hands-on.git
$ cd oid4vci-sdjwt-hands-on

# 2️⃣ 依存を一括インストール
$ pnpm install
```

---

## 3. 環境変数

ルートに `.env` を 1 枚作成します。サンプル:

```dotenv
# 外からアクセスさせる公開 URL (ngrok 後で上書き)
PUBLIC_HOST=https://example.ngrok-free.app

# Gateway ローカルポート
GATEWAY_PORT=3000

# サブパス
ISSUER_PREFIX=/
VERIFIER_PREFIX=/verifier

# 個別起動用ポート (Gateway を使わない場合のみ)
ISSUER_PORT=3000
VERIFIER_PORT=3001
```

> **ngrok ドメイン** はトンネルを張ったあとに `PUBLIC_HOST` に貼り付けてください。

---

## 4. 鍵ペア生成

```bash
# 生成された PEM は packages/commons/keys/ に保存されます
$ pnpm gen:keys
```

---

## 5. 起動方法

```bash
$ ngrok http 3000
$ pnpm gateway:dev        # issuer + verifier を Gateway にマウント (3000)
```

アクセス:

- Issuer UI `<PUBLIC_HOST>/`
- Verifier UI `<PUBLIC_HOST>/verifier/`

---

## 6. フロー概要

1. **Issuer UI** で QR を表示
   `credential_offer_uri` に pre‑authorized code が埋め込まれています。
2. **Wallet** が QR を読み取り → `/issuer/.well-known/openid-credential-issuer` を取得。
3. Wallet → `/issuer/token` (grant_type=pre‑authorized_code)
4. Wallet → `/issuer/credential` (PoP 付き)

5. VC 取得後、**Verifier UI** の QR を読み取り → VP 送信。
6. Verifier が SD‑JWT と KB‑JWT を検証し結果を表示。

---

## 7. 主要コマンド

| コマンド           | 意味                          |
| ------------------ | ----------------------------- |
| `pnpm gen:keys`    | P‑256 鍵ペアを PEM/JWK で生成 |
| `pnpm gateway:dev` | Gateway (3000) + Watch reload |

---
