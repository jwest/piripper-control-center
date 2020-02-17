import server from 'server';

const { get } = server.router;

module.exports = (port) => {
  server({ port, public: 'dist/public' }, [
    get('/api/status', () => {}),
  ]);

  return {
    listen: () => {},
  };
};
