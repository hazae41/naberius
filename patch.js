import { readFileSync, rmSync, writeFileSync } from "fs";

const wasm = readFileSync("./wasm/pkg/naberius_bg.wasm")

writeFileSync(`./wasm/pkg/naberius.wasm.js`, `export const data = "data:application/wasm;base64,${wasm.toString("base64")}";`);
writeFileSync(`./wasm/pkg/naberius.wasm.d.ts`, `export const data: string;`);

const script = readFileSync(`./wasm/pkg/naberius.js`, "utf8")
  .replace("let wasm;", "export let wasm;")
  .replace("let WASM_VECTOR_LEN", "export let WASM_VECTOR_LEN")
  .replace("function getUint8Memory0", "export function getUint8Memory0")
  .replace("function passArray8ToWasm0", "export function passArray8ToWasm0")
  .replace("async function __wbg_init", "export async function __wbg_init")
  .replace("input = new URL('naberius_bg.wasm', import.meta.url);", "throw new Error();")
  .replaceAll("{Pointer}", "{Slice}")
  .replaceAll("Pointer.__wrap", "Slice.deref")
  .replaceAll("new Uint8Array(getObject(arg2).buffer, getObject(arg2).byteOffset, getObject(arg2).byteLength).set(getArrayU8FromWasm0(arg0, arg1));", "")

const typing = readFileSync(`./wasm/pkg/naberius.d.ts`, "utf8")
  .replace("export default function __wbg_init", "export function __wbg_init")
  .replaceAll("{Pointer}", "{Slice}")
  .replaceAll(": Pointer", ": Slice")

const patchJs = `
export class Slice {

  /**
   * @param {number} ptr 
   * @param {number} len 
   */
  constructor(ptr, len) {
    this.ptr = ptr
    this.len = len
    this.start = (ptr >>> 0) / 1
    this.end = this.start + len
  }

  static deref(ptr) {
    const pointer = Pointer.__wrap(ptr)
    const slice = new Slice(pointer.ptr, pointer.len)
    pointer.free()
    return slice
  }

  /**
   * @returns {Uint8Array}
   */
  get bytes() {
    return getUint8Memory0().subarray(this.start, this.end)
  }

  /**
   * @returns {void}
   **/
  free() {
    wasm.__wbindgen_free(this.ptr, this.len * 1);
  }

}`

const patchTs = `
export let wasm: any

export let WASM_VECTOR_LEN: number

export function getUint8Memory0(): Uint8Array

export function passArray8ToWasm0(arg: any, malloc: any): number

export class Slice {

  constructor(ptr: number, len: number);

  static from(pointer: Pointer): Slice

  get bytes(): Uint8Array

  free(): void

}`

writeFileSync(`./wasm/pkg/naberius.js`, script + patchJs)
writeFileSync(`./wasm/pkg/naberius.d.ts`, typing + patchTs)

rmSync(`./wasm/pkg/.gitignore`, { force: true });