extern crate alloc;

use alloc::vec::Vec;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn xor_mod(bytes: &[u8], mask: &[u8]) -> Vec<u8> {
    let mut result = Vec::<u8>::with_capacity(bytes.len());

    let mut i = 0;

    while i < bytes.len() {
        *result.get_unchecked_mut(i) = bytes.get_unchecked(i) ^ mask.get_unchecked(i % mask.len());
        i += 1;
    }

    result.set_len(bytes.len());

    return result;
}
