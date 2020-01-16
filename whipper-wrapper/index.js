const wrapper = require('./wrapper');

const WHIPPER_COMMAND = '/usr/bin/docker run --rm --device=/dev/cdrom \
-v /home/pi/.config/whipper:/home/worker/.config/whipper \
-v ${WORKSPACE_DIR}/output:/output \
whipperteam/whipper --eject failure cd rip'

//const MOCK_COMMAND = '';

wrapper(WHIPPER_COMMAND);