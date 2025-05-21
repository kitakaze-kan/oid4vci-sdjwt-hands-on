/* 標準ライブラリを使用したシンプルな実装 */
import { JWK } from "jose";
import { Resolver } from "did-resolver";
import { getResolver as keyResolver } from "@cef-ebsi/key-did-resolver";
import { getDidJwkResolver } from "@sphereon/ssi-sdk-ext.did-resolver-jwk";

// import * as transmuteDidKey from "@transmute/did-key.js";
// import { getResolver as keyResolver } from "key-did-resolver";

const resolver = new Resolver({
  ...keyResolver(),
  ...getDidJwkResolver(),
});

export async function didToJwk(did: string, alg?: string): Promise<JWK> {
  try {
    // DIDを解決
    const result = await resolver.resolve(did);

    if (!result || !result.didDocument) {
      throw new Error(`Failed to resolve DID: ${did}`);
    }

    // 検証メソッドを取得
    const verificationMethod = result.didDocument.verificationMethod || [];

    // 適切な検証メソッドを選択
    let selectedMethod = verificationMethod[0]; // デフォルト

    if (alg) {
      // アルゴリズムが指定されている場合は、それに適合するメソッドを探す
      const matchingMethod = verificationMethod.find((method) => {
        if (alg.toUpperCase() === "ES256" && method.type?.includes("P-256"))
          return true;
        if (alg.toUpperCase() === "EDDSA" && method.type?.includes("Ed25519"))
          return true;
        if (
          alg.toUpperCase() === "ES256K" &&
          method.type?.includes("Secp256k1")
        )
          return true;
        return false;
      });

      if (matchingMethod) {
        selectedMethod = matchingMethod;
      } else {
        console.warn(
          `No verification method matching algorithm ${alg} found, using default`
        );
      }
    }

    // JWKに変換
    const jwk: JWK = {
      kid: did,
      ...selectedMethod.publicKeyJwk,
    };

    // アルゴリズムが指定されていて、JWKに含まれていない場合は追加
    if (alg && !jwk.alg) {
      jwk.alg = alg;
    }

    console.log("jwk", jwk);

    return jwk;
  } catch (error) {
    throw new Error(`Failed to convert DID to JWK: ${error.message}`);
  }
}
