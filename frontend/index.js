import WebSocket from 'ws';
import server from './server';
import logger from '../lib/logger';
import {
  STATUS_IDLE,
  STATUS_RIPPING_START,
  STATUS_RIPPING_SUCCESS,
  STATUS_RIPPING_ERROR,
  STATUS_STORING_START,
  STATUS_STORING_END,
  STATUS_METADATA_RETREIVED,
  ClientMessage,
  StatusMessage,
} from './messages';

function proxyCleanEvent(eventName, ws, eventBus, status) {
  logger.info(`Frontend - listen on '${eventName}'`);

  eventBus.on(eventName, (data) => {
    logger.debug(`Frontend - send clean event '${eventName}' with data '${data}'`);
    status.setToIdle();
    status.send(ws);
  });
}

function proxyEvent(eventName, ws, eventBus, status) {
  logger.info(`Frontend - listen on '${eventName}'`);

  eventBus.on(eventName, (data) => {
    logger.debug(`Frontend - send event '${eventName}' with data '${data}'`);
    status.setState(eventName);
    status.send(ws);
  });
}

function proxyMetaData(eventName, ws, eventBus, status) {
  logger.info(`Frontend - listen on metaData '${eventName}'`);

  eventBus.on(eventName, (data) => {
    logger.debug(`Frontend - send event '${eventName}' with data '${data}'`);
    status.addMetaData(data.field, data.value);
    status.send(ws);
  });
}

module.exports = (eventBus, port = 3000) => {
  const status = new StatusMessage(STATUS_IDLE);

  const srv = server({ port, distPath: 'dist/public' });

  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', () => {
    logger.info('Backend client connected');

    [
      STATUS_IDLE,
    ].forEach((eventName) => {
      proxyCleanEvent(eventName, ws, eventBus, status);
    });

    [
      STATUS_RIPPING_START,
      STATUS_RIPPING_SUCCESS,
      STATUS_RIPPING_ERROR,
      STATUS_STORING_START,
      STATUS_STORING_END,
    ].forEach((eventName) => {
      proxyEvent(eventName, ws, eventBus, status);
    });

    [
      STATUS_METADATA_RETREIVED,
    ].forEach((eventName) => {
      proxyMetaData(eventName, ws, eventBus, status);
    });

    ws.on('message', (data) => {
      if (ClientMessage.fromEvent(data).isClientReady()) {
        status.send(ws);
      }
    });
  });

  return {
    close: () => Promise
      .resolve(ws.terminate())
      .then(() => srv.close()),
  };
};
