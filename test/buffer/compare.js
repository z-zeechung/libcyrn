module.exports = {
    testCompareIdenticalBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.from('test');
        const buf2 = Buffer.from('test');
        if (Buffer.compare(buf1, buf2) !== 0) {
            throw new Error('Identical buffers should return 0');
        }
    },

    testCompareDifferentOrderedBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.from('abc');
        const buf2 = Buffer.from('def');
        if (Buffer.compare(buf1, buf2) >= 0) {
            throw new Error('buf1 should be ordered before buf2');
        }
    },

    testCompareReverseOrderedBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.from('def');
        const buf2 = Buffer.from('abc');
        if (Buffer.compare(buf1, buf2) <= 0) {
            throw new Error('buf1 should be ordered after buf2');
        }
    },

    testCompareEmptyBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.alloc(0);
        const buf2 = Buffer.alloc(0);
        if (Buffer.compare(buf1, buf2) !== 0) {
            throw new Error('Empty buffers should return 0');
        }
    },

    testCompareDifferentLengthBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.from('a');
        const buf2 = Buffer.from('ab');
        if (Buffer.compare(buf1, buf2) >= 0) {
            throw new Error('Shorter buffer should come first');
        }
    },

    testComparePrefixBuffer() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.from('abc');
        const buf2 = Buffer.from('abcd');
        if (Buffer.compare(buf1, buf2) >= 0) {
            throw new Error('Prefix buffer should come first');
        }
    },

    testCompareFirstArgumentInvalidType() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('valid');
        try {
            Buffer.compare({}, buf);
            throw new Error('Should throw with invalid first argument');
        } catch {}
    },

    testCompareSecondArgumentInvalidType() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('valid');
        try {
            Buffer.compare(buf, null);
            throw new Error('Should throw with invalid second argument');
        } catch {}
    },

    testCompareBothArgumentsInvalid() {
        const { Buffer } = require('buffer');
        try {
            Buffer.compare(123, ['test']);
            throw new Error('Should throw with both invalid arguments');
        } catch {}
    },

    testCompareUint8ArrayArguments() {
        const { Buffer } = require('buffer');
        const uint1 = new Uint8Array([1, 2, 3]);
        const uint2 = new Uint8Array([1, 2, 3]);
        if (Buffer.compare(uint1, uint2) !== 0) {
            throw new Error('Uint8Arrays should compare as equal');
        }
    },

    testCompareDifferentTypedArrays() {
        const { Buffer } = require('buffer');
        const uint = new Uint8Array([65]);
        const int = new Int32Array([65]);
        try {
            Buffer.compare(uint, int);
            throw new Error('Should throw with different typed array types');
        } catch {}
    },

    testCompareLargeBuffers() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.alloc(10000, 'a');
        const buf2 = Buffer.alloc(10000, 'a');
        if (Buffer.compare(buf1, buf2) !== 0) {
            throw new Error('Large identical buffers should match');
        }
    }
};