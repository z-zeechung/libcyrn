# General

## OBJECTIVE
- **Export the source code of Node's built-in modules.**
- **Re-implement native bindings in portable C code.**
- **Decouple v8 and libuv interfaces. Refactor portable stream, event, async hooks and worker mechanisms.**
- **Seek for optimal built-in module bundle size optimization through ESM conversion and in-code bundler hints. Decompose ICU data into selectable locale packages.**

Ultimate Objective: Run Node.js everywhere — on scalable, lightweight runtimes.

## Tasks
1. Re-implement native C bindings.
2. Shimming original code.
3. Build AI-powered testing framework.

## Boundary of This Repo
This repo does NOT provide:
- ❌ A specific runtime implementation.
- ❌ Implementations of module systems (CJS/ESM) or other import mechanisms.
- ❌ CLI tool implementation.
- ❌ Pre-built binaries or compiled bundles.

This repo DOES provide:
- ✅ Library source code ​*as-is*.
- ✅ Rigorously tested source files that ensures functionality.
- ✅ Clear documentation on how to resolve imports and how to compile the source code.

**Final Artifacts:**
1. Patched Node built-in module source code.
2. Native C bindings source code.
3. Test cases.

## Layout
```
/ai
/dev
/docs
/lib
    /bindings
    ... patches
/node
    /deps
    /lib
/src
    /fs
        open.inc
        read.inc
        ...
    fs.inc
    fs.json
    ... other bindings
/test
    ... test cases
/wrapper
```

### Agent-Driven Test Case Discovery (`/ai`)
Utilizing LLM agent workflow for code analysis to discover potential problem and generate test cases. This is still under investigation.

### Bindings and Patches (`/lib`)
[This file](./internal_require.md) explains how original Node's code in `/src` and patches in `/lib` are organized, and how `internal require` should be implemented.

### C Binding Implementation (`/src`)
See [*Auto-Generation of C Binding Wrappers*](./c_wrapper.md) and [*Source Organization and Compilation for C Bindings*](./compilation.md)

### Test Cases (`/test`)

### Binding Wrapper Generator (`/wrapper`)
The automatic C binding wrapper generator script.

### Driver for Testing (`/dev`)