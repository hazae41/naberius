/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} bytes
* @param {Uint8Array} mask
*/
export function xor_mod(bytes: Uint8Array, mask: Uint8Array): void;
/**
* @param {Uint8Array} bytes
* @param {Uint8Array} bits
*/
export function unpack_unsafe(bytes: Uint8Array, bits: Uint8Array): void;
/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
*/
export function pack_right_unsafe(bits: Uint8Array, bytes: Uint8Array): void;
/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
*/
export function pack_left_unsafe(bits: Uint8Array, bytes: Uint8Array): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly xor_mod: (a: number, b: number, c: number, d: number) => void;
  readonly unpack_unsafe: (a: number, b: number, c: number, d: number) => void;
  readonly pack_right_unsafe: (a: number, b: number, c: number, d: number) => void;
  readonly pack_left_unsafe: (a: number, b: number, c: number, d: number) => void;
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

  get bytes(): Uint8Array

  free(): void

}