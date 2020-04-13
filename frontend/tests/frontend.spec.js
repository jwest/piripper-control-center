import WebSocket from 'ws';
import EventEmitter from 'events';
import frontend from '../index';

const SRV_PORT = 3001;

describe('frontend', () => {
  [
    { state: 'rippingStart', metaData: '{}' },
  ].forEach(({ state, metaData }) => {
    test(`should broadcast message ${state} from event bus`, (done) => {
      // given
      const eventBus = new EventEmitter();
      const srv = frontend(eventBus, SRV_PORT);
      const ws = new WebSocket(`ws://localhost:${SRV_PORT}`);

      ws.on('open', () => {
        ws.on('message', (data) => {
          expect(data).toBe(`{"state":"${state}","metaData":${metaData}}`);

          // then
          ws.terminate();
          srv.close().then(() => done());
        });

        // when
        eventBus.emit(state, {});
      });
    });
  });
});
