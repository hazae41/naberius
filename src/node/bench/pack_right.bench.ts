import { Box, Copied } from "@hazae41/box";
import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, pack_right, unpack } from "mods/index.js";
import { cpus } from "os";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 10_000

const packed = new Uint8Array(1025)
crypto.getRandomValues(packed)
const packedBox = new Box(new Copied(packed))

const unpacked = unpack(packedBox).bytes.slice(0, -4)
const unpackedBox = new Box(new Copied(unpacked))

let unpackedString = ""

unpacked.forEach(x => unpackedString += x.toString())

const resultWasm = benchSync("wasm", () => {
  pack_right(unpackedBox).free()
}, { samples })

const resultJsArray = benchSync("js (array)", () => {
  const length = Math.ceil(unpacked.length / 8)
  const repacked = new Uint8Array(length)

  const padder = new Uint8Array(8)

  for (let i = 0; i < unpacked.length; i += 8) {
    const end = Math.min(i + 8, unpacked.length)
    const chunk = unpacked.subarray(i, end).slice();

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
}, { samples })

const resultJsString = benchSync("js (string)", () => {
  const length = Math.ceil(unpackedString.length / 8)
  const repacked = new Uint8Array(length)

  for (let i = 0; i < unpackedString.length; i += 8) {
    const end = Math.min(i + 8, unpackedString.length)
    const chunk = unpackedString.slice(i, end);
    repacked[i / 8] = parseInt(chunk.padEnd(8, "0"), 2)
  }
}, { samples })

console.info(`cpu:`, cpus()[0].model)
console.info(`runtime:`, `node ${process.version} (${process.arch}-${process.platform})`)
console.info()

resultWasm.tableAndSummary(resultJsArray, resultJsString)