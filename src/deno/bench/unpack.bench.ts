import { initBundledOnce, unpack } from "../mod.ts";

await initBundledOnce()

const group = "unpack"

const packed = new Uint8Array(1024)
crypto.getRandomValues(packed)

Deno.bench("wasm", { group, baseline: true }, () => {
  unpack(packed).free()
})

Deno.bench("js (array)", { group }, () => {
  const unpacked = new Uint8Array(packed.length * 8)

  for (let j = 0; j < packed.length; j++)
    for (let i = 0; i < 8; ++i)
      unpacked[(j * 8) + i] = (packed[j] >> (8 - i - 1)) & 1;
})

Deno.bench("js (string)", { group }, () => {
  let unpacked = ""

  for (const x of packed)
    unpacked += x.toString(2).padStart(8, "0")
})
