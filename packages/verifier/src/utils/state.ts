import { randomUUID } from "crypto";
import { VERIFIER_BASE } from "../../../commons/src/load-env.js";
import { JWK } from "jose";

export interface PD {
  id: string;
  input_descriptors: any[];
  [k: string]: unknown;
}

interface Stored {
  pd: PD;
  nonce: string;
  requestObj: any;
  response_uri?: string;
  redirect_uri?: string;
}
const STATE = new Map<string, Stored>();
const REQOBJ = new Map<string, string>();

/* ── Presentation Definition ─────────────────────── */
// https://openid.net/specs/openid-4-verifiable-presentations-1_0-ID2.html
// The formats supported by a Verifier may be set up using the metadata parameter vp_formats (see Section 9.1). The Wallet MUST ignore any format property inside a presentation_definition object if that format was not included in the vp_formats property of the metadata.
// Note: When a Verifier is requesting the presentation of a Verifiable Presentation containing a Verifiable Credential, the Verifier MUST indicate in the vp_formats parameter the supported formats of both Verifiable Credential and Verifiable Presentation.
export const PD: PD = {
  id: "PersonCredential_PD",
  purpose: "proof of personhood",
  input_descriptors: [
    {
      id: "PersonCredential_PD_1",
      name: "PersonCredential",
      format: {
        // jwt_vp: { alg: ["ES256"] },
        // jwt_vc: { alg: ["ES256"] },
        "vc+sd-jwt": {
          "sd-jwt_alg_values": ["ES256", "ES256K"],
          "kb-jwt_alg_values": ["ES256", "ES256K"],
        },
      },
      purpose: "proof of personhood",
      constraints: {
        limit_disclosure: "required",
        fields: [
          {
            path: ["$.vct"],
            filter: {
              type: "string",
              pattern: "PersonCredential",
            },
          },
          {
            path: ["$.given_name"],
          },
          {
            path: ["$.family_name"],
          },
          {
            path: ["$.address"],
          },
        ],
      },
    },
  ],
};
//手動で上と合わせる必要あり
export const requiredFields = ["given_name", "family_name", "address"];

export const requestObj = {
  client_id: `${VERIFIER_BASE}/callback`,
  response_uri: `${VERIFIER_BASE}/callback`,
  client_id_scheme: "redirect_uri",
  response_type: "vp_token",
  response_mode: "direct_post",
  client_metadata: {
    id_token_signing_alg_values_supported: ["EdDSA", "ES256", "ES256K"],
    request_object_signing_alg_values_supported: ["EdDSA", "ES256", "ES256K"],
    response_types_supported: ["id_token", "vp_token"],
    scopes_supported: ["openid did_authn"],
    subject_types_supported: ["pairwise"],
    subject_syntax_types_supported: ["did:jwk"],
    vp_formats: {
      //   jwt_vc: {
      //     alg: ["ES256", "ES256K", "EdDSA"],
      //   },
      //   jwt_vp: {
      //     alg: ["ES256", "ES256K", "EdDSA"],
      //   },
      "vc+sd-jwt": {
        "sd-jwt_alg_values": ["ES256", "ES256K"],
        "kb-jwt_alg_values": ["ES256", "ES256K"],
      },
    },
  },
  presentation_definition: PD,
};

export const generateRequestObj = async (
  state: string,
  nonce: string,
  jwk: JWK
) => {
  return {
    ...requestObj,
    client_metadata: {
      ...requestObj.client_metadata,
      jwks: [jwk],
    },
    nonce,
    state,
  };
};

export function saveAuthRequest(
  state: string,
  nonce: string,
  obj: any
): string {
  const id = randomUUID();
  STATE.set(state, {
    pd: PD,
    nonce,
    requestObj: obj,
    response_uri: obj.response_uri,
    redirect_uri: obj.redirect_uri,
  });
  REQOBJ.set(id, obj);
  return id;
}

export function getAuthRequest(state: string): Stored | undefined {
  return STATE.get(state);
}

export function getRequestObj(id: string): any {
  return REQOBJ.get(id);
}
