# Source Organization and Compilation for C Bindings

To implement system-level interactions, Node.js leverages C++ interfaces bound to its runtime. Specifically, the Node core library uses the `internalBinding('name')` function—injected via internal `require`—to retrieve C bindings. This function returns an object containing C interfaces.

Rather than fully replicating Node's interfaces directly at the C level, our approach relies on higher-level JavaScript encapsulation. Herein, a *binding module* refers to any unit implementing one of `internalBinding`'s importable objects. These binding modules are injected into the global scope of corresponding higher-level shim modules as an `natives` object for further encapsulation, as detailed in [this documentation](./internal_require.md).

## C Code Specifications
- **Use POSIX-Compatible Interfaces.**
- **C99 Standard.**
- **Declare with `static inline`.**
- **For Platform-Specific Bindings (i.e. OS Specific), Provide a Dummy Implementation in the Code Base's Top and Write Patches for Each Platform. See [Platform-Specific Implementation Selection](#platform-specific-implementation-selection)**
- **Header files or `.inc` files should use macros starting with `CYRNEWIC_` to prevent duplicate inclusion. The meaning of CYRNEWIC is a word puzzle Easter egg.​**

## Source Organization
Each binding module consists of the following files:  
```
/src  
    /foobar  
        /win32  
            foobar_func1.inc  
        /linux  
            foobar_func1.inc  
        foobar_func1.inc  
        foobar_func2.inc  
    foobar.inc  
    foobar.json  
```
Refer to the *C Bindings* section in [Auto-Generation of C Binding Wrappers](./c_wrapper.md) for details on these files.

## Compilation
As noted in the aforementioned documentation, an automated wrapper generation script uses `foobar.json` to produce glue code. `foobar.inc` imports all `.inc` files under `/foobar`, each containing the implementation of a binding function. The auto-generated `foobar.c` imports both `foobar.inc` and `foobar.h`, while `foobar.h` exports the module-loading function from `foobar.c`. Thus, the import hierarchy is:  

`foobar_func1.inc`, `foobar_func2.inc` → `foobar.inc` → `foobar.c` → `foobar.h` → `main.c`  

The engine can then load bindings via `main.c`. All binding interfaces implemented as `inline static` are consolidated within `foobar.c` and uniformly exported. A representative compilation command appears as follows:  
```bash
gcc -o runtime main.c foobar.c -I /src /src/foobar  
```  
The `.inc` files act as headers containing single `inline static` functions, which are fully expanded within `foobar.c` and wrapped by auto-generated glue code.

## Platform-Specific Implementation Selection
As documented in [Auto-Generation of C Binding Wrappers](./c_wrapper.md), while our C bindings abstract engine differences, they do not abstract platform (i.e., operating system) differences. Therefore, platform-specific implementations are required. For instance, `/foobar/foobar_func1.inc` defines only a dummy implementation for simulating basic behavior on unsupported platforms. Platform-specific implementations reside in `/foobar/win32` and `/foobar/linux`.  

To utilize them during compilation:  
```bash
gcc -o runtime main.c foobar.c -I /src /src/foobar/win32 /src/foobar  
```  
Placing `/src/foobar/win32` before `/src/foobar` ensures the compiler prioritizes the platform-specific implementation, enabling targeted compilation per platform.  

If implementing an interface for an unsupported platform, create a custom folder containing the requisite `.inc` files and override the include path. Contributors are encouraged to submit a pull request (PR) for such additions.

## Platforms
Use MinGW-32/64 `gcc` when compiling on Windows.