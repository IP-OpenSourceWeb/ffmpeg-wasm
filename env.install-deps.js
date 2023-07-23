import { useShell } from './scripts/shell.functions.js';
// TODO:  update to install in all platforms + cygwin + mingw + msys2
const cmds = [];

// Detect what dependencies are missing.
const dependencies = ['autoconf', 'automake', 'build-essential', 'pkg-config', 'libtool', 'dos2unix'];
for (const cmd of dependencies) {
  console.log(`Checking ${cmd}...`);
  const { stdout, stderr } = await useShell(`command -v ${cmd}`);
  if (stderr) {
    console.log(`${stderr}...`);
    cmds.push(cmd);
  }
}

// Install missing dependencies
if (cmds.length !== 0) {
  if (process.platform === 'linux') {
    // Install dependencies on Linux
    await useShell('apt-get update');
    await useShell(`apt-get install -y ${cmds.join(' ')}`);
  } else if (process.platform === 'darwin') {
    // Install dependencies on macOS
    await useShell(`brew install ${cmds.join(' ')}`);
  } else {
    console.error('Unsupported operating system');
  }
}
