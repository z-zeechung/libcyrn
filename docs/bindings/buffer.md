# `buffer` Internal Binding

Provides low-level operations for working with binary data buffers.

## Global Injections

- `primordials`
- `require` (internal require)
- `internalBinding`
- `natives` (`buffer` C bindings)
- `esb` (engine specific bindings)

## C Interfaces

```c
int64_t kMaxLength(void);
char* atob(const char* encoded);
char* btoa(const char* binary);
int64_t byteLengthUtf8(const char* str);
int64_t copy(
  array_buffer source, array_buffer target, 
  int64_t targetStart, int64_t sourceStart, 
  int64_t targetEnd, int64_t sourceEnd);
int64_t compareOffset(
  array_buffer source, array_buffer target, 
  int64_t targetStart, int64_t sourceStart, 
  int64_t targetEnd, int64_t sourceEnd);
void fill(array_buffer buf, uint8_t value, int64_t offset, int64_t end);
int64_t indexOfBuffer(
  array_buffer source, array_buffer target, int64_t offset);
int64_t indexOfNumber(
  array_buffer buf, uint8_t value, int64_t offset);
void swap16(array_buffer buf);
void swap32(array_buffer buf);
void swap64(array_buffer buf);
bool isUtf8(array_buffer buf);
bool isAscii(array_buffer buf);
char* latin1Slice(array_buffer buf, int64_t start, int64_t end);
char* base64Slice(
  array_buffer buf, int64_t start, int64_t end, bool is_url);
char* hexSlice(array_buffer buf, int64_t start, int64_t end);
char* ucs2Slice(array_buffer buf, int64_t start, int64_t end);
char* utf8Slice(array_buffer buf, int64_t start, int64_t end);
int64_t base64Write(
  array_buffer buf, const char* str, 
  int64_t offset, int64_t length, bool is_url);
int64_t hexWrite(
  array_buffer buf, const char* str, 
  int64_t offset, int64_t length);
int64_t ucs2Write(
  array_buffer buf, const char* str, 
  int64_t offset, int64_t length);
int64_t latin1WriteStatic(
  array_buffer buf, const char* str, 
  int64_t offset, int64_t length);
int64_t utf8WriteStatic(
  array_buffer buf, const char* str, 
  int64_t offset, int64_t length);
void copyArrayBuffer(
  array_buffer dest, int64_t dest_offset, 
  array_buffer src, int64_t src_offset, int64_t bytes_to_copy);
```

## Engine Specific Bindings (ESB)

- kStringMaxLength


## Constants

### `kMaxLength`
Maximum possible length for a Buffer.
**JS Definition**
```typescript
number
```
**Implementation**
Defined in `/src/buffer`:
``` c
int64_t kMaxLength(void);
```

### `kStringMaxLength`
Maximum string length when converting between buffers and strings.
**JS Definition**
```typescript
number
```
**Implementation**
Referred from ESB.

## Encoding/Decoding Functions

### `atob()`
Decodes a base64 encoded string to binary data.
**JS Definition**
```typescript
function atob(encoded: string): string | number;
```
**Returns**
- Decoded binary string on success
- Negative error code on failure:
  - -1: Input remainder error
  - -2: Invalid base64 character
  - -3: Possible overflow

**Implementation**
Implemented in `/src/buffer`:
``` c
char* atob(const char* encoded);
```

### `btoa()`
Encodes binary data to a base64 string.
**JS Definition**
```typescript
function btoa(binary: string): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* btoa(const char* binary);
```

## Buffer Operations

### `byteLengthUtf8()`
Calculates the byte length of a UTF-8 encoded string.
**JS Definition**
```typescript
function byteLengthUtf8(str: string): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t byteLengthUtf8(const char* str);
```

### `copy()`
Copies data between buffers.
**JS Definition**
```typescript
function copy(
  source: ArrayBufferView,
  target: ArrayBufferView,
  targetStart?: number,
  sourceStart?: number,
  sourceEnd?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t copy(
  array_buffer source, array_buffer target, 
  int64_t targetStart, int64_t sourceStart, 
  int64_t targetEnd, int64_t sourceEnd
);
```

