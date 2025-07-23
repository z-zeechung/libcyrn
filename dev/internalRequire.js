const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(path.join(__dirname, '..'))

const USE_ORIGINAL = [
    
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

    throw Error(`[ERROR] Internal require failed to import ${name}.`)
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
        module.exports
    )
}

module.exports = internalRequire