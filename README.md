<div>
  <img align="right" width="128" src="https://user-images.githubusercontent.com/4405263/216392312-16db6e26-5d1b-4c2d-899e-08b4093f64d3.png"/>
  <p></p>
</div>

# Naberius

WebAssembly bits processing utilities

```
npm i @hazae41/naberius
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/naberius) • [**Deno Module 🦖**](https://deno.land/x/naberius)

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
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           3.31 µs/iter     (3.25 µs … 3.52 µs)   3.33 µs   3.52 µs   3.52 µs
js (array)    10.44 µs/iter   (8.25 µs … 121.83 µs)  13.04 µs  14.25 µs  15.04 µs
js (string)   51.27 µs/iter  (49.75 µs … 178.83 µs)  50.08 µs 109.71 µs 114.38 µs

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

┌─────────────┬─────────────────┬────────────┬─────────────┐
│   (index)   │     average     │  minimum   │   maximum   │
├─────────────┼─────────────────┼────────────┼─────────────┤
│    wasm     │ '3.09 μs/iter'  │ '2.04 μs'  │ '169.21 μs' │
│ js (array)  │ '17.64 μs/iter' │ '16.71 μs' │ '854.29 μs' │
│ js (string) │ '41.94 μs/iter' │ '40.04 μs' │ '218.75 μs' │
└─────────────┴─────────────────┴────────────┴─────────────┘

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
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           2.75 µs/iter      (2.73 µs … 2.9 µs)   2.76 µs    2.9 µs    2.9 µs
js (array)   668.34 µs/iter   (241.29 µs … 1.21 ms)   1.02 ms   1.11 ms   1.16 ms
js (string)   43.83 µs/iter  (42.58 µs … 137.96 µs)  43.04 µs  78.25 µs  80.33 µs

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

┌─────────────┬──────────────────┬─────────────┬─────────────┐
│   (index)   │     average      │   minimum   │   maximum   │
├─────────────┼──────────────────┼─────────────┼─────────────┤
│    wasm     │  '2.44 μs/iter'  │  '2.04 μs'  │ '111.17 μs' │
│ js (array)  │ '118.16 μs/iter' │ '110.13 μs' │ '464.25 μs' │
│ js (string) │ '42.15 μs/iter'  │ '40.62 μs'  │  '1.14 ms'  │
└─────────────┴──────────────────┴─────────────┴─────────────┘

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
benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
wasm       888.48 ns/iter    (874.06 ns … 1.1 µs) 885.63 ns    1.1 µs    1.1 µs
js           1.16 µs/iter     (1.15 µs … 1.17 µs)   1.16 µs   1.17 µs   1.17 µs

summary
  wasm
   1.3x faster than js
```

#### Node 

```
src/node/bench/xor_mod.bench.ts
cpu: Apple M1 Max
runtime: node v18.12.1 (arm64-darwin)

┌─────────┬──────────────────┬─────────────┬─────────────┐
│ (index) │     average      │   minimum   │   maximum   │
├─────────┼──────────────────┼─────────────┼─────────────┤
│  wasm   │ '880.48 ns/iter' │ '750.00 ns' │ '154.00 μs' │
│   js    │ '17.71 μs/iter'  │ '17.42 μs'  │ '610.67 μs' │
└─────────┴──────────────────┴─────────────┴─────────────┘

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
const bodyBitsSlice = unpack(bodyBytes)

// Concat both bits arrays
const fullBits = new Uint8Array(headerBits.length + bodyBitsSlice.bytes.length)
fullBits.set(headerBits, 0)
fullBits.set(bodyBitsSlice.bytes, headerBits.length)

bodyBitsSlice.free()

// Pack adding 0-padding to the right
const fullBytes = pack_right(fullBits).read()
```

### Xoring with mask



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
