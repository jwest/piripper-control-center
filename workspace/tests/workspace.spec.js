const workspace = require('../index');

describe('workspace', () => {
    test('should prepare workspace', () => {
        // when
        const tmpWorkspace = workspace();

        // then
        const workspacePath = tmpWorkspace.getPath();
        expect(workspacePath).toMatch(/\/piripper_[0-9]+_[a-zA-Z0-9]+$/);
    });

    test('should create dir for raw whipper output', () => {
        // when
        const tmpWorkspace = workspace();

        // then
        const rawPath = tmpWorkspace.getRawOutputPath();
        expect(rawPath).toMatch(/\/piripper_[0-9]+_[a-zA-Z0-9]+\/raw$/);
    });

    test('should create dir for normalized output', () => {
        // when
        const tmpWorkspace = workspace();

        // then
        const rawPath = tmpWorkspace.getNormalizedOutputPath();
        expect(rawPath).toMatch(/\/piripper_[0-9]+_[a-zA-Z0-9]+\/output$/);
    });
});