import { gitClone } from './src/git.functions.js';
import { readEnv } from './src/project.functions.js';

const env = await readEnv();
await gitClone(env.gitUrl, env.version, env.gitPath);
