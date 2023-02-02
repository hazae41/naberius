import { bench } from "@hazae41/deimos";
import { initBundledOnce, pack_right, unpack } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

/**
 * The goal here is to concat a header of bits (whose length is not multiple of 8) to a body of bytes
 */

const samples = 1_000_000

const resultWasm = await bench("wasm", async () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])
  const body = unpack(new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]))

  const full = new Uint8Array(header.length + body.length)
  full.set(header, 0)
  full.set(body, header.length)

  const packed = pack_right(full)
}, { samples })

const resultJs = await bench("js (array)", async () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])
  const body = new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd])

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

const resultJs2 = await bench("js (string)", async () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])
  const body = new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd])

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