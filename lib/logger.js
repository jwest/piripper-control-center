const pino = require('pino');

const logger = pino({
    prettyPrint: {
        ignore: 'hostname',
        translateTime: true,
    },
});

logger.level = 10;
// logger.level = 40;

module.exports = logger;