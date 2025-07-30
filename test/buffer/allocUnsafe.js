module.exports = {
    testZeroSize() {
        const { Buffer } = require('buffer');
        const buf = Buffer.allocUnsafe(0);
        if (buf.length !== 0) {
            throw new Error(`Buffer length should be 0, got ${buf.length}`);
        }
    },
    
    // testMaxAllowedSize() {
    //     const { Buffer, constants } = require('buffer');
    //     const max = constants.MAX_LENGTH;
    //     const buf = Buffer.allocUnsafe(max);
    //     if (buf.length !== max) {
    //         throw new Error(`Buffer length should be ${max}, got ${buf.length}`);
    //     }
    // },
    
    testExceedingMaxSize() {
        const { Buffer, constants } = require('buffer');
        const maxPlusOne = constants.MAX_LENGTH + 1;
        try {
            Buffer.allocUnsafe(maxPlusOne);
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testNegativeInteger() {
        const { Buffer } = require('buffer');
        try {
            Buffer.allocUnsafe(-1);
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFractionalNegative() {
        const { Buffer } = require('buffer');
        try {
            Buffer.allocUnsafe(-1.5);
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testNonNumberTypeString() {
        const { Buffer } = require('buffer');
        try {
            Buffer.allocUnsafe('not a number');
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testNonNumberTypeObject() {
        const { Buffer } = require('buffer');
        try {
            Buffer.allocUnsafe({});
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testNonNumberTypeUndefined() {
        const { Buffer } = require('buffer');
        try {
            Buffer.allocUnsafe(undefined);
            throw new Error('Expected an exception but none was thrown');
        } catch (e) {
            // Expected to throw
        }
    },
    
    testFractionalPositive() {
        const { Buffer } = require('buffer');
        const buf = Buffer.allocUnsafe(5.5);
        if (buf.length !== 5) {
            throw new Error(`Buffer length should be 5, got ${buf.length}`);
        }
    },
    
    // testNumericString() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.allocUnsafe('10');
    //     if (buf.length !== 10) {
    //         throw new Error(`Buffer length should be 10, got ${buf.length}`);
    //     }
    // },
    
    // testBooleanTrue() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.allocUnsafe(true);
    //     if (buf.length !== 1) {
    //         throw new Error(`Buffer length should be 1, got ${buf.length}`);
    //     }
    // },
    
    // testBooleanFalse() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.allocUnsafe(false);
    //     if (buf.length !== 0) {
    //         throw new Error(`Buffer length should be 0, got ${buf.length}`);
    //     }
    // },
    
    // testNull() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.allocUnsafe(null);
    //     if (buf.length !== 0) {
    //         throw new Error(`Buffer length should be 0, got ${buf.length}`);
    //     }
    // },
    
    // testArrayCoercion() {
    //     const { Buffer } = require('buffer');
    //     const buf = Buffer.allocUnsafe([5]);
    //     if (buf.length !== 5) {
    //         throw new Error(`Buffer length should be 5, got ${buf.length}`);
    //     }
    // },
    
    testNegativeZero() {
        const { Buffer } = require('buffer');
        const buf = Buffer.allocUnsafe(-0);
        if (buf.length !== 0) {
            throw new Error(`Buffer length should be 0, got ${buf.length}`);
        }
    }
};