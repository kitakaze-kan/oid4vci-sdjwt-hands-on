import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

/* どの階層から呼ばれても “repo ルートの .env” を読む */
const rootEnv = resolve(
  dirname(fileURLToPath(import.meta.url)), // …/commons/src
  "../../..", // → repo ルート
  ".env"
);

config({ path: rootEnv });

export const PUBLIC_HOST = process.env.PUBLIC_HOST!;
export const ISSUER_BASE = `${PUBLIC_HOST}`;
export const VERIFIER_BASE = `${PUBLIC_HOST}${
  process.env.VERIFIER_PREFIX ?? "/verifier"
}`;
