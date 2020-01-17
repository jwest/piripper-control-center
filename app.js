const logger = require('./lib/logger');
const config = require('./lib/config');

const workspace = require('./workspace');
const whipperWrapper = require('./whipper-wrapper');

module.exports = function app(argv) {
    console.log(argv);

    const tmpWorkspace = workspace();

    const whipper = whipperWrapper(config(argv.config)('whipperWrapper'), tmpWorkspace);

    whipper.on('rippingEnd', () => {
        logger.info('Ripping ended');
    });

    whipper.on('rippingError', (err) => {
        logger.info('Ripping ended with errors', err);
    });
}