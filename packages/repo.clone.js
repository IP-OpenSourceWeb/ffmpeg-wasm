import { gitClone } from '../scripts/git.functions.js';
import { readEnv } from '../scripts/env.functions.js';

const env = await readEnv();
await gitClone(env.gitUrl, env.version, env.gitPath);
