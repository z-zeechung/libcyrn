module.exports = {
    testSwap16WithValidBuffer() {
        const buf = Buffer.from([0x00, 0x01, 0x02, 0x03]);
        buf.swap16();
        const expected = Buffer.from([0x01, 0x00, 0x03, 0x02]);
        if (!buf.equals(expected)) {
            throw new Error("swap16 failed: Incorrect byte swapping");
        }
    },

    testSwap16WithEmptyBuffer() {
        const buf = Buffer.alloc(0);
        buf.swap16();  // Should not throw
        if (buf.length !== 0) {
            throw new Error("swap16 changed zero-length buffer");
        }
    },

    testSwap16WithInvalidLength() {
        const buf = Buffer.alloc(3);  // Not multiple of 2
        let didThrow = false;
        try {
            buf.swap16();
        } catch (e) {
            didThrow = true;
        }
        if (!didThrow) {
            throw new Error("swap16 did not throw with invalid buffer length");
        }
    },

    testSwap32WithValidBuffer() {
        const buf = Buffer.from([0x00, 0x01, 0x02, 0x03]);
        buf.swap32();
        const expected = Buffer.from([0x03, 0x02, 0x01, 0x00]);
        if (!buf.equals(expected)) {
            throw new Error("swap32 failed: Incorrect byte swapping");
        }
    },

    testSwap32WithEmptyBuffer() {
        const buf = Buffer.alloc(0);
        buf.swap32();  // Should not throw
        if (buf.length !== 0) {
            throw new Error("swap32 changed zero-length buffer");
        }
    },

    testSwap32WithInvalidLength() {
        const buf = Buffer.alloc(6);  // Not multiple of 4
        let didThrow = false;
        try {
            buf.swap32();
        } catch (e) {
            didThrow = true;
        }
        if (!didThrow) {
            throw new Error("swap32 did not throw with invalid buffer length");
        }
    },

    testSwap64WithValidBuffer() {
        const buf = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07]);
        buf.swap64();
        const expected = Buffer.from([0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01, 0x00]);
        if (!buf.equals(expected)) {
            throw new Error("swap64 failed: Incorrect byte swapping");
        }
    },

    testSwap64WithEmptyBuffer() {
        const buf = Buffer.alloc(0);
        buf.swap64();  // Should not throw
        if (buf.length !== 0) {
            throw new Error("swap64 changed zero-length buffer");
        }
    },

    testSwap64WithInvalidLength() {
        const buf = Buffer.alloc(7);  // Not multiple of 8
        let didThrow = false;
        try {
            buf.swap64();
        } catch (e) {
            didThrow = true;
        }
        if (!didThrow) {
            throw new Error("swap64 did not throw with invalid buffer length");
        }
    },

    testSwap16WithNonBufferObject() {
        try {
            Buffer.prototype.swap16.call([1, 2, 3, 4]);
            throw new Error("swap16 accepted non-Buffer object");
        } catch (e) {
            // Expected to throw
        }
    },

    testSwap64AfterMultipleOperations() {
        const buf = Buffer.alloc(8);
        buf.fill(0xAA);
        buf.swap64().swap64();  // Double swap should restore
        for (const byte of buf) {
            if (byte !== 0xAA) {
                throw new Error("Double swap64 changed byte values");
            }
        }
    }
};