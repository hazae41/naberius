import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, pack_right, unpack } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 10_000

const packed = new Uint8Array(1025)
crypto.getRandomValues(packed)

const unpacked = unpack(packed).subarray(0, -4)

let unpackedString = ""

unpacked.forEach(x => unpackedString += x.toString())

const resultWasm = benchSync("wasm", () => {
  pack_right(unpacked)
}, { samples })

const resultJsArray = benchSync("js (array)", () => {
  const repacked = new Uint8Array(Math.ceil(unpacked.length / 8))

  for (let i = 0; i < unpacked.length; i += 8) {
    const chunk = unpacked.slice(i, Math.min(i + 8, unpacked.length));

    let chunk2: Uint8Array

    if (chunk.length === 8)
      chunk2 = chunk
    else {
      chunk2 = new Uint8Array(8)
      chunk2.set(chunk, 0)
    }

    repacked[i / 8] = chunk2.reduce((res, x) => res << 1 | x)
  }
}, { samples })

const resultJsString = benchSync("js (string)", () => {
  const repacked = new Uint8Array(Math.ceil(unpackedString.length / 8))

  for (let i = 0; i < unpackedString.length; i += 8) {
    const length = Math.min(i + 8, unpackedString.length)
    const chunk = unpackedString.slice(i, length);
    repacked[i / 8] = parseInt(chunk.padEnd(8, "0"), 2)
  }
}, { samples })

console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJsArray)} times faster than ${resultJsArray.message}`)
console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJsString)} times faster than ${resultJsString.message}`)