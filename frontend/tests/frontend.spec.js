import WebSocket from 'ws';
import EventEmitter from 'events';
import frontend from '../index';

const SRV_PORT = 3001;

describe('frontend', () => {

  [
    { eventName: 'rippingStart', messageData: '{}' },
  ].forEach(({ eventName, messageData }) => {
    test(`should broadcast message ${eventName} from event bus`, (done) => {
      // given
      const eventBus = new EventEmitter();
      const srv = frontend(eventBus, SRV_PORT);
      const ws = new WebSocket(`ws://localhost:${SRV_PORT}`);

      ws.on('open', () => {
        ws.on('message', (data) => {
          expect(data).toBe(`{"eventName":"${eventName}","data":${messageData}}`);

          // then
          ws.terminate();
          srv.close().then(() => done());
        });

        // when
        eventBus.emit(eventName, {});
      });
    });
  });

});
