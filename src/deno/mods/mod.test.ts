// deno-lint-ignore-file no-unused-vars require-await
import { Buffer } from "https://deno.land/std@0.170.0/node/buffer.ts";
import { assert, test } from "npm:@hazae41/phobos";
import { Memory, initBundledOnce, pack_left, pack_right, unpack } from "./mod.ts";

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)

  return ba.equals(bb)
}

await initBundledOnce()

test("Unpack and pack", async () => {
  const aaa = pack_right(new Memory(new Uint8Array([0, 0, 0, 0, 1])))
  const bbb = pack_right(unpack(new Memory(new Uint8Array([8]))))
  assert(equals(aaa.bytes, bbb.bytes))
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

  assert(equals(unpack(pack_right(new Memory(ambiguous))).bytes, unambiguous_right), `pack_right`)
  assert(equals(unpack(pack_left(new Memory(ambiguous))).bytes, unambiguous_left), `pack_left`)
})

test("Unpack and pack", async () => {

  assert(equals(
    pack_right(new Memory(new Uint8Array([0, 0, 0, 0, 1]))).bytes,
    pack_right(unpack(new Memory(new Uint8Array([8])))).bytes
  ))

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = unpack(new Memory(packed)).copyAndDispose()

  const first = unpacked.subarray(2, 2 + 3)
  const firstb = new DataView(pack_left(new Memory(first)).bytes.slice().buffer)
  const firstn = firstb.getUint8(0)

  assert(firstn === 7)
})