### `compare()`
Compares two buffers.
**JS Definition**
```typescript
function compare(buf1: ArrayBufferView, buf2: ArrayBufferView): number;
```
**Returns**
- 0 if equal
- 1 if buf1 > buf2
- -1 if buf1 < buf2
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t compareOffset(
  array_buffer source, array_buffer target, 
  int64_t targetStart, int64_t sourceStart, 
  int64_t targetEnd, int64_t sourceEnd
);
```

### `compareOffset()`
Compares buffers with offsets.
**JS Definition**
```typescript
function compareOffset(
  buf1: ArrayBufferView,
  buf2: ArrayBufferView,
  targetStart: number,
  sourceStart: number,
  targetEnd: number,
  sourceEnd: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t compareOffset(
  array_buffer source, array_buffer target, 
  int64_t targetStart, int64_t sourceStart, 
  int64_t targetEnd, int64_t sourceEnd
);
```

### `fill()`
Fills a buffer with specified value.
**JS Definition**
```typescript
function fill(
  buffer: ArrayBufferView,
  value: any,
  offset?: number,
  end?: number,
  encoding?: BufferEncoding
): Buffer;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
void fill(array_buffer buf, uint8_t value, int64_t offset, int64_t end);
```

### `indexOfBuffer()`
Finds a buffer within another buffer.
**JS Definition**
```typescript
function indexOfBuffer(
  haystack: ArrayBufferView,
  needle: ArrayBufferView,
  offset?: number,
  encoding?: BufferEncoding
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t indexOfBuffer(
  array_buffer source, array_buffer target, int64_t offset
); 
```

### `indexOfNumber()`
Finds a byte value in a buffer.
**JS Definition**
```typescript
function indexOfNumber(
  buffer: ArrayBufferView,
  value: number,
  offset?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t indexOfNumber(array_buffer buf, uint8_t value, int64_t offset);
```

### `indexOfString()`
Finds a string in a buffer.
**JS Definition**
```typescript
function indexOfString(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  encoding?: BufferEncoding
): number;
```
**Implementation**
Based on `indexOfBuffer()`.

## Byte Swapping

### `swap16()`
Swaps 16-bit byte order (endianness).
**JS Definition**
```typescript
function swap16(buffer: ArrayBufferView): Buffer;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
void swap16(array_buffer buf);
```

### `swap32()`
Swaps 32-bit byte order.
**JS Definition**
```typescript
function swap32(buffer: ArrayBufferView): Buffer;
```
**Implementation**
Implemented in `/src/buffer`:
``` c 
void swap32(array_buffer buf);
```

### `swap64()`
Swaps 64-bit byte order.
**JS Definition**
```typescript
function swap64(buffer: ArrayBufferView): Buffer;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
void swap64(array_buffer buf);
```

## Validation

### `isUtf8()`
Checks if buffer contains valid UTF-8.
**JS Definition**
```typescript
function isUtf8(buffer: ArrayBufferView): boolean;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
bool isUtf8(array_buffer buf);
```

### `isAscii()`
Checks if buffer contains only ASCII.
**JS Definition**
```typescript
function isAscii(buffer: ArrayBufferView): boolean;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
bool isAscii(array_buffer buf);
```

## Slicing/View Functions

### `asciiSlice()`
Creates ASCII string from buffer slice.
**JS Definition**
```typescript
function asciiSlice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Same implementation as [latin1Slice](#latin1slice)

### `base64Slice()`
Creates Base64 string from buffer slice.
**JS Definition**
```typescript
function base64Slice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* base64Slice(
  array_buffer buf, size_t start, size_t end, bool is_url
);
```

### `base64urlSlice()`
Creates Base64URL string from buffer slice.
**JS Definition**
```typescript
function base64urlSlice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Same implementation as [base64Slice](#base64slice)

### `latin1Slice()`
Creates Latin1 string from buffer slice.
**JS Definition**
```typescript
function latin1Slice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* latin1Slice(array_buffer buf, int64_t start, int64_t end);
```

### `hexSlice()`
Creates hex string from buffer slice.
**JS Definition**
```typescript
function hexSlice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* hexSlice(array_buffer buf, int64_t start, int64_t end);
```

### `ucs2Slice()`
Creates UCS2 string from buffer slice.
**JS Definition**
```typescript
function ucs2Slice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* ucs2Slice(array_buffer buf, int64_t start, int64_t end);
```

### `utf8Slice()`
Creates UTF-8 string from buffer slice.
**JS Definition**
```typescript
function utf8Slice(
  buffer: ArrayBufferView,
  start?: number,
  end?: number
): string;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* utf8Slice(array_buffer buf, int64_t start, int64_t end);
```

## Writing Functions

### `base64Write()`
Writes Base64 encoded data to buffer.
**JS Definition**
```typescript
function base64Write(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
char* base64Write(
  array_buffer buf, const char* str, 
  int64_t start, int64_t end, bool is_url
);
```

### `base64urlWrite()`
Writes Base64URL encoded data to buffer.
**JS Definition**
```typescript
function base64urlWrite(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Same implementation as [base64Write](#base64write)

### `hexWrite()`
Writes hex encoded data to buffer.
**JS Definition**
```typescript
function hexWrite(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t hexWrite(
  array_buffer buf, const char* str,
  int64_t offset, int64_t length
);
```

### `ucs2Write()`
Writes UCS2 encoded data to buffer.
**JS Definition**
```typescript
function ucs2Write(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t ucs2Write(
  array_buffer buf, const char* str,
  int64_t offset, int64_t length
);
```

### `asciiWriteStatic()`
Fast ASCII writing to buffer.
**JS Definition**
```typescript
function asciiWriteStatic(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Same implementation as [latin1WriteStatic](#latin1writestatic)

### `latin1WriteStatic()`
Fast Latin1 writing to buffer.
**JS Definition**
```typescript
function latin1WriteStatic(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t latin1WriteStatic(
  array_buffer buf, const char* str,
  int64_t offset, int64_t length
);
```

### `utf8WriteStatic()`
Fast UTF-8 writing to buffer.
**JS Definition**
```typescript
function utf8WriteStatic(
  buffer: ArrayBufferView,
  str: string,
  offset?: number,
  length?: number
): number;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
int64_t utf8WriteStatic(
  array_buffer buf, const char* str,
  int64_t offset, int64_t length
);
```

## Utility Functions

### `copyArrayBuffer()`
Copies data between ArrayBuffers.
**JS Definition**
```typescript
function copyArrayBuffer(
  dest: ArrayBuffer,
  destOffset: number,
  src: ArrayBuffer,
  srcOffset: number,
  bytesToCopy: number
): void;
```
**Implementation**
Implemented in `/src/buffer`:
``` c
void copyArrayBuffer(
  array_buffer dest, int64_t dest_offset,
  array_buffer src, int64_t src_offset,
  int64_t bytes_to_copy
);
```

### `getZeroFillToggle()`
Gets zero-fill toggle state.
**JS Definition**
```typescript
function getZeroFillToggle(): Uint32Array;
```
**Implementation**
Defined in JS scope.
