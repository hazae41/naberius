import "npm:@hazae41/symbol-dispose-polyfill";

import { Memory, initBundledOnce, xor_mod } from "../mod.ts";

await initBundledOnce()

const group = "xor_mod"

const bytes = new Uint8Array(1024)
crypto.getRandomValues(bytes)
const mbytes = new Memory(bytes)

const mask = new Uint8Array(4)
crypto.getRandomValues(mask)
const mmask = new Memory(mask)

Deno.bench("wasm", { group, baseline: true }, () => {
  xor_mod(mbytes, mmask)
})

Deno.bench("js", { group }, () => {
  for (let i = 0; i < bytes.length; ++i)
    bytes[i] = bytes[i] ^ mask[i % mask.length]
})