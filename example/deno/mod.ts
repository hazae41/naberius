import { Naberius, pack_right, unpack } from "../../src/deno/mod.ts";

await Naberius.initBundledOnce()

// Create a header of bits
const headerBits = new Uint8Array([0x00, 0x01, 0x00, 0x01])

// Create a body of bytes
const bodyBytes = new Uint8Array(256)
crypto.getRandomValues(bodyBytes)

// Unpack it
const bodyBits = unpack(bodyBytes)

// Concat both bits arrays
const fullBits = new Uint8Array(headerBits.length + bodyBits.length)
fullBits.set(headerBits, 0)
fullBits.set(bodyBits, headerBits.length)

// Pack adding 0-padding to the right
const fullBytes = pack_right(fullBits)

console.log(fullBytes)