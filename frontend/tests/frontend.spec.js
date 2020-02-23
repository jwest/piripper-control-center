import WebSocket from 'ws';
import EventEmitter from 'events';
import frontend from '../index';

const SRV_PORT = 3000;

describe('frontend', () => {
  test('should broadcast message from event bus', (done) => {
    // given
    const eventBus = new EventEmitter();
    const srv = frontend(eventBus);
    const ws = new WebSocket(`ws://localhost:${SRV_PORT}`);

    ws.on('open', () => {
      ws.on('message', (data) => {
        expect(data).toBe('{"eventName":"rippingStart","data":{}}');

        // then
        ws.terminate();
        srv.close().then(() => done());
      });

      // when
      eventBus.emit('rippingStart', {});
    });
  });
});
