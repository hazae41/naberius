export * from "../../../wasm/pkg/naberius.js";

// @deno-types="../../../wasm/pkg/naberius.d.ts"
import { __wbg_init, InitOutput } from "../../../wasm/pkg/naberius.js";
import { data } from "../../../wasm/pkg/naberius.wasm.js";

let output: InitOutput | undefined = undefined

export async function initBundledOnce() {
  return output ??= await __wbg_init(data)
}