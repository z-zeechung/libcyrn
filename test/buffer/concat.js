module.exports = {
    testConcatBasicArrays() {
        const buffer = require('buffer');
        const buf1 = Buffer.from('Hello');
        const buf2 = Buffer.from('World');
        const concatBuf = buffer.Buffer.concat([buf1, buf2]);
        if (concatBuf.toString() !== 'HelloWorld') {
            throw new Error('Basic concatenation failed');
        }
    },

    testConcatWithTotalLength() {
        const buffer = require('buffer');
        const buf1 = Buffer.alloc(3);
        const buf2 = Buffer.alloc(5);
        const result = buffer.Buffer.concat([buf1, buf2], 7);
        if (result.length !== 7) {
            throw new Error('Total length parameter not respected');
        }
    },

    testConcatEmptyArray() {
        const buffer = require('buffer');
        const result = buffer.Buffer.concat([]);
        if (result.length !== 0) {
            throw new Error('Empty array should produce empty buffer');
        }
    },

    testConcatMixedBuffers() {
        const buffer = require('buffer');
        const buf1 = Buffer.alloc(10);
        const buf2 = Buffer.from('');
        const buf3 = Buffer.allocUnsafe(0);
        const result = buffer.Buffer.concat([buf1, buf2, buf3]);
        if (result.length !== 10) {
            throw new Error('Mixed buffer types concatenation failed');
        }
    },

    testConcatInvalidInputType() {
        const buffer = require('buffer');
        try {
            buffer.Buffer.concat('not an array');
            throw new Error('Non-array input did not throw');
        } catch (e) {
            // Expected
        }
    },

    testConcatNegativeTotalLength() {
        const buffer = require('buffer');
        try {
            buffer.Buffer.concat([Buffer.alloc(1)], -1);
            throw new Error('Negative totalLength did not throw');
        } catch (e) {
            // Expected
        }
    },

    testConcatNonIntegerTotalLength() {
        const buffer = require('buffer');
        try {
            buffer.Buffer.concat([Buffer.alloc(1)], 1.5);
            throw new Error('Non-integer totalLength did not throw');
        } catch (e) {
            // Expected
        }
    },

    testConcatExcessiveLength() {
        const buffer = require('buffer');
        try {
            const buf = Buffer.alloc(1);
            buffer.Buffer.concat([buf], Number.MAX_SAFE_INTEGER + 1);
            throw new Error('Excessively large totalLength did not throw');
        } catch (e) {
            // Expected
        }
    },

    testConcatInvalidArrayElements() {
        const buffer = require('buffer');
        try {
            buffer.Buffer.concat([Buffer.alloc(1), 'not a buffer']);
            throw new Error('Non-buffer elements did not throw');
        } catch (e) {
            // Expected
        }
    }
};