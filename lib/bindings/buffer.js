
/**
 * @type {{
 *    kMaxLength: number,
 *    kStringMaxLength: number,
 * }}
 */
const _esb = esb;

/**
 * @type {{
 *    isBase64String: function(string): boolean,
 *    isLatin1String: function(string): boolean,
 *    byteLengthUtf8: function(string): number,
 *    memcmp: function(ArrayBuffer, ArrayBuffer, number, number, number): number,
 *    memmem: function(ArrayBuffer, ArrayBuffer, number, boolean): number,
 *    swap16: function(ArrayBuffer): void,
 *    swap32: function(ArrayBuffer): void,
 *    swap64: function(ArrayBuffer): void,
 *    isUtf8: function(ArrayBuffer): boolean,
 *    isAscii: function(ArrayBuffer): boolean, 
 *    kMaxLength: function(): number,
 *    base64Slice: function(ArrayBuffer, number, number, boolean): string,  // buf, start, end, isUrl
 *    latin1Slice: function(ArrayBuffer, number, number, boolean): string,  // buf, start, end, isAscii
 *    hexSlice: function(ArrayBuffer, number, number): string,
 *    ucs2Slice: function(ArrayBuffer, number, number): string,
 *    utf8Slice: function(ArrayBuffer, number, number): string,
 *    base64Write: function(ArrayBuffer, string, number, number, boolean): number,  // buf, str, offset, length, isUrl
 *    hexWrite: function(ArrayBuffer, string, number, number): number,
 *    ucs2Write: function(ArrayBuffer, string, number, number): number,
 *    latin1Write: function(ArrayBuffer, string, number, number, boolean): number,  // buf, str, offset, length, isAscii
 *    utf8Write: function(ArrayBuffer, string, number, number): number,
 * }}
 */
const _natives = natives.buffer;

/**
 * @type {{
 *    validateString: function(value, name): void,
 *    validateBuffer: function(value, name): void,
 *    validateInteger: function(value, name, min, max): void,
 * }}
 */
const validators = require('internal/validators');

/**
 * @type {{
 *   isArrayBufferView: function(o): boolean
 * }}
 */
const types = require('internal/util/types');


function atob(str) {
    validators.validateString(str, 'str');

    if(str.length % 4 !== 0) {
        return -1
    }

    if(!_natives.isBase64String(str)) {
        return -2
    }

    const bufLength = Math.ceil(str.length * 3 / 4);
    const buf = new ArrayBuffer(bufLength);
    
    const bytesWritten = _natives.base64Write(buf, str, 0, str.length, false);
    return _natives.latin1Slice(buf, 0, bytesWritten, false);
}

function btoa(str) {
    validators.validateString(str, 'str');
    if(!_natives.isLatin1String(str)){
        return -1;
    }

    const bufLength = str.length;
    const buf = new ArrayBuffer(bufLength);

    const bytesWritten = _natives.latin1Write(buf, str, 0, str.length, false);
    return _natives.base64Slice(buf, 0, bytesWritten, false);
}

function byteLengthUtf8(str) {
    validators.validateString(str, 'str');
    return _natives.byteLengthUtf8(str);
}

/**
 * @param {ArrayBufferView} source 
 * @param {ArrayBufferView} target 
 * @param {number} targetStart 
 * @param {number} sourceStart 
 * @param {number} sourceEnd 
 */
function copy(
    source, target, targetStart, sourceStart, sourceEnd
) {
    validators.validateBuffer(source, 'source');
    validators.validateBuffer(target, 'target');

    if (!targetStart) targetStart = 0;
    if (!sourceStart) sourceStart = 0;
    if (!sourceEnd) sourceEnd = source.length;

    const length = sourceEnd - sourceStart;

    if (sourceStart < 0 || sourceEnd > source.length) {
        throw new RangeError('sourceStart or sourceEnd out of bounds');
    }
    if (targetStart < 0 || targetStart + length > target.length) {
        throw new RangeError('targetStart out of bounds');
    }

    const sourceBuffer = source.buffer;
    const targetBuffer = target.buffer;

    const sourceByteOffset = source.byteOffset + sourceStart * source.BYTES_PER_ELEMENT;
    const targetByteOffset = target.byteOffset + targetStart * target.BYTES_PER_ELEMENT;
    const byteLength = length * source.BYTES_PER_ELEMENT;

    const sourceView = new Uint8Array(sourceBuffer, sourceByteOffset, byteLength);
    const targetView = new Uint8Array(targetBuffer, targetByteOffset, byteLength);

    targetView.set(sourceView);
}

