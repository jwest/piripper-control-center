const logger = require('./lib/logger');
const config = require('./lib/config');

const whipperWrapper = require('./whipper-wrapper');

module.exports = function app(argv) {
    console.log(argv);

    const workspace = {};

    const whipper = whipperWrapper(config(argv.config)('whipperWrapper'), workspace);

    whipper.on('rippingEnd', () => {
        logger.info('Ripping ended');
    });

    whipper.on('rippingError', (err) => {
        logger.info('Ripping ended with errors', err);
    });
}