import { commandNames, packagesPath, repoDir } from '../env.packages.constants.js';
import { readEnv } from '../scripts/env.functions.js';
import { gitClone } from '../scripts/git.functions.js';
import { useShell } from '../scripts/shell.functions.js';

const env = await readEnv();

if (!env.version) await useShell(`nx run ${env.name}:${commandNames.package.updateVersion}`);
await gitClone(env.gitUrl, env.version, repoDir);
