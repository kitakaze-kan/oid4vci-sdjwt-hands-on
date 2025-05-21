import { ISSUER_BASE } from "../../../commons/src/load-env.js";

const preAuthCodes = new Set<string>();

export const savePreAuthCode = (c: string) => preAuthCodes.add(c);
export const isValidPreAuthCode = (c: string) => preAuthCodes.has(c);
export const redeemPreAuthCode = (c: string) => preAuthCodes.delete(c);

export const buildCredentialOfferUri = (code: string) => {
  const inner = `${ISSUER_BASE}/credential-offer/${code}`;
  return `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
    inner
  )}`;
};
