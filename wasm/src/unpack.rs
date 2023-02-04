extern crate alloc;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn unpack_unsafe(bytes: &[u8], bits: &mut [u8]) {
    let mut byte = bytes.as_ptr();
    let end = byte.add(bytes.len());

    let mut bit = bits.as_mut_ptr();

    let mut k: isize;

    while byte < end {
        k = 7;
        while k >= 0 {
            *bit = (*byte >> k) & 1;
            bit = bit.add(1);
            k -= 1;
        }
        byte = byte.add(1);
    }
}
