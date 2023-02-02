export * from "../../../wasm/pkg/pack.js";

import { init, InitOutput, initSync, pack_left_unsafe, pack_right_unsafe, unpack_unsafe } from "../../../wasm/pkg/pack.js";
import { wasm } from "../../../wasm/pkg/pack.wasm.js";

let output: InitOutput | undefined = undefined

export function initSyncBundledOnce() {
  return output ??= initSync(Buffer.from(wasm, "base64"))
}

export async function initBundledOnce() {
  return output ??= await init(Buffer.from(wasm, "base64"))
}

export function unpack(bytes: Uint8Array) {
  const bits = new Uint8Array(bytes.length * 8)
  unpack_unsafe(bytes, bits)
  return bits
}

export function pack_left(bits: Uint8Array) {
  let length = bits.length / 8;
  if (bits.length % 8) length++;
  const bytes = new Uint8Array(length)
  pack_left_unsafe(bits, bytes)
  return bytes
}

export function pack_right(bits: Uint8Array) {
  let length = bits.length / 8;
  if (bits.length % 8) length++;
  const bytes = new Uint8Array(length)
  pack_right_unsafe(bits, bytes)
  return bytes
}