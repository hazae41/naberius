import { initBundledOnce, unpack } from "../mod.ts";

await initBundledOnce()

const group = "number"

const packed = new Uint8Array(1024)
crypto.getRandomValues(packed)

Deno.bench("wasm", { group, baseline: true }, () => {
  const unpacked = unpack(packed)

  const result = unpacked.subarray(3, 5).reduce((res, x) => res << 1 | x)
  const result2 = unpacked.subarray(3 + 8, 5 + 8).reduce((res, x) => res << 1 | x)
  const result3 = unpacked.subarray(3 + (2 * 8), 5 + (2 * 8)).reduce((res, x) => res << 1 | x)
  const result4 = unpacked.subarray(3 + (3 * 8), 5 + (3 * 8)).reduce((res, x) => res << 1 | x)

  const x = result + result2 + result3 + result4

  // assert(result === 3)
})

Deno.bench("js (array)", { group }, () => {
  const unpacked = new Uint8Array(packed.length * 8)

  for (let j = 0; j < packed.length; j++)
    for (let i = 0; i < 8; ++i)
      unpacked[(j * 8) + i] = (packed[j] >> (8 - i - 1)) & 1;

  const result = unpacked.subarray(3, 5).reduce((res, x) => res << 1 | x)
  const result2 = unpacked.subarray(3 + 8, 5 + 8).reduce((res, x) => res << 1 | x)
  const result3 = unpacked.subarray(3 + (2 * 8), 5 + (2 * 8)).reduce((res, x) => res << 1 | x)
  const result4 = unpacked.subarray(3 + (3 * 8), 5 + (3 * 8)).reduce((res, x) => res << 1 | x)

  const x = result + result2 + result3 + result4

  // assert(result === 3)
})

Deno.bench("js (string)", { group }, () => {
  let unpacked = ""

  for (const byte of packed)
    for (let i = 0; i < 8; ++i)
      unpacked += byte.toString(2).padStart(8, "0");

  const result = parseInt(unpacked.slice(3, 5), 2)
  const result2 = parseInt(unpacked.slice(3 + 8, 5 + 8), 2)
  const result3 = parseInt(unpacked.slice(3 + (2 * 8), 5 + (2 * 8)), 2)
  const result4 = parseInt(unpacked.slice(3 + (3 * 8), 5 + (3 * 8)), 2)

  const x = result + result2 + result3 + result4

  // assert(result === 3)
})