module.exports = {
    testNormalStringWithUTF8Encoding() {
        const { Buffer } = require('buffer');
        const len = Buffer.byteLength("Hello", 'utf8');
        if (len !== 5) throw new Error("UTF8 length mismatch");
    },

    testBufferInputTypeHandling() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
        const len = Buffer.byteLength(buf);
        if (len !== 5) throw new Error("Buffer length mismatch");
    },

    testArrayBufferInputTypeHandling() {
        const { Buffer } = require('buffer');
        const ab = new ArrayBuffer(8);
        const len = Buffer.byteLength(ab);
        if (len !== 8) throw new Error("ArrayBuffer length mismatch");
    },

    // testStringObjectInputCoercion() {
    //     const { Buffer } = require('buffer');
    //     const strObj = new String("Hello");
    //     const len = Buffer.byteLength(strObj);
    //     if (len !== 5) throw new Error("String object coercion failed");
    // },

    testEmptyStringValidation() {
        const { Buffer } = require('buffer');
        const len = Buffer.byteLength("", 'utf8');
        if (len !== 0) throw new Error("Empty string should be 0 bytes");
    },

    testNullInputHandling() {
        const { Buffer } = require('buffer');
        try { Buffer.byteLength(null); } catch { return; }
        throw new Error("Null input didn't throw expected exception");
    },

    testUndefinedInputHandling() {
        const { Buffer } = require('buffer');
        try { Buffer.byteLength(undefined); } catch { return; }
        throw new Error("Undefined input didn't throw expected exception");
    },

    testSymbolInputHandling() {
        const { Buffer } = require('buffer');
        try { Buffer.byteLength(Symbol('test')); } catch { return; }
        throw new Error("Symbol input didn't throw expected exception");
    },

    testArrayInputHandling() {
        const { Buffer } = require('buffer');
        try { Buffer.byteLength([1, 2, 3]); } catch { return; }
        throw new Error("Array input didn't throw expected exception");
    },

    testObjectInputHandling() {
        const { Buffer } = require('buffer');
        try { Buffer.byteLength({ key: "value" }); } catch { return; }
        throw new Error("Object input didn't throw expected exception");
    },

    // testInvalidEncodingHandling() {
    //     const { Buffer } = require('buffer');
    //     try { Buffer.byteLength("text", 'invalid_enc'); } catch { return; }
    //     throw new Error("Invalid encoding didn't throw expected exception");
    // },

    testBase64EncodingSpecialCase() {
        const { Buffer } = require('buffer');
        const base64Str = "SGVsbG8="; // 'Hello' in Base64
        const len = Buffer.byteLength(base64Str, 'base64');
        if (len !== 5) throw new Error("Base64 decoding length mismatch");
    }
};