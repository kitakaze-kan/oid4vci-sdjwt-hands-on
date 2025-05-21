import { readFileSync } from "fs";
import { dirname, join } from "node:path";
import { JWK, SignJWT } from "jose";
import { fileURLToPath } from "node:url";
import { createPrivateKey, createPublicKey } from "crypto";
import { subtle } from "node:crypto";

export async function getPublicJwk(): Promise<JWK> {
  const { publicKey } = await getJWK();

  /* alg を付与（省略可だが明示） */
  publicKey.alg = "ES256";
  const { key_ops, ext, ...jwk } = publicKey;

  return jwk;
}

export async function getJWK() {
  /* ── 0.秘密鍵／公開鍵 ─────────────────────── */
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const keyDir = join(__dirname, "..", "keys");
  const privPem = readFileSync(join(keyDir, "issuer-key.pem"), "utf8");
  const pubPem = readFileSync(join(keyDir, "issuer-pub.pem"), "utf8");

  // ── 1. PEM → KeyObject ───────────────────────────
  const privKeyObj = createPrivateKey(privPem);
  const pubKeyObj = createPublicKey(pubPem);

  // ── 2. KeyObject → CryptoKey ─────────────────────
  const privCryptoKey = await subtle.importKey(
    "pkcs8",
    privKeyObj.export({ format: "der", type: "pkcs8" }),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"]
  );

  const pubCryptoKey = await subtle.importKey(
    "spki",
    pubKeyObj.export({ format: "der", type: "spki" }),
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["verify"]
  );

  // ── 3. CryptoKey → JsonWebKey ────────────────────
  const privJwk = await subtle.exportKey("jwk", privCryptoKey);
  const pubJwk = await subtle.exportKey("jwk", pubCryptoKey);

  return {
    privateKey: privJwk,
    publicKey: pubJwk,
  };
}

export async function createJWT(payload: any) {
  // PEMからJWKに変換
  const { privateKey, publicKey } = await getJWK();
  const { key_ops, ext, ...jwk } = publicKey;

  // JWTを生成
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "ES256", typ: "JWT", jwk: jwk })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  return jwt;
}
