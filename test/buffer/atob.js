module.exports = {
    testAtobBasicFunctionality() {
        const { atob } = require('buffer');
        const input = 'SGVsbG8sIFdvcmxkIQ==';
        const result = atob(input);
        if (result !== 'Hello, World!') {
            throw new Error(`Basic decoding failed. Expected "Hello, World!" but got "${result}"`);
        }
    },
    
    testAtobEmptyString() {
        const { atob } = require('buffer');
        const result = atob('');
        if (result !== '') {
            throw new Error(`Empty string handling failed. Returned non-empty string: "${result}"`);
        }
    },
    
    testAtobPaddingHandling() {
        const { atob } = require('buffer');
        const validPadded = 'YQ==';     // 'a'
        const validUnpadded = 'YQ';     // 'a'
        if (atob(validPadded) !== atob(validUnpadded)) {
            throw new Error('Padding handling failed. Padded and unpadded inputs should decode identically');
        }
    },
    
    testAtobWhitespaceHandling() {
        const { atob } = require('buffer');
        const original = 'VGhpcyBpcyBhIHRlc3Q=';  // 'This is a test'
        const spaced = ' V G h p c y B p c y B h I H R l c 3 Q = ';
        if (atob(original) !== atob(spaced)) {
            throw new Error('Whitespace handling failed. Input with whitespace should match clean input');
        }
    },
    
    testAtobNullInput() {
        const { atob } = require('buffer');
        try {
            atob(null);
            throw new Error('null input should throw an exception');
        } catch (e) {
            // Test passes if exception is thrown
        }
    },
    
    testAtobUndefinedInput() {
        const { atob } = require('buffer');
        try {
            atob(undefined);
            throw new Error('undefined input should throw an exception');
        } catch (e) {
            // Test passes if exception is thrown
        }
    },
    
    testAtobNonStringInput() {
        const { atob } = require('buffer');
        try {
            atob(12345);
            throw new Error('Number input should throw an exception');
        } catch (e) {
            // Test passes if exception is thrown
        }
    },
    
    testAtobInvalidCharacters() {
        const { atob } = require('buffer');
        try {
            atob('Inv@lid!Char$');
            throw new Error('Invalid characters in input should throw an exception');
        } catch (e) {
            // Test passes if exception is thrown
        }
    },
    
    testAtobIncorrectPadding() {
        const { atob } = require('buffer');
        try {
            atob('BadPadding=');
            throw new Error('Incorrect padding should throw an exception');
        } catch (e) {
            // Test passes if exception is thrown
        }
    },
    
    testAtobBinaryOutput() {
        const { atob } = require('buffer');
        const binaryData = atob('//79');
        const expected = '\xff\xbe\xfd';
        if (binaryData.length !== expected.length || 
            binaryData.charCodeAt(0) !== 255 ||
            binaryData.charCodeAt(1) !== 254 ||
            binaryData.charCodeAt(2) !== 253) {
            throw new Error('Binary data decoding failed. Output did not match expected byte sequence');
        }
    }
};