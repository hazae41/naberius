extern crate alloc;

use alloc::vec::Vec;

use wasm_bindgen::prelude::*;

pub fn subpack_right(bits: &[u8]) -> u8 {
    let mut byte = 0;
    for bit in bits {
        byte = byte << 1 | bit
    }
    for _ in bits.len()..8 {
        byte = byte << 1 | 0
    }
    byte
}

#[wasm_bindgen]
pub fn pack_right(bits: &[u8]) -> Vec<u8> {
    bits.chunks(8).map(subpack_right).collect()
}

pub fn subpack_left(bits: &[u8]) -> u8 {
    let mut byte = 0;
    for i in 0..bits.len() {
        byte = byte << 1 | bits[bits.len() - i - 1]
    }
    byte
}

#[wasm_bindgen]
pub fn pack_left(bits: &mut [u8]) -> Vec<u8> {
    bits.reverse();
    let bytes = bits.chunks(8).map(subpack_left).rev().collect::<Vec<u8>>();
    bits.reverse();
    bytes
}
