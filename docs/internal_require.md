### Node Built-in Modules Source Code Organization, Patch Mechanism, and Internal Require Implementation Requirements  

This document outlines the organization of JavaScript source code in this repository and specifies the implementation requirements for `internal require`.  

## File Layout Overview  
```
/lib
    /bindings
    ... patches
/node
    /deps
    /lib
```

## Node Built-in Modules Source Code  
The `/node` directory contains the Node.js source code. `/node/deps` holds Node's dependencies, while `/node/lib` contains the source code for Node built-in modules.  

Modules within `/node/lib` import each other using `require`, which differs from the `require` used in user scripts. This is Node's `internal require`. Modules reference each other using normalized paths relative to `/node/lib`, such as `"path"` or `"internal/util/types"`, without file extensions. Paths must:  
- Use forward slashes (`/`) exclusively  
- Avoid extra slashes or relative path indicators (`./`, `../`)  
- Omit the `node:` prefix  
- Each file has a globally unique import name  

An exception exists for files under `/deps`, which are mapped to `internal/deps` in this import path system. For example, `node/deps/minimatch/index.js` is imported via `internal/deps/minimatch/index`.  

## Bindings and Patch Code  
The `/lib` directory contains binding shims and patch code. Files in `/lib` override corresponding files in `/node/deps`. During `internal require` resolution, the resolver must first check `/lib` for a matching patch before falling back to `/node/lib`. For instance, if `/lib/process.js` exists, `require('process')` will import `/lib/process.js` instead of `/node/lib/process.js`.  

### Binding Shims  
`/lib/bindings` contains shims for internal bindings. Internal bindings are Node's low-level C bindings, imported via `internalBinding('name')` in original Node. In this implementation, files under `/lib/bindings` wrap interfaces exposed by our C bindings to mimic original Node internal bindings. For example:  
```js  
function internalBinding(name) {  
    return require(`bindings/${name}`);  
}  
```  
This implementation is functionally equivalent to the original `internalBinding`. Note that bindings are also imported using `internal require`-style names.  

## Global Injections for Internal Require  
When CommonJS `require` imports a module, it encapsulates the module code within a function body and injects global variables. Similarly, `internal require` must inject specific global variables when importing built-in modules, with some differences:  

**Injected for all built-in modules:**  
- `primordials`: Imported via `require('internal/per_context/primordials')`. (Original `primordials` are injected globally rather than exported via CommonJS. A patch in `/lib` encapsulates it as an exported object.)  
- `process`: Imported via `require('process')`. This uses the reimplemented version in `/lib` instead of the global version, facilitating execution in restricted environments.  
- `require`: The `internal require` function itself.  
- `internalBinding`: As described earlier.  
- `exports` and `module.exports`: Used to retrieve the module's exported values.  

**Additional injections for `/lib/bindings` modules:**  
- `Engine Specific Bindings (ESB)`: Contains all ESB functions. Binding shims use this to access engine-specific functionality.  
- `natives`: The underlying C interface exports for the specific binding shim. <del>**Note:** This is unique to each shim. The engine implementation must bundle bindings from `/src` and export them as separate modules to JavaScript. Corresponding relationships are documented in individual files under `[/doc/bindings](./bindings)`.</del>

## Implementing Internal Require  
**Note:** This repository does not provide concrete `internal require` implementations. It only specifies implementation standards, to be executed by specific engine implementations.  

As stated, each built-in module has a unique name mapping. Implementations may establish a name-to-module index via any method (filesystem, binary packaging, etc.). 

After retrieving module content:  
1. Encapsulate it within a function body.  
2. Inject the required global variables into the top-level function scope.  
3. Implement `internal require` and `internalBinding` as specified.  

For binding shims:  
- Inject `ESB` as described.  
- Inject the `natives` object corresponding to the shim's C binding module.  
- Implement `ESB` according to the ESB list.  
- The C binding modules (from `/src`) are encapsulated by an [automated wrapper code generator](./c_wrapper.md), compiled with the engine, and made importable within the engine.  

After encapsulating the module code:  
1. Execute the function.  
2. Retrieve the value of `module.exports`.  
3. Register this value in the `internal require` global cache.  
4. Return the exported value.  

**Caching:** Before each import attempt, check the global cache. Return cached values if available.