module.exports = {
    testCopyBytesFromBasicOperation() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const source = new Uint8Array([0x41, 0x42, 0x43]); // 'ABC'
        const dest = Buffer.alloc(3);
        dest.copyBytesFrom(source);
        assert.deepStrictEqual(dest.toString(), 'ABC');
    },

    testCopyBytesFromWithOffset() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const source = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]); // 'hello'
        const dest = Buffer.alloc(7); // <Buffer 00 00 00 00 00 00 00>
        dest.copyBytesFrom(source, 2);
        assert.deepStrictEqual(
            dest, 
            Buffer.from([0x00, 0x00, 0x68, 0x65, 0x6c, 0x6c, 0x6f])
        );
    },

    testCopyBytesFromWithBase64urlEncoding() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        // Create source via base64url encoding
        const decoded = 'Node.js✓';
        const base64urlEncoded = Buffer.from(decoded).toString('base64url');
        
        // Convert to TypedArray
        const sourceBuf = Buffer.from(base64urlEncoded, 'base64url');
        const source = new Uint8Array(
            sourceBuf.buffer,
            sourceBuf.byteOffset,
            sourceBuf.byteLength
        );
        
        // Copy using target method
        const dest = Buffer.alloc(source.length);
        dest.copyBytesFrom(source);
        
        // Verify via base64url encoding
        assert.strictEqual(
            dest.toString('base64url'),
            base64urlEncoded
        );
    },

    testCopyBytesFromWithDataViewSource() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const data = new Uint8Array([0x74, 0x65, 0x73, 0x74]);
        const view = new DataView(data.buffer);
        const dest = Buffer.alloc(4);
        dest.copyBytesFrom(view);
        assert.deepStrictEqual(dest, Buffer.from('test'));
    },

    testCopyBytesFromThrowsOnInvalidSource() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const dest = Buffer.alloc(1);
        assert.throws(
            () => dest.copyBytesFrom('invalid_source'),
            { name: 'TypeError' }
        );
    },

    testCopyBytesFromThrowsOnNegativeOffset() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const dest = Buffer.alloc(3);
        assert.throws(
            () => dest.copyBytesFrom(new Uint8Array(2), -1),
            { name: 'RangeError' }
        );
    },

    testCopyBytesFromThrowsOnOffsetOverflow() {
        const { Buffer } = require('buffer');
        const assert = require('assert');
        
        const dest = Buffer.alloc(5);
        const source = new Uint8Array(10);
        assert.throws(
            () => dest.copyBytesFrom(source, 3),
            { name: 'RangeError' }
        );
    }
};