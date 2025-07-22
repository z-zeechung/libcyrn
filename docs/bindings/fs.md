# `fs` Internal Binding

Provides low-level file system operations for Node.js.

## Type Aliases
```typescript
type StringOrBuffer = string | Uint8Array;
type Buffer = Uint8Array;
```

## Classes

### `FSReqCallback<ResultType = unknown>`
Callback handler for async FS operations  
**JS Definition**  
```typescript
class FSReqCallback<ResultType> {
  constructor(bigint?: boolean);
  // Completion handler with result or error
  oncomplete: ((error: Error) => void) | ((error: null, result: ResultType) => void);
  // Context for read operations
  context: ReadFileContext;
}
```

### `FileHandle`
Represents an open file  
**JS Definition**  
```typescript
class FileHandle {
  constructor(fd: number, offset: number, length: number);
  readonly fd: number;
  
  getAsyncId(): number;
  close(): Promise<void>;
  onread: () => void;  // Read event handler
  stream: Stream;      // Associated stream
}
```

### `StatWatcher`
Monitors file system changes  
**JS Definition**  
```typescript
class StatWatcher {
  constructor(useBigint: boolean);
  initialized: boolean;
  
  start(path: string, interval: number): number;
  getAsyncId(): number;
  close(): void;
  ref(): void;
  unref(): void;
  // Change event handler
  onchange: (status: number, eventType: string, filename: string | Buffer) => void;
}
```

## Constants

### `kUsePromises`
Symbol for promise-based API invocation  
```typescript
const kUsePromises: unique symbol;
```

### `kFsStatsFieldsNumber`
Number of fields in FS stats  
```typescript
const kFsStatsFieldsNumber: number;
```

### Stat Value Arrays
```typescript
const statValues: Float64Array;             // Regular stat values
const bigintStatValues: BigUint64Array;     // BigInt stat values
```

## File Operations

### `open(path: StringOrBuffer, flags: number, mode: number)`
Opens a file  
**Overloads:**  
```typescript
function open(path: StringOrBuffer, flags: number, mode: number): number;  // Synchronous
function open(path: StringOrBuffer, flags: number, mode: number, req: FSReqCallback<number>): void;  // Async
```

### `openFileHandle(path: StringOrBuffer, flags: number, mode: number)`
Opens a file and returns a FileHandle  
```typescript
function openFileHandle(path: StringOrBuffer, flags: number, mode: number, usePromises: typeof kUsePromises): Promise<FileHandle>;
```

### `close(fd: number)`
Closes a file descriptor  
**Overloads:**  
```typescript
function close(fd: number): void;  // Synchronous
function close(fd: number, req: FSReqCallback): void;  // Async
```

### File Reading Operations
```typescript
// Single buffer read
function read(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number): number;  // Sync
function read(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number, req: FSReqCallback<number>): void;  // Async
function read(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number, usePromises: typeof kUsePromises): Promise<number>;  // Promise

// Multi-buffer read (scatter/gather)
function readBuffers(fd: number, buffers: ArrayBufferView[], position: number): number;  // Sync
function readBuffers(fd: number, buffers: ArrayBufferView[], position: number, req: FSReqCallback<number>): void;  // Async
function readBuffers(fd: number, buffers: ArrayBufferView[], position: number, usePromises: typeof kUsePromises): Promise<number>;  // Promise
```

### File Writing Operations
```typescript
// Single buffer write
function writeBuffer(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number | null): number;  // Sync
function writeBuffer(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number | null, req: FSReqCallback<number>): void;  // Async
function writeBuffer(fd: number, buffer: ArrayBufferView, offset: number, length: number, position: number | null, usePromises: typeof kUsePromises): Promise<number>;  // Promise

// Multi-buffer write
function writeBuffers(fd: number, buffers: ArrayBufferView[], position: number): number;  // Sync
function writeBuffers(fd: number, buffers: ArrayBufferView[], position: number, req: FSReqCallback<number>): void;  // Async
function writeBuffers(fd: number, buffers: ArrayBufferView[], position: number, usePromises: typeof kUsePromises): Promise<number>;  // Promise

// String write
function writeString(fd: number, value: string, pos: unknown, encoding: unknown): number;  // Sync
function writeString(fd: number, value: string, pos: unknown, encoding: unknown, req: FSReqCallback<number>): void;  // Async
function writeString(fd: number, value: string, pos: unknown, encoding: unknown, usePromises: typeof kUsePromises): Promise<number>;  // Promise
```

