
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const jscodeshift = require('jscodeshift');

function extractCallInfo(str) {
  const reg = /\[CALL ([a-zA-Z0-9\\/._-]+) ([A-Za-z0-9_]+)\]/g
  const results = [];
  let match;

  while ((match = reg.exec(str)) !== null) {
    results.push([match[1], match[2]]);
  }

  return results;
}

function filterCallInfo(infos) {
    function isRelative(parentPath, childPath) {
        const normalizedParent = path.normalize(parentPath);
        const normalizedChild = path.normalize(childPath);
        return normalizedChild.startsWith(normalizedParent + path.sep) ||
            normalizedChild === normalizedParent;
    }
    return infos.filter(([m, name]) => {
        if(isRelative('lib/bindings', m)){
            return true;
        }
        if (isRelative('src', m) && m.endsWith('.inc')) {
            return true;
        }
        return false;
    })
}

function getSourceCode(infos){
    return infos.map(([m, name]) => {
        if(m.endsWith('.inc')){
            const incCode = fs.readFileSync(m, 'utf8');
            return [m, name, incCode]
        }
        return [m, name, findFunctionCode(m, name)]
    })
}

function testSingleCase(module, name, testCase) {
    const result = spawnSync('node', ['--expose-internals', path.join(__dirname, '_test.js'), module, name, testCase], { encoding: 'utf8' });
    let stdout = result.stdout.toString()
    let stderr = result.stderr.toString()
    let status = result.status

    if(status === 0){
        return undefined
    }

    let calls = extractCallInfo(stdout);

    calls = filterCallInfo(calls);
    
    calls.push([`test/${module}/${name}.js`, testCase])
    
    let sourceCode = getSourceCode(calls);

    let payload = `# ❌ Test failed on '${testCase}' in 'test/${module}/${name}'\n\n`
    payload += `## Return Value: ${status}\n\n`
    payload += `## Stdout: \n'''\n${stdout}\n'''\n\n`
    payload += `## Stderr: \n'''\n${stderr}\n'''\n\n`
    for(let [m, name, code] of sourceCode){
        if(!code) continue
        payload += `### '${name}' at '${m}':\n'''\n${code}\n'''\n\n`
    }

    return payload
}

// console.log(testSingleCase('buffer', 'from', 'testUtf16leStringEncoding'))
module.exports = { testSingleCase }

function findFunctionCode(filePath, functionName) {
  const source = fs.readFileSync(filePath, 'utf8');
  const j = jscodeshift;
  const root = j(source);
  
  let functionCode = undefined;
  
  // 1. top level decls (FunctionDeclaration)
  root.find(j.FunctionDeclaration, {
    id: {
      name: functionName
    }
  }).forEach(path => {
    functionCode = j(path).toSource();
  });
  
  if (functionCode) return functionCode;  // return top level func
  
  // 2. search in module.exports 
  // 1: module.exports = { functionName() {...} } / { functionName: function() {...} }
  root.find(j.AssignmentExpression, {
    left: {
      type: 'MemberExpression',
      object: { name: 'module' },
      property: { name: 'exports' }
    },
    right: { type: 'ObjectExpression' }
  }).forEach(moduleExport => {
    moduleExport.node.right.properties.forEach(prop => {
      // processing method(){} or key: function(){}
      if (
        (prop.key.name === functionName || prop.key.value === functionName) &&
        (prop.value.type === 'FunctionExpression' || prop.value.type === 'ArrowFunctionExpression')
      ) {
        functionCode = j(prop.value).toSource();
      }
    });
  });

  if (functionCode) return functionCode;  // return func in obj instant val

  // 2: module.exports.functionName = function() {...} / exports.functionName = ...
  root.find(j.AssignmentExpression, {
    left: {
      type: 'MemberExpression',
      property: { name: functionName }  
    },
    // plain, =>, method
    right: { type: /FunctionExpression|ArrowFunctionExpression/ }
  }).forEach(assignment => {
    const left = assignment.node.left;
    // validate left: module.exports 或 exports
    if (
      // match module.exports.property
      (
        left.object.type === 'MemberExpression' &&
        left.object.object?.name === 'module' &&
        left.object.property?.name === 'exports'
      ) ||
      // match exports.property
      (
        left.object.type === 'Identifier' &&
        left.object.name === 'exports'
      )
    ) {
      functionCode = j(assignment.node.right).toSource();
    }
  });
  
  return functionCode;  // return func or undefined
}