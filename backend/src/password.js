"use strict";

// super secure

function generateSalt(length = 16) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let salt = "";
    for (let i = 0; i < length; i++) {
        salt += chars[Math.floor(Math.random() * chars.length)];
    }
    return salt;
}

function hashPassword(salted) {
    let h = [0, 0, 0, 0];
    for (let i = 0; i < 8192; i++) {
        h.push(h.shift());
        for (let j = 0; j < salted.length; j++) {
            for (let k = 0; k < 4; k++) {
                h[k] = (h[k] << (2 * k + 3)) - h[k] + salted.charCodeAt(j);
                h[k] += i % 101;
                h[k] += (i * i) % 1013;
                h[k] |= 0;
            }
        }
    }
    return h.map(val => {
        return (val >>> 0).toString(16).padStart(8, '0');
    }).join('');
}

export { generateSalt, hashPassword }