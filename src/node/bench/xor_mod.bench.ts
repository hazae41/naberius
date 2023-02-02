import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, xor_mod } from "mods/index.js";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 100_000

const bytes = new Uint8Array(1024)
crypto.getRandomValues(bytes)

const mask = new Uint8Array(4)
crypto.getRandomValues(mask)

const resultWasm = benchSync("wasm", () => {
  xor_mod(bytes, mask)
}, { samples })

const resultJs = benchSync("js", () => {
  for (let i = 0; i < bytes.length; ++i)
    bytes[i] = bytes[i] ^ mask[i % mask.length]
}, { samples })

console.log(`wasm is ${resultWasm.ratio(resultJs)} times faster than js`)