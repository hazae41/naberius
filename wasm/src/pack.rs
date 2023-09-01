extern crate alloc;

use alloc::vec::Vec;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn pack_right(bits: &[u8]) -> Vec<u8> {
    let length = (bits.len() + 8 - 1) / 8;

    let mut bytes = Vec::<u8>::with_capacity(length);

    let mut bit = bits.as_ptr();
    let mut byte = bytes.as_mut_ptr();

    let remainder = bits.len() % 8;

    while bit < bits.as_ptr().add(bits.len()).sub(remainder) {
        let mut k: usize = 0;
        while k < 8 {
            *byte = (*byte << 1) | *bit;
            bit = bit.add(1);
            k += 1;
        }
        byte = byte.add(1);
    }

    if remainder > 0 {
        let mut k: usize = 0;
        while k < remainder {
            *byte = (*byte << 1) | *bit;
            bit = bit.add(1);
            k += 1;
        }
        while k < 8 {
            *byte = (*byte << 1) | 0;
            k += 1;
        }
    }

    bytes.set_len(length);

    return bytes;
}

#[wasm_bindgen]
pub unsafe fn pack_left(bits: &[u8]) -> Vec<u8> {
    let length = (bits.len() + 8 - 1) / 8;

    let mut bytes = Vec::<u8>::with_capacity(length);

    let mut bit = bits.as_ptr();
    let mut byte = bytes.as_mut_ptr();

    let r = bits.len() % 8;

    if r > 0 {
        while bit < bits.as_ptr().add(r) {
            *byte = (*byte << 1) | *bit;
            bit = bit.add(1);
        }
        byte = byte.add(1);
    }

    while bit < bits.as_ptr().add(bits.len()) {
        let mut k: usize = 0;
        while k < 8 {
            *byte = (*byte << 1) | *bit;
            bit = bit.add(1);
            k += 1;
        }
        byte = byte.add(1);
    }

    bytes.set_len(length);

    return bytes;
}
