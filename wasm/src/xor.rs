extern crate alloc;

use alloc::vec::Vec;
use wasm_bindgen::prelude::*;

use crate::Pointer;

#[wasm_bindgen]
pub unsafe fn xor_mod_unsafe(bytes: &[u8], mask: &[u8]) -> Pointer {
    let mut result = Vec::<u8>::with_capacity(bytes.len());

    let mut i = 0;

    while i < bytes.len() {
        *result.get_unchecked_mut(i) = bytes.get_unchecked(i) ^ mask.get_unchecked(i % mask.len());
        i += 1;
    }

    result.set_len(bytes.len());

    Pointer {
        ptr: result.as_ptr(),
        len: result.len(),
    }
}
