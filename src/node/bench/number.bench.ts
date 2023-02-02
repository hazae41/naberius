import { bench } from "@hazae41/deimos";
import { initBundledOnce, pack_left, unpack } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 1_000_000

const resultWasm = await bench("wasm", async () => {
  const packed = new Uint8Array([0b00011000, 0b00011000, 0b00011000, 0b00011000, 0b00011000])
  const unpacked = unpack(packed)

  const repacked = pack_left(unpacked.subarray(3, 5))
  const result = new DataView(repacked.buffer).getUint8(0)

  const repacked2 = pack_left(unpacked.subarray(3, 5))
  const result2 = new DataView(repacked.buffer).getUint8(0)

  const repacked3 = pack_left(unpacked.subarray(3, 5))
  const result3 = new DataView(repacked.buffer).getUint8(0)

  // assert(result === 3)
}, { samples })

const resultJs = await bench("js (array)", async () => {
  const packed = new Uint8Array([0b00011000, 0b00011000, 0b00011000, 0b00011000, 0b00011000])
  const unpacked = new Uint8Array(packed.length * 8)

  for (let j = 0; j < packed.length; j++)
    for (let i = 0; i < 8; ++i)
      unpacked[(j * 8) + i] = (packed[j] >> (8 - i - 1)) & 1;

  const result = unpacked.subarray(3, 5).reduce((res, x) => res << 1 | x)
  const result2 = unpacked.subarray(3 + 8, 5 + 8).reduce((res, x) => res << 1 | x)
  const result3 = unpacked.subarray(3 + (2 * 8), 5 + (2 * 8)).reduce((res, x) => res << 1 | x)

  // assert(result === 3)
}, { samples })

const resultJs2 = await bench("js (string)", async () => {
  const packed = new Uint8Array([0b00011000, 0b00011000, 0b00011000, 0b00011000, 0b00011000])

  let unpacked = ""

  for (const byte of packed)
    for (let i = 0; i < 8; ++i)
      unpacked += byte.toString(2).padStart(8, "0");

  const result = parseInt(unpacked.slice(3, 5), 2)
  const result2 = parseInt(unpacked.slice(3 + 8, 5 + 8), 2)
  const result3 = parseInt(unpacked.slice(3 + (2 * 8), 5 + (2 * 8)), 2)

  // assert(result === 3)
}, { samples })

console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs)} times faster than ${resultJs.message}`)
console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs2)} times faster than ${resultJs2.message}`)