function compare(buf1, buf2) {
    return compareOffset(buf1, buf2, 0, 0, buf1.length, buf2.length);
}

/**
 * @param {ArrayBufferView} buf1 
 * @param {ArrayBufferView} buf2 
 */
function compareOffset(buf1, buf2, targetStart, sourceStart, targetEnd, sourceEnd) {
    validators.validateBuffer(buf1, 'source');
    validators.validateBuffer(buf2, 'target');

    if (!targetStart) targetStart = 0;
    if (!sourceStart) sourceStart = 0;
    if (!targetEnd) targetEnd = buf1.length;
    if (!sourceEnd) sourceEnd = buf2.length;

    const targetLength = targetEnd - targetStart;
    const sourceLength = sourceEnd - sourceStart;

    if (targetStart < 0 || targetEnd > buf1.length) {
        throw new RangeError('targetStart or targetEnd out of bounds for buf1');
    }
    if (sourceStart < 0 || sourceEnd > buf2.length) {
        throw new RangeError('sourceStart or sourceEnd out of bounds for buf2');
    }

    if (targetLength === sourceLength) {
        return _natives.memcmp(
            buf1.buffer, buf2.buffer, 
            targetStart, sourceStart,
            targetLength
        );
    }

    if (targetLength < sourceLength) {
        return 1;
    }

    if (targetLength > sourceLength) {
        return -1;
    }
}

/**
 * @param {ArrayBufferView} buffer 
 * @param {*} value 
 * @param {*} offset 
 * @param {*} end 
 * @param {*} encoding 
 */
function fill(buffer, value, offset, end, encoding) {
    validators.validateBuffer(buffer)

    offset = Number(offset) || 0;
    end = Number(end) || buffer.length;

    const fillLength = end - offset;
    if (offset < 0 || end > buffer.length || offset > end) {
        throw new RangeError('Index out of range');
    }

    const target = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset + offset,
        fillLength
    );

    if (ArrayBuffer.isView(value)) {
        const source = new Uint8Array(
            value.buffer,
            value.byteOffset,
            value.byteLength
        );

        // Copy source to target in chunks
        const bytesToCopy = Math.min(source.length, fillLength);
        target.set(source.subarray(0, bytesToCopy));

        // Repeat pattern if source is shorter than target
        if (bytesToCopy < fillLength) {
            for (let i = bytesToCopy; i < fillLength; i += bytesToCopy) {
                const chunkSize = Math.min(bytesToCopy, fillLength - i);
                target.set(target.subarray(0, chunkSize), i);
            }
        }
    } else if (typeof value === 'number') {
        const byteValue = value & 0xFF; // truncate to 8 bits
        target.fill(byteValue);
    } else if (typeof value === 'string') {
        validators.validateString(value, 'value');

        // null str
        if (value.length === 0) { target.fill(0); return; }

        encoding = encoding || 'utf8';

        let bytesNeeded;
        switch (encoding.toLowerCase()) {
            case 'ascii':
            case 'latin1':
                bytesNeeded = value.length;
                break;
            case 'utf8':
                bytesNeeded = _natives.byteLengthUtf8(value);
                break;
            case 'utf16le':
                bytesNeeded = value.length * 2;
                break;
            case 'base64':
            case 'base64url':
                bytesNeeded = Math.ceil(value.length * 3 / 4);
                break;
            case 'hex':
                bytesNeeded = Math.ceil(value.length / 2);
                break;
            default:
                throw new TypeError(`Unknown encoding: ${encoding}`);
        }

        const tempBuffer = new ArrayBuffer(bytesNeeded);
        
        let bytesWritten;
        switch (encoding.toLowerCase()) {
            case 'ascii':
                bytesWritten = _natives.latin1Write(tempBuffer, value, 0, value.length, true);
                break;
            case 'latin1':
                bytesWritten = _natives.latin1Write(tempBuffer, value, 0, value.length, false);
                break;
            case 'utf8':
                bytesWritten = _natives.utf8Write(tempBuffer, value, 0, bytesNeeded);
                break;
            case 'utf16le':
                bytesWritten = _natives.ucs2Write(tempBuffer, value, 0, bytesNeeded);
                break;
            case 'base64':
                bytesWritten = _natives.base64Write(tempBuffer, value, 0, value.length, false);
                break;
            case 'base64url':
                bytesWritten = _natives.base64Write(tempBuffer, value, 0, value.length, true);
                break;
            case 'hex':
                bytesWritten = _natives.hexWrite(tempBuffer, value, 0, value.length);
                break;
        }

        const pattern = new Uint8Array(tempBuffer, 0, bytesWritten);
        const patternLength = pattern.length;
        
        if (patternLength === 0) {
            target.fill(0);
            return;
        }

        target.set(pattern.subarray(0, Math.min(patternLength, fillLength)));
        
        let filled = patternLength;
        while (filled < fillLength) {
            const copySize = Math.min(patternLength, fillLength - filled);
            target.copyWithin(offset + filled, offset, offset + copySize);
            filled += copySize;
        }
    } else {
        throw new TypeError('Unsupported value type');
    }
}

