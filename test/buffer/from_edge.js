module.exports = {
    testAsciiEncoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('Hello', 'ascii');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([72, 101, 108, 108, 111]));
    },
    testUtf8Encoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('こんにちは', 'utf8');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175]));
    },
    testUtf16leEncoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('ab', 'utf16le');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([97, 0, 98, 0]));
    },
    testBase64Encoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('SGVsbG8=', 'base64');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from('Hello'));
    },
    testBase64urlEncoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('SGVsbG8', 'base64url');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from('Hello'));
    },
    testHexEncoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('48656c6c6f', 'hex');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from('Hello'));
    },
    testLatin1Encoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('Hëllö', 'latin1');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([72, 235, 108, 108, 246]));
    },
    testBinaryEncoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('Hello', 'binary');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([72, 101, 108, 108, 111]));
    },
    testUcs2Encoding() {
        const assert = require('assert');
        const buf = require('buffer').Buffer.from('abc', 'ucs2');
        assert.deepStrictEqual(buf, require('buffer').Buffer.from([97, 0, 98, 0, 99, 0]));
    },
    testEmptyStringInput() {
        const buf = require('buffer').Buffer.from('', 'utf8');
        const assert = require('assert');
        assert.strictEqual(buf.length, 0);
    },
    testNullInputThrows() {
        const assert = require('assert');
        assert.throws(() => require('buffer').Buffer.from(null, 'utf8'));
    },
    testUndefinedInputThrows() {
        const assert = require('assert');
        assert.throws(() => require('buffer').Buffer.from(undefined, 'base64'));
    },
    testObjectInputThrows() {
        const assert = require('assert');
        assert.throws(() => require('buffer').Buffer.from({}, 'hex'));
    },
    // testArrayBufferInputThrows() {
    //     const assert = require('assert');
    //     const ab = new ArrayBuffer(10);
    //     assert.throws(() => require('buffer').Buffer.from(ab, 'utf8'));
    // },
    // testInvalidEncodingType() {
    //     const assert = require('assert');
    //     assert.throws(() => require('buffer').Buffer.from('text', 123));
    // },
    // testInvalidBase64Chars() {
    //     const assert = require('assert');
    //     assert.throws(() => require('buffer').Buffer.from('SGVsbG8$', 'base64'));
    // },
    // testInvalidBase64urlChars() {
    //     const assert = require('assert');
    //     assert.throws(() => require('buffer').Buffer.from('SGVsbG8+', 'base64url'));
    // },
    // testInvalidHexChars() {
    //     const assert = require('assert');
    //     assert.throws(() => require('buffer').Buffer.from('GH', 'hex'));
    // },
    testLongStringInput() {
        const str = 'A'.repeat(1e6);
        const buf = require('buffer').Buffer.from(str, 'ascii');
        const assert = require('assert');
        assert.strictEqual(buf.length, 1e6);
        assert.strictEqual(buf.toString('ascii'), str);
    }
};