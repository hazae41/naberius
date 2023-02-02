import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, unpack } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 10_000

const packed = new Uint8Array(256)
crypto.getRandomValues(packed)

const resultWasm = benchSync("wasm", () => {
  const unpacked = unpack(packed)

  const result = unpacked.subarray(3, 5).reduce((res, x) => res << 1 | x)
  const result2 = unpacked.subarray(3 + 8, 5 + 8).reduce((res, x) => res << 1 | x)
  const result3 = unpacked.subarray(3 + (2 * 8), 5 + (2 * 8)).reduce((res, x) => res << 1 | x)
  const result4 = unpacked.subarray(3 + (3 * 8), 5 + (3 * 8)).reduce((res, x) => res << 1 | x)

  const x = result + result2 + result3 + result4

  // assert(result === 3)
}, { samples })

const resultJs = benchSync("js (array)", () => {
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
}, { samples })

const resultJs2 = benchSync("js (string)", () => {
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
}, { samples })

console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs)} times faster than ${resultJs.message}`)
console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs2)} times faster than ${resultJs2.message}`)