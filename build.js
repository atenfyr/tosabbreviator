//nexe -i main.js -o tosabbreviator_XYZ.exe --fake-argv hello

const {compile} = require('nexe');

compile({
    input: './main.js',
    output: './tosabbreviator_XYZ.exe',
    fakeArgv: 'hello'
})