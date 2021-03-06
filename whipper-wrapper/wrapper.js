import childProcess from 'child_process';

import logger from '../lib/logger';
import fieldsFromLogs from './fields-from-logs';

function findInLog(line, pattern) {
  const regex = pattern;
  const found = line.match(regex);
  if (!found || !found[1]) {
    return null;
  }
  return found[1];
}

function metaDataParse(line) {
  return fieldsFromLogs
    .map((field) => ({ name: field.name, value: findInLog(line, field.pattern) }))
    .filter((field) => field.value != null)
    .map((field) => {
      logger.info(`Parse meta data from log ${field.name}: ${field.value}`);
      return field;
    });
}

export default function wrapper(command, args, eventBus) {
  logger.debug(`Whipper starting with command: ${command}, args: ${args}`);
  eventBus.emit('rippingStart');

  const process = childProcess.execFile(command, args);

  process.stdout.on('data', (data) => {
    data.split('\n').forEach((line) => {
      logger.trace('WHIPPER STDOUT:', line);
      metaDataParse(line).forEach((field) => eventBus.emit('metaDataRetrieved', { field: field.name, value: field.value }));
    });
  });

  process.stderr.on('data', (data) => {
    data.split('\n').forEach((line) => {
      logger.warn('WHIPPER STDERR:', line);
    });
  });

  process.on('exit', (statusCode) => {
    eventBus.emit('rippingEnd');
    if (statusCode === 0) {
      eventBus.emit('rippingSuccess');
    } else {
      eventBus.emit('rippingError', { statusCode });
    }
  });

  return eventBus;
}
