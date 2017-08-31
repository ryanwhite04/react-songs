var fs = require('fs');
var src = require('soundfonts').path;
var dir = './public/instruments';

fs.existsSync(dir) || fs.mkdirSync(dir);

require('ncp').ncp(src, dir, console.log);
