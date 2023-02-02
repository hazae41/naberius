
let wasm;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
*/
export function pack_right_unsafe(bits, bytes) {
    try {
        const ptr0 = passArray8ToWasm0(bits, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.pack_right_unsafe(ptr0, len0, ptr1, len1);
    } finally {
        bytes.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

/**
* @param {Uint8Array} bits
* @param {Uint8Array} bytes
*/
export function pack_left_unsafe(bits, bytes) {
    try {
        const ptr0 = passArray8ToWasm0(bits, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.pack_left_unsafe(ptr0, len0, ptr1, len1);
    } finally {
        bytes.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

/**
* @param {Uint8Array} bytes
* @param {Uint8Array} bits
*/
export function unpack_unsafe(bytes, bits) {
    try {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(bits, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        wasm.unpack_unsafe(ptr0, len0, ptr1, len1);
    } finally {
        bits.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedUint8Memory0 = new Uint8Array();


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        throw new Error();
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { init, initSync }
export default init;
