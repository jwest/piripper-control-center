import childProcess from 'child_process';

import logger from '../lib/logger';

export default function cdromStarter(config) {
  function checkCdrom() {
    logger.debug('Tray read cdrom status');
    return new Promise((resolve, reject) => {
      childProcess.execFile(config.setcdCommand, ['-i'], (err, stdout, stderr) => {
        if (err) {
          reject(new Error(`CDROM status command execution error (err: ${err}, stdout: ${stdout}, stderr: ${stderr})`));
          return;
        }

        logger.debug(`CDRom status is: ${stdout}`);

        resolve(stdout);
      });
    });
  }

  function ejectCdrom() {
    logger.info('Eject cdrom tray');
    return new Promise((resolve, reject) => {
      childProcess.execFile(config.ejectCommand, [], (err, stdout, stderr) => {
        if (err) {
          logger.error(`CDROM eject command execution error (err: ${err}, stdout: ${stdout}, stderr: ${stderr})`);
          reject();
          return;
        }
        resolve();
      });
    });
  }

  return {
    waitForCd: () => new Promise((resolve) => {
      const interval = setInterval(() => {
        checkCdrom().then((output) => {
          if (output.includes('Disc found')) {
            clearInterval(interval);
            resolve();
          } else if (output.includes('No disc is inserted')) {
            ejectCdrom().then(() => resolve());
          }
        }).catch((err) => {
          logger.error(err.toString());
        });
      }, 1000);
    }),
    ejectCdrom,
  };
};
