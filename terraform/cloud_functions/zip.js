var fs = require('fs');
var path = require('path');

// The zip library needs to be instantiated:
var zip = new require('node-zip')();

// You can add multiple files by performing subsequent calls to zip.file();
// the first argument is how you want the file to be named inside your zip,
// the second is the actual data:
zip.file('index.js', fs.readFileSync(path.join(__dirname, 'index.js')));
zip.file('package.json', fs.readFileSync(path.join(__dirname, 'package.json')));

var data = zip.generate({ base64:false, compression: 'DEFLATE' });

// it's important to use *binary* encode
fs.writeFileSync('output/index.zip', data, 'binary');