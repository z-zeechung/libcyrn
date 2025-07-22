# `util` Internal Binding

---

## **Global Injections**
- `primordials`
- `natives` (`util` C bindings)
- `esb` (engine-specific bindings)

---

### **Symbols**  
Defined in the JavaScript domain:  

#### **`arrow_message_private_symbol`**  
`Symbol(node:arrowMessage)`  

#### **`contextify_context_private_symbol`**  
`Symbol(node:contextify:context)`  

#### **`decorated_private_symbol`**  
`Symbol(node:decorated)`  

#### **`transfer_mode_private_symbol`**  
`Symbol(node:transfer_mode)`  

#### **`host_defined_option_symbol`**  
`Symbol(node:host_defined_option_symbol)`  

#### **`js_transferable_wrapper_private_symbol`**  
`Symbol(node:js_transferable_wrapper)`  

#### **`entry_point_module_private_symbol`**  
`Symbol(node:entry_point_module)`  

#### **`entry_point_promise_private_symbol`**  
`Symbol(node:entry_point_promise)`  

#### **`module_source_private_symbol`**  
`Symbol(node:module_source)`  

#### **`module_export_names_private_symbol`**  
`Symbol(node:module_export_names)`  

#### **`module_circular_visited_private_symbol`**  
`Symbol(node:module_circular_visited)`  

#### **`module_export_private_symbol`**  
`Symbol(node:module_export)`  

#### **`module_parent_private_symbol`**  
`Symbol(node:module_parent)`  

#### **`napi_type_tag`**  
`Symbol(node:napi:type_tag)`  

#### **`napi_wrapper`**  
`Symbol(node:napi:wrapper)`  

#### **`untransferable_object_private_symbol`**  
`Symbol(node:untransferableObject)`  

#### **`exit_info_private_symbol`**  
`Symbol(node:exit_info_private_symbol)`  

#### **`promise_trace_id`**  
`Symbol(node:promise_trace_id)`  

#### **`source_map_data_private_symbol`**  
`Symbol(node:source_map_data_private_symbol)`

---

## **Constants**
```c
kPending:                  0,  // Promise pending state
kFulfilled:                1,  // Promise fulfilled state
kRejected:                 2,  // Promise rejected state
kExiting:                  0,  // Process exit status
kExitCode:                 1,  // Exit code identifier
kHasExitCode:              2,  // Exit code presence flag
ALL_PROPERTIES:            0,  // Property filter: all
ONLY_WRITABLE:             1,  // Property filter: writable only
ONLY_ENUMERABLE:           2,  // Property filter: enumerable only
ONLY_CONFIGURABLE:         4,  // Property filter: configurable only
SKIP_STRINGS:              8,  // Property filter: skip string keys
SKIP_SYMBOLS:             16,  // Property filter: skip symbol keys
kDisallowCloneAndTransfer: 0,  // Transfer policy: no cloning/transferring
kTransferable:             1,  // Transfer policy: allow transferring
kCloneable:                2   // Transfer policy: allow cloning
```
**Implementation:**  
Defined in `/src/util`:  
```c
int32array constants(void);
```

---

## **Functions**
### **`defineLazyProperties`**  
  Defined in the JS domain.

### **`getOwnNonIndexProperties`**  
  Pure JS implementation: Retrieves an object's own non-index properties.

### **`sleep`**  
  Defined in `/src/util`:  
  ```c
  void sleep(int64_t ms);  // Suspends execution for milliseconds
  ```

### **`parseEnv`**  
  Pure JS implementation: Shares parsing logic with [*platform.loadEnvFile*](./platform.md#loadenvfile).

### **`guessHandleType`**  
  Integrates with `lib/bindings/_handles`. See [*platform* Internal Binding](./platform.md#_getactivehandles).

---

## **ESB (Engine-Specific Bindings)**
### **ESB (Engine-Specific Bindings)**

#### **`isInsideNodeModules`**  
Checks if file path is in `node_modules`

#### **`getPromiseDetails`**  
Inspects Promise internals

#### **`getProxyDetails`**  
Inspects Proxy internals

#### **`getCallerLocation`**  
Retrieves caller source location

#### **`previewEntries`**  
Preview iterable entries (e.g., Map/Set)

#### **`getConstructorName`**  
Gets constructor name of object

#### **`getExternalValue`**  
Extracts value from External object

#### **`getCallSites`**  
Captures call stack details

#### **`arrayBufferViewHasBuffer`**  
Checks if ArrayBufferView has backing buffer

#### **`shouldAbortOnUncaughtToggle`**  
`Uint32Array(1)` - Toggle for uncaught exception behavior

---

## **Type Validation Functions**  
Merged with `internalBinding("types")`. See [`types` Internal Binding](./types.md#type-checking-functions-from-internalbindingutil).  