import fs from 'fs-extra';
import { join } from 'path';

import logger from '../lib/logger';

function getAlbumName(outputPath) {
  return fs.readdirSync(outputPath)[0];
}

export default function albumStore(config, eventBus) {
  return {
    store: (tmpWorkspace) => new Promise((resolve) => {
      const albumName = getAlbumName(tmpWorkspace.getNormalizedOutputPath());
      const albumPath = join(tmpWorkspace.getNormalizedOutputPath(), albumName);
      logger.debug(`Album path for prepare copy = ${albumPath}`);

      eventBus.emit('storingStart', { inputPath: albumPath });

      config.destinations.forEach((destination) => {
        const outputPath = join(destination.path, albumName);
        eventBus.emit('storingStartForStore', { inputPath: albumPath, outputPath });

        fs.copySync(albumPath, outputPath);

        logger.info(`Album stored in: ${outputPath}`);
        eventBus.emit('storingEndForStore', { inputPath: albumPath, outputPath });
      });

      fs.removeSync(albumPath);

      logger.debug(`Temporary album path removed (${albumName})`);
      eventBus.emit('storingClear', { inputPath: albumPath });
      eventBus.emit('storingEnd', { inputPath: albumPath });

      resolve();
    }),
  };
}
