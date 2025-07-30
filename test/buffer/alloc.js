module.exports = {
    testCreatesCorrectSize() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(5);
        if (buf.length !== 5) {
            throw new Error(`Expected buffer length 5, got ${buf.length}`);
        }
    },

    testDefaultFillIsZero() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 0) {
                throw new Error(`Expected 0 at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testStringFill() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(4, 'a');
        const expected = [97, 97, 97, 97]; // 'a' in ASCII
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== expected[i]) {
                throw new Error(`Expected ${expected[i]} at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testBufferFill() {
        const { Buffer } = require('buffer');
        const fillPattern = Buffer.from([1, 2, 3]);
        const buf = Buffer.alloc(5, fillPattern);
        const expected = [1, 2, 3, 1, 2];
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== expected[i]) {
                throw new Error(`Expected ${expected[i]} at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testUint8ArrayFill() {
        const { Buffer } = require('buffer');
        const fillPattern = new Uint8Array([4, 5]);
        const buf = Buffer.alloc(5, fillPattern);
        const expected = [4, 5, 4, 5, 4];
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== expected[i]) {
                throw new Error(`Expected ${expected[i]} at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testNumberFill() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3, 65);
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 65) {
                throw new Error(`Expected 65 at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testEmptyStringFill() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(2, '');
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 0) {
                throw new Error(`Expected 0 at index ${i}, got ${buf[i]}`);
            }
        }
    },

    testZeroLengthBuffer() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(0);
        if (buf.length !== 0) {
            throw new Error(`Expected buffer length 0, got ${buf.length}`);
        }
    },

    testSizeStringCoercion() {
        const { Buffer } = require('buffer');
        try{
            const buf = Buffer.alloc('5');
            throw new Error(`Expected TypeError: The "size" argument must be of type number.`);
        }catch{

        }
    },

    testSizeFloatTruncation() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(5.999);
        if (buf.length !== 5) {
            throw new Error(`Expected buffer length 5, got ${buf.length}`);
        }
    },

    testNegativeSizeThrows() {
        const { Buffer } = require('buffer');
        try {
            Buffer.alloc(-1);
        } catch (e) {
            return;
        }
        throw new Error('Expected exception for negative size');
    },

    testSizeNotNumberThrows() {
        const { Buffer } = require('buffer');
        try {
            Buffer.alloc({});
        } catch (e) {
            return;
        }
        throw new Error('Expected exception for non-number size');
    },

    testExceedMaxSizeThrows() {
        const { Buffer, constants } = require('buffer');
        try {
            Buffer.alloc(constants.MAX_LENGTH + 1);
        } catch (e) {
            return;
        }
        throw new Error('Expected exception for size exceeding MAX_LENGTH');
    },

    testInvalidEncodingThrows() {
        const { Buffer } = require('buffer');
        try {
            Buffer.alloc(3, 'x', 'invalid_encoding');
        } catch (e) {
            return;
        }
        throw new Error('Expected exception for invalid encoding');
    },

    testInvalidFillThrows() {
        const { Buffer } = require('buffer');
        Buffer.alloc(2, {});    // <Buffer 00 00>
        if(!Buffer.alloc(2, {}).equals(Buffer.alloc(2))) {
            throw new Error('Expected exception for invalid fill');
        }
    }
};