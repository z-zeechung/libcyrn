
const fs = require('fs');
const path = require('path');

function genCollectOutput(ret, configPath) {
    let templatePath = path.join(
        configPath, 'collectOutput', ret+'.c'
    )
    if(!fs.existsSync(templatePath)){
        return "";
    }
    let template = fs.readFileSync(templatePath, 'utf-8')
    return template;
}

module.exports = {
    genCollectOutput
}