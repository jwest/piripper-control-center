import wrapper from './wrapper';

function prepareCommand(command, workspace) {
  const parts = command
    .replace('{{WORKSPACE_PATH}}', workspace.getRawOutputPath())
    .split(' ');

  return {
    program: parts[0],
    args: parts.slice(1),
  };
}

export default function rip(config, workspace) {
  const command = prepareCommand(config.whipperCommand, workspace);
  const args = [...command.args, '--eject', 'failure', 'cd', 'rip', '--track-template', '%A - %d/%t. %a - %n', '--disc-template', '%A - %d/%A - %d'];
  return wrapper(command.program, args);
};
