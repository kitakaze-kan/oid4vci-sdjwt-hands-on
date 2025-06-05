import { Router } from "express";
import { ISSUER_BASE } from "../../../commons/src/load-env.js";

export const metadata = Router();

metadata.get("/.well-known/openid-credential-issuer", (_req, res) => {
  res.json({
    credential_issuer: ISSUER_BASE,
    credential_endpoint: `${ISSUER_BASE}/credential`,
    token_endpoint: `${ISSUER_BASE}/token`,
    authorization_servers: [ISSUER_BASE],
    display: [
      {
        name: "Demo Issuer",
      },
    ],
    credential_configurations_supported: {
      PersonCredential: {
        vct: "PersonCredential",
        format: "vc+sd-jwt",
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["ES256", "EdDSA"],
          },
        },
        display: [
          {
            name: "Demo Credential",
            description: "Demo Credential for demo purposes.",
            text_color: "#FFFFFF",
            background_image: {
              url: "https://vess-storage.s3.ap-northeast-1.amazonaws.com/Sample_VC_Ticket.png",
              alt_text: "VESS Demo Credential Image",
            },
            logo: {
              url: "https://app.vess.id/VESS_app_icon.png",
              alt_text: "VESS logo",
            },
          },
        ],
        claims: {
          given_name: {
            display: [
              {
                name: "名前",
                locale: "ja-JP",
              },
              {
                name: "Given Name",
                locale: "en-US",
              },
            ],
          },
          family_name: {
            display: [
              {
                name: "苗字",
                locale: "ja-JP",
              },
              {
                name: "Family Name",
                locale: "en-US",
              },
            ],
          },
          birthDate: {
            display: [
              {
                name: "生年月日",
                locale: "ja-JP",
              },
              {
                name: "Birth Date",
                locale: "en-US",
              },
            ],
          },
          address: {
            display: [
              {
                name: "住所",
                locale: "ja-JP",
              },
              {
                name: "Address",
                locale: "en-US",
              },
            ],
          },
          isOver20: {
            display: [
              {
                name: "20歳以上",
                locale: "ja-JP",
              },
              {
                name: "Over 20",
                locale: "en-US",
              },
            ],
          },
        },
      },
    },
  });
});
