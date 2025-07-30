const fs = require('fs')
const path = require('path')

const M = process.argv[2]

const caseFiles = fs.readdirSync(path.join(__dirname, '..', 'test', M))
    .filter((f) => f.endsWith('.js'))
    .map((f) => path.join(__dirname, '..', 'test', M, f))

for (const f of caseFiles) {
    const m = require(f)
    for(let testCase in m){
        try{
            m[testCase]()
        }catch(e){
            console.log(`Test case '${testCase}' in ${f} is invalid.:`, e)
        }
    }
}