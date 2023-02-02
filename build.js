import { readFileSync, rmSync, writeFileSync } from "fs";

const wasm = readFileSync("./wasm/pkg/packer_bg.wasm");
writeFileSync(`./wasm/pkg/packer.wasm.js`, `export const wasm = "${wasm.toString("base64")}";`);
writeFileSync(`./wasm/pkg/packer.wasm.d.ts`, `export const wasm: string;`);

const script = readFileSync(`./wasm/pkg/packer.js`, "utf8")
  .replace("export { initSync }", "export { init, initSync }")
  .replace("input = new URL('packer_bg.wasm', import.meta.url);", "throw new Error();")

const typing = readFileSync(`./wasm/pkg/packer.d.ts`, "utf8")
  .replace("export default function init", "export function init")

writeFileSync(`./wasm/pkg/packer.js`, script)
writeFileSync(`./wasm/pkg/packer.d.ts`, typing)

rmSync(`./wasm/pkg/.gitignore`, { force: true });