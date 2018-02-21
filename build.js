const {compile} = require('nexe');

compile({
    input: './main.js',
    output: './tosabbreviator_XYZ',
    fakeArgv: 'production',
    target: (process.argv[2] || process)
})