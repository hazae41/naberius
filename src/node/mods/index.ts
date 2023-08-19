export * from "../../../wasm/pkg/naberius.js";

import { InitOutput, initSync, pack_left_unsafe, pack_right_unsafe, unpack_unsafe } from "../../../wasm/pkg/naberius.js";
import { wasm } from "../../../wasm/pkg/naberius.wasm.js";

let output: InitOutput | undefined = undefined

export function initSyncBundledOnce() {
  return output ??= initSync(Buffer.from(wasm, "base64"))
}

/**
 * Transform an array of bytes to an array of bits
 * @param bytes 
 * @returns 
 */
export function unpack(bytes: Uint8Array) {
  const bits = new Uint8Array(bytes.length * 8)
  unpack_unsafe(bytes, bits)
  return bits
}

/**
 * Transform an array of bits to a left-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_left(bits: Uint8Array) {
  const length = Math.ceil(bits.length / 8);
  const bytes = new Uint8Array(length)
  pack_left_unsafe(bits, bytes)
  return bytes
}

/**
 * Transform an array of bits to a right-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_right(bits: Uint8Array) {
  const length = Math.ceil(bits.length / 8);
  const bytes = new Uint8Array(length)
  pack_right_unsafe(bits, bytes)
  return bytes
}