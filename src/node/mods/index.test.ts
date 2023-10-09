import { Box, Copied } from "@hazae41/box";
import { assert, test } from "@hazae41/phobos";
import { relative, resolve } from "path";
import { initBundledOnce, pack_left, pack_right, unpack, xor_mod } from "./index.js";

const directory = resolve("./dist/test/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a.buffer)
  const bb = Buffer.from(b.buffer)

  console.log()
  console.log(a)
  console.log(b)
  console.log()

  return ba.equals(bb)
}

await initBundledOnce()

await test("Unpack and pack", async () => {
  const aaa = pack_right(new Box(new Copied(new Uint8Array([0, 0, 0, 0, 1])))).copyAndDispose().bytes
  const bbb = pack_right(new Box(unpack(new Box(new Copied(new Uint8Array([8])))).copyAndDispose())).copyAndDispose().bytes
  assert(equals(aaa, bbb))
})

await test("Ambiguous", async ({ test }) => {
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

  assert(equals(unpack(new Box(pack_right(new Box(new Copied(ambiguous))).copyAndDispose())).copyAndDispose().bytes, unambiguous_right), `pack_right`)
  assert(equals(unpack(new Box(pack_left(new Box(new Copied(ambiguous))).copyAndDispose())).copyAndDispose().bytes, unambiguous_left), `pack_left`)
})

await test("Unpack and pack", async () => {

  assert(equals(
    pack_right(new Box(new Copied(new Uint8Array([0, 0, 0, 0, 1])))).copyAndDispose().bytes,
    pack_right(new Box(unpack(new Box(new Copied(new Uint8Array([8])))).copyAndDispose())).copyAndDispose().bytes
  ))

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = unpack(new Box(new Copied(packed))).copyAndDispose().bytes

  const sliceBits = unpacked.subarray(2, 2 + 3)
  const sliceBytes = pack_left(new Box(new Copied(sliceBits))).copyAndDispose().bytes
  const sliceUint8 = new DataView(sliceBytes.buffer).getUint8(0)

  assert(sliceUint8 === 7)
})

await test("xor_mod", async () => {
  const bytes = new Uint8Array(1024)
  crypto.getRandomValues(bytes)

  const mask = new Uint8Array(4)
  crypto.getRandomValues(mask)

  const xored = xor_mod(new Box(new Copied(bytes)), new Box(new Copied(mask))).copyAndDispose()

  assert(!equals(bytes, xored.bytes))

  const unxored = xor_mod(new Box(xored), new Box(new Copied(mask))).copyAndDispose()

  assert(equals(bytes, unxored.bytes))
})