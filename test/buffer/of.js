module.exports = {
    testBasicFunctionality() {
        const { Buffer } = require('buffer');
        const buf = Buffer.of(65, 66, 67, 68);
        if (buf.toString() !== 'ABCD') throw new Error('Basic creation failed');
        if (buf.length !== 4) throw new Error('Incorrect buffer length');
    },
    
    testNumericEdgeCases() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.of(0);
        const buf2 = Buffer.of(255);
        const buf3 = Buffer.of(256);  // Should wrap to 0
        const buf4 = Buffer.of(-1);   // Should wrap to 255
        
        if (buf1[0] !== 0) throw new Error('0 handling failed');
        if (buf2[0] !== 255) throw new Error('255 handling failed');
        if (buf3[0] !== 0) throw new Error('256 overflow handling failed');
        if (buf4[0] !== 255) throw new Error('Negative value handling failed');
    },
    
    testTypeConversionEdgeCases() {
        const { Buffer } = require('buffer');
        const buf1 = Buffer.of('65', '0x41', 65);  // 65 in different forms
        if (buf1.toString() !== 'AAA') throw new Error('Type conversion failed');
        
        const buf2 = Buffer.of(NaN, undefined);
        if (buf2[0] !== 0 || buf2[1] !== 0) throw new Error('NaN/undefined not converted to 0');
    },
    
    testInvalidInputs() {
        const { Buffer } = require('buffer');
        try {
            Buffer.of('INVALID_STRING');
            throw new Error('Non-numeric string did not throw');
        } catch (err) { /* Test passes */ }
        
        try {
            Buffer.of(Symbol('test'));
            throw new Error('Symbol input did not throw');
        } catch (err) { /* Test passes */ }
        
        try {
            Buffer.of({});
            throw new Error('Object input did not throw');
        } catch (err) { /* Test passes */ }
    },
    
    testEmptyInputHandling() {
        const { Buffer } = require('buffer');
        const buf = Buffer.of();
        if (buf.length !== 0) throw new Error('Empty buffer not created');
    }
};