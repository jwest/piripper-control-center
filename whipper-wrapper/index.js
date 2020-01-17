const wrapper = require('./wrapper');

function prepareCommand(command, workspace) {
    const parts = command
        .replace('{{WORKSPACE_PATH}}', workspace.getRawOutputPath())
        .split(' ');
    
    return {
        program: parts[0],
        args: parts.slice(1),
    }
}

module.exports = function (config, workspace) {
    const command = prepareCommand(config.whipperCommand, workspace);
    const args = [...command.args, '--eject failure', 'cd', 'rip'];
    return wrapper(command.program, args);
}