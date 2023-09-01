/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} bytes
* @param {Uint8Array} mask
* @returns {Slice}
*/
export function xor_mod_unsafe(bytes: Uint8Array, mask: Uint8Array): Slice;
/**
* @param {Uint8Array} bytes
* @param {Uint8Array} bits
* @returns {Slice}
*/
export function unpack_unsafe(bytes: Uint8Array, bits: Uint8Array): Slice;
/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
* @returns {Slice}
*/
export function pack_right_unsafe(bits: Uint8Array, bytes: Uint8Array): Slice;
/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
* @returns {Slice}
*/
export function pack_left_unsafe(bits: Uint8Array, bytes: Uint8Array): Slice;
/**
*/
export class Pointer {
  free(): void;
/**
*/
  len: number;
/**
*/
  ptr: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_pointer_free: (a: number) => void;
  readonly __wbg_get_pointer_ptr: (a: number) => number;
  readonly __wbg_set_pointer_ptr: (a: number, b: number) => void;
  readonly __wbg_get_pointer_len: (a: number) => number;
  readonly __wbg_set_pointer_len: (a: number, b: number) => void;
  readonly xor_mod_unsafe: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly unpack_unsafe: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly pack_right_unsafe: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly pack_left_unsafe: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

export let wasm: any

export let WASM_VECTOR_LEN: number

export function getUint8Memory0(): Uint8Array

export function passArray8ToWasm0(arg: any, malloc: any): number

export class Slice {

  constructor(ptr: number, len: number);

  static from(pointer: Pointer): Slice

  get bytes(): Uint8Array

  free(): void

}