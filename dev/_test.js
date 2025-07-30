const fs = require('fs')
const path = require('path')
const { argv } = require('process')

const ROOT = path.resolve(path.join(__dirname, '..'))

const USE_ORIGINAL = [
    
]

const TRACED_FILES = [
    'bindings/buffer', 'buffer', 'internal/buffer'
]

let internalRequireCache = {}

function internalRequire(name) {
    if (internalRequireCache[name]) {
        return internalRequireCache[name].exports
    }

    if(USE_ORIGINAL.includes(name)){
        console.warn(`[WARNING] Importing built-in module ${name} from Node.`)
        internalRequireCache[name] = { exports: require(name) }
        return internalRequireCache[name].exports
    }

    let patchPath = path.join(ROOT, 'lib', name+'.js')
    if (fs.existsSync(patchPath)) {
        const module = { exports: {} }
        internalRequireCache[name] = module
        loadFromPath(module, patchPath, name)
        return module.exports
    }

    let nodePath
    if (name.startsWith('internal/deps')) {
        let relDepsPath = path.posix.relative('internal/deps', name)
        nodePath = path.join(ROOT, 'node', 'deps', relDepsPath+'.js')
    } else {
        nodePath = path.join(ROOT, 'node', 'lib', name+'.js')
    }
    if (fs.existsSync(nodePath)) {
        const module = { exports: {} }
        internalRequireCache[name] = module
        loadFromPath(module, nodePath, name)
        return module.exports
    }

    if(fs.existsSync(path.join(__dirname, name))){
        const module = { exports: {} }
        internalRequireCache[name] = module
        loadFromPath(module, path.join(__dirname, name), name)
        return module.exports
    }

    throw new Error(`Cannot find module ${name}`)
}

let nitbs = []
function internalBinding(name){
    let shimPath = path.join(ROOT, 'lib', 'bindings', name+'.js')
    if(fs.existsSync(shimPath)){
        return internalRequire(`bindings/${name}`)
    }
    if(!nitbs.includes(name)){
        nitbs.push(name)
        console.warn(`[WARNING] Importing internal binding ${name} from Node.`)
    }
    return require('internal/test/binding').internalBinding(name)
}

function loadFromPath(module, path, name) {
    let code = fs.readFileSync(path, 'utf-8')
    
    const wrapper = new Function(
        'module', 
        'require', 
        'internalBinding', 
        'exports',
        'esb',
        'natives',
        `
            ${name==='process'?'':'const process = require("process");'}
            ${name==='primordials'?'':'const primordials = require("primordials");'}

            ${code}
        `
    )
    
    wrapper(
        module,
        internalRequire,
        internalBinding,
        module.exports,
        esb,
        natives
    )

    if(TRACED_FILES.includes(name)){
        wrapModuleExports(module, name)
    }
}

function wrapModuleExports(module, name){
    function resolveModulePath(name){
        let patchPath = path.join(ROOT, 'lib', name+'.js')
        if (fs.existsSync(patchPath)) {
            return path.relative(ROOT, patchPath)
        }
        let shimPath = path.join(ROOT, 'lib', 'bindings', name+'.js')
        if(fs.existsSync(shimPath)){
            return path.relative(ROOT, shimPath)
        }
        let nodePath
        if (name.startsWith('internal/deps')) {
            let relDepsPath = path.posix.relative('internal/deps', name)
            nodePath = path.join(ROOT, 'node', 'deps', relDepsPath+'.js')
        } else {
            nodePath = path.join(ROOT, 'node', 'lib', name+'.js')
        }
        if (fs.existsSync(nodePath)) {
            return path.relative(ROOT, nodePath)
        }
        return path.relative(ROOT, path.join(__dirname, name))
    }
    for(let key in module.exports){
        let o = module.exports[key]
        if(typeof o === 'function'){
            module.exports[key] = new Proxy(o, {
                apply(target, thisArg, args) {
                    console.log(`[CALL ${resolveModulePath(name)} ${key}] Input params:`, args)
                    let ret = target.apply(thisArg, args)
                    console.log(`[ENDCALL] Return value:`, ret)
                    return ret
                }
            })
        }
    }
}

const esb = {
    kMaxLength: require('buffer').kMaxLength,
    kStringMaxLength: require('buffer').kStringMaxLength
}

const natives = {
    buffer: require(path.join(__dirname, 'src', 'buffer.node'))
}


function runTestCase(module, name, testCase){
    TRACED_FILES.push(`../test/${module}/${name}.js`)
    internalRequire(`../test/${module}/${name}.js`)[testCase]()
}

runTestCase(argv[2], argv[3], argv[4])