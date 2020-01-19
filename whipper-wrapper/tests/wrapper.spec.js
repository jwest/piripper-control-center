const wrapper = require('../index');

const workspaceMock = { getRawOutputPath: () => '/tmp/raw' };

describe('whipper ripping with success', () => {
    const configMock = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-mock.sh {{WORKSPACE_PATH}}:/output' };

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(configMock, workspaceMock).on('rippingEnd', done);
    });
    
    test('should emmit rippingSuccess', (done) => {
        // expect 
        wrapper(configMock, workspaceMock).on('rippingSuccess', done);
    });

    describe('parse meta data', () => {
        [
            { event: 'metaDataDiscIdRetrieved',   expect: { value: 'PTsh3.W7JzvObAM4e3myq3AGNEM' } },
            { event: 'metaDataArtistRetrieved',   expect: { value: 'Sound Horizon' } },
            { event: 'metaDataTitleRetrieved',    expect: { value: 'Elysion ～ 楽園幻想物語組曲 ～' } },
            { event: 'metaDataDurationRetrieved', expect: { value: '01:00:25.943' } }
        ].forEach(testCase => {
            test(`should emit ${testCase.event}`, (done) => {
                // expect 
                wrapper(configMock, workspaceMock).on(testCase.event, (data) => {
                    expect(data).toEqual(testCase.expect);
                    done();
                });
            });
        });
    });
});

describe('whipper ripping with error', () => {
    const configMock = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-release-not-found-mock.sh {{WORKSPACE_PATH}}:/output' };

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(configMock, workspaceMock).on('rippingEnd', done);
    });
    
    test('should emmit rippingError', (done) => {
        // expect
        wrapper(configMock, workspaceMock).on('rippingError', ({ statusCode }) => {
            expect(statusCode).toBe(1);
            done();
        });
    });
});