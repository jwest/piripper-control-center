import { readdir, mkdirSync, renameSync } from 'fs';
import { join } from 'path';
import normalize from 'normalize-strings';

import logger from '../lib/logger';

function normalizeName(name, config) {
  if (!config.enabled) {
    return name;
  }
  return normalize(name).replace(/[^\x00-\x7F]/g, '_'); // eslint-disable-line no-control-regex
}

export default function fileNameNormalizator(config) {
  return {
    normalize: (tmpWorkspace) => new Promise((resolve, reject) => {
      readdir(tmpWorkspace.getRawOutputPath(), (error, albumFiles) => {
        if (!!error || albumFiles.length !== 1) {
          reject(error || new Error('Problem with directorys count'));
          return;
        }

        const albumName = albumFiles[0];
        logger.debug(`Normalize album directory name: '${albumName}' -> '${normalizeName(albumName, config)}'`);

        const normalizedAlbumPath = join(
          tmpWorkspace.getNormalizedOutputPath(),
          normalizeName(albumName, config),
        );

        mkdirSync(normalizedAlbumPath);
        logger.debug(`Album directory created on '${normalizedAlbumPath}'`);

        readdir(join(tmpWorkspace.getRawOutputPath(), albumName), (err, songFiles) => {
          if (!!err || albumFiles.length === 0) {
            reject(err || new Error('Problem with ripping, songs not found'));
            return;
          }

          songFiles.forEach((songFile) => {
            logger.debug(`Normalize song file name: '${songFile}' -> '${normalizeName(songFile, config)}'`);

            const normalizedSongPath = join(normalizedAlbumPath, normalizeName(songFile, config));

            renameSync(
              join(tmpWorkspace.getRawOutputPath(), albumName, songFile),
              normalizedSongPath,
            );

            logger.debug(`Song file normalized and moved to '${normalizedSongPath}'`);
          });

          resolve();
        });
      });
    }),
  };
}
