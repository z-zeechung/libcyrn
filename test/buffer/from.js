module.exports = {
    testAsciiStringEncoding() {
        const { Buffer } = require('buffer');
        const str = "Hello world!";
        const buf = Buffer.from(str, 'ascii');
        const decoded = buf.toString('ascii');
        if (decoded !== str) {
            throw new Error(`ASCII encoding mismatch. Original: "${str}", Decoded: "${decoded}"`);
        }
    },

    testUtf8StringEncoding() {
        const { Buffer } = require('buffer');
        const str = "Node.js ✅ 中文测试";
        const buf = Buffer.from(str, 'utf8');
        const decoded = buf.toString('utf8');
        if (decoded !== str) {
            throw new Error(`UTF8 encoding mismatch. Original: "${str}", Decoded: "${decoded}"`);
        }
    },

    testUtf16leStringEncoding() {
        const { Buffer } = require('buffer');
        const str = "𝄞 Music 😊";
        const buf = Buffer.from(str, 'utf16le');
        const decoded = buf.toString('utf16le');
        if (decoded !== str) {
            throw new Error(`UTF16-LE encoding mismatch. Original: "${str}", Decoded: "${decoded}"`);
        }
    },

    testUcs2StringEncoding() {
        const { Buffer } = require('buffer');
        const str = "UCS2 alias test";
        const buf1 = Buffer.from(str, 'utf16le');
        const buf2 = Buffer.from(str, 'ucs2');
        if (!buf1.equals(buf2)) {
            throw new Error('UCS2 should produce identical buffer to UTF16-LE');
        }
    },

    testLatin1StringEncoding() {
        const { Buffer } = require('buffer');
        const str = "åéîøü test";
        const buf = Buffer.from(str, 'latin1');
        const decoded = buf.toString('latin1');
        if (decoded !== str) {
            throw new Error(`Latin1 encoding mismatch. Original: "${str}", Decoded: "${decoded}"`);
        }
    },

    testBinaryStringEncoding() {
        const { Buffer } = require('buffer');
        const str = "binary\xFFtest";
        const buf = Buffer.from(str, 'binary');
        const decoded = buf.toString('binary');
        if (decoded !== str) {
            throw new Error('Binary encoding roundtrip failed');
        }
    },

    testHexStringDecoding() {
        const { Buffer } = require('buffer');
        const hexStr = "48656c6c6f20576f726c64";  // "Hello World" in hex
        const buf = Buffer.from(hexStr, 'hex');
        const expected = "Hello World";
        if (buf.toString('utf8') !== expected) {
            throw new Error(`Hex decoding failed. Expected: "${expected}", Got: "${buf.toString('utf8')}"`);
        }
    },

    testBase64StringDecoding() {
        const { Buffer } = require('buffer');
        const base64Str = "SGVsbG8gQmFzZTY0";  // "Hello Base64"
        const buf = Buffer.from(base64Str, 'base64');
        const expected = "Hello Base64";
        if (buf.toString('utf8') !== expected) {
            throw new Error(`Base64 decoding failed. Expected: "${expected}", Got: "${buf.toString('utf8')}"`);
        }
    },

    // testBase64UrlStringDecoding() {
    //     const { Buffer } = require('buffer');
    //     // Test regular URL-safe characters
    //     const base64UrlStr1 = "VGVzdGluZyBCYXNlNjRVcmw";  // "Testing Base64Url"
    //     const buf1 = Buffer.from(base64UrlStr1, 'base64url');
    //     if (buf1.toString('utf8') !== "Testing Base64Url") {
    //         throw new Error('Base64Url decoding 1 failed');
    //     }
        
    //     // Test special characters replacement
    //     const base64UrlStr2 = "_-";
    //     const buf2 = Buffer.from(base64UrlStr2, 'base64url');
    //     const buf2Expected = Buffer.from("+/", 'base64');
    //     if (!buf2.equals(buf2Expected)) {
    //         throw new Error('Base64Url decoding 2 failed (special chars)');
    //     }
    // }
};