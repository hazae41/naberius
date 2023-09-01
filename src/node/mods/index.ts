export * from "../../../wasm/pkg/naberius.js";

import { InitOutput, Slice, WASM_VECTOR_LEN, __wbg_init, pack_left_unsafe, pack_right_unsafe, passArray8ToWasm0, wasm } from "../../../wasm/pkg/naberius.js";
import { data } from "../../../wasm/pkg/naberius.wasm.js";

let output: InitOutput | undefined = undefined

export async function initBundledOnce() {
  return output ??= await __wbg_init(data)
}

function alloc(len: number): number {
  return wasm.__wbindgen_malloc(len * 1, 1) >>> 0
}

/**
 * Transform an array of bytes to an array of bits
 * @param bytes 
 * @returns 
 */
export function unpack(bytes: Uint8Array) {
  const length = bytes.length * 8

  const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;

  const ptr1 = alloc(length);
  const len1 = length;

  wasm.unpack_unsafe(ptr0, len0, ptr1, len1)
  return new Slice(ptr1, len1)
}

/**
 * Transform an array of bits to a left-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_left(bits: Uint8Array) {
  const length = (bits.length + 8 - 1) / 8;
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
  return pack_right_unsafe(bits, bytes) as any as Uint8Array
}