import { Binary } from "@hazae41/binary";
import { assert, test } from "@hazae41/phobos";
import { relative, resolve } from "path";
import { initBundledOnce, pack_left, pack_right, unpack } from "./index.js";

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

  assert(equals(unpack(pack_right(ambiguous)), unambiguous_right))
  assert(equals(unpack(pack_left(ambiguous)), unambiguous_left))
})

test("Unpack and pack", async () => {

  assert(equals(
    pack_right(new Uint8Array([0, 0, 0, 0, 1])),
    pack_right(unpack(new Uint8Array([8])))
  ))

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = unpack(packed)

  const first = unpacked.subarray(2, 2 + 3)
  const firstb = new Binary(pack_left(first))
  const firstn = firstb.readUint8()
  console.log(first, firstn)
})