const cdromStarter = require('../index');

describe('cdrom starter', () => {
    test('should run when cd is inserted', (done) => {
        // when
        cdromStarter({ 
            setcdCommand: './cdrom-starter/tests/mocks/setcd-mock.sh', 
            ejectCommand: './cdrom-starter/tests/mocks/eject-mock.sh'
        })
            .waitForCd()
            .then(done)
    });
});