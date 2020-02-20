import logger from './lib/logger';
import config from './lib/config';
import EventBus from './lib/event-bus';

import workspace from './workspace';
import cdromStarter from './cdrom-starter';
import whipperWrapper from './whipper-wrapper';
import fileNameNormalizator from './file-name-normalizator';
import albumStore from './album-store';

import frontend from './frontend';

const eventBus = new EventBus();

frontend(eventBus);

export default function app(argv) {
  return new Promise((resolve) => {
    cdromStarter(config(argv.config)('cdromStatus'))
      .waitForCd()
      .then(() => {
        const tmpWorkspace = workspace();

        eventBus.on('rippingError', (err) => {
          logger.info('Ripping ended with errors', err);

          cdromStarter(config(argv.config)('cdromStatus')).ejectCdrom()
            .then(() => { resolve(); });
        });

        eventBus.on('rippingSuccess', () => {
          fileNameNormalizator(config(argv.config)('fileNameNormalizator'))
            .normalize(tmpWorkspace)
            .then(() => {
              logger.info('Normalization file name ended');

              return albumStore(config(argv.config)('albumStore'), eventBus).store(tmpWorkspace);
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

        eventBus.on('metaDataMusicBrainzLookupUrlRetrieved', (metaData) => {
          logger.info(`Please add release to musicbrainz: ${metaData.value}`);
        });

        whipperWrapper(config(argv.config)('whipperWrapper'), tmpWorkspace, eventBus);
      });
  });
}
