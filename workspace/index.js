const { mkdtempSync, mkdirSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

const logger = require('../lib/logger');

const TMP_PREFIX = 'piripper';

function createDirNamePrefix() {
    const date = new Date();
    return `${TMP_PREFIX}_${date.getTime()}_`;
}

module.exports = function workspace() {
    const tmpPath = mkdtempSync(join(tmpdir(), createDirNamePrefix()));
    logger.debug(`Workspace tmp dir root: ${tmpPath}`);

    const rawPath = join(tmpPath, 'raw');
    mkdirSync(rawPath);
    logger.debug(`Workspace tmp dir raw: ${rawPath}`);

    logger.info(`Workspace path in tmp dir created, path: ${tmpPath}`);

    return {
        getPath: () => tmpPath,
        getRawOutputPath: () => rawPath,
    }
}