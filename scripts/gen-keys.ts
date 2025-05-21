import { generateKeyPairSync } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "packages", "commons", "keys");
mkdirSync(dir, { recursive: true });

const { publicKey, privateKey } = generateKeyPairSync("ec", {
  namedCurve: "P-256",
});

writeFileSync(
  join(dir, "issuer-key.pem"),
  privateKey.export({ type: "pkcs8", format: "pem" })
);
writeFileSync(
  join(dir, "issuer-pub.pem"),
  publicKey.export({ type: "spki", format: "pem" })
);

console.log("✔  issuer-key.pem / issuer-pub.pem generated");
