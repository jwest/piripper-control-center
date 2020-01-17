const wrapper = require('../index');

describe('whipper ripping with success', () => {
    const MOCK_CONFIG = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-mock.sh' };

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(MOCK_CONFIG).on('rippingEnd', done);
    });
    
    test('should emmit rippingSuccess', (done) => {
        // expect 
        wrapper(MOCK_CONFIG).on('rippingSuccess', done);
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
                wrapper(MOCK_CONFIG).on(testCase.event, (data) => {
                    expect(data).toEqual(testCase.expect);
                    done();
                });
            });
        });
    });
});

describe('whipper ripping with error', () => {
    const MOCK_CONFIG = { whipperCommand: './whipper-wrapper/tests/mocks/whipper-release-not-found-mock.sh' };

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(MOCK_CONFIG).on('rippingEnd', done);
    });
    
    test('should emmit rippingError', (done) => {
        // expect
        wrapper(MOCK_CONFIG).on('rippingError', (errData) => {
            expect(errData.toString()).toContain('Error: Command failed:');
            done();
        });
    });
});