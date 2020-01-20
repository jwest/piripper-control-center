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

module.exports = {
  trace: (...args) => logger.trace(...args),
  debug: (...args) => logger.debug(...args),
  info: (...args) => logger.info(...args),
  warn: (...args) => logger.warn(...args),
  error: (...args) => logger.error(...args),
  fatal: (...args) => logger.fatal(...args),
}
