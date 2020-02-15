import fs from 'fs-extra';

import logger from './logger';

export default function config(configFilePath) {
  if (!fs.pathExistsSync(configFilePath)) {
    const errMessage = 'Config file not exist\'s, please run with valid `--config` parameter';
    logger.fatal(errMessage);
    throw new Error(errMessage);
  }

  return (scopeName) => fs.readJsonSync(configFilePath)[scopeName];
}
