const pino = require('pino');

const levels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

const logger = pino({
  prettyPrint: {
    ignore: 'hostname',
    translateTime: true,
  },
});

logger.level = levels[process.env.LOG_LEVEL || 'info'] || 30;

module.exports = logger;
