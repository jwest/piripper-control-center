import finalhandler from 'finalhandler';
import serveStatic from 'serve-static';
import WebSocket from 'ws';
import http from 'http';

function httpServer(distPath) {
  const serve = serveStatic(distPath);

  return http.createServer((req, res) => {
    serve(req, res, finalhandler(req, res));
  });
}

function broadcastMessage(wss, ws, data) {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function webSocketServer(httpSrv) {
  const wss = new WebSocket.Server({ server: httpSrv });

  wss.on('connection', (ws) => {
    ws.on('message', (data) => broadcastMessage(wss, ws, data));
  });
}

export default function server({ port, distPath }) {
  const httpSrv = httpServer(distPath);

  webSocketServer(httpSrv);

  const srv = httpSrv.listen(port);

  return {
    close: () => new Promise((resolve) => srv.close(() => resolve())),
  };
}
