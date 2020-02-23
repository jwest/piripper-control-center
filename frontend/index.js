import WebSocket from 'ws';
import server from './server';
import logger from '../lib/logger';

class Message {
  constructor(eventName, data) {
    this.eventName = eventName;
    this.data = data;
  }

  toJson() {
    return JSON.stringify({
      eventName: this.eventName,
      data: this.data,
    });
  }
}

function proxyEvent(eventName, ws, eventBus) {
  logger.info(`Frontend - listen on '${eventName}'`);

  eventBus.on(eventName, (data) => {
    logger.debug(`Frontend - send event '${eventName}' with data '${data}'`);

    ws.send(new Message(eventName, data).toJson());
  });
}

module.exports = (eventBus) => {
  const srv = server({ port: 3000, distPath: 'dist/public' });

  const ws = new WebSocket('ws://localhost:3000');

  ws.on('open', () => {
    logger.info('Backend client connected');

    [
      'rippingStart',
      'rippingEnd',
      'rippingSuccess',
      'rippingError',
    ].forEach((eventName) => {
      proxyEvent(eventName, ws, eventBus);
    });
  });


  return {
    close: () => Promise.resolve(ws.terminate())
      .then(() => srv.close()),
  };
};
