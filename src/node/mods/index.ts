export * from "../../../wasm/pkg/naberius.js";

import { InitOutput, Slice, WASM_VECTOR_LEN, __wbg_init, getUint8Memory0, passArray8ToWasm0, wasm, xor_mod_unsafe } from "../../../wasm/pkg/naberius.js";
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
  const length = bytes.length * 8

  const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;

  const ptr1 = alloc(length);
  const len1 = length;

  wasm.unpack_unsafe(ptr0, len0, ptr1, len1, 0)
  return new Slice(ptr1, len1)
}

/**
 * Transform an array of bits to a left-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_left(bits: Uint8Array) {
  const length = Math.ceil(bits.length / 8)

  const ptr0 = passArray8ToWasm0(bits, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;

  const ptr1 = alloc(length);
  const len1 = length;

  wasm.pack_left_unsafe(ptr0, len0, ptr1, len1, 0);
  return new Slice(ptr1, len1)
}

/**
 * Transform an array of bits to a right-padded array of bytes
 * @param bits 
 * @returns 
 */
export function pack_right(bits: Uint8Array) {
  const length = Math.ceil(bits.length / 8)

  const ptr0 = passArray8ToWasm0(bits, wasm.__wbindgen_malloc);
  const len0 = WASM_VECTOR_LEN;

  const ptr1 = alloc(length);
  const len1 = length;

  wasm.pack_right_unsafe(ptr0, len0, ptr1, len1, 0);
  return new Slice(ptr1, len1)
}

export function xor_mod(bytes: Uint8Array, mask: Uint8Array) {
  return xor_mod_unsafe(bytes, mask) as any as Slice
  // const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
  // const len0 = WASM_VECTOR_LEN;
  // const ptr1 = passArray8ToWasm0(mask, wasm.__wbindgen_malloc);
  // const len1 = WASM_VECTOR_LEN;
  // wasm.xor_mod_unsafe(ptr0, len0, ptr1, len1);
  // return new Slice(ptr0, len0)
}