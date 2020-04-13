import EventEmitter from 'events';
import { tmpdir } from 'os';

import wrapper from '../index';

const workspaceMock = { getRawOutputPath: () => `${tmpdir()}` };

describe('whipper ripping with success', () => {
  const configMock = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-mock.sh {{WORKSPACE_PATH}}' };

  test('should emmit rippingStart', (done) => {
    // given
    const eventEmitter = new EventEmitter();

    eventEmitter.on('rippingStart', () => {
      // then
      done();
    });

    // when
    wrapper(configMock, workspaceMock, eventEmitter);
  });

  test('should emmit rippingEnd', (done) => {
    // given
    const eventEmitter = new EventEmitter();

    // when
    wrapper(configMock, workspaceMock, eventEmitter);

    // then
    eventEmitter.on('rippingEnd', done);
  });

  test('should emmit rippingSuccess', (done) => {
    // given
    const eventEmitter = new EventEmitter();

    // when
    wrapper(configMock, workspaceMock, eventEmitter);

    // then
    eventEmitter.on('rippingSuccess', done);
  });

  describe('parse meta data', () => {
    [
      { field: 'discId', value: 'PTsh3.W7JzvObAM4e3myq3AGNEM' },
      { field: 'artist', value: 'Sound Horizon' },
      { field: 'title', value: 'Elysion ～ 楽園幻想物語組曲 ～' },
      { field: 'duration', value: '01:00:25.943' },
    ].forEach(({ field, value }) => {
      test(`should emit metaDataRetrieved for field ${field}`, (done) => {
        // given
        const eventEmitter = new EventEmitter();

        // when
        wrapper(configMock, workspaceMock, eventEmitter);

        // then
        eventEmitter.on('metaDataRetrieved', (data) => {
          if (data.field === field) {
            expect(data).toEqual({ field, value });
            done();
          }
        });
      });
    });
  });
});

describe('whipper ripping with error', () => {
  const configMock = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-release-not-found-mock.sh {{WORKSPACE_PATH}}:/output 0' };

  test('should emmit rippingEnd', (done) => {
    // given
    const eventEmitter = new EventEmitter();

    // when
    wrapper(configMock, workspaceMock, eventEmitter);

    // then
    eventEmitter.on('rippingEnd', done);
  });

  test('should emmit rippingError', (done) => {
    // given
    const eventEmitter = new EventEmitter();

    // when
    wrapper(configMock, workspaceMock, eventEmitter);

    // then
    eventEmitter.on('rippingError', ({ statusCode }) => {
      expect(statusCode).toBe(1);
      done();
    });
  });
});
