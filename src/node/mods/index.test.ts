import { assert, test } from "@hazae41/phobos";
import crypto from "crypto";
import { relative, resolve } from "path";
import { initBundledOnce, pack_left, pack_right, unpack, xor_mod } from "./index.js";

const directory = resolve("./dist/test/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a.buffer)
  const bb = Buffer.from(b.buffer)

  return ba.equals(bb)
}

await initBundledOnce()

test("Unpack and pack", async () => {
  const aaa = pack_right(new Uint8Array([0, 0, 0, 0, 1]))
  const bbb = pack_right(unpack(new Uint8Array([8])))
  assert(equals(aaa, bbb))
})

test("Ambiguous", async ({ test }) => {
  const ambiguous = new Uint8Array([
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
  ])

  const unambiguous_right = new Uint8Array([
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
    0, 0, 0, 0
  ])

  const unambiguous_left = new Uint8Array([
    0, 0, 0, 0,
    1, 1, 1, 0,
    1, 1, 1, 1,
    0, 0, 0, 1,
  ])

  assert(equals(unpack(pack_right(ambiguous)), unambiguous_right), `pack_right`)
  assert(equals(unpack(pack_left(ambiguous)), unambiguous_left), `pack_left`)
})

test("Unpack and pack", async () => {

  assert(equals(
    pack_right(new Uint8Array([0, 0, 0, 0, 1])),
    pack_right(unpack(new Uint8Array([8])))
  ))

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = unpack(packed)

  const sliceBits = unpacked.subarray(2, 2 + 3)
  const sliceBytes = pack_left(sliceBits)
  const sliceUint8 = new DataView(sliceBytes.buffer).getUint8(0)

  assert(sliceUint8 === 7)
})

test("xor_mod", async () => {
  const bytes = new Uint8Array(1024)
  crypto.getRandomValues(bytes)

  const mask = new Uint8Array(4)
  crypto.getRandomValues(mask)

  const original = new Uint8Array(bytes)

  xor_mod(bytes, mask)

  assert(!equals(bytes, original))

  xor_mod(bytes, mask)

  assert(equals(bytes, original))
})