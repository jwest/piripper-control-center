const wrapper = require('../wrapper');

describe('whipper ripping with success', () => {
    const MOCK = './whipper-wrapper/tests/mocks/whipper-mock.sh';

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(MOCK).on('rippingEnd', done);
    });
    
    test('should emmit rippingSuccess', (done) => {
        // expect 
        wrapper(MOCK).on('rippingSuccess', done);
    });
});

describe('whipper ripping with error', () => {
    const MOCK = './whipper-wrapper/tests/mocks/whipper-release-not-found-mock.sh';

    test('should emmit rippingEnd', (done) => {
        // expect 
        wrapper(MOCK).on('rippingEnd', done);
    });
    
    test('should emmit rippingError', (done) => {
        // expect
        wrapper(MOCK).on('rippingError', done);
    });
});