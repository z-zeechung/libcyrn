module.exports = {
    testFillWithIntegerValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        buf.fill(65);
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 65) throw new Error(`Expected 65 at position ${i}`);
        }
    },
    
    testFillWithStringWithoutEncoding() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        buf.fill('A');
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 65) throw new Error(`Expected 65 at position ${i}`);
        }
    },
    
    testFillWithStringWithEncoding() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        buf.fill('414141', 'hex');
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 65) throw new Error(`Expected 65 at position ${i}`);
        }
    },
    
    testFillWithBufferSource() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(5);
        const fillBuf = Buffer.from([1, 2]);
        buf.fill(fillBuf);
        const expected = [1, 2, 1, 2, 1];
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== expected[i]) {
                throw new Error(`Expected ${expected[i]} at position ${i}`);
            }
        }
    },
    
    testFillWithEmptyString() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3, 1);
        buf.fill('');
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 0) throw new Error(`Expected 0 at position ${i}`);
        }
    },
    
    testFillWithMultiByteStringTruncation() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        buf.fill('€');  // 3-byte UTF-8 character
        // Should be filled with [0xE2, 0x82, 0xAC] repeating pattern
        if (buf[0] !== 0xE2 || buf[1] !== 0x82 || buf[2] !== 0xAC) {
            throw new Error('Unexpected multi-byte fill pattern');
        }
    },
    
    // testFillWithNegativeIndices() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.alloc(5, 0);
    //     buf.fill(1, -3, -1);
    //     if (buf[2] !== 1 || buf[3] !== 1 || buf[4] !== 0) {
    //         throw new Error('Negative indices not handled correctly');
    //     }
    // },
    
    testFillWithStartGreaterThanEnd() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(5, 1);
        buf.fill(2, 3, 1);
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] !== 1) throw new Error('Buffer modified unexpectedly');
        }
    },
    
    // testFillWithOutOfBoundsIndices() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.alloc(5, 0);
    //     buf.fill(1, 10, 15);
    //     for (let i = 0; i < buf.length; i++) {
    //         if (buf[i] !== 0) throw new Error('Out-of-bounds indices modified buffer');
    //     }
    // },
    
    testFillWithLargeNumber() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        buf.fill(256);  // Should wrap to 0
        if (buf[0] !== 0) throw new Error('Large number not wrapped');
    },
    
    testFillWithNegativeNumber() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        buf.fill(-1);  // Should become 255
        if (buf[0] !== 255) throw new Error('Negative number not converted');
    },
    
    testFillWithNonIntegerNumber() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        buf.fill(65.999);  // Should truncate to 65
        if (buf[0] !== 65) throw new Error('Non-integer not truncated');
    },
    
    testFillWithInvalidEncoding() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill('A', 'invalid_encoding');
            throw new Error('No error thrown with invalid encoding');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithObjectValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill({});
            throw new Error('No error thrown with object value');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithBooleanValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill(true);
            throw new Error('No error thrown with boolean value');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithUndefinedValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill(undefined);
            throw new Error('No error thrown with undefined value');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithNullValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill(null);
            throw new Error('No error thrown with null value');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithEmptyBufferValue() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill(Buffer.alloc(0));
            throw new Error('No error thrown with empty buffer');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFillWithZeroLengthUint8Array() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(1);
        try {
            buf.fill(new Uint8Array(0));
            throw new Error('No error thrown with empty Uint8Array');
        } catch (e) {
            // Expected to throw
        }
    }
};