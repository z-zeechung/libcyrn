# <del>`platform` Internal Binding</del> (Rewriting)

The combination of Node's [process](#process) and [internalBinding('os')](#internalbindingos). `process` is viewed as a special internal binding.

## Global Injections
**`process`**
- `primordials`
- `require` (internal require)
- `internalBinding`
- `natives` (`platform` C bindings)
- `esb` (engine specific bindings)

**`internalBinding('os')`**
- `primordials`
- `natives` (`platform` C bindings)

## C Interfaces

### `process`
```c
char* arch(void);
char* platform(void);
int32array cpuUsage(void);
int32array resourceUsage(void);
int64array memoryUsage(void);
int32array constrainedMemory(void);
void kill(int32_t pid, int32_t signal);
int64array hrtime(void);
int32_t umask(int32_t mask);
void chdir(const char* directory);
const char* cwd(void);
stringarray env(void);
char* title(const char* title);
int32_t pid(void);
int32_t ppid(void);
```

### `internalBinding('os')`
```c
char* getHostname(void);
float64array getLoadAvg(void);
double getUptime(void);
int64_t getTotalMem(void);
int64_t getFreeMem(void);
stringarray getCPUsModel(void);
int64array getCPUsOthers(void);
stringarray getInterfaceAddresses(void);
char* getHomeDirectory(void);
int32array getUserInfoUidGid(void);
stringarray getUserInfoUsernameHomedirShell(void);
void setPriority(int32_t pid, int32_t priority);
int32_t getPriority(int32_t pid);
int32_t getAvailableParallelism(void);
stringarray getOSInformation(void);
bool isBigEndian(void);
```

## Engine Specific Bindings (ESB)

- moduleLoadList
- buildConfigs
- runtimeStartTimestamp  
- eventQueues
- resources
- interrupt
- exit
- setCanExit
- nextTick
- argv
- cliFlags

## Bindings

## `process`

### Definition
``` typescript
declare const process: {
    ...bindings
} & EventEmitter
```

### Special `EventEmitter` Listeners

> ### `beforeExit`
> Emitted when Node.js empties its event loop and has no additional work to schedule. The process will exit if no more work is scheduled.
> **Listener Signature**
> ```typescript
> (code: number) => void
> ```
> 
> ### `exit`
> Emitted when the Node.js process is about to exit. The process will exit immediately after listeners complete.
> **Listener Signature**
> ```typescript
> (code: number) => void
> ```
> 
> ### `uncaughtException`
> Emitted when an uncaught JavaScript exception bubbles all the way back to the event loop.
> **Listener Signature**
> ```typescript
> (error: Error, origin: 'uncaughtException' | 'unhandledRejection') => void
> ```
> 
> ### `unhandledRejection`
> Emitted when a Promise is rejected and no error handler is attached.
> **Listener Signature**
> ```typescript
> (reason: any, promise: Promise<any>) => void
> ```
> 
> ### `warning`
> Emitted when Node.js detects a suspicious or deprecated API usage.
> **Listener Signature**
> ```typescript
> (warning: Error) => void
> ```
> 
> ### `message`
> Emitted when:
> - Child processes receive messages from parent
> - Worker threads receive messages
> - Process receives IPC messages
> 
> **Listener Signature**
> ```typescript
> (message: any, sendHandle?: any) => void
> ```
> 
> ### `SIGTERM`, `SIGINT`, etc.
> Emitted when the process receives a POSIX signal.
> **Listener Signature**
> ```typescript
> (signal: string) => void
> ```
> **Common Signals**
> - `SIGTERM`: Graceful shutdown (default)
> - `SIGINT`: Interrupt (Ctrl+C)
> - `SIGHUP`: Terminal closed
> - `SIGBREAK`: Windows Ctrl+Break
> 
> ### `disconnect`
> Emitted when:
> - Child process IPC channel closes
> - Worker thread disconnects
> 
> **Listener Signature**
> ```typescript
> () => void
> ```
> 
> ### `internalMessage`
> Internal communication between Node.js components.
> 
> ### `newListener`/`removeListener`
> Emitted when listeners are added/removed from any emitter.
> **Listener Signature**
> ```typescript
> (event: string, listener: Function) => void
> ```
> 
> ### `rejectionHandled`
> Emitted when a previously unhandled rejection becomes handled.
> **Listener Signature**
> ```typescript
> (promise: Promise<any>) => void
> ```

