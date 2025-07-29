
const fs = require('fs');
const path = require('path');

function genFreeOutput(ret) {
    let templatePath = path.join(
        __dirname, '..', 'freeOutput', ret+'.c'
    )
    if(!fs.existsSync(templatePath)){
        return "";
    }
    let template = fs.readFileSync(templatePath, 'utf-8')
    return template;
}

module.exports = {
    genFreeOutput
}