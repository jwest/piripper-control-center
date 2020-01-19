const { readdir, mkdirSync, renameSync } = require('fs');
const { join } = require('path');
const normalize = require('normalize-strings');

const logger = require('../lib/logger');

function normalizeName(name, config) {
    if (!config.enabled) {
        return name;
    }
    return normalize(name).replace(/[^\x00-\x7F]/g, '_');
}

module.exports = function fileNameNormalizator(config) {
    return {
        normalize: (tmpWorkspace) => {
            return new Promise((resolve, reject) => {
                readdir(tmpWorkspace.getRawOutputPath(), (err, albumFiles) => {
                    if (!!err || albumFiles.length != 1) {
                        reject(err || new Error('Problem with directorys count'));
                        return;
                    }

                    const albumName = albumFiles[0];
                    logger.debug(`Normalize album directory name: '${albumName}' -> '${normalizeName(albumName, config)}'`);

                    const normalizedAlbumPath = join(tmpWorkspace.getNormalizedOutputPath(), normalizeName(albumName, config));

                    mkdirSync(normalizedAlbumPath);
                    logger.debug(`Album directory created on '${normalizedAlbumPath}'`);

                    readdir(join(tmpWorkspace.getRawOutputPath(), albumName), (err, songFiles) => {
                        if (!!err || albumFiles.length === 0) {
                            reject(err || new Error('Problem with ripping, songs not found'));
                            return;
                        }
                        
                        songFiles.map(songFile => {
                            logger.debug(`Normalize song file name: '${songFile}' -> '${normalizeName(songFile, config)}'`);

                            const normalizedSongPath = join(normalizedAlbumPath, normalizeName(songFile, config));

                            renameSync(
                                join(tmpWorkspace.getRawOutputPath(), albumName, songFile),
                                normalizedSongPath
                            );

                            logger.debug(`Song file normalized and moved to '${normalizedSongPath}'`);
                        });

                        resolve();
                    });
                });
            }); 
        }
    }
}