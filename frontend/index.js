import WebSocket from 'ws';
import server from './server';
import logger from '../lib/logger';

module.exports = (eventBus) => {
  server({ port: 3000, distPath: 'dist/public' });

  const ws = new WebSocket('ws://localhost:3000');

  ws.on('open', () => {
    logger.info('Backend client connected');
    eventBus.on('rippingStart', () => { ws.send('rippingStart'); });
    eventBus.on('rippingEnd', () => { ws.send('rippingEnd'); });
    eventBus.on('rippingSuccess', () => { ws.send('rippingSuccess'); });
    eventBus.on('rippingError', () => { ws.send('rippingError'); });
  });
};
