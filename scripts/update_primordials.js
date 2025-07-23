const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'node/lib/internal/per_context/primordials.js')
let outputPath = path.join(__dirname, '..', 'lib/primordials.js')

let code = fs.readFileSync(filePath, 'utf-8')

code = `
// AUTO GENERATED
// Run \`node scripts/update_primordials.js\` to update this file.

let primordials = {};

${code}

module.exports = primordials;
`

fs.writeFileSync(outputPath, code, 'utf-8')