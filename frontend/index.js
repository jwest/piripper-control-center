import WebSocket from 'ws';
import server from './server';
import logger from '../lib/logger';

class Status {
  constructor(state, metadata = {}) {
    this.state = state;
    this.metadata = metadata;
  }

  setState(state) {
    this.state = state;
  }
}

class Message {
  constructor(eventName, status, data) {
    this.eventName = eventName;
    this.status = status;
    this.data = data;
  }

  toJson() {
    return JSON.stringify({
      eventName: this.eventName,
      status: this.status,
      data: this.data,
    });
  }
}

function proxyEvent(eventName, ws, eventBus, status) {
  logger.info(`Frontend - listen on '${eventName}'`);

  eventBus.on(eventName, (data) => {
    logger.debug(`Frontend - send event '${eventName}' with data '${data}'`);

    status.setState(eventName);

    ws.send(new Message(eventName, status, data).toJson());
  });
}

module.exports = (eventBus, port = 3000) => {
  const status = new Status();

  const srv = server({ port, distPath: 'dist/public' });

  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on('open', () => {
    logger.info('Backend client connected');

    [
      'rippingStart',
      'rippingEnd',
      'rippingSuccess',
      'rippingError',
    ].forEach((eventName) => {
      proxyEvent(eventName, ws, eventBus, status);
    });

    ws.on('message', (data) => {
      const { eventName } = JSON.parse(data);
      if (eventName === 'clientReady') {
        ws.send(new Message('status', status, null).toJson());
      }
    });
  });

  return {
    close: () => Promise
      .resolve(ws.terminate())
      .then(() => srv.close()),
  };
};
