import { initBundledOnce, pack_right, unpack } from "../mod.ts";

await initBundledOnce()

/**
 * The goal here is to concat a header of bits (whose length is not multiple of 8) to a body of bytes
 */

const group = "concat"

const body = new Uint8Array(1024)
crypto.getRandomValues(body)

Deno.bench("wasm", { group, baseline: true }, () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])
  const bodyUnpacked = unpack(body)

  const fullUnpacked = new Uint8Array(header.length + bodyUnpacked.length)
  fullUnpacked.set(header, 0)
  fullUnpacked.set(bodyUnpacked, header.length)

  const fullPacked = pack_right(fullUnpacked)
})

Deno.bench("js (array)", { group }, () => {
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
})

Deno.bench("js (string)", { group }, () => {
  const header = new Uint8Array([0x00, 0x01, 0x00, 0x01])

  let fullString = ""
  header.forEach(x => fullString += x.toString(2))
  body.forEach(x => fullString += x.toString(2).padStart(8, "0"))

  const fullPacked = new Uint8Array(Math.ceil(fullString.length / 8))

  for (let i = 0; i < fullString.length; i += 8) {
    const chunk = fullString.slice(i, Math.min(i + 8, fullString.length));
    fullPacked[i / 8] = parseInt(chunk.padEnd(8, "0"), 2)
  }
})
