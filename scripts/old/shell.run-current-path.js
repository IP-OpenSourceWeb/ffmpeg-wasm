import { useShellWithCurrentPath } from '../shell.functions.js';

const scriptToRun = process.argv[2];

useShellWithCurrentPath(`${scriptToRun}`);
