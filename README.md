# Naberius

WebAssembly bits processing utilities

```
npm i @hazae41/naberius
```

## Current features
- unpack: transform an array of bytes to an array of bits (aka bitfield)
- pack_left: transform an array of bits to a left-padded array of bytes
- pack_right: transform an array of bits to a right-padded array of bytes

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
wasm is 5.664258487909241 times faster than js (array)
wasm is 13.267190571062866 times faster than js (string)
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
wasm is 47.234917396897835 times faster than js (array)
wasm is 16.87868631584659 times faster than js (string)
```

### Usage

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