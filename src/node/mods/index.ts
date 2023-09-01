export * from "../../../wasm/pkg/naberius.js";

import { InitOutput, __wbg_init } from "../../../wasm/pkg/naberius.js";
import { data } from "../../../wasm/pkg/naberius.wasm.js";

let output: InitOutput | undefined = undefined

export async function initBundledOnce() {
  return output ??= await __wbg_init(data)
}