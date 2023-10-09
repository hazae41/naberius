
import type { Box, Copiable, Copied } from "@hazae41/box"

/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} bits
* @returns {Slice}
*/
export function pack_right(bits: Box<Copiable>): Slice;
/**
* @param {Uint8Array} bits
* @returns {Slice}
*/
export function pack_left(bits: Box<Copiable>): Slice;
/**
* @param {Uint8Array} bytes
* @param {Uint8Array} mask
* @returns {Slice}
*/
export function xor_mod(bytes: Box<Copiable>, mask: Box<Copiable>): Slice;
/**
* @param {Uint8Array} bytes
* @returns {Slice}
*/
export function unpack(bytes: Box<Copiable>): Slice;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly pack_right: (a: number, b: number, c: number) => void;
  readonly pack_left: (a: number, b: number, c: number) => void;
  readonly xor_mod: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly unpack: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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


export class Slice {

  readonly ptr: number

  readonly len: number

  constructor(ptr: number, len: number);

  /**
   * Free the bytes
   **/
  [Symbol.dispose](): void

  /**
   * Get the bytes in memory
   **/
  get bytes(): Uint8Array

  /**
   * Is the memory freed?
   **/
  get freed(): boolean

  /**
   * Free the bytes (do nothing if already freed)
   **/
  free(): void

  /**
   * Copy the bytes and free them
   **/
  copyAndDispose(): Copied

}