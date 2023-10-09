import { Box, Copied } from "@hazae41/box";
import { benchSync } from "@hazae41/deimos";
import crypto from "crypto";
import { initBundledOnce, unpack } from "mods/index.js";
import { cpus } from "os";
import { relative, resolve } from "path";

const directory = resolve("./dist/bench/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

await initBundledOnce()

const samples = 10_000

const packed = new Uint8Array(1024)
crypto.getRandomValues(packed)
const box = new Box(new Copied(packed))

const resultWasm = benchSync("wasm", () => {
  unpack(box).free()
}, { samples })

const resultJsArray = benchSync("js (array)", () => {
  const unpacked = new Uint8Array(packed.length * 8)

  for (let j = 0; j < packed.length; j++)
    for (let i = 0; i < 8; ++i)
      unpacked[(j * 8) + i] = (packed[j] >> (8 - i - 1)) & 1;
}, { samples })

const resultJsString = benchSync("js (string)", () => {
  let unpacked = ""

  for (const x of packed)
    unpacked += x.toString(2).padStart(8, "0")
}, { samples })

console.info(`cpu:`, cpus()[0].model)
console.info(`runtime:`, `node ${process.version} (${process.arch}-${process.platform})`)
console.info()

resultWasm.tableAndSummary(resultJsArray, resultJsString)