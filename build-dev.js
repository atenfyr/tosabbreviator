const {compile} = require('nexe');

console.log('Compiling..');
compile({
    input: './main.js',
    output: './tosabbreviator_XYZ',
    fakeArgv: 'production',
    loglevel: 'silent',
    target: 'windows-x64'
}).then(() => {
    console.log('Finished windows-x64');
});
compile({
    input: './main.js',
    output: './tosabbreviator_XYZ',
    fakeArgv: 'production',
    loglevel: 'silent',
    target: 'mac-x64'
}).then(() => {
    console.log('Finished mac-x64');
});