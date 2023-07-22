import { useShell } from '../scripts/shell.functions.js';
// TODO:  update to install in all platforms + cygwin + mingw + msys2
const cmds = [];

// Detect what dependencies are missing.
const dependencies = ['autoconf', 'automake', 'build-essential', 'pkg-config', 'libtool'];
for (const cmd of dependencies) {
  try {
    useShell(`command -v ${cmd}`);
  } catch (error) {
    cmds.push(cmd);
  }
}

// Install missing dependencies
if (cmds.length !== 0) {
  if (process.platform === 'linux') {
    // Install dependencies on Linux
    useShell('apt-get update');
    useShell(`apt-get install -y ${cmds.join(' ')}`);
  } else if (process.platform === 'darwin') {
    // Install dependencies on macOS
    useShell(`brew install ${cmds.join(' ')}`);
  } else {
    console.error('Unsupported operating system');
  }
}
