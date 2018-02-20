const {compile} = require('nexe');

compile({
    input: './main.js',
    output: './tosabbreviator_XYZ.exe',
    fakeArgv: 'production'
})