### `version`
The Node's version.
**JS Definition**
``` typescript
string
```
**Implementation**
Referring from /lib/meta.json.

### `versions`
The versions of Node runtime and its dependencies.
**JS Definition**
``` typescript
{ [key: string]: string }
```
**Implementation**
Referring from /lib/meta.json and /deps/*/package.json.

### `arch`
The CPU architecture of the current machine.
**JS Definition**
``` typescript
string
```
**Implementation**
Implemented in `/src/platform`:
``` c
char* arch(void);
```

### `platform`
The operating system name of the current machine.
**JS Definition**
``` typescript
string
```
**Implementation**
Implemented in `/src/platform`:
``` c
char* platform(void);
```

### `release`
The release info of this Node runtime. Includes its lts nickname, its source URL, headers URL and lib URL.
**JS Definition**
``` typescript
{
    name: 'node',
    lts: string,
    sourceUrl: string,
    headersUrl: string,
    libUrl: string
}
```
**Implementation**
Referring from /lib/meta.json.

### `_rawDebug`
Output given object to `process.stderr`, without any formatting.
**JS Definition**
``` typescript
(o: object): void
```

### `moduleLoadList`
An array containing all loaded modules since the start of the process. Including `Internal Binding`s and `NativeModule`s.
**JS Definition**
``` typescript
Array<string>
```
**Implementation**
Referring from `ESB.moduleLoadList`.

### `binding`
Equivalent to the combination of `internalBinding` and `require`. The range of `require` shall be limited to built-in modules.
**JS Definition**
``` typescript
(name: string): object
```
**Implementation**
Wrapping `internalBinding` that is visible in node built-in modules scope.

### `_linkedBinding`
Getting node's linked binding.
**JS Definition**
``` typescript
(name: string): object
```
**Implementation**
Dummy implementation, since we don't have that in our runtime.

### `_events`
Internal storage for event emitters.
**JS Definition**
``` typescript
{ [event: string]: Function | Function[] }
```
**Implementation**
Referring from `node:events`.

### `_eventsCount`
Count of events.
**JS Definition**
``` typescript
number
```
**Implementation**
The array length of `_events`.

### `_maxListeners`
Maximum number of event listeners before warning.
**JS Definition**
``` typescript
number | undefined
```

### `domain`
Domain module for error handling.
**JS Definition**
``` typescript
Domain | undefined
```
**Implementation**
Referring from `node:domain`.

### `_exiting`
Internal flag indicating if process is exiting.
**JS Definition**
``` typescript
boolean
```

### `exitCode`
The exit code to be used when process exits.
**JS Definition**
``` typescript
number
```

### `config`
Contains Node.js build configuration.
**JS Definition**
``` typescript
{
    target_defaults: {
        cflags: string[],
        configurations: {
            Debug: any,
            Release: any
        },
        default_configuration: 'Debug' | 'Release',
        defines: string[],
        include_dirs: string[],
        libraries: string[],
    },
    variables: {
        [key: string]: any
    }
}
```
**Implementation**
Referring from `ESB.buildConfigs`.

### `dlopen`
Loads a C++ addon (`.node`).
**JS Definition**
``` typescript
(module: { exports: any }, filename: string, flags: number): void
```
**Implementation**
Not for now.

### `uptime`
Returing the process uptime.
**JS Definition**
``` typescript
(): number
```
**Implementation**
Referring from `ESB.runtimeStartTimestamp`.

### `_getActiveRequests`
Internal method to get active marco tasks.
**JS Definition**
``` typescript
(): Array<object>
```
Referring from `ESB.eventQueues`.

### `_getActiveHandles`
Internal method to get active handles.
**JS Definition**
``` typescript
(): Array<object>
```
**Implementation**
An ordered list would be defined in `lib/bindings/_handles`. `lib/bindings/_handles` would export two hooks, one renames a newly created posix style `fd` in case of collision and push it into the list, and the another removes. Each bindings that create or recycle an `fd` must invoke these hooks.

### `getActiveResourcesInfo`
Gets info about active resources.
**JS Definition**
``` typescript
(): Array<string>
```
**Implementation**
Referring from `ESB.resources`.

### `reallyExit`
Exits immediately without cleanup.
**JS Definition**
``` typescript
(code?: number): never
```
**Implementation**
Referring from `ESB.interrupt`.

### `_kill`
Internal method for process termination.
**JS Definition**
``` typescript
(pid: number, signal: string | number): void
```
**Implementation**
Invoking `process.kill` (see below).

### `loadEnvFile`
Loads environment variables from file.
**JS Definition**
``` typescript
(path: string): void
```
**Implementation**
Would require `node:fs`, `node:path` APIs and `dotenv` shim.

### `cpuUsage`
Gets CPU usage of the process. If previousValue is passed, returns the difference between the current usage and the previousValue (current - previous).
**JS Definition**
``` typescript
CpuUsage { user: number, system: number }
(previousValue?: CpuUsage): CpuUsage
```
**Implementation**
Implemented in `/src/platform`:
``` c
int32array cpuUsage(void);
```

### `resourceUsage`
Gets resource usage statistics.
**JS Definition**
``` typescript
(): {
  userCPUTime: number,
  systemCPUTime: number,
  maxRSS: number,
  sharedMemorySize: number,
  unsharedDataSize: number,
  unsharedStackSize: number,
  minorFaults: number,
  majorFaults: number,
  swappedOut: number,
  fsRead: number,
  fsWrite: number,
  ipcSent: number,
  ipcReceived: number,
  signalsCount: number,
  voluntaryContextSwitches: number,
  involuntaryContextSwitches: number,
}
```
**Implementation**
Implemented in `/src/platform`:
``` c
int32array resourceUsage(void);
```

### `memoryUsage`
Gets memory usage statistics.
**JS Definition**
``` typescript
(): {
  rss: number,
  heapTotal: number,
  heapUsed: number,
  external: number,
  arrayBuffers: number,
}
```
**Implementation**
Implemented in `/src/platform`:
``` c
int64array memoryUsage(void);
```

### `constrainedMemory`
Gets available constrained memory.
**JS Definition**
``` typescript
(): number | undefined
```
**Implementation**
Implemented in `/src/platform`:
``` c
// return array length is 0 if not available
int32array constrainedMemory(void);
```

### `kill`
Sends a signal to a process.
**JS Definition**
``` typescript
(pid: number, signal?: string | number): void
```
**Implementation**
Implemented in `/src/platform`:
``` c
void kill(int32_t pid, int32_t signal);
```

### `exit`
Terminates the process with optional code.
**JS Definition**
``` typescript
(code?: number): never
```
**Implementation**
Referring from `ESB.exit`.

### `execve`
Executes a program (POSIX only).
**JS Definition**
``` typescript
(file: string, args: string[], env: Record<string, string>): never
```

### `ref`
Keeps event loop active (opposite of unref).
**JS Definition**
``` typescript
(): void
```
**Implementation**
Referring from `ESB.setCanExit`.

### `unref`
Allows process to exit if only this is active.
**JS Definition**
``` typescript
(): void
```
**Implementation**
Referring from `ESB.setCanExit`.

### `finalization`
Finalization registry.
**JS Definition**
``` typescript
any
```

### `hrtime`
High-resolution time measurement.
**JS Definition**
``` typescript
(time?: [number, number]): [number, number]
```
**Implementation**
Implemented in `/src/platform`:
``` c
// [ seconds, nanoseconds ]
int64array hrtime();
```

### `openStdin`
Opens standard input stream.
**JS Definition**
``` typescript
(): void
```

### `allowedNodeEnvironmentFlags`
Set of allowed NODE_OPTIONS flags.
**JS Definition**
``` typescript
Set<string>
```
**Implementation**
Referring from `ESB.cliFlags`.

### `assert`
Asserts that a value is true. Equals to `require('node:assert').ok`.
**JS Definition**
``` typescript
(value: any, message?: string | Error): void
```
**Implementation**
Referring `require('node:assert').ok`.

### `features`
Lists available Node.js features.
**JS Definition**
``` typescript
Record<string, boolean>
```
**Implementation**
Referring from `ESB.buildConfigs`.

### `_fatalException`
Internal method to handle uncaught exceptions.
**JS Definition**
```typescript
(error: Error): boolean
```

### `setUncaughtExceptionCaptureCallback`
Sets a callback for uncaught exceptions.
**JS Definition**
```typescript
(callback: ((err: Error) => void) | null): void
```

### `hasUncaughtExceptionCaptureCallback`
Checks if an uncaught exception callback is set.
**JS Definition**
```typescript
(): boolean
```

### `emitWarning`
Emits a process warning.
**JS Definition**
```typescript
(warning: string | Error, options?: {
  type?: string;
  code?: string;
  detail?: string;
  ctor?: Function;
}): void
```

### `nextTick`
Queues a callback to be invoked in the next tick.
**JS Definition**
```typescript
(callback: Function, ...args: any[]): void
```
**Implementation**
Referring from `ESB.nextTick`.

### `_tickCallback`
Internal method to process next tick queue.
**JS Definition**
```typescript
(): void
```

### `sourceMapsEnabled`
Indicates if source maps are enabled.
**JS Definition**
```typescript
boolean
```

### `setSourceMapsEnabled`
Enables/disables source maps.
**JS Definition**
```typescript
(enabled: boolean): void
```

### `getBuiltinModule`
Gets a built-in module by name.
**JS Definition**
```typescript
(name: string): any
```
**Implementation**
The same as `require`, but only for built-in modules.

### `_debugProcess`
Internal method for process debugging.
**JS Definition**
```typescript
(pid: number): void
```
**Implementation**
No implementation. V8 debugging feature is meaningless for us.

### `_debugEnd`
Internal method to end process debugging.
**JS Definition**
```typescript
(pid: number): void
```
**Implementation**
No implementation. V8 debugging feature is meaningless for us.

### `_startProfilerIdleNotifier`
Starts profiler idle notifications.
**JS Definition**
```typescript
(): void
```
**Implementation**
Dummy implementation.

### `_stopProfilerIdleNotifier`
Stops profiler idle notifications.
**JS Definition**
```typescript
(): void
```
**Implementation**
Dummy implementation.

### `stdout`
Standard output stream.
**JS Definition**
```typescript
WriteStream
```
**Implementation**
Implemented in `/src/platform`, with `require('node:stream').WriteStream` wrapping around.
``` c
void stdout(const char* data);
```

### `stdin`
Standard input stream.
**JS Definition**
```typescript
ReadStream
```

### `stderr`
Standard error stream.
**JS Definition**
```typescript
WriteStream
```
**Implementation**
Implemented in `/src/platform`, with `require('node:stream').WriteStream` wrapping around.
``` c
void stderr(const char* data);
```

### `abort`
Immediately terminates the process with abort signal.
**JS Definition**
```typescript
(): never
```
**Implementation**
Invoking `process.kill` and send `SIGABRT` signal to the process itself.

### `umask`
Gets/sets the process file mode creation mask.
**JS Definition**
```typescript
(mask?: number): number
```
**Implementation**
Implemented in `/src/platform`.
``` c
int32_t umask(int32_t mask);
```

### `chdir`
Changes the current working directory.
**JS Definition**
```typescript
(directory: string): void
```
**Implementation**
Implemented in `/src/platform`.
``` c
void chdir(const char* directory);
```

### `cwd`
Gets the current working directory.
**JS Definition**
```typescript
(): string
```
**Implementation**
Implemented in `/src/platform`.
``` c
const char* cwd();
```

### `env`
Process environment variables.
**JS Definition**
```typescript
Record<string, string>
```
**Implementation**
Implemented in `/src/platform`.
``` c
stringarray env();  // the returned array looks like 
                    // [key1, value1, key2, value2, ...]
```

### `title`
Process title (name displayed in process lists).
**JS Definition**
```typescript
string
```
**Implementation**
Implemented in `/src/platform`.
``` c
char* title(const char* title);
```

### `argv`
Command-line arguments array.
**JS Definition**
```typescript
string[]
```
**Implementation**
Referring from `ESB.argv`.

### `execArgv`
Node.js-specific command-line options.
**JS Definition**
```typescript
string[]
```
**Implementation**
Referring from `ESB.argv`.

### `pid`
Process ID.
**JS Definition**
```typescript
number
```
**Implementation**
Implemented in `/src/platform`.
``` c
int32_t pid();
```

### `ppid`
Parent process ID.
**JS Definition**
```typescript
number
```
**Implementation**
Implemented in `/src/platform`.
``` c
int32_t ppid();
```

### `execPath`
Absolute path to the Node.js executable.
**JS Definition**
```typescript
string
```
**Implementation**
Resolve the path from `ESB.argv[0]`.

### `debugPort`
Debugger port number.
**JS Definition**
```typescript
number
```

### `argv0`
Original value of argv[0].
**JS Definition**
```typescript
string
```
**Implementation**
Referring from `ESB.argv`.

### `_preload_modules`
Array of preloaded modules.
**JS Definition**
```typescript
string[]
```

### `report`
Process diagnostic report generator.
**JS Definition**
```typescript
{
  writeReport: (filename?: string) => string;
  directory: string;
  filename: string;
  getReport: (err?: Error) => string;
  signal: string;
}
```

### `[Symbol(shapeMode)]`
Internal symbol for shape mode detection.
**JS Definition**
```typescript
boolean
```

### `[Symbol(kCapture)]`
Internal symbol for event capture mode.
**JS Definition**
```typescript
boolean
```


## `internalBinding('os')`

### `getHostname()`
Gets the system hostname.
**JS Definition**
```typescript
(): string
```
**Implementation**
Implemented in `/src/platform`:
```c
char* getHostname();
```

### `getLoadAvg()`
Gets system load averages.
**JS Definition**
```typescript
// values would be directly assigned to the input array
([1min, 5min, 15min averages]: Float64Array): void
```
**Implementation**
Implemented in `/src/platform`:
```c
float64array getLoadAvg();
```

### `getUptime()`
Gets OS uptime in seconds.
**JS Definition**
```typescript
(): number
```
**Implementation**
Implemented in `/src/platform`:
```c
double getUptime();
```

### `getTotalMem()`
Gets total system memory in bytes.
**JS Definition**
```typescript
(): number
```
**Implementation**
Implemented in `/src/platform`:
```c
int64_t getTotalMem();
```

### `getFreeMem()`
Gets free system memory in bytes.
**JS Definition**
```typescript
(): number
```
**Implementation**
Implemented in `/src/platform`:
```c
int64_t getFreeMem();
```

### `getCPUs()`
Gets information about CPU cores.
**JS Definition**
```typescript
(): Array<...[ 
    model: string, speed: number/* MHz */,
    user: number, nice: number, sys: number, idle: number, irq: number
]>
```
**Implementation**
Implemented in `/src/platform`:
```c
stringarray getCPUsModel(); // model names
int64array getCPUsOthers(); // user, nice, sys, idle, irq
```

### `getInterfaceAddresses()`
Gets network interface addresses.
**JS Definition**
```typescript
(): Array<...[
    name: string, address: string, netmask: string,
    family: 'IPv4' | 'IPv6', mac: string, internal: boolean,
    index: number
]>
```
**Implementation**
Implemented in `/src/platform`:
```c
// `internal` and `index` would be formatted as `string`
stringarray getInterfaceAddresses();
```

### `getHomeDirectory()`
Gets current user's home directory.
**JS Definition**
```typescript
(): string
```
**Implementation**
Implemented in `/src/platform`:
```c
char* getHomeDirectory();
```

### `getUserInfo()`
Gets information about current user.
**JS Definition**
```typescript
(): {
  uid: number,
  gid: number,
  username: string,
  homedir: string,
  shell: string | null
}
```
**Implementation**
Implemented in `/src/platform`:
```c
int32array getUserInfoUidGid();
stringarray getUserInfoUsernameHomedirShell();
```

### `setPriority()`
Sets process priority.
**JS Definition**
```typescript
(pid: number, priority: number): void
```
**Implementation**
Implemented in `/src/platform`:
```c
void setPriority(int32_t pid, int32_t priority);
```

### `getPriority()`
Gets process priority.
**JS Definition**
```typescript
(pid: number): number
```
**Implementation**
Implemented in `/src/platform`:
```c
int32_t getPriority(int32_t pid);
```

### `getAvailableParallelism()`
Gets an estimate of the default amount of parallelism.
**JS Definition**
```typescript
(): number
```
**Implementation**
Implemented in `/src/platform`:
```c
int32_t getAvailableParallelism();
```

### `getOSInformation()`
Gets OS information.
**JS Definition**
```typescript
(): [
  sysname: string,
  release: string,
  version: string,
  machine: string
]
```
**Implementation**
Implemented in `/src/platform`:
```c
// Returns OS info object
stringarray getOSInformation();
```

### `isBigEndian`
Indicates if the system uses big-endian byte order.
**JS Definition**
```typescript
(): boolean
```
**Implementation**
Implemented in `/src/platform`:
```c
bool isBigEndian();
```