/**
 * 
 * @param {ArrayBufferView} haystack 
 * @param {ArrayBufferView} needle 
 */
function indexOfBuffer(haystack, needle, offset, encoding, isForward) {
    validators.validateBuffer(haystack);
    validators.validateBuffer(needle);

    offset = offset || 0;
    isForward = isForward || true;

    if (offset < 0 || offset >= haystack.byteLength) {
        throw new RangeError('offset is out of bounds');
    }

    return _natives.memmem(haystack.buffer, needle.buffer, offset, isForward);
}

/**
 * @param {ArrayBufferView} buffer 
 */
function indexOfNumber(buffer, value, offset, isForward) {
    validators.validateBuffer(buffer, 'buffer');
    validators.validateInteger(value, 'value');

    offset = offset || 0;

    const bufferView = new Uint8Array(
        buffer.buffer,
        buffer.byteOffset + offset,
        buffer.byteLength - offset
    );

    if (isForward) {
        return bufferView.indexOf(value);
    } else {
        return bufferView.lastIndexOf(value);
    }
}

function indexOfString(buffer, value, offset, encoding) {
    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(value, 'value');

    const { encodingsMap } = require('internal/util');

    let needle;

    switch(encoding){
        case encodingsMap.utf8:
            needle = new ArrayBuffer(_natives.byteLengthUtf8(value));
            _natives.utf8Write(needle, value, 0, needle.byteLength);
            break;
        case encodingsMap.utf16le:
            needle = new ArrayBuffer(value.length * 2);
            _natives.ucs2Write(needle, value, 0, needle.byteLength);
            break;
        case encodingsMap.latin1:
            needle = new ArrayBuffer(value.length);
            _natives.latin1Write(needle, value, 0, needle.byteLength, false);
            break;
        default:
            throw new Error('Invalid encoding');
    }

    return indexOfBuffer(buffer, {buffer: needle}, offset);
}

function copyArrayBuffer(dest, destOffset, src, srcOffset, bytesToCopy) {
    copy(src, dest, destOffset, srcOffset, srcOffset+bytesToCopy)
}

/**
 * 
 * @param {ArrayBufferView} buf 
 */
