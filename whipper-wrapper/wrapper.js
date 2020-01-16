const childProcess = require('child_process');
const EventEmitter = require('events');

class WhipperWrapperEmitter extends EventEmitter {}

module.exports = function wrapper(command) {
    const emitter = new WhipperWrapperEmitter();

    const handleError = (err) => {
        if (err) emitter.emit('rippingError');
    };

    const process = childProcess.execFile(
        command,
        [],
        handleError);
    
    process.stdout.on('data', (data) => {
        // console.log(data.toString());
        emitter.emit('releaseNotFound');
    });
    
    process.stdout.on('end', () => {
        emitter.emit('rippingSuccess');
        emitter.emit('rippingEnd');
    });

    return emitter;
}