import { readFileSync, rmSync, writeFileSync } from "fs";

const wasm = readFileSync("./wasm/pkg/naberius_bg.wasm");
writeFileSync(`./wasm/pkg/naberius.wasm.js`, `export const wasm = "${wasm.toString("base64")}";`);
writeFileSync(`./wasm/pkg/naberius.wasm.d.ts`, `export const wasm: string;`);

const script = readFileSync(`./wasm/pkg/naberius.js`, "utf8")
  .replace("input = new URL('naberius_bg.wasm', import.meta.url);", "throw new Error();")

const typing = readFileSync(`./wasm/pkg/naberius.d.ts`, "utf8")
  .replace("export default function init", "export function init")

writeFileSync(`./wasm/pkg/naberius.js`, script)
writeFileSync(`./wasm/pkg/naberius.d.ts`, typing)

rmSync(`./wasm/pkg/.gitignore`, { force: true });