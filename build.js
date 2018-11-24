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

if (chosenTarget === 'help') {
    console.log('Syntax: node build <os number>\nList of valid numbers:');
    console.log('0:     windows x64\n1:     mac x64\n2:     linux x64');
    process.exit(0);
}

console.log('Compiling for ' + chosenTarget);

compile({
    input: './main.js',
    output: outputLocation,
    fakeArgv: 'production',
    loglevel: (process.argv[3] || 'info'),
    target: (chosenTarget || process),
    resources: './config.js'
});