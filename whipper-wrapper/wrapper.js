import childProcess from 'child_process';
import EventEmitter from 'events';

import logger from '../lib/logger';
import fieldsFromLogs from './fields-from-logs';

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
    .map((field) => ({ name: field.name, value: findInLog(line, field.pattern) }))
    .filter((field) => field.value != null);

  if (fields.length === 0) {
    return null;
  }

  const field = fields[0];
  logger.info(`Parse meta data from log ${field.name}: ${field.value}`);
  return field;
}

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default function wrapper(command, args) {
  const emitter = new WhipperWrapperEmitter();

  logger.debug(`Whipper starting with command: ${command}, args: ${args}`);

  const process = childProcess.execFile(command, args);

  process.stdout.on('data', (data) => {
    data.split('\n').forEach((line) => {
      logger.trace('WHIPPER STDOUT:', line);
      const field = metaDataParse(line);

      if (field != null) {
        emitter.emit(`metaData${capitalize(field.name)}Retrieved`, { value: field.value });
      }
    });
  });

  process.stderr.on('data', (data) => {
    data.split('\n').forEach((line) => {
      logger.warn('WHIPPER STDERR:', line);
    });
  });

  process.on('exit', (statusCode) => {
    emitter.emit('rippingEnd');
    if (statusCode === 0) {
      emitter.emit('rippingSuccess');
    } else {
      emitter.emit('rippingError', { statusCode });
    }
  });

  return emitter;
};
