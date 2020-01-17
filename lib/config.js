const config = require('../config.json');
const path = require('path');

module.exports = function config(fileName) {
    const config = require(!fileName ? '../config.json' : path.join(process.cwd(), fileName));

    return (scopeName) => config[scopeName];
}