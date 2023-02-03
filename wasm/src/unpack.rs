extern crate alloc;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn unpack_unsafe(bytes: &[u8], bits: &mut [u8]) {
    let mut i: usize = 0;
    let mut j: usize = 0;

    while i < bytes.len() {
        for k in (0..8).rev() {
            *bits.get_unchecked_mut(j) = (bytes.get_unchecked(i) >> k) & 1;
            j += 1;
        }
        i += 1;
    }
}
