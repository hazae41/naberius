extern crate alloc;

use wasm_bindgen::prelude::*;

use crate::Memory;

#[wasm_bindgen]
pub unsafe fn xor_mod(bytes: &mut Memory, mask: &Memory) -> () {
    let mut i = 0;

    while i < bytes.len() {
        *bytes.inner.get_unchecked_mut(i) =
            bytes.inner.get_unchecked(i) ^ mask.inner.get_unchecked(i % mask.len());
        i += 1;
    }
}
