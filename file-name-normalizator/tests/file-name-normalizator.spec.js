const {
  mkdtempSync, mkdirSync, writeFileSync, existsSync,
} = require('fs');
const { sep, join } = require('path');
const { tmpdir } = require('os');

const fileNameNormalizator = require('../index');

describe('album store', () => {
  test('should normalize names', (done) => {
    // given
    const config = { enabled: true };
    const rawOutputPath = mkdtempSync(`${tmpdir()}${sep}`);
    const normalizedOutputPath = mkdtempSync(`${tmpdir()}${sep}`);
    const tmpWorkspace = {
      getRawOutputPath: () => rawOutputPath,
      getNormalizedOutputPath: () => normalizedOutputPath,
    };

    const albumPath = join(rawOutputPath, 'śpęćiął ąłbum nąmę');
    mkdirSync(albumPath);
    writeFileSync(join(albumPath, '1. śpęćiął filę nąmę.flac'), 'placeholder', { mode: 0o755 });
    writeFileSync(join(albumPath, '2. śpęćiął filę nąmę.flac'), 'placeholder', { mode: 0o755 });
    writeFileSync(join(albumPath, '09. Sound Horizon - エルの絵本 【笛吹き男とパレード】.flac'), 'placeholder', { mode: 0o755 });

    // when
    const result = fileNameNormalizator(config).normalize(tmpWorkspace);

    // then
    return result.then(() => {
      expect(existsSync(join(normalizedOutputPath, 'special album name'))).toBe(true);
      expect(existsSync(join(normalizedOutputPath, 'special album name', '1. special file name.flac'))).toBe(true);
      expect(existsSync(join(normalizedOutputPath, 'special album name', '2. special file name.flac'))).toBe(true);
      expect(existsSync(join(normalizedOutputPath, 'special album name', '09. Sound Horizon - _____ ___________.flac'))).toBe(true);
      done();
    });
  });

  test('shouldn`t start normalizer', (done) => {
    // given
    const config = { enabled: false };
    const rawOutputPath = mkdtempSync(`${tmpdir()}${sep}`);
    const normalizedOutputPath = mkdtempSync(`${tmpdir()}${sep}`);
    const tmpWorkspace = {
      getRawOutputPath: () => rawOutputPath,
      getNormalizedOutputPath: () => normalizedOutputPath,
    };

    const albumPath = join(rawOutputPath, 'śpęćiął ąłbum nąmę');
    mkdirSync(albumPath);
    writeFileSync(join(albumPath, '1. śpęćiął filę nąmę.flac'), 'placeholder', { mode: 0o755 });
    writeFileSync(join(albumPath, '2. śpęćiął filę nąmę.flac'), 'placeholder', { mode: 0o755 });

    // when
    const result = fileNameNormalizator(config).normalize(tmpWorkspace);

    // then
    return result.then(() => {
      expect(existsSync(join(normalizedOutputPath, 'śpęćiął ąłbum nąmę'))).toBe(true);
      expect(existsSync(join(normalizedOutputPath, 'śpęćiął ąłbum nąmę', '1. śpęćiął filę nąmę.flac'))).toBe(true);
      expect(existsSync(join(normalizedOutputPath, 'śpęćiął ąłbum nąmę', '2. śpęćiął filę nąmę.flac'))).toBe(true);
      done();
    });
  });
});
