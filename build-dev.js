const {compile} = require('nexe');

console.log('Compiling..');
compile({
    input: './main.js',
    output: './tosabbreviator_XYZ',
    fakeArgv: 'production',
    loglevel: 'silent',
    target: 'windows-x64',
    resources: './config.js'
}).then(() => {
    console.log('Finished windows-x64');
});