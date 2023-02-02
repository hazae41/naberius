import { initBundledOnce, pack_right, unpack } from "../mod.ts";

await initBundledOnce()

const group = "pack_right"

const packed = new Uint8Array(1025)
crypto.getRandomValues(packed)

const unpacked = unpack(packed).subarray(0, -4)

let unpackedString = ""

unpacked.forEach(x => unpackedString += x.toString())

Deno.bench("wasm", { group, baseline: true }, () => {
  pack_right(unpacked)
})

Deno.bench("js (array)", { group }, () => {
  const length = Math.ceil(unpacked.length / 8)
  const repacked = new Uint8Array(length)

  const padder = new Uint8Array(8)

  for (let i = 0; i < unpacked.length; i += 8) {
    const end = Math.min(i + 8, unpacked.length)
    const chunk = unpacked.slice(i, end);

    let chunk2: Uint8Array

    if (chunk.length === 8)
      chunk2 = chunk
    else {
      chunk2 = padder
      padder.set(chunk, 0)
      padder.fill(0, chunk.length)
    }

    repacked[i / 8] = chunk2.reduce((res, x) => res << 1 | x)
  }
})

Deno.bench("js (string)", { group }, () => {
  const length = Math.ceil(unpackedString.length / 8)
  const repacked = new Uint8Array(length)

  for (let i = 0; i < unpackedString.length; i += 8) {
    const length = Math.min(i + 8, unpackedString.length)
    const chunk = unpackedString.slice(i, length);
    repacked[i / 8] = parseInt(chunk.padEnd(8, "0"), 2)
  }
})