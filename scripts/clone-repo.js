import { readFile } from './src/fs.functions.js';
import { gitClone } from './src/git.functions.js';

const env = JSON.parse(await readFile(`env.json`));
await gitClone(env.gitUrl, env.version, env.gitPath);
