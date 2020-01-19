const fs = require('fs-extra');
const { join } = require('path');

const logger = require('../lib/logger');

function getAlbumName(outputPath) {
  return fs.readdirSync(outputPath)[0];
}

module.exports = function albumStore(config) {
  return {
    store: (tmpWorkspace) => new Promise((resolve) => {
      const albumName = getAlbumName(tmpWorkspace.getNormalizedOutputPath());
      const albumPath = join(tmpWorkspace.getNormalizedOutputPath(), albumName);
      logger.debug(`Album path for prepare copy = ${albumPath}`);

      config.destinations.forEach((destination) => {
        fs.copySync(albumPath, join(destination.path, albumName));
        logger.info(`Album stored in: ${join(destination.path, albumName)}`);
      });

      fs.removeSync(albumPath);
      logger.debug(`Temporary album path removed (${albumName})`);

      resolve();
    }),
  };
};
