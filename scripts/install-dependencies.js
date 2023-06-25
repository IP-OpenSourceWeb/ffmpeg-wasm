import { execSync } from 'child_process';

const cmds = [];

// Detect what dependencies are missing.
const dependencies = ['autoconf', 'automake', 'build-essential', 'pkg-config', 'libtool'];
for (const cmd of dependencies) {
  try {
    execSync(`command -v ${cmd}`);
  } catch (error) {
    cmds.push(cmd);
  }
}

// Install missing dependencies
if (cmds.length !== 0) {
  if (process.platform === 'linux') {
    // Install dependencies on Linux
    execSync('apt-get update');
    execSync(`apt-get install -y ${cmds.join(' ')}`);
  } else if (process.platform === 'darwin') {
    // Install dependencies on macOS
    execSync(`brew install ${cmds.join(' ')}`);
  } else {
    console.error('Unsupported operating system');
  }
}
