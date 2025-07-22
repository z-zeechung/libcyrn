# `types` Internal Binding  
This binding includes both the interfaces from `internalBinding('types')` and type-checking interfaces from `internalBinding('util')`. All interfaces are ESB (Engine-Specific Bindings).  

---

## Global Injections  
- `primordials`  
- `esb` (*Engine-Specific Bindings*)  

---
## Engine Specific Bindings (ESB)

As listed below.

---

## Functions

**JS Definition:**
```javascript
function is[Type](obj: any): boolean
```

### From `internalBindings('types')`:  
- <del>`isExternal`</del>  
  *(No current plans to implement (NAPI support not considered for now))*  
- `isDate`  
- `isArgumentsObject`  
- `isBigIntObject`  
- `isBooleanObject`  
- `isNumberObject`  
- `isStringObject`  
- `isSymbolObject`  
- `isNativeError`  
- `isRegExp`  
- `isAsyncFunction`  
- `isGeneratorFunction`  
- `isGeneratorObject`  
- `isPromise`  
- `isMap`  
- `isSet`  
- `isMapIterator`  
- `isSetIterator`  
- `isWeakMap`  
- `isWeakSet`  
- `isArrayBuffer`  
- `isDataView`  
- `isSharedArrayBuffer`  
- `isProxy`  
- `isModuleNamespaceObject`  
- `isAnyArrayBuffer`  
- `isBoxedPrimitive`  

---

### Type-Checking Functions from `internalBinding('util')`:  
- `isArrayBuffer`  
- `isArrayBufferView`
- `isAsyncFunction`  
- `isDataView`  
- `isDate`  
- `isExternal`  
- `isMap`  
- `isMapIterator`  
- `isNativeError`  
- `isPromise`  
- `isRegExp`  
- `isSet`  
- `isSetIterator`  
- `isTypedArray`
- `isUint8Array`
- `isAnyArrayBuffer`  