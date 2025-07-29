
const path = require('path');
const fs = require('fs');

const TYPES = {
    "int32": "int32_t",
    "uint32": "uint32_t",
    "int64": "int64_t",
    "float64": "double",
    "boolean": "int",
    "string": "string",
    "wstring": "wstring",
    "arraybuffer": "array_buffer",
    "int32array": "int32_array",
    "int64array": "int64_array",
    "float64array": "float64_array",
    "stringarray": "string_array",
}

const {genInputs} = require('./types/genInputs.js')
const {genFreeInputs} = require('./types/genFreeInputs.js')
const {genCollectOutput} = require('./types/genCollectOutput.js')
const {genOutput} = require('./types/genOutput.js')
const {genFreeOutput} = require('./types/genFreeOutput.js')

function handleParams(configPath, code, bindingInfo, wrapperFunctionNameGenerator){

    const wrapperFunction = wrapperFunctionNameGenerator(bindingInfo.name);
    
    const inputsCount = bindingInfo.params.length;

    const inputs = genInputs(bindingInfo.params, configPath);

    let invoke = `${bindingInfo.function}(`
    for(let i = 0; i < inputsCount; i++){
        const name = `var${i}`;
        invoke += `${name}`;
        if(i < inputsCount - 1){
            invoke += ", ";
        }
    }
    invoke += ");";
    if(bindingInfo.return!=='void'){
        const type = TYPES[bindingInfo.return];
        invoke = `${type} retval = ` + invoke;
    }

    const freeInputs = genFreeInputs(bindingInfo.params, configPath);

    const freeOutput = genFreeOutput(bindingInfo.return);

    const collectOutput = genCollectOutput(bindingInfo.return, configPath);

    const output = genOutput(bindingInfo.return, configPath);

    code = code.replaceAll("$wrapperFunction", wrapperFunction);
    code = code.replaceAll("$inputsCount", inputsCount);
    code = code.replaceAll("$inputs", inputs);
    code = code.replaceAll("$invoke", invoke);
    code = code.replaceAll("$freeInputs", freeInputs);
    code = code.replaceAll("$freeOutput", freeOutput);
    code = code.replaceAll("$collectOutput", collectOutput);
    code = code.replaceAll("$output", output)

    return code;
}

function genWrapperDefinitions(configPath, scheme, wrapperFunctionNameGenerator) {
    const template = fs.readFileSync(
        path.join(configPath, 'sync.c'),
        'utf-8'
    )
    let defs = "";
    for(const binding of scheme.bindings){
        defs += handleParams(configPath, template, binding, (name)=>wrapperFunctionNameGenerator(scheme.name, name));
        defs += "\n\n";
    }
    return defs;
}

module.exports = {
    genWrapperDefinitions
}