# Bits unpacker for WebAssembly

Transform a array of bytes to an array of bits (aka bitfield), and vice-versa, using WebAssembly

### Benchmark 

The goal here is to concat a header of bits (whose length is not multiple of 8) to a body of bytes

```
cpu: Apple M1 Max
runtime: deno 1.30.0 (aarch64-apple-darwin)

file:///src/deno/bench/concat.bench.ts
benchmark        time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------- -----------------------------
wasm           3.09 µs/iter      (2.98 µs … 3.5 µs)   3.08 µs    3.5 µs    3.5 µs
js (array)   168.04 µs/iter  (60.71 µs … 767.79 µs) 259.46 µs 293.12 µs 297.46 µs
js (string)   22.84 µs/iter  (21.79 µs … 123.62 µs)  22.21 µs  58.38 µs  64.83 µs

summary
  wasm
   7.4x faster than js (string)
   54.47x faster than js (array)
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