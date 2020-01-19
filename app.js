const logger = require('./lib/logger');
const config = require('./lib/config');

const workspace = require('./workspace');
const cdromStarter = require('./cdrom-starter');
const whipperWrapper = require('./whipper-wrapper');
const fileNameNormalizator = require('./file-name-normalizator');
const albumStore = require('./album-store');

module.exports = function app(argv) {
    return new Promise((resolve) => {
        cdromStarter(config(argv.config)('cdromStatus'))
            .waitForCd()
            .then(() => {
                const tmpWorkspace = workspace();

                const whipper = whipperWrapper(config(argv.config)('whipperWrapper'), tmpWorkspace);

                whipper.on('rippingError', (err) => {
                    logger.info('Ripping ended with errors', err);

                    cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom();

                    resolve();
                });

                whipper.on('rippingSuccess', () => {
                    fileNameNormalizator(config(argv.config)('fileNameNormalizator'))
                        .normalize(tmpWorkspace)
                        .then(() => {
                            logger.info('Normalization file name ended');
                            
                            return albumStore(config(argv.config)('albumStore')).store(tmpWorkspace);
                        })
                        .then(() => {
                            logger.info('END of ripping');
                            
                            cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom();
                        })
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            logger.error(`Error on ripping: ${err}`);

                            cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom();
                        });
                });
            });
    });
}