module.exports = {
    testBufferIndexOfStringIncluded() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abcdefgh');
        const result = buf.indexOf('cde');
        if (result !== 2) throw new Error(`Expected position 2, got ${result}`);
    },
    
    testBufferLastIndexOfStringFound() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abcabc');
        const result = buf.lastIndexOf('abc');
        if (result !== 3) throw new Error(`Expected position 3, got ${result}`);
    },
    
    testBufferIncludesBufferType() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('test content');
        const searchBuf = Buffer.from('content');
        if (!buf.includes(searchBuf)) throw new Error('Buffer should include search content');
    },
    
    testBufferIndexOfNegativeOffset() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abcdef');
        const result = buf.indexOf('c', -5);
        if (result !== 2) throw new Error(`Negative offset failed, got ${result}`);
    },
    
    testBufferLastIndexOfBeyondLength() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abcd');
        const result = buf.lastIndexOf('a', 20);
        if (result !== 0) throw new Error(`Should find first a, got ${result}`);
    },
    
    testBufferIndexOfInvalidValueType() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(5);
        let errorOccurred = false;
        try {
            buf.indexOf({ invalid: 'type' });
        } catch (e) {
            errorOccurred = true;
        }
        if (!errorOccurred) throw new Error('Expected exception for invalid value type');
    },
    
    testBufferIncludesWithEncoding() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('café', 'utf8');
        const result = buf.includes('é', 0, 'utf8');
        if (!result) throw new Error('UTF8 character not found');
    },
    
    testBufferIncludesEmptyBuffer() {
        const { Buffer } = require('buffer');
        const emptyBuf = Buffer.alloc(0);
        if (emptyBuf.includes('a')) throw new Error('Empty buffer should not include anything');
    },
    
    testBufferIndexOfZeroLengthSearch() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abc');
        const result = buf.indexOf('');
        if (result !== 0) throw new Error(`Expected 0 for empty search, got ${result}`);
    },
    
    testBufferLastIndexOfNaNOffset() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abc');
        const result = buf.lastIndexOf('a', NaN);
        if (result !== 0) throw new Error('NaN offset should be treated as 0');
    },
    
    testBufferIncludesInvalidEncoding() {
        const { Buffer } = require('buffer');
        const buf = Buffer.alloc(3);
        let errorOccurred = false;
        try {
            buf.includes('a', 0, 'invalid-encoding');
        } catch (e) {
            errorOccurred = true;
        }
        if (!errorOccurred) throw new Error('Expected exception for invalid encoding');
    },
    
    testBufferIndexOfPartialEndMatch() {
        const { Buffer } = require('buffer');
        const buf = Buffer.from('abcd');
        const result = buf.indexOf('cde');
        if (result !== -1) throw new Error('Partial match should return -1');
    }
};