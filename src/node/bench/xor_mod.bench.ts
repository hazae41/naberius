import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { Memory, initBundledOnce, xor_mod } from "mods/index.js";
import { cpus } from "os";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 10_000

const bytes = new Uint8Array(1024)
crypto.getRandomValues(bytes)
const mbytes = new Memory(bytes)

const mask = new Uint8Array(4)
crypto.getRandomValues(mask)
const mmask = new Memory(mask)

const resultWasm = benchSync("wasm", () => {
  xor_mod(mbytes, mmask)
}, { samples })

const resultJs = benchSync("js", () => {
  for (let i = 0; i < bytes.length; ++i)
    bytes[i] = bytes[i] ^ mask[i % mask.length]
}, { samples })

console.info(`cpu:`, cpus()[0].model)
console.info(`runtime:`, `node ${process.version} (${process.arch}-${process.platform})`)
console.info()

resultWasm.tableAndSummary(resultJs)