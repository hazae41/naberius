extern crate alloc;

use wasm_bindgen::prelude::*;

use crate::Pointer;

#[wasm_bindgen]
pub unsafe fn xor_mod_unsafe(bytes: &mut [u8], mask: &[u8]) -> Pointer {
    let mut i = 0;

    while i < bytes.len() {
        *bytes.get_unchecked_mut(i) = bytes.get_unchecked(i) ^ mask.get_unchecked(i % mask.len());
        i += 1;
    }

    Pointer {
        ptr: bytes.as_ptr(),
        len: bytes.len(),
    }
}
