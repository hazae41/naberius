import { readFileSync, rmSync, writeFileSync } from "fs";

const wasm = readFileSync("./wasm/pkg/pack_bg.wasm");
writeFileSync(`./wasm/pkg/pack.wasm.js`, `export const wasm = "${wasm.toString("base64")}";`);
writeFileSync(`./wasm/pkg/pack.wasm.d.ts`, `export const wasm: string;`);

const script = readFileSync(`./wasm/pkg/pack.js`, "utf8")
  .replace("export { initSync }", "export { init, initSync }")
  .replace("input = new URL('pack_bg.wasm', import.meta.url);", "throw new Error();")

const typing = readFileSync(`./wasm/pkg/pack.d.ts`, "utf8")
  .replace("export default function init", "export function init")

writeFileSync(`./wasm/pkg/pack.js`, script)
writeFileSync(`./wasm/pkg/pack.d.ts`, typing)

rmSync(`./wasm/pkg/.gitignore`, { force: true });