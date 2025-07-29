
function wrapperFunctionName(bindingName, internalFunctionName){
    return `wrapper_${bindingName}_${internalFunctionName}`;
}

const {genWrapperDefinitions} = require('./genWrapperDefinitions.js');

function handleParams(configPath, code, scheme){
    const bindingName = scheme.name;

    const wrapperDefinitions = genWrapperDefinitions(configPath, scheme, wrapperFunctionName);

    let wrapperFunctions = 'void* wrapperFunctions[] = {\n';
    for(let i=0;i<scheme.bindings.length;i++){
        let func = scheme.bindings[i].name;
        wrapperFunctions += `    (void*)${wrapperFunctionName(bindingName, func)},\n`;
    }
    wrapperFunctions += '};\n';

    let wrapperNames = 'const char* wrapperNames[] = {\n';
    for(let i=0;i<scheme.bindings.length;i++){
        let name = scheme.bindings[i].name;
        wrapperNames += `    "${name}",\n`;
    }
    wrapperNames += '};\n';

    let wrapperParamCounts = 'int wrapperParamCounts[] = {\n';
    for(let i=0;i<scheme.bindings.length;i++){
        let count = scheme.bindings[i].params.length;
        wrapperParamCounts += `    ${count},\n`;
    }
    wrapperParamCounts += '};\n';

    const wrappersCount = scheme.bindings.length;

    code = code.replaceAll('$bindingName', bindingName)
    code = code.replaceAll('$wrapperDefinitions', wrapperDefinitions)
    code = code.replaceAll('$wrapperFunctions', wrapperFunctions)
    code = code.replaceAll('$wrapperNames', wrapperNames)
    code = code.replaceAll('$wrapperParamCounts', wrapperParamCounts)
    code = code.replaceAll('$wrappersCount', wrappersCount)

    return code;
}

const path = require('path');
const fs = require('fs');

function generateWrapperC(scheme, configPath){
    let code = fs.readFileSync(path.join(configPath, 'bindings.c'), 'utf-8')
    return handleParams(configPath, code, scheme)
}

function generateWrapperH(scheme, configPath){
    let code = fs.readFileSync(path.join(configPath, 'bindings.h'), 'utf-8')
    return handleParams(configPath, code, scheme)
}

module.exports = {
    generateWrapperC,
    generateWrapperH
}