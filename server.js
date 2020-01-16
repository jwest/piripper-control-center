const peer = require('peer');

const server = peer.PeerServer({
    port: 9000, 
    path: '/piripper-control/api'
});

server.on('connection', (id) => { 
    console.log(`Client with id=${id} connected`);
});

server.on('disconnect', (id) => {
    console.log(`Client with id=${id} disconnected`);
});