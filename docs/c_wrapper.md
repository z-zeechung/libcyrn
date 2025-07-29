# Auto-Generation of C Binding Wrappers

[This file](./internal_require.md) explains how do we mimic Node's `internalBinding` base on engine specific bindings (ESB) and native C bindings. In this file, we talk about the implementation of **native C bindings**.

#### Native C Bindings
We assume the execution of non-ESB bindings are composed of three steps:
1. Converting input JS type values to C types.
2. Processing C data.
3. Converting the output C type value to JS type value.

Step 2 contains engine-independent logic of a binding. We specify the core logic of each binding to be implemented as *POSIX-compatible plain C function*, and are shared by all runtime implementations. See below for [supported data types](#types) and the [code layout](#c-binding-layout). (Note that engine-independent ≠ platform-independent. Platform compliance are handled during compilation period.)

Step 1 and 3 converts data between JS and C types. We use an automatic script to generate wrapper codes for input and output data conversion. See below to learn about how to declare C bindings and how to configure for a specific runtime implementation.

#### Handling Errors
If an error occurs during step 2, the binding function should set `errno` to corresponding POSIX error code and immediately return. Make sure to return [proper on error values](#on_error_value_example) to avoid memory faults. Step 1 should reset `errno` before executing the function, and step 3 should check `errno` at first and determine whether to throw a JS `Error`.

#### Async Bindings
When it comes to asynchronous bindings, things gets a bit complex. But the general idea is the same. The wrapper should push a binding function to async worker thread and collect its result and error with a callback. This involves event queues. See [below](#asynchronous-wrapper-template) for details.

### Contents
- #### [Types](#types)
- #### [C Bindings](#c-binding-layout)
- #### [Runtime Configuration](#configuring-wrapper-generator-for-a-runtime-implementation)

## Types
For the simplicity of the wrapper implementation of different engines, only a limited range of simple types are defined. If you have a binding with complex param type, consider decomposing it into several bindings.
### Overview
|Name|JS Type|C Type|`struct` Definition|
|---|---|---|---|
|[int32](#int32)|`number`|`int32_t`||
|[uint32](#uint32)|`number`|`uint32_t`||
|[int64](#int64)|`number`|`int64_t`||
|[float64](#float64)|`number`|`double`||
|[boolean](#boolean)|`boolean`|`bool`, `int`||
|[string](#string)|`string`|`string`|`struct { int64_t length; unsigned char *data; };`|
|[wstring](#wstring)|`string`|`wstring`|`struct { int64_t length; unsigned int16_t *data; };`|
|[arraybuffer](#arraybuffer)|`ArrayBuffer`|`array_buffer`|`struct { int64_t size, char* data, void* ref }`|
|[int32array](#int32array-int64array-float64array)|`Array<number>`|`int32_array`|`struct { int count; int32_t* data }`|
|[int64array](#int32array-int64array-float64array)|`Array<number>`|`int64_array`|`struct { int count; int64_t* data }`|
|[float64array](#int32array-int64array-float64array)|`Array<number>`|`float64_array`|`struct { int count; double* data }`|
|[stringarray](#stringarray)|`Array<string>`|`string_array`|`struct { int count; string *data }`|
|[void](#void)|`undefined`|`void`||

### `int32`
Integer represented with 32 bits.
**JS Type:** `number`
**C Definition:**
``` c
#include <stdint.h>

int32_t foobar;
```
**As an Input Param:** Pass by value.
**As a Return Value:** Pass by value.

### `uint32`
Unsigned integer represented with 32 bits.
**JS Type:** `number`
**C Definition:**
``` c
#include <stdint.h>

uint32_t foobar;
```
**As an Input Param:** Pass by value.
**As a Return Value:** Pass by value.

### `int64`
Integer represented with 64 bits.
**JS Type:** `number`
**C Definition:**
``` c
#include <stdint.h>

int64_t foobar;
```
**As an Input Param:** Pass by value.
**As a Return Value:** Pass by value.

### `float64`
Double-precision floating-point. We assume the C `double` is in line with IEEE 754 definition on each machine.
**JS Type:** `number`
**C Definition:**
``` c
double foobar;
```
**As an Input Param:** Pass by value.
**As a Return Value:** Pass by value.

### `boolean`
Boolean value, `true`(`1`) or `false`(`0`).
**JS Type:** `number`
**C Definition:**
``` c
#include <stdbool.h>

bool foo = true;    // or int foo = 1;
bool bar = false;   // or int bar = 0;
```
**As an Input Param:** Pass by value.
**As a Return Value:** Pass by value.

### `string`
A **UTF-8** string. The value of the string could be `NULL`.
**JS Type:** `string`
**C Definition:**
``` c
char* str;
```
<del>**As an Input Param:** A `const char* str` C string pointer. This input string should never be modified or freed within the binding code.
**As a Return Value:** A `char*` C string pointer pointing to a memory space allocated by `malloc`. This memory should not be freed within the binding code. The external wrapper code ought to free this allocated memory.</del>
**Value On Error:** `{ length: 0, data: NULL }`. <a id="on_error_value_example"></a>

### `wstring`
Wide `char` string encoded in **UTF-16**. The value of the string could be `NULL`.
**JS Type:** `string`
**C Definition:**
``` c
char* str;
```
<del>**As an Input Param:** A `const char* str` C string pointer. This input string should never be modified or freed within the binding code.
**As a Return Value:** A `char*` C string pointer pointing to a memory space allocated by `malloc`. This memory should not be freed within the binding code. The external wrapper code ought to free this allocated memory.</del>
**Value On Error:** `{ length: 0, data: NULL }`.

### `arraybuffer` (TODO)
A C `struct` representing JS `ArrayBuffer` object. The `data` field points to the raw memory block of the `ArrayBuffer`. `data` field could be `NULL`.
**JS Type:** `ArrayBuffer`
**C Definition:**
``` c
#include "types.h"

/* typedef struct {
    int64_t size;
    char* data;
} array_buffer; */
array_buffer arrbfr;
```
**As an Input Param:** An `array_buffer` struct passed by value. The `data` field might be `NULL` in some extreme cases, validate it for stability. `data` field might be processed outside the main thread, though this causes race conditions. Only do so when aligning with Node's behaviors.
**As a Return Value:** DO NOT RETURN THIS TYPE.<del>An `array_buffer` struct passed by value. The `data` field points to a memory space allocated by `malloc`. This memory should not be freed within the binding code. The external wrapper code ought to free this allocated memory.
**Value On Error:** `{ size: 0, data: NULL }`.</del>

### `int32array` `int64array` `float64array`
A C `struct` representing an `int32`/`int64`/`float64` array. `data` field could be `NULL`.
**JS Type:** `Array<number>`
**C Definition:**
``` c
#include "types.h"

/* 
typedef struct {
    int count;
    int32_t* data;
} int32array; 

typedef struct {
    int count;
    int64_t* data;
} int64array;

typedef struct {
    int count;
    double* data;
} float64array;
*/
int32array int32arr;
int64array int64arr;
float64array float64arr;
```
**As an Input Param:** Should not be used as an input param.
**As a Return Value:** An `int32array`/`int64array`/`float64array` struct passed by value. The `data` field points to a memory space allocated by `malloc`. This memory should not be freed within the binding code. The external wrapper code ought to free this allocated memory.
**Value On Error:** `{ count: 0, data: NULL }`.

### `stringarray`
A C `struct` representing a string array. `data` field could be `NULL`, and elements in the array could be `NULL`.
**JS Type:** `Array<string>`
**C Definition:**
``` c
#include "types.h"

typedef struct {
    int count;
    string *data;
} stringarray;

stringarray strarr;
```
<del>**As an Input Param:** Should not be used as an input param.
**As a Return Value:** An `stringarray` struct passed by value. The `data` field points to an dynamic array allocated by `malloc`, and each element in this array might be `NULL` or a pointer to a string allocated by `malloc`. These allocated memory should not be freed within the binding code. The external wrapper code ought to free these allocated memory.</del>
**Value On Error:** `{ count: 0, data: NULL }`.

### `void`
**JS Type:** `undefined`
**C Definition:** `void`

---

## C Binding Layout
Say that we have a C binding called `foobar`, and `foobar` has two functions: `func1` and `func2`. The code layout of `foobar` would look like this:
```
/src
    /foobar
        foobar_func1.inc
        foobar_func2.inc
    foobar.inc
    foobar.json
```
`.inc` is a special type of C code definition. It is intended to be included directly by other files.

In `foobar_func1.inc`, we define `func1`:
``` c
#include <stdint.h>

// static: private. an internal binding is an independent unit.
// inline: ensure the code is inlined to wrapper function
// foobar_func1: name with format `${bindingName}_${funcName}` to avoid conflict.
static inline int32_t foobar_func1(
    int32_t a, int32_t b    // plain C arguments
) {
    return a + b;
}
```
And we do the similar thing in `foobar_func2.inc`. The definition of `func2`, let's say, `static inline stringarray foobar_func2(array_buffer, bool);`

Once we defined all functions, we export them in `foobar.inc`:
``` c
#include "foobar_func1.inc"
#include "foobar_func2.inc"
```

And then, we define the export information in `foobar.json`. This tells script how to generate wrappers:
``` json
{
    "name": "foobar",
    // "include": "foobar.inc",
    "bindings": [
        {
            "name": "func1",                // name in JS
            "function": "foobar_func1",     // C binding name
            "params": [ "int32", "int32" ], // input types
            "return": "int32"               // output type
        },
        {
            "name": "func2Sync",
            "function": "foobar_func2",
            "params": [ "arraybuffer", "boolean" ],
            "return": "stringarray"
        },
        {
            "name": "func2",
            "function": "foobar_func2",
            "params": [ "arraybuffer", "boolean" ],
            "return": "stringarray",
            "async": true   // this will be an async function
        }
    ]
}
```

Once you generated the wrapper code and compiled it, you can use it in JS:
``` javascript
console.log(internalBinding('foobar'));
/** {
 *   func1: [Function: func1],
 *   func2Sync: [Function: func2Sync],
 *   func2: [AsyncFunction: func2]
} */
```

The `foobar.json` is known as "require schema". Below is the definition of a require schema:

### Require Schema Format
``` typescript
type WrapperTypes = 
    "int32" | "uint32" | "int64" | "uint64" | 
    "double" | "string" | "stringarray" | 
    "arraybuffer" | "int32array" | "int64array" | 
    "float64array" | "boolean" | "void";

interface RequireSchema {
    name: string;       // C binding name
    include: string;    // C header file
    bindings: Array<RequireSchemaBinding>;
}

interface RequireSchemaBinding {
    name: string;                 // JS binding name
    function: string;             // C function name
    params: Array<WrapperTypes>;  // C function parameters
    return: WrapperTypes;         // C function return type
    async?: boolean;              // is async
}
```

### C Code Specifications
**See [*Compilation*](./c_wrapper.md#c-code-specifications).**

---

## Configuring Wrapper Generator for a Runtime Implementation

Wrapper generator configs are composed of a collection of C template files. We will demostrate the usage of the configuration by taking QuickJS APIs as an example.

### Layout
```
/
    /wrapper_configs
        /input
            int32.c
            uint32.c
            ...
        /freeInput
            string.c
        /collectOutput
            int32.c
            uint32.c
            ...
        /output
            int32.c
            uint32.c
            ...
        /outputCb
            int32.c
            uint32.c
            ...
        sync.c
        async.c
        bindings.c
        bindings.h
```

### Input Conversion and Recycling
Take `int32` as an example. `/input/int32.c` would look like this:
``` c
    int32_t var$idx;
    JS_ToInt32(ctx, &var$idx, argv[$idx]);
```
`$idx` is the index of this argument in JS function call. This will be replaced to actuall value by the wrapper generator:
``` c
    int32_t var0;
    JS_ToInt32(ctx, &var0, argv[0]);
```

For some types that allocates memory, we need to recycle them. Take `string` as an example:
``` c
    /* /input/string.c */
    JSValue var$idx = JS_ToCString(ctx, argv[$idx]);

    /* /freeInput/string.c */
    JS_FreeCString(ctx, var$idx);
```
The code in `/freeInput/string.c` will be appended to the end of the generated code.

### Collect and Return Output
The generator will name the original output as `retval` like:
``` c
    // type is auto determined by generator
    char* retval = foobar_func(var0, var1);
```
Then if the return value concerns with dynamic memory allocation, you should first collect it:
``` c
    /* /collectOutput/string.c */
    JSValue retstr = JS_NewStringLen(ctx, retval, strlen(retval));
```
After that, the generator appends a code to free the string:
``` c
    free(retval);
```
Now you can return the collected value:
``` c
    /* /output/string.c */
    return retstr;
```
Or pass is to callback in async wrapper:
``` c
    /* /outputCb/string.c */
    JSValue cbArgs[2];
    cbArgs[0] = JS_UNDEFINED;
    cbArgs[1] = retstr;
    JS_Call(ctx, cb, this_val, 2, cbArgs);
    JS_FreeValue(ctx, retstr);
```

### Synchronous Wrapper Template
``` c
// sync.c

static JSValue $wrapperFunction(
    JSContext *ctx, 
    JSValueConst this_val, 
    int argc, JSValueConst *argv
) {
    $inputs

    errno = 0;
    $invoke
    $freeInputs

    if(errno != 0) {
        $freeOutput
        return JS_ThrowInternalError(ctx, "errno: %d", errno);
    }

    $collectOutput
    $freeOutput
    $output
}
```

### Asynchronous Wrapper Template
``` c
// async.c
struct $wrapperName_payload {
    $inputTypes
    $outputType
    JSValue cb;    // callback
    int errnum;
    JSContext *ctx, 
    JSValueConst this_val
};

static void $wrapperName_done(
    struct $wrapperName_payload *payload
){
    $inputsFromPayload
    $outputFromPayload

    $freeInputs

    JSContext *ctx = payload->ctx;
    JSValue cb = payload->cb;
    JSValueConst this_val = payload->this_val;

    if(payload->errnum != 0) {
        $freeOutput
        JSValue cbArgs[2];
        cbArgs[0] = JS_NewError(ctx, "errno: %d", errno);
        cbArgs[1] = JS_UNDEFINED;
        JS_Call(ctx, cb, JS_UNDEFINED, 2, cbArgs);
    }else{
        $collectOutput
        $freeOutput
        $outputCb
    }

    JS_FreeValue(ctx, payload->req);
    free(payload);
}

static void $wrapperName_worker(
    struct $wrapperName_payload *payload
){
    errno = 0;
    $inputsFromPayload
    $invoke
    $outputToPayload
    payload->errnum = errno;
}

static JSValue $wrapperFunction(
    JSContext *ctx,
    JSValueConst this_val,
    int argc, JSValueConst *argv
) {
    struct $wrapperName_payload *payload = malloc(
        ctx, sizeof(struct $wrapperName_payload)
    );
    $inputs
    $inputsToPayload
    payload->cb = JS_DupValue(argv[$inputsCount]);
    payload->ctx = ctx;
    payload->this_val = this_val;
    execute_async_job(
        payload,
        $wrapperName_worker,
        $wrapperName_done
    );
    return JS_UNDEFINED;
}
```

### `binding.c` and `binding.h`

``` c
// binding.c

#include <stdint.h>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include "types.h"

#include "$bindingName.h"
#include "$bindingName.inc"

$wrapperDefinitions

$wrapperFunctions   // function array of wrappers

$wrapperNames   // array of wrapper names

$wrapperParamCounts   // array of wrapper parameter counts

static const JSCFunctionListEntry bindings_funcs[$wrappersCount];

static int bindings_module_init(JSContext *ctx, JSModuleDef *m) {
    for(int i = 0; i < $wrappersCount; i++) {
        bindings_funcs[i] = JS_CFUNC_DEF(
            wrapperNames[i], 
            wrapperParamCounts[i], 
            wrapperFunctions[i]
        );
    }
    return JS_SetModuleExportList(ctx, m, bindings_funcs, $wrappersCount);
}

JSModuleDef *js_init_$bindingName_bindings(
    JSContext *ctx
) {
    JSModuleDef *m = JS_NewCModule(
        ctx, "$bindingName", bindings_module_init
    );
    if (!m) return NULL;
    
    JS_AddModuleExportList(ctx, m, bindings_funcs, $wrappersCount);
    
    return m;
}

```

``` c
// bindings.h

#ifndef BINDINGS_$bindingName_H
#define BINDINGS_$bindingName_H

#include <quickjs.h>

#ifdef __cplusplus
extern "C" {
#endif

JSModuleDef *js_init_$bindingName_bindings(
    JSContext *
);

#ifdef __cplusplus
}
#endif

#endif // BINDINGS_$bindingName_H
```