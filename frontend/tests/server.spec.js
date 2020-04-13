import fetch from 'node-fetch';
import WebSocket from 'ws';
import server from '../server';

const SRV_PORT = 3001;
const DIST_STUB = './frontend/tests/dist-stub';

describe('frontend server', () => {
  test('should render frontend', () => {
    // given
    const srv = server({ port: SRV_PORT, distPath: DIST_STUB });

    // when
    return fetch(`http://localhost:${SRV_PORT}`)
      .then((response) => response.text())
      .then((body) => {
        // then
        expect(body).toContain('Hello World');
      })
      .then(srv.close);
  });

  test('should shows web socket server', (done) => {
    // given
    const srv = server({ port: SRV_PORT, distPath: DIST_STUB });

    // when
    const ws = new WebSocket(`ws://localhost:${SRV_PORT}`);

    ws.on('open', () => {
      // then
      ws.terminate();
      srv.close().then(() => done());
    });
  });

  test('should broadcast web socket message', (done) => {
    // given
    const srv = server({ port: SRV_PORT, distPath: DIST_STUB });

    // when
    const ws1 = new WebSocket(`ws://localhost:${SRV_PORT}`);

    ws1.on('open', () => {
      const ws2 = new WebSocket(`ws://localhost:${SRV_PORT}`);

      ws1.on('message', (event) => {
        // then
        expect(event).toBe('TEST_MESSAGE');

        ws1.terminate();
        ws2.terminate();
        srv.close().then(() => done());
      });

      ws2.on('open', () => {
        ws2.send('TEST_MESSAGE');
      });
    });
  });
});
