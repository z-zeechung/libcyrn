# `fs` Internal Binding

Provides low-level file system operations for Node.js.

## Type Aliases
```typescript
type StringOrBuffer = string | Uint8Array;
type Buffer = Uint8Array;
```

## Global Injections

- `primordials`
- `natives` (`fs` C bindings)

## File Operations

### `open(path: string, flags: number, mode: number, callback: Function)`
Opens a file asynchronously.
**JS Definition**
```typescript
function open(path: string, flags: number, mode: number, callback: Function): void;
```

### `openFileHandle(path: string, flags: number, mode: number)`
Opens a file and returns a FileHandle object.
**JS Definition**
```typescript
function openFileHandle(path: string, flags: number, mode: number): Promise<FileHandle>;
```

### `close(fd: number, callback: Function)`
Closes a file descriptor asynchronously.
**JS Definition**
```typescript
function close(fd: number, callback: Function): void;
```

### `read(fd: number, buffer: Buffer, offset: number, length: number, position: number, callback: Function)`
Reads data from a file descriptor.
**JS Definition**
```typescript
function read(
  fd: number,
  buffer: Buffer,
  offset: number,
  length: number,
  position: number,
  callback: Function
): void;
```

### `readBuffers(fd: number, buffers: Buffer[], position: number, callback: Function)`
Reads data into multiple buffers.
**JS Definition**
```typescript
function readBuffers(
  fd: number,
  buffers: Buffer[],
  position: number,
  callback: Function
): void;
```

### `writeBuffer(fd: number, buffer: Buffer, offset: number, length: number, position: number, callback: Function)`
Writes buffer data to a file.
**JS Definition**
```typescript
function writeBuffer(
  fd: number,
  buffer: Buffer,
  offset: number,
  length: number,
  position: number,
  callback: Function
): void;
```

### `writeBuffers(fd: number, buffers: Buffer[], position: number, callback: Function)`
Writes multiple buffers to a file.
**JS Definition**
```typescript
function writeBuffers(
  fd: number,
  buffers: Buffer[],
  position: number,
  callback: Function
): void;
```

### `writeString(fd: number, string: string, position: number, encoding: string, callback: Function)`
Writes string data to a file with specified encoding.
**JS Definition**
```typescript
function writeString(
  fd: number,
  string: string,
  position: number,
  encoding: string,
  callback: Function
): void;
```

## File Content Operations

### `readFileUtf8(path: string, callback: Function)`
Reads file content as UTF-8.
**JS Definition**
```typescript
function readFileUtf8(path: string, callback: Function): void;
```

### `writeFileUtf8(path: string, data: string, mode: number, callback: Function)`
Writes UTF-8 content to a file.
**JS Definition**
```typescript
function writeFileUtf8(
  path: string,
  data: string,
  mode: number,
  callback: Function
): void;
```

## Directory Operations

### `mkdir(path: string, mode: number, recursive: boolean, callback: Function)`
Creates a directory.
**JS Definition**
```typescript
function mkdir(
  path: string,
  mode: number,
  recursive: boolean,
  callback: Function
): void;
```

### `readdir(path: string, options: Object, callback: Function)`
Reads directory contents.
**JS Definition**
```typescript
function readdir(path: string, options: Object, callback: Function): void;
```

### `rmdir(path: string, recursive: boolean, callback: Function)`
Removes a directory.
**JS Definition**
```typescript
function rmdir(path: string, recursive: boolean, callback: Function): void;
```

## File System Operations

### `rename(oldPath: string, newPath: string, callback: Function)`
Renames a file or directory.
**JS Definition**
```typescript
function rename(oldPath: string, newPath: string, callback: Function): void;
```

### `copyFile(src: string, dest: string, flags: number, callback: Function)`
Copies a file.
**JS Definition**
```typescript
function copyFile(
  src: string,
  dest: string,
  flags: number,
  callback: Function
): void;
```

### `symlink(target: string, path: string, type: string, callback: Function)`
Creates a symbolic link.
**JS Definition**
```typescript
function symlink(
  target: string,
  path: string,
  type: string,
  callback: Function
): void;
```

### `link(existingPath: string, newPath: string, callback: Function)`
Creates a hard link.
**JS Definition**
```typescript
function link(existingPath: string, newPath: string, callback: Function): void;
```

### `unlink(path: string, callback: Function)`
Removes a file.
**JS Definition**
```typescript
function unlink(path: string, callback: Function): void;
```

### `realpath(path: string, options: Object, callback: Function)`
Resolves the real path.
**JS Definition**
```typescript
function realpath(path: string, options: Object, callback: Function): void;
```

## File Metadata Operations

### `stat(path: string, options: Object, callback: Function)`
Gets file stats.
**JS Definition**
```typescript
function stat(path: string, options: Object, callback: Function): void;
```

### `lstat(path: string, options: Object, callback: Function)`
Gets link stats (does not follow symlinks).
**JS Definition**
```typescript
function lstat(path: string, options: Object, callback: Function): void;
```

### `fstat(fd: number, options: Object, callback: Function)`
Gets file descriptor stats.
**JS Definition**
```typescript
function fstat(fd: number, options: Object, callback: Function): void;
```

### `statfs(path: string, options: Object, callback: Function)`
Gets file system stats.
**JS Definition**
```typescript
function statfs(path: string, options: Object, callback: Function): void;
```

### `readlink(path: string, options: Object, callback: Function)`
Reads symbolic link contents.
**JS Definition**
```typescript
function readlink(path: string, options: Object, callback: Function): void;
```

## File Permissions

### `chmod(path: string, mode: number, callback: Function)`
Changes file permissions.
**JS Definition**
```typescript
function chmod(path: string, mode: number, callback: Function): void;
```

