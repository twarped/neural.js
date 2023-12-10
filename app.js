const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Game it has to "learn" to play. I suck at this, and all this stuff is going to be from scratch, I really have no idea how this works.

const s1 = 1; // 01 (2-bits) scenario 1
const s11 = 5 // 0101 (4-bits) scenario 1 sub scenario 1
const s12 = 6 // 0110 (4-bits) scenario 1 sub scenario 2
const s13 = 7 // 0111 (4-bits) scenario 1 sub scenario 3

const s2 = 2; // 10 (2-bits) scenario 2
const s21 = 9 // 1001 (4-bits) scenario 2 sub scenario 1
const s22 = 10 // 1010 (4-bits) scenario 2 sub scenario 2
const s23 = 11 // 1011 (4-bits) scenario 2 sub scenario 3

const s3 = 3; // 11 (2-bits) scenario 3
const s31 = 13 // 1101 (4-bits) scenario 3 sub scenario 1
const s32 = 14 // 1110 (4-bits) scenario 3 sub scenario 2
const s33 = 15 // 1111 (4-bits) scenario 3 sub scenario 3

const data = new Int8Array(32);
console.log(data)

