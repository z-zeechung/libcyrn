# `url` Internal Binding

Provides URL parsing and manipulation capabilities based on the WHATWG URL Standard.

This binding is a pure JavaScript implementation using the `ada` library precompiled into WASM/asm.js via Emscripten.

## Global Injections

- `primordials`

## URL Conversion Functions

### `domainToASCII()`
Converts a domain name to ASCII using Punycode encoding (IDNA).

**JS Definition**
```typescript
function domainToASCII(domain: string): string;
```

**Returns**
- ASCII encoded domain name
- Empty string if conversion fails

**Implementation**
Pure JavaScript implementation using ada WASM module.

### `domainToUnicode()`
Converts a domain name to Unicode (reverses Punycode encoding).

**JS Definition**
```typescript
function domainToUnicode(domain: string): string;
```

**Returns**
- Unicode domain name
- Empty string if conversion fails

**Implementation**
Pure JavaScript implementation using ada WASM module.

## URL Formatting

### `format()`
Formats URL components into a complete URL string.

**JS Definition**
```typescript
function format(
  href: string,
  hash: boolean,
  unicode: boolean,
  search: boolean,
  auth: boolean
): string;
```

**Parameters**
- `hash`: Include hash fragment
- `unicode`: Convert hostname to Unicode
- `search`: Include search query
- `auth`: Include authentication info

**Implementation**
Pure JavaScript implementation using ada WASM module.

## URL Parsing

### `parse()`
Parses a URL string into components.

**JS Definition**
```typescript
function parse(
  input: string,
  base?: string,
  raiseException?: boolean
): string | undefined;
```

**Returns**
- Parsed URL string
- `undefined` if parsing fails and `raiseException` is false

**Implementation**
Pure JavaScript implementation using ada WASM module.

### `getOrigin()`
Gets the origin of a URL.

**JS Definition**
```typescript
function getOrigin(input: string): string;
```

**Returns**
- Origin string (scheme://host:port)

**Implementation**
Pure JavaScript implementation using ada WASM module.

### `canParse()`
Checks if a string can be parsed as a valid URL.

**JS Definition**
```typescript
function canParse(
  input: string,
  base?: string
): boolean;
```

**Implementation**
Pure JavaScript implementation using ada WASM module.

## File URL Handling

### `pathToFileURL()`
Converts a file path to a file:// URL.

**JS Definition**
```typescript
function pathToFileURL(
  path: string,
  isWindows: boolean,
  hostname?: string
): string;
```

**Parameters**
- `isWindows`: Whether the path uses Windows separators
- `hostname`: Optional hostname for UNC paths

**Implementation**
Pure JavaScript implementation using ada WASM module.

## URL Modification

### `update()`
Updates specific parts of a URL.

**JS Definition**
```typescript
function update(
  href: string,
  action: number,
  newValue: string
): string | false;
```

**Action Types**
- 0: pathname
- 1: hash
- 2: host
- 3: hostname
- 4: href
- 5: password
- 6: port
- 7: protocol
- 8: search
- 9: username

**Returns**
- Updated URL string on success
- `false` if update fails

**Implementation**
Pure JavaScript implementation using ada WASM module.

## URL Components

### `urlComponents`
Provides access to URL component positions.

**JS Definition**
```typescript
Uint32Array urlComponents;
```

**Component Indices**
- 0: protocol_end
- 1: username_end
- 2: host_start
- 3: host_end
- 4: port
- 5: pathname_start
- 6: search_start
- 7: hash_start
- 8: url_type

**Implementation**
Pure JavaScript implementation using ada WASM module.
