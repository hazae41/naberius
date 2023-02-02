export * from "../../../wasm/pkg/packer.js";

import * as Base64 from "https://deno.land/std@0.158.0/encoding/base64.ts";

// @deno-types="../../../wasm/pkg/packer.d.ts"
import { init, initSync, pack_left_unsafe, pack_right_unsafe, unpack_unsafe } from "../../../wasm/pkg/packer.js";

import { InitOutput } from "../../../wasm/pkg/packer.d.ts";
import { wasm } from "../../../wasm/pkg/packer.wasm.js";

let output: InitOutput | undefined = undefined

export function initSyncBundledOnce() {
  return output ??= initSync(Base64.decode(wasm))
}

export async function initBundledOnce() {
  return output ??= await init(Base64.decode(wasm))
}

export function unpack(bytes: Uint8Array) {
  const bits = new Uint8Array(bytes.length * 8)
  unpack_unsafe(bytes, bits)
  return bits
}

export function pack_left(bits: Uint8Array) {
  const bytes = new Uint8Array((bits.length + 8 - 1) / 8)
  pack_left_unsafe(bits, bytes)
  return bytes
}

export function pack_right(bits: Uint8Array) {
  const bytes = new Uint8Array((bits.length + 8 - 1) / 8)
  pack_right_unsafe(bits, bytes)
  return bytes
}