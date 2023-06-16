// Move files from one directory to another using args from command line

const fs = require('fs-extra');

const src = process.argv?.find((arg) => arg.startsWith('--src='))?.split('=')?.[1];
const dest = process.argv?.find((arg) => arg.startsWith('--dest='))?.split('=')?.[1];

if (!src || !dest) {
  console.error('Please provide both --src and --dest arguments');
  process.exit(1);
}

try {
  fs.moveSync(src, dest, { overwrite: true });
} catch (err) {
  console.error(err);
}
