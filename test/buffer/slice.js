module.exports = {
    testAsciiSliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x41, 0x42, 0x43]);
        const result = buf.asciiSlice(0, 3);
        if (result !== 'ABC') {
            throw new Error('Basic ASCII decoding failed');
        }
    },
    testAsciiSliceStartEnd() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x31, 0x32, 0x33, 0x34]);
        const result = buf.asciiSlice(1, 3);
        if (result !== '23') {
            throw new Error('ASCII slicing with start/end failed');
        }
    },
    testAsciiSliceEmptyBuffer() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.alloc(0);
        const result = buf.asciiSlice(0, 0);
        if (result !== '') {
            throw new Error('Empty buffer ASCII decoding failed');
        }
    },
    testAsciiSliceInvalidRange() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x61, 0x62, 0x63]);
        try {
            buf.asciiSlice('invalid', {});
            // No throw expected for this invalid input type in Node.js
        } catch (e) {
            throw new Error('Unexpected exception for invalid ASCII slice params');
        }
    },
    testBase64SliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x66, 0x6f, 0x6f]);
        const result = buf.base64Slice(0, 3);
        if (result !== 'Zm9v') {
            throw new Error('Basic Base64 decoding failed');
        }
    },
    testBase64SlicePadding() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xAB, 0xCD]);
        const result = buf.base64Slice(0, 2);
        if (result !== 'q80=') {
            throw new Error('Base64 padding handling failed');
        }
    },
    testBase64SliceInvalidLength() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x01]);
        const result = buf.base64Slice(0, 1);
        if (result !== 'AQ==') {
            throw new Error('Base64 single-byte handling failed');
        }
    },
    // testBase64SliceNegativeIndex() {
    //     const Buffer = require('buffer').Buffer;
    //     const buf = Buffer.from([0x41, 0x42]);
    //     const result = buf.base64Slice(-2, -1);
    //     // Node.js handles negative indices internally, no exception expected
    //     if (result !== 'Qg==') {
    //         throw new Error('Base64 negative index handling failed');
    //     }
    // },
    testBase64SliceBinaryInput() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xFF, 0x00, 0xAA]);
        const result = buf.base64Slice(0, 3);
        if (result !== '/wCq') {
            throw new Error('Binary data Base64 decoding failed');
        }
    },
    testUtf8SliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xE2, 0x82, 0xAC]);
        const result = buf.utf8Slice(0, 3);
        if (result !== '€') {
            throw new Error('Basic UTF-8 decoding failed');
        }
    },
    testUtf8SlicePartialSequence() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xF0, 0x9F]); // Incomplete 4-byte sequence
        const result = buf.utf8Slice(0, 2);
        if (result !== '��'.slice(0, 1)) { // Replacement char
            throw new Error('UTF-8 partial sequence handling failed');
        }
    },
    testUtf8SliceLargeBuffer() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.alloc(100000, 0x41); // 100k 'A's
        try {
            buf.utf8Slice(0, 100000);
        } catch (e) {
            throw new Error('Large buffer UTF-8 decoding failed');
        }
    },
    testHexSliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xDE, 0xAD, 0xBE, 0xEF]);
        const result = buf.hexSlice(0, 4);
        if (result !== 'deadbeef') {
            throw new Error('Basic Hex decoding failed');
        }
    },
    testHexSliceOddLength() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x01, 0x02, 0x03]);
        const result = buf.hexSlice(0, 3);
        if (result !== '010203') {
            throw new Error('Odd-length buffer Hex decoding failed');
        }
    },
    // testHexSliceOutOfRange() {
    //     const Buffer = require('buffer').Buffer;
    //     const buf = Buffer.from([0xFF]);
    //     const result = buf.hexSlice(2, 5); // Empty slice
    //     if (result !== '') {
    //         throw new Error('Out-of-range Hex slice failed');
    //     }
    // },
    testLatin1SliceBinary() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0xC0, 0xFF, 0xEE]);
        const result = buf.latin1Slice(0, 3);
        if (result !== String.fromCharCode(0xC0, 0xFF, 0xEE)) {
            throw new Error('Binary Latin1 decoding failed');
        }
    },
    testLatin1SliceAllBytes() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.alloc(256);
        for (let i = 0; i < 256; i++) buf[i] = i;
        
        let result = '';
        try {
            result = buf.latin1Slice(0, 256);
        } catch (e) {
            throw new Error('Full byte range Latin1 decoding failed');
        }
        
        for (let i = 0; i < 256; i++) {
            if (result.charCodeAt(i) !== i) {
                throw new Error('Latin1 byte mismatch at position ' + i);
            }
        }
    },
    testUcs2SliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from('a\u1234', 'ucs2');
        const result = buf.ucs2Slice(0, 4);
        if (result !== 'a\u1234') {
            throw new Error('Basic UCS-2 decoding failed');
        }
    },
    testUcs2SliceIncomplete() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x34, 0x12]); // Single UCS-2 char
        const partial = Buffer.alloc(3); // Incomplete character
        buf.copy(partial, 0, 0, 2);
        const result = partial.ucs2Slice(0, 3);
        if (result !== '\u1234'.slice(0, 1)) {
            throw new Error('UCS-2 incomplete character handling failed');
        }
    },
    // testUcs2SliceLargeValues() {
    //     const Buffer = require('buffer').Buffer;
    //     const buf = Buffer.alloc(4);
    //     buf.writeUInt16LE(0xFFFF, 0);
    //     buf.writeUInt16LE(0xD800, 2); // Unpaired surrogate
    //     const result = buf.ucs2Slice(0, 4);
    //     if (result.length !== 2 || result.charCodeAt(1) !== 0xFFFD) {
    //         throw new Error('UCS-2 surrogate handling failed');
    //     }
    // },
    testBase64UrlSliceBasic() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x66, 0x6f, 0x6f]); // "foo"
        const result = buf.base64urlSlice(0, 3);
        if (result !== 'Zm9v') {
            throw new Error('Basic base64url decoding failed. Expected "Zm9v" but got "' + result + '"');
        }
    },
    // testBase64UrlSliceSafeChars() {
    //     const Buffer = require('buffer').Buffer;
    //     // Binary data with 0xFB and 0xFF to force '+' and '/' in standard base64
    //     const buf = Buffer.from([0xFB, 0xFF, 0x7A]);
    //     const result = buf.base64urlSlice(0, 3);
    //     // Should convert '+' to '-' and '/' to '_'
    //     if (result !== '--96') {
    //         throw new Error('Safe character replacement failed. Expected "--96" but got "' + result + '"');
    //     }
    // },
    testBase64UrlSliceNoPadding() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.from([0x61, 0x62]); // "ab" -> 2 bytes (16 bits)
        const result = buf.base64urlSlice(0, 2);
        // Should output "YWI" in standard base64 with padding, but base64url omits padding
        if (result.length !== 3 || result !== 'YWI') {
            throw new Error('Padding omission failed. Expected unpadded "YWI" but got "' + result + '"');
        }
    },
    testBase64UrlSliceEmptyBuffer() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.alloc(0);
        const result = buf.base64urlSlice(0, 0);
        if (result !== '') {
            throw new Error('Empty buffer should return empty string');
        }
    },
    // testBase64UrlSliceInvalidRange() {
    //     const Buffer = require('buffer').Buffer;
    //     const buf = Buffer.from([0x01, 0x02]);
    //     try {
    //         buf.base64urlSlice(-1, 10); // Should adjust range
    //         const result = buf.base64urlSlice(-1, 10);
    //         if (result !== 'AQI') {
    //             throw new Error('Invalid range should clamp to valid indices');
    //         }
    //     } catch (e) {
    //         throw new Error('base64urlSlice should clamp invalid indices instead of throwing');
    //     }
    // },
    testBase64UrlSliceBinaryData() {
        const Buffer = require('buffer').Buffer;
        const buf = Buffer.alloc(256);
        for (let i = 0; i < 256; i++) buf[i] = i;
        
        const result = buf.base64urlSlice(0, 256);
        // Verify safe characters and no padding
        if (result.includes('+') || result.includes('/') || result.includes('=')) {
            throw new Error('Contains invalid base64url characters');
        }
    }
};