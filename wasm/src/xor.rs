extern crate alloc;

use alloc::vec::Vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn xor_mod(mut bytes: Vec<u8>, mask: &[u8]) {
    let mut i = 0;

    while i < bytes.len() {
        *bytes.get_unchecked_mut(i) = bytes.get_unchecked(i) ^ mask.get_unchecked(i % mask.len());
        i += 1;
    }
}
