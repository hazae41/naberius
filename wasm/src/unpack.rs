extern crate alloc;

use alloc::vec::Vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn unpack_unsafe(bytes: &[u8], mut bits: Vec<u8>) {
    let mut byte = bytes.as_ptr();
    let mut bit = bits.as_mut_ptr();

    while byte < bytes.as_ptr().add(bytes.len()) {
        let mut k: isize = 7;
        while k >= 0 {
            *bit = (*byte >> k) & 1;
            bit = bit.add(1);
            k -= 1;
        }
        byte = byte.add(1);
    }
}
