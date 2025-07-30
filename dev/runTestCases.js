const {testSingleCase} = require('./testSingleCase.js');

const fs = require('fs')
const path = require('path')

const M = process.argv[2]

const cases = fs.readdirSync(path.join(__dirname, '..', 'test', M))
    .filter((f) => f.endsWith('.js'))
    .map((f) => f.slice(0, -3))

const fails = []

for(const name of cases) {
    const m = require(path.join(__dirname, '..', 'test', M, name + '.js'))
    for(let c in m){
        if(testSingleCase(M, name, c)){
            console.log(`❌ Failed on '${c}' in 'test/${M}/${name}'.`)
            fails.push({
                module: M,
                bundle: name,
                'case': c
            })
        }else{
            console.log(`✅ Passed on '${c}'.`)
        }
    }
}

console.table(fails)