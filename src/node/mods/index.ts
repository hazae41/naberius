export * from "../../../wasm/pkg/naberius.js";

import { InitOutput, __wbg_init, getUint8Memory0, pack_left_unsafe, pack_right_unsafe, unpack_unsafe, wasm, xor_mod_unsafe } from "../../../wasm/pkg/naberius.js";
import { data } from "../../../wasm/pkg/naberius.wasm.js";

let output: InitOutput | undefined = undefined

export async function initBundledOnce() {
  return output ??= await __wbg_init(data)
}

function alloc(length: number): number {
  const ptr = wasm.__wbindgen_malloc(length, 1) >>> 0
  getUint8Memory0().fill(0, ptr, ptr + length)
  return ptr
}

/**
 * Transform an array of bytes to an array of bits
 * @param bytes 
 * @returns 
 */
export function unpack(bytes: Uint8Array) {
  return unpack_unsafe(bytes)
}

/**
 * Transform an array of bits to a left-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_left(bits: Uint8Array) {
  return pack_left_unsafe(bits)
}

/**
 * Transform an array of bits to a right-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_right(bits: Uint8Array) {
  return pack_right_unsafe(bits)
}

export function xor_mod(bytes: Uint8Array, mask: Uint8Array) {
  return xor_mod_unsafe(bytes, mask)
}