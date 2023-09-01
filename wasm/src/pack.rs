extern crate alloc;

use alloc::vec::Vec;
use wasm_bindgen::prelude::*;

use crate::Pointer;

#[wasm_bindgen]
pub unsafe fn pack_right_unsafe(bits: &[u8]) -> Pointer {
    let length = (bits.len() + 8 - 1) / 8;

    let mut bytes = Vec::<u8>::with_capacity(length);

    let mut bit = bits.as_ptr();
    let mut byte = bytes.as_mut_ptr();

    let r = bits.len() % 8;

    while bit < bits.as_ptr().add(bits.len()).sub(r) {
        let mut k: usize = 0;
        while k < 8 {
            *byte = (*byte << 1) | *bit;
            bit = bit.add(1);
            k += 1;
        }
        byte = byte.add(1);
    }

    if r > 0 {
        let mut k: usize = 0;
        while k < r {
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

    Pointer {
        ptr: bytes.as_ptr(),
        len: bytes.len(),
    }
}

#[wasm_bindgen]
pub unsafe fn pack_left_unsafe(bits: &[u8]) -> Pointer {
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

    Pointer {
        ptr: bytes.as_ptr(),
        len: bytes.len(),
    }
}
