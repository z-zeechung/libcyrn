
const fs = require('fs');
const path = require('path');

function genOutput(ret, configPath) {
    let templatePath = path.join(
        configPath, 'output', ret+'.c'
    )
    if(!fs.existsSync(templatePath)){
        return "";
    }
    let template = fs.readFileSync(templatePath, 'utf-8')
    return template;
}

module.exports = {
    genOutput
}