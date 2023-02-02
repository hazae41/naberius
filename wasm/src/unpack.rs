extern crate alloc;

use alloc::vec::Vec;

use wasm_bindgen::prelude::*;

pub struct Unpacker {
    value: u8,
    index: u8,
}

impl Unpacker {
    pub fn new(value: u8) -> Unpacker {
        Unpacker { value, index: 0 }
    }
}

impl Iterator for Unpacker {
    type Item = u8;

    fn size_hint(&self) -> (usize, Option<usize>) {
        (8, Some(8))
    }

    fn next(&mut self) -> Option<Self::Item> {
        if self.index == 8 {
            return None;
        }

        let bit = self.value >> (8 - self.index - 1) & 1;
        self.index += 1;
        Some(bit)
    }
}

#[wasm_bindgen]
pub fn unpack(bytes: &[u8]) -> Vec<u8> {
    bytes.iter().flat_map(|x| Unpacker::new(*x)).collect()
}
