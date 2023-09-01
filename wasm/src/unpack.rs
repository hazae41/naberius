extern crate alloc;

use alloc::vec::Vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn unpack(bytes: &[u8]) -> Vec<u8> {
    let length = bytes.len() * 8;

    let mut bits = Vec::<u8>::with_capacity(length);

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

    bits.set_len(length);

    return bits;
}
