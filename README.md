# Bits unpacker for WebAssembly

Transform a array of bytes to an array of bits (aka bitfield), and vice-versa, using WebAssembly

### Benchmark 

The goal here is to concat a header of 4 bits to a body of 1024 bytes

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/concat.bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm            7.4 µs/iter      (6 µs … 276.12 µs)   7.42 µs  10.96 µs  12.42 µs
js (array)    654.3 µs/iter    (244.5 µs … 3.04 ms)   1.01 ms   1.13 ms   1.14 ms
js (string)    88.7 µs/iter  (86.04 µs … 226.67 µs)  86.67 µs 153.75 µs 162.04 µs

summary
  wasm
   11.99x faster than js (string)
   88.43x faster than js (array)
```

The goal here is to unpack 1024 bytes in order to read 3-bits numbers

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/number.bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           3.12 µs/iter     (3.07 µs … 3.31 µs)   3.12 µs   3.31 µs   3.31 µs
js (array)    10.53 µs/iter   (8.42 µs … 116.96 µs)  13.21 µs  16.21 µs  16.54 µs
js (string)  260.06 µs/iter (243.83 µs … 698.79 µs) 246.21 µs 571.17 µs 576.71 µs

summary
  wasm
   3.37x faster than js (array)
   83.27x faster than js (string)
```

### Usage

```ts
import { Packer, unpack, pack_right } from "@hazae41/morax";

// Wait for WASM to load
Packer.initSyncBundledOnce()

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