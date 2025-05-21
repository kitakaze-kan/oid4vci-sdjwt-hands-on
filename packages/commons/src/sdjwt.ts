// packages/commons/src/sdjwt.ts
import { SDJwtVcInstance } from "@sd-jwt/sd-jwt-vc";
import { ES256, digest, generateSalt } from "@sd-jwt/crypto-nodejs";
import { getJWK } from "./jwk";
import { JwtPayload, KbVerifier } from "@sd-jwt/types";
import { subtle } from "node:crypto";

const createSignerVerifier = async () => {
  const { privateKey, publicKey } = await getJWK();
  return {
    signer: await ES256.getSigner(privateKey),
    verifier: await ES256.getVerifier(publicKey),
  };
};

export const getKbVerifier = (): KbVerifier => {
  return async (data: string, sig: string, payload: JwtPayload) => {
    const publicKeyJWK = payload.cnf?.jwk;
    if (!publicKeyJWK) throw new Error("no holder's public key");
    const publicKey = await subtle.importKey(
      "jwk",
      publicKeyJWK,
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      true,
      ["verify"]
    );
    const encoder = new TextEncoder();
    const signature = Uint8Array.from(
      atob(sig.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );
    const isValid = await subtle.verify(
      {
        name: "ECDSA",
        hash: { name: "sha-256" },
      },
      publicKey,
      signature,
      encoder.encode(data)
    );

    return isValid;
  };
};

export const getSdJwtInstance = async () => {
  const { signer, verifier } = await createSignerVerifier();
  return new SDJwtVcInstance({
    signer,
    signAlg: ES256.alg,
    verifier,
    hasher: digest,
    hashAlg: "sha-256",
    saltGenerator: generateSalt,
    kbVerifier: getKbVerifier(),
    kbSignAlg: ES256.alg,
  });
};
