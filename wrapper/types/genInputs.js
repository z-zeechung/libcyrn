
const fs = require('fs');
const path = require('path');

function genInputs(params, configPath) {
    let inputs = ''

    let idx = 0;
    for(let type of params) {
        let templatePath = path.join(
            configPath, 'input', type+'.c'
        )
        if(!fs.existsSync(templatePath)) {
            idx++;
            continue;
        }
        let template = fs.readFileSync(templatePath, 'utf-8')
        template = template.replaceAll('$idx', `${idx}`)
        inputs += template + '\n'
        idx++;
    }
    return inputs
}

module.exports = {
    genInputs
}