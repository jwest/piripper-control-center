import EventEmitter from 'events';
import {
  mkdtempSync, mkdirSync, writeFileSync, existsSync,
} from 'fs';
import { sep, join } from 'path';
import { tmpdir } from 'os';

import albumStore from '../index';

function tmp() {
  return mkdtempSync(`${tmpdir()}${sep}`);
}

function mockAlbum(outputPath, albumName, fileNames) {
  const albumPath = join(outputPath, albumName);
  mkdirSync(albumPath);
  fileNames.forEach((fileName) => {
    writeFileSync(join(albumPath, fileName), 'placeholder', { mode: 0o755 });
  });
}

describe('album store', () => {
  test('should store album in one location', (done) => {
    // given
    const destinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    // when
    const result = albumStore(config, eventEmitter).store(tmpWorkspace);

    // then
    return result.then(() => {
      expect(existsSync(join(destinationPath, 'album name'))).toBe(true);
      expect(existsSync(join(destinationPath, 'album name', '1. file name.flac'))).toBe(true);
      expect(existsSync(join(destinationPath, 'album name', '2. file name.flac'))).toBe(true);
      done();
    });
  });

  test('should store album in many location', (done) => {
    // given
    const destinationPath = tmp();
    const otherDestinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }, { path: otherDestinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    // when
    const result = albumStore(config, eventEmitter).store(tmpWorkspace);

    // then
    return result.then(() => {
      expect(existsSync(join(destinationPath, 'album name'))).toBe(true);
      expect(existsSync(join(destinationPath, 'album name', '1. file name.flac'))).toBe(true);
      expect(existsSync(join(destinationPath, 'album name', '2. file name.flac'))).toBe(true);
      expect(existsSync(join(otherDestinationPath, 'album name'))).toBe(true);
      expect(existsSync(join(otherDestinationPath, 'album name', '1. file name.flac'))).toBe(true);
      expect(existsSync(join(otherDestinationPath, 'album name', '2. file name.flac'))).toBe(true);
      done();
    });
  });

  test('should clear after store', (done) => {
    // given
    const destinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    // when
    const result = albumStore(config, eventEmitter).store(tmpWorkspace);

    // then
    return result.then(() => {
      expect(existsSync(join(outputPath, 'album name'))).toBe(false);
      done();
    });
  });

  test('should send event on start storing', (done) => {
    // given
    const destinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    eventEmitter.on('storingStart', (data) => {
      // then
      expect(data.inputPath).toBe(join(outputPath, 'album name'));
      expect(data.outputPath).toBe(join(destinationPath, 'album name'));
      done();
    });

    // when
    albumStore(config, eventEmitter).store(tmpWorkspace);
  });

  test('should send event on end storing', (done) => {
    // given
    const destinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    eventEmitter.on('storingEnd', (data) => {
      // then
      expect(data.inputPath).toBe(join(outputPath, 'album name'));
      expect(data.outputPath).toBe(join(destinationPath, 'album name'));
      done();
    });

    // when
    albumStore(config, eventEmitter).store(tmpWorkspace);
  });

  test('should send event on end storing', (done) => {
    // given
    const destinationPath = tmp();
    const config = { destinations: [{ path: destinationPath }] };

    const outputPath = tmp();
    const tmpWorkspace = {
      getNormalizedOutputPath: () => outputPath,
    };

    mockAlbum(outputPath, 'album name', ['1. file name.flac', '2. file name.flac']);

    const eventEmitter = new EventEmitter();

    eventEmitter.on('storingClear', (data) => {
      // then
      expect(data.inputPath).toBe(join(outputPath, 'album name'));
      done();
    });

    // when
    albumStore(config, eventEmitter).store(tmpWorkspace);
  });
});
