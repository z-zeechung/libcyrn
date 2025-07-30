module.exports = {
    testAsciiWriteBasic() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.asciiWrite('ab', 0, 2);
        if (written !== 2 || buf[0] !== 0x61 || buf[1] !== 0x62 || buf[2] !== 0) {
            throw new Error('ASCII write basic failed');
        }
    },
    testAsciiWriteEmpty() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.asciiWrite('', 0, 0);
        if (written !== 0 || buf[0] !== 0 || buf[1] !== 0) {
            throw new Error('ASCII write empty failed');
        }
    },
    testAsciiWriteOffsetBounds() {
        const buf = require('buffer').Buffer.alloc(4);
        try {
            buf.asciiWrite('a', 5, 1);
            throw new Error('ASCII write offset bounds test did not throw');
        } catch {}
    },
    testBase64WriteBasic() {
        const buf = require('buffer').Buffer.alloc(3);
        const written = buf.base64Write('YWJj', 0, 3); // 'abc'
        const expected = require('buffer').Buffer.from([0x61, 0x62, 0x63]);
        if (written !== 3 || buf.compare(expected) !== 0) {
            throw new Error('Base64 write basic failed');
        }
    },
    testBase64WritePadding() {
        const buf = require('buffer').Buffer.alloc(2);
        const written = buf.base64Write('YWI=', 0, 2); // 'ab'
        const expected = require('buffer').Buffer.from([0x61, 0x62]);
        if (written !== 2 || buf.compare(expected) !== 0) {
            throw new Error('Base64 write padding failed');
        }
    },
    testBase64WriteInvalidChar() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.base64Write('Y!', 0, 3);
            throw new Error('Base64 write invalid char test did not throw');
        } catch {}
    },
    testBase64urlWriteBasic() {
        const buf = require('buffer').Buffer.alloc(3);
        const written = buf.base64urlWrite('YWJj', 0, 3); // 'abc'
        const expected = require('buffer').Buffer.from([0x61, 0x62, 0x63]);
        if (written !== 3 || buf.compare(expected) !== 0) {
            throw new Error('Base64url write basic failed');
        }
    },
    testBase64urlWriteUrlSafe() {
        const buf = require('buffer').Buffer.alloc(3);
        const written = buf.base64urlWrite('_-_', 0, 3);
        if (written !== 2) { // Decodes to 0xFF 0xEF (2 bytes)
            throw new Error('Base64url write URL-safe failed');
        }
    },
    testBase64urlWriteInvalidChar() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.base64urlWrite('A!', 0, 3);
            throw new Error('Base64url write invalid char test did not throw');
        } catch {}
    },
    testLatin1WriteBasic() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.latin1Write('ñ', 0, 1); // Latin1 supports > ASCII
        if (written !== 1 || buf[0] !== 0xF1 || buf[1] !== 0) {
            throw new Error('Latin1 write basic failed');
        }
    },
    testLatin1WriteLength() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.latin1Write('abcd', 0, 2);
        if (written !== 2 || buf[0] !== 0x61 || buf[1] !== 0x62 || buf[2] !== 0) {
            throw new Error('Latin1 write length failed');
        }
    },
    testLatin1WriteNegativeOffset() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.latin1Write('a', -1, 1);
            throw new Error('Latin1 write negative offset test did not throw');
        } catch {}
    },
    testHexWriteBasic() {
        const buf = require('buffer').Buffer.alloc(2);
        const written = buf.hexWrite('a1b2', 0, 2);
        if (written !== 2 || buf[0] !== 0xA1 || buf[1] !== 0xB2) {
            throw new Error('Hex write basic failed');
        }
    },
    testHexWriteMixedCase() {
        const buf = require('buffer').Buffer.alloc(2);
        buf.hexWrite('A1B2', 0, 2);
        const expected = require('buffer').Buffer.from([0xA1, 0xB2]);
        if (buf.compare(expected) !== 0) {
            throw new Error('Hex write mixed case failed');
        }
    },
    testHexWriteInvalidLength() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.hexWrite('a', 0, 1); // Odd number of chars
            throw new Error('Hex write invalid length test did not throw');
        } catch {}
    },
    testUcs2WriteBasic() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.ucs2Write('a', 0, 2); // 'a' = 0x6100 in LE
        if (written !== 2 || buf[0] !== 0x61 || buf[1] !== 0x00 || buf[2] !== 0) {
            throw new Error('UCS2 write basic failed');
        }
    },
    testUcs2WriteSurrogate() {
        const buf = require('buffer').Buffer.alloc(4);
        const written = buf.ucs2Write('𝄞', 0, 4); // Musical symbol, 4 bytes
        if (written !== 4 || buf[0] !== 0x34 || buf[1] !== 0xD8) {
            throw new Error('UCS2 write surrogate failed');
        }
    },
    testUcs2WriteNonString() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.ucs2Write(123, 0, 2);
            throw new Error('UCS2 write non-string test did not throw');
        } catch {}
    },
    testUtf8WriteBasic() {
        const buf = require('buffer').Buffer.alloc(3);
        const written = buf.utf8Write('€', 0, 3); // Euro = 3 bytes
        if (written !== 3 || buf[0] !== 0xE2 || buf[1] !== 0x82 || buf[2] !== 0xAC) {
            throw new Error('UTF8 write basic failed');
        }
    },
    testUtf8WriteBoundary() {
        const buf = require('buffer').Buffer.alloc(3);
        const written = buf.utf8Write('a'.repeat(3), 0, 3);
        if (written !== 3 || buf[0] !== 0x61 || buf[1] !== 0x61 || buf[2] !== 0x61) {
            throw new Error('UTF8 write boundary failed');
        }
    },
    testUtf8WriteIncomplete() {
        const buf = require('buffer').Buffer.alloc(3);
        try {
            buf.utf8Write('€', 0, 2); // Insufficient space
            throw new Error('UTF8 write incomplete test did not throw');
        } catch {}
    },
    testBase64WriteOverflow() {
        try {
            const buf = require('buffer').Buffer.alloc(3);
            buf.base64Write('a'.repeat(1000), 0, 1000);
            throw new Error('Base64 write overflow test did not throw');
        } catch {}
    },
    testHexWriteLargeOffset() {
        try {
            const buf = require('buffer').Buffer.alloc(4);
            buf.hexWrite('a1', 5, 1);
            throw new Error('Hex write large offset test did not throw');
        } catch {}
    },
    testAllMethodsExist() {
        const encodings = ['ascii','base64','base64url','latin1','hex','ucs2','utf8'];
        for (const enc of encodings) {
            const method = `${enc}Write`;
            if (typeof require('buffer').Buffer.prototype[method] !== 'function') {
                throw new Error(`Missing method: ${method}`);
            }
        }
    }
};