## Content Operations

### `readFileUtf8(path: StringOrBuffer, flags: number)`
Reads file as UTF-8 string  
```typescript
function readFileUtf8(path: StringOrBuffer, flags: number): string;  // Synchronous only
```

### `writeFileUtf8(...)`
Writes UTF-8 content to a file  
**Overloads:**  
```typescript
function writeFileUtf8(path: string, data: string, flag: number, mode: number): void;  // Path version
function writeFileUtf8(fd: number, data: string, flag: number, mode: number): void;    // FD version
```

## Directory Operations

### `mkdir(path: string, mode: number, recursive: boolean)`
Creates a directory  
**Overloads:**  
```typescript
// Synchronous versions
function mkdir(path: string, mode: number, recursive: false): void;
function mkdir(path: string, mode: number, recursive: true): string;  // Returns first created directory
function mkdir(path: string, mode: number, recursive: boolean): void | string;

// Async versions
function mkdir(path: string, mode: number, recursive: false, req: FSReqCallback<void>): void;
function mkdir(path: string, mode: number, recursive: true, req: FSReqCallback<string>): void;
function mkdir(path: string, mode: number, recursive: boolean, req: FSReqCallback<void | string>): void;

// Promise versions
function mkdir(path: string, mode: number, recursive: false, usePromises: typeof kUsePromises): Promise<void>;
function mkdir(path: string, mode: number, recursive: true, usePromises: typeof kUsePromises): Promise<string>;
function mkdir(path: string, mode: number, recursive: boolean, usePromises: typeof kUsePromises): Promise<void | string>;
```

### `readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: boolean)`
Reads directory contents  
**Overloads:**  
```typescript
// Synchronous versions
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: false): string[];
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: true): [string[], number[]];  // [names, types]
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: boolean): string[] | [string[], number[]];

// Async versions
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: false, req: FSReqCallback<string[]>): void;
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: true, req: FSReqCallback<[string[], number[]]>): void;
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: boolean, req: FSReqCallback<string[] | [string[], number[]]>): void;

// Promise versions
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: false, usePromises: typeof kUsePromises): Promise<string[]>;
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: true, usePromises: typeof kUsePromises): Promise<[string[], number[]]>;
function readdir(path: StringOrBuffer, encoding: unknown, withFileTypes: boolean, usePromises: typeof kUsePromises): Promise<string[] | [string[], number[]]>;
```

