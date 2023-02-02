export * from "../../../wasm/pkg/pack.js";

import { init, InitOutput, initSync } from "../../../wasm/pkg/pack.js";
import { wasm } from "../../../wasm/pkg/pack.wasm.js";

let output: InitOutput | undefined = undefined

export function initSyncBundledOnce() {
  return output ??= initSync(Buffer.from(wasm, "base64"))
}

export async function initBundledOnce() {
  return output ??= await init(Buffer.from(wasm, "base64"))
}