import { mkdtempSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

import logger from '../lib/logger';

const TMP_PREFIX = 'piripper';

function createDirNamePrefix() {
  const date = new Date();
  return `${TMP_PREFIX}_${date.getTime()}_`;
}

export default function workspace() {
  const tmpPath = mkdtempSync(join(tmpdir(), createDirNamePrefix()));
  logger.debug(`Workspace tmp dir root: ${tmpPath}`);

  const rawPath = join(tmpPath, 'raw');
  mkdirSync(rawPath);
  logger.debug(`Workspace tmp dir for raw output: ${rawPath}`);

  const normalizedOutputPath = join(tmpPath, 'output');
  mkdirSync(normalizedOutputPath);
  logger.debug(`Workspace tmp dir for normalized output: ${normalizedOutputPath}`);

  logger.info(`Workspace path in tmp dir created, path: ${tmpPath}`);

  return {
    getPath: () => tmpPath,
    getRawOutputPath: () => rawPath,
    getNormalizedOutputPath: () => normalizedOutputPath,
  };
}
