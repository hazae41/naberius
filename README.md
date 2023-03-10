<div>
  <img align="right" width="128" src="https://user-images.githubusercontent.com/4405263/216392312-16db6e26-5d1b-4c2d-899e-08b4093f64d3.png"/>
  <p></p>
</div>

# Naberius

WebAssembly bits processing utilities

```
npm i @hazae41/naberius
```

[**Node Package ๐ฆ**](https://www.npmjs.com/package/@hazae41/naberius) โข [**Deno Module ๐ฆ**](https://deno.land/x/naberius)

## Features
- unpack: transform an array of bytes to an array of bits (aka bitfield)
- pack_left: transform an array of bits to a left-padded array of bytes
- pack_right: transform an array of bits to a right-padded array of bytes
- xor_mod: apply in-place XOR to an array of bytes using a mask

## Benchmarks

### unpack

#### Deno

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/unpack.bench.ts
benchmark        time (avg)             (min โฆ max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           3.31 ยตs/iter     (3.25 ยตs โฆ 3.52 ยตs)   3.33 ยตs   3.52 ยตs   3.52 ยตs
js (array)    10.44 ยตs/iter   (8.25 ยตs โฆ 121.83 ยตs)  13.04 ยตs  14.25 ยตs  15.04 ยตs
js (string)   51.27 ยตs/iter  (49.75 ยตs โฆ 178.83 ยตs)  50.08 ยตs 109.71 ยตs 114.38 ยตs

summary
  wasm
   3.15x faster than js (array)
   15.49x faster than js (string)
```

#### Node

```
src/node/bench/unpack.bench.ts
cpu: Apple M1 Max
runtime: node v18.12.1 (arm64-darwin)

โโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโโโโโฌโโโโโโโโโโโโโฌโโโโโโโโโโโโโโ
โ   (index)   โ     average     โ  minimum   โ   maximum   โ
โโโโโโโโโโโโโโโผโโโโโโโโโโโโโโโโโโผโโโโโโโโโโโโโผโโโโโโโโโโโโโโค
โ    wasm     โ '3.09 ฮผs/iter'  โ '2.04 ฮผs'  โ '169.21 ฮผs' โ
โ js (array)  โ '17.64 ฮผs/iter' โ '16.71 ฮผs' โ '854.29 ฮผs' โ
โ js (string) โ '41.94 ฮผs/iter' โ '40.04 ฮผs' โ '218.75 ฮผs' โ
โโโโโโโโโโโโโโโดโโโโโโโโโโโโโโโโโโดโโโโโโโโโโโโโดโโโโโโโโโโโโโโ

Summary
- wasm is 5.71x faster than js (array)
- wasm is 13.58x faster than js (string)
```

### pack_right

#### Deno 

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/pack_right.bench.ts
benchmark        time (avg)             (min โฆ max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           2.75 ยตs/iter      (2.73 ยตs โฆ 2.9 ยตs)   2.76 ยตs    2.9 ยตs    2.9 ยตs
js (array)   668.34 ยตs/iter   (241.29 ยตs โฆ 1.21 ms)   1.02 ms   1.11 ms   1.16 ms
js (string)   43.83 ยตs/iter  (42.58 ยตs โฆ 137.96 ยตs)  43.04 ยตs  78.25 ยตs  80.33 ยตs

summary
  wasm
   15.92x faster than js (string)
   242.72x faster than js (array)
```

#### Node

```
src/node/bench/pack_right.bench.ts
cpu: Apple M1 Max
runtime: node v18.12.1 (arm64-darwin)

โโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโ
โ   (index)   โ     average      โ   minimum   โ   maximum   โ
โโโโโโโโโโโโโโโผโโโโโโโโโโโโโโโโโโโผโโโโโโโโโโโโโโผโโโโโโโโโโโโโโค
โ    wasm     โ  '2.44 ฮผs/iter'  โ  '2.04 ฮผs'  โ '111.17 ฮผs' โ
โ js (array)  โ '118.16 ฮผs/iter' โ '110.13 ฮผs' โ '464.25 ฮผs' โ
โ js (string) โ '42.15 ฮผs/iter'  โ '40.62 ฮผs'  โ  '1.14 ms'  โ
โโโโโโโโโโโโโโโดโโโโโโโโโโโโโโโโโโโดโโโโโโโโโโโโโโดโโโโโโโโโโโโโโ

Summary
- wasm is 48.40x faster than js (array)
- wasm is 17.26x faster than js (string)
```

### xor_mod

#### Deno

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/xor_mod.bench.ts
benchmark      time (avg)             (min โฆ max)       p75       p99      p995
------------------------------------------------- -----------------------------
wasm       888.48 ns/iter    (874.06 ns โฆ 1.1 ยตs) 885.63 ns    1.1 ยตs    1.1 ยตs
js           1.16 ยตs/iter     (1.15 ยตs โฆ 1.17 ยตs)   1.16 ยตs   1.17 ยตs   1.17 ยตs

summary
  wasm
   1.3x faster than js
```

#### Node 

```
src/node/bench/xor_mod.bench.ts
cpu: Apple M1 Max
runtime: node v18.12.1 (arm64-darwin)

โโโโโโโโโโโฌโโโโโโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโฌโโโโโโโโโโโโโโ
โ (index) โ     average      โ   minimum   โ   maximum   โ
โโโโโโโโโโโผโโโโโโโโโโโโโโโโโโโผโโโโโโโโโโโโโโผโโโโโโโโโโโโโโค
โ  wasm   โ '880.48 ns/iter' โ '750.00 ns' โ '154.00 ฮผs' โ
โ   js    โ '17.71 ฮผs/iter'  โ '17.42 ฮผs'  โ '610.67 ฮผs' โ
โโโโโโโโโโโดโโโโโโโโโโโโโโโโโโโดโโโโโโโโโโโโโโดโโโโโโโโโโโโโโ

Summary
- wasm is 20.11x faster than js
```

## Usage

### Concatening bits

```ts
import { Naberius, unpack, pack_right } from "@hazae41/naberius";

// Wait for WASM to load
Naberius.initSyncBundledOnce()

// Create a header of bits
const headerBits = new Uint8Array([0x00, 0x01, 0x00, 0x01])

// Create a body of bytes
const bodyBytes = new Uint8Array(256)
crypto.getRandomValues(bodyBytes)

// Unpack it
const bodyBits = unpack(bodyBytes)

// Concat both bits arrays
const fullBits = new Uint8Array(headerBits.length + bodyBits.length)
fullBits.set(headerBits, 0)
fullBits.set(bodyBits, headerBits.length)

// Pack adding 0-padding to the right
const fullBytes = pack_right(fullBits)
```

## Building

### Unreproducible building

You need to install [Rust](https://www.rust-lang.org/tools/install)

Then, install [wasm-pack](https://github.com/rustwasm/wasm-pack)

```bash
cargo install wasm-pack
```

Finally, do a clean install and build

```bash
npm ci && npm run build
```

### Reproducible building

You can build the exact same bytecode using Docker, just be sure you're on a `linux/amd64` host

```bash
docker compose up --build
```

Then check that all the files are the same using `git status`

```bash
git status --porcelain
```

If the output is empty then the bytecode is the same as the one I commited

### Automated checks

Each time I commit to the repository, the GitHub's CI does the following:
- Clone the repository
- Reproduce the build using `docker compose up --build`
- Throw an error if the `git status --porcelain` output is not empty

Each time I release a new version tag on GitHub, the GitHub's CI does the following:
- Clone the repository
- Do not reproduce the build, as it's already checked by the task above
- Throw an error if there is a `npm diff` between the cloned repository and the same version tag on NPM

If a version is present on NPM but not on GitHub, do not use!