### `fchmod(fd: number, mode: number, callback: Function)`
Changes file descriptor permissions.
**JS Definition**
```typescript
function fchmod(fd: number, mode: number, callback: Function): void;
```

### `chown(path: string, uid: number, gid: number, callback: Function)`
Changes file owner.
**JS Definition**
```typescript
function chown(path: string, uid: number, gid: number, callback: Function): void;
```

### `fchown(fd: number, uid: number, gid: number, callback: Function)`
Changes file descriptor owner.
**JS Definition**
```typescript
function fchown(fd: number, uid: number, gid: number, callback: Function): void;
```

### `lchown(path: string, uid: number, gid: number, callback: Function)`
Changes link owner (does not follow symlinks).
**JS Definition**
```typescript
function lchown(path: string, uid: number, gid: number, callback: Function): void;
```

## File Timestamps

### `utimes(path: string, atime: number, mtime: number, callback: Function)`
Changes file timestamps.
**JS Definition**
```typescript
function utimes(path: string, atime: number, mtime: number, callback: Function): void;
```

### `futimes(fd: number, atime: number, mtime: number, callback: Function)`
Changes file descriptor timestamps.
**JS Definition**
```typescript
function futimes(fd: number, atime: number, mtime: number, callback: Function): void;
```

### `lutimes(path: string, atime: number, mtime: number, callback: Function)`
Changes link timestamps (does not follow symlinks).
**JS Definition**
```typescript
function lutimes(path: string, atime: number, mtime: number, callback: Function): void;
```

## File Sync Operations

### `fsync(fd: number, callback: Function)`
Synchronizes file data to disk.
**JS Definition**
```typescript
function fsync(fd: number, callback: Function): void;
```

### `fdatasync(fd: number, callback: Function)`
Synchronizes file data (excluding metadata) to disk.
**JS Definition**
```typescript
function fdatasync(fd: number, callback: Function): void;
```

## Temporary Files

### `mkdtemp(prefix: string, options: Object, callback: Function)`
Creates a temporary directory.
**JS Definition**
```typescript
function mkdtemp(prefix: string, options: Object, callback: Function): void;
```

## File Truncation

### `ftruncate(fd: number, len: number, callback: Function)`
Truncates a file descriptor.
**JS Definition**
```typescript
function ftruncate(fd: number, len: number, callback: Function): void;
```

## Copy Operations

### `cpSyncCheckPaths(src: string, dest: string, options: Object)`
Validates paths for copy operations.
**JS Definition**
```typescript
function cpSyncCheckPaths(src: string, dest: string, options: Object): void;
```

### `cpSyncOverrideFile(src: string, dest: string, options: Object)`
Copies a file with override.
**JS Definition**
```typescript
function cpSyncOverrideFile(src: string, dest: string, options: Object): void;
```

### `cpSyncCopyDir(src: string, dest: string, options: Object)`
Copies a directory recursively.
**JS Definition**
```typescript
function cpSyncCopyDir(src: string, dest: string, options: Object): void;
```

## File Watching

### `StatWatcher`
Class for monitoring file changes.
**JS Definition**
```typescript
class StatWatcher {
  start(path: string, interval: number): void;
  stop(): void;
}
```

## Internal Module Resolution

### `legacyMainResolve(request: string, parent: Module, options: Object)`
Resolves main module using legacy algorithm.
**JS Definition**
```typescript
function legacyMainResolve(request: string, parent: Module, options: Object): string;
```

### `internalModuleStat(path: string)`
Gets internal module stats.
**JS Definition**
```typescript
function internalModuleStat(path: string): number;
```

## File Handle Class

### `FileHandle`
Class representing an open file.
**JS Definition**
```typescript
class FileHandle {
  fd: number;
  close(): Promise<void>;
  read(buffer: Buffer, offset: number, length: number, position: number): Promise<number>;
  write(buffer: Buffer, offset: number, length: number, position: number): Promise<number>;
}
```

## Request Callback Class

### `FSReqCallback`
Class for handling FS operation callbacks.
**JS Definition**
```typescript
class FSReqCallback<ResultType = unknown> {
  constructor(bigint?: boolean);
  oncomplete: ((error: Error) => void) | ((error: null, result: ResultType) => void);
  context: ReadFileContext;
}
```

## Constants

### `kFsStatsFieldsNumber`
Number of fields in FS stats.
**JS Definition**
```typescript
const kFsStatsFieldsNumber: number;
```

### `kUsePromises`
Symbol indicating promise-based FS usage.
**JS Definition**
```typescript
const kUsePromises: symbol;
```

## Stat Values

### `statValues`
Default stat values array.
**JS Definition**
```typescript
const statValues: Float64Array;
```

### `bigintStatValues`
Default bigint stat values array.
**JS Definition**
```typescript
const bigintStatValues: BigInt64Array;
```

### `statFsValues`
Default stat FS values array.
**JS Definition**
```typescript
const statFsValues: Float64Array;
```

### `bigintStatFsValues`
Default bigint stat FS values array.
**JS Definition**
```typescript
const bigintStatFsValues: BigInt64Array;
```

## Utility Functions

### `access(path: string, mode: number, callback: Function)`
Checks file accessibility.
**JS Definition**
```typescript
function access(path: string, mode: number, callback: Function): void;
```

### `existsSync(path: string)`
Synchronously checks file existence.
**JS Definition**
```typescript
function existsSync(path: string): boolean;
```

### `getFormatOfExtensionlessFile(path: string)`
Gets format of extensionless file.
**JS Definition**
```typescript
function getFormatOfExtensionlessFile(path: string): string;
