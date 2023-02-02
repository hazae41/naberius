extern crate alloc;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub unsafe fn pack_right_unsafe(bits: &[u8], bytes: &mut [u8]) {
    let mut i: usize = 0;
    let mut j: usize = 0;
    let mut k: usize;

    let r = bits.len() % 8;
    let e = bits.len() - r;

    while j < e {
        let mut b = 0;
        k = 0;
        while k < 8 {
            b = (b << 1) | bits.get_unchecked(j);
            j = j.unchecked_add(1);
            k = k.unchecked_add(1);
        }
        *bytes.get_unchecked_mut(i) = b;
        i = i.unchecked_add(1);
    }

    if r > 0 {
        let mut b = 0;
        k = 0;
        while k < r {
            b = (b << 1) | bits.get_unchecked(j);
            j = j.unchecked_add(1);
            k = k.unchecked_add(1);
        }
        while k < 8 {
            b = (b << 1) | 0;
            k = k.unchecked_add(1);
        }
        *bytes.get_unchecked_mut(i) = b;
    }
}

#[wasm_bindgen]
pub unsafe fn pack_left_unsafe(bits: &[u8], bytes: &mut [u8]) {
    let mut i: usize = 0;
    let mut j: usize = 0;

    let r = bits.len() % 8;

    if r > 0 {
        let mut b = 0;
        while j < r {
            b = (b << 1) | bits.get_unchecked(j);
            j = j.unchecked_add(1);
        }
        *bytes.get_unchecked_mut(i) = b;
        i = i.unchecked_add(1);
    }

    while j < bits.len() {
        let mut b = 0;
        for _ in 0..8 {
            b = (b << 1) | bits.get_unchecked(j);
            j = j.unchecked_add(1);
        }
        *bytes.get_unchecked_mut(i) = b;
        i = i.unchecked_add(1);
    }
}
