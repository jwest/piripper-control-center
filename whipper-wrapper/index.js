const wrapper = require('./wrapper');

module.exports = function (config, workspace) {
    const command = `${config.whipperCommand}`;
    const args = ['--eject failure', 'cd', 'rip'];
    return wrapper(command, args);
}