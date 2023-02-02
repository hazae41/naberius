/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} bits
* @returns {Uint8Array}
*/
export function pack_right(bits: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} bits
* @returns {Uint8Array}
*/
export function pack_left(bits: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} bytes
* @returns {Uint8Array}
*/
export function unpack(bytes: Uint8Array): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly pack_right: (a: number, b: number, c: number) => void;
  readonly pack_left: (a: number, b: number, c: number) => void;
  readonly unpack: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
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
export function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
