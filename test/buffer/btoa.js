module.exports = {
    testEncodeEmptyString() {
        const targetModule = require('buffer');
        const result = targetModule.btoa('');
        if (result !== '') {
            throw new Error(`Empty string encoding failed. Got '${result}' instead of ''`);
        }
    },
    testEncodeSingleCharacter() {
        const targetModule = require('buffer');
        const result = targetModule.btoa('a');
        if (result !== 'YQ==') {
            throw new Error(`'a' encoding failed. Got '${result}' instead of 'YQ=='`);
        }
    },
    testEncodeTwoCharacters() {
        const targetModule = require('buffer');
        const result = targetModule.btoa('ab');
        if (result !== 'YWI=') {
            throw new Error(`'ab' encoding failed. Got '${result}' instead of 'YWI='`);
        }
    },
    testEncodeThreeCharacters() {
        const targetModule = require('buffer');
        const result = targetModule.btoa('abc');
        if (result !== 'YWJj') {
            throw new Error(`'abc' encoding failed. Got '${result}' instead of 'YWJj'`);
        }
    },
    testEncodeLatin1Character() {
        const targetModule = require('buffer');
        const result = targetModule.btoa('\u00a9');
        if (result !== 'qQ==') {
            throw new Error(`'©' encoding failed. Got '${result}' instead of 'qQ=='`);
        }
    },
    testInvalidInputNull() {
        const targetModule = require('buffer');
        try {
            targetModule.btoa(null);
            throw new Error('Expected error for null input was not thrown');
        } catch (e) {
            // Expected exception
        }
    },
    testInvalidInputUndefined() {
        const targetModule = require('buffer');
        try {
            targetModule.btoa(undefined);
            throw new Error('Expected error for undefined input was not thrown');
        } catch (e) {
            // Expected exception
        }
    },
    testInvalidInputArray() {
        const targetModule = require('buffer');
        try {
            targetModule.btoa([1, 2, 3]);
            throw new Error('Expected error for array input was not thrown');
        } catch (e) {
            // Expected exception
        }
    },
    testInvalidInputObject() {
        const targetModule = require('buffer');
        try {
            targetModule.btoa({ key: 'value' });
            throw new Error('Expected error for object input was not thrown');
        } catch (e) {
            // Expected exception
        }
    },
    testInvalidInputNonLatin1String() {
        const targetModule = require('buffer');
        try {
            targetModule.btoa('Ω');
            throw new Error('Expected error for non-Latin1 character was not thrown');
        } catch (e) {
            // Expected exception
        }
    }
};