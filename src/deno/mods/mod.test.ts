// deno-lint-ignore-file no-unused-vars require-await
import { Buffer } from "https://deno.land/std@0.170.0/node/buffer.ts";
import { assert, test } from "npm:@hazae41/phobos";
import { pack_right } from "../../node/mods/index.ts";
import { initBundledOnce, pack_left, unpack } from "./mod.ts";

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a.buffer)
  const bb = Buffer.from(b.buffer)

  return ba.equals(bb)
}

await initBundledOnce()

test("Unpack and pack", async () => {
  const aaa = pack_right(new Uint8Array([0, 0, 0, 0, 1])).read()
  const bbb = pack_right(unpack(new Uint8Array([8])).read()).read()
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

  assert(equals(unpack(pack_right(ambiguous).read()).read(), unambiguous_right), `pack_right`)
  assert(equals(unpack(pack_left(ambiguous).read()).read(), unambiguous_left), `pack_left`)
})

test("Unpack and pack", async () => {

  assert(equals(
    pack_right(new Uint8Array([0, 0, 0, 0, 1])).read(),
    pack_right(unpack(new Uint8Array([8])).read()).read()
  ))

  const packed = new Uint8Array([0b00111001, 0b11001100])
  const unpacked = unpack(packed).read()

  const first = unpacked.subarray(2, 2 + 3)
  const firstb = new DataView(pack_left(first).read().buffer)
  const firstn = firstb.getUint8(0)

  assert(firstn === 7)
})