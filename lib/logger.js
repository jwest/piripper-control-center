const pino = require('pino');

const logger = pino({
    prettyPrint: {
        ignore: 'hostname',
        translateTime: true,
    },
});

logger.level = 40;

module.exports = logger;