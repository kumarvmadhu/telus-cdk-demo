const fs = require('fs-extra');
const path = require('path');

const lambdaSrcDir = path.join(__dirname, 'lambda');


// Copy node_modules
fs.copySync(path.join(__dirname, 'node_modules'), path.join(lambdaSrcDir, 'node_modules'));

console.log('Lambda function code and dependencies copied to build directory.');