function swap16(buf) {
    validators.validateBuffer(buf, 'buf');
    if(buf.buffer.byteLength % 2 !== 0){
        throw new Error("Buffer size must be a multiple of 16-bits.")
    }
    _natives.swap16(buf.buffer)
}

function swap32(buf) {
    validators.validateBuffer(buf, 'buf');
    if(buf.buffer.byteLength % 4 !== 0){
        throw new Error("Buffer size must be a multiple of 32-bits.")
    }
    _natives.swap32(buf.buffer)
}

function swap64(buf) {
    validators.validateBuffer(buf, 'buf');
    if(buf.buffer.byteLength % 8 !== 0){
        throw new Error("Buffer size must be a multiple of 64-bits.")
    }
    _natives.swap64(buf.buffer)
}

function isUtf8(buf){
    validators.validateBuffer(buf);
    return _natives.isUtf8(buf.buffer);
}

function isAscii(buf){
    validators.validateBuffer(buf);
    return _natives.isAscii(buf.buffer);
}

/**
 * @param {ArrayBufferView} buffer 
 */
function asciiSlice(start, end) {

    const buffer = this;
    
    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.latin1Slice(buffer.buffer, start, end, true);
}

function base64Slice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.base64Slice(buffer.buffer, start, end, false);
}

function base64urlSlice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.base64Slice(buffer.buffer, start, end, true);
}

function latin1Slice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.latin1Slice(buffer.buffer, start, end, false);
}

function hexSlice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.hexSlice(buffer.buffer, start, end);
}

function ucs2Slice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.ucs2Slice(buffer.buffer, start, end);
}

function utf8Slice(start, end) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');

    start = start || 0;
    end = end || buffer.byteLength;

    if (start < 0) { start = 0; }
    if (end > buffer.byteLength) { end = buffer.byteLength; }
    if (end < start) { return ""; }

    return _natives.utf8Slice(buffer.buffer, start, end);
}

function base64Write(string, offset, length) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;
    
    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.base64Write(buffer.buffer, string, offset, length, false);
}

function base64urlWrite(string, offset, length) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.base64Write(buffer.buffer, string, offset, length, true);
}

function hexWrite(string, offset, length) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.hexWrite(buffer.buffer, string, offset, length);
}

function ucs2Write(string, offset, length) {

    const buffer = this;

    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.ucs2Write(buffer.buffer, string, offset, length);
}

function asciiWriteStatic(buffer, string, offset, length) {
    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.latin1Write(buffer.buffer, string, offset, length, true);
}

function latin1WriteStatic(buffer, string, offset, length) {
    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.latin1Write(buffer.buffer, string, offset, length, false);
}

function utf8WriteStatic(buffer, string, offset, length) {
    validators.validateBuffer(buffer, 'buffer');
    validators.validateString(string, 'string');

    offset = offset || 0;
    length = length || buffer.length - offset;

    if ( offset < 0) { offset = 0; }
    if (length < 0) { length = 0; }
    if (offset > buffer.length) { return 0; }
    if (offset + length > buffer.length) { length = buffer.length - offset; }

    return _natives.utf8Write(buffer.buffer, string, offset, length);
}

const zeroFillToggle = Uint32Array.from([1]);


module.exports = {
    atob,
    btoa,
    byteLengthUtf8,
    copy,
    compare,
    compareOffset,
    fill,
    indexOfBuffer,
    indexOfNumber,
    indexOfString,
    copyArrayBuffer,
    swap16,
    swap32,
    swap64,
    isUtf8,
    isAscii,
    kMaxLength: Math.min(_esb.kMaxLength, _natives.kMaxLength()),
    kStringMaxLength: _esb.kStringMaxLength,
    asciiSlice,
    base64Slice,
    base64urlSlice,
    latin1Slice,
    hexSlice,
    ucs2Slice,  
    utf8Slice,
    base64Write,
    base64urlWrite,
    hexWrite,
    ucs2Write,
    asciiWriteStatic,
    latin1WriteStatic,
    utf8WriteStatic,
    getZeroFillToggle: () => zeroFillToggle,
}