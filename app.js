import logger from './lib/logger';
import config from './lib/config';

import workspace from './workspace';
import cdromStarter from './cdrom-starter';
import whipperWrapper from './whipper-wrapper';
import fileNameNormalizator from './file-name-normalizator';
import albumStore from './album-store';

export default function app(argv) {
  return new Promise((resolve) => {
    cdromStarter(config(argv.config)('cdromStatus'))
      .waitForCd()
      .then(() => {
        const tmpWorkspace = workspace();

        const whipper = whipperWrapper(config(argv.config)('whipperWrapper'), tmpWorkspace);

        whipper.on('rippingError', (err) => {
          logger.info('Ripping ended with errors', err);

          cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom()
            .then(() => { resolve(); });
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

              return cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom();
            })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              logger.error(`Error on ripping: ${err}`);

              cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom()
                .then(() => { resolve(); });
            });
        });

        whipper.on('metaDataMusicBrainzLookupUrlRetrieved', (metaData) => {
          logger.info(`Please add release to musicbrainz: ${metaData.value}`);
        });
      });
  });
}
