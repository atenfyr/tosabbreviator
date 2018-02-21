const {compile} = require('nexe');

let chosenTarget = process.argv[2];
let outputLocation = './tosabbreviator_XYZ';

switch(Number(chosenTarget)) {
    case 0:
        chosenTarget = 'windows-x64'
        break;
    case 1:
        chosenTarget = 'mac-x64'
        outputLocation = './tosabbreviator_XYZ_mac';
        break;
    case 2: // town of salem steam for linux doesn't exist but maybe in the future?
        chosenTarget = 'linux-x64'
        outputLocation = './tosabbreviator_XYZ_linux';
        break;
}

console.log('Compiling for ' + chosenTarget);

compile({
    input: './main.js',
    output: outputLocation,
    fakeArgv: 'production',
    loglevel: (process.argv[3] || 'info'),
    target: (chosenTarget || process)
});