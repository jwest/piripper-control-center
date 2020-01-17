const childProcess = require('child_process');
const EventEmitter = require('events');

const logger = require('../lib/logger');
const fieldsFromLogs = require('./fields-from-logs');

class WhipperWrapperEmitter extends EventEmitter {
    emit(event, ...args) {
        logger.debug(`Event ${event} sended with data: ${JSON.stringify(args)}`);
        super.emit(event, ...args);
    }
}

function findInLog(line, pattern) {
    const regex = pattern;
    const found = line.match(regex);
    if (!found || !found[1]) {
        return null;
    }
    return found[1];
}

function metaDataParse(line) {
    const fields = fieldsFromLogs
        .map(field => ({ name: field.name, value: findInLog(line, field.pattern) }))
        .filter(field => field.value != null)

    if (fields.length === 0) {
        return;
    }
        
    const field = fields[0];
    logger.info(`Parse meta data from log ${field.name}: ${field.value}`);
    return field;
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

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
        data.split("\n").forEach((line) => {
            const field = metaDataParse(line);

            if (field != null) {
                emitter.emit(`metaData${capitalize(field.name)}Retrieved`, { value: field.value });
            }
        });
    });

    process.stdout.on('end', () => {
        emitter.emit('rippingSuccess');
        emitter.emit('rippingEnd');
    });

    return emitter;
}