### `rmdir(path: string)`
Removes a directory  
**Overloads:**  
```typescript
function rmdir(path: string): void;  // Synchronous
function rmdir(path: string, req: FSReqCallback): void;  // Async
function rmdir(path: string, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `mkdtemp(prefix: string, encoding: unknown)`
Creates temporary directory  
**Overloads:**  
```typescript
function mkdtemp(prefix: string, encoding: unknown): string;  // Synchronous
function mkdtemp(prefix: string, encoding: unknown, req: FSReqCallback<string>): void;  // Async
function mkdtemp(prefix: string, encoding: unknown, usePromises: typeof kUsePromises): Promise<string>;  // Promise
```

## File System Operations

### `rename(oldPath: string, newPath: string)`
Renames a file/directory  
**Overloads:**  
```typescript
function rename(oldPath: string, newPath: string): void;  // Sync
function rename(oldPath: string, newPath: string, req: FSReqCallback): void;  // Async
function rename(oldPath: string, newPath: string, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `copyFile(src: StringOrBuffer, dest: StringOrBuffer, mode: number)`
Copies a file  
**Overloads:**  
```typescript
function copyFile(src: StringOrBuffer, dest: StringOrBuffer, mode: number, req: FSReqCallback): void;  // Async
function copyFile(src: StringOrBuffer, dest: StringOrBuffer, mode: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `symlink(target: StringOrBuffer, path: StringOrBuffer, type: number)`
Creates symbolic link  
**Overloads:**  
```typescript
function symlink(target: StringOrBuffer, path: StringOrBuffer, type: number): void;  // Sync
function symlink(target: StringOrBuffer, path: StringOrBuffer, type: number, req: FSReqCallback): void;  // Async
function symlink(target: StringOrBuffer, path: StringOrBuffer, type: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `link(existingPath: string, newPath: string)`
Creates hard link  
**Overloads:**  
```typescript
function link(existingPath: string, newPath: string): void;  // Sync
function link(existingPath: string, newPath: string, req: FSReqCallback): void;  // Async
function link(existingPath: string, newPath: string, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `unlink(path: string)`
Deletes a file  
**Overloads:**  
```typescript
function unlink(path: string): void;  // Sync
function unlink(path: string, req: FSReqCallback): void;  // Async
function unlink(path: string, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### Path Operations
```typescript
// Read symbolic link
function readlink(path: StringOrBuffer, encoding: unknown): StringOrBuffer;  // Sync
function readlink(path: StringOrBuffer, encoding: unknown, req: FSReqCallback<string | Buffer>): void;  // Async
function readlink(path: StringOrBuffer, encoding: unknown, usePromises: typeof kUsePromises): Promise<string | Buffer>;  // Promise

// Resolve real path
function realpath(path: StringOrBuffer, encoding: unknown): StringOrBuffer;  // Sync
function realpath(path: StringOrBuffer, encoding: unknown, req: FSReqCallback<string | Buffer>): void;  // Async
function realpath(path: StringOrBuffer, encoding: unknown, usePromises: typeof kUsePromises): Promise<string | Buffer>;  // Promise
```

## File Metadata

### Stat Operations
```typescript
// File stat
function stat(path: StringOrBuffer, useBigint: boolean): Float64Array | BigUint64Array;  // Sync
function stat(path: StringOrBuffer, useBigint: boolean, req: FSReqCallback<Float64Array | BigUint64Array>): void;  // Async
function stat(path: StringOrBuffer, useBigint: boolean, usePromises: typeof kUsePromises): Promise<Float64Array | BigUint64Array>;  // Promise

// Link stat (non-following)
function lstat(path: StringOrBuffer, useBigint: boolean): Float64Array | BigUint64Array;  // Sync
function lstat(path: StringOrBuffer, useBigint: boolean, req: FSReqCallback<Float64Array | BigUint64Array>): void;  // Async
function lstat(path: StringOrBuffer, useBigint: boolean, usePromises: typeof kUsePromises): Promise<Float64Array | BigUint64Array>;  // Promise

// File descriptor stat
function fstat(fd: number, useBigint: boolean): Float64Array | BigUint64Array;  // Sync
function fstat(fd: number, useBigint: boolean, req: FSReqCallback<Float64Array | BigUint64Array>): void;  // Async
function fstat(fd: number, useBigint: boolean, usePromises: typeof kUsePromises): Promise<Float64Array | BigUint64Array>;  // Promise
```

## Permissions & Ownership

### `chmod(path: string, mode: number)`
Changes file permissions  
**Overloads:**  
```typescript
function chmod(path: string, mode: number): void;  // Sync
function chmod(path: string, mode: number, req: FSReqCallback): void;  // Async
function chmod(path: string, mode: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `fchmod(fd: number, mode: number)`
Changes FD permissions  
**Overloads:**  
```typescript
function fchmod(fd: number, mode: number): void;  // Sync
function fchmod(fd: number, mode: number, req: FSReqCallback): void;  // Async
function fchmod(fd: number, mode: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### Ownership Operations
```typescript
// Change file owner
function chown(path: string, uid: number, gid: number): void;  // Sync
function chown(path: string, uid: number, gid: number, req: FSReqCallback): void;  // Async
function chown(path: string, uid: number, gid: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise

// Change FD owner
function fchown(fd: number, uid: number, gid: number): void;  // Sync
function fchown(fd: number, uid: number, gid: number, req: FSReqCallback): void;  // Async
function fchown(fd: number, uid: number, gid: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise

// Change link owner (non-following)
function lchown(path: string, uid: number, gid: number): void;  // Sync
function lchown(path: string, uid: number, gid: number, req: FSReqCallback): void;  // Async
function lchown(path: string, uid: number, gid: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

## Timestamp Operations

### `utimes(path: string, atime: number, mtime: number)`
Changes file timestamps  
**Overloads:**  
```typescript
function utimes(path: string, atime: number, mtime: number): void;  // Sync
function utimes(path: string, atime: number, mtime: number, req: FSReqCallback): void;  // Async
function utimes(path: string, atime: number, mtime: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### File Descriptor Timestamps
```typescript
function futimes(fd: number, atime: number, mtime: number): void;  // Sync
function futimes(fd: number, atime: number, mtime: number, req: FSReqCallback): void;  // Async
function futimes(fd: number, atime: number, mtime: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### Link Timestamps (non-following)
```typescript
function lutimes(path: string, atime: number, mtime: number): void;  // Sync
function lutimes(path: string, atime: number, mtime: number, req: FSReqCallback): void;  // Async
function lutimes(path: string, atime: number, mtime: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

## Sync Operations

### `fsync(fd: number)`
Flushes file data to disk  
**Overloads:**  
```typescript
function fsync(fd: number): void;  // Sync
function fsync(fd: number, req: FSReqCallback): void;  // Async
function fsync(fd: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `fdatasync(fd: number)`
Flushes data (excludes metadata)  
**Overloads:**  
```typescript
function fdatasync(fd: number): void;  // Sync
function fdatasync(fd: number, req: FSReqCallback): void;  // Async
function fdatasync(fd: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

## Internal Utilities

### `access(path: StringOrBuffer, mode: number)`
Checks file accessibility  
**Overloads:**  
```typescript
function access(path: StringOrBuffer, mode: number): void;  // Sync
function access(path: StringOrBuffer, mode: number, req: FSReqCallback): void;  // Async
function access(path: StringOrBuffer, mode: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `ftruncate(fd: number, len: number)`
Truncates a file  
**Overloads:**  
```typescript
function ftruncate(fd: number, len: number, req: FSReqCallback): void;  // Async
function ftruncate(fd: number, len: number, usePromises: typeof kUsePromises): Promise<void>;  // Promise
```

### `getFormatOfExtensionlessFile(url: string)`
Determines file format for extensionless files  
```typescript
function getFormatOfExtensionlessFile(url: string): ConstantsBinding['internal'];
```

### `internalModuleStat(receiver: unknown, path: string)`
Internal module resolution helper  
```typescript
function internalModuleStat(receiver: unknown, path: string): number;
```

## Copy Utilities
```typescript
// Validate paths for copy
function cpSyncCheckPaths(src: StringOrBuffer, dest: StringOrBuffer, dereference: boolean, recursive: boolean): void;

// File copy override
function cpSyncOverrideFile(src: StringOrBuffer, dest: StringOrBuffer, mode: number, preserveTimestamps: boolean): void;

// Directory copy
function cpSyncCopyDir(src: StringOrBuffer, dest: StringOrBuffer, force: boolean, errorOnExist: boolean, verbatimSymlinks: boolean, dereference: boolean): void;
```

## Context Interfaces

### `ReadFileContext`
Read operation context  
```typescript
interface ReadFileContext {
  fd: number | undefined;
  isUserFd: boolean | undefined;
  size: number;
  callback: (err?: Error, data?: string | Uint8Array) => unknown;
  buffers: Uint8Array[];
  buffer: Uint8Array;
  pos: number;
  encoding: string;
  err: Error | null;
  signal: unknown;  // AbortSignal | undefined
}
```

### `FSSyncContext`
Synchronous operation context  
```typescript
interface FSSyncContext {
  fd?: number;
  path?: string;
  dest?: string;
  errno?: string;
  message?: string;
  syscall?: string;
  error?: Error;
}
```