# `icu` Internal Binding

Provides internationalization support via ICU (International Components for Unicode).

Given that ICU is a C++ library while our code compatibility requirement is C99, and we've explicitly stated in the general guidelines to exclude excessive ICU volume, we will not directly use ICU for character encoding processing. We will implement basic encoding conversion functionality based on libiconv. For encodings not covered by libiconv, we will extract mapping tables from ICU source data and use automated tools to convert them into C code. The version number in process.versions.icu will use the equivalent ICU version number.

## Global Injections

- `primordials`
- `natives` (`icu` C bindings)

## `icu` C Bindings

### `[encoding]_mbtowc`
Convert a string in the specified encoding to UCS-4 wide characters

### `[encoding]_wctomb`
Convert UCS-4 wide characters to a string in the specified encoding

## Functions

### `getStringWidth(str, ambiguousAsFullWidth, expandEmojiSequence)`

**Implementation**
We will not implement this interface. After investigation, this interface is exported via `internal/util/inspect`. In this file, it checks the value of internalBinding('config').hasIntl - if true, it uses ICU implementation; if false, it uses native JS implementation. We will manipulate to ensure internalBinding('config').hasIntl is false, thus using the native JS implementation, so this interface will never be called.

### `icuErrName(status)`
Returns the ICU error code name.

**JS Definition**  
```typescript
function icuErrName(status: number): string;
```

**Parameters**
- `status`: ICU error code (e.g. U_ZERO_ERROR)

**Implementation**
Shim implementation based on iconv

### `transcode(source, fromEncoding, toEncoding)`
Converts text between encodings.

**JS Definition**
```typescript
function transcode(
  source: ArrayBufferView,
  fromEncoding: string,
  toEncoding: string  
): Buffer;
```

**Supported Encodings**
- 'utf-8', 'utf16le', 'iso8859-1', 'us-ascii'

**Implementation**
Implementation based on iconv

### `getConverter(encoding, flags)`
Creates a converter object for encoding/decoding.

**JS Definition**
```typescript
function getConverter(
  encoding: string,
  flags?: number  
): ConverterObject;
```

**Flags**
- `CONVERTER_FLAGS_FATAL`: Treat errors as fatal
- `CONVERTER_FLAGS_FLUSH`: Flush pending chars on decode

**Implementation**
Shim implementation based on iconv

### `decode(converter, input, flags, fromEncoding)`
Decodes input using converter.

**JS Definition**  
```typescript
function decode(
  converter: ConverterObject,
  input: ArrayBufferView,
  flags: number,
  fromEncoding: string
): string;
```

**Implementation**
Shim implementation based on iconv

### `hasConverter(encoding)`
Checks if ICU supports an encoding.

**JS Definition**
```typescript
function hasConverter(encoding: string): boolean;
```

**Implementation**
Shim implementation based on iconv