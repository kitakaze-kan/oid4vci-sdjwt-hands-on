// issuer/utils/sdjwt.ts
import { DisclosureFrame, Extensible } from "@sd-jwt/types";
import { getSdJwtInstance } from "../../../commons/src/sdjwt.js";
import { z } from "zod";
import { ISSUER_BASE } from "../../../commons/src/load-env.js";
import { JWK } from "jose";
import { getPublicJwk } from "../../../commons/src/jwk.js";

export type PersonType = {
  given_name: string;
  family_name: string;
  birthDate: string;
  address: string;
  isOver20: boolean;
};
export const Person = z.object({
  given_name: z.string(),
  family_name: z.string(),
  birthDate: z.string(),
  address: z.string(),
  isOver20: z.boolean(),
});

export async function issuePersonVc<T extends Extensible>(
  claims: T,
  disclosureFrame: DisclosureFrame<T>,
  holderDid: string,
  holderJwk: JWK
) {
  const jwk = await getPublicJwk();
  const header = {
    typ: "vc+sd-jwt",
    alg: "ES256",
    jwk: jwk, //本来は不要だがsphereon walletのために追加
  };
  const sdjwt = await getSdJwtInstance();
  return sdjwt.issue(
    {
      iss: ISSUER_BASE,
      iat: Math.floor(Date.now() / 1000),
      vct: "PersonCredential",
      sub: holderDid,
      ...claims,
      cnf: { jwk: holderJwk },
    },
    disclosureFrame,
    { header }
  );
}
