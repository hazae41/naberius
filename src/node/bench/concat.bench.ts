import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, pack_right, unpack } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

/**
 * The goal here is to concat a header of bits (whose length is not multiple of 8) to a body of bytes
 */

const samples = 10_000

const body = new Uint8Array(256)
crypto.getRandomValues(body)

const resultWasm = benchSync("wasm", () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])
  const bodyUnpacked = unpack(body)

  const fullUnpacked = new Uint8Array(header.length + bodyUnpacked.length)
  fullUnpacked.set(header, 0)
  fullUnpacked.set(bodyUnpacked, header.length)

  const fullPacked = pack_right(fullUnpacked)
}, { samples })

const resultJs = benchSync("js (array)", () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])

  const bodyUnpacked = new Uint8Array(body.length * 8)

  for (let j = 0; j < body.length; j++)
    for (let i = 0; i < 8; ++i)
      bodyUnpacked[(j * 8) + i] = (body[j] >> (8 - i - 1)) & 1;

  const fullUnpacked = new Uint8Array(header.length + bodyUnpacked.length)
  fullUnpacked.set(header, 0)
  fullUnpacked.set(bodyUnpacked, header.length)

  const fullPacked = new Uint8Array(Math.ceil(fullUnpacked.length / 8))

  for (let i = 0; i < fullUnpacked.length; i += 8) {
    const chunk = fullUnpacked.slice(i, Math.min(i + 8, fullUnpacked.length));

    let chunk2: Uint8Array
    if (chunk.length === 8)
      chunk2 = chunk
    else {
      chunk2 = new Uint8Array(8)
      chunk2.set(chunk, 0)
    }

    fullPacked[i / 8] = chunk2.reduce((res, x) => res << 1 | x)
  }
}, { samples })

const resultJs2 = benchSync("js (string)", () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])

  let fullString = ""
  header.forEach(x => fullString += x.toString(2))
  body.forEach(x => fullString += x.toString(2).padStart(8, "0"))

  const fullPacked = new Uint8Array(Math.ceil(fullString.length / 8))

  for (let i = 0; i < fullString.length; i += 8) {
    const chunk = fullString.slice(i, Math.min(i + 8, fullString.length));
    fullPacked[i / 8] = parseInt(chunk.padEnd(8, "0"), 2)
  }
}, { samples })

console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs)} times faster than ${resultJs.message}`)
console.log(`${resultWasm.message} is ${resultWasm.ratio(resultJs2)} times faster than ${resultJs2.message}`)