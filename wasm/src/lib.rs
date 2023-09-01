#![no_std]

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Pointer {
    pub ptr: *const u8,
    pub len: usize,
}

pub mod pack;
pub mod unpack;
pub